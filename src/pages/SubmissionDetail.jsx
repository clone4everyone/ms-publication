// hey so now i want a functionality in author dashboard. the feature is chain like structure showing the reviewing process for the author's submission. right now like fifrst the author wlil submit the submission then the editor will review if the editor found somethign bad then the author will send the message from the dashboard to the author. now the author will make changes accordingly (edit the submition) , then the editor will review again if all check then the submition will forward to reviewer . now if the reviewer found the error thing the reviewer will communicate with the e .ditor right now there is no communication functionality between the editor and the author so built this one . And then the editor will send the same message to the author  

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit,FaUndo } from 'react-icons/fa';
import { canEditSubmission,reviewerSendBack } from '../redux/slices/submissionSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  getSubmission,
  approveSubmission,
  rejectSubmission,
  moveToReviewer,
  schedulePublication,
  reviewerApprove,
  reviewerReject
} from '../redux/slices/submissionSlice';
import { getSubmissionEmails, sendEmail } from '../redux/slices/emailSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { 
  FaArrowLeft, FaSignOutAlt, FaUser, FaDownload, FaEnvelope,
  FaPaperPlane, FaImage, FaTimes, FaCheck, FaBan, FaForward,
  FaCalendar, FaClock
} from 'react-icons/fa';
import { format } from 'date-fns';

function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { currentSubmission, isLoading, canEdit} = useSelector((state) => state.submissions);
  const { emails } = useSelector((state) => state.emails);

  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailImages, setEmailImages] = useState([]);
  const [showActionModal, setShowActionModal] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [publicationDate, setPublicationDate] = useState('');

  useEffect(() => {
    dispatch(getSubmission(id));
    dispatch(getSubmissionEmails(id));
  }, [dispatch, id]);
