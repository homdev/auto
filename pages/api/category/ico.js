import axios from 'axios';
import cors from 'cors';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
import ICO from './ico-model';
import db from './db';

const ICO_URLS = [
  { url: 'https://icodrops.com/category/upcoming-ico/', status: 'upcoming' },
  { url: 'https://icodrops.com/category/active-ico/', status: 'active' },
  { url: 'https://icodrops.com/category/ended-ico/', status: 'inactive' },
];
const UPDATE_INTERVAL_MS = 1000; // 24 heures en millisecondes

async function scrapeICOPage(url) {
  const response = await axios.get(url.url, { maxRedirects: 0 });
  const $ = cheerio.load(response.data);
  const newICOs = [];

  $('.a_ico').each(function (i, el) {
    const kycValue = $(this).find('.categ_one').attr('rel')?.split(': ')[1];
    const whitelistValue = $(this).find('.categ_three').attr('rel')?.split(': ')[1];
    const cantParticipateValue = $(this).find('.categ_two').attr('rel')?.split(': ')[1];
    const bountyValue = $(this).find('.categ_six').attr('rel')?.split(': ')[1];
    const iconUrl = $(this).find('.ico-icon img').attr('src');
    const endDate = $(this).find('.ico-main-info a.ico-date').attr('href')?.match(/\d{4}-\d{2}-\d{2}/)?.[0];


    ICO.findOne({ name: $(this).find('.ico-main-info h3 a').text().trim(), end: endDate })
      .then(existingICO => {
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
            newICO.save()
            .then(savedICO => {
              console.log(`Added new ICO: ${savedICO.name}`);
              newICOs.push(savedICO);
            })
            .catch(error => console.error(error));
        }
      })
      .catch(error => console.error(error));
    });

    return newICOs;
    }
    
    async function cleanDatabase(lastUpdated) {
    try {
    await ICO.deleteMany({ lastUpdated: { $lt: lastUpdated } });
    console.log('Database cleaned');
    } catch (error) {
    console.error(error);
    }
    }
    
    export default async function handler(req, res) {
        // Call cors with options and assign the returned function to a variable
        try {
          const forceUpdate = req.query.forceUpdate === 'true';
          console.log('Checking if ICO data exists in the database...');
          const upcomingICOs = await ICO.find({status: 'upcoming'});
          const activeICOs = await ICO.find({ status: 'active' });
          const inactiveICOs = await ICO.find({ status: 'inactive' }); // Ajout de cette ligne pour définir inactiveICOs
          console.log(`Found ${upcomingICOs.length} upcoming ICOs and ${activeICOs.length} active ICOs in the database`);
      
          const now = Date.now();
          const lastUpdated = upcomingICOs.length > 0 ? upcomingICOs[0].lastUpdated.getTime() : 0;
          const shouldUpdate = forceUpdate || now - lastUpdated > UPDATE_INTERVAL_MS;
          console.log(`Should the ICO data be updated? ${shouldUpdate}`);
          
          if (shouldUpdate) {
            console.log('Cleaning the database...');
            await cleanDatabase(now);
            console.log('Scraping ICO data...');
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
                    lastUpdated: now
                  }
                });
          
                await session.commitTransaction();
                res.status(200).json({
                  upcomingICOs: newICOs,
                  activeICOs: activeICOs,
                  inactiveICOs: inactiveICOs
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
              res.status(200).json({
                upcomingICOs: upcomingICOs,
                activeICOs: activeICOs,
                inactiveICOs: inactiveICOs
              });
            }
          } else {
            res.status(200).json({
              upcomingICOs: upcomingICOs,
              activeICOs: activeICOs,
              inactiveICOs: inactiveICOs
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({
            message: error.message
          });
        }
      }
      