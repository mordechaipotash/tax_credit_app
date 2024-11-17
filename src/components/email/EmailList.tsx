'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';
import { EnvelopeIcon, DocumentIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import EmailDetail from './EmailDetail';
import EmailFilters, { EmailFilters as FilterTypes } from './EmailFilters';
import EmailSearch from './EmailSearch';
import EmailBulkActions from './EmailBulkActions';
import toast from 'react-hot-toast';

type Email = Database['public']['Tables']['emails']['Row'];

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterTypes>({
    status: 'all',
    dateRange: 'week'
  });

  useEffect(() => {
    fetchEmails();
  }, [filters, searchQuery]);

  const fetchEmails = async () => {
    try {
      let query = supabase
        .from('emails')
        .select('*')
        .order('received_at', { ascending: false });

      // Apply search
      if (searchQuery) {
        query = query.or(`subject.ilike.%${searchQuery}%,sender.ilike.%${searchQuery}%`);
      }

      // Apply status filter
      if (filters.status === 'processed') {
        query = query.eq('processed', true);
      } else if (filters.status === 'pending') {
        query = query.eq('processed', false);
      }

      // Apply date filter
      const now = new Date();
      let startDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'custom':
          if (filters.startDate && filters.endDate) {
            query = query
              .gte('received_at', filters.startDate.toISOString())
              .lte('received_at', filters.endDate.toISOString());
          }
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }

      if (filters.dateRange !== 'custom') {
        query = query.gte('received_at', startDate.toISOString());
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkProcess = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('emails')
        .update({ processed: true })
        .in('id', ids);

      if (error) throw error;
      fetchEmails();
    } catch (error) {
      console.error('Error processing emails:', error);
      throw error;
    }
  };

  const handleBulkMarkAsRead = async (ids: string[]) => {
    // Implement mark as read functionality
    console.log('Mark as read:', ids);
  };

  const handleEmailSelection = (emailId: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, emailId]);
    } else {
      setSelectedIds((prev) => prev.filter(id => id !== emailId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-lg font-medium text-gray-900">
          Emails ({emails.length})
        </h2>
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <EmailSearch onSearch={setSearchQuery} />
          </div>
          <EmailFilters onFilterChange={setFilters} />
        </div>
      </div>

      <EmailBulkActions
        selectedIds={selectedIds}
        onProcess={handleBulkProcess}
        onMarkAsRead={handleBulkMarkAsRead}
        onClearSelection={() => setSelectedIds([])}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email.id}
                className={`bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer
                  ${selectedEmailId === email.id ? 'ring-2 ring-indigo-500' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(email.id)}
                      onChange={(e) => handleEmailSelection(email.id, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div 
                    className="flex-1"
                    onClick={() => setSelectedEmailId(email.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <EnvelopeIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {email.subject || 'No Subject'}
                          </h4>
                          <p className="text-sm text-gray-500">{email.sender}</p>
                          <div className="mt-1 flex items-center space-x-2">
                            <DocumentIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(email.received_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        {email.processed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    {email.processing_error && (
                      <div className="mt-2 text-sm text-red-600">
                        Error: {email.processing_error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="lg:border-l lg:border-gray-200 lg:pl-6">
          {selectedEmailId ? (
            <EmailDetail emailId={selectedEmailId} />
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Select an email to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
