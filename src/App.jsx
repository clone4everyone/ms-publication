import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AuthorDashboard from './pages/AuthorDashboard';
import EditorDashboard from './pages/EditorDashboard';
import ReviewerDashboard from './pages/ReviewerDashboard';
import NewSubmission from './pages/NewSubmission';
import SubmissionDetail from './pages/SubmissionDetail';
import JournalView from './pages/JournalView';
import JournalHomepage from './pages/journalSubdomain/JournalHomepage';
import JournalDetail from './pages/journalSubdomain/JournalDetail';
import EditSubmission from './pages/EditSubmission';
import NotFound from './pages/NotFound';
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Route based on user role
const DashboardRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'author':
      return <Navigate to="/author/dashboard" replace />;
    case 'editor':
      return <Navigate to="/editor/dashboard" replace />;
    case 'reviewer':
      return <Navigate to="/reviewer/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<JournalHomepage />} /> 
          {/* Dashboard Redirect */}
          {/* <Route path="/" element={<DashboardRedirect />} /> */}
          {/* <Route path="/journals" element={<JournalHomepage />} /> */}
<Route path="/J-PHARMA-001" element={<JournalDetail />} />

          {/* Author Routes */}
          <Route
            path="/author/dashboard"
            element={
              <ProtectedRoute allowedRoles={['author']}>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author/new-submission"
            element={
              <ProtectedRoute allowedRoles={['author']}>
                <NewSubmission />
              </ProtectedRoute>
            }
          />
          <Route
  path="/author/edit-submission/:id"
  element={
    <ProtectedRoute allowedRoles={['author']}>
      <EditSubmission />
    </ProtectedRoute>
  }
/>
          <Route
            path="/submission/:id"
            element={
              <ProtectedRoute>
                <SubmissionDetail />
              </ProtectedRoute>
            }
          />

          {/* Editor Routes */}
          {/* <Route
            path="/editor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['editor']}>
                <EditorDashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/editor/journal/:journal"
            element={
              <ProtectedRoute allowedRoles={['editor']}>
                <JournalView />
              </ProtectedRoute>
            }
          />

          {/* Reviewer Routes */}
          {/* <Route
            path="/reviewer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['reviewer']}>
                <ReviewerDashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/reviewer/journal/:journal"
            element={
              <ProtectedRoute allowedRoles={['reviewer']}>
                <JournalView />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;











// import React, { useState } from 'react';
// import { Search, BookOpen, Users, FileText, Bell, ChevronRight, Menu, X } from 'lucide-react';

// export default function App() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const latestArticles = [
//     {
//       title: "Novel Approaches in Drug Delivery Systems for Targeted Cancer Therapy",
//       authors: "Smith, J., Anderson, K., & Lee, M.",
//       date: "November 2024",
//       volume: "Vol 15, Issue 6",
//       abstract: "This study explores innovative drug delivery mechanisms..."
//     },
//     {
//       title: "Pharmacokinetic Analysis of Next-Generation Antibiotics",
//       authors: "Rodriguez, P., Chen, L., & Williams, R.",
//       date: "November 2024",
//       volume: "Vol 15, Issue 6",
//       abstract: "Comprehensive analysis of pharmacokinetic properties..."
//     },
//     {
//       title: "Advances in Personalized Medicine: A Pharmaceutical Perspective",
//       authors: "Thompson, D., Kumar, S., & Zhang, Y.",
//       date: "October 2024",
//       volume: "Vol 15, Issue 5",
//       abstract: "Exploring the integration of genomics in pharmaceutical development..."
//     }
//   ];

//   const navItems = ['Home', 'About', 'Editorial Board', 'Submit Article', 'Current Issue', 'Archives', 'Contact'];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-[#FFD400] to-[#9b8100] text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-3">
//               <BookOpen className="w-8 h-8 text-[#816A79]" />
//               <div>
//                 <h1 className="text-2xl font-bold text-[#893F38]">Pharmacological & Pharmaceutical Innovation</h1>
//                 <p className="text-[#006B8F] text-sm">International Peer-Reviewed Journal</p>
//               </div>
//             </div>
            
//             {/* Mobile menu button */}
//             <button 
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="lg:hidden"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block pb-4`}>
//             <ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0">
//               {navItems.map((item) => (
//                 <li key={item}>
//                   <a href="#" className="block hover:text-[#006B8F] transition-colors py-1">
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-[#006B8F] to-blue-50 py-12 border-b border-[#006B8F">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div>
//               <h2 className="text-4xl font-bold text-[#B43B3A] mb-4">
//                 Advancing Pharmaceutical Science
//               </h2>
//               <p className="text-lg text-gray-700 mb-6">
//                 Publishing cutting-edge research in pharmacology, drug development, and pharmaceutical innovation since 2009.
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 <button className="bg-[#006B8F] hover:bg-[#05ace3] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
//                   Submit Your Research
//                 </button>
//                 <button className="border-2 border-[#006B8F] text-[#006B8F] hover:text-white hover:bg-[#006B8F] px-6 py-3 rounded-lg font-semibold transition-colors">
//                   Browse Articles
//                 </button>
//               </div>
//             </div>
            
//             <div className="bg-white p-6 rounded-xl shadow-lg">
//               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//                 <Bell className="w-5 h-5 mr-2 text-[#006B8F]" />
//                 Journal Highlights
//               </h3>
//               <ul className="space-y-3 text-gray-700">
//                 <li className="flex items-start">
//                   <ChevronRight className="w-5 h-5 text-[#006B8F] mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Impact Factor: 3.84 (2024)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <ChevronRight className="w-5 h-5 text-[#006B8F] mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Open Access - Free to read for all</span>
//                 </li>
//                 <li className="flex items-start">
//                   <ChevronRight className="w-5 h-5 text-[#006B8F] mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Rapid peer review (4-6 weeks)</span>
//                 </li>
//                 <li className="flex items-start">
//                   <ChevronRight className="w-5 h-5 text-[#006B8F] mr-2 flex-shrink-0 mt-0.5" />
//                   <span>Indexed in major databases</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Search Bar */}
//       <section className="bg-white py-6 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="max-w-3xl mx-auto">
//             <div className="relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search articles, authors, keywords..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#006B8F] focus:outline-none"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Latest Articles */}
//           <div className="lg:col-span-2">
//             <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Articles</h2>
//             <div className="space-y-6">
//               {latestArticles.map((article, index) => (
//                 <article key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
//                   <div className="flex items-start justify-between mb-3">
//                     <span className="text-sm font-semibold text-[#006B8F] bg-teal-50 px-3 py-1 rounded-full">
//                       {article.volume}
//                     </span>
//                     <span className="text-sm text-gray-500">{article.date}</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-[#006B8F] cursor-pointer">
//                     {article.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-3">{article.authors}</p>
//                   <p className="text-gray-700 mb-4">{article.abstract}</p>
//                   <div className="flex gap-3">
//                     <button className="text-[#006B8F] hover:text-teal-700 font-semibold text-sm flex items-center">
//                       Read Full Article <ChevronRight className="w-4 h-4 ml-1" />
//                     </button>
//                     <button className="text-gray-600 hover:text-gray-700 font-semibold text-sm">
//                       Download PDF
//                     </button>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <aside className="space-y-6">
//             {/* Current Issue */}
//             <div className="bg-gradient-to-br from-[#006B8F] to-teal-700 text-white p-6 rounded-xl shadow-lg">
//               <h3 className="text-xl font-bold mb-3">Current Issue</h3>
//               <p className="text-teal-100 mb-4">Volume 15, Issue 6</p>
//               <p className="mb-4">November 2024</p>
//               <button className="bg-white text-[#006B8F] hover:bg-teal-50 px-4 py-2 rounded-lg font-semibold w-full transition-colors">
//                 View Issue
//               </button>
//             </div>

//             {/* Quick Links */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//                 <FileText className="w-5 h-5 mr-2 text-[#006B8F]" />
//                 For Authors
//               </h3>
//               <ul className="space-y-3">
//                 <li>
//                   <a href="#" className="text-[#006B8F] hover:text-teal-700 flex items-center">
//                     <ChevronRight className="w-4 h-4 mr-1" />
//                     Submission Guidelines
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-[#006B8F] hover:text-teal-700 flex items-center">
//                     <ChevronRight className="w-4 h-4 mr-1" />
//                     Author Instructions
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-[#006B8F] hover:text-teal-700 flex items-center">
//                     <ChevronRight className="w-4 h-4 mr-1" />
//                     Article Processing Charges
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-[#006B8F] hover:text-teal-700 flex items-center">
//                     <ChevronRight className="w-4 h-4 mr-1" />
//                     Track Your Submission
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Editorial Board */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//               <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
//                 <Users className="w-5 h-5 mr-2 text-[#006B8F]" />
//                 Editorial Board
//               </h3>
//               <p className="text-gray-700 mb-4">
//                 Led by internationally recognized experts in pharmaceutical sciences.
//               </p>
//               <button className="text-[#006B8F] hover:text-teal-700 font-semibold flex items-center">
//                 View Full Board <ChevronRight className="w-4 h-4 ml-1" />
//               </button>
//             </div>
//           </aside>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h4 className="text-white font-bold mb-4">About Journal</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="hover:text-teal-400">Aims & Scope</a></li>
//                 <li><a href="#" className="hover:text-teal-400">Editorial Board</a></li>
//                 <li><a href="#" className="hover:text-teal-400">Indexing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-bold mb-4">For Authors</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="hover:text-teal-400">Submit Article</a></li>
//                 <li><a href="#" className="hover:text-teal-400">Author Guidelines</a></li>
//                 <li><a href="#" className="hover:text-teal-400">Peer Review</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-bold mb-4">Resources</h4>
//               <ul className="space-y-2 text-sm">
//                 <li><a href="#" className="hover:text-teal-400">Archives</a></li>
//                 <li><a href="#" className="hover:text-teal-400">Special Issues</a></li>
//                 <li><a href="#" className="hover:text-teal-400">FAQs</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-white font-bold mb-4">Contact</h4>
//               <ul className="space-y-2 text-sm">
//                 <li>Email: editor@ppjournal.com</li>
//                 <li>Phone: +1 (555) 123-4567</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-sm">
//             <p>&copy; 2024 Pharmacological & Pharmaceutical Innovation. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }