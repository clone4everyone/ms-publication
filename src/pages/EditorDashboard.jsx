import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getJournalStats } from '../redux/slices/submissionSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { 
  FaSignOutAlt, FaUser, FaBook, FaChartBar,
  FaClock, FaCheckCircle, FaEye, FaGlobe
} from 'react-icons/fa';

const journalColors = {
  pharma: 'from-blue-500 to-blue-700',
  history: 'from-amber-500 to-amber-700',
  chemistry: 'from-green-500 to-green-700',
  science: 'from-purple-500 to-purple-700',
  ayurvedic: 'from-emerald-500 to-emerald-700',
  technology: 'from-red-500 to-red-700'
};

const journalIcons = {
  pharma: '💊',
  history: '📜',
  chemistry: '🧪',
  science: '🔬',
  ayurvedic: '🌿',
  technology: '💻'
};

function EditorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { journalStats, isLoading } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(getJournalStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleJournalClick = (journal) => {
    navigate(`/editor/journal/${journal}`);
  };

  const getTotalStats = () => {
    if (!journalStats || journalStats.length === 0) return { total: 0, pending: 0, withReviewer: 0, published: 0 };
    
    return journalStats.reduce((acc, stat) => ({
      total: acc.total + stat.total,
      pending: acc.pending + stat.pending,
      withReviewer: acc.withReviewer + stat.withReviewer,
      published: acc.published + stat.published
    }), { total: 0, pending: 0, withReviewer: 0, published: 0 });
  };

  const totalStats = getTotalStats();

  return (
    <div className="h-screen flex flex-col bg-outlook-gray">
      {/* Top Header Bar - Outlook Style */}
      <div className="h-12 bg-outlook-blue flex items-center justify-between px-6 text-white shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">MS Publication - Editor Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser className="w-4 h-4" />
            <span className="text-sm">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Editor</span>
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto outlook-scrollbar p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage submissions across all journals from your dashboard
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-outlook-blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.total}</p>
              </div>
              <FaBook className="w-10 h-10 text-outlook-blue opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.pending}</p>
              </div>
              <FaClock className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">With Reviewer</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.withReviewer}</p>
              </div>
              <FaEye className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.published}</p>
              </div>
              <FaCheckCircle className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Journal Cards Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaGlobe className="mr-2" />
            Journal Management
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-outlook-blue mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading journals...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journalStats.map((stat) => (
              <div
                key={stat.journal}
                onClick={() => handleJournalClick(stat.journal)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {/* Card Header with Gradient */}
                <div className={`h-32 bg-gradient-to-r ${journalColors[stat.journal]} flex items-center justify-center relative`}>
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">{journalIcons[stat.journal]}</div>
                    <h4 className="text-xl font-bold capitalize">{stat.journal}</h4>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-semibold">{stat.total} Total</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{stat.pending}</div>
                      <div className="text-xs text-gray-600 mt-1">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stat.withReviewer}</div>
                      <div className="text-xs text-gray-600 mt-1">Reviewing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stat.published}</div>
                      <div className="text-xs text-gray-600 mt-1">Published</div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-outlook-blue hover:bg-outlook-darkBlue text-white py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    View Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const firstJournalWithPending = journalStats.find(s => s.pending > 0);
                if (firstJournalWithPending) {
                  navigate(`/editor/journal/${firstJournalWithPending.journal}?status=pending`);
                }
              }}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <FaClock className="text-yellow-600" />
              <span className="font-medium text-gray-700">Review Pending Submissions</span>
            </button>

            <button
              onClick={() => {
                const firstJournalWithReviewer = journalStats.find(s => s.withReviewer > 0);
                if (firstJournalWithReviewer) {
                  navigate(`/editor/journal/${firstJournalWithReviewer.journal}?status=with_reviewer`);
                }
              }}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <FaEye className="text-purple-600" />
              <span className="font-medium text-gray-700">Check Reviewer Progress</span>
            </button>

            <button
              onClick={() => navigate(`/editor/journal/${journalStats[0]?.journal}`)}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <FaChartBar className="text-green-600" />
              <span className="font-medium text-gray-700">View All Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditorDashboard;