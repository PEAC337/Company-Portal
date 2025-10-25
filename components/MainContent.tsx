import React from 'react';
import { ResourceCategory } from '../data/resources';
import { SpinnerIcon } from './icons/SpinnerIcon';
import DataOrrery from './DataOrrery';
import GenerativeTools from './GenerativeTools';

interface MainContentProps {
  resources: ResourceCategory[];
  isLoading: boolean;
  handleLinkClick: (event: React.MouseEvent<HTMLElement>, url: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ resources, isLoading, handleLinkClick }) => {
  const hasResults = resources.some(category => category.links.length > 0);

  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pt-8 pb-16 max-w-screen-xl">
      
      {/* Data Orrery Section */}
      <section id="data-orrery" className="w-full max-w-5xl mx-auto">
        <div className="mb-14">
          <h1 className="font-brand text-3xl font-bold text-amber-500 mb-2 text-center tracking-wider">
            Live Service Status
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto text-center">
            A dynamic visualization of service statuses, where elemental forms orbit a central core, changing their behavior based on health.
          </p>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <SpinnerIcon className="h-12 w-12 text-amber-500" />
            </div>
          ) : hasResults ? (
            <DataOrrery resources={resources} handleLinkClick={handleLinkClick} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-400">No services found matching your query.</p>
            </div>
          )}
        </div>
      </section>

      {/* Generative Tools Section */}
      <section id="generative-tools" className="w-full max-w-5xl mx-auto">
          <div className="mt-14">
              <h2 className="font-brand text-3xl font-bold text-amber-500 mb-8 text-center tracking-wider">
                  Generative AI Tools
              </h2>
              <GenerativeTools />
          </div>
      </section>
    </main>
  );
};

export default MainContent;