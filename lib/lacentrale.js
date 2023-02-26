const axios = require('axios');
const cheerio = require('cheerio');
const { saveCarToDatabase, removeDuplicateCars } = require('./database');

const baseUrl = 'https://www.lacentrale.fr/listing?makesModelsCommercialNames=&options=';

const selectors = {
  car: '.searchCard',
  make: '.Vehiculecard_Vehiculecard_title',
  model: '.Vehiculecard_Vehiculecard_subTitle',
  year: '.Vehiculecard_Vehiculecard_characteristicsItems:eq(0)',
  mileage: '.Vehiculecard_Vehiculecard_characteristicsItems:eq(1)',
  transmission: '.Vehiculecard_Vehiculecard_characteristicsItems:eq(2)',
  fuelType: '.Vehiculecard_Vehiculecard_characteristicsItems:eq(3)',
  price: '.Vehiculecard_Vehiculecard_price',
  location: '.Vehiculecard_Vehiculecard_city',
};

async function laCentrale(maxPage) {
  const cars = [];

  for (let pageNumber = 1; pageNumber <= maxPage; pageNumber++) {
    const response = await axios.get(`${baseUrl}&page=${pageNumber}`);
    const $ = cheerio.load(response.data);

    $(selectors.car).each((index, element) => {
      const car = $(element);
      const make = car.find(selectors.make).text().trim();
      const model = car.find(selectors.model).text().trim();
      const year = car.find(selectors.year).text().trim();
      const mileage = car.find(selectors.mileage).text().trim().replace(/\s/g, '');
      const transmission = car.find(selectors.transmission).text().trim();
      const fuelType = car.find(selectors.fuelType).text().trim();
      const price = car.find(selectors.price).text().trim().replace(/\s/g, '').replace('€', '');
      const location = car.find(selectors.location).text().trim();

      cars.push({
        make,
        model,
        year,
        mileage,
        transmission,
        fuelType,
        price,
        location,
      });
    });
  }

  for (const car of cars) {
    try {
      await saveCarToDatabase(car, 'laCentrale'); // spécification du site
    } catch (error) {
      console.error(`Error saving car to database: ${error}`);
    }
  }

  await removeDuplicateCars('laCentrale'); // spécification du site
}

module.exports = { laCentrale };
