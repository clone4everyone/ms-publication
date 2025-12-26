// src/components/submission/SubmissionArticleDetails.jsx
import React from 'react';
import { FaFileAlt, FaBan } from 'react-icons/fa';

const SubmissionArticleDetails = ({ submission, onOpenPdf }) => {
  return (
    <div className="glass-morphism rounded-2xl shadow-xl p-8 animate-fade-in-up animate-delay-100 hover-lift">
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-teal-600 to-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-teal-700 to-amber-600 bg-clip-text text-transparent">
          {submission.metadata?.title}
        </h2>
      </div>

      {submission.metadata?.subtitle && (
        <p className="text-xl text-gray-600 mb-6 font-medium italic">
          {submission.metadata.subtitle}
        </p>
      )}

      {/* Abstract */}
      <div className="mb-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border-l-4 border-teal-600">
        <h3 className="font-bold text-teal-900 mb-3 text-lg flex items-center space-x-2">
          <FaFileAlt className="w-5 h-5" />
          <span>Abstract</span>
        </h3>
        <div
          className="text-gray-800 leading-relaxed prose prose-teal max-w-none"
          dangerouslySetInnerHTML={{
            __html: submission.metadata?.abstract || "",
          }}
        />
      </div>

      {/* Keywords */}
      {submission.metadata?.keywords && submission.metadata.keywords.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {submission.metadata.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold border-2 border-teal-200 hover:scale-110 hover:shadow-md transition-all duration-300 cursor-default"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Document */}
      {submission.documentFile && (
        <div className="mt-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center space-x-2">
            <FaFileAlt className="w-5 h-5 text-teal-600" />
            <span>Document</span>
          </h3>
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border-2 border-teal-600">
            <div className="flex items-center space-x-3">
              <FaFileAlt className="w-5 h-5 text-teal-600" />
              <span className="font-medium text-teal-700">
                {submission.documentFile.filename}
              </span>
            </div>
            <button
              onClick={onOpenPdf}
              className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FaFileAlt className="w-4 h-4" />
              <span>Open Document</span>
            </button>
          </div>
        </div>
      )}

      {/* Rejection Reason */}
      {submission.rejectionReason && (
        <div className="mt-6 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl p-6 animate-scale-in">
          <h3 className="font-bold text-rose-900 mb-3 text-lg flex items-center space-x-2">
            <FaBan className="w-5 h-5" />
            <span>Rejection Reason</span>
          </h3>
          <p className="text-rose-800 leading-relaxed">{submission.rejectionReason}</p>
        </div>
      )}
    </div>
  );
};

export default SubmissionArticleDetails;