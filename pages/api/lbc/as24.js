const { chromium } = require('playwright');


module.exports = async function handler(req, res) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.autoscout24.fr/lst?sort=standard&desc=0&cy=F&atype=C&ustate=N%2CU&damaged_listing=exclude&powertype=kw&');

  const articles = await page.$$('article[data-guid]');

  const voiturePromises = articles.map(async function (article) {
    const titre = await article.$eval('.ListItem_title__znV2I h2', el => el.innerText.trim());
    const prix = await article.$eval('.Price_price__WZayw', el => el.innerText.trim());
    const annee = await article.$eval('.VehicleDetailTable_item__koEV4:nth-child(2)', el => el.innerText.trim());
    const kilometrage = await article.$eval('.VehicleDetailTable_item__koEV4:first-child', el => el.innerText.trim());
    const carburant = await article.$eval('.VehicleDetailTable_item__koEV4:last-child', el => el.innerText.trim());
    const boite = await article.$eval('.VehicleDetailTable_item__koEV4:nth-child(6)', el => el.innerText.trim());

    return {
      titre,
      prix,
      annee,
      kilometrage,
      carburant,
      boite,
    };
  });

  const voitures = await Promise.all(voiturePromises);

  console.log('Données récupérées: ', voitures);

  await browser.close();

  res.status(200).json({ voitures });
}
