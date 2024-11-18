'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { InboxIcon } from '@heroicons/react/24/outline';
import EmailList from '@/components/email/EmailList';
import EmailFilters from '@/components/email/EmailFilters';

export default function EmailsPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'week',
    startDate: undefined,
    endDate: undefined
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <InboxIcon className="h-8 w-8 text-gray-400 mr-3" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Email Processing
            </h1>
            <p className="mt-1 text-lg text-gray-500">
              Process and manage incoming WOTC form submissions
            </p>
          </div>
        </div>

        <div className="mt-4">
          <EmailFilters filters={filters} onFilterChange={setFilters} />
        </div>

        <div className="mt-6 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <EmailList filters={filters} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
