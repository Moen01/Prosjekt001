'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation'; // Hook to access query parameters
import './newFamily.css';
import InitsielFmeaProsess from './components/initsielFmeaProcses/page';

export default function NewFamilyPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get('title'); // Extract the title from the query parameters
    
  return (
    <div>
      
      <InitsielFmeaProsess title={title} /> {/* Pass the title as a prop */}
    </div>
  );
}