import React from 'react';

// This component now renders the official seal image.
export const CompanyLogo: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ className, ...rest }) => (
  <img
    {...rest}
    className={`object-contain ${className || ''}`}
    src="https://i.ibb.co/hLqjC0F/The-United-States-Ministry-of-Defense.png"
    alt="The United States Ministry of Defense Seal"
  />
);