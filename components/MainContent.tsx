import React, { useState } from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ResourceCategory } from '../data/resources';
import { SpinnerIcon } from './icons/SpinnerIcon';
import ConfirmationDialog from './ConfirmationDialog';
import DataOrrery from './DataOrrery';

// IMPORTANT: Replace this with the actual URL of your company's Google Site.
const GOOGLE_SITE_URL = 'https://sites.google.com/peaceoutpost.icu/fedcorp/base-camp';

interface MainContentProps {
  resources: ResourceCategory[];
  isLoading: boolean;
}

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
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-8 pb-16 max-w-screen-xl">
      <div className="w-full max-w-5xl mx-auto mb-8 p-4 bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-100 rounded-r-lg" role="alert">
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
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-8 sm:p-10 max-w-3xl mx-auto transition-shadow duration-300 ease-in-out">
          <h1 className="font-brand text-3xl sm:text-4xl font-extrabold text-gray-100 tracking-tight mb-4">
            WELCOME TO THE CENTRAL HUB
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-lg mx-auto">
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

        {/* Data Orrery Section */}
        <div className="mt-14 w-full max-w-5xl mx-auto">
          <h2 className="font-brand text-3xl font-bold text-amber-500 mb-8 text-center tracking-wider">
            Data Orrery
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <SpinnerIcon className="h-12 w-12 text-amber-500" />
            </div>
          ) : hasResults ? (
            <DataOrrery resources={resources} handleLinkClick={handleLinkClick} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">No resources found orbiting the data hub.</p>
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