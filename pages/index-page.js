import { useState, useEffect } from 'react';
import styles from '../styles/ScrapPage.module.css';

function ScrapComponent() {
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/scrap?page=${page}&perPage=${perPage}`);
      const data = await response.json();
      setCars(data);
    }
    fetchData();
  }, [page, perPage]);

  const pageCount = Math.ceil(cars.length / perPage);

  return (
    <div className={styles['table-container']}>
      <table>
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Prix</th>
            <th>Kilométrage</th>
          </tr>
        </thead>
        <tbody>
          {cars.slice((page - 1) * perPage, page * perPage).map((car, index) => (
            <tr key={index}>
              <td>{car.make}</td>
              <td>{car.model}</td>
              <td>{car.price}</td>
              <td>{car.mileage}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {Array.from(Array(pageCount).keys()).map((pageNumber) => (
          <button key={pageNumber} onClick={() => setPage(pageNumber + 1)}>{pageNumber + 1}</button>
        ))}
      </div>
    </div>
  );
}

export default ScrapComponent;
