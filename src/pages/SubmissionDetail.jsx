// File: components/SubmissionDetail/index.js
// Main container component that orchestrates all child components

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SubmissionHeader from '../components/SubmissionDetail/SubmissionHeader';
import SubmissionStatusCard from '../components/SubmissionDetail/SubmissionStatusCard';
import ArticleDetailsCard from '../components/SubmissionDetail/ArticleDetailsCard';
import SubmissionTimeline from '../components/SubmissionTimeline';
import EmailPanel from '../components/SubmissionDetail/EmailPanel';
import ActionModal from '../components/SubmissionDetail/ActionModal';
import PDFViewerModal from '../components/PDFViewerModal';
import LoadingScreen from '../components/SubmissionDetail/LoadingScreen';
import {
  getSubmission,
  canEditSubmission,
  approveSubmission,
  rejectSubmission,
  moveToReviewer,
  schedulePublication,
  reviewerApprove,
  reviewerReject,
  reviewerSendBack,
  editorSendBack
} from '../redux/slices/submissionSlice';
import { getSubmissionEmails } from '../redux/slices/emailSlice';
import { logout } from '../redux/slices/authSlice';

function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentSubmission, isLoading, canEdit } = useSelector((state) => state.submissions);
  const { emails } = useSelector((state) => state.emails);

  // PDF Viewer State
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ x: 50, y: 50 });
  const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Notes State
  const [pageNotes, setPageNotes] = useState({});
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [currentPageNote, setCurrentPageNote] = useState('');

  // Action Modal State
  const [showActionModal, setShowActionModal] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [publicationDate, setPublicationDate] = useState('');

  // Email State
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailImages, setEmailImages] = useState([]);

  // Load submission data
  useEffect(() => {
    dispatch(getSubmission(id));
    dispatch(getSubmissionEmails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user.role === 'author' && id) {
      dispatch(canEditSubmission(id));
    }
  }, [dispatch, id, user.role]);

  // Load page notes from localStorage
  useEffect(() => {
    if (showPdfViewer && user.role === 'reviewer') {
      const savedNotes = localStorage.getItem(`submission_notes_${id}`);
      if (savedNotes) {
        setPageNotes(JSON.parse(savedNotes));
      }
    }
  }, [showPdfViewer, id, user.role]);

  // Load current page note
  useEffect(() => {
    if (pageNotes[currentPage]) {
      setCurrentPageNote(pageNotes[currentPage]);
    } else {
      setCurrentPageNote('');
    }
  }, [currentPage, pageNotes]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleBack = () => {
    if (user.role === 'author') {
      navigate('/author/dashboard');
    } else if (user.role === 'editor') {
      navigate(`/editor/journal/${currentSubmission?.journal}`);
    } else {
      navigate(`/reviewer/journal/${currentSubmission?.journal}`);
    }
  };

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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submissions/${id}/stream-document`, {
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

  const handleApprove = async () => {
    if (user.role === 'editor') {
      const result = await dispatch(approveSubmission({ id, editorNotes: actionNotes }));
      if (result.type === 'submissions/approve/fulfilled') {
        toast.success('Submission approved');
        setShowActionModal(null);
        setActionNotes('');
        dispatch(getSubmission(id));
      }
    } else if (user.role === 'reviewer') {
      const result = await dispatch(reviewerApprove({ id, reviewerNotes: actionNotes }));
      if (result.type === 'submissions/reviewerApprove/fulfilled') {
        toast.success('Submission approved');
        setShowActionModal(null);
        setActionNotes('');
        dispatch(getSubmission(id));
      }
    }
  };

  const handleReject = async () => {
    if (!actionNotes) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (user.role === 'editor') {
      const result = await dispatch(rejectSubmission({ id, rejectionReason: actionNotes }));
      if (result.type === 'submissions/reject/fulfilled') {
        toast.success('Submission rejected');
        setShowActionModal(null);
        setActionNotes('');
        dispatch(getSubmission(id));
      }
    } else if (user.role === 'reviewer') {
      const result = await dispatch(reviewerReject({ id, rejectionReason: actionNotes }));
      if (result.type === 'submissions/reviewerReject/fulfilled') {
        toast.success('Submission rejected');
        setShowActionModal(null);
        setActionNotes('');
        dispatch(getSubmission(id));
      }
    }
  };

  // const handleMoveToReviewer = () => {
  //   setShowActionModal('send_to_reviewer');
  // };
  const handleMoveToReviewer = async (reviewerId, editorNotes) => {
  const result = await dispatch(moveToReviewer({ 
    id, 
    reviewerId, 
    editorNotes 
  }));
  
  if (result.type === 'submissions/moveToReviewer/fulfilled') {
    toast.success('Submission assigned to reviewer successfully');
    dispatch(getSubmission(id));
  }
};

  const handleSendToReviewer = async () => {
    const result = await dispatch(moveToReviewer({ id, editorNotes: actionNotes }));
    if (result.type === 'submissions/moveToReviewer/fulfilled') {
      toast.success('Submission moved to reviewer');
      dispatch(getSubmission(id));
    }
  };

  const handleSchedule = async () => {
    if (!publicationDate) {
      toast.error('Please select a publication date');
      return;
    }

    const result = await dispatch(schedulePublication({ id, publicationDate }));
    if (result.type === 'submissions/schedule/fulfilled') {
      toast.success('Publication scheduled');
      setShowActionModal(null);
      setPublicationDate('');
      dispatch(getSubmission(id));
    }
  };

  const handleEditorSendBack = async () => {
    if (!actionNotes) {
      toast.error('Please provide notes for the author');
      return;
    }

    const result = await dispatch(editorSendBack({ id, editorNotes: actionNotes }));
    if (result.type === 'submissions/editorSendBack/fulfilled') {
      toast.success('Submission sent back to author for changes');
      setShowActionModal(null);
      setActionNotes('');
      dispatch(getSubmission(id));
    }
  };

  const mergeAllNotes = () => {
    const sortedPages = Object.keys(pageNotes).sort((a, b) => Number(a) - Number(b));
    let mergedNotes = '';
    sortedPages.forEach((page) => {
      if (pageNotes[page].trim()) {
        mergedNotes += `<strong>Page ${page}:</strong><br/>${pageNotes[page]}<br/><br/>`;
      }
    });
    return mergedNotes;
  };

  const handleSendBack = async () => {
    if (!actionNotes && Object.keys(pageNotes).length > 0) {
      const merged = mergeAllNotes();
      setActionNotes(merged);
      return;
    }

    if (!actionNotes) {
      toast.error('Please provide notes for the editor');
      return;
    }

    const result = await dispatch(reviewerSendBack({ id, reviewerNotes: actionNotes }));
    if (result.type === 'submissions/reviewerSendBack/fulfilled') {
      toast.success('Submission sent back to editor');
      setShowActionModal(null);
      setActionNotes('');
      localStorage.removeItem(`submission_notes_${id}`);
      setPageNotes({});
      dispatch(getSubmission(id));
    }
  };

  const canShowActions = () => {
    if (user.role === 'editor') {
      return ['pending', 'approved_by_editor', 'approved_by_reviewer', 'with_reviewer'].includes(currentSubmission?.status);
    } else if (user.role === 'reviewer') {
      return currentSubmission?.status === 'with_reviewer';
    }
    return false;
  };

  const canSendEmail = () => {
    return user.role === 'author' || user.role === 'editor';
  };

  if (isLoading || !currentSubmission) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <SubmissionHeader
        user={user}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <SubmissionStatusCard
            submission={currentSubmission}
            user={user}
            canEdit={canEdit}
            canShowActions={canShowActions()}
            onEdit={() => navigate(`/author/edit-submission/${id}`)}
            onApprove={() => setShowActionModal('approve')}
            onReject={() => setShowActionModal('reject')}
            onSendBack={() => {
              setShowActionModal(user.role === 'editor' ? 'editor_sendback' : 'sendback');
              if (user.role === 'reviewer' && Object.keys(pageNotes).length > 0) {
                const merged = mergeAllNotes();
                setActionNotes(merged);
              }
            }}
            onMoveToReviewer={handleMoveToReviewer}
            onSchedule={() => setShowActionModal('schedule')}
          />

          <ArticleDetailsCard
            submission={currentSubmission}
            user={user}
            onOpenPdf={handleOpenPdf}
          />

          {currentSubmission.timeline && currentSubmission.timeline.length > 0 && (
            <div className="animate-fade-in-up animate-delay-200">
              <SubmissionTimeline timeline={currentSubmission.timeline} />
            </div>
          )}
        </div>

        {canSendEmail() && (
          <EmailPanel
            submissionId={id}
            emails={emails}
            user={user}
            showComposer={showEmailComposer}
            onToggleComposer={() => setShowEmailComposer(!showEmailComposer)}
            emailSubject={emailSubject}
            setEmailSubject={setEmailSubject}
            emailBody={emailBody}
            setEmailBody={setEmailBody}
            emailImages={emailImages}
            setEmailImages={setEmailImages}
          />
        )}
      </div>

      {showActionModal && (
        <ActionModal
          actionType={showActionModal}
          actionNotes={actionNotes}
          setActionNotes={setActionNotes}
          publicationDate={publicationDate}
          setPublicationDate={setPublicationDate}
          onClose={() => {
            setShowActionModal(null);
            setActionNotes('');
            setPublicationDate('');
          }}
          onConfirm={
            showActionModal === 'send_to_reviewer' ? handleSendToReviewer :
            showActionModal === 'approve' ? handleApprove :
            showActionModal === 'reject' ? handleReject :
            showActionModal === 'editor_sendback' ? handleEditorSendBack :
            showActionModal === 'sendback' ? handleSendBack :
            handleSchedule
          }
        />
      )}

      {showPdfViewer && (
        <PDFViewerModal
          pdfUrl={pdfUrl}
          submission={currentSubmission}
          user={user}
          submissionId={id}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageNotes={pageNotes}
          setPageNotes={setPageNotes}
          currentPageNote={currentPageNote}
          setCurrentPageNote={setCurrentPageNote}
          showNotesPanel={showNotesPanel}
          setShowNotesPanel={setShowNotesPanel}
          watermarkPosition={watermarkPosition}
          setWatermarkPosition={setWatermarkPosition}
          showScreenshotWarning={showScreenshotWarning}
          setShowScreenshotWarning={setShowScreenshotWarning}
          onClose={handleClosePdf}
        />
      )}
    </div>
  );
}

export default SubmissionDetail;

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FaEdit, FaUndo } from 'react-icons/fa';
// import { canEditSubmission, reviewerSendBack, editorSendBack } from '../redux/slices/submissionSlice';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import SubmissionTimeline from '../components/SubmissionTimeline';
// import {
//   getSubmission,
//   approveSubmission,
//   rejectSubmission,
//   moveToReviewer,
//   schedulePublication,
//   reviewerApprove,
//   reviewerReject
// } from '../redux/slices/submissionSlice';
// import { getSubmissionEmails, sendEmail } from '../redux/slices/emailSlice';
// import { logout } from '../redux/slices/authSlice';
// import { toast } from 'react-toastify';
// import {
//   FaArrowLeft, FaSignOutAlt, FaUser, FaDownload, FaEnvelope,
//   FaPaperPlane, FaImage, FaTimes, FaCheck, FaBan, FaForward,
//   FaCalendar, FaClock, FaBook, FaFileAlt
// } from 'react-icons/fa';
// import { format } from 'date-fns';

// function SubmissionDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { currentSubmission, isLoading, canEdit } = useSelector((state) => state.submissions);
//   const { emails } = useSelector((state) => state.emails);
//   const [showPdfViewer, setShowPdfViewer] = useState(false);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [showEmailComposer, setShowEmailComposer] = useState(false);
//   const [emailSubject, setEmailSubject] = useState('');
//   const [emailBody, setEmailBody] = useState('');
//   const [emailImages, setEmailImages] = useState([]);
//   const [showActionModal, setShowActionModal] = useState(null);
//   const [actionNotes, setActionNotes] = useState('');
//   const [publicationDate, setPublicationDate] = useState('');
//   const [watermarkPosition, setWatermarkPosition] = useState({ x: 50, y: 50 });
//   const [showScreenshotWarning, setShowScreenshotWarning] = useState(false);
//   const [pageNotes, setPageNotes] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showNotesPanel, setShowNotesPanel] = useState(false);
//   const [currentPageNote, setCurrentPageNote] = useState('');
//   useEffect(() => {
//     dispatch(getSubmission(id));
//     dispatch(getSubmissionEmails(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (user.role === 'author' && id) {
//       dispatch(canEditSubmission(id));
//     }
//   }, [dispatch, id, user.role]);

//   // Load page notes from localStorage when PDF viewer opens
//   useEffect(() => {
//     if (showPdfViewer && user.role === 'reviewer') {
//       const savedNotes = localStorage.getItem(`submission_notes_${id}`);
//       if (savedNotes) {
//         setPageNotes(JSON.parse(savedNotes));
//       }
//     }
//   }, [showPdfViewer, id, user.role]);

//   // Load current page note when page changes
//   useEffect(() => {
//     if (pageNotes[currentPage]) {
//       setCurrentPageNote(pageNotes[currentPage]);
//     } else {
//       setCurrentPageNote('');
//     }
//   }, [currentPage, pageNotes]);

//   // Add this useEffect to detect screenshot attempts and move watermark
//   useEffect(() => {
//     if (!showPdfViewer || user.role !== 'reviewer') return;

//     // Move watermark randomly
//     const moveWatermark = setInterval(() => {
//       setWatermarkPosition({
//         x: Math.random() * 80 + 10,
//         y: Math.random() * 80 + 10
//       });
//     }, 100000);

//     // Detect screenshot attempts (keyboard shortcuts)
//     const detectScreenshot = (e) => {
//       // Windows: Win+Shift+S, PrtScn, Alt+PrtScn
//       // Mac: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
//       const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

//       const screenshotKeys = isMac
//         ? ((e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || e.key === 'PrintScreen')
//         : ((e.key === 'PrintScreen') || (e.metaKey && e.shiftKey && e.key === 'S'));

//       if (screenshotKeys) {
//         e.preventDefault();
//         setShowScreenshotWarning(true);
//         setTimeout(() => setShowScreenshotWarning(false), 3000);

//         // Log screenshot attempt to backend
//         fetch(`https://ms-publication-backend.onrender.com/api/submissions/${id}/log-screenshot-attempt`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         });
//       }
//     };
//     // Save note for current page
   
//     // Detect when user leaves/returns to tab (common during screenshot)
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         // User might be taking screenshot
//         fetch(`/api/submissions/${id}/log-activity`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ activity: 'tab_hidden' })
//         });
//       }
//     };

//     document.addEventListener('keydown', detectScreenshot);
//     document.addEventListener('keyup', detectScreenshot);
//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       clearInterval(moveWatermark);
//       document.removeEventListener('keydown', detectScreenshot);
//       document.removeEventListener('keyup', detectScreenshot);
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [showPdfViewer, user.role, id]);
//  const handleSavePageNote = () => {
//       const updatedNotes = {
//         ...pageNotes,
//         [currentPage]: currentPageNote
//       };
//       setPageNotes(updatedNotes);
//       localStorage.setItem(`submission_notes_${id}`, JSON.stringify(updatedNotes));
//       toast.success(`Note saved for page ${currentPage}`);
//     };

//     // Delete note for current page
//     const handleDeletePageNote = () => {
//       const updatedNotes = { ...pageNotes };
//       delete updatedNotes[currentPage];
//       setPageNotes(updatedNotes);
//       setCurrentPageNote('');
//       localStorage.setItem(`submission_notes_${id}`, JSON.stringify(updatedNotes));
//       toast.success(`Note deleted for page ${currentPage}`);
//     };

//     // Merge all page notes into one text
//     const mergeAllNotes = () => {
//       const sortedPages = Object.keys(pageNotes).sort((a, b) => Number(a) - Number(b));
//       let mergedNotes = '';

//       sortedPages.forEach((page, index) => {
//         if (pageNotes[page].trim()) {
//           mergedNotes += `<strong>Page ${page}:</strong><br/>${pageNotes[page]}<br/><br/>`;
//         }
//       });

//       return mergedNotes;
//     };
//   // NEW: Handle editor send back to author
//   const handleEditorSendBack = async () => {
//     if (!actionNotes) {
//       toast.error('Please provide notes for the author');
//       return;
//     }

//     const result = await dispatch(editorSendBack({ id, editorNotes: actionNotes }));
//     if (result.type === 'submissions/editorSendBack/fulfilled') {
//       toast.success('Submission sent back to author for changes');
//       setShowActionModal(null);
//       setActionNotes('');
//       dispatch(getSubmission(id));
//     }
//   };
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   const handleOpenPdf = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       // Check file type first
//       const isDocx = currentSubmission.documentFile.filename.toLowerCase().endsWith('.docx') ||
//         currentSubmission.documentFile.mimetype?.includes('wordprocessingml');

