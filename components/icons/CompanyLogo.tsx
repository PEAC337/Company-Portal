import React from 'react';

// This component now renders the official seal image.
export const CompanyLogo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img
    {...props}
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/United_States_Department_of_Defense_Seal.svg/200px-United_States_Department_of_Defense_Seal.svg.png"
    alt="U.S. Ministry of Defense Seal"
  />
);
