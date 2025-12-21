// SubmissionTimeline.jsx - Complete updated component

import React from 'react';
import { format } from 'date-fns';
import { 
  FaPaperPlane, 
  FaCheck, 
  FaBan, 
  FaEdit, 
  FaUserTie, 
  FaCalendar, 
  FaBook,
  FaUndo,
  FaForward
} from 'react-icons/fa';

const SubmissionTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const getEventIcon = (eventType) => {
    const iconMap = {
      submitted: FaPaperPlane,
      author_edited: FaEdit,
      editor_approved: FaCheck,
      editor_rejected: FaBan,
      editor_sent_back: FaUndo,
      forwarded_to_reviewer: FaForward,
      reviewer_sent_back: FaUndo,
      reviewer_approved: FaCheck,
      reviewer_rejected: FaBan,
      scheduled: FaCalendar,
      published: FaBook,
    };
    return iconMap[eventType] || FaPaperPlane;
  };

  const getEventColor = (eventType) => {
    const colorMap = {
      submitted: 'from-blue-500 to-blue-600',
      author_edited: 'from-teal-500 to-teal-600',
      editor_approved: 'from-emerald-500 to-green-600',
      editor_rejected: 'from-rose-500 to-red-600',
      editor_sent_back: 'from-amber-500 to-orange-600',
      forwarded_to_reviewer: 'from-violet-500 to-purple-600',
      reviewer_sent_back: 'from-orange-500 to-amber-600',
      reviewer_approved: 'from-emerald-500 to-teal-600',
      reviewer_rejected: 'from-rose-500 to-red-600',
      scheduled: 'from-indigo-500 to-blue-600',
      published: 'from-teal-500 to-cyan-600',
    };
    return colorMap[eventType] || 'from-gray-500 to-gray-600';
  };

  const getBorderColor = (eventType) => {
    const colorMap = {
      submitted: 'border-blue-200 bg-blue-50',
      author_edited: 'border-teal-200 bg-teal-50',
      editor_approved: 'border-emerald-200 bg-emerald-50',
      editor_rejected: 'border-rose-200 bg-rose-50',
      editor_sent_back: 'border-amber-200 bg-amber-50',
      forwarded_to_reviewer: 'border-violet-200 bg-violet-50',
      reviewer_sent_back: 'border-orange-200 bg-orange-50',
      reviewer_approved: 'border-emerald-200 bg-emerald-50',
      reviewer_rejected: 'border-rose-200 bg-rose-50',
      scheduled: 'border-indigo-200 bg-indigo-50',
      published: 'border-teal-200 bg-teal-50',
    };
    return colorMap[eventType] || 'border-gray-200 bg-gray-50';
  };

  // Check if event has detailed notes to display
  const hasDetailedNotes = (event) => {
    return event.notes && event.notes.trim().length > 0 && 
           ['editor_sent_back', 'reviewer_sent_back', 'editor_rejected', 'reviewer_rejected'].includes(event.eventType);
  };

  return (
    <div className="glass-morphism rounded-2xl shadow-xl p-8 animate-fade-in-up animate-delay-200 hover-lift">
      <div className="mb-6 flex items-center space-x-3">
        <div className="w-1 h-8 bg-gradient-to-b from-teal-600 to-amber-400 rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-teal-700 to-amber-600 bg-clip-text text-transparent">
          Submission Journey
        </h2>
      </div>

      <div className="relative">
        {/* Vertical line connecting all events */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-300 via-blue-300 to-amber-300"></div>

        <div className="space-y-6">
          {timeline.map((event, index) => {
            const Icon = getEventIcon(event.eventType);
            const gradientColor = getEventColor(event.eventType);
            const borderColor = getBorderColor(event.eventType);
            const showNotes = hasDetailedNotes(event);

            return (
              <div key={index} className="relative flex items-start space-x-6 group">
                {/* Icon Circle */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 bg-gradient-to-br ${gradientColor} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Event Content Card */}
                <div className={`flex-1 ${borderColor} border-2 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300`}>
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                    <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                      {format(new Date(event.timestamp), 'MMM dd, yyyy • HH:mm')}
                    </span>
                  </div>

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                  )}

                  {/* Metadata (if exists) */}
                  {event.metadata && (
                    <div className="text-xs text-gray-600 mt-2">
                      {event.metadata.publicationDate && (
                        <span className="font-medium">
                          📅 Scheduled for: {format(new Date(event.metadata.publicationDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Detailed Notes Section - EXPANDED VERSION */}
                  {showNotes && (
                    <div className={`mt-4 p-4 rounded-lg border-2 ${
                      event.eventType === 'editor_sent_back' ? 'bg-amber-50/50 border-amber-300' :
                      event.eventType === 'reviewer_sent_back' ? 'bg-orange-50/50 border-orange-300' :
                      'bg-rose-50/50 border-rose-300'
                    }`}>
                      <div className="flex items-center space-x-2 mb-3">
                        <FaUndo className={`w-4 h-4 ${
                          event.eventType === 'editor_sent_back' ? 'text-amber-700' :
                          event.eventType === 'reviewer_sent_back' ? 'text-orange-700' :
                          'text-rose-700'
                        }`} />
                        <h4 className={`font-bold text-sm ${
                          event.eventType === 'editor_sent_back' ? 'text-amber-900' :
                          event.eventType === 'reviewer_sent_back' ? 'text-orange-900' :
                          'text-rose-900'
                        }`}>
                          {event.eventType === 'editor_sent_back' ? "Editor's Feedback - Changes Required" :
                           event.eventType === 'reviewer_sent_back' ? "Reviewer's Feedback - Changes Required" :
                           event.eventType === 'editor_rejected' ? "Editor's Rejection Reason" :
                           "Reviewer's Rejection Reason"}
                        </h4>
                      </div>
                      
                      {/* Rich text notes display */}
                      <div 
                        className={`prose prose-sm max-w-none ${
                          event.eventType === 'editor_sent_back' ? 'text-amber-900' :
                          event.eventType === 'reviewer_sent_back' ? 'text-orange-900' :
                          'text-rose-900'
                        }`}
                        dangerouslySetInnerHTML={{ __html: event.notes }}
                      />

                      {/* Action hint for send-back events */}
                      {(event.eventType === 'editor_sent_back' || event.eventType === 'reviewer_sent_back') && (
                        <div className={`mt-3 text-xs italic ${
                          event.eventType === 'editor_sent_back' ? 'text-amber-700' : 'text-orange-700'
                        } bg-white/60 rounded-lg p-2 border ${
                          event.eventType === 'editor_sent_back' ? 'border-amber-200' : 'border-orange-200'
                        }`}>
                          💡 {event.eventType === 'editor_sent_back' 
                            ? 'Please review the feedback and update your submission using the Edit button.' 
                            : 'Editor will review the feedback and take appropriate action.'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Performed by info */}
                  {event.performedByRole && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs font-medium text-gray-500 capitalize flex items-center space-x-1">
                        <FaUserTie className="w-3 h-3" />
                        <span>Action by: {event.performedByRole}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubmissionTimeline;