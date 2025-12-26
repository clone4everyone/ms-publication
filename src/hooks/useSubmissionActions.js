import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  approveSubmission,
  rejectSubmission,
  moveToReviewer,
  schedulePublication,
  reviewerApprove,
  reviewerReject,
  reviewerSendBack,
  editorSendBack,
  getSubmission
} from '../redux/slices/submissionSlice';

export function useSubmissionActions(id, actionNotes, publicationDate, setShowActionModal, setActionNotes, mergeAllNotes, pageNotes) {
  const dispatch = useDispatch();

  const handleApprove = async () => {
    const result = await dispatch(approveSubmission({ id, editorNotes: actionNotes }));
    if (result.type === 'submissions/approve/fulfilled') {
      toast.success('Submission approved');
      setShowActionModal(null);
      setActionNotes('');
      dispatch(getSubmission(id));
    }
  };

  const handleReject = async () => {
    if (!actionNotes) {
      toast.error('Please provide a rejection reason');
      return;
    }

    const result = await dispatch(rejectSubmission({ id, rejectionReason: actionNotes }));
    if (result.type === 'submissions/reject/fulfilled') {
      toast.success('Submission rejected');
      setShowActionModal(null);
      setActionNotes('');
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
      dispatch(getSubmission(id));
    }
  };

  const handleMoveToReviewer = async () => {
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
      dispatch(getSubmission(id));
    }
  };

  return {
    handleApprove,
    handleReject,
    handleEditorSendBack,
    handleSendBack,
    handleMoveToReviewer,
    handleSchedule
  };
}