
import React from 'react';

export const CompanyLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15zM21 9.75H3v10.5a3 3 0 003 3h15a3 3 0 003-3V9.75z"
      clipRule="evenodd"
    />
  </svg>
);
