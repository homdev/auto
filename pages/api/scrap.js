const { scrapAndSave } = require('../../lib/scraping');

export default async function handler(req, res) {
  const { page, perPage } = req.query;

  const cars = await scrapAndSave(3); // scrape 3 pages and save to database

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const carsOnPage = cars.slice(start, end);

  res.status(200).json(carsOnPage);
}
