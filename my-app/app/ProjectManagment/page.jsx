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
          <p>Box 1</p>
         </Box>
        </div>
        <div className="left-box">
          <Box>
            <p>Box 2</p>
          </Box>
          <Box>
            <ButtonNavigering route="/main" label="Tilbake til hovedsiden" />
          </Box>
        </div>
      </div>
    </div> 
    
  );
}