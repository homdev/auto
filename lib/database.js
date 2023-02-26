const mongoose = require('mongoose');

let Car;

mongoose.connect('mongodb+srv://homdev:Homdev44*@cluster0.udkw9uq.mongodb.net/scraping', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (error) => {
  if (error) {
    console.error('Error connecting to MongoDB:', error);
  } else {
    console.log('Connected to MongoDB!');
  }
});

// Création du modèle de voiture
const carSchema = new mongoose.Schema({
  site: String,
  make: String,
  model: String,
  price: String,
  mileage: String,
  fuelType: String,
  year: String,
  horsepower: String,
  ownerCount: String,
  transmission: String
});

// Ajout d'un index unique sur les champs make, model, mileage, price et site
carSchema.index({ make: 1, model: 1, mileage: 1, price: 1, site: 1 }, { unique: true });

// Si le modèle de voiture existe déjà, on l'utilise, sinon on le crée
Car = mongoose.models.Car || mongoose.model('Car', carSchema);

// Fonction pour sauvegarder une voiture dans la base de données
async function saveCarToDatabase(car, site) {
  try {
    const newCar = new Car({ ...car, site });
    await newCar.save();
    console.log(`Car with make ${car.make}, model ${car.model}, and mileage ${car.mileage} from ${site} saved to database.`);
  } catch (error) {
    // Si l'erreur est liée à un doublon, on ignore l'erreur et on ne fait rien
    if (error.code === 11000) {
      console.log(`Car with make ${car.make}, model ${car.model}, ${car.mileage} and price ${car.price} from ${site} already exists in database.`);
    } else {
    console.error('Error saving car:', error);
    throw error;
    }
    }
    }
    
    // Fonction pour récupérer toutes les voitures de la base de données
    async function getAllCars(site) {
    try {
    const query = site ? { site } : {};
    const cars = await Car.find(query);
    console.log(`${cars.length} cars found in database`);
    return cars;
    } catch (error) {
    console.error('Error retrieving cars:', error);
    throw error;
    }
    }
    
    // Fonction pour supprimer les voitures en double dans la base de données
    async function removeDuplicateCars(site) {
      try {
        const query = site ? { site } : {};
        const duplicates = await Car.aggregate([
          {
            $match: query
          },
          {
            $group: {
              _id: {
                make: '$make',
                model: '$model',
                mileage: '$mileage',
                price: '$price',
                year: '$year',
                site: '$site'
              },
              dups: { $addToSet: '$_id' },
              count: { $sum: 1 }
            }
          },
          {
            $match: {
              count: { $gt: 1 }
            }
          }
        ]).exec();
    
        const removePromises = duplicates.map(async ({ dups }) => {
          dups.shift();
          const deletePromises = dups.map(dupId => Car.deleteOne({ _id: dupId }).exec());
          await Promise.all(deletePromises);
        });
    
        await Promise.all(removePromises);
        console.log(`${duplicates.length} duplicate cars removed from the database.`);
      } catch (error) {
        console.error('Error removing duplicate cars:', error);
        throw error;
      }
    }
    
    
    // Fonction pour récupérer toutes les voitures d'un site de la base de données
async function getCarsForSite(site) {
  try {
    const cars = await Car.find({ site });
    console.log(`${cars.length} cars found in database for site ${site}`);
    return cars;
  } catch (error) {
    console.error('Error retrieving cars:', error);
    throw error;
  }
}

module.exports = { saveCarToDatabase, getAllCars, removeDuplicateCars, getCarsForSite };