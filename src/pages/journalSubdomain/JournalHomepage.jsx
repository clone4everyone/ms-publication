import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const JournalHomepage = () => {
const navigate=useNavigate();
useEffect(()=>{
navigate('/J-PHARMA-001')
},[])

  return (
    <div>
      
    </div>
  );
}

export default JournalHomepage;



// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BookOpen, ChevronRight, Award, Users, TrendingUp, FileText } from 'lucide-react';
// import api from '../../utils/api';

// function JournalHomepage() {
//   const navigate = useNavigate();
//   const [journals, setJournals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hoveredCard, setHoveredCard] = useState(null);

//   // Updated color scheme to match MS Publications branding
//   const journalColors = {
//     IJPS: { gradient: 'from-[#1B7A9C] to-[#156680]', accent: 'bg-[#1B7A9C]', light: 'bg-teal-50' },
//     JHS: { gradient: 'from-[#FDB913] to-[#F5A800]', accent: 'bg-[#FDB913]', light: 'bg-yellow-50' },
//     IJCR: { gradient: 'from-[#1B7A9C] to-teal-600', accent: 'bg-teal-500', light: 'bg-teal-50' },
//     IJSR: { gradient: 'from-[#1B7A9C] to-cyan-600', accent: 'bg-cyan-500', light: 'bg-cyan-50' },
//     JAT: { gradient: 'from-[#FDB913] to-amber-500', accent: 'bg-amber-500', light: 'bg-amber-50' },
//     IJPPi:{ gradient: 'from-[#1B7A9C] to-[#156680]', accent: 'bg-[#1B7A9C]', light: 'bg-teal-50' }
//   };

//   useEffect(() => {
//     fetchJournals();
//   }, []);

//   const fetchJournals = async () => {
//     try {
//       const response = await api.get('/api/journals');
//       if (response.data.success) {
//         setJournals(response.data.data.journals);
//       }
//     } catch (error) {
//       console.error('Error fetching journals:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const stats = [
//     { icon: FileText, label: 'Active Journals', value: '6', color: 'text-[#1B7A9C]' },
//     { icon: Award, label: 'Peer Reviewed', value: '100%', color: 'text-[#FDB913]' },
//     { icon: Users, label: 'Global Reach', value: '150+', suffix: 'Countries', color: 'text-teal-600' },
//     { icon: TrendingUp, label: 'Annual Growth', value: '45%', color: 'text-[#1B7A9C]' }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Animated Background Elements - Updated to brand colors */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1B7A9C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
//         <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FDB913] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
//       </div>

//       {/* Hero Section */}
//       <div className="relative pt-20 pb-32 overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center space-y-8">
//             <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-50 to-yellow-50 border border-[#1B7A9C]/20 rounded-full px-6 py-2 animate-fade-in">
//               <div className="w-2 h-2 bg-[#1B7A9C] rounded-full animate-pulse"></div>
//               <span className="text-sm font-medium text-gray-700">Open Access • Peer Reviewed • International</span>
//             </div>

//             <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-slide-up">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1B7A9C] via-teal-700 to-[#FDB913]">
//                 MS Publications
//               </span>
//             </h1>

//             <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
//               Advancing scientific knowledge through rigorous peer review and open access publishing across multiple disciplines
//             </p>

//             <div className="flex flex-wrap justify-center gap-4 pt-4 animate-slide-up animation-delay-400">
//               <button className="group bg-gradient-to-r from-[#1B7A9C] to-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center space-x-2">
//                 <span>Browse All Journals</span>
//                 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="bg-[#FDB913] text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-[#F5A800] hover:shadow-xl transition-all duration-300">
//                 Submit Your Research
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Decorative Elements - Updated colors */}
//         <div className="absolute top-1/4 left-10 w-20 h-20 border-4 border-[#1B7A9C]/30 rounded-lg rotate-12 animate-float"></div>
//         <div className="absolute top-1/3 right-10 w-16 h-16 border-4 border-[#FDB913]/30 rounded-full animate-float animation-delay-2000"></div>
//         <div className="absolute bottom-10 left-1/4 w-24 h-24 border-4 border-teal-300/30 rounded-lg -rotate-12 animate-float animation-delay-4000"></div>
//       </div>

