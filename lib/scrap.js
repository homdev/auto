// Importer les modules de scraping pour les sites autoscout24 et lacentrale
const { autoScout24 } = require('./autoscout24');
const { laCentrale } = require('./lacentrale');
// Importer les fonctions nécessaires du module de base de données
const { saveCarToDatabase, removeDuplicateCars, getCarsForSite } = require('./database');

// Définir la fonction d'extraction de données
async function scrap() {
  try {
    // Extraire les voitures des deux sites
    const [autoscout24Cars, lacentraleCars] = await Promise.all([
      autoScout24(),
      laCentrale(),
    ]);

    // Enregistrer les voitures dans la base de données avec le nom du site
    await Promise.all([
      ...autoscout24Cars.map(car => saveCarToDatabase(car, 'autoscout24')),
      ...lacentraleCars.map(car => saveCarToDatabase(car, 'lacentrale')),
      console.log('ttttttttttt')
    ]);

    // Supprimer les doublons de voitures pour chaque site dans la base de données
    await Promise.all([
      removeDuplicateCars('autoscout24'),
      removeDuplicateCars('lacentrale'),
    ]);
  } catch (error) {
    console.error('Error scraping cars:', error);
  }
}

// Exporter la fonction d'extraction de données
module.exports = { scrap };
