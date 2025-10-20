import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { WarningIcon } from './icons/WarningIcon';
import { ResourceCategory } from '../data/resources';

// IMPORTANT: Replace this with the actual URL of your company's Google Site.
const GOOGLE_SITE_URL = 'https://sites.google.com/peaceoutpost.icu/fedcorp/base-camp';

interface MainContentProps {
  resources: ResourceCategory[];
}

const MainContent: React.FC<MainContentProps> = ({ resources }) => {
  const hasResults = resources.some(category => category.links.length > 0);

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-8 pb-16">
      <div className="w-full max-w-4xl mx-auto mb-8 p-4 bg-yellow-900/40 border-l-4 border-yellow-500 text-yellow-200 rounded-r-lg" role="alert">
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
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-slate-800 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 transform hover:translate-y-[-2px]"
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
          {hasResults ? (
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
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block p-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-xl shadow-md transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:border-amber-400 text-left"
                          aria-label={`Access ${link.name}`}
                          title={link.description}
                        >
                          <div className="flex items-center justify-between">
                             <span className="font-semibold text-gray-200 group-hover:text-amber-500 transition-colors">{link.name}</span>
                            <ExternalLinkIcon
                              className="h-5 w-5 text-gray-400 group-hover:text-amber-500 transition-colors"
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
    </main>
  );
};

export default MainContent;