'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ProcessEmails() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessEmails = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/emails', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process emails');
      }

      toast.success(`Successfully processed ${data.count} emails`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to process emails');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleProcessEmails}
      disabled={isProcessing}
      className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm
        ${isProcessing 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
    >
      {isProcessing ? 'Processing...' : 'Process New Emails'}
    </button>
  );
}
