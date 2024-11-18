'use client';

import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const ClassificationTest = dynamic(
  () => import('@/components/classification/ClassificationTest'),
  { ssr: false }
);

export default function TestPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Test Classification
            </h1>
            <p className="mt-1 text-lg text-gray-500">
              Upload a WOTC form to test classification and data extraction
            </p>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ClassificationTest />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
