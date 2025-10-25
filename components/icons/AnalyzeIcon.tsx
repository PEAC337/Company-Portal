import React from 'react';

export const AnalyzeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props} 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
      transform="translate(-4, -4) scale(0.8)" 
    />
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" stroke="none" fill="currentColor" fillOpacity="0.1" />
  </svg>
);