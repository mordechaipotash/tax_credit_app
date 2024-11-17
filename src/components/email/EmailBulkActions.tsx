'use client';

import { useState } from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface EmailBulkActionsProps {
  selectedIds: string[];
  onProcess: (ids: string[]) => Promise<void>;
  onMarkAsRead: (ids: string[]) => Promise<void>;
  onClearSelection: () => void;
}

export default function EmailBulkActions({
  selectedIds,
  onProcess,
  onMarkAsRead,
  onClearSelection,
}: EmailBulkActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: 'process' | 'markAsRead') => {
    try {
      setIsProcessing(true);
      
      if (action === 'process') {
        await onProcess(selectedIds);
        toast.success(`Processing ${selectedIds.length} emails`);
      } else {
        await onMarkAsRead(selectedIds);
        toast.success(`Marked ${selectedIds.length} emails as read`);
      }

      onClearSelection();
      setIsOpen(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform action');
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">
          {selectedIds.length} selected
        </span>

        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setIsOpen(!isOpen)}
            disabled={isProcessing}
          >
            Actions
            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleAction('process')}
                  disabled={isProcessing}
                >
                  <CheckIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Process Selected
                </button>
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleAction('markAsRead')}
                  disabled={isProcessing}
                >
                  <CheckIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  Mark as Read
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-700"
          onClick={onClearSelection}
          disabled={isProcessing}
        >
          Clear selection
        </button>
      </div>
    </div>
  );
}
