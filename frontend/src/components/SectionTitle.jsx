import React from 'react';
import { colors, font } from '../styles/designSystem';



const SectionTitle = ({ subtitle, title }) => {
  return (
    <div className="mb-8">
      <p className="text-black text-sm font-medium mb-3">{subtitle}</p>
      <div className="flex items-center">
        <div className="w-10 h-1 bg-orange-300 rounded mr-3" aria-hidden="true"></div>
        <h2 className="text-orange-400 text-3xl font-bold">{title}</h2>
      </div>
    </div>
  );
};


export default SectionTitle;
