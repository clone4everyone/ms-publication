import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, User, LogIn, Menu, X, ChevronRight, 
  Home as HomeIcon, Info, Mail, Users, Calendar, 
  Archive, FileText, Send
} from 'lucide-react';
import axios from 'axios';

function JournalDetail() {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const subpages = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'about', label: 'About', icon: Info },
    { id: 'current', label: 'Current Issue', icon: FileText },
    { id: 'archives', label: 'Archives', icon: Archive },
    { id: 'instructions', label: 'Instructions to Authors', icon: FileText },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'editorial', label: 'Editorial Board', icon: Users }
  ];

  useEffect(() => {
    fetchJournalDetails();
    checkAuth();
  }, [journalId]);

  const fetchJournalDetails = async () => {
    try {
      const response = await axios.get(`/api/journals/${journalId}`);
      if (response.data.success) {
        setJournal(response.data.data.journal);
      }
    } catch (error) {
      console.error('Error fetching journal:', error);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/journals');
  };

  if (!journal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/journals')}
                className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
              >
                <BookOpen className="w-6 h-6" />
                <span className="font-bold text-lg hidden md:block">MS Publications</span>
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">{journal.acronym}</span>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              {subpages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => isAuthenticated ? navigate('/author/new-submission') : navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Article</span>
              </button>
              
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button
                      onClick={() => navigate(`/${user.role}/dashboard`)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-2">
              {subpages.map(page => (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    currentPage === page.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span>{page.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage journal={journal} />}
        {currentPage === 'about' && <AboutPage journal={journal} />}
        {currentPage === 'current' && <CurrentIssuePage journal={journal} />}
        {currentPage === 'archives' && <ArchivesPage journal={journal} />}
        {currentPage === 'instructions' && <InstructionsPage journal={journal} />}
        {currentPage === 'contact' && <ContactPage journal={journal} />}
        {currentPage === 'editorial' && <EditorialBoardPage journal={journal} />}
      </div>
    </div>
  );
}

// Subpage Components
const HomePage = ({ journal }) => (
  <div>
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-8 shadow-xl">
      <h1 className="text-4xl font-bold mb-4">{journal.name}</h1>
      <p className="text-xl text-white/90 mb-6">{journal.description}</p>
      <div className="flex flex-wrap gap-4">
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
          <span className="text-sm">ISSN: {journal.issn}</span>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
          <span className="text-sm">Impact Factor: {journal.impactFactor}</span>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
          <span className="text-sm">Open Access</span>
        </div>
      </div>
    </div>
    
    {/* Latest Articles Section */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Articles</h2>
      <p className="text-gray-600">Recent publications will be displayed here.</p>
    </div>
  </div>
);

const AboutPage = ({ journal }) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <h1 className="text-4xl font-bold mb-6">About {journal.acronym}</h1>
    <div className="prose max-w-none">
      <p className="text-lg text-gray-700 leading-relaxed">
        {journal.about || journal.description}
      </p>
    </div>
  </div>
);

const CurrentIssuePage = ({ journal }) => (
  <div>
    <h1 className="text-4xl font-bold mb-6">Current Issue</h1>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-gray-600">Current issue articles will be displayed here.</p>
    </div>
  </div>
);

const ArchivesPage = ({ journal }) => (
  <div>
    <h1 className="text-4xl font-bold mb-8">Archives - {journal.acronym}</h1>
    <div className="space-y-6">
      {/* Sample archive entries */}
      {[
        { vol: 17, issue: 6, period: 'Nov-Dec', year: 2025, published: '07-11-2025', articles: 8 },
        { vol: 17, issue: 5, period: 'Sep-Oct', year: 2025, published: '05-09-2025', articles: 12 }
      ].map((issue, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vol {issue.vol}, Issue {issue.issue} ({issue.period}), {issue.year}
              </h2>
              <p className="text-sm text-gray-600">Published: {issue.published}</p>
            </div>
            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
              {issue.articles} Articles
            </span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
            View All Articles
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

const InstructionsPage = ({ journal }) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <h1 className="text-4xl font-bold mb-6">Instructions to Authors</h1>
    <div className="prose max-w-none">
      <p className="text-gray-700 leading-relaxed">
        {journal.instructions || 'Submission guidelines will be displayed here.'}
      </p>
    </div>
  </div>
);

const ContactPage = ({ journal }) => (
  <div className="bg-white rounded-xl shadow-sm p-8">
    <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
    <div className="space-y-4">
      {journal.contact?.email && (
        <div>
          <span className="font-semibold">Email:</span>
          <span className="ml-2">{journal.contact.email}</span>
        </div>
      )}
      {journal.contact?.phone && (
        <div>
          <span className="font-semibold">Phone:</span>
          <span className="ml-2">{journal.contact.phone}</span>
        </div>
      )}
      {journal.contact?.address && (
        <div>
          <span className="font-semibold">Address:</span>
          <span className="ml-2">{journal.contact.address}</span>
        </div>
      )}
    </div>
  </div>
);

const EditorialBoardPage = ({ journal }) => (
  <div>
    <h1 className="text-4xl font-bold mb-8">Editorial Board</h1>
    <div className="grid md:grid-cols-2 gap-6">
      {journal.editorialBoard?.map((member, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-2">{member.name}</h3>
          <p className="text-blue-600 font-medium mb-2">{member.position}</p>
          <p className="text-gray-600 text-sm mb-3">{member.affiliation}</p>
          {member.bio && <p className="text-gray-700 text-sm">{member.bio}</p>}
        </div>
      )) || <p className="text-gray-600">Editorial board information will be displayed here.</p>}
    </div>
  </div>
);

export default JournalDetail;