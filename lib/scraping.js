const playwright = require('playwright');
const cheerio = require('cheerio');
const { saveCarToDatabase, removeDuplicateCars } = require('./database');

async function scrap(maxPage) {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  for (let pageNumber = 1; pageNumber <= maxPage; pageNumber++) {
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
      const fuelType = article.find('.VehicleDetailTable_item__koEV4').eq(6).text();
      const year = article.find('.VehicleDetailTable_item__koEV4').eq(1).text();
      const horsepower = article.find('.VehicleDetailTable_item__koEV4').eq(2).text();
      const ownerCount = article.find('.VehicleDetailTable_item__koEV4').eq(4).text();
      const transmission = article.find('.VehicleDetailTable_item__koEV4').eq(5).text();
      cars.push({ price, mileage, make, model, fuelType, year, horsepower, ownerCount, transmission });
    });

    for (const car of cars) {
      try {
        await saveCarToDatabase(car);
      } catch (error) {
        console.error(`Error saving car to database: ${error}`);
      }
    }
  }

  await browser.close();
  await removeDuplicateCars();
}

scrap(20);
