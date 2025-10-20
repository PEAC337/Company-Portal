
import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default App;
