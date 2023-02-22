import React from 'react';
import Link from 'next/link';
import ProgressBar from '@components/progressBar';
import CardHover from '@components/cardHover';
import ProjectCardStyleWrapper from './ProjectCard.style';

const ProjectCard = ({ name, iconUrl, category, start, end, goal, raisedAmount, interest, status }) => {


  function extractPercentage(goal) {
    const match = goal.match(/\d+(?:,\d+)*(?:\.\d+)?%/);
    if (match) {
      return match[0];
    }
    return '';
  }

  const cleanGoal = goal.replace(/\s*\d+(?:,\d+)*(?:\.\d+)?%$/, '');
  const progress = extractPercentage(goal);
  console.log('progress:', progress);
  
  return (
    <ProjectCardStyleWrapper>
      <div className="previous-item hover-shape-border hover-shape-inner">
        <div className="previous-gaming">
          <div className="previous-image">
            <img src={iconUrl} alt="Previous item thumb" />
          </div>
          <div className="previous-price">
            <h4 className="mb-10">
              <Link href="/projects-details-1">{name}</Link>
            </h4>
            <div className="dsc">{category}</div>
          </div>
        </div>
        <div className="previous-chaining">
        <div className="dsc">{start}</div>
        <div className="dsc">{status}</div>

        </div>
        <div className="previous-raise">
          <span>
            {raisedAmount} USD {cleanGoal}
          </span>
          <ProgressBar progress={progress} />
        </div>
        <CardHover />
      </div>
    </ProjectCardStyleWrapper>
  );
};


export default ProjectCard;
