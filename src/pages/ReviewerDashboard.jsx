import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getJournalStats } from '../redux/slices/submissionSlice';
import { logout } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { 
  FaSignOutAlt, FaUser, FaBook, FaChartBar,
  FaClock, FaCheckCircle, FaEye
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

function ReviewerDashboard() {
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
    navigate(`/reviewer/journal/${journal}`);
  };

  // Filter to only show journals with assigned submissions
  const assignedJournals = journalStats.filter(stat => stat.total > 0);

  const getTotalStats = () => {
    if (!assignedJournals || assignedJournals.length === 0) return { total: 0, withReviewer: 0 };
    
    return assignedJournals.reduce((acc, stat) => ({
      total: acc.total + stat.total,
      withReviewer: acc.withReviewer + stat.withReviewer
    }), { total: 0, withReviewer: 0 });
  };

  const totalStats = getTotalStats();

  return (
    <div className="h-screen flex flex-col bg-outlook-gray">
      {/* Top Header Bar - Outlook Style */}
      <div className="h-12 bg-purple-600 flex items-center justify-between px-6 text-white shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">MS Publication - Reviewer Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser className="w-4 h-4" />
            <span className="text-sm">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Reviewer</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:bg-purple-700 px-3 py-1 rounded transition-colors"
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
            Review assigned submissions and provide feedback to editors
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned to You</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.total}</p>
              </div>
              <FaBook className="w-10 h-10 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Awaiting Review</p>
                <p className="text-3xl font-bold text-gray-900">{totalStats.withReviewer}</p>
              </div>
              <FaClock className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Journal Cards Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaEye className="mr-2" />
            Your Assigned Journals
          </h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading assignments...</p>
            </div>
          </div>
        ) : assignedJournals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBook className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Assignments Yet</h3>
            <p className="text-gray-500">
              You don't have any submissions assigned for review at the moment.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Check back later or contact the editor if you have questions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedJournals.map((stat) => (
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
                    <span className="text-white text-sm font-semibold">{stat.total} Assigned</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stat.withReviewer}</div>
                      <div className="text-xs text-gray-600 mt-1">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {stat.total - stat.withReviewer}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Completed</div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    Review Submissions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {assignedJournals.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  const firstJournal = assignedJournals[0];
                  if (firstJournal) {
                    navigate(`/reviewer/journal/${firstJournal.journal}?status=with_reviewer`);
                  }
                }}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <FaClock className="text-orange-600" />
                <span className="font-medium text-gray-700">View Pending Reviews</span>
              </button>

              <button
                onClick={() => {
                  const firstJournal = assignedJournals[0];
                  if (firstJournal) {
                    navigate(`/reviewer/journal/${firstJournal.journal}`);
                  }
                }}
                className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FaCheckCircle className="text-green-600" />
                <span className="font-medium text-gray-700">View All Submissions</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewerDashboard;