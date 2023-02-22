import { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import nextArrowIcon from '@assets/images/icons/next-arrow.png';
import ProjectCard from '../ProjectCard/ProjectCard';
import ProjectItemsStyleWrapper from './ProjectItems.style';
import axios from 'axios';

const ProjectItems = () => {
  const [icos, setIcos] = useState({ upcomingICOs: [], activeICOs: [], inactiveICOs: [] });

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/category/handler');
      setIcos(response.data);
    };
    fetchData();
  }, []);

  return (
    <ProjectItemsStyleWrapper>
      <div className="container">
        <div className="row">
          <ul className="menu-list">
            <li>Project name</li>
            <li>Chain</li>
            <li>Launched</li>
            <li>Total Raise</li>
            <li>Progress</li>
          </ul>
        </div>
        <div className="projects-row">
          <Tabs>
            <TabList>
              <div className="tab_btn_wrapper">
                {['upcoming', 'active', 'inactive'].map((status) => (
                  <Tab key={status}>
                    <button>{status}</button>
                  </Tab>
                ))}
              </div>
              <div className="item_sorting_list">
                <button>
                  All Access
                  <img src={nextArrowIcon.src} alt="icon" />
                  <ul className="sub-menu">
                    <li>All Access</li>
                    <li>Public</li>
                    <li>Private</li>
                    <li>Community</li>
                  </ul>
                </button>
                <button>
                  All Block Chain
                  <img src={nextArrowIcon.src} alt="icon" />
                  <ul className="sub-menu">
                    <li>Binance (BSC)</li>
                    <li>Ethereum (ETH)</li>
                    <li>Polygon</li>
                    <li>All Block Chain</li>
                  </ul>
                </button>
              </div>
            </TabList>
            {['upcoming', 'active', 'inactive'].map((status) => (
             <TabPanel key={status} className="row tabs-row" tabid={status}>
             {icos[`${status}ICOs`].length > 0 ? (
               icos[`${status}ICOs`].map((ico, i) => (
                 <div key={i} className="col-md-12">
                   <ProjectCard
                     name={ico.name}
                     iconUrl={ico.iconUrl}
                     category={ico.category}
                     start={ico.start}
                     end={ico.end}
                     goal={ico.goal}
                     raisedAmount={ico.raisedAmount}
                     interest={ico.interest}
                     status={ico.status}
                   />
                 </div>
               ))
             ) : (
               <div>Aucun projet disponible pour le moment.</div>
             )}
           </TabPanel>
            ))}
          </Tabs>
        </div>
      </div>
    </ProjectItemsStyleWrapper>
  );
};

export default ProjectItems;
