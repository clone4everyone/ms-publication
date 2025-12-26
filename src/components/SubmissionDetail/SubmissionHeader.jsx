import { FaArrowLeft, FaSignOutAlt, FaUser, FaBook } from 'react-icons/fa';

function SubmissionHeader({ user, onBack, onLogout }) {
  return (
    <div className={`h-16 bg-gradient-to-r ${
      user.role === 'editor' ? 'from-teal-600 via-teal-700 to-teal-800' :
      user.role === 'reviewer' ? 'from-violet-600 via-purple-700 to-violet-800' :
      'from-emerald-600 via-teal-700 to-emerald-800'
    } flex items-center justify-between px-8 text-white shadow-xl animate-slide-down`}>
      <div className="flex items-center space-x-6">
        <button
          onClick={onBack}
          className="group flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
        <div className="h-10 w-px bg-white/30"></div>
        <div className="flex items-center space-x-3">
          <FaBook className="w-5 h-5" />
          <h1 className="text-xl font-bold tracking-wide">Submission Details</h1>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg">
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
            <FaUser className="w-4 h-4 text-teal-900" />
          </div>
          <div>
            <div className="text-xs opacity-80">Signed in as</div>
            <div className="text-sm font-semibold">{user?.firstName} {user?.lastName}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
        >
          <FaSignOutAlt className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default SubmissionHeader;