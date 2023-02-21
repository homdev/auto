import IGORankingStyleWrapper from "./IGORanking.style.js";
import React, { useState, useEffect } from "react";

function IGORanking() {
  const [upcomingICOs, setUpcomingICOs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/category/upcoming-ico");
      const data = await res.json();
      setUpcomingICOs(data.upcomingICOs);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFromDb = async () => {
      try {
        if (!dataFetched) {
          const data = await response.json();
          const now = Date.now();
          const lastUpdated = data.lastUpdated || 0;
          const shouldUpdate = now - lastUpdated > 24 * 60 * 60 * 1000; // Update once a day
          if (!shouldUpdate) {
            setUpcomingICOs(data.upcomingICOs);
            setIsLoading(false);
            setDataFetched(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };   
  }, [dataFetched]);

  return (
    <IGORankingStyleWrapper>
      <div className="container">
        <div className="ranking_list">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            upcomingICOs.map((ico, i) => (
              <ul key={i} className="ranking_list_item">
                <li data-title="#Ranks">{i + 1}</li>
                <li data-title="Icons">
                  <span className="coin_icon">
                    <img className="icon-project" src={ico.iconUrl} alt={`${ico.name} icon`} />
                  </span>
                </li>
                <li data-title="Name">{ico.name}</li>
                <li data-title="Category">{ico.category}</li>
                <li data-title="Description">{ico.description}</li>
                <li data-title="Start Date">{ico.start}</li>
                <li data-title="Platform">{ico.platform}</li>
                <li data-title="Goal">{ico.goal}</li>
              </ul>
            ))
          )}
        </div>
      </div>
    </IGORankingStyleWrapper>
  );
}

export default IGORanking;