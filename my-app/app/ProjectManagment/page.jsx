import React from 'react';
import './ProjectManagment.css';
import ButtonNavigering from '../components/buttonNavigering/page';
import Box from '../components/box/page';
import SplitterVertically from '../components/splitterVertically/page';

export default function ProsjektManagment() {
  return (
    <div className="project-managment">
      <div className="content-container">
        <Box>
          <ButtonNavigering route="/ProjectManagment/product" label="Product" />
        </Box>
        <SplitterVertically />
        <Box>
          <ButtonNavigering route="/ProjectManagment/familyFMEA" label="Family FMEA" />
        </Box>
      </div>
    </div>
  );
}