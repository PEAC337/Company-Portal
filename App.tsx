import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ConfirmationDialog from './components/ConfirmationDialog';
import { RESOURCE_CATEGORIES, ResourceCategory } from './data/resources';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResources, setFilteredResources] = useState<ResourceCategory[]>(RESOURCE_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);

  // State lifted from MainContent to be shared with Navigation
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  const handleLinkClick = (event: React.MouseEvent<HTMLElement>, url: string) => {
    event.preventDefault();
    setTargetUrl(url);
    setIsDialogOpen(true);
  };

  const handleConfirmNavigation = () => {
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
    setIsDialogOpen(false);
    setTargetUrl(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTargetUrl(null);
  };


  useEffect(() => {
    setIsLoading(true);

    // Debounce the search input: wait for the user to stop typing for 300ms
    // before triggering the filtering logic. This prevents excessive re-renders.
    const debounceTimer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredResources(RESOURCE_CATEGORIES);
        setIsLoading(false);
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
      setIsLoading(false);
    }, 300); // 300ms debounce delay

    // Cleanup function to clear the timer if the user types again
    // before the delay has passed.
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Navigation handleLinkClick={handleLinkClick} />
      <MainContent 
        resources={filteredResources} 
        isLoading={isLoading} 
        handleLinkClick={handleLinkClick}
      />
      <Footer />
      <Chatbot />
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmNavigation}
        url={targetUrl}
      />
    </div>
  );
};

export default App;