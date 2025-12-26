import { FaFileAlt, FaCheck, FaTimes } from 'react-icons/fa';

function NotesPanel({
  currentPage,
  setCurrentPage,
  currentPageNote,
  setCurrentPageNote,
  pageNotes,
  onSave,
  onDelete,
  onClearAll
}) {
  return (
    <div className="w-96 bg-white shadow-2xl flex flex-col overflow-hidden">
      {/* Notes Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4">
        <h3 className="font-bold text-lg flex items-center space-x-2">
          <FaFileAlt className="w-5 h-5" />
          <span>Notes for Page {currentPage}</span>
        </h3>
        {pageNotes[currentPage] && (
          <p className="text-xs mt-1 opacity-90">Note exists for this page</p>
        )}
      </div>

      {/* Notes Content */}
      <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
        {/* Current Page Note Editor */}
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-bold text-gray-700 mb-2">
            Note for Page {currentPage}
          </label>
          <textarea
            value={currentPageNote}
            onChange={(e) => setCurrentPageNote(e.target.value)}
            placeholder={`Write notes about issues found on page ${currentPage}...`}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none min-h-[200px]"
          />
        </div>

        {/* Save/Delete Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onSave}
            disabled={!currentPageNote.trim()}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <FaCheck className="w-4 h-4" />
            <span>Save Note</span>
          </button>
          {pageNotes[currentPage] && (
            <button
              onClick={onDelete}
              className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* All Notes Summary */}
        {Object.keys(pageNotes).length > 0 && (
          <div className="border-t-2 border-gray-200 pt-4 mt-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
              <span>All Notes ({Object.keys(pageNotes).length} pages)</span>
              <button
                onClick={onClearAll}
                className="text-xs text-red-600 hover:text-red-700 font-normal"
              >
                Clear All
              </button>
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.keys(pageNotes)
                .sort((a, b) => Number(a) - Number(b))
                .map((page) => (
                  <div
                    key={page}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      Number(page) === currentPage
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900">
                        Page {page}
                      </span>
                      <span className="text-xs text-gray-500">
                        {pageNotes[page].length} chars
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {pageNotes[page]}
                    </p>
                    
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesPanel;
