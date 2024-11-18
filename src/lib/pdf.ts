import * as pdfjs from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export async function extractTextFromPDF(file: File): Promise<ExtractedPage[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const pages: ExtractedPage[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Sort items by their vertical position to maintain reading order
      const items = textContent.items as TextItem[];
      items.sort((a, b) => {
        const yDiff = b.transform[5] - a.transform[5];
        if (Math.abs(yDiff) < 5) { // Items on roughly the same line
          return a.transform[4] - b.transform[4]; // Sort by x position
        }
        return yDiff;
      });

      // Combine text items into lines
      let currentY = 0;
      let currentLine = '';
      const lines: string[] = [];

      items.forEach((item) => {
        const y = item.transform[5];
        const text = item.str;

        if (currentY === 0) {
          currentY = y;
          currentLine = text;
        } else if (Math.abs(y - currentY) < 5) {
          // Same line
          currentLine += ' ' + text;
        } else {
          // New line
          lines.push(currentLine.trim());
          currentY = y;
          currentLine = text;
        }
      });

      if (currentLine) {
        lines.push(currentLine.trim());
      }

      pages.push({
        pageNumber: pageNum,
        text: lines.join('\\n')
      });
    }

    return pages;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}

export function cleanExtractedText(text: string): string {
  return text
    .replace(/\\s+/g, ' ')
    .replace(/\\n\\s*\\n/g, '\\n')
    .trim();
}
