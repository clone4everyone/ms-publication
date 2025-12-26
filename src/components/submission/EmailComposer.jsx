import { useState } from 'react';
import { FaImage, FaPaperPlane } from 'react-icons/fa';

function EmailComposer({ onSend }) {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailImages, setEmailImages] = useState([]);

  const handleSend = () => {
    if (!emailSubject || !emailBody) {
      return;
    }
    onSend({ subject: emailSubject, body: emailBody, images: emailImages });
    setEmailSubject('');
    setEmailBody('');
    setEmailImages([]);
  };

  return (
    <div className="p-6 border-b-2 border-teal-100 bg-white animate-scale-in space-y-4">
      <input
        type="text"
        placeholder="Subject"
        value={emailSubject}
        onChange={(e) => setEmailSubject(e.target.value)}
        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
      />
      <textarea
        placeholder="Type your message..."
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        rows={5}
        className="w-full px-4 py-3 border-2 border-teal-200 rounded-xl text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-none"
      />
      <div className="flex items-center justify-between">
        <label className="cursor-pointer text-sm text-teal-700 hover:text-teal-900 font-medium flex items-center space-x-2 hover:scale-105 transition-transform">
          <FaImage className="w-4 h-4" />
          <span>Attach Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setEmailImages(Array.from(e.target.files))}
            className="hidden"
          />
        </label>
        {emailImages.length > 0 && (
          <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-bold">
            {emailImages.length} image(s)
          </span>
        )}
      </div>
      <button
        onClick={handleSend}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
      >
        <FaPaperPlane />
        <span>Send Message</span>
      </button>
    </div>
  );
}

export default EmailComposer;