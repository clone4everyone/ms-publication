import { FaFileAlt, FaClock, FaCheck, FaBan, FaUser, FaCalendar, FaBook } from 'react-icons/fa';

export const getStatusBadge = (status) => {
  const statusMap = {
    draft: { class: 'bg-slate-100 text-slate-700 border-slate-300', text: 'Draft', icon: FaFileAlt },
    pending: { class: 'bg-amber-50 text-amber-700 border-amber-300', text: 'Pending Review', icon: FaClock },
    approved_by_editor: { class: 'bg-sky-50 text-sky-700 border-sky-300', text: 'Approved by Editor', icon: FaCheck },
    rejected_by_editor: { class: 'bg-rose-50 text-rose-700 border-rose-300', text: 'Rejected', icon: FaBan },
    with_reviewer: { class: 'bg-violet-50 text-violet-700 border-violet-300', text: 'With Reviewer', icon: FaUser },
    approved_by_reviewer: { class: 'bg-emerald-50 text-emerald-700 border-emerald-300', text: 'Approved by reviewer', icon: FaCheck },
    rejected_by_reviewer: { class: 'bg-rose-50 text-rose-700 border-rose-300', text: 'Rejected', icon: FaBan },
    scheduled: { class: 'bg-indigo-50 text-indigo-700 border-indigo-300', text: 'Scheduled', icon: FaCalendar },
    published: { class: 'bg-teal-50 text-teal-700 border-teal-300', text: 'Published', icon: FaBook },
  };
  return statusMap[status] || { class: 'bg-slate-100 text-slate-700 border-slate-300', text: status, icon: FaFileAlt };
};