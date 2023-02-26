const playwright = require('playwright');
const cheerio = require('cheerio');
const { saveCarToDatabase, removeDuplicateCars } = require('./database');

const selectors = {
  article: 'article',
  price: '.Price_price__WZayw',
  mileage: '.VehicleDetailTable_item__koEV4:eq(0)',
  make: 'article',
  model: 'article',
  fuelType: '.VehicleDetailTable_item__koEV4:eq(6)',
  year: '.VehicleDetailTable_item__koEV4:eq(1)',
  horsepower: '.VehicleDetailTable_item__koEV4:eq(2)',
  ownerCount: '.VehicleDetailTable_item__koEV4:eq(4)',
  transmission: '.VehicleDetailTable_item__koEV4:eq(5)',
};

async function autoScout24(maxPage) {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (let pageNumber = 1; pageNumber <= maxPage; pageNumber++) {
    await page.goto(`https://www.autoscout24.fr/lst?sort=standard&desc=0&cy=F&atype=C&ustate=N%2CU&damaged_listing=exclude&powertype=kw&page=${pageNumber}`);

    const html = await page.content();
    const $ = cheerio.load(html);

    const articles = $(selectors.article);
    const cars = [];
    articles.each((index, element) => {
      const article = $(element);
      const price = article.find(selectors.price).text().replace(/[^0-9]/g, '');
      const mileage = article.find(selectors.mileage).text().replace(/[^0-9]/g, '');
      const make = article.data('make');
      const model = article.data('model');
      const fuelType = article.find(selectors.fuelType).text();
      const year = article.find(selectors.year).text().replace(/[^0-9]/g, '');
      const horsepowerMatch = article.find(selectors.horsepower).text().match(/\((\d+)\s*CH\)/);
      const horsepower = horsepowerMatch ? horsepowerMatch[1] : null;
      const ownerCount = article.find(selectors.ownerCount).text().replace(/[^0-9]/g, '');
      const transmission = article.find(selectors.transmission).text();
      cars.push({ price, mileage, make, model, fuelType, year, horsepower, ownerCount, transmission });
    });

    for (const car of cars) {
      try {
        await saveCarToDatabase(car, 'autoScout24'); // spécification du site
      } catch (error) {
        console.error(`Error saving car to database: ${error}`);
      }
    }
  }

  await browser.close();
  await removeDuplicateCars('autoScout24'); // spécification du site
}

module.exports = { autoScout24 };
