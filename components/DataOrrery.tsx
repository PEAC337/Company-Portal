import React, { useState } from 'react';
import { RESOURCE_CATEGORIES, ResourceCategory } from '../data/resources';

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
import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';

// This component renders an appropriate icon for a given resource link.
const ResourceIcon: React.FC<{ icon?: string }> = ({ icon }) => {
  const iconClasses = "h-8 w-8 text-slate-300 group-hover:text-amber-400 transition-colors duration-300";
  switch (icon) {
    case 'drive':
      return <DriveIcon className={iconClasses} />;
    case 'docs':
      return <DocsIcon className={iconClasses} />;
    case 'slack':
      return <SlackIcon className={iconClasses} />;
    case 'design':
      return <DesignIcon className={iconClasses} />;
    case 'policy':
      return <PolicyIcon className={iconClasses} />;
    case 'calendar':
      return <CalendarIcon className={iconClasses} />;
    case 'training':
      return <TrainingIcon className={iconClasses} />;
    case 'fmcsa':
      return <FmcsaIcon className={iconClasses} />;
    case 'usmobile':
      return <UsmobileIcon className={iconClasses} />;
    default:
      return <ExternalLinkIcon className={iconClasses} />;
  }
};


interface DataOrreryProps {
  resources: ResourceCategory[];
  handleLinkClick: (event: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}

const ORBIT_CONFIG: { radius: number; category: string; duration: string }[] = [
  { radius: 120, category: 'Core Infrastructure', duration: '70s' },
  { radius: 180, category: 'Collaboration & Comms', duration: '100s' },
  { radius: 240, category: 'Development & Design', duration: '140s' },
  { radius: 300, category: 'Operations & Compliance', duration: '190s' },
  { radius: 360, category: 'Accounts & Services', duration: '250s' },
];


const DataOrrery: React.FC<DataOrreryProps> = ({ resources, handleLinkClick }) => {
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const visibleLinkUrls = new Set(resources.flatMap(c => c.links.map(l => l.url)));

  const allLinks = RESOURCE_CATEGORIES.flatMap(category => 
    category.links.map(link => ({...link, category: category.category}))
  );

  return (
    <div className="relative w-full flex items-center justify-center my-12 orrery-container">
      {/* Central Hub */}
      <div className="absolute z-10 flex flex-col items-center text-center">
        <img src="https://i.ibb.co/hLqjC0F/The-United-States-Ministry-of-Defense.png" alt="Ministry Seal" className="w-24 h-24 drop-shadow-lg" />
        <h3 className="font-brand text-xl text-slate-300 mt-2 tracking-wider">DATA HUB</h3>
      </div>
      
      {/* Animation Control Button */}
      <button
        onClick={() => setIsAnimationPaused(!isAnimationPaused)}
        className="absolute z-20 top-0 right-0 p-2 text-slate-400 hover:text-white bg-slate-800/50 backdrop-blur-sm rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label={isAnimationPaused ? 'Play animation' : 'Pause animation'}
        title={isAnimationPaused ? 'Play animation' : 'Pause animation'}
      >
        {isAnimationPaused ? <PlayIcon className="h-6 w-6" /> : <PauseIcon className="h-6 w-6" />}
      </button>

      {/* Orbits Visuals */}
      {ORBIT_CONFIG.map(orbit => (
        <div
          key={orbit.category}
          className="absolute border border-slate-800 rounded-full"
          style={{
            width: orbit.radius * 2,
            height: orbit.radius * 2,
          }}
        />
      ))}
      
      {/* Planets */}
      {allLinks.map((link) => {
        const orbitConfig = ORBIT_CONFIG.find(o => o.category === link.category);
        if (!orbitConfig) return null;

        const linksInSameOrbit = allLinks.filter(l => l.category === link.category);
        const index = linksInSameOrbit.findIndex(l => l.url === link.url);
        const count = linksInSameOrbit.length;
        
        const angle = (360 / count) * index;
        const isVisible = visibleLinkUrls.has(link.url);
        
        const animationStyle = {
            animation: `rotate ${orbitConfig.duration} linear infinite`,
            animationPlayState: isAnimationPaused ? 'paused' : ('running' as const),
        };
        const counterAnimationStyle = {
            animation: `counter-rotate ${orbitConfig.duration} linear infinite`,
            animationPlayState: isAnimationPaused ? 'paused' : ('running' as const),
        }

        return (
            <div
              key={link.url}
              className="absolute w-px h-px"
              style={{
                transform: `rotate(${angle}deg)`,
                ...animationStyle
              }}
            >
              <a
                href={link.url}
                onClick={(e) => handleLinkClick(e, link.url)}
                title={link.description}
                className={`group absolute flex items-center justify-center w-16 h-16 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-full cursor-pointer hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 scale-50 pointer-events-none'}`}
                style={{
                  top: `-${orbitConfig.radius}px`,
                  animationName: 'pulse',
                  animationDuration: '5s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDelay: `${Math.random() * 5}s`,
                  animationPlayState: isAnimationPaused ? 'paused' : 'running',
                }}
              >
                <div style={counterAnimationStyle}>
                    <ResourceIcon icon={link.icon} />
                </div>
                {/* Tooltip */}
                <div 
                    className="absolute bottom-full mb-3 w-max max-w-[200px] p-3 text-sm text-slate-200 bg-slate-900 border border-slate-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                >
                    <p className="font-bold text-base">{link.name}</p>

                    <p className="text-xs text-slate-400 mt-1">{link.description}</p>
                </div>
              </a>
            </div>
        );
      })}
    </div>
  );
};

export default DataOrrery;