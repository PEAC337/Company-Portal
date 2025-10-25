import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-950 mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <p>
          Copyright (c) {currentYear}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Morbi non lorem porttitor neque feugiat blandit. Ut vitae ipsum eget quam lacinia accumsan. 
          Etiam sed turpis ac ipsum condimentum fringilla. Maecenas magna. 
          Proin dapibus sapien vel ante. Aliquam erat volutpat. Pellentesque sagittis ligula eget metus. 
          Vestibulum commodo. Ut rhoncus gravida arcu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
