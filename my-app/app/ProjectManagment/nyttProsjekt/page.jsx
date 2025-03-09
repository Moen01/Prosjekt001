import React from 'react';
import ButtonNavigering from '../../components/buttonNavigering/page';
import Box from '../../components/box/page';
import './nyttProsjekt.css';

export default function OpenProsjekt() {
  return (
    <div className="open-prosjekt">
      <div className="box-container">
        
        <Box>
          <ButtonNavigering route="/main" label="Mal Prosjekt 1" />
        </Box>
        <Box>
          <ButtonNavigering route="/main" label="Mal Prosjekt 2" />
        </Box>
        <Box>
          <ButtonNavigering route="/main" label="Mal Prosjekt 3" />
        </Box>
        <Box>
          <ButtonNavigering route="/someRoute" label="Helt nytt Prosjekt +" />
        </Box>
        <Box>
          
        </Box>
        
      </div>
    </div>
  );
}