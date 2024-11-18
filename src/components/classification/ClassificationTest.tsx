'use client';

import { useState } from 'react';
import { extractTextFromPDF } from '@/lib/pdf';

export default function ClassificationTest() {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      if (file.type === 'application/pdf') {
        const pages = await extractTextFromPDF(file);
        const text = pages.map(page => page.text).join('\\n');
        
        const response = await fetch('/api/classify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error('Classification failed');
        }

        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        
        const response = await fetch('/api/classify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error('Classification failed');
        }

        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload PDF or Text File
        </label>
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
      </div>

      {loading && (
        <div className="text-gray-600">Processing...</div>
      )}

      {error && (
        <div className="text-red-600">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="bg-gray-50 p-4 rounded-md">
          <pre className="whitespace-pre-wrap text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
