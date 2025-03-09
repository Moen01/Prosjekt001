import React from 'react';
import "./box.css";

export default function Box( { children }) {
  return (
    <div className="box">
      {children}  
    </div>
  );
}