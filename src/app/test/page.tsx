'use client';

import dynamic from 'next/dynamic';

const ClassificationTest = dynamic(
  () => import('@/components/classification/ClassificationTest'),
  { ssr: false }
);

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test Classification</h1>
      <ClassificationTest />
    </div>
  );
}
