// import axios from 'axios';
// import cheerio from 'cheerio';
// import mongoose from 'mongoose';
// import ICO from './ico-model';

// const ICO_URLS = [
//   { url: 'https://icodrops.com/category/upcoming-ico/', status: 'upcoming' },
//   { url: 'https://icodrops.com/category/active-ico/', status: 'active' },
//   { url: 'https://icodrops.com/category/ended-ico/', status: 'inactive' },
// ];
// const UPDATE_INTERVAL_MS = 1000; // 24 heures en millisecondes

// // Connexion à la base de données MongoDB
// mongoose.connect('mongodb+srv://homdev:Homdev44*@cluster0.udkw9uq.mongodb.net/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Connected to MongoDB');
// });

// // Fonction qui scrappe une seule page et renvoie un tableau d'objets ICO
// async function scrapeICOPage(url) {
//   const response = await axios.get(url.url, { maxRedirects: 0 });
//   const $ = cheerio.load(response.data);
//   const newICOs = [];

//   $('.a_ico').each((i, el) => {
//     // Récupère les valeurs des attributs "rel" des différentes catégories de l'ICO
//     const kyc = $(el).find('.categ_one').attr('rel');
//     const kycValue = kyc ? kyc.split(': ')[1] : '';

//     const whitelist = $(el).find('.categ_three').attr('rel');
//     const whitelistValue = whitelist ? whitelist.split(': ')[1] : '';

//     const cantParticipate = $(el).find('.categ_two').attr('rel');
//     const cantParticipateValue = cantParticipate ? cantParticipate.split(': ')[1] : '';

//     const bounty = $(el).find('.categ_six').attr('rel');
//     const bountyValue = bounty ? bounty.split(': ')[1] : '';

//     // Récupère l'URL de l'image de l'ICO
//     const iconUrl = $(el).find('.ico-icon img').attr('src');

//       // Récupère la date de fin de l'ICO
//     const endDate = $(el).find('.date span[data-date]').attr('data-date');

//     // Récupère le montant reçu pour la levée de fonds
//     const raisedAmount = $(el).find('.raised .amount').text().trim();

//     // Ajoute l'ICO avec ses propriétés à la liste des ICOs
//     const newICO = new ICO({
//       name: $(el).find('.ico-main-info h3 a').text().trim(),
//       category: $(el).find('.ico-category-name').text().trim(),
//       description: $(el).find('.categ_desc_short').text().trim(),
//       start: $(el).find('.date').text().trim(),
//       end: endDate,
//       platform: $(el).find('.categ_type').text().trim(),
//       goal: $(el).find('.goal-in-card span').text().trim(),
//       raisedAmount: raisedAmount,
//       interest: $(el).find('.interest .nr').text().trim(),
//       kyc: kycValue,
//       whitelist: whitelistValue,
//       cant_participate: cantParticipateValue,
//       bounty: bountyValue,
//       iconUrl: iconUrl,
//       lastUpdated: Date.now(), // utiliser la date actuelle
//       status: url.status,
//     });

//     newICOs.push(newICO);
//   });

//   return newICOs;
// }

// async function cleanDatabase() {
//     try {
//       await ICO.deleteMany({});
//       console.log('Database cleaned');
//     } catch (error) {
//       console.error(error);
//     }
//   }
  
//   // Fonction principale pour récupérer les données ICO
//   export default async function handler(req, res) {
//       try {
//           // Vérifier si la mise à jour doit être forcée
//           const forceUpdate = req.query.forceUpdate === 'true';
          
//           console.log('Checking if ICO data exists in the database...');
//           const upcomingICOs = await ICO.find({});
//           const activeICOs = await ICO.find({ status: 'active' });
//           console.log(`Found ${upcomingICOs.length} upcoming ICOs and ${activeICOs.length} active ICOs in the database`);
  
//           // Vérifier si les données doivent être mises à jour
//           const now = Date.now();
//           const lastUpdated = upcomingICOs.length > 0 ? upcomingICOs[0].lastUpdated.getTime() : 0;
//           const shouldUpdate = forceUpdate || now - lastUpdated > UPDATE_INTERVAL_MS;
//           console.log(`Should the ICO data be updated? ${shouldUpdate}`);
  
//           if (shouldUpdate) {
//               console.log('Cleaning the database...');
//               await cleanDatabase();
//               console.log('Scraping ICO data...');
//               const newICOs = [];
  
//               for (const url of ICO_URLS) {
//                   const icos = await scrapeICOPage(url);
//                   newICOs.push(...icos);
//               }
  
//               if (newICOs.length > 0) {
//                   const session = await mongoose.startSession();
//                   session.startTransaction();
  
//                   try {
//                       await Promise.all(newICOs.map(ico => ico.validate()));
//                       await ICO.insertMany(newICOs);
  
//                       for (const ico of newICOs) {
//                           const startDate = new Date(ico.start);
//                           const endDate = new Date(ico.end);
//                           if (endDate < now) {
//                               ico.status = 'inactive';
//                           } else if (startDate > now) {
//                               ico.status = 'upcoming';
//                           } else {
//                               ico.status = 'active';
//                           }
//                       }
  
//                       await ICO.updateOne({}, { $set: { lastUpdated: now } });
  
//                       await session.commitTransaction();
//                       res.status(200).json({ upcomingICOs: newICOs });
//                   } catch (error) {
//                       await session.abortTransaction();
//                       console.error(error);
//                       res.status(500).json({ message: error.message });
//                   } finally {
//                       session.endSession();
//                   }
//               } else {
//                   res.status(200).json({ upcomingICOs });
//               }
//           } else {
//               res.status(200).json({ upcomingICOs });
//           }
//       } catch (error) {
//           console.error(error);
//           res.status(500).json({ message: error.message });
//       }
//   }
  