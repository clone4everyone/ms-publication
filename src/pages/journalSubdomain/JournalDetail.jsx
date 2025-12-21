import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, User, LogIn, Menu, X, ChevronRight, 
  Home as HomeIcon, Info, Mail, Users, Calendar, 
  Archive, FileText, Send, Award, TrendingUp, Eye,
  Download, Share2, Star, Sparkles, Zap, Globe
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../redux/slices/authSlice';
import api from "../../utils/api"
import logo from "../../../public/ms-logo.png"
function JournalDetail() {
  // const { journalId } = useParams();
   const dispatch = useDispatch();
  const journalId='J-PHARMA-001'
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Updated to match MS Publications branding
  const journalColors = {
    IJPS: { 
      gradient: 'from-[#1B7A9C] to-[#156680]', 
      accent: 'bg-[#1B7A9C]', 
      light: 'bg-teal-50',
      border: 'border-[#1B7A9C]',
      text: 'text-[#1B7A9C]'
    },
    JHS: { 
      gradient: 'from-[#FDB913] to-[#F5A800]', 
      accent: 'bg-[#FDB913]', 
      light: 'bg-yellow-50',
      border: 'border-[#FDB913]',
      text: 'text-[#FDB913]'
    },
    IJCR: { 
      gradient: 'from-[#1B7A9C] to-teal-600', 
      accent: 'bg-teal-500', 
      light: 'bg-teal-50',
      border: 'border-teal-500',
      text: 'text-teal-600'
    },
    IJSR: { 
      gradient: 'from-[#1B7A9C] to-cyan-600', 
      accent: 'bg-cyan-500', 
      light: 'bg-cyan-50',
      border: 'border-cyan-500',
      text: 'text-cyan-600'
    },
    JAT: { 
      gradient: 'from-[#FDB913] to-amber-500', 
      accent: 'bg-amber-500', 
      light: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-600'
    }
  };

  const subpages = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'about', label: 'About', icon: Info },
    { id: 'current', label: 'Current Issue', icon: FileText },
    { id: 'archives', label: 'Archives', icon: Archive },
    { id: 'instructions', label: 'Instructions', icon: Send },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'editorial', label: 'Editorial Board', icon: Users }
  ];

  useEffect(() => {
    fetchJournalDetails();
    checkAuth();

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [journalId]);

  const fetchJournalDetails = async () => {
    try {
      const response = await api.get(`/api/journals/${journalId}`);
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
    dispatch(logout());
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  if (!journal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-teal-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-[#1B7A9C] rounded-full animate-spin border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  const colors = journalColors[journal.acronym] || journalColors.IJPS;

  return (
    <div className="min-h-screen bg-white">
      {/* Animated Background - Light theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1B7A9C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FDB913] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-sm transition-all duration-300 ${scrollY > 50 ? 'shadow-lg' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/J-PHARMA-001')}
                className="group flex items-center space-x-3 hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br  rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <img className="w-11 h-11 " src={logo}/>
                </div>
                <div className="hidden md:block">
                  <div className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#1B7A9C] to-teal-600">MS Publications</div>
                  <div className="text-xs text-gray-500">Research Excellence</div>
                </div>
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {/* <span className="font-semibold text-gray-700">{journal.acronym}</span> */}
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              {subpages.map(page => (
                <button
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    currentPage === page.id
                      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <page.icon className="w-4 h-4 inline mr-2" />
                  {page.label}
                  {currentPage === page.id && (
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r ${colors.gradient} rounded-full`}></div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => isAuthenticated ? navigate('/author/new-submission') : navigate('/login')}
                className={`group relative bg-gradient-to-r ${colors.gradient} text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg hover:shadow-xl overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Article</span>
                </div>
              </button>
              
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200">
                    <div className={`w-8 h-8 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                      {user?.firstName?.[0]}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.firstName}</span>
                  </button>
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
                    <button
                      onClick={() => navigate(`/${user.role}/dashboard`)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl hover:scale-105 transition-all border border-gray-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
            <div className="space-y-2">
              {subpages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setCurrentPage(page.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center space-x-3 transition-all duration-300 ${
                    currentPage === page.id
                      ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg`
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <page.icon className="w-5 h-5" />
                  <span className="font-medium">{page.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="relative pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-page-enter">
            {currentPage === 'home' && <HomePage journal={journal} colors={colors} scrollY={scrollY} />}
            {currentPage === 'about' && <AboutPage journal={journal} colors={colors} />}
            {currentPage === 'current' && <CurrentIssuePage journal={journal} colors={colors} />}
            {currentPage === 'archives' && <ArchivesPage journal={journal} colors={colors} />}
            {currentPage === 'instructions' && <InstructionsPage journal={journal} colors={colors} />}
            {currentPage === 'contact' && <ContactPage journal={journal} colors={colors} />}
            {currentPage === 'editorial' && <EditorialBoardPage journal={journal} colors={colors} />}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes page-enter {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-page-enter {
          animation: page-enter 0.6s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </div>
  );
}

// HomePage Component
const HomePage = ({ journal, colors, scrollY }) => {
  const [stats] = useState([
    { icon: FileText, label: 'Articles Published', value: '2,450+', change: '+15%' },
    { icon: Award, label: 'Impact Factor', value: journal.impactFactor, change: '+0.3' },
    { icon: Eye, label: 'Monthly Views', value: '45.2K', change: '+22%' },
    { icon: Globe, label: 'Global Citations', value: '8,750+', change: '+18%' }
  ]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div 
        className="relative"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div className={`relative bg-gradient-to-br ${colors.gradient} rounded-3xl p-12 overflow-hidden shadow-2xl`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30px 30px, white 3px, transparent 0)`,
              backgroundSize: '60px 60px',
              animation: 'float 20s linear infinite'
            }}></div>
          </div>

          {/* Floating Shapes */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-lg rotate-12 blur-2xl animate-float"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-8">
              <div className="space-y-4 flex-1 min-w-[300px] animate-slide-in-left">
                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-bold text-white">Open Access • Peer Reviewed</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                  {journal.name}
                </h1>
                
                <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
                  {journal.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30 hover:scale-105 transition-transform">
                    <span className="font-bold text-white">ISSN: {journal.issn}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30 hover:scale-105 transition-transform">
                    <span className="font-bold text-white">IF: {journal.impactFactor}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30 hover:scale-105 transition-transform flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-white" />
                    <span className="font-bold text-white">Fast Review</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block animate-slide-in-right">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 bg-white/10 rounded-3xl blur-2xl animate-float"></div>
                  <div className="relative w-full h-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center transform hover:rotate-6 hover:scale-110 transition-all duration-500">
                    <BookOpen className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`group relative animate-fade-in-up delay-${index * 100}`}
          >
            <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-xl">
              <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium mb-2">{stat.label}</div>
              <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>{stat.change} this year</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Articles */}
      <div className="space-y-8 animate-fade-in-up delay-400">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Latest Publications</h2>
            <p className="text-gray-600">Cutting-edge research from leading scientists</p>
          </div>
          <button className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg`}>
            <span>View All</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item, index) => (
            <div
              key={item}
              className={`group relative animate-scale-in delay-${index * 100}`}
            >
              <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-gray-500">RESEARCH ARTICLE</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">Vol 17, Issue {7 - item}</span>
                    </div>
                    <h3 className={`text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:${colors.text} transition-colors`}>
                      Advanced Research in {journal.acronym}: Novel Approaches and Methodologies
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      Comprehensive study exploring innovative techniques and their applications in modern research contexts...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 500) + 200}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{Math.floor(Math.random() * 100) + 50}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>4.{Math.floor(Math.random() * 3) + 7}</span>
                        </div>
                      </div>
                      <button className={`text-xs font-bold ${colors.text} hover:underline transition-colors flex items-center space-x-1`}>
                        <span>Read More</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About Page
const AboutPage = ({ journal, colors }) => (
  <div className="space-y-8">
    <div className="animate-slide-in-left">
      <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
        About <span className={`bg-clip-text text-transparent bg-gradient-to-r ${colors.gradient}`}>{journal.acronym}</span>
      </h1>
      <p className="text-xl text-gray-600">Excellence in research publication</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6 animate-fade-in-up">
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {journal.about || journal.description}
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are committed to advancing scientific knowledge through rigorous peer review and open access publishing. Our journal provides a platform for researchers worldwide to share groundbreaking discoveries and innovative methodologies.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: 'Fast Review', desc: 'Average 14-day review process' },
              { icon: Globe, title: 'Global Reach', desc: 'Published in 150+ countries' },
              { icon: Award, title: 'High Impact', desc: 'Consistently high citation rates' },
              { icon: Users, title: 'Expert Reviewers', desc: 'Rigorous peer review system' }
            ].map((feature, index) => (
              <div key={index} className={`group p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 delay-${index * 100}`}>
                <div className={`w-10 h-10 bg-gradient-to-br ${colors.gradient} rounded-lg flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 animate-slide-in-right">
        <div className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-8 shadow-2xl`}>
          <Sparkles className="w-12 h-12 text-white mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-3">Quick Stats</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-white/80 mb-1">Impact Factor</div>
              <div className="text-3xl font-black text-white">{journal.impactFactor}</div>
            </div>
            <div>
              <div className="text-sm text-white/80 mb-1">ISSN</div>
              <div className="text-xl font-bold text-white">{journal.issn}</div>
            </div>
            <div>
              <div className="text-sm text-white/80 mb-1">Publication Type</div>
              <div className="text-lg font-bold text-white">Open Access</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4">Publishing Ethics</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start space-x-2">
              <ChevronRight className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
              <span>Rigorous peer review process</span>
            </li>
            <li className="flex items-start space-x-2">
              <ChevronRight className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
              <span>Ethical publication standards</span>
            </li>
            <li className="flex items-start space-x-2">
              <ChevronRight className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
              <span>Plagiarism detection tools</span>
            </li>
            <li className="flex items-start space-x-2">
              <ChevronRight className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
              <span>Open access commitment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Current Issue Page
const CurrentIssuePage = ({ journal, colors }) => (
  <div className="space-y-8">
    <div className="animate-slide-in-left">
      <h1 className="text-5xl font-black text-gray-900 mb-2">Current Issue</h1>
      <p className="text-xl text-gray-600">Latest research and discoveries</p>
    </div>

    <div className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-8 shadow-2xl animate-scale-in`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-sm text-white/80 mb-2">LATEST ISSUE</div>
          <h2 className="text-3xl font-black text-white">Volume 17, Issue 6</h2>
          <p className="text-white/90 mt-2">November-December 2025</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-white">12</div>
          <div className="text-sm text-white/80">Articles</div>
        </div>
      </div>
      <button className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-md border border-white/30 hover:scale-105">
        View Complete Issue
      </button>
    </div>

    <div className="grid gap-6 animate-fade-in-up delay-200">
      {[1, 2, 3].map((item, index) => (
        <div key={item} className={`group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-[1.01] shadow-lg hover:shadow-xl animate-fade-in-up delay-${(index + 3) * 100}`}>
          <div className="flex items-start space-x-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
              <FileText className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 ${colors.light} ${colors.text} rounded-full text-xs font-bold border-2 ${colors.border}`}>
                  RESEARCH ARTICLE
                </span>
                <span className="text-xs text-gray-500">Pages {item * 15}-{item * 15 + 12}</span>
              </div>
              <h3 className={`text-xl font-bold text-gray-900 mb-2 group-hover:${colors.text} transition-colors`}>
                Innovative Methodologies in {journal.acronym} Research: A Comprehensive Analysis
              </h3>
              <p className="text-gray-600 mb-3">
                Authors: Dr. John Smith, Dr. Sarah Johnson, Prof. Michael Chen
              </p>
              <p className="text-sm text-gray-500 mb-4">
                This groundbreaking study presents novel approaches to understanding complex phenomena in the field, offering new perspectives and practical applications...
              </p>
              <div className="flex items-center space-x-4">
                <button className={`flex items-center space-x-2 text-sm font-bold ${colors.text} hover:underline transition-colors`}>
                  <Eye className="w-4 h-4" />
                  <span>View Abstract</span>
                </button>
                <button className={`flex items-center space-x-2 text-sm font-bold ${colors.text} hover:underline transition-colors`}>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button className={`flex items-center space-x-2 text-sm font-bold ${colors.text} hover:underline transition-colors`}>
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Archives Page
const ArchivesPage = ({ journal, colors }) => (
  <div className="space-y-8">
    <div className="animate-slide-in-left">
      <h1 className="text-5xl font-black text-gray-900 mb-2">Archives</h1>
      <p className="text-xl text-gray-600">Browse our complete publication history</p>
    </div>

    <div className="grid gap-6">
      {[
        { vol: 17, issue: 6, period: 'Nov-Dec', year: 2025, published: '07-11-2025', articles: 12 },
        { vol: 17, issue: 5, period: 'Sep-Oct', year: 2025, published: '05-09-2025', articles: 15 },
        { vol: 17, issue: 4, period: 'Jul-Aug', year: 2025, published: '03-07-2025', articles: 14 },
        { vol: 17, issue: 3, period: 'May-Jun', year: 2025, published: '01-05-2025', articles: 13 }
      ].map((issue, idx) => (
        <div key={idx} className={`group relative animate-fade-in-up delay-${idx * 100}`}>
          <div className="relative bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-[1.01] shadow-lg hover:shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className={`w-6 h-6 ${colors.text}`} />
                  <span className="text-sm text-gray-500 font-medium">Published {issue.published}</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  Volume {issue.vol}, Issue {issue.issue}
                </h2>
                <p className="text-lg text-gray-600">{issue.period} {issue.year}</p>
              </div>
              <div className={`px-6 py-3 bg-gradient-to-br ${colors.gradient} rounded-2xl shadow-lg`}>
                <div className="text-3xl font-black text-white">{issue.articles}</div>
                <div className="text-sm text-white/80">Articles</div>
              </div>
            </div>
            <button className={`group/btn flex items-center space-x-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg`}>
              <span>Explore All Articles</span>
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Instructions Page
const InstructionsPage = ({ journal, colors }) => (
  <div className="space-y-8">
    <div className="animate-slide-in-left">
      <h1 className="text-5xl font-black text-gray-900 mb-2">Instructions to Authors</h1>
      <p className="text-xl text-gray-600">Guidelines for manuscript submission</p>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submission Process</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: 'Prepare Your Manuscript', desc: 'Follow our formatting guidelines and prepare all necessary files' },
              { step: 2, title: 'Submit Online', desc: 'Use our online submission system to upload your manuscript' },
              { step: 3, title: 'Peer Review', desc: 'Your manuscript will undergo rigorous peer review' },
              { step: 4, title: 'Revisions', desc: 'Address reviewer comments and resubmit if needed' },
              { step: 5, title: 'Publication', desc: 'Upon acceptance, your article will be published online' }
            ].map((step, index) => (
              <div key={step.step} className={`flex items-start space-x-4 animate-slide-in-left delay-${index * 100}`}>
                <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white shadow-lg`}>
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg animate-fade-in-up delay-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Manuscript Requirements</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {journal.instructions || 'All submissions must be original research that has not been published elsewhere. Manuscripts should follow our formatting guidelines and include all necessary sections.'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-6 shadow-2xl animate-scale-in`}>
          <Send className="w-10 h-10 text-white mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Submit?</h3>
          <p className="text-white/90 text-sm mb-4">Start your submission process now</p>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl font-bold transition-all backdrop-blur-md border border-white/30 hover:scale-105">
            Submit Manuscript
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg animate-fade-in-up delay-300">
          <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
          <div className="space-y-2">
            {['Author Guidelines', 'Formatting Template', 'Ethical Standards', 'Copyright Form'].map((link, index) => (
              <button key={index} className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all flex items-center justify-between group">
                <span>{link}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Contact Page
// Contact Page - Replace the existing ContactPage component with this
const ContactPage = ({ journal, colors }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please login to send a message');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      const response = await api.post('/api/author/contact', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setFormData({ subject: '', message: '' });
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="animate-slide-in-left">
        <h1 className="text-5xl font-black text-gray-900 mb-2">Contact Us</h1>
        <p className="text-xl text-gray-600">Get in touch with our editorial team</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editorial Office</h2>
            <div className="space-y-4">
              {journal.contact?.email && (
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <a href={`mailto:${journal.contact.email}`} className={`${colors.text} font-medium hover:underline`}>
                      {journal.contact.email}
                    </a>
                  </div>
                </div>
              )}
              {journal.contact?.phone && (
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Phone</div>
                    <span className="text-gray-900 font-medium">{journal.contact.phone}</span>
                  </div>
                </div>
              )}
              {journal.contact?.address && (
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <span className="text-gray-900 font-medium">{journal.contact.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-8 shadow-2xl`}>
            <Sparkles className="w-10 h-10 text-white mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-white mb-3">Have Questions?</h3>
            <p className="text-white/90 mb-4">Our editorial team is here to help with any inquiries about submissions, peer review, or publication.</p>
            <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-xl border border-white/30">
              <p className="text-white text-sm">💡 You need to be logged in to send us a message</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg animate-slide-in-right">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
              <input 
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
                rows="7"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none transition-colors resize-none disabled:opacity-50"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${colors.gradient} text-white px-6 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Editorial Board Page
const EditorialBoardPage = ({ journal, colors }) => (
  <div className="space-y-8">
    <div className="animate-slide-in-left">
      <h1 className="text-5xl font-black text-gray-900 mb-2">Editorial Board</h1>
      <p className="text-xl text-gray-600">Meet our distinguished editorial team</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(journal.editorialBoard || [
        { name: 'Dr. John Smith', position: 'Editor-in-Chief', affiliation: 'Harvard University', bio: 'Leading researcher in the field' },
        { name: 'Prof. Sarah Johnson', position: 'Associate Editor', affiliation: 'MIT', bio: 'Expert in advanced methodologies' },
        { name: 'Dr. Michael Chen', position: 'Managing Editor', affiliation: 'Stanford University', bio: 'Specialist in peer review' },
        { name: 'Dr. Emily Davis', position: 'Section Editor', affiliation: 'Oxford University', bio: 'Focus on emerging research' },
        { name: 'Prof. Robert Wilson', position: 'Editorial Board Member', affiliation: 'Cambridge University', bio: 'International research leader' },
        { name: 'Dr. Lisa Anderson', position: 'Editorial Board Member', affiliation: 'Yale University', bio: 'Innovation in research methods' }
      ]).map((member, idx) => (
        <div key={idx} className={`group relative animate-scale-in delay-${idx * 100}`}>
          <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all hover:scale-105 shadow-lg hover:shadow-xl">
            <div className={`w-20 h-20 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform`}>
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-1">{member.name}</h3>
            <p className={`${colors.text} font-bold text-center mb-2 text-sm`}>{member.position}</p>
            <p className="text-gray-600 text-center text-sm mb-3">{member.affiliation}</p>
            {member.bio && <p className="text-gray-500 text-xs text-center">{member.bio}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default JournalDetail;