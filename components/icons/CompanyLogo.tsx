import React from 'react';

// This component now renders an abstract orrery core icon.
export const CompanyLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5"/>
    <path d="M12 6a6 6 0 100 12 6 6 0 000-12z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.75"/>
    <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