//       if (isDocx) {
//         // For DOCX files, trigger download instead of viewing
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/submissions/${id}/stream-document`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (response.ok) {
//           const blob = await response.blob();
//           const url = URL.createObjectURL(blob);

//           // Create a temporary link and trigger download
//           const a = document.createElement('a');
//           a.href = url;
//           a.download = currentSubmission.documentFile.filename;
//           document.body.appendChild(a);
//           a.click();
//           document.body.removeChild(a);
//           URL.revokeObjectURL(url);

//           toast.info('DOCX file downloaded. Please open it in Microsoft Word or compatible software.');
//         } else {
//           toast.error('Failed to download document');
//         }
//       } else {
//         // For PDF files, open in viewer
//         const response = await fetch(`https://ms-publication-backend.onrender.com/api/submissions/${id}/stream-document`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });
//         console.log(response);
//         if (response.ok) {
//           const blob = await response.blob();
//           const url = URL.createObjectURL(blob);
//           setPdfUrl(url);
//           setShowPdfViewer(true);
//         } else {
//           toast.error('Failed to load document');
//         }
//       }
//     } catch (error) {
//       console.error('Error loading document:', error);
//       toast.error('Error loading document');
//     }
//   };

//   const handleClosePdf = () => {
//     if (pdfUrl) {
//       URL.revokeObjectURL(pdfUrl);
//       setPdfUrl(null);
//     }
//     setShowPdfViewer(false);
//   };

//   const handleSendBack = async () => {
//     // Auto-populate with merged notes if not already filled
//     if (!actionNotes && Object.keys(pageNotes).length > 0) {
//       const merged = mergeAllNotes();
//       setActionNotes(merged);
//       return; // Don't submit yet, let reviewer review the merged notes
//     }

//     if (!actionNotes) {
//       toast.error('Please provide notes for the editor');
//       return;
//     }

//     const result = await dispatch(reviewerSendBack({ id, reviewerNotes: actionNotes }));
//     if (result.type === 'submissions/reviewerSendBack/fulfilled') {
//       toast.success('Submission sent back to editor');
//       setShowActionModal(null);
//       setActionNotes('');
//       // Clear localStorage notes after successful send back
//       localStorage.removeItem(`submission_notes_${id}`);
//       setPageNotes({});
//       dispatch(getSubmission(id));
//     }
//   };

//   const handleBack = () => {
//     if (user.role === 'author') {
//       navigate('/author/dashboard');
//     } else if (user.role === 'editor') {
//       navigate(`/editor/journal/${currentSubmission?.journal}`);
//     } else {
//       navigate(`/reviewer/journal/${currentSubmission?.journal}`);
//     }
//   };

//   const handleSendEmail = async () => {
//     if (!emailSubject || !emailBody) {
//       toast.error('Please fill in subject and body');
//       return;
//     }

//     const result = await dispatch(sendEmail({
//       submissionId: id,
//       subject: emailSubject,
//       body: emailBody,
//       images: emailImages
//     }));

//     if (result.type === 'emails/send/fulfilled') {
//       toast.success('Email sent successfully');
//       setShowEmailComposer(false);
//       setEmailSubject('');
//       setEmailBody('');
//       setEmailImages([]);
//       dispatch(getSubmissionEmails(id));
//     }
//   };

//   const handleApprove = async () => {
//     if (user.role === 'editor') {
//       const result = await dispatch(approveSubmission({ id, editorNotes: actionNotes }));
//       if (result.type === 'submissions/approve/fulfilled') {
//         toast.success('Submission approved');
//         setShowActionModal(null);
//         setActionNotes('');
//         dispatch(getSubmission(id));
//       }
//     } else if (user.role === 'reviewer') {
//       const result = await dispatch(reviewerApprove({ id, reviewerNotes: actionNotes }));
//       if (result.type === 'submissions/reviewerApprove/fulfilled') {
//         toast.success('Submission approved');
//         setShowActionModal(null);
//         setActionNotes('');
//         dispatch(getSubmission(id));
//       }
//     }
//   };

//   const handleReject = async () => {
//     if (!actionNotes) {
//       toast.error('Please provide a rejection reason');
//       return;
//     }

//     if (user.role === 'editor') {
//       const result = await dispatch(rejectSubmission({ id, rejectionReason: actionNotes }));
//       if (result.type === 'submissions/reject/fulfilled') {
//         toast.success('Submission rejected');
//         setShowActionModal(null);
//         setActionNotes('');
//         dispatch(getSubmission(id));
//       }
//     } else if (user.role === 'reviewer') {
//       const result = await dispatch(reviewerReject({ id, rejectionReason: actionNotes }));
//       if (result.type === 'submissions/reviewerReject/fulfilled') {
//         toast.success('Submission rejected');
//         setShowActionModal(null);
//         setActionNotes('');
//         dispatch(getSubmission(id));
//       }
//     }
//   };

//   const handleMoveToReviewer = () => {
//     setShowActionModal('send_to_reviewer');
//     // const result = await dispatch(moveToReviewer(id));
//     // if (result.type === 'submissions/moveToReviewer/fulfilled') {
//     //   toast.success('Submission moved to reviewer');
//     //   dispatch(getSubmission(id));
//     // }
//   };
//   const handleSendToReviewer = async () => {
//     const result = await dispatch(moveToReviewer({ id, editorNotes: actionNotes }));
//     if (result.type === 'submissions/moveToReviewer/fulfilled') {
//       toast.success('Submission moved to reviewer');
//       dispatch(getSubmission(id));
//     }
//   }
//   const handleSchedule = async () => {
//     if (!publicationDate) {
//       toast.error('Please select a publication date');
//       return;
//     }

//     const result = await dispatch(schedulePublication({ id, publicationDate }));
//     if (result.type === 'submissions/schedule/fulfilled') {
//       toast.success('Publication scheduled');
//       setShowActionModal(null);
//       setPublicationDate('');
//       dispatch(getSubmission(id));
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       draft: { class: 'bg-slate-100 text-slate-700 border-slate-300', text: 'Draft', icon: FaFileAlt },
//       pending: { class: 'bg-amber-50 text-amber-700 border-amber-300', text: 'Pending Review', icon: FaClock },
//       approved_by_editor: { class: 'bg-sky-50 text-sky-700 border-sky-300', text: 'Approved by Editor', icon: FaCheck },
//       rejected_by_editor: { class: 'bg-rose-50 text-rose-700 border-rose-300', text: 'Rejected', icon: FaBan },
//       with_reviewer: { class: 'bg-violet-50 text-violet-700 border-violet-300', text: 'With Reviewer', icon: FaUser },
//       approved_by_reviewer: { class: 'bg-emerald-50 text-emerald-700 border-emerald-300', text: 'Approved by reviewer', icon: FaCheck },
//       rejected_by_reviewer: { class: 'bg-rose-50 text-rose-700 border-rose-300', text: 'Rejected', icon: FaBan },
//       scheduled: { class: 'bg-indigo-50 text-indigo-700 border-indigo-300', text: 'Scheduled', icon: FaCalendar },
//       published: { class: 'bg-teal-50 text-teal-700 border-teal-300', text: 'Published', icon: FaBook },
//     };
//     return statusMap[status] || { class: 'bg-slate-100 text-slate-700 border-slate-300', text: status, icon: FaFileAlt };
//   };

//   const canShowActions = () => {
//     if (user.role === 'editor') {
//       return ['pending', 'approved_by_editor', 'approved_by_reviewer', 'with_reviewer'].includes(currentSubmission?.status);
//     } else if (user.role === 'reviewer') {
//       return currentSubmission?.status === 'with_reviewer';
//     }
//     return false;
//   };

//   const canSendEmail = () => {
//     return user.role === 'author' || user.role === 'editor';
//   };

//   if (isLoading || !currentSubmission) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50">
//         <div className="text-center">
//           <div className="relative w-20 h-20 mx-auto mb-6">
//             <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-ping"></div>
//             <div className="absolute inset-0 border-4 border-t-teal-600 border-r-amber-400 border-b-teal-600 border-l-amber-400 rounded-full animate-spin"></div>
//           </div>
//           <p className="text-lg font-medium text-gray-700 animate-pulse">Loading submission...</p>
//         </div>
//       </div>
//     );
//   }

//   const badge = getStatusBadge(currentSubmission.status);
//   const StatusIcon = badge.icon;

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-teal-50">
//       <style>{`
//       @media print {
//   .no-print-for-reviewer {
//     display: none !important;
//   }
// }
//         @keyframes slideDown {
//           from { transform: translateY(-100%); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         @keyframes fadeInUp {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         @keyframes scaleIn {
//           from { transform: scale(0.9); opacity: 0; }
//           to { transform: scale(1); opacity: 1; }
//         }
//         @keyframes shimmer {
//           0% { background-position: -1000px 0; }
//           100% { background-position: 1000px 0; }
//         }
//         .animate-slide-down { animation: slideDown 0.5s ease-out; }
//         .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
//         .animate-scale-in { animation: scaleIn 0.4s ease-out; }
//         .animate-delay-100 { animation-delay: 0.1s; animation-fill-mode: both; }
//         .animate-delay-200 { animation-delay: 0.2s; animation-fill-mode: both; }
//         .animate-delay-300 { animation-delay: 0.3s; animation-fill-mode: both; }
//         .glass-morphism {
//           background: rgba(255, 255, 255, 0.7);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.3);
//         }
//         .hover-lift {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//         }
//         .hover-lift:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
//         }
//         .gradient-border {
//           position: relative;
//           background: white;
//         }
//         .gradient-border::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           border-radius: inherit;
//           padding: 2px;
//           background: linear-gradient(135deg, #0d9488, #fbbf24);
//           -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
//           -webkit-mask-composite: xor;
//           mask-composite: exclude;
//         }
//         .shimmer-bg {
//           background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
//           background-size: 200% 100%;
//           animation: shimmer 2s infinite;
//         }
//       `}</style>

