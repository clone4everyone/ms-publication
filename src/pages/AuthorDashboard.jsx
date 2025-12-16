import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMySubmissions } from '../redux/slices/submissionSlice';
import { logout } from '../redux/slices/authSlice';
import { getUnreadCount } from '../redux/slices/emailSlice';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaSignOutAlt, FaUser, FaEnvelope, FaFile, 
  FaClock, FaCheckCircle, FaTimesCircle, FaSearch,
  FaFilter, FaSortAmountDown
} from 'react-icons/fa';
import { format } from 'date-fns';

function AuthorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { submissions, isLoading } = useSelector((state) => state.submissions);
  const { unreadCount } = useSelector((state) => state.emails);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    dispatch(getMySubmissions());
    dispatch(getUnreadCount());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { class: 'bg-gray-100 text-gray-800', text: 'Draft' },
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      approved_by_editor: { class: 'bg-blue-100 text-blue-800', text: 'Approved by Editor' },
      rejected_by_editor: { class: 'bg-red-100 text-red-800', text: 'Rejected by Editor' },
      with_reviewer: { class: 'bg-purple-100 text-purple-800', text: 'With Reviewer' },
      approved_by_reviewer: { class: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected_by_reviewer: { class: 'bg-red-100 text-red-800', text: 'Rejected by Reviewer' },
      scheduled: { class: 'bg-indigo-100 text-indigo-800', text: 'Scheduled' },
      published: { class: 'bg-emerald-100 text-emerald-800', text: 'Published' },
    };
    return statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: status };
  };

  const filteredSubmissions = submissions
    .filter(sub => {
      const matchesSearch = sub.metadata?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Header Bar - Outlook Style */}
      <div className="h-12 bg-outlook-blue flex items-center justify-between px-4 text-white shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">MS Publication - Author Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser className="w-4 h-4" />
            <span className="text-sm">{user?.firstName} {user?.lastName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:bg-outlook-darkBlue px-3 py-1 rounded transition-colors"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Outlook Style */}
        <div className="w-64 bg-outlook-gray border-r border-outlook-border flex flex-col">
          {/* New Submission Button */}
          <div className="p-4">
            <button
              onClick={() => navigate('/author/new-submission')}
              className="w-full flex items-center justify-center space-x-2 bg-outlook-blue hover:bg-outlook-darkBlue text-white px-4 py-3 rounded-lg transition-colors shadow-sm"
            >
              <FaPlus className="w-5 h-5" />
              <span className="font-medium">New Submission</span>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto outlook-scrollbar">
            <div className="px-2 py-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  filterStatus === 'all' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
                }`}
              >
                <FaFile className="w-4 h-4" />
                <span className="text-sm font-medium">All Submissions</span>
                <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {submissions.length}
                </span>
              </button>
              
              <button
                onClick={() => setFilterStatus('pending')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors mt-1 ${
                  filterStatus === 'pending' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
                }`}
              >
                <FaClock className="w-4 h-4" />
                <span className="text-sm font-medium">Pending</span>
                <span className="ml-auto text-xs bg-yellow-200 px-2 py-1 rounded-full">
                  {submissions.filter(s => s.status === 'pending').length}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('approved_by_reviewer')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors mt-1 ${
                  filterStatus === 'approved_by_reviewer' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
                }`}
              >
                <FaCheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Approved</span>
                <span className="ml-auto text-xs bg-green-200 px-2 py-1 rounded-full">
                  {submissions.filter(s => s.status === 'approved_by_reviewer' || s.status === 'scheduled' || s.status === 'published').length}
                </span>
              </button>

              <button
                onClick={() => setFilterStatus('rejected_by_editor')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors mt-1 ${
                  filterStatus === 'rejected_by_editor' ? 'bg-outlook-lightBlue text-outlook-blue' : 'hover:bg-gray-100'
                }`}
              >
                <FaTimesCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Rejected</span>
                <span className="ml-auto text-xs bg-red-200 px-2 py-1 rounded-full">
                  {submissions.filter(s => s.status.includes('rejected')).length}
                </span>
              </button>

              {unreadCount > 0 && (
                <div className="mt-4 px-3 py-2 bg-blue-50 rounded-md">
                  <div className="flex items-center space-x-2 text-outlook-blue">
                    <FaEnvelope className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Panel - List View */}
        <div className="w-96 bg-white border-r border-outlook-border flex flex-col">
          {/* Search and Filter Bar */}
          <div className="p-4 border-b border-outlook-border bg-outlook-gray">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
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
                    {searchTerm ? 'Try a different search term' : 'Click "New Submission" to get started'}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {filteredSubmissions.map((submission) => {
                  const badge = getStatusBadge(submission.status);
                  return (
                    <div
                      key={submission._id}
                      onClick={() => {
                        setSelectedSubmission(submission);
                        navigate(`/submission/${submission._id}`);
                      }}
                      className={`p-4 border-b border-outlook-border cursor-pointer hover:bg-outlook-lightBlue transition-colors ${
                        selectedSubmission?._id === submission._id ? 'bg-outlook-lightBlue' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 flex-1">
                          {submission.metadata?.title || 'Untitled'}
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`status-badge ${badge.class} text-xs px-2 py-1 rounded-full`}>
                          {badge.text}
                        </span>
                        <span className="text-xs text-gray-500 uppercase">
                          {submission.journal}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                        {submission.metadata?.abstract || 'No abstract'}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {submission.submittedAt
                            ? format(new Date(submission.submittedAt), 'MMM dd, yyyy')
                            : format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span>{submission.section}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Details/Preview */}
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-center px-4">
            <FaFile className="w-24 h-24 text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Welcome, {user?.firstName}!
            </h2>
            <p className="text-gray-500 mb-6">
              Select a submission from the list to view details
            </p>
            <button
              onClick={() => navigate('/author/new-submission')}
              className="inline-flex items-center space-x-2 bg-outlook-blue hover:bg-outlook-darkBlue text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaPlus className="w-5 h-5" />
              <span>Create New Submission</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorDashboard;