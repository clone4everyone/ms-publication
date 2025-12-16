import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getSubmissionsByJournal } from '../redux/slices/submissionSlice';
import { logout } from '../redux/slices/authSlice';
import { 
  FaArrowLeft, FaSignOutAlt, FaUser, FaSearch, 
  FaFilter, FaFile, FaClock, FaCheckCircle
} from 'react-icons/fa';
import { format } from 'date-fns';

const journalColors = {
  pharma: 'bg-blue-600',
  history: 'bg-amber-600',
  chemistry: 'bg-green-600',
  science: 'bg-purple-600',
  ayurvedic: 'bg-emerald-600',
  technology: 'bg-red-600'
};

function JournalView() {
  const { journal } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const { user } = useSelector((state) => state.auth);
  const { submissions, isLoading } = useSelector((state) => state.submissions);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(statusParam || 'all');

  useEffect(() => {
    if (filterStatus === 'all') {
      dispatch(getSubmissionsByJournal({ journal }));
    } else {
      dispatch(getSubmissionsByJournal({ journal, status: filterStatus }));
    }
  }, [dispatch, journal, filterStatus]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleBack = () => {
    if (user.role === 'editor') {
      navigate('/editor/dashboard');
    } else {
      navigate('/reviewer/dashboard');
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

  const filteredSubmissions = submissions.filter(sub =>
    sub.metadata?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusCounts = () => {
    return {
      all: submissions.length,
      pending: submissions.filter(s => s.status === 'pending').length,
      with_reviewer: submissions.filter(s => s.status === 'with_reviewer').length,
      approved: submissions.filter(s => s.status === 'approved_by_reviewer' || s.status === 'scheduled').length,
      rejected: submissions.filter(s => s.status.includes('rejected')).length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Header Bar */}
      <div className={`h-12 ${user.role === 'editor' ? 'bg-outlook-blue' : 'bg-purple-600'} flex items-center justify-between px-6 text-white shadow-md`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="hover:bg-white/10 p-2 rounded transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-lg font-semibold capitalize">
            {journal} Journal - {user.role === 'editor' ? 'Editor' : 'Reviewer'} View
          </h1>
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
        {/* Left Sidebar - Filters */}
        <div className="w-64 bg-outlook-gray border-r border-outlook-border flex flex-col">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-600 uppercase mb-3">Filter by Status</h2>
            
            <button
              onClick={() => setFilterStatus('all')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors mb-2 ${
                filterStatus === 'all' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FaFile className="w-4 h-4" />
                <span className="text-sm font-medium">All Submissions</span>
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{counts.all}</span>
            </button>

            {user.role === 'editor' && (
              <button
                onClick={() => setFilterStatus('pending')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors mb-2 ${
                  filterStatus === 'pending' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaClock className="w-4 h-4" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <span className="text-xs bg-yellow-200 px-2 py-1 rounded-full">{counts.pending}</span>
              </button>
            )}

            <button
              onClick={() => setFilterStatus('with_reviewer')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors mb-2 ${
                filterStatus === 'with_reviewer' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FaClock className="w-4 h-4" />
                <span className="text-sm font-medium">With Reviewer</span>
              </div>
              <span className="text-xs bg-purple-200 px-2 py-1 rounded-full">{counts.with_reviewer}</span>
            </button>

            <button
              onClick={() => setFilterStatus('approved_by_reviewer')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors mb-2 ${
                filterStatus === 'approved_by_reviewer' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Approved</span>
              </div>
              <span className="text-xs bg-green-200 px-2 py-1 rounded-full">{counts.approved}</span>
            </button>

            {counts.rejected > 0 && (
              <button
                onClick={() => setFilterStatus('rejected_by_editor')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors mb-2 ${
                  filterStatus.includes('rejected') ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FaFile className="w-4 h-4" />
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <span className="text-xs bg-red-200 px-2 py-1 rounded-full">{counts.rejected}</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Panel - List */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Search Bar */}
          <div className="p-4 border-b border-outlook-border bg-outlook-gray">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-outlook-blue"
              />
            </div>
          </div>

          {/* Submissions List */}
          <div className="flex-1 overflow-y-auto outlook-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-outlook-blue mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading submissions...</p>
                </div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center px-4">
                  <FaFile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No submissions found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {searchTerm ? 'Try a different search term' : 'No submissions match the selected filter'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSubmissions.map((submission) => {
                  const badge = getStatusBadge(submission.status);
                  return (
                    <div
                      key={submission._id}
                      onClick={() => navigate(`/submission/${submission._id}`)}
                      className="p-6 hover:bg-outlook-lightBlue cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900 flex-1 pr-4">
                          {submission.metadata?.title || 'Untitled'}
                        </h3>
                        <span className={`status-badge ${badge.class} whitespace-nowrap`}>
                          {badge.text}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center space-x-1">
                          <FaUser className="w-3 h-3" />
                          <span>
                            {submission.author?.firstName} {submission.author?.lastName}
                          </span>
                        </span>
                        <span>•</span>
                        <span>{submission.section}</span>
                        <span>•</span>
                        <span>
                          {submission.submittedAt
                            ? format(new Date(submission.submittedAt), 'MMM dd, yyyy')
                            : format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">
                        {submission.metadata?.abstract || 'No abstract available'}
                      </p>

                      {submission.metadata?.keywords && submission.metadata.keywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {submission.metadata.keywords.slice(0, 5).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                          {submission.metadata.keywords.length > 5 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{submission.metadata.keywords.length - 5} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JournalView;