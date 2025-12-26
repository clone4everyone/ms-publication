import { useDispatch } from 'react-redux';
import { FaEnvelope, FaPaperPlane, FaImage } from 'react-icons/fa';
import { format } from 'date-fns';
import { sendEmail, getSubmissionEmails } from '../../redux/slices/emailSlice';
import { toast } from 'react-toastify';

function EmailPanel({
  submissionId,
  emails,
  user,
  showComposer,
  onToggleComposer,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  emailImages,
  setEmailImages
}) {
  const dispatch = useDispatch();

  const handleSendEmail = async () => {
    if (!emailSubject || !emailBody) {
      toast.error('Please fill in subject and body');
      return;
    }

    const result = await dispatch(sendEmail({
      submissionId,
      subject: emailSubject,
      body: emailBody,
      images: emailImages
    }));

    if (result.type === 'emails/send/fulfilled') {
      toast.success('Email sent successfully');
      onToggleComposer();
      setEmailSubject('');
      setEmailBody('');
      setEmailImages([]);
      dispatch(getSubmissionEmails(submissionId));
    }
  };

  return (
    <div className="w-[420px] border-l-2 border-teal-100 flex flex-col bg-gradient-to-b from-white to-teal-50/30">
      <div className="p-6 border-b-2 border-teal-100 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
              <FaEnvelope className="w-5 h-5 text-teal-900" />
            </div>
            <span>Communication</span>
          </h3>
          <button
            onClick={onToggleComposer}
            className="bg-white text-teal-700 hover:bg-amber-400 hover:text-teal-900 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {showComposer ? 'Cancel' : '+ New Message'}
          </button>
        </div>
      </div>

      {/* Email Composer */}
      {showComposer && (
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
            onClick={handleSendEmail}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <FaPaperPlane />
            <span>Send Message</span>
          </button>
        </div>
      )}

      {/* Email Thread */}
      <div className="flex-1 overflow-y-auto p-6">
        {emails.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="w-10 h-10 text-teal-600" />
            </div>
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-sm text-gray-400 mt-1">Start a conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emails.map((email, idx) => {
              const isFromMe = email.sender._id === user.id;
              return (
                <div
                  key={email._id}
                  className={`animate-fade-in-up ${isFromMe ? 'ml-6' : 'mr-6'}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div
                    className={`p-4 rounded-2xl ${
                      isFromMe
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 shadow-md hover-lift'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`font-bold text-sm ${isFromMe ? 'text-white' : 'text-gray-900'}`}>
                        {isFromMe ? 'You' : `${email.sender.firstName} ${email.sender.lastName}`}
                      </div>
                      <div className={`text-xs ${isFromMe ? 'text-teal-100' : 'text-gray-500'}`}>
                        {format(new Date(email.sentAt), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                    <div className={`text-sm font-bold mb-2 ${isFromMe ? 'text-white' : 'text-gray-900'}`}>
                      {email.subject}
                    </div>
                    <div className={`text-sm whitespace-pre-wrap ${isFromMe ? 'text-white' : 'text-gray-700'}`}>
                      {email.body}
                    </div>
                    {email.attachments && email.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {email.attachments.map((att, idx) => (
                          <img
                            key={idx}
                            src={att.url}
                            alt={att.filename}
                            className="max-w-full rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailPanel;