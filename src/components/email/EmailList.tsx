'use client';

import { useState, useEffect } from 'react';
import { DocumentTextIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EmailFilters } from './EmailFilters';
import { formatDistanceToNow } from 'date-fns';

interface Email {
  id: string;
  subject: string;
  sender: string;
  received_at: string;
  processed: boolean;
  form_type?: string;
  confidence?: number;
}

interface Props {
  filters: EmailFilters;
}

export default function EmailList({ filters }: Props) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, [filters]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/emails');
      if (!response.ok) throw new Error('Failed to fetch emails');
      const data = await response.json();
      setEmails(data.emails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (emailId: string) => {
    try {
      const response = await fetch(`/api/emails/${emailId}/process`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to process email');
      await fetchEmails();
    } catch (error) {
      console.error('Error processing email:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-indigo-600"></div>
        <p className="mt-2 text-sm text-gray-500">Loading emails...</p>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No emails</h3>
        <p className="mt-1 text-sm text-gray-500">No emails found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <ul role="list" className="divide-y divide-gray-200">
        {emails.map((email) => (
          <li
            key={email.id}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedEmail === email.id ? 'bg-gray-50' : ''
            }`}
            onClick={() => setSelectedEmail(email.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 gap-x-4">
                <div className="flex-shrink-0">
                  {email.processed ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {email.subject}
                  </p>
                  <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                    <p className="truncate">{email.sender}</p>
                    <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p>{formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end ml-4">
                {email.form_type && (
                  <p className="text-sm text-gray-900">
                    Form {email.form_type}
                    {email.confidence && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({Math.round(email.confidence * 100)}% confidence)
                      </span>
                    )}
                  </p>
                )}
                {!email.processed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProcess(email.id);
                    }}
                    className="mt-2 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Process
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
