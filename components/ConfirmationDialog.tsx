import React, { useEffect, useCallback } from 'react';
import { WarningIcon } from './icons/WarningIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  url: string | null;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  url,
}) => {

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div
        className="relative w-full max-w-md m-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-amber-900/50">
            <WarningIcon className="h-6 w-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h2 id="dialog-title" className="text-xl font-bold text-slate-100">
              External Link Warning
            </h2>
            <p id="dialog-description" className="mt-2 text-slate-400">
              You are about to navigate away from the portal. Please verify the destination URL before proceeding.
            </p>
            <div className="mt-4 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm break-all">
              <strong className="font-semibold text-slate-200">URL:</strong> {url}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-semibold bg-slate-700 text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors"
            aria-label="Cancel navigation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center px-6 py-2 rounded-lg font-semibold bg-amber-600 text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors"
            aria-label="Proceed to external site"
          >
            <span>Proceed</span>
            <ExternalLinkIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationDialog;
