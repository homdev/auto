// Importe les fonctions nécessaires du module de base de données
const { getCarsForSite, saveCarToDatabase, removeDuplicateCars } = require('../../lib/database');

// Importe les modules de scraping pour les sites autoscout24 et lacentrale
const { autoScout24 } = require('../../lib/autoscout24');
const { laCentrale } = require('../../lib/lacentrale');

// Définit la fonction de gestionnaire qui sera appelée par la route
export default async function handler(req, res) {
  try {
    const site = req.query.site;

    let cars;
    if (site === 'autoScout24') {
      // Scrape les voitures du site 1
      // cars = await autoScout24(20); // 10 est la valeur de maxPage
    } else if (site === 'laCentrale') {
      // Scrape les voitures du site 2
      // cars = await laCentrale(500); // 10 est la valeur de maxPage
    }

    if (cars) { // vérifie si cars est défini
      // Sauvegarde les voitures dans la base de données en indiquant le nom du site
      await Promise.all(cars.map(car => saveCarToDatabase(car, site)));

      // Supprime les voitures en double de la base de données pour le site
      await removeDuplicateCars(site);
    } else {
      console.error(`Erreur de scraping des voitures : ${site} a retourné undefined`);
    }

    // Récupère toutes les voitures pour le site depuis la base de données
    const carsForSite = await getCarsForSite(site);

    // Retourne les voitures pour le site au format JSON avec un code d'état de 200
    res.status(200).json(carsForSite);
  } catch (error) {
    console.error('Erreur de scraping des voitures :', error);
    // Retourne un message d'erreur au format JSON avec un code d'état de 500 en cas d'erreur
    res.status(500).json({ error: 'Une erreur s\'est produite lors du scraping des voitures.' });
  }
}
