// pages/api/scrap.js


import { getAllCars } from '../../lib/database';

export default async function handler(req, res) {
  try {
    const cars = await getAllCars();
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error retrieving cars:', error);
    res.status(500).json({ error: 'An error occurred while retrieving cars.' });
  }
}
