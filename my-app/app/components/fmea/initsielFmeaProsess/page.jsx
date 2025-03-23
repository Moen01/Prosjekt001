'use client';

import React, { useState } from 'react';
import './initsielFmeaProsess.css';

export default function InitsielFmeaProsess() {
  const [isExpanded, setIsExpanded] = useState(false); // Track if the rectangle is expanded

  const handleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expanded state
  };

  return (
    <div className="outer-rectangle">
      <div className="left-inner-rectangle"></div> {/* Left rectangle */}
      <div className={`inner-rectangle ${isExpanded ? 'expanded' : ''}`}>
        <div className="right-border" onClick={handleExpand}></div>
      </div>
    </div>
  );
}