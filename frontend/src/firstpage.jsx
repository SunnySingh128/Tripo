import React, { useState, useEffect } from 'react';
import { MapPin, Users, Calculator, PlaneTakeoff, Menu, X,Mic } from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const TravelFeaturesPage = ({ animationEnded = true }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Enhanced features data with nature-inspired colors
  const features = [
    {
      id: 1,
      title: "Split your trip bills seamlessly",
      description: "Never worry about who owes what. Our smart bill splitting makes group payments effortless.",
      icon: <Calculator className="w-12 h-12 text-sky-700" />,
      bgGradient: "from-sky-100 via-cyan-50 to-blue-100",
      overlayGradient: "from-blue-400/20 via-cyan-400/15 to-sky-400/20",
      textColor: "text-slate-800",
      accentColor: "bg-sky-600",
      shadowColor: "shadow-sky-500/25"
    },
    {
      id: 2,
      title: "Track everyone's expenses with clarity",
      description: "Real-time expense tracking keeps everyone informed and accountable throughout your journey.",
      icon: <Users className="w-12 h-12 text-emerald-700" />,
      bgGradient: "from-emerald-100 via-teal-50 to-green-100",
      overlayGradient: "from-emerald-400/20 via-teal-400/15 to-green-400/20",
      textColor: "text-slate-800",
      accentColor: "bg-emerald-600",
      shadowColor: "shadow-emerald-500/25"
    },
    {
      id: 3,
      title: "Plan your trip with friends easily",
      description: "Collaborative planning tools make organizing group adventures simple and stress-free.",
      icon: <MapPin className="w-12 h-12 text-amber-700" />,
      bgGradient: "from-amber-100 via-orange-50 to-yellow-100",
      overlayGradient: "from-amber-400/20 via-orange-400/15 to-yellow-400/20",
      textColor: "text-slate-800",
      accentColor: "bg-amber-600",
      shadowColor: "shadow-amber-500/25"
    },
    {
  id: 4,
  title: "Control your trip with your voice",
  description: "Use simple voice commands to add expenses, plan routes, and get instant summaries without lifting a finger.",
  icon: <Mic className="w-12 h-12 text-emerald-700" />, // Using a mic icon
  bgGradient: "from-emerald-100 via-green-50 to-lime-100",
  overlayGradient: "from-emerald-400/20 via-green-400/10 to-lime-400/20",
  textColor: "text-slate-800",
  accentColor: "bg-emerald-600",
  shadowColor: "shadow-emerald-500/25",

  voiceCommand: "Hey Tripo, add an expense for lunch — 500 rupees by Riya",
  voiceDescription: "Start managing your trip by just speaking. Add activities, get summaries, or invite friends using natural commands."
}

  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Page entrance animation
  useEffect(() => {
    if (animationEnded) {
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [animationEnded]);
                    
  const navigate = useNavigate();
  
  const handlePlanTrip = () => {
    navigate("/Login");
  };

  const handleNavClick = (section) => {
    console.log(`Navigating to ${section}`);
    setIsMenuOpen(false);
  };

  if (!animationEnded) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-sky-50 relative overflow-hidden transition-all duration-1200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`bg-white/80 backdrop-blur-xl shadow-lg border-b border-emerald-200/50 sticky top-0 z-50 transform transition-all duration-1000 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-4 relative">
            <div className="flex items-center space-x-3 group">
              <div className="relative transform group-hover:scale-110 transition-transform duration-500">
                <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-lg">
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor:"#10B981", stopOpacity:0.2}} />
                      <stop offset="100%" style={{stopColor:"#059669", stopOpacity:0.3}} />
                    </linearGradient>
                    <filter id="logoShadow">
                      <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                  </defs>
                  <circle cx="60" cy="60" r="50" fill="url(#logoGradient)" filter="url(#logoShadow)"/>
                  <path d="M30 60 L50 40 L70 60 L90 40" stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" className="animate-pulse"/>
                  <circle cx="60" cy="70" r="8" fill="#D97706" className="drop-shadow-lg animate-bounce" style={{animationDelay: '1s'}}/>
                  <text x="60" y="95" textAnchor="middle" fontSize="14" fill="#1E293B" fontWeight="bold">TRIPO</text>
                </svg>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent animate-pulse">
                Tripo
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h1 className={`text-6xl md:text-7xl font-black text-slate-800 mb-8 transform transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              Travel Together,{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 animate-gradient-x">
                  Smart & Sustainable
                </span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transform scale-x-0 animate-scale-in animation-delay-1000"></div>
              </span>
            </h1>
            <p className={`text-xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed transform transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} 
               style={{ transitionDelay: '300ms' }}>
              The ultimate travel companion for group adventures. Plan, track, and split expenses effortlessly while reducing your environmental impact.
            </p>
          </div>

          {/* Enhanced Feature Carousel */}
          <div className="relative max-w-5xl mx-auto mb-16">
            <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`relative h-[500px] bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center transition-all duration-1200 transform ${
                    index === currentImageIndex 
                      ? 'opacity-100 scale-100 translate-x-0' 
                      : index < currentImageIndex 
                        ? 'opacity-0 scale-95 -translate-x-full absolute inset-0' 
                        : 'opacity-0 scale-95 translate-x-full absolute inset-0'
                  }`}
                >
                  {/* Animated overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.overlayGradient} animate-pulse-slow`}></div>
                  
                  {/* Geometric patterns */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full animate-spin-slow"></div>
                    <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white/50 rotate-45 animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/20 rounded-lg transform -rotate-12 animate-float"></div>
                  </div>

                  <div className={`relative text-center ${feature.textColor} p-12 z-10`}>
                    <div className="mb-8 flex justify-center transform hover:scale-110 transition-transform duration-500">
                      <div className={`p-6 bg-white/40 rounded-2xl backdrop-blur-md border border-white/30 ${feature.shadowColor} shadow-2xl`}>
                        <div className="animate-bounce-gentle">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold mb-6 animate-fade-in-up">{feature.title}</h3>
                    <p className="text-xl opacity-90 max-w-lg mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Enhanced floating elements */}
                  <div className="absolute top-12 left-12 w-4 h-4 rounded-full bg-white/60 backdrop-blur-sm animate-float shadow-lg" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-20 right-16 w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm animate-float shadow-lg" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute bottom-16 left-20 w-3 h-3 rounded-full bg-white/70 backdrop-blur-sm animate-float shadow-lg" style={{ animationDelay: '1.5s' }}></div>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
                </div>
              ))}
            </div>

            {/* Enhanced Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {features.map((feature, index) => (
                <button
                  key={index}
                  className={`relative overflow-hidden rounded-full transition-all duration-500 cursor-pointer transform hover:scale-125 ${
                    index === currentImageIndex 
                      ? `w-12 h-4 ${feature.accentColor} shadow-lg` 
                      : 'w-4 h-4 bg-slate-300 hover:bg-slate-400 shadow-md'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Button */}
          <div className="text-center">
            <button
              onClick={handlePlanTrip}
              className={`group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-16 py-6 rounded-full text-2xl font-bold shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 cursor-pointer ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              style={{ transitionDelay: '800ms' }}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Button content */}
              <span className="relative flex items-center space-x-3 z-10">
                <span className="group-hover:animate-pulse">Plan Your Trip Now</span>
                <PlaneTakeoff className="w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-1 group-hover:rotate-12 transition-transform duration-500" />
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></div>
            </button>
          </div>
        </section>

        {/* Enhanced Eco Character */}
        <div className={`fixed bottom-8 right-8 z-40 transform transition-all duration-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{ transitionDelay: '1200ms' }}>
          <div className="relative cursor-pointer group">
            <div className="w-36 h-44 relative">
              {/* Character body with enhanced gradients */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-28 bg-gradient-to-b from-emerald-300 via-emerald-400 to-emerald-600 rounded-full flex flex-col items-center justify-end shadow-2xl hover:shadow-emerald-500/50 group-hover:scale-110 transition-all duration-500 border-4 border-emerald-400/50">
                
                {/* Enhanced face */}
                <div className="absolute top-2 w-18 h-18 bg-gradient-to-b from-amber-100 via-amber-150 to-amber-200 rounded-full flex items-center justify-center border-4 border-white shadow-xl group-hover:animate-bounce">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-emerald-800 rounded-full animate-pulse"></div>
                    <div className="w-2.5 h-2.5 bg-emerald-800 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="absolute bottom-2 w-5 h-2 border-b-2 border-emerald-800 rounded-full group-hover:w-6 transition-all duration-300"></div>
                </div>
                
                {/* Enhanced eco backpack */}
                <div className="absolute -top-1 -right-3 w-10 h-12 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 rounded-lg shadow-xl border-2 border-amber-600/50 group-hover:animate-wiggle">
                  <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
                  <div className="absolute top-3 right-1 w-1.5 h-1.5 bg-sky-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-lime-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                </div>
                
                {/* Enhanced solar panel */}
                <div className="absolute top-4 -left-3 w-8 h-5 bg-gradient-to-r from-sky-600 via-blue-600 to-blue-700 rounded transform -rotate-12 shadow-xl flex items-center justify-center border-2 border-blue-500/50 group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-5 h-3 bg-gradient-to-r from-blue-200 to-cyan-300 rounded grid grid-cols-2 gap-px overflow-hidden">
                    <div className="bg-white/90 animate-pulse"></div>
                    <div className="bg-white/90 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                </div>

                {/* Energy indicator */}
                <div className="absolute top-8 -right-1 flex flex-col space-y-1 group-hover:animate-pulse">
                  <div className="w-1 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <div className="w-1 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-1 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                </div>
              </div>

              {/* Enhanced floating elements */}
              <div className="absolute top-2 left-2 text-lg animate-float" style={{ animationDelay: '0s' }}>🍃</div>
              <div className="absolute top-8 right-4 text-sm animate-float" style={{ animationDelay: '1s' }}>🌱</div>
              <div className="absolute bottom-12 left-0 text-sm animate-float" style={{ animationDelay: '2s' }}>🌿</div>
              <div className="absolute top-12 right-8 text-xs animate-float" style={{ animationDelay: '1.5s' }}>♻️</div>
              
              {/* Enhanced footprint trail */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-3">
                <div className="w-4 h-3 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full animate-ping shadow-lg"></div>
                <div className="w-4 h-3 bg-gradient-to-b from-emerald-300 to-emerald-500 rounded-full animate-ping shadow-md" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-4 h-3 bg-gradient-to-b from-emerald-200 to-emerald-400 rounded-full animate-ping shadow-sm" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>

            {/* Enhanced tooltip */}
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-700 to-teal-700 text-white px-4 py-2 rounded-2xl text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-2xl border border-emerald-500/30">
              <span className="animate-pulse">Eco-friendly travel buddy! 🌍</span>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-700"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Environmental Background Elements */}
        <div className="fixed top-1/4 left-8 text-xl animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '0s' }}>🌱</div>
        <div className="fixed top-1/3 right-16 text-lg animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '1s' }}>🍃</div>
        <div className="fixed bottom-1/4 left-16 text-base animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '2s' }}>🌿</div>
        <div className="fixed top-1/2 left-1/4 text-sm animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>🌍</div>
        <div className="fixed bottom-1/3 right-1/4 text-base animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '1.5s' }}>♻️</div>
        <div className="fixed top-3/4 left-1/3 text-sm animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '2.5s' }}>🌳</div>
        <div className="fixed top-1/5 right-1/3 text-lg animate-float cursor-pointer hover:scale-125 transition-transform duration-300" style={{ animationDelay: '3s' }}>💚</div>

        {/* Enhanced topographical background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topo-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 0 30 Q 15 15 30 30 T 60 30" stroke="#059669" fill="none" strokeWidth="1" opacity="0.3"/>
                  <path d="M 0 45 Q 15 30 30 45 T 60 45" stroke="#10B981" fill="none" strokeWidth="0.5" opacity="0.4"/>
                  <circle cx="30" cy="30" r="2" fill="#059669" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topo-pattern)"/>
            </svg>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(8deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes scale-in {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-scale-in {
          animation: scale-in 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
        
        /* Enhanced paper texture */
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 25% 25%, #10B981 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #059669 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23059669' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: -1;
          opacity: 0.3;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hide scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10B981, #059669);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #047857);
        }
      `}</style>
    </div>
  );
};

export default TravelFeaturesPage;