//       {/* Top Header with gradient */}
//       <div className={`h-16 bg-gradient-to-r ${user.role === 'editor' ? 'from-teal-600 via-teal-700 to-teal-800' :
//           user.role === 'reviewer' ? 'from-violet-600 via-purple-700 to-violet-800' :
//             'from-emerald-600 via-teal-700 to-emerald-800'
//         } flex items-center justify-between px-8 text-white shadow-xl animate-slide-down`}>
//         <div className="flex items-center space-x-6">
//           <button
//             onClick={handleBack}
//             className="group flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
//           >
//             <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             <span className="font-medium">Back</span>
//           </button>
//           <div className="h-10 w-px bg-white/30"></div>
//           <div className="flex items-center space-x-3">
//             <FaBook className="w-5 h-5" />
//             <h1 className="text-xl font-bold tracking-wide">Submission Details</h1>
//           </div>
//         </div>
//         <div className="flex items-center space-x-6">
//           <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg">
//             <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
//               <FaUser className="w-4 h-4 text-teal-900" />
//             </div>
//             <div>
//               <div className="text-xs opacity-80">Signed in as</div>
//               <div className="text-sm font-semibold">{user?.firstName} {user?.lastName}</div>
//             </div>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
//           >
//             <FaSignOutAlt className="w-4 h-4" />
//             <span className="font-medium">Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Left Panel - Submission Details */}
//         <div className="flex-1 overflow-y-auto p-8 space-y-6">
//           {/* Status Card */}
//           <div className="glass-morphism rounded-2xl shadow-xl p-8 animate-fade-in-up hover-lift">
//             <div className="flex items-center justify-between flex-wrap gap-4">
//               <div className="flex items-center space-x-4">
//                 <div className={`w-16 h-16 rounded-2xl ${badge.class.replace('bg-', 'bg-gradient-to-br from-').replace('text-', 'to-')} flex items-center justify-center shadow-lg`}>
//                   <StatusIcon className="w-8 h-8 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-sm text-gray-500 mb-1">Current Status</div>
//                   <span className={`inline-flex items-center space-x-2 ${badge.class} border-2 text-base font-bold px-6 py-2 rounded-xl`}>
//                     <StatusIcon className="w-4 h-4" />
//                     <span>{badge.text}</span>
//                   </span>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 {/* Edit Button for Author */}
//                 {user.role === 'author' && canEdit && (
//                   <button
//                     onClick={() => navigate(`/author/edit-submission/${id}`)}
//                     className="group flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                   >
//                     <FaEdit className="group-hover:rotate-12 transition-transform" />
//                     <span>Edit Submission</span>
//                   </button>
//                 )}

//                 {/* Editor/Reviewer Actions */}
//                 {canShowActions() && (
//                   <>
//                     {user.role === 'editor' && currentSubmission.status !== 'approved_by_editor' && (
//                       <>
//                         <button
//                           onClick={() => setShowActionModal('approve')}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaCheck className="group-hover:scale-125 transition-transform" />
//                           <span>Approve</span>
//                         </button>
//                         <button
//                           onClick={() => setShowActionModal('reject')}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaBan className="group-hover:rotate-180 transition-transform duration-500" />
//                           <span>Reject</span>
//                         </button>
//                         <button
//                           onClick={() => setShowActionModal('editor_sendback')}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
//                           <span>Send Back to Author</span>
//                         </button>
//                       </>
//                     )}

//                     {user.role === 'editor' && currentSubmission.status !== 'with_reviewer' && currentSubmission.status !== 'approved_by_editor' && (
//                       <button
//                         onClick={handleMoveToReviewer}
//                         className="group flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                       >
//                         <FaForward className="group-hover:translate-x-1 transition-transform" />
//                         <span>Move to Reviewer</span>
//                       </button>

//                     )}



//                     {user.role === 'editor' && currentSubmission.status === 'approved_by_editor' && (
//                       <> <button
//                         onClick={() => setShowActionModal('schedule')}
//                         className="group flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                       >
//                         <FaCalendar className="group-hover:scale-110 transition-transform" />
//                         <span>Schedule Publication</span>
//                       </button>
//                         {/* NEW: Can also send back after approval if needed */}
//                         <button
//                           onClick={() => setShowActionModal('editor_sendback')}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
//                           <span>Send Back to Author</span>
//                         </button>

//                       </>

//                     )}

//                     {user.role === 'reviewer' && currentSubmission.status === 'with_reviewer' && (
//                       <>
//                         <button
//                           onClick={() => setShowActionModal('approve')}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaCheck className="group-hover:scale-125 transition-transform" />
//                           <span>Approve</span>
//                         </button>
//                         <button
//                           onClick={() => setShowActionModal('reject')}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaBan className="group-hover:rotate-180 transition-transform duration-500" />
//                           <span>Reject</span>
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowActionModal('sendback');
//                             // Auto-populate with merged notes
//                             if (Object.keys(pageNotes).length > 0) {
//                               const merged = mergeAllNotes();
//                               setActionNotes(merged);
//                             }
//                           }}
//                           className="group flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                         >
//                           <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
//                           <span>Send Back</span>
//                         </button>
//                       </>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Edit hint for rejected submissions */}
//             {user.role === 'author' && canEdit && currentSubmission.status.includes('rejected') && (
//               <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 animate-scale-in">
//                 <div className="flex items-start space-x-3">
//                   <FaBan className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
//                   <div>
//                     <p className="font-bold text-amber-900 mb-1">Submission Rejected</p>
//                     <p className="text-sm text-amber-800">
//                       You can edit and resubmit your submission using the Edit button above.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Submission Info Grid */}
//             <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="group">
//                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Journal</div>
//                 <div className="font-bold text-gray-900 capitalize text-lg group-hover:text-teal-600 transition-colors">
//                   {currentSubmission.journal}
//                 </div>
//               </div>
//               <div className="group">
//                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Section</div>
//                 <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
//                   {currentSubmission.section}
//                 </div>
//               </div>
//               <div className="group">
//                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Author</div>
//                 <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
//                   {currentSubmission.author?.firstName} {currentSubmission.author?.lastName}
//                 </div>
//               </div>
//               <div className="group">
//                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Submitted</div>
//                 <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
//                   {currentSubmission.submittedAt
//                     ? format(new Date(currentSubmission.submittedAt), 'MMM dd, yyyy')
//                     : 'Not submitted'}
//                 </div>
//               </div>
//               {currentSubmission.publicationDate && (
//                 <div className="group">
//                   <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Publication Date</div>
//                   <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
//                     {format(new Date(currentSubmission.publicationDate), 'MMM dd, yyyy')}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Article Details Card */}
//           <div className="glass-morphism rounded-2xl shadow-xl p-8 animate-fade-in-up animate-delay-100 hover-lift">
//             <div className="mb-6 flex items-center space-x-3">
//               <div className="w-1 h-8 bg-gradient-to-b from-teal-600 to-amber-400 rounded-full"></div>
//               <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-teal-700 to-amber-600 bg-clip-text text-transparent">
//                 {currentSubmission.metadata?.title}
//               </h2>
//             </div>
//             {/* {user.role === 'author' && currentSubmission.editorNotes && currentSubmission.status === 'pending' && (
//               <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 animate-scale-in">
//                 <h3 className="font-bold text-amber-900 mb-3 text-lg flex items-center space-x-2">
//                   <FaUndo className="w-5 h-5" />
//                   <span>Editor's Feedback - Changes Required</span>
//                 </h3>
//                 <div 
//                   className="text-amber-900 prose max-w-none"
//                   dangerouslySetInnerHTML={{ __html: currentSubmission.editorNotes }}
//                 />
//                 <p className="text-sm text-amber-700 mt-4 italic bg-white/50 rounded-lg p-3 border border-amber-200">
//                   The editor has reviewed your submission and is requesting some changes. Please update your submission using the Edit button above.
//                 </p>
//               </div>
//             )} */}

//             {currentSubmission.metadata?.subtitle && (
//               <p className="text-xl text-gray-600 mb-6 font-medium italic">{currentSubmission.metadata.subtitle}</p>
//             )}

//             <div className="mb-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border-l-4 border-teal-600">
//               <h3 className="font-bold text-teal-900 mb-3 text-lg flex items-center space-x-2">
//                 <FaFileAlt className="w-5 h-5" />
//                 <span>Abstract</span>
//               </h3>

