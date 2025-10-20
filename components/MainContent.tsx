
import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

// IMPORTANT: Replace this with the actual URL of your company's Google Site.
const GOOGLE_SITE_URL = 'https://sites.google.com/view/your-company-site';

const MainContent: React.FC = () => {
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-16">
      <div className="text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 max-w-2xl mx-auto transform hover:scale-[1.02] transition-transform duration-300 ease-in-out">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome to Your Central Hub
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            This portal is your gateway to our company's internal resources. Access announcements, documents, and team information all in one place.
          </p>
          <a
            href={GOOGLE_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:translate-y-[-2px]"
          >
            <span>Access Company Site</span>
            <ExternalLinkIcon className="ml-3 h-6 w-6" />
          </a>
          <p className="mt-6 text-sm text-gray-500">
            You will be redirected to our secure Google Site.
          </p>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
