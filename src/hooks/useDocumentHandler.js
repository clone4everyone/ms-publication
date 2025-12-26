import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export function useDocumentHandler(id, user, currentSubmission) {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 50, y: 50 });
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);

  useEffect(() => {
    if (!showPdfViewer || user.role !== 'reviewer') return;

    // Move watermark randomly
    const moveWatermark = setInterval(() => {
      setWatermarkPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }, 100000);

    // Detect screenshot attempts
    const detectScreenshot = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const screenshotKeys = isMac
        ? ((e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || e.key === 'PrintScreen')
        : ((e.key === 'PrintScreen') || (e.metaKey && e.shiftKey && e.key === 'S'));

      if (screenshotKeys) {
        e.preventDefault();
        setShowScreenshotWarning(true);
        setTimeout(() => setShowScreenshotWarning(false), 3000);

        // Log screenshot attempt
        fetch(`https://ms-publication-backend.onrender.com/api/submissions/${id}/log-screenshot-attempt`, {
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
        fetch(`/api/submissions/${id}/log-activity`, {
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
  }, [showPdfViewer, user.role, id]);

  const handleOpenPdf = async () => {
    try {
      const token = localStorage.getItem('token');
      const isDocx = currentSubmission.documentFile.filename.toLowerCase().endsWith('.docx') ||
        currentSubmission.documentFile.mimetype?.includes('wordprocessingml');

      if (isDocx) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submissions/${id}/stream-document`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = currentSubmission.documentFile.filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.info('DOCX file downloaded. Please open it in Microsoft Word or compatible software.');
        } else {
          toast.error('Failed to download document');
        }
      } else {
        const response = await fetch(`https://ms-publication-backend.onrender.com/api/submissions/${id}/stream-document`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setShowPdfViewer(true);
        } else {
          toast.error('Failed to load document');
        }
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Error loading document');
    }
  };

  const handleClosePdf = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setShowPdfViewer(false);
  };

  return {
    showPdfViewer,
    pdfUrl,
    currentPage,
    setCurrentPage,
    handleOpenPdf,
    handleClosePdf,
    watermarkPosition,
    showScreenshotWarning
  };
}