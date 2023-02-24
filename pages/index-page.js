import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/ScrapPage.module.css';


function ScrapComponent() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [carCount, setCarCount] = useState(0);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch('/api/scrap');
    const data = await response.json();
    setCars(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    async function fetchCarCount() {
      const response = await fetch('/api/scrap');
      const data = await response.json();
      setCarCount(data.count);
    }

    fetchCarCount();
  }, []);

  return (
    <div className={styles['table-container']}>
      {isLoading && <div className={styles.loader}>Loading...</div>}
      <table>
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Prix</th>
            <th>Kilométrage</th>
            <th>Années</th>
            <th>Puissance</th>
            <th>Carburant</th>
            <th>Nb Propriétaire</th>
            <th>Transmission</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={index}>
              <td>{car.make}</td>
              <td>{car.model}</td>
              <td>{car.price}</td>
              <td>{car.mileage}</td>
              <td>{car.year}</td>
              <td>{car.horsepower}</td>
              <td>{car.fuelType}</td>
              <td>{car.ownerCount}</td>
              <td>{car.transmission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScrapComponent;
