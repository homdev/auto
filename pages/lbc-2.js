import { useState } from 'react';
import axios from 'axios';

const API_KEY = 'fcc988283bmsh17e3dbff667ffc0p1719fcjsne20976da51e6'; // Remplacez par votre clé API RapidAPI
const BASE_URL = 'https://leboncoin1.p.rapidapi.com/v2/leboncoin/search';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const data = {
      filters: {
        category: { id: '2' },
        keywords: { text: searchTerm },
        enums: { ad_type: ['offer'] },
        brand: { name: 'Renault' }
      },
      limit: 5,
      offset: 0,
      sort_by: 'relevance',
      sort_order: 'desc',
      owner_type: 'all'
    };
  
    const options = {
      method: 'POST',
      url: 'https://leboncoin1.p.rapidapi.com/v2/leboncoin/search_api',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'leboncoin1.p.rapidapi.com'
      },
      data: JSON.stringify(data)
    };
  
    try {
      const response = await axios.request(options);
      setSearchResults(response.data.ads);
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Rechercher</button>
      <ul>
        {searchResults.map((result) => (
          <li key={result.id}>
            <p>{result.title}</p>
            <p>{result.price}</p>
            <p>{result.year}</p>
            <p>{result.mileage}</p>
            <p>{result.fuel_type}</p>
            <p>{result.gearbox_type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
