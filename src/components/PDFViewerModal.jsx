import { useEffect } from 'react';

import { toast } from 'react-toastify';
import PDFViewerHeader from './SubmissionDetail/PDFViewerModal/PDFViewerHeader';
import PDFViewerContent from './SubmissionDetail/PDFViewerModal/PDFViewerContent';
import NotesPanel from './SubmissionDetail/PDFViewerModal/NotesPanel';
import ScreenshotWarning from './SubmissionDetail/PDFViewerModal/ScreenshotWarning';

function PDFViewerModal({
  pdfUrl,
  submission,
  user,
  submissionId,
  currentPage,
  setCurrentPage,
  pageNotes,
  setPageNotes,
  currentPageNote,
  setCurrentPageNote,
  showNotesPanel,
  setShowNotesPanel,
  watermarkPosition,
  setWatermarkPosition,
  showScreenshotWarning,
  setShowScreenshotWarning,
  onClose
}) {
  // Move watermark and detect screenshots
  useEffect(() => {
    if (user.role !== 'reviewer') return;

    const moveWatermark = setInterval(() => {
      setWatermarkPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }, 100000);

    const detectScreenshot = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const screenshotKeys = isMac
        ? ((e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || e.key === 'PrintScreen')
        : ((e.key === 'PrintScreen') || (e.metaKey && e.shiftKey && e.key === 'S'));

      if (screenshotKeys) {
        e.preventDefault();
        setShowScreenshotWarning(true);
        setTimeout(() => setShowScreenshotWarning(false), 3000);

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submissions/${submissionId}/log-screenshot-attempt`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        fetch(`/api/submissions/${submissionId}/log-activity`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ activity: 'tab_hidden' })
        });
      }
    };

    document.addEventListener('keydown', detectScreenshot);
    document.addEventListener('keyup', detectScreenshot);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(moveWatermark);
      document.removeEventListener('keydown', detectScreenshot);
      document.removeEventListener('keyup', detectScreenshot);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user.role, submissionId, setWatermarkPosition, setShowScreenshotWarning]);

  const handleSavePageNote = () => {
    const updatedNotes = {
      ...pageNotes,
      [currentPage]: currentPageNote
    };
    setPageNotes(updatedNotes);
    localStorage.setItem(`submission_notes_${submissionId}`, JSON.stringify(updatedNotes));
    toast.success(`Note saved for page ${currentPage}`);
  };

  const handleDeletePageNote = () => {
    const updatedNotes = { ...pageNotes };
    delete updatedNotes[currentPage];
    setPageNotes(updatedNotes);
    setCurrentPageNote('');
    localStorage.setItem(`submission_notes_${submissionId}`, JSON.stringify(updatedNotes));
    toast.success(`Note deleted for page ${currentPage}`);
  };

  const handleClearAllNotes = () => {
    if (window.confirm('Clear all notes?')) {
      setPageNotes({});
      setCurrentPageNote('');
      localStorage.removeItem(`submission_notes_${submissionId}`);
      toast.success('All notes cleared');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <PDFViewerHeader
        filename={submission.documentFile.filename}
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showNotesPanel={showNotesPanel}
        setShowNotesPanel={setShowNotesPanel}
        pageNotes={pageNotes}
        onClose={onClose}
      />

      {showScreenshotWarning && <ScreenshotWarning />}

      <div className="flex-1 flex overflow-hidden">
        <PDFViewerContent
          pdfUrl={pdfUrl}
          currentPage={currentPage}
          user={user}
          submissionId={submissionId}
          watermarkPosition={watermarkPosition}
          setShowScreenshotWarning={setShowScreenshotWarning}
        />

        {user.role === 'reviewer' && showNotesPanel && (
          <NotesPanel
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            currentPageNote={currentPageNote}
            setCurrentPageNote={setCurrentPageNote}
            pageNotes={pageNotes}
            onSave={handleSavePageNote}
            onDelete={handleDeletePageNote}
            onClearAll={handleClearAllNotes}
          />
        )}
      </div>

      {user.role === 'reviewer' && (
        <div className="bg-red-900 text-white px-6 py-3 text-center text-sm">
          <strong>⚠️ CONFIDENTIAL DOCUMENT</strong> - Screenshots, screen recordings, and unauthorized sharing are strictly prohibited and logged. 
          Violations may result in immediate access revocation and legal action.
        </div>
      )}
    </div>
  );
}

export default PDFViewerModal;