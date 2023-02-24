const mongoose = require('mongoose');
let Car;

mongoose.connect('mongodb+srv://infinitydev4:Ruby44300az*@infinitydev.8b8tjf6.mongodb.net/webconcepter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false
}, (error) => {
  if (error) {
    console.error('Error connecting to MongoDB:', error);
  } else {
    console.log('Connected to MongoDB!');
  }
});

if (mongoose.models.Car) {
  // le modèle a déjà été défini
  Car = mongoose.model('Car');
} else {
  // définir le modèle
  const carSchema = new mongoose.Schema({
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
  Car = mongoose.model('Car', carSchema);
}

async function saveCarToDatabase(car) {
  try {
    const existingCar = await Car.findOne({ make: car.make, model: car.model, mileage: car.mileage, price: car.price });
    if (existingCar) {
      console.log(`Car with make ${car.make}, model ${car.model}, ${car.mileage} and price ${car.price} already exists in database.`);
      return; // Do not insert the car if it already exists
    }
    const newCar = new Car(car);
    await newCar.save();
    console.log(`Car with make ${car.make}, model ${car.model}, and mileage ${car.mileage} saved to database.`);
  } catch (error) {
    console.error('Error saving car:', error);
    throw error;
  }
}

async function getAllCars() {
  try {
    const cars = await Car.find({});
    console.log(`${cars.length} cars found in database.`);
    return cars;
  } catch (error) {
    console.error('Error retrieving cars:', error);
    throw error;
  }
}

async function removeDuplicateCars() {
  try {
    const duplicates = await Car.aggregate([
      {
        $group: {
          _id: {
            make: '$make',
            model: '$model',
            mileage: '$mileage',
            price: '$price',
            year: '$year',
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
      const deletePromises = dups.map(dupId => Car.deleteOne({ _id: dupId }));
      await Promise.all(deletePromises);
    });

    await Promise.all(removePromises);
    console.log(`${duplicates.length} duplicate cars removed from the database.`);
  } catch (error) {
    console.error('Error removing duplicate cars:', error);
    throw error;
  }
}

module.exports = { saveCarToDatabase, getAllCars, removeDuplicateCars };
