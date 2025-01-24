'use client';
import React, { useState }from 'react';
import './ffmea.css';


export default function Ffmea() {

    const [isActive, setIsActive] = useState(false);

    const toggleActive = () => {
        setIsActive(!isActive);
    }

    return (
        <div className="container">
        <h2>HELO</h2>
        <div className="square primary"></div>
        <div className={`square secondary ${isActive ? 'active' : ''} `}> </div>
        <button onClick={toggleActive}>Toggle Hover</button>
    </div> 

)};