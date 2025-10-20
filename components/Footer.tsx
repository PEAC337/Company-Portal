
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
        <p>&copy; {currentYear} Our Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
