import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import { RESOURCE_CATEGORIES, ResourceCategory } from './data/resources';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResources, setFilteredResources] = useState<ResourceCategory[]>(RESOURCE_CATEGORIES);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResources(RESOURCE_CATEGORIES);
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();

    const filtered = RESOURCE_CATEGORIES
      .map(category => {
        // If the category name itself matches, keep the whole category
        if (category.category.toLowerCase().includes(lowercasedTerm)) {
          return category;
        }

        // Otherwise, filter links within the category
        const filteredLinks = category.links.filter(link =>
          link.name.toLowerCase().includes(lowercasedTerm) ||
          link.description.toLowerCase().includes(lowercasedTerm)
        );

        // Return a new category object with only the filtered links
        return { ...category, links: filteredLinks };
      })
      // Finally, remove any categories that have no links left
      .filter(category => category.links.length > 0);

    setFilteredResources(filtered);
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <MainContent resources={filteredResources} />
      <Footer />
    </div>
  );
};

export default App;