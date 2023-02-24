import axios from 'axios';
import cheerio from 'cheerio';
import NodeCache from 'node-cache';
import ICO from './ico-model';
import db from './db';
import cron from 'node-cron';

const ICO_URLS = [
  { url: 'https://icodrops.com/category/upcoming-ico/', status: 'upcoming' },
  { url: 'https://icodrops.com/category/active-ico/', status: 'active' },
  { url: 'https://icodrops.com/category/ended-ico/', status: 'inactive' },
];

const UPDATE_INTERVAL_MS = 1000; // 24 heures en millisecondes
const cache = new NodeCache({ stdTTL: UPDATE_INTERVAL_MS / 1000 });

async function scrapeICOPage(url) {
  const response = await axios.get(url.url, { maxRedirects: 0 });
  const $ = cheerio.load(response.data);
  const newICOs = [];

  const promises = $('.a_ico').map(async function (i, el) {
    const kycValue = $(this).find('.categ_one').attr('rel') ?? '';
    const whitelistValue = $(this).find('.categ_three').attr('rel') ?? '';
    const cantParticipateValue = $(this).find('.categ_two').attr('rel') ?? '';
    const bountyValue = $(this).find('.categ_six').attr('rel') ?? '';
    const iconUrl = $(this).find('.ico-icon img').attr('src');
    const endDate = $(this).find('.ico-main-info a.ico-date').attr('href')?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
    const existingICO = await ICO.findOneAndUpdate({ name: $(this).find('.ico-main-info h3 a').text().trim(), end: endDate });
    if (!existingICO) {
      const raisedAmount = $(this).find('.raised .amount').text().trim();

      const newICO = new ICO({
        name: $(this).find('.ico-main-info h3 a').text().trim(),
        category: $(this).find('.ico-category-name').text().trim(),
        description: $(this).find('.categ_desc_short').text().trim(),
        start: $(this).find('.date').text().trim(),
        end: endDate,
        platform: $(this).find('.categ_type').text().trim(),
        goal: $(this).find('.goal-in-card span').text().trim(),
        raisedAmount: raisedAmount,
        interest: $(this).find('.interest .nr').text().trim(),
        kyc: kycValue.split(': ')[1] ?? '',
        whitelist: whitelistValue.split(': ')[1] ?? '',
        cant_participate: cantParticipateValue.split(': ')[1] ?? '',
        bounty: bountyValue.split(': ')[1] ?? '',
        iconUrl: iconUrl,
        lastUpdated: Date.now(),
        status: url.status,
      });
      await newICO.save();
      console.log(`Added new ICO: ${newICO.name}`);
      newICOs.push(newICO);
    }
  }).get();

  await Promise.allSettled(promises);
  return newICOs;
}

async function scrapeICO() {
  const promises = ICO_URLS.map(url => scrapeICOPage(url));
  const results = await Promise.allSettled(promises);
  return results.flatMap(result => result.status === 'fulfilled' ? result.value : []);

}

async function cleanDatabase(lastUpdated) {
try {
await ICO.deleteMany({ lastUpdated: { $lt: lastUpdated } });
console.log('Database cleaned');
} catch (error) {
console.error('Failed to clean database: ${error.message}');
}
}

async function updateCacheAndDB() {
try {
console.log('Refreshing ICO data...');
const newICOs = await scrapeICO();
if (newICOs.length > 0) {
  const session = await db.startSession();
  session.startTransaction();

  try {
    await Promise.all(newICOs.map(ico => ico.validate()));
    await ICO.insertMany(newICOs);

    const now = Date.now();
    for (const ico of newICOs) {
      const startDate = new Date(ico.start);
      const endDate = new Date(ico.end);
      ico.status =
        endDate < now ? 'inactive' :
        startDate > now ? 'upcoming' : 'active';
    }

    await ICO.updateOne({}, {
      $set: {
        lastUpdated: now,
      },
    });

    await session.commitTransaction();
    cache.set('upcomingICOs', newICOs.filter(ico => ico.status === 'upcoming'));
    cache.set('activeICOs', newICOs.filter(ico => ico.status === 'active'));
    cache.set('inactiveICOs', newICOs.filter(ico => ico.status === 'inactive'));
  } catch (error) {
    await session.abortTransaction();
    console.error(`Failed to add new ICOs: ${error.message}`);
  } finally {
    session.endSession();
  }
}
} catch (error) {
  console.error('Failed to update cache and DB: ${error.message}');
  }
  }
  
  // Mettre à jour la cache et la DB toutes les 24 heures
  cron.schedule(`*/${UPDATE_INTERVAL_MS / 1000} * * * *`, () => {
  updateCacheAndDB();
  });
  
  // Endpoint pour récupérer les données ICO
  // Endpoint pour récupérer les données ICO
export default async function handler(req, res) {
  try {
    const forceUpdate = req.query.forceUpdate === 'true';
    console.log('Checking if ICO data exists in the cache...');
    let upcomingICOs = cache.get('upcomingICOs');
    let activeICOs = cache.get('activeICOs');
    let inactiveICOs = cache.get('inactiveICOs');
    if (!upcomingICOs || !activeICOs || !inactiveICOs || forceUpdate) {
      console.log('Retrieving ICO data from DB...');
      upcomingICOs = await ICO.find({ status: 'upcoming' });
      activeICOs = await ICO.find({ status: 'active' });
      inactiveICOs = await ICO.find({ status: 'inactive' });
      cache.set('upcomingICOs', upcomingICOs);
      cache.set('activeICOs', activeICOs);
      cache.set('inactiveICOs', inactiveICOs);
    } else {
      console.log('Retrieving ICO data from cache...');
    }
    res.status(200).json({
      upcomingICOs,
      activeICOs,
      inactiveICOs,
    });
  } catch (error) {
    console.error(`Failed to handle request: ${error.message}`);
    res.status(500).json({
      message: error.message,
    });
  }

  cron.schedule(`0 0 */${UPDATE_INTERVAL_MS / (1000 * 60 * 60)} * * *`, () => {
    cleanDatabase(Date.now() - UPDATE_INTERVAL_MS);
  });
}
