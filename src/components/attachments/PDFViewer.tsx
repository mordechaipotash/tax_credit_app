'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: Error) => void;
}

export default function PDFViewer({ url, onLoadSuccess, onLoadError }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    onLoadSuccess?.(numPages);
  };

  const handleLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setLoading(false);
    onLoadError?.(error);
  };

  const nextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const previousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col items-center">
      {loading && (
        <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        loading={
          <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        }
      >
        <Page 
          pageNumber={pageNumber} 
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="shadow-lg rounded-lg"
        />
      </Document>

      {numPages > 0 && (
        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className={`p-2 rounded-full ${
              pageNumber <= 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className={`p-2 rounded-full ${
              pageNumber >= numPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
