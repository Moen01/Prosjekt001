import React from 'react';
import ButtonNavigering from '../../components/buttonNavigering/page';
import Box from '../../components/box/page';
import './openProsjekt.css';

export default function OpenProsjekt() {
  return (
    <div className="open-prosjekt">
      <div className="box-container">
        <Box>
          <ButtonNavigering route="/someRoute" label="Button 1" />
        </Box>
        <Box>
          <ButtonNavigering route="/someRoute" label="Button 2" />
        </Box>
        <Box>
          <ButtonNavigering route="/someRoute" label="Button 3" />
        </Box>
        <Box>
          <ButtonNavigering route="/someRoute" label="Button 4" />
        </Box>
        <Box>
          <ButtonNavigering route="/someRoute" label="Button 5" />
        </Box>
        <Box>
          <ButtonNavigering route="/someRoute" label="Button 6" />
        </Box>
      </div>
    </div>
  );
}