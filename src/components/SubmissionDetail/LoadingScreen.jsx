
function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-amber-50">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-teal-200 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-t-teal-600 border-r-amber-400 border-b-teal-600 border-l-amber-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-700 animate-pulse">Loading submission...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;