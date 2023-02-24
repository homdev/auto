const playwright = require('playwright');
const cheerio = require('cheerio');
const saveCarsToDatabase = require('../pages/api/models/saveCarsToDatabase');

async function scrap(pageNumber) {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`https://www.autoscout24.fr/lst?sort=standard&desc=0&cy=F&atype=C&ustate=N%2CU&damaged_listing=exclude&powertype=kw&page=${pageNumber}`);

  const html = await page.content();
  const $ = cheerio.load(html);

  const articles = $('article');
  const cars = [];
  articles.each((index, element) => {
    const article = $(element);
    const price = article.find('.Price_price__WZayw').text();
    const mileage = article.find('.VehicleDetailTable_item__koEV4').eq(0).text();
    const make = article.data('make');
    const model = article.data('model');
    cars.push({ price, mileage, make, model });
  });

  await browser.close();

  return cars;
}

async function scrapAndSave(maxPageNumber) {
  const cars = [];
  for (let i = 1; i <= maxPageNumber; i++) {
    const carsOnPage = await scrap(i);
    cars.push(...carsOnPage);
  }
  await saveCarsToDatabase(cars);
  console.log(`${cars.length} cars scraped and saved to database.`);

  return cars;
}

module.exports = { scrapAndSave };
