function PDFViewerContent({
  pdfUrl,
  currentPage,
  user,
  submissionId,
  watermarkPosition,
  setShowScreenshotWarning
}) {
  const handleContextMenu = (e) => {
    if (user.role === 'reviewer') {
      e.preventDefault();
      setShowScreenshotWarning(true);
      setTimeout(() => setShowScreenshotWarning(false), 2000);
    }
  };

  const preventAction = (e) => {
    if (user.role === 'reviewer') {
      e.preventDefault();
    }
  };

  return (
    <div 
      className="flex-1 overflow-auto bg-gray-800 relative transition-all duration-300"
      style={{
        userSelect: user.role === 'reviewer' ? 'none' : 'auto',
        WebkitUserSelect: user.role === 'reviewer' ? 'none' : 'auto',
        MozUserSelect: user.role === 'reviewer' ? 'none' : 'auto',
        msUserSelect: user.role === 'reviewer' ? 'none' : 'auto',
        WebkitTouchCallout: user.role === 'reviewer' ? 'none' : 'auto'
      }}
      onContextMenu={handleContextMenu}
      onCopy={preventAction}
      onCut={preventAction}
      onPaste={preventAction}
      onDragStart={preventAction}
    >
      {pdfUrl && (
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&page=${currentPage}`}
          className="w-full h-full"
          title="PDF Viewer"
          style={{
            border: 'none',
            pointerEvents: 'auto'
          }}
        />
      )}

      {/* Watermarks for Reviewers */}
      {user.role === 'reviewer' && (
        <>
          <div 
            className="absolute pointer-events-none transition-all duration-2000 ease-linear"
            style={{
              left: `${watermarkPosition.x}%`,
              top: `${watermarkPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <div className="text-red-500/30 text-4xl font-bold transform -rotate-45 select-none whitespace-nowrap">
              {user.firstName} {user.lastName} - {user.email}
            </div>
            <div className="text-red-500/20 text-sm text-center mt-2">
              {new Date().toLocaleString()}
            </div>
          </div>

          <div className="absolute top-4 left-4 text-white/20 text-xs font-mono pointer-events-none">
            Reviewer: {user.firstName} {user.lastName}<br/>
            {new Date().toLocaleString()}<br/>
            ID: {submissionId}
          </div>
          <div className="absolute top-4 right-4 text-white/20 text-xs font-mono pointer-events-none text-right">
            CONFIDENTIAL<br/>
            DO NOT COPY<br/>
            DO NOT SHARE
          </div>
          <div className="absolute bottom-4 left-4 text-white/20 text-xs font-mono pointer-events-none">
            All access logged
          </div>
          <div className="absolute bottom-4 right-4 text-white/20 text-xs font-mono pointer-events-none text-right">
            {user.email}
          </div>

          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255, 0, 0, 0.1) 100px,
                rgba(255, 0, 0, 0.1) 101px
              )`,
              zIndex: 5
            }}
          />
        </>
      )}
    </div>
  );
}

export default PDFViewerContent;