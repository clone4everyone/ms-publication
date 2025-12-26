import { FaEdit, FaUndo, FaCheck, FaBan, FaForward, FaCalendar } from 'react-icons/fa';
import { format } from 'date-fns';
import { getStatusBadge } from './utils';
import { useState, useEffect } from 'react';
function SubmissionStatusCard({
  submission,
  user,
  canEdit,
  canShowActions,
  onEdit,
  onApprove,
  onReject,
  onSendBack,
  onMoveToReviewer,
  onSchedule
}) {
  const [showReviewerModal, setShowReviewerModal] = useState(false);
const [availableReviewers, setAvailableReviewers] = useState([]);
const [selectedReviewer, setSelectedReviewer] = useState(null);
const [reviewerNotes, setReviewerNotes] = useState('');
const [loadingReviewers, setLoadingReviewers] = useState(false);

const fetchAvailableReviewers = async () => {
  setLoadingReviewers(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/editor/reviewers/available/${submission.journal}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await response.json();
    if (data.success) {
      setAvailableReviewers(data.data.reviewers);
    }
  } catch (error) {
    console.error('Error fetching reviewers:', error);
  } finally {
    setLoadingReviewers(false);
  }
};
  const badge = getStatusBadge(submission.status);
  const StatusIcon = badge.icon;

  return (
    <div className="glass-morphism rounded-2xl shadow-xl p-8 animate-fade-in-up hover-lift">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-2xl ${badge.class.replace('bg-', 'bg-gradient-to-br from-').replace('text-', 'to-')} flex items-center justify-center shadow-lg`}>
            <StatusIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Current Status</div>
            <span className={`inline-flex items-center space-x-2 ${badge.class} border-2 text-base font-bold px-6 py-2 rounded-xl`}>
              <StatusIcon className="w-4 h-4" />
              <span>{badge.text}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Edit Button for Author */}
          {user.role === 'author' && canEdit && (
            <button
              onClick={onEdit}
              className="group flex items-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FaEdit className="group-hover:rotate-12 transition-transform" />
              <span>Edit Submission</span>
            </button>
          )}

          {/* Editor/Reviewer Actions */}
          {canShowActions && (
            <>
              {user.role === 'editor' && submission.status !== 'approved_by_editor' && (
                <>
                  <button
                    onClick={onApprove}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaCheck className="group-hover:scale-125 transition-transform" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={onReject}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaBan className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={onSendBack}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
                    <span>Send Back to Author</span>
                  </button>
                </>
              )}

              {user.role === 'editor' && submission.status !== 'with_reviewer' && submission.status !== 'approved_by_editor' && (
                <button
                  onClick={() => {
  setShowReviewerModal(true);
  fetchAvailableReviewers();
}}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <FaForward className="group-hover:translate-x-1 transition-transform" />
                  <span>Move to Reviewer</span>
                </button>
              )}

              {user.role === 'editor' && submission.status === 'approved_by_editor' && (
                <>
                  <button
                    onClick={onSchedule}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaCalendar className="group-hover:scale-110 transition-transform" />
                    <span>Schedule Publication</span>
                  </button>
                  <button
                    onClick={onSendBack}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
                    <span>Send Back to Author</span>
                  </button>
                </>
              )}

              {user.role === 'reviewer' && submission.status === 'with_reviewer' && (
                <>
                  <button
                    onClick={onApprove}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaCheck className="group-hover:scale-125 transition-transform" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={onReject}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaBan className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={onSendBack}
                    className="group flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <FaUndo className="group-hover:-rotate-180 transition-transform duration-500" />
                    <span>Send Back</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit hint for rejected submissions */}
      {user.role === 'author' && canEdit && submission.status.includes('rejected') && (
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6 animate-scale-in">
          <div className="flex items-start space-x-3">
            <FaBan className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-amber-900 mb-1">Submission Rejected</p>
              <p className="text-sm text-amber-800">
                You can edit and resubmit your submission using the Edit button above.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submission Info Grid */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Journal</div>
          <div className="font-bold text-gray-900 capitalize text-lg group-hover:text-teal-600 transition-colors">
            {submission.journal}
          </div>
        </div>
        <div className="group">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Section</div>
          <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
            {submission.section}
          </div>
        </div>
        <div className="group">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Author</div>
          <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
            {submission.author?.firstName} {submission.author?.lastName}
          </div>
        </div>
        <div className="group">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Submitted</div>
          <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
            {submission.submittedAt
              ? format(new Date(submission.submittedAt), 'MMM dd, yyyy')
              : 'Not submitted'}
          </div>
        </div>
        {submission.publicationDate && (
          <div className="group">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Publication Date</div>
            <div className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
              {format(new Date(submission.publicationDate), 'MMM dd, yyyy')}
            </div>
          </div>
        )}
      </div>
      {showReviewerModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-2xl">
        <h3 className="text-2xl font-bold">Assign Reviewer</h3>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Select Reviewer *
          </label>
          {loadingReviewers ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : availableReviewers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No reviewers available for this journal
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableReviewers.map((reviewer) => (
                <div
                  key={reviewer._id}
                  onClick={() => setSelectedReviewer(reviewer)}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedReviewer?._id === reviewer._id
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-violet-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">
                        {reviewer.firstName} {reviewer.lastName}
                      </div>
                      <div className="text-sm text-gray-600">{reviewer.email}</div>
                      {reviewer.specialization && reviewer.specialization.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {reviewer.specialization.map((spec, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs capitalize">
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Active Reviews</div>
                      <div className="text-lg font-bold text-gray-900">{reviewer.activeReviews || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Notes for Reviewer (Optional)
          </label>
          <textarea
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none resize-none"
            placeholder="Any specific instructions for the reviewer..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 p-6 bg-gray-50 rounded-b-2xl">
        <button
          onClick={() => {
            setShowReviewerModal(false);
            setSelectedReviewer(null);
            setReviewerNotes('');
          }}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-medium transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (selectedReviewer) {
              onMoveToReviewer(selectedReviewer._id, reviewerNotes);
              setShowReviewerModal(false);
              setSelectedReviewer(null);
              setReviewerNotes('');
            }
          }}
          disabled={!selectedReviewer}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign Reviewer
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default SubmissionStatusCard;