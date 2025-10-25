import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-950 mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <p>
          © {currentYear} Arcane Data Visualizations. All rights reserved.
        </p>
        <p className="mt-2 text-xs text-gray-500">
          This is a fictional visualization. Data shown is for demonstration purposes only.
        </p>
      </div>
    </footer>
  );
};

export default Footer;