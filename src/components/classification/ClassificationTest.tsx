'use client';

import { useState } from 'react';
import { DocumentTextIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { extractTextFromPDF, cleanExtractedText } from '@/lib/pdf';

interface ClassificationResult {
  formType: string;
  confidence: number;
  extractedFields?: Record<string, string>;
  aiExtractedFields?: Record<string, string>;
  title?: string;
  description?: string;
}

export default function ClassificationTest() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfProcessing, setPdfProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast.error('Please upload a PDF file');
      return;
    }

    try {
      setPdfProcessing(true);
      const pages = await extractTextFromPDF(file);
      const combinedText = pages.map(page => page.text).join('\\n');
      const cleanedText = cleanExtractedText(combinedText);
      setText(cleanedText);
      toast.success('PDF processed successfully');
    } catch (error) {
      console.error('PDF processing error:', error);
      toast.error('Failed to process PDF');
    } finally {
      setPdfProcessing(false);
    }
  };

  const handleClassify = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text or upload a PDF to classify');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Classification failed');
      }

      setResult(data);
      toast.success('Document classified successfully');
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to classify document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Test Document Classification
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Upload a PDF or enter text from a WOTC form to test the classification system.</p>
          </div>

          {/* File Upload */}
          <div className="mt-5">
            <label
              htmlFor="pdf-upload"
              className={`relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer
                ${pdfProcessing ? 'bg-gray-50' : 'bg-white'}`}
            >
              <input
                id="pdf-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={pdfProcessing}
              />
              <DocumentArrowUpIcon 
                className="mx-auto h-12 w-12 text-gray-400"
                aria-hidden="true"
              />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                {pdfProcessing ? 'Processing PDF...' : 'Upload PDF'}
              </span>
              <span className="mt-2 block text-sm text-gray-500">
                PDF files up to 10MB
              </span>
            </label>
          </div>

          <div className="mt-5">
            <textarea
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Paste form text here or upload a PDF..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleClassify}
              disabled={loading || pdfProcessing}
              className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm
                ${(loading || pdfProcessing)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
            >
              <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
              {loading ? 'Classifying...' : 'Classify Document'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Classification Result
            </h3>
            <div className="mt-4">
              <div className="rounded-md bg-gray-50 px-6 py-5">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Form Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      Form {result.formType} - {result.title}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Confidence</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {(result.confidence * 100).toFixed(2)}%
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{result.description}</dd>
                  </div>
                  {result.extractedFields && Object.keys(result.extractedFields).length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Pattern-Matched Fields
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {Object.entries(result.extractedFields).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-200 pb-2">
                              <p className="text-xs text-gray-500 capitalize">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm text-gray-900">{value}</p>
                            </div>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                  {result.aiExtractedFields && Object.keys(result.aiExtractedFields).length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        AI-Extracted Fields
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {Object.entries(result.aiExtractedFields).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-200 pb-2">
                              <p className="text-xs text-gray-500 capitalize">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm text-gray-900">{value}</p>
                            </div>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
