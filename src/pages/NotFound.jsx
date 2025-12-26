import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-10 text-center border border-gray-100">
        
        {/* Status Code */}
        <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
          Error 404
        </p>

        {/* Heading */}
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-3 text-gray-600 leading-relaxed">
          The page you are trying to access does not exist, has been removed,
          or the URL is incorrect.
        </p>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg
                       bg-[#006B8F] text-white font-semibold
                       hover:bg-[#0582aa] transition-colors"
          >
            Go to Homepage
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg
                       border border-gray-300 text-gray-700 font-semibold
                       hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-400">
          If you believe this is an error, please contact the system administrator.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
