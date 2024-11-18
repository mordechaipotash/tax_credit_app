'use client';

import { Suspense } from 'react';
import ClassificationTest from '@/components/classification/ClassificationTest';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Classification</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ClassificationTest />
      </Suspense>
    </div>
  );
}
