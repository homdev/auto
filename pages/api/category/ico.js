import axios from 'axios';
import cheerio from 'cheerio';
import NodeCache from 'node-cache';
import ICO from './ico-model';
import db from './db';

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
      const kycValue = $(this).find('.categ_one').attr('rel')?.split(': ')[1];
      const whitelistValue = $(this).find('.categ_three').attr('rel')?.split(': ')[1];
      const cantParticipateValue = $(this).find('.categ_two').attr('rel')?.split(': ')[1];
      const bountyValue = $(this).find('.categ_six').attr('rel')?.split(': ')[1];
      const iconUrl = $(this).find('.ico-icon img').attr('src');
      const endDate = $(this).find('.ico-main-info a.ico-date').attr('href')?.match(/\d{4}-\d{2}-\d{2}/)?.[0];
  
      const existingICO = await ICO.findOne({ name: $(this).find('.ico-main-info h3 a').text().trim(), end: endDate });
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
          kyc: kycValue,
          whitelist: whitelistValue,
          cant_participate: cantParticipateValue,
          bounty: bountyValue,
          iconUrl: iconUrl,
          lastUpdated: Date.now(),
          status: url.status,
        });
        await newICO.save();
        console.log(`Added new ICO: ${newICO.name}`);
        newICOs.push(newICO);
      }
    }).get();
  
    await Promise.all(promises);
    return newICOs;
  }
  
  async function scrapeICO() {
    const promises = ICO_URLS.map(url => scrapeICOPage(url));
    const results = await Promise.all(promises);
    return results.flat();
  }
  
  // Usage :
  scrapeICO().then(newICOs => {
    // Utiliser les nouvelles ICOs
  }).catch(error => {
    console.error(error);
  });
  

async function cleanDatabase(lastUpdated) {
    try {
    await ICO.deleteMany({ lastUpdated: { $lt: lastUpdated } });
    console.log('Database cleaned');
    } catch (error) {
    console.error(error);
    }
    }
    
    export default async function handler(req, res) {
    try {
    const forceUpdate = req.query.forceUpdate === 'true';
    console.log('Checking if ICO data exists in the cache...');
    let upcomingICOs = cache.get('upcomingICOs');
    let activeICOs = cache.get('activeICOs');
    let inactiveICOs = cache.get('inactiveICOs');
    if (!upcomingICOs || !activeICOs || !inactiveICOs || forceUpdate) {
        console.log('Refreshing ICO data...');
        upcomingICOs = await ICO.find({ status: 'upcoming' });
        activeICOs = await ICO.find({ status: 'active' });
        inactiveICOs = await ICO.find({ status: 'inactive' });
      
        const newICOs = [];
        for (const url of ICO_URLS) {
          const icos = await scrapeICOPage(url);
          newICOs.push(...icos);
        }
      
        if (newICOs.length > 0) {
          const session = await mongoose.startSession();
          session.startTransaction();
      
          try {
            await Promise.all(newICOs.map(ico => ico.validate()));
            await ICO.insertMany(newICOs);
      
            for (const ico of newICOs) {
              const startDate = new Date(ico.start);
              const endDate = new Date(ico.end);
              if (endDate < now) {
                ico.status = 'inactive';
              } else if (startDate > now) {
                ico.status = 'upcoming';
              } else {
                ico.status = 'active';
              }
            }
      
            await ICO.updateOne({}, {
              $set: {
                lastUpdated: Date.now()
              }
            });
      
            await session.commitTransaction();
            cache.set('upcomingICOs', newICOs.filter(ico => ico.status === 'upcoming'));
            cache.set('activeICOs', newICOs.filter(ico => ico.status === 'active'));
            cache.set('inactiveICOs', newICOs.filter(ico => ico.status === 'inactive'));
            res.status(200).json({
              upcomingICOs: newICOs.filter(ico => ico.status === 'upcoming'),
              activeICOs: newICOs.filter(ico => ico.status === 'active'),
              inactiveICOs: newICOs.filter(ico => ico.status === 'inactive')
            });
          } catch (error) {
            await session.abortTransaction();
            console.error(error);
            res.status(500).json({
              message: error.message
            });
          } finally {
            session.endSession();
          }
        } else {
          cache.set('upcomingICOs', upcomingICOs);
          cache.set('activeICOs', activeICOs);
          cache.set('inactiveICOs', inactiveICOs);
          res.status(200).json({
            upcomingICOs,
            activeICOs,
            inactiveICOs
          });
        }
      } else {
        console.log('Retrieving ICO data from cache...');
        res.status(200).json({
          upcomingICOs,
          activeICOs,
          inactiveICOs
        });
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({
        message: error.message
        });
    }
}