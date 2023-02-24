const { webkit } = require('playwright');
const mongoose = require('mongoose');

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://homdev:Homdev44*@cluster0.udkw9uq.mongodb.net/lbc', { useNewUrlParser: true, useUnifiedTopology: true });

// Définition du schéma de données
const voitureSchema = new mongoose.Schema({
  titre: String,
  prix: String,
  annee: String,
  kilometrage: String,
  carburant: String,
  boite: String,
});

// Définition du modèle de données
const Voiture = mongoose.model('Voiture', voitureSchema);

// Fonction principale pour récupérer et stocker les données de la page Web
async function scrapLeBonCoin(pageCount = 1) {
  try {
    const browser = await webkit.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    for (let page = 1; page <= pageCount; page++) {
      await page.goto(`https://www.leboncoin.fr/voitures/offres/pays_de_la_loire/loire_atlantique/?p=${page}`, {
        waitUntil: 'networkidle'
      });

      const annonces = await page.$$('a[data-test-id="ad"]');

      const voiturePromises = annonces.map(async function (annonce) {
        const titre = await annonce.$eval('p[data-qa-id="aditem_title"]', el => el.innerText.trim());
        const prix = await annonce.$eval('span[data-test-id="Price"]', el => el.innerText.trim());
        const annee = await annonce.$eval('span:has-text("Année") + *', el => el.innerText.trim());
        const kilometrage = await annonce.$eval('span:has-text("km")', el => el.innerText.trim());
        const carburant = await annonce.$eval('span:has-text("Essence")', el => el.innerText.trim());
        const boite = await annonce.$eval('span:has-text("Manuelle")', el => el.innerText.trim());

        // Stockage de données dans la base de données MongoDB
        const voiture = new Voiture({
          titre,
          prix,
          annee,
          kilometrage,
          carburant,
          boite,
        });
        return voiture.save();
      });

      await Promise.all(voiturePromises);
    }

    console.log('Les données ont été récupérées et stockées dans la base de données.');
    await browser.close();
  } catch (error) {
    console.error(error);
  } finally {
    // Déconnexion de la base de données MongoDB
    mongoose.disconnect();
  }
}

const pageCount = 1; // Nombre de pages à extraire
scrapLeBonCoin(pageCount);
