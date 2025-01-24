'use klient';
import React from "react";

export default function Delay() {
    // Simulate a 2-second delay
    new Promise((resolve) => setTimeout(resolve, 2000));
  
    return (
      <div>
        
        <h1>Welcome to the Home Page!</h1>
      
      </div>
    );
  }
