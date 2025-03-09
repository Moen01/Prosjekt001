'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './buttonNavigering.css';


export default function ButtonNavigering({ route, label }) {
  const router = useRouter();
  
    const handleClick = () => {
        router.push(route);
    }

  return (
    <button className="button-navigering" onClick={handleClick}>
        {label}
    </button>
  );
};
