
import React from 'react';
import { CompanyLogo } from './icons/CompanyLogo';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <CompanyLogo className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800 tracking-tight">
              Our Company Portal
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
