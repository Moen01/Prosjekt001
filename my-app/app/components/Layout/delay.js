import React from "react";

export default async function Delay() {
    // Simulate a 2-second delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    return (
      <div>
        
        <h1>Welcome to the Home Page!</h1>
      
      </div>
    );
  }
