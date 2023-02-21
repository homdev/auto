import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from '@components/progressBar';
import CardHover from '@components/cardHover';
import ProjectCardStyleWrapper from './ProjectCard.style';

const ProjectCard = () => {
  const [icoData, setIcoData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/category/upcoming-ico');
      const data = await response.json();
      setIcoData(data.upcomingICOs);
    }
    fetchData();
  }, []);

  function extractPercentage(goal) {
    const match = goal.match(/\d+(?:\.\d+)?%/);
    if (match) {
      const percentage = parseFloat(match[0]);
      if (!isNaN(percentage)) {
        return percentage;
      }
    }
    return '';
  }

  return (
    <ProjectCardStyleWrapper>
      {icoData.map((item) => (
        <div className="previous-item hover-shape-border hover-shape-inner" key={item._id}>
          <div className="previous-gaming">
            <div className="previous-image">
              <img src={item.iconUrl} alt="Previous item thumb" />
            </div>
            <div className="previous-price">
              <h4 className="mb-10">
                <Link href="/projects-details-1">{item.name}</Link>
              </h4>
              <div className="dsc">PRICE
               = {item.goal} BUSD</div>
            </div>
          </div>
          <div className="previous-chaining">
            <img src={item.iconUrl} alt="Chain icon" />
            <span>{item.start} days ago</span>
          </div>
          <div className="previous-raise">
            <span>
            {item.interest} BUSD ({extractPercentage(item.goal)}
            </span>
            <ProgressBar progress={extractPercentage(item.goal)} />
          </div>
          <CardHover />
        </div>
      ))}
    </ProjectCardStyleWrapper>
  );
};

export default ProjectCard;
