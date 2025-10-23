
import React, { useState } from 'react';
import { CompanyLogo } from './icons/CompanyLogo';
import { SearchIcon } from './icons/SearchIcon';
import { CloseIcon } from './icons/CloseIcon';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-blue-950 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20">
          
          {/* Default Header View (Logo, Title, Desktop Search, Mobile Search Icon) */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onSearchChange(''); }}
            aria-label="U.S. Ministry Portal, go to homepage"
            className="flex items-center space-x-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-950 focus:ring-amber-500 rounded-lg p-1 -ml-1"
          >
            <CompanyLogo className="h-10 w-10 md:h-12 md:w-12" />
            <span className="font-brand text-xl md:text-2xl font-bold text-gray-100 tracking-wider">
              U.S. MINISTRY PORTAL
            </span>
          </a>

          <div className="flex items-center">
            {/* Desktop Search */}
            <div role="search" className="relative hidden md:block max-w-xs w-full ml-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search-desktop"
                name="search-desktop"
                className="block w-full bg-blue-900 border border-blue-700 rounded-md py-2 pl-10 pr-3 text-base text-gray-200 placeholder-gray-400 focus:outline-none focus:bg-blue-800 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Search resources..."
                type="search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search for resources"
                title="Search for company resources"
              />
            </div>

            {/* Mobile Search Icon Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full text-gray-300 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Open search"
              >
                <SearchIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <div
            role="search"
            className={`absolute top-0 left-0 w-full h-full bg-blue-950 px-4 items-center justify-center transition-opacity duration-300 md:hidden ${isSearchOpen ? 'flex opacity-100' : 'hidden opacity-0'}`}
          >
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="search-mobile"
                name="search-mobile"
                className="block w-full bg-blue-900 border border-blue-700 rounded-md py-2 pl-10 pr-3 text-base text-gray-200 placeholder-gray-400 focus:outline-none focus:bg-blue-800 focus:border-amber-500 focus:ring-amber-500"
                placeholder="Search resources..."
                type="search"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search for resources"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 ml-4 rounded-full text-gray-300 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Close search"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
