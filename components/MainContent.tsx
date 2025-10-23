import React, { useState } from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ResourceCategory } from '../data/resources';
import { SpinnerIcon } from './icons/SpinnerIcon';
import ConfirmationDialog from './ConfirmationDialog'; // Import the new component

import { DriveIcon } from './icons/DriveIcon';
import { DocsIcon } from './icons/DocsIcon';
import { SlackIcon } from './icons/SlackIcon';
import { DesignIcon } from './icons/DesignIcon';
import { PolicyIcon } from './icons/PolicyIcon';
import { CalendarIcon } from './icons/CalendarIcon';

// IMPORTANT: Replace this with the actual URL of your company's Google Site.
const GOOGLE_SITE_URL = 'https://sites.google.com/peaceoutpost.icu/fedcorp/base-camp';

interface MainContentProps {
  resources: ResourceCategory[];
  isLoading: boolean;
}

const ResourceIcon: React.FC<{ icon?: string }> = ({ icon }) => {
  const iconClasses = "h-6 w-6 mr-4 flex-shrink-0 text-slate-400 group-hover:text-amber-400 transition-colors duration-300";
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
    default:
      return null;
  }
};

const MainContent: React.FC<MainContentProps> = ({ resources, isLoading }) => {
  const hasResults = resources.some(category => category.links.length > 0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
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


  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-8 pb-16">
      <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-100 rounded-r-lg" role="alert">
        <div className="flex">
          <div className="py-1">
            <WarningIcon className="h-6 w-6 text-yellow-400 mr-4 flex-shrink-0" />
          </div>
          <div>
            <p className="font-bold">System Use Notification</p>
            <p className="text-sm">
              A WARNING IN ACCORDANCE WITH FED. R. CIV. P. §26(b)(1), PRIVACY DOES NOT EXIST HERE. All activity on this system is subject to monitoring.
            </p>
          </div>
        </div>
      </div>
      <div className="text-center w-full">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-8 sm:p-12 max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
          <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-100 tracking-tight mb-4">
            WELCOME TO THE CENTRAL HUB
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto">
            This portal is the gateway to the U.S. Ministry of Defense Federal Corporation's internal and external resource. Data disseminated is intended for general information. Access Announcements, Documents, and Association information all in one place.
          </p>
          <a
            href={GOOGLE_SITE_URL}
            onClick={(e) => handleLinkClick(e, GOOGLE_SITE_URL)}
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:translate-y-[-2px]"
            aria-label="Access the main U.S. Ministry Google Site"
          >
            <span>Access Company Site</span>
            <ExternalLinkIcon className="ml-3 h-6 w-6" />
          </a>
          <p className="mt-6 text-sm text-gray-400">
            You will be redirected to our secure Google Site.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="mt-16 w-full max-w-4xl mx-auto">
          <h2 className="font-brand text-3xl font-bold text-amber-500 mb-8 text-center tracking-wider">
            Quick Links
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <SpinnerIcon className="h-12 w-12 text-amber-500" />
            </div>
          ) : hasResults ? (
            <div className="space-y-12">
              {resources.map((categoryItem) => (
                categoryItem.links.length > 0 && (
                  <div key={categoryItem.category}>
                    <h3 className="font-brand text-xl font-semibold text-amber-500 mb-4 border-b border-slate-700 pb-2 text-left tracking-wider">
                      {categoryItem.category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItem.links.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          onClick={(e) => handleLinkClick(e, link.url)}
                          className="group block p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl shadow-md transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-amber-400 text-left"
                          aria-label={`Access ${link.name}`}
                          title={link.description}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1 min-w-0">
                              <ResourceIcon icon={link.icon} />
                              <span className="font-semibold text-gray-200 group-hover:text-amber-500 transition-colors truncate">{link.name}</span>
                            </div>
                            <ExternalLinkIcon
                              className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors flex-shrink-0 ml-2"
                             />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">No resources found. Try a different search term.</p>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmNavigation}
        url={targetUrl}
      />
    </main>
  );
};

export default MainContent;