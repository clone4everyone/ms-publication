import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

const InlinePdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  return (
    <div className="bg-gray-100 rounded-xl p-4">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(p => p - 1)}
            className="px-3 py-2 bg-white rounded-lg shadow disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>

          <span className="font-medium">
            Page {pageNumber} / {numPages || '--'}
          </span>

          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(p => p + 1)}
            className="px-3 py-2 bg-white rounded-lg shadow disabled:opacity-40"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setScale(s => Math.max(0.8, s - 0.1))}
            className="px-3 py-2 bg-white rounded-lg shadow"
          >
            <FaSearchMinus />
          </button>

          <button
            onClick={() => setScale(s => Math.min(2, s + 0.1))}
            className="px-3 py-2 bg-white rounded-lg shadow"
          >
            <FaSearchPlus />
          </button>
        </div>
      </div>

      {/* PDF */}
      <div className="flex justify-center overflow-auto">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading="Loading document..."
        >
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>
    </div>
  );
};

export default InlinePdfViewer;