//               <div
//                 className="text-gray-800 leading-relaxed prose prose-teal max-w-none"
//                 dangerouslySetInnerHTML={{
//                   __html: currentSubmission.metadata?.abstract || "",
//                 }}
//               />
//             </div>


//             {currentSubmission.metadata?.keywords && currentSubmission.metadata.keywords.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="font-bold text-gray-900 mb-3 text-lg">Keywords</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {currentSubmission.metadata.keywords.map((keyword, idx) => (
//                     <span
//                       key={idx}
//                       className="bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold border-2 border-teal-200 hover:scale-110 hover:shadow-md transition-all duration-300 cursor-default"
//                     >
//                       {keyword}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {currentSubmission.documentFile && (
//               <div className="mt-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border-2 border-gray-200">
//                 <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center space-x-2">
//                   <FaFileAlt className="w-5 h-5 text-teal-600" />
//                   <span>Document</span>
//                 </h3>
//                 <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border-2 border-teal-600">
//                   <div className="flex items-center space-x-3">
//                     <FaFileAlt className="w-5 h-5 text-teal-600" />
//                     <span className="font-medium text-teal-700">
//                       {currentSubmission.documentFile.filename}
//                     </span>
//                   </div>
//                   <button
//                     onClick={handleOpenPdf}
//                     className="flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                   >
//                     <FaFileAlt className="w-4 h-4" />
//                     <span>Open Document</span>
//                   </button>
//                 </div>
//               </div>
//             )}

//             {currentSubmission.rejectionReason && (
//               <div className="mt-6 bg-gradient-to-r from-rose-50 to-red-50 border-2 border-rose-300 rounded-xl p-6 animate-scale-in">
//                 <h3 className="font-bold text-rose-900 mb-3 text-lg flex items-center space-x-2">
//                   <FaBan className="w-5 h-5" />
//                   <span>Rejection Reason</span>
//                 </h3>
//                 <p className="text-rose-800 leading-relaxed">{currentSubmission.rejectionReason}</p>
//               </div>
//             )}

//             {/* Reviewer Notes for Editor */}
//             {/* {user.role === 'editor' && currentSubmission.reviewerNotes && currentSubmission.status === 'approved_by_editor' && (
//               <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl p-6 animate-scale-in">
//                 <h3 className="font-bold text-orange-900 mb-3 text-lg flex items-center space-x-2">
//                   <FaUndo className="w-5 h-5" />
//                   <span>Reviewer's Notes - Changes Required</span>
//                 </h3>
//                 <div 
//                   className="text-orange-900 prose max-w-none"
//                   dangerouslySetInnerHTML={{ __html: currentSubmission.reviewerNotes }}
//                 />
//                 <p className="text-sm text-orange-700 mt-4 italic bg-white/50 rounded-lg p-3 border border-orange-200">
//                   The reviewer has sent this submission back for your review. Please check the notes above and take appropriate action.
//                 </p>
//               </div>
//             )} */}

//             {/* Reviewer Notes in General
//             {currentSubmission.reviewerNotes && currentSubmission.status !== 'approved_by_editor' && (
//               <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
//                 <h3 className="font-bold text-blue-900 mb-3 text-lg flex items-center space-x-2">
//                   <FaFileAlt className="w-5 h-5" />
//                   <span>Reviewer's Notes</span>
//                 </h3>
//                 <div 
//                   className="text-blue-900 prose max-w-none"
//                   dangerouslySetInnerHTML={{ __html: currentSubmission.reviewerNotes }}
//                 />
//               </div>
//             )} */}
//           </div>

//           {/* Timeline */}
//           {currentSubmission.timeline && currentSubmission.timeline.length > 0 && (
//             <div className="animate-fade-in-up animate-delay-200">
//               <SubmissionTimeline timeline={currentSubmission.timeline} />
//             </div>
//           )}
//         </div>

//         {/* Right Panel - Email Communication */}
//         {canSendEmail() && (
//           <div className="w-[420px] border-l-2 border-teal-100 flex flex-col bg-gradient-to-b from-white to-teal-50/30">
//             <div className="p-6 border-b-2 border-teal-100 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-bold text-lg flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
//                     <FaEnvelope className="w-5 h-5 text-teal-900" />
//                   </div>
//                   <span>Communication</span>
//                 </h3>
//                 <button
//                   onClick={() => setShowEmailComposer(!showEmailComposer)}
//                   className="bg-white text-teal-700 hover:bg-amber-400 hover:text-teal-900 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg"
//                 >
//                   {showEmailComposer ? 'Cancel' : '+ New Message'}
//                 </button>
//               </div>
//             </div>

//             {/* Email Composer */}
//             {showEmailComposer && (
//               <div className="p-6 border-b-2 border-teal-100 bg-white animate-scale-in space-y-4">
//                 <input
//                   type="text"
//                   placeholder="Subject"
//                   value={emailSubject}
//                   onChange={(e) => setEmailSubject(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
//                 />
//                 <textarea
//                   placeholder="Type your message..."
//                   value={emailBody}
//                   onChange={(e) => setEmailBody(e.target.value)}
//                   rows={5}
//                   className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-none"
//                 />
//                 <div className="flex items-center justify-between">
//                   <label className="cursor-pointer text-sm text-teal-700 hover:text-teal-900 font-medium flex items-center space-x-2 hover:scale-105 transition-transform">
//                     <FaImage className="w-4 h-4" />
//                     <span>Attach Images</span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={(e) => setEmailImages(Array.from(e.target.files))}
//                       className="hidden"
//                     />
//                   </label>
//                   {emailImages.length > 0 && (
//                     <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-bold">
//                       {emailImages.length} image(s)
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={handleSendEmail}
//                   className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
//                 >
//                   <FaPaperPlane />
//                   <span>Send Message</span>
//                 </button>
//               </div>
//             )}

