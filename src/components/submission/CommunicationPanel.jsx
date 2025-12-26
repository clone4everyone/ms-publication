import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaEnvelope, FaPaperPlane, FaImage } from 'react-icons/fa';
import { format } from 'date-fns';
import { sendEmail, getSubmissionEmails } from '../../redux/slices/emailSlice';
import { toast } from 'react-toastify';
import EmailComposer from './EmailComposer';
import EmailThread from './EmailThread';

function CommunicationPanel({ submissionId, user, emails }) {
  const dispatch = useDispatch();
  const [showEmailComposer, setShowEmailComposer] = useState(false);

  const handleSendEmail = async (emailData) => {
    const result = await dispatch(sendEmail({
      submissionId,
      ...emailData
    }));

    if (result.type === 'emails/send/fulfilled') {
      toast.success('Email sent successfully');
      setShowEmailComposer(false);
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
            onClick={() => setShowEmailComposer(!showEmailComposer)}
            className="bg-white text-teal-700 hover:bg-amber-400 hover:text-teal-900 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            {showEmailComposer ? 'Cancel' : '+ New Message'}
          </button>
        </div>
      </div>

      {showEmailComposer && <EmailComposer onSend={handleSendEmail} />}
      
      <EmailThread emails={emails} currentUserId={user.id} />
    </div>
  );
}

export default CommunicationPanel;