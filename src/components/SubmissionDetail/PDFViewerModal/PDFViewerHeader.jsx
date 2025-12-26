import { FaFileAlt, FaTimes } from 'react-icons/fa';

function PDFViewerHeader({
  filename,
  user,
  currentPage,
  setCurrentPage,
  showNotesPanel,
  setShowNotesPanel,
  pageNotes,
  onClose
}) {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FaFileAlt className="w-5 h-5" />
        <span className="font-bold text-lg">{filename}</span>
      </div>
      <div className="flex items-center space-x-3">
        {user.role === 'reviewer' && (
          <>
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="hover:bg-white/20 px-2 py-1 rounded transition-all"
              >
                ←
              </button>
              <span className="font-medium">
                Page <input 
                  type="number" 
                  value={currentPage} 
                  onChange={(e) => setCurrentPage(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-transparent text-center border-b border-white/50 focus:outline-none"
                  min="1"
                />
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="hover:bg-white/20 px-2 py-1 rounded transition-all"
              >
                →
              </button>
            </div>
            
            <button
              onClick={() => setShowNotesPanel(!showNotesPanel)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                showNotesPanel ? 'bg-amber-500' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <FaFileAlt className="w-4 h-4" />
              <span className="font-medium">
                {showNotesPanel ? 'Hide' : 'Show'} Notes
                {Object.keys(pageNotes).length > 0 && (
                  <span className="ml-2 bg-white text-teal-700 text-xs px-2 py-0.5 rounded-full">
                    {Object.keys(pageNotes).length}
                  </span>
                )}
              </span>
            </button>
          </>
        )}
        <button
          onClick={onClose}
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
        >
          <FaTimes className="w-4 h-4" />
          <span className="font-medium">Close</span>
        </button>
      </div>
    </div>
  );
}

export default PDFViewerHeader;