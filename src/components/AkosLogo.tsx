import React from 'react';
import akosLogo from '../assets/akos-logo.jpg';

export const AkosLogo: React.FC = () => (
  <div className="flex items-center gap-4">
    <img 
      src={akosLogo}
      alt="AKOS Logo"
      className="h-12"
    />
    <span className="text-[#FF0000] text-xl font-bold whitespace-nowrap tracking-wider">
      KINÉSITHÉRAPIE DU SPORT | OSTÉOPATHIE
    </span>
  </div>
);