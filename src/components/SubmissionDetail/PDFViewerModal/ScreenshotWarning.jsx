import { FaBan } from 'react-icons/fa';

function ScreenshotWarning() {
  return (
    <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-center space-x-3 animate-pulse">
      <FaBan className="w-5 h-5" />
      <span className="font-bold">
        Screenshot attempt detected and logged! This action may result in access revocation.
      </span>
    </div>
  );
}

export default ScreenshotWarning;