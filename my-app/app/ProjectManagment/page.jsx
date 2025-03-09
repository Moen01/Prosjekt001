import React from 'react';
import './ProjectManagment.css';
import ButtonNavigering from '../components/buttonNavigering/page';
import Box from '../components/box/page';

export default function ProsjektManagment() {
  return (
    <div className="project-managment">
      <div className="box-container">
        <div className="right-box">
        
          <Box>
          <ButtonNavigering route="/ProjectManagment/nyttProsjekt" label="Nytt Prosjekt" />
          </Box>
          
          <Box>
          <ButtonNavigering route="/ProjectManagment/openProsjekt" label="Åpne Prosjekt" />
          </Box>
          
          
        </div>
        <div className="left-box">
        <Box>
        <ButtonNavigering route="/ProjectManagment/prosess" label="Prosess" />
        </Box>
          

        </div>
      </div>
    </div> 
    
  );
}