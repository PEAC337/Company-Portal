import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-950 mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <p className="mb-2">&copy; {currentYear} U.S. Ministry. All rights reserved.</p>
        <p>Copyrights and Intellectual property rights inclusive per the U.S. Ministry of Defense Armed Forces.</p>
      </div>
    </footer>
  );
};

export default Footer;