//       {/* Stats Section */}
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-20">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat, index) => (
//             <div
//               key={index}
//               className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 animate-slide-up hover:border-[#1B7A9C]/30"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
//               <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
//               <div className="text-sm text-gray-600">{stat.label}</div>
//               {stat.suffix && <div className="text-xs text-gray-500 mt-1">{stat.suffix}</div>}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Journals Section */}
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
//         <div className="text-center mb-16 space-y-4">
//           <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#1B7A9C] to-teal-700">
//             Featured Journals
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Discover groundbreaking research across diverse scientific disciplines
//           </p>
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20 space-y-4">
//             <div className="relative">
//               <div className="w-16 h-16 border-4 border-teal-200 rounded-full"></div>
//               <div className="w-16 h-16 border-4 border-[#1B7A9C] rounded-full animate-spin border-t-transparent absolute top-0"></div>
//             </div>
//             <p className="text-gray-500 font-medium">Loading journals...</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {journals.map((journal, index) => {
//               const colors = journalColors[journal.acronym];
//               return (
//                 <div
//                   key={journal.id}
//                   className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer animate-slide-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                   onClick={() => navigate(`/journals/${journal.id}`)}
//                   onMouseEnter={() => setHoveredCard(journal.id)}
//                   onMouseLeave={() => setHoveredCard(null)}
//                 >
//                   {/* Card Border Glow - Updated to brand colors */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-[#1B7A9C] via-teal-400 to-[#FDB913] rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500"></div>
                  
//                   <div className="relative bg-white rounded-3xl border-2 border-gray-100 group-hover:border-transparent transition-all duration-300">
//                     {/* Header with Gradient */}
//                     <div className={`relative h-48 bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
//                       {/* Animated Background Pattern */}
//                       <div className="absolute inset-0 opacity-10">
//                         <div className="absolute inset-0" style={{
//                           backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
//                           backgroundSize: '40px 40px'
//                         }}></div>
//                       </div>
                      
//                       {/* Floating Shapes */}
//                       <div className={`absolute top-4 right-4 w-16 h-16 ${colors.accent} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>
//                       <div className={`absolute bottom-4 left-4 w-20 h-20 ${colors.accent} rounded-lg opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-700`}></div>
                      
//                       {/* Content */}
//                       <div className="relative h-full flex flex-col justify-between p-6">
//                         <div className="flex justify-between items-start">
//                           <div className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 border border-white/30">
//                             <span className="text-white font-bold text-lg">{journal.acronym}</span>
//                           </div>
//                           <BookOpen className="w-8 h-8 text-white opacity-80" />
//                         </div>
                        
//                         <div className="space-y-2">
//                           <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-1 inline-block border border-white/20">
//                             <span className="text-white text-sm font-medium">ISSN: {journal.issn}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="p-6 space-y-4">
//                       <h3 className="text-2xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#1B7A9C] group-hover:to-teal-600 transition-all duration-300">
//                         {journal.name}
//                       </h3>
                      
//                       <p className="text-gray-600 leading-relaxed line-clamp-2">
//                         {journal.description}
//                       </p>

//                       {/* Impact Factor Badge */}
//                       <div className="flex items-center justify-between pt-2">
//                         <div className="flex items-center space-x-2">
//                           <Award className="w-5 h-5 text-[#FDB913]" />
//                           <div>
//                             <div className="text-xs text-gray-500 font-medium">Impact Factor</div>
//                             <div className="text-lg font-bold text-gray-900">{journal.impactFactor}</div>
//                           </div>
//                         </div>
                        
//                         <div className={`${colors.light} rounded-full p-3 group-hover:scale-110 transition-transform duration-300`}>
//                           <ChevronRight className={`w-6 h-6 ${colors.accent.replace('bg-', 'text-')} group-hover:translate-x-1 transition-transform duration-300`} />
//                         </div>
//                       </div>

//                       {/* Hover Overlay Button */}
//                       <div className={`absolute inset-x-6 bottom-6 transform transition-all duration-300 ${hoveredCard === journal.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
//                         <button className={`w-full bg-gradient-to-r ${colors.gradient} text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2`}>
//                           <span>Explore Journal</span>
//                           <ChevronRight className="w-5 h-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//         }
        
//         @keyframes float {
//           0%, 100% { transform: translateY(0) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
        
//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
        
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
        
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
        
//         .animate-slide-up {
//           animation: slide-up 0.8s ease-out forwards;
//         }
        
//         .animate-fade-in {
//           animation: fade-in 0.8s ease-out forwards;
//         }
        
//         .animation-delay-200 {
//           animation-delay: 200ms;
//         }
        
//         .animation-delay-400 {
//           animation-delay: 400ms;
//         }
        
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
        
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default JournalHomepage;