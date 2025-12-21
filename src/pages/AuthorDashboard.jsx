import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMySubmissions } from '../redux/slices/submissionSlice';
import { logout } from '../redux/slices/authSlice';
import { getUnreadCount } from '../redux/slices/emailSlice';
import { toast } from 'react-toastify';
import logo from '../../public/ms-logo.png'
import { 
  Plus, LogOut, User, Mail, FileText, 
  Clock, CheckCircle, XCircle, Search,
  Filter, TrendingUp, Eye, Calendar,
  Edit, Trash2, Download, MoreVertical,
  Bell, Settings, ChevronRight, Sparkles,
  BookOpen, Award, Target, Zap
} from 'lucide-react';
import { format } from 'date-fns';

function AuthorDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { submissions, isLoading } = useSelector((state) => state.submissions);
  const { unreadCount } = useSelector((state) => state.emails);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
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

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ms-publication-backend.onrender.com/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Password changed successfully');
        setShowProfileModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error changing password');
    }
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      draft: { 
        gradient: 'from-gray-500 to-gray-600',
        bg: 'bg-gray-50', 
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: Edit,
        label: 'Draft' 
      },
      pending: { 
        gradient: 'from-[#FDB913] to-[#F5A800]',
        bg: 'bg-yellow-50', 
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: Clock,
        label: 'Pending Review' 
      },
      approved_by_editor: { 
        gradient: 'from-[#1B7A9C] to-[#156680]',
        bg: 'bg-blue-50', 
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: CheckCircle,
        label: 'Approved by Editor' 
      },
      rejected_by_editor: { 
        gradient: 'from-red-500 to-red-600',
        bg: 'bg-red-50', 
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
        label: 'Rejected by Editor' 
      },
      with_reviewer: { 
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-50', 
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: Eye,
        label: 'With Reviewer' 
      },
      approved_by_reviewer: { 
        gradient: 'from-emerald-500 to-emerald-600',
        bg: 'bg-emerald-50', 
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Approved' 
      },
      rejected_by_reviewer: { 
        gradient: 'from-red-500 to-red-600',
        bg: 'bg-red-50', 
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
        label: 'Rejected by Reviewer' 
      },
      scheduled: { 
        gradient: 'from-indigo-500 to-indigo-600',
        bg: 'bg-indigo-50', 
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        icon: Calendar,
        label: 'Scheduled' 
      },
      published: { 
        gradient: 'from-[#1B7A9C] to-teal-600',
        bg: 'bg-teal-50', 
        text: 'text-teal-700',
        border: 'border-teal-200',
        icon: Award,
        label: 'Published' 
      },
    };
    return statusMap[status] || statusMap.draft;
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.metadata?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { 
      label: 'Total Submissions', 
      value: submissions.length, 
      icon: FileText,
      gradient: 'from-[#1B7A9C] to-[#156680]',
      change: '+3 this month'
    },
    { 
      label: 'Under Review', 
      value: submissions.filter(s => s.status === 'pending' || s.status === 'with_reviewer').length, 
      icon: Clock,
      gradient: 'from-[#FDB913] to-[#F5A800]',
      change: '2 pending'
    },
    { 
      label: 'Published', 
      value: submissions.filter(s => s.status === 'published').length, 
      icon: Award,
      gradient: 'from-emerald-500 to-emerald-600',
      change: '+1 this month'
    },
    { 
      label: 'Acceptance Rate', 
      value: submissions.length > 0 
        ? `${Math.round((submissions.filter(s => s.status === 'published' || s.status === 'scheduled').length / submissions.length) * 100)}%`
        : '0%', 
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      change: 'All time'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1B7A9C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FDB913] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/J-PHARMA-001')}
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br  rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110">
                  <img className="w-11 h-11 text-white" src={logo} />
                </div>
                <div>
                  <div className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#1B7A9C] to-teal-600">
                    MS Publications
                  </div>
                  <div className="text-xs text-gray-500">Author Portal</div>
                </div>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* {unreadCount > 0 && (
                <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount}
                  </span>
                </button>
              )} */}

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1B7A9C] to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-sm font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500">Author</div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-scale-in">
                    <div className="p-4 bg-gradient-to-br from-[#1B7A9C] to-teal-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white font-bold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white">{user?.firstName} {user?.lastName}</div>
                          <div className="text-xs text-white/80">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowProfileModal(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Change Password</span>
                      </button>
                      <button
                        onClick={() => navigate('/journals')}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                      >
                        <BookOpen className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Browse Journals</span>
                      </button>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1B7A9C] to-teal-600">{user?.firstName}</span>!
              </h1>
              <p className="text-lg text-gray-600">Manage your research submissions and track their progress</p>
            </div>
            <button
              onClick={() => navigate('/author/new-submission')}
              className="group flex items-center space-x-3 bg-gradient-to-r from-[#1B7A9C] to-teal-600 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-2xl hover:scale-105 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>New Submission</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium mb-2">{stat.label}</div>
                <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submissions Section */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B7A9C] to-teal-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">My Submissions</h2>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
                  />
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'All', count: submissions.length },
                { id: 'pending', label: 'Pending', count: submissions.filter(s => s.status === 'pending').length },
                { id: 'with_reviewer', label: 'In Review', count: submissions.filter(s => s.status === 'with_reviewer').length },
                { id: 'approved_by_reviewer', label: 'Approved', count: submissions.filter(s => s.status === 'approved_by_reviewer' || s.status === 'scheduled').length },
                { id: 'published', label: 'Published', count: submissions.filter(s => s.status === 'published').length }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                    filterStatus === filter.id
                      ? 'bg-white text-[#1B7A9C] shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filterStatus === filter.id ? 'bg-[#1B7A9C] text-white' : 'bg-white/20'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Submissions List */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-teal-200 rounded-full"></div>
                  <div className="w-16 h-16 border-4 border-[#1B7A9C] rounded-full animate-spin border-t-transparent absolute top-0"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading submissions...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-[#1B7A9C] to-teal-600 rounded-3xl flex items-center justify-center mb-6 animate-float">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try a different search term' : 'Start by creating your first submission'}
                </p>
                <button
                  onClick={() => navigate('/author/new-submission')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#1B7A9C] to-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Submission</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredSubmissions.map((submission, index) => {
                  const statusConfig = getStatusConfig(submission.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div
                      key={submission._id}
                      onClick={() => navigate(`/submission/${submission._id}`)}
                      className="group relative bg-white border-2 border-gray-200 hover:border-gray-300 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-in-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`inline-flex items-center space-x-2 px-4 py-2 ${statusConfig.bg} ${statusConfig.text} rounded-xl text-sm font-bold border-2 ${statusConfig.border}`}>
                              <StatusIcon className="w-4 h-4" />
                              <span>{statusConfig.label}</span>
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold uppercase">
                              {submission.journal}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1B7A9C] transition-colors line-clamp-2">
                            {submission.metadata?.title || 'Untitled Submission'}
                          </h3>
                          
                          <div className="text-gray-600 text-sm line-clamp-2 mb-4"  
                          dangerouslySetInnerHTML={{
      __html: submission.metadata?.abstract || "",
    }}/>
                     
                          

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {submission.submittedAt
                                  ? format(new Date(submission.submittedAt), 'MMM dd, yyyy')
                                  : format(new Date(submission.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{submission.section || 'General'}</span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#1B7A9C] group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden">
            <div className="bg-gradient-to-r from-[#1B7A9C] to-teal-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Change Password</h3>
                </div>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B7A9C] focus:border-transparent transition-all"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B7A9C] focus:border-transparent transition-all"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B7A9C] focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 px-6 pb-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-bold text-gray-700 transition-all hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1B7A9C] to-teal-600 text-white rounded-xl hover:shadow-xl font-bold transition-all hover:scale-105"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default AuthorDashboard;