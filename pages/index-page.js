import { useState, useEffect, useCallback } from 'react';
import styles from '../styles/ScrapPage.module.css';

function ScrapComponent() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCars = useCallback(async () => {
    setIsLoading(true);
    const response1 = await fetch('/api/scrap?site=autoScout24');
    const response2 = await fetch('/api/scrap?site=laCentrale');
    const data1 = await response1.json();
    const data2 = await response2.json();
    const carsWithSite = data1.map(car => ({ ...car, site: 'autoScout24' })).concat(data2.map(car => ({ ...car, site: 'laCentrale' })));
    setCars(carsWithSite);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return (
    <div>
      <div className={styles['table-container']}>
        <h2>Toutes les voitures</h2>
        {isLoading && <div className={styles.loader}>Loading...</div>}
        <table>
          <thead>
            <tr>
              <th>Site</th>
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
                <td>{car.site}</td>
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
    </div>
  );
}

export default ScrapComponent;
