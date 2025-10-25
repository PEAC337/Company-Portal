import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ConfirmationDialog from './components/ConfirmationDialog';
import { RESOURCE_CATEGORIES, ResourceCategory, ResourceLink } from './data/resources';

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState<ResourceCategory[]>(() => 
    JSON.parse(JSON.stringify(RESOURCE_CATEGORIES))
  );
  const [displayResources, setDisplayResources] = useState<ResourceCategory[]>(resources);
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

  // Simulate live status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setResources(prevResources => {
        const newResources = JSON.parse(JSON.stringify(prevResources));
        const allLinks: ResourceLink[] = newResources.flatMap((cat: ResourceCategory) => cat.links);
        
        if (allLinks.length > 0) {
          const randomIndex = Math.floor(Math.random() * allLinks.length);
          const randomLink = allLinks[randomIndex];
          
          const statuses: ResourceLink['status'][] = ['operational', 'degraded', 'outage'];
          const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];

          // Find and update the link in our new resources structure
          for (const category of newResources) {
            const link = category.links.find(l => l.url === randomLink.url);
            if (link) {
              link.status = nextStatus;
              break;
            }
          }
        }
        return newResources;
      });
    }, 5000); // Change a random service's status every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const debounceTimer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setDisplayResources(resources);
        setIsLoading(false);
        return;
      }

      const lowercasedTerm = searchTerm.toLowerCase();

      const filtered = resources
        .map(category => {
          if (category.category.toLowerCase().includes(lowercasedTerm)) {
            return category;
          }
          const filteredLinks = category.links.filter(link =>
            link.name.toLowerCase().includes(lowercasedTerm) ||
            link.description.toLowerCase().includes(lowercasedTerm)
          );
          return { ...category, links: filteredLinks };
        })
        .filter(category => category.links.length > 0);

      setDisplayResources(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, resources]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Navigation handleLinkClick={handleLinkClick} resources={RESOURCE_CATEGORIES} />
      <MainContent 
        resources={displayResources} 
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