//             {/* Email Thread */}
//             <div className="flex-1 overflow-y-auto p-6">
//               {emails.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
//                     <FaEnvelope className="w-10 h-10 text-teal-600" />
//                   </div>
//                   <p className="text-gray-500 font-medium">No messages yet</p>
//                   <p className="text-sm text-gray-400 mt-1">Start a conversation</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {emails.map((email, idx) => {
//                     const isFromMe = email.sender._id === user.id;
//                     return (
//                       <div
//                         key={email._id}
//                         className={`animate-fade-in-up ${isFromMe ? 'ml-6' : 'mr-6'}`}
//                         style={{ animationDelay: `${idx * 0.1}s` }}
//                       >
//                         <div
//                           className={`p-4 rounded-2xl ${isFromMe
//                               ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg'
//                               : 'bg-white border-2 border-gray-200 shadow-md hover-lift'
//                             }`}
//                         >
//                           <div className="flex items-start justify-between mb-2">
//                             <div className={`font-bold text-sm ${isFromMe ? 'text-white' : 'text-gray-900'}`}>
//                               {isFromMe ? 'You' : `${email.sender.firstName} ${email.sender.lastName}`}
//                             </div>
//                             <div className={`text-xs ${isFromMe ? 'text-teal-100' : 'text-gray-500'}`}>
//                               {format(new Date(email.sentAt), 'MMM dd, HH:mm')}
//                             </div>
//                           </div>
//                           <div className={`text-sm font-bold mb-2 ${isFromMe ? 'text-white' : 'text-gray-900'}`}>
//                             {email.subject}
//                           </div>
//                           <div className={`text-sm whitespace-pre-wrap ${isFromMe ? 'text-white' : 'text-gray-700'}`}>
//                             {email.body}
//                           </div>
//                           {email.attachments && email.attachments.length > 0 && (
//                             <div className="mt-3 space-y-2">
//                               {email.attachments.map((att, idx) => (
//                                 <img
//                                   key={idx}
//                                   src={att.url}
//                                   alt={att.filename}
//                                   className="max-w-full rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
//                                 />
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Action Modal */}
//       {showActionModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-scale-in">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
//             <div className={`p-6 bg-gradient-to-r ${showActionModal === 'approve' ? 'from-emerald-500 to-teal-600' :
//                 showActionModal === 'reject' ? 'from-rose-500 to-red-600' :
//                   showActionModal === 'editor_sendback' ? 'from-amber-500 to-orange-600' :
//                     showActionModal === 'sendback' ? 'from-orange-500 to-amber-600' :
//                       'from-indigo-500 to-blue-600'
//               } text-white rounded-t-2xl`}>
//               <h3 className="text-2xl font-bold capitalize flex items-center space-x-3">
//                 {showActionModal === 'editor_sendback' && <FaUndo className="w-6 h-6" />}
//                 <span>
//                   {showActionModal === 'editor_sendback' ? 'Send Back to Author' :
//                     showActionModal === 'sendback' ? 'Send Back to Editor' :
//                       showActionModal === 'schedule' ? 'Schedule Publication' :
//                         `${showActionModal} Submission`}
//                 </span>
//               </h3>
//             </div>

//             <div className="p-6">
//               {showActionModal === 'schedule' ? (
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-3">
//                     Publication Date
//                   </label>
//                   <input
//                     type="date"
//                     value={publicationDate}
//                     onChange={(e) => setPublicationDate(e.target.value)}
//                     min={new Date().toISOString().split('T')[0]}
//                     className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
//                   />
//                 </div>
//               ) : (showActionModal === 'sendback' || showActionModal === 'editor_sendback') ? (
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-2">
//                     {showActionModal === 'editor_sendback' ? 'Notes for Author *' : 'Notes for Editor *'}
//                   </label>
//                   <p className="text-sm text-gray-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
//                     Please explain what changes or corrections are needed in the submission.
//                   </p>
//                   <ReactQuill
//                     theme="snow"
//                     value={actionNotes}
//                     onChange={setActionNotes}
//                     modules={{
//                       toolbar: [
//                         [{ 'header': [1, 2, 3, false] }],
//                         ['bold', 'italic', 'underline'],
//                         [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//                         ['clean']
//                       ]
//                     }}
//                     placeholder="Enter detailed notes about required changes..."
//                     style={{ height: '200px', marginBottom: '50px' }}
//                   />
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm font-bold text-gray-700 mb-3">
//                     {showActionModal === 'reject' ? 'Rejection Reason *' : 'Notes (Optional)'}
//                   </label>
//                   <textarea
//                     value={actionNotes}
//                     onChange={(e) => setActionNotes(e.target.value)}
//                     rows={8}
//                     className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-none"
//                     placeholder={showActionModal === 'reject' ? 'Please provide detailed feedback...' : 'Add any notes...'}
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end space-x-4 p-6 bg-gray-50 rounded-b-2xl">
//               <button
//                 onClick={() => {
//                   setShowActionModal(null);
//                   setActionNotes('');
//                   setPublicationDate('');
//                 }}
//                 className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-medium transition-all duration-300 hover:scale-105"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={
//                   showActionModal === 'send_to_reviewer' ? handleSendToReviewer :
//                     showActionModal === 'approve' ? handleApprove :
//                       showActionModal === 'reject' ? handleReject :
//                         showActionModal === 'editor_sendback' ? handleEditorSendBack :
//                           showActionModal === 'sendback' ? handleSendBack :
//                             handleSchedule
//                 }
//                 className={`px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${showActionModal === 'approve' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700' :
//                     showActionModal === 'reject' ? 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700' :
//                       (showActionModal === 'sendback' || showActionModal === 'editor_sendback') ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700' :
//                         'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700'
//                   }`}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* PDF Viewer Modal */}
//       {/* Enhanced PDF Viewer Modal */}
//      {/* Enhanced PDF Viewer Modal with Notes Panel */}
// {showPdfViewer && (
//   <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
//     {/* Header */}
//     <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-4 flex items-center justify-between">
//       <div className="flex items-center space-x-3">
//         <FaFileAlt className="w-5 h-5" />
//         <span className="font-bold text-lg">{currentSubmission.documentFile.filename}</span>
//       </div>
//       <div className="flex items-center space-x-3">
//         {user.role === 'reviewer' && (
//           <>
//             {/* Page Navigation */}
//             <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
//               <button
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 className="hover:bg-white/20 px-2 py-1 rounded transition-all"
//               >
//                 ←
//               </button>
//               <span className="font-medium">
//                 Page <input 
//                   type="number" 
//                   value={currentPage} 
//                   onChange={(e) => setCurrentPage(Math.max(1, parseInt(e.target.value) || 1))}
//                   className="w-12 bg-transparent text-center border-b border-white/50 focus:outline-none"
//                   min="1"
//                 />
//               </span>
//               <button
//                 onClick={() => setCurrentPage(currentPage + 1)}
//                 className="hover:bg-white/20 px-2 py-1 rounded transition-all"
//               >
//                 →
//               </button>
//             </div>
            
//             {/* Toggle Notes Panel */}
//             <button
//               onClick={() => setShowNotesPanel(!showNotesPanel)}
//               className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
//                 showNotesPanel ? 'bg-amber-500' : 'bg-white/20 hover:bg-white/30'
//               }`}
//             >
//               <FaFileAlt className="w-4 h-4" />
//               <span className="font-medium">
//                 {showNotesPanel ? 'Hide' : 'Show'} Notes
//                 {Object.keys(pageNotes).length > 0 && (
//                   <span className="ml-2 bg-white text-teal-700 text-xs px-2 py-0.5 rounded-full">
//                     {Object.keys(pageNotes).length}
//                   </span>
//                 )}
//               </span>
//             </button>
//           </>
//         )}
//         <button
//           onClick={handleClosePdf}
//           className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-300"
//         >
//           <FaTimes className="w-4 h-4" />
//           <span className="font-medium">Close</span>
//         </button>
//       </div>
//     </div>

//     {/* Screenshot Warning Banner */}
//     {showScreenshotWarning && (
//       <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-center space-x-3 animate-pulse">
//         <FaBan className="w-5 h-5" />
//         <span className="font-bold">
//           Screenshot attempt detected and logged! This action may result in access revocation.
//         </span>
//       </div>
//     )}

