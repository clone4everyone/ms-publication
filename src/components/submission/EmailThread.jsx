import { FaEnvelope } from 'react-icons/fa';
import { format } from 'date-fns';

function EmailThread({ emails, currentUserId }) {
  if (emails.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="w-10 h-10 text-teal-600" />
          </div>
          <p className="text-gray-500 font-medium">No messages yet</p>
          <p className="text-sm text-gray-400 mt-1">Start a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-4">
        {emails.map((email, idx) => {
          const isFromMe = email.sender._id === currentUserId;
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
    </div>
  );
}

export default EmailThread;
