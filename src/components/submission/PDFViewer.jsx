import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaUndo } from 'react-icons/fa';

function ActionModal({ type, actionNotes, setActionNotes, publicationDate, setPublicationDate, onClose, onConfirm }) {
  const getModalTitle = () => {
    if (type === 'editor_sendback') return 'Send Back to Author';
    if (type === 'sendback') return 'Send Back to Editor';
    if (type === 'schedule') return 'Schedule Publication';
    return `${type.charAt(0).toUpperCase() + type.slice(1)} Submission`;
  };

  const getGradientClass = () => {
    if (type === 'approve') return 'from-emerald-500 to-teal-600';
    if (type === 'reject') return 'from-rose-500 to-red-600';
    if (type === 'editor_sendback') return 'from-amber-500 to-orange-600';
    if (type === 'sendback') return 'from-orange-500 to-amber-600';
    return 'from-indigo-500 to-blue-600';
  };

  const getButtonClass = () => {
    if (type === 'approve') return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700';
    if (type === 'reject') return 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700';
    if (type === 'sendback' || type === 'editor_sendback') return 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700';
    return 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-scale-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className={`p-6 bg-gradient-to-r ${getGradientClass()} text-white rounded-t-2xl`}>
          <h3 className="text-2xl font-bold capitalize flex items-center space-x-3">
            {(type === 'editor_sendback' || type === 'sendback') && <FaUndo className="w-6 h-6" />}
            <span>{getModalTitle()}</span>
          </h3>
        </div>

        <div className="p-6">
          {type === 'schedule' ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Publication Date
              </label>
              <input
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              />
            </div>
          ) : (type === 'sendback' || type === 'editor_sendback') ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {type === 'editor_sendback' ? 'Notes for Author *' : 'Notes for Editor *'}
              </label>
              <p className="text-sm text-gray-600 mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                Please explain what changes or corrections are needed in the submission.
              </p>
              <ReactQuill
                theme="snow"
                value={actionNotes}
                onChange={setActionNotes}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                  ]
                }}
                placeholder="Enter detailed notes about required changes..."
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                {type === 'reject' ? 'Rejection Reason *' : 'Notes (Optional)'}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all resize-none"
                placeholder={type === 'reject' ? 'Please provide detailed feedback...' : 'Add any notes...'}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-100 font-medium transition-all duration-300 hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${getButtonClass()}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;