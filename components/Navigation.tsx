import React, { useState, useEffect, useRef } from 'react';
import { RESOURCE_CATEGORIES } from '../data/resources';

interface NavigationProps {
  handleLinkClick: (event: React.MouseEvent<HTMLElement>, url: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ handleLinkClick }) => {
  const [activeSection, setActiveSection] = useState('hub');
  const supportLink = RESOURCE_CATEGORIES.flatMap(c => c.links).find(l => l.name === 'IT Support');

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
    // This observer callback is triggered when a section's visibility changes.
    // The rootMargin is configured to detect a section when it's in the middle
    // of the viewport, which feels more natural for active state tracking.
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(section => observer.current?.observe(section));

    return () => {
      sections.forEach(section => observer.current?.unobserve(section));
    };
  }, []);

  const navLinkClasses = (sectionId: string) => 
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 ${
      activeSection === sectionId 
        ? 'bg-amber-500 text-slate-900 shadow-md' 
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
    }`;

  return (
    <nav className="sticky top-20 z-20 bg-blue-950/80 backdrop-blur-md border-b border-slate-700 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14 space-x-4 sm:space-x-8">
          <a href="#hub" className={navLinkClasses('hub')}>
            Central Hub
          </a>
          <a href="#data-orrery" className={navLinkClasses('data-orrery')}>
            Data Orrery
          </a>
          <a href="#generative-tools" className={navLinkClasses('generative-tools')}>
            AI Tools
          </a>
          {supportLink && (
            <button
              onClick={(e) => handleLinkClick(e, supportLink.url)}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 text-slate-300 hover:bg-slate-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Support
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;