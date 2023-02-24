const { MongoClient } = require('mongodb');

async function saveCarsToDatabase(cars) {
  const uri = 'mongodb+srv://infinitydev4:Ruby44300az*@infinitydev.8b8tjf6.mongodb.net/webconcepter';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to database.');

    const database = client.db('webconcepter');
    const collection = database.collection('cars');
    console.log('Connected to database.');
    await collection.insertMany(cars);
    console.log(`${cars.length} cars saved to database.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = saveCarsToDatabase;