//     {/* Main Content Area */}
//     <div className="flex-1 flex overflow-hidden">
//       {/* PDF Viewer */}
//       <div 
//         className={`flex-1 overflow-auto bg-gray-800 relative transition-all duration-300 ${
//           showNotesPanel ? 'mr-96' : ''
//         }`}
//         style={{
//           userSelect: user.role === 'reviewer' ? 'none' : 'auto',
//           WebkitUserSelect: user.role === 'reviewer' ? 'none' : 'auto',
//           MozUserSelect: user.role === 'reviewer' ? 'none' : 'auto',
//           msUserSelect: user.role === 'reviewer' ? 'none' : 'auto',
//           WebkitTouchCallout: user.role === 'reviewer' ? 'none' : 'auto'
//         }}
//         onContextMenu={(e) => {
//           if (user.role === 'reviewer') {
//             e.preventDefault();
//             setShowScreenshotWarning(true);
//             setTimeout(() => setShowScreenshotWarning(false), 2000);
//           }
//         }}
//         onCopy={(e) => user.role === 'reviewer' && e.preventDefault()}
//         onCut={(e) => user.role === 'reviewer' && e.preventDefault()}
//         onPaste={(e) => user.role === 'reviewer' && e.preventDefault()}
//         onDragStart={(e) => user.role === 'reviewer' && e.preventDefault()}
//       >
//         {pdfUrl && (
//           <iframe
//             src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH&page=${currentPage}`}
//             className="w-full h-full"
//             title="PDF Viewer"
//             style={{
//               border: 'none',
//               pointerEvents: 'auto'
//             }}
//           />
//         )}

//         {/* Watermarks for Reviewers */}
//         {user.role === 'reviewer' && (
//           <>
//             <div 
//               className="absolute pointer-events-none transition-all duration-2000 ease-linear"
//               style={{
//                 left: `${watermarkPosition.x}%`,
//                 top: `${watermarkPosition.y}%`,
//                 transform: 'translate(-50%, -50%)',
//                 zIndex: 10
//               }}
//             >
//               <div className="text-red-500/30 text-4xl font-bold transform -rotate-45 select-none whitespace-nowrap">
//                 {user.firstName} {user.lastName} - {user.email}
//               </div>
//               <div className="text-red-500/20 text-sm text-center mt-2">
//                 {new Date().toLocaleString()}
//               </div>
//             </div>

//             <div className="absolute top-4 left-4 text-white/20 text-xs font-mono pointer-events-none">
//               Reviewer: {user.firstName} {user.lastName}<br/>
//               {new Date().toLocaleString()}<br/>
//               ID: {id}
//             </div>
//             <div className="absolute top-4 right-4 text-white/20 text-xs font-mono pointer-events-none text-right">
//               CONFIDENTIAL<br/>
//               DO NOT COPY<br/>
//               DO NOT SHARE
//             </div>
//             <div className="absolute bottom-4 left-4 text-white/20 text-xs font-mono pointer-events-none">
//               All access logged
//             </div>
//             <div className="absolute bottom-4 right-4 text-white/20 text-xs font-mono pointer-events-none text-right">
//               {user.email}
//             </div>

//             <div 
//               className="absolute inset-0 pointer-events-none opacity-10"
//               style={{
//                 backgroundImage: `repeating-linear-gradient(
//                   45deg,
//                   transparent,
//                   transparent 100px,
//                   rgba(255, 0, 0, 0.1) 100px,
//                   rgba(255, 0, 0, 0.1) 101px
//                 )`,
//                 zIndex: 5
//               }}
//             />
//           </>
//         )}
//       </div>

//       {/* Notes Panel for Reviewers */}
//       {user.role === 'reviewer' && showNotesPanel && (
//         <div className="w-96 bg-white shadow-2xl flex flex-col overflow-hidden">
//           {/* Notes Header */}
//           <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4">
//             <h3 className="font-bold text-lg flex items-center space-x-2">
//               <FaFileAlt className="w-5 h-5" />
//               <span>Notes for Page {currentPage}</span>
//             </h3>
//             {pageNotes[currentPage] && (
//               <p className="text-xs mt-1 opacity-90">Note exists for this page</p>
//             )}
//           </div>

//           {/* Notes Content */}
//           <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
//             {/* Current Page Note Editor */}
//             <div className="flex-1 flex flex-col">
//               <label className="text-sm font-bold text-gray-700 mb-2">
//                 Note for Page {currentPage}
//               </label>
//               <textarea
//                 value={currentPageNote}
//                 onChange={(e) => setCurrentPageNote(e.target.value)}
//                 placeholder={`Write notes about issues found on page ${currentPage}...`}
//                 className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all resize-none min-h-[200px]"
//               />
//             </div>

//             {/* Save/Delete Buttons */}
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleSavePageNote}
//                 disabled={!currentPageNote.trim()}
//                 className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
//               >
//                 <FaCheck className="w-4 h-4" />
//                 <span>Save Note</span>
//               </button>
//               {pageNotes[currentPage] && (
//                 <button
//                   onClick={handleDeletePageNote}
//                   className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
//                 >
//                   <FaTimes className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* All Notes Summary */}
//             {Object.keys(pageNotes).length > 0 && (
//               <div className="border-t-2 border-gray-200 pt-4 mt-4">
//                 <h4 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
//                   <span>All Notes ({Object.keys(pageNotes).length} pages)</span>
//                   <button
//                     onClick={() => {
//                       if (window.confirm('Clear all notes?')) {
//                         setPageNotes({});
//                         setCurrentPageNote('');
//                         localStorage.removeItem(`submission_notes_${id}`);
//                         toast.success('All notes cleared');
//                       }
//                     }}
//                     className="text-xs text-red-600 hover:text-red-700 font-normal"
//                   >
//                     Clear All
//                   </button>
//                 </h4>
//                 <div className="space-y-2 max-h-48 overflow-y-auto">
//                   {Object.keys(pageNotes)
//                     .sort((a, b) => Number(a) - Number(b))
//                     .map((page) => (
//                       <div
//                         key={page}
//                         onClick={() => setCurrentPage(Number(page))}
//                         className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                           Number(page) === currentPage
//                             ? 'border-amber-500 bg-amber-50'
//                             : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="font-bold text-sm text-gray-900">
//                             Page {page}
//                           </span>
//                           <span className="text-xs text-gray-500">
//                             {pageNotes[page].length} chars
//                           </span>
//                         </div>
//                         <p className="text-xs text-gray-600 line-clamp-2">
//                           {pageNotes[page]}
//                         </p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>

//     {/* Bottom warning bar for reviewers */}
//     {user.role === 'reviewer' && (
//       <div className="bg-red-900 text-white px-6 py-3 text-center text-sm">
//         <strong>⚠️ CONFIDENTIAL DOCUMENT</strong> - Screenshots, screen recordings, and unauthorized sharing are strictly prohibited and logged. 
//         Violations may result in immediate access revocation and legal action.
//       </div>
//     )}
//   </div>
// )}
//     </div>
//   );
// }

// export default SubmissionDetail;