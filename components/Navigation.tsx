import React, { useState, useEffect, useRef } from 'react';
import { ResourceCategory } from '../data/resources';
import { DriveIcon } from './icons/DriveIcon';
import { DocsIcon } from './icons/DocsIcon';
import { SlackIcon } from './icons/SlackIcon';
import { DesignIcon } from './icons/DesignIcon';
import { PolicyIcon } from './icons/PolicyIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { TrainingIcon } from './icons/TrainingIcon';
import { FmcsaIcon } from './icons/FmcsaIcon';
import { UsmobileIcon } from './icons/UsmobileIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface NavigationProps {
  handleLinkClick: (event: React.MouseEvent<HTMLElement>, url: string) => void;
  resources: ResourceCategory[];
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  drive: DriveIcon,
  docs: DocsIcon,
  slack: SlackIcon,
  design: DesignIcon,
  policy: PolicyIcon,
  calendar: CalendarIcon,
  training: TrainingIcon,
  fmcsa: FmcsaIcon,
  usmobile: UsmobileIcon,
  default: ExternalLinkIcon,
};

const Navigation: React.FC<NavigationProps> = ({ handleLinkClick, resources }) => {
  const [activeSection, setActiveSection] = useState('data-orrery');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    
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
          <a href="#data-orrery" className={navLinkClasses('data-orrery')}>
            Data Orrery
          </a>
          <a href="#generative-tools" className={navLinkClasses('generative-tools')}>
            AI Tools
          </a>
          <div 
            className="relative"
            onMouseEnter={() => setIsMenuOpen(true)}
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 ${isMenuOpen ? 'bg-slate-700/50 text-white' : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'}`}>
              Resources
            </button>

            {isMenuOpen && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-5xl"
              >
                <div 
                  className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 opacity-0 -translate-y-2 animate-fade-in-up"
                  style={{ animationFillMode: 'forwards' }}
                >
                  {resources.map(category => (
                    <div key={category.category}>
                      <h3 className="font-brand text-lg text-amber-400 mb-4 tracking-wider">{category.category}</h3>
                      <ul className="space-y-4">
                        {category.links.map(link => {
                          const Icon = iconMap[link.icon || 'default'];
                          return (
                            <li key={link.name}>
                              <button 
                                onClick={(e) => handleLinkClick(e, link.url)}
                                className="flex items-start space-x-3 text-left text-slate-300 hover:text-amber-400 transition-colors group w-full focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md p-1 -m-1"
                              >
                                <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-slate-500 group-hover:text-amber-400 transition-colors" />
                                <div>
                                  <p className="font-semibold leading-tight">{link.name}</p>
                                  <p className="text-xs text-slate-400 mt-1">{link.description}</p>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
