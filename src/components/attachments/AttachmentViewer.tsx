'use client';

import { useState } from 'react';
import { DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Database } from '@/types/database';

type Attachment = Database['public']['Tables']['attachments']['Row'];

interface AttachmentViewerProps {
  attachments: Attachment[];
  onSelect?: (attachment: Attachment) => void;
}

export default function AttachmentViewer({ attachments, onSelect }: AttachmentViewerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (attachment: Attachment) => {
    setSelectedId(attachment.id);
    onSelect?.(attachment);
  };

  if (!attachments.length) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No attachments</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={`relative group rounded-lg border p-4 cursor-pointer transition-all
            ${selectedId === attachment.id 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-200 hover:border-indigo-200'}`}
          onClick={() => handleSelect(attachment)}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <DocumentTextIcon 
                className={`h-6 w-6 ${
                  selectedId === attachment.id ? 'text-indigo-500' : 'text-gray-400'
                }`} 
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${
                selectedId === attachment.id ? 'text-indigo-900' : 'text-gray-900'
              }`}>
                {attachment.filename}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {formatFileSize(attachment.file_size || 0)}
              </p>
            </div>
          </div>
          
          <div className={`mt-2 text-xs ${
            attachment.processed ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {attachment.processed ? 'Processed' : 'Pending'}
          </div>

          {attachment.processing_error && (
            <div className="mt-2 text-xs text-red-600">
              Error: {attachment.processing_error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
