'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DocumentTextIcon, InboxIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold leading-6 text-gray-900">
              WOTC Processing Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-700">
              Process and manage Work Opportunity Tax Credit forms efficiently.
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                  href="/test"
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-medium text-gray-900">
                      Test Classification
                    </p>
                    <p className="truncate text-lg text-gray-500">
                      Test form classification and extraction
                    </p>
                  </div>
                </Link>

                <Link
                  href="/emails"
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400 hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <InboxIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-medium text-gray-900">
                      Process Emails
                    </p>
                    <p className="truncate text-lg text-gray-500">
                      Process and manage incoming WOTC emails
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