useEffect(() => {
  if (user.role === 'author' && id) {
    dispatch(canEditSubmission(id));
  }
}, [dispatch, id, user.role]);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
// Add this handler function after other handlers
const handleSendBack = async () => {
  if (!actionNotes) {
    toast.error('Please provide notes for the editor');
    return;
  }

  const result = await dispatch(reviewerSendBack({ id, reviewerNotes: actionNotes }));
  if (result.type === 'submissions/reviewerSendBack/fulfilled') {
    toast.success('Submission sent back to editor');
    setShowActionModal(null);
    setActionNotes('');
    dispatch(getSubmission(id));
  }
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

  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) {
      toast.error('Please fill in subject and body');
      return;
    }

    const result = await dispatch(sendEmail({
      submissionId: id,
      subject: emailSubject,
      body: emailBody,
      images: emailImages
    }));

    if (result.type === 'emails/send/fulfilled') {
      toast.success('Email sent successfully');
      setShowEmailComposer(false);
      setEmailSubject('');
      setEmailBody('');
      setEmailImages([]);
      dispatch(getSubmissionEmails(id));
    }
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

  const handleMoveToReviewer = async () => {
    const result = await dispatch(moveToReviewer(id));
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

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { class: 'bg-gray-100 text-gray-800', text: 'Draft' },
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      approved_by_editor: { class: 'bg-blue-100 text-blue-800', text: 'Approved by Editor' },
      rejected_by_editor: { class: 'bg-red-100 text-red-800', text: 'Rejected' },
      with_reviewer: { class: 'bg-purple-100 text-purple-800', text: 'With Reviewer' },
      approved_by_reviewer: { class: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected_by_reviewer: { class: 'bg-red-100 text-red-800', text: 'Rejected' },
      scheduled: { class: 'bg-indigo-100 text-indigo-800', text: 'Scheduled' },
      published: { class: 'bg-emerald-100 text-emerald-800', text: 'Published' },
    };
    return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: status };
  };

  const canShowActions = () => {
    if (user.role === 'editor') {
      return ['pending', 'approved_by_editor', 'approved_by_reviewer'].includes(currentSubmission?.status);
    } else if (user.role === 'reviewer') {
      return currentSubmission?.status === 'with_reviewer';
    }
    return false;
  };

  const canSendEmail = () => {
    return user.role === 'author' || user.role === 'editor';
  };

  if (isLoading || !currentSubmission) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-outlook-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  const badge = getStatusBadge(currentSubmission.status);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Header */}
      <div className={`h-12 ${
        user.role === 'editor' ? 'bg-outlook-blue' : 
        user.role === 'reviewer' ? 'bg-purple-600' : 
        'bg-green-600'
      } flex items-center justify-between px-6 text-white shadow-md`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="hover:bg-white/10 p-2 rounded transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold">Submission Details</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser className="w-4 h-4" />
            <span className="text-sm">{user?.firstName} {user?.lastName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:bg-white/10 px-3 py-1 rounded transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Submission Details */}
        <div className="flex-1 overflow-y-auto outlook-scrollbar p-6">
          {/* Status and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
  <div className="flex items-center justify-between mb-6">
    <div>
      <span className={`status-badge ${badge.class} text-lg px-4 py-2`}>
        {badge.text}
      </span>
    </div>
    <div className="flex space-x-3">
      {/* Edit Button for Author */}
      {user.role === 'author' && canEdit && (
        <button
          onClick={() => navigate(`/author/edit-submission/${id}`)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaEdit />
          <span>Edit Submission</span>
        </button>
      )}

      {/* Editor/Reviewer Actions */}
      {canShowActions() && (
        <>
          {user.role === 'editor' && currentSubmission.status === 'pending' && (
            <>
              <button
                onClick={() => setShowActionModal('approve')}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaCheck />
                <span>Approve</span>
              </button>
              <button
                onClick={() => setShowActionModal('reject')}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FaBan />
                <span>Reject</span>
              </button>
            </>
          )}
          
          {user.role === 'editor' && currentSubmission.status === 'approved_by_editor' && (
            <button
              onClick={handleMoveToReviewer}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaForward />
              <span>Move to Reviewer</span>
            </button>
          )}

          {user.role === 'editor' && currentSubmission.status === 'approved_by_reviewer' && (
            <button
              onClick={() => setShowActionModal('schedule')}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaCalendar />
              <span>Schedule Publication</span>
            </button>
          )}

      {user.role === 'reviewer' && currentSubmission.status === 'with_reviewer' && (
  <>
    <button
      onClick={() => setShowActionModal('approve')}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <FaCheck />
      <span>Approve</span>
    </button>
    <button
      onClick={() => setShowActionModal('reject')}
      className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <FaBan />
      <span>Reject</span>
    </button>
    <button
      onClick={() => setShowActionModal('sendback')}
      className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      <FaUndo />
      <span>Send Back to Editor</span>
    </button>
  </>
)}
        </>
      )}
    </div>
  </div>

  {/* Show edit hint for rejected submissions */}
  {user.role === 'author' && canEdit && currentSubmission.status.includes('rejected') && (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <p className="text-sm text-yellow-800">
        <strong>Your submission was rejected.</strong> You can edit and resubmit it using the Edit button above.
      </p>
    </div>
  )}

  {/* Submission Info */}
  <div className="grid grid-cols-2 gap-4 text-sm">
    <div>
      <span className="text-gray-600">Journal:</span>
      <span className="ml-2 font-medium capitalize">{currentSubmission.journal}</span>
    </div>
    <div>
      <span className="text-gray-600">Section:</span>
      <span className="ml-2 font-medium">{currentSubmission.section}</span>
    </div>
    <div>
      <span className="text-gray-600">Author:</span>
      <span className="ml-2 font-medium">
        {currentSubmission.author?.firstName} {currentSubmission.author?.lastName}
      </span>
    </div>
    <div>
      <span className="text-gray-600">Submitted:</span>
      <span className="ml-2 font-medium">
        {currentSubmission.submittedAt
          ? format(new Date(currentSubmission.submittedAt), 'MMM dd, yyyy')
          : 'Not submitted'}
      </span>
    </div>
    {currentSubmission.publicationDate && (
      <div>
        <span className="text-gray-600">Publication Date:</span>
        <span className="ml-2 font-medium">
          {format(new Date(currentSubmission.publicationDate), 'MMM dd, yyyy')}
        </span>
      </div>
    )}
  </div>
</div>

          {/* Article Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentSubmission.metadata?.title}
            </h2>
            {currentSubmission.metadata?.subtitle && (
              <p className="text-lg text-gray-600 mb-4">{currentSubmission.metadata.subtitle}</p>
            )}

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Abstract</h3>
              <p className="text-gray-700 leading-relaxed">{currentSubmission.metadata?.abstract}</p>
            </div>

            {currentSubmission.metadata?.keywords && currentSubmission.metadata.keywords.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {currentSubmission.metadata.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentSubmission.documentFile && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Document</h3>
                <a
                  href={currentSubmission.documentFile.signedUrl || currentSubmission.documentFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-outlook-blue hover:text-outlook-darkBlue"
                >
                  <FaDownload />
                  <span>{currentSubmission.documentFile.filename}</span>
                </a>
              </div>
            )}

            {currentSubmission.rejectionReason && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Rejection Reason</h3>
                <p className="text-red-700">{currentSubmission.rejectionReason}</p>
              </div>
            )}
            {/* Show Reviewer Notes for Editor */}
{user.role === 'editor' && currentSubmission.reviewerNotes && currentSubmission.status === 'approved_by_editor' && (
  <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
    <h3 className="font-semibold text-orange-800 mb-2 flex items-center">
      <FaUndo className="mr-2" />
      Reviewer's Notes - Changes Required
    </h3>
    <div 
      className="text-orange-900 prose max-w-none"
      dangerouslySetInnerHTML={{ __html: currentSubmission.reviewerNotes }}
    />
    <p className="text-sm text-orange-700 mt-3 italic">
      The reviewer has sent this submission back for your review. Please check the notes above and take appropriate action.
    </p>
  </div>
)}

{/* Show Reviewer Notes in General (for all roles after review) */}
{currentSubmission.reviewerNotes && currentSubmission.status !== 'approved_by_editor' && (
  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h3 className="font-semibold text-blue-800 mb-2">Reviewer's Notes</h3>
    <div 
      className="text-blue-900 prose max-w-none"
      dangerouslySetInnerHTML={{ __html: currentSubmission.reviewerNotes }}
    />
  </div>
)}
          </div>
        </div>

        {/* Right Panel - Email Communication */}
        {canSendEmail() && (
          <div className="w-96 border-l border-outlook-border flex flex-col bg-outlook-gray">
            <div className="p-4 border-b border-outlook-border bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <FaEnvelope />
                  <span>Communication</span>
                </h3>
                <button
                  onClick={() => setShowEmailComposer(!showEmailComposer)}
                  className="bg-outlook-blue hover:bg-outlook-darkBlue text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {showEmailComposer ? 'Cancel' : 'New Message'}
                </button>
              </div>
            </div>

            {/* Email Composer */}
            {showEmailComposer && (
              <div className="p-4 border-b border-outlook-border bg-white">
                <input
                  type="text"
                  placeholder="Subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                />
                <textarea
                  placeholder="Type your message..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                />
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                    <FaImage className="inline mr-1" />
                    Attach Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setEmailImages(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </label>
                  {emailImages.length > 0 && (
                    <span className="text-xs text-gray-500">({emailImages.length} image(s))</span>
                  )}
                </div>
                <button
                  onClick={handleSendEmail}
                  className="w-full mt-3 flex items-center justify-center space-x-2 bg-outlook-blue hover:bg-outlook-darkBlue text-white px-4 py-2 rounded transition-colors"
                >
                  <FaPaperPlane />
                  <span>Send</span>
                </button>
              </div>
            )}

            {/* Email Thread */}
            <div className="flex-1 overflow-y-auto outlook-scrollbar p-4">
              {emails.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FaEnvelope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emails.map((email) => {
                    const isFromMe = email.sender._id === user.id;
                    return (
                      <div
                        key={email._id}
                        className={`p-3 rounded-lg ${
                          isFromMe ? 'bg-outlook-lightBlue ml-4' : 'bg-white mr-4 shadow'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-sm">
                            {isFromMe ? 'You' : `${email.sender.firstName} ${email.sender.lastName}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(email.sentAt), 'MMM dd, HH:mm')}
                          </div>
                        </div>
                        <div className="text-sm font-medium mb-1">{email.subject}</div>
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">{email.body}</div>
                        {email.attachments && email.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {email.attachments.map((att, idx) => (
                              <img
                                key={idx}
                                src={att.url}
                                alt={att.filename}
                                className="max-w-full rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

  {showActionModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4 capitalize">
        {showActionModal === 'sendback' ? 'Send Back to Editor' : 
         showActionModal === 'schedule' ? 'Schedule Publication' : 
         `${showActionModal} Submission`}
      </h3>
      
      {showActionModal === 'schedule' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Publication Date
          </label>
          <input
            type="date"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      ) : showActionModal === 'sendback' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes for Editor *
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Please explain what changes or corrections are needed in the submission.
          </p>
          <ReactQuill
            theme="snow"
            value={actionNotes}
            onChange={setActionNotes}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
              ]
            }}
            placeholder="Enter detailed notes about required changes..."
            style={{ height: '200px', marginBottom: '50px' }}
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {showActionModal === 'reject' ? 'Rejection Reason *' : 'Notes (Optional)'}
          </label>
          <textarea
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder={showActionModal === 'reject' ? 'Please provide detailed feedback...' : 'Add any notes...'}
          />
        </div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => {
            setShowActionModal(null);
            setActionNotes('');
            setPublicationDate('');
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={
            showActionModal === 'approve' ? handleApprove :
            showActionModal === 'reject' ? handleReject :
            showActionModal === 'sendback' ? handleSendBack :
            handleSchedule
          }
          className={`px-4 py-2 rounded-lg text-white ${
            showActionModal === 'approve' ? 'bg-green-600 hover:bg-green-700' :
            showActionModal === 'reject' ? 'bg-red-600 hover:bg-red-700' :
            showActionModal === 'sendback' ? 'bg-orange-600 hover:bg-orange-700' :
            'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default SubmissionDetail;