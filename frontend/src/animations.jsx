import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
const TripoLoadingAnimation = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    // Replace with your navigation logic
   navigate('/First');
  };

  if (animationComplete) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="mb-4 sm:mb-6 md:mb-8 animate-bounce">
            <svg 
              viewBox="0 0 120 120" 
              className="mx-auto w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
            >
              <circle cx="60" cy="60" r="50" fill="#10B981" opacity="0.2"/>
              <path d="M30 60 L50 40 L70 60 L90 40" stroke="#10B981" strokeWidth="4" fill="none"/>
              <circle cx="60" cy="70" r="8" fill="#F59E0B"/>
              <text x="60" y="95" textAnchor="middle" fontSize="14" fill="#065F46" fontWeight="bold">TRIPO</text>
            </svg>
          </div>
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 mb-2 sm:mb-3 md:mb-4 px-2">
            Welcome to Tripo!
          </h2>
          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-emerald-600 mb-4 sm:mb-5 md:mb-6 px-4">
            Your journey begins here
          </p>
          <button
            onClick={handleRedirect}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-5 xs:px-6 sm:px-8 md:px-10 py-2 xs:py-2.5 sm:py-3 md:py-3.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs xs:text-sm sm:text-base md:text-lg shadow-lg"
          >
            Enter Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center overflow-hidden relative p-4 sm:p-6 md:p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Money Symbols */}
        <div className="absolute top-[8%] left-[3%] xs:top-[10%] xs:left-[5%] sm:top-16 sm:left-16 md:top-20 md:left-20 lg:top-24 lg:left-24 animate-float-slow">
          <div className="text-yellow-400 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-60">💰</div>
        </div>
        <div className="absolute top-[18%] right-[8%] xs:top-[20%] xs:right-[10%] sm:top-32 sm:right-28 md:top-40 md:right-32 lg:top-44 lg:right-36 animate-float-delayed">
          <div className="text-green-400 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl opacity-70">💵</div>
        </div>
        <div className="absolute bottom-[12%] left-[5%] xs:bottom-[15%] xs:left-[8%] sm:bottom-28 sm:left-28 md:bottom-32 md:left-32 lg:bottom-36 lg:left-36 animate-float-fast">
          <div className="text-yellow-300 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl opacity-50">🪙</div>
        </div>
        
        {/* Nature Elements */}
        <div className="absolute top-[15%] right-[5%] xs:top-[18%] xs:right-[8%] sm:top-28 sm:right-16 md:top-32 md:right-20 lg:top-36 lg:right-24 animate-sway">
          <div className="text-green-400 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl opacity-40">🌿</div>
        </div>
        <div className="absolute bottom-[8%] right-[12%] xs:bottom-[10%] xs:right-[15%] sm:bottom-16 sm:right-32 md:bottom-20 md:right-40 lg:bottom-24 lg:right-44 animate-sway-delayed">
          <div className="text-emerald-400 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-60">🌱</div>
        </div>
        <div className="absolute top-[32%] left-[8%] xs:top-[35%] xs:left-[12%] sm:top-52 sm:left-32 md:top-60 md:left-40 lg:top-64 lg:left-44 animate-pulse-slow">
          <div className="text-lime-400 text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl opacity-50">🍃</div>
        </div>
        
        {/* Growth Arrow Patterns */}
        <div className="absolute bottom-[18%] left-[8%] xs:bottom-[20%] xs:left-[10%] sm:bottom-32 sm:left-16 md:bottom-40 md:left-20 lg:bottom-44 lg:left-24 animate-bounce-slow">
          <div className="text-emerald-300 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl opacity-70">📈</div>
        </div>
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 text-center w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {/* Logo Symbol */}
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 animate-scale-pulse">
          <svg 
            viewBox="0 0 180 180" 
            className="mx-auto w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 xl:w-48 xl:h-48"
          >
            {/* Outer growth ring */}
            <circle cx="90" cy="90" r="80" fill="none" stroke="url(#gradient1)" strokeWidth="3" opacity="0.6" className="animate-spin-slow"/>
            
            {/* Inner circle background */}
            <circle cx="90" cy="90" r="60" fill="url(#gradient2)" opacity="0.9"/>
            
            {/* Mountain/Growth Path */}
            <path d="M40 90 L60 60 L80 80 L100 50 L120 70 L140 90" 
                  stroke="#FBBF24" strokeWidth="4" fill="none" className="animate-draw-path"/>
            
            {/* Travel dots */}
            <circle cx="60" cy="60" r="4" fill="#10B981" className="animate-pulse-1"/>
            <circle cx="100" cy="50" r="4" fill="#F59E0B" className="animate-pulse-2"/>
            <circle cx="120" cy="70" r="4" fill="#10B981" className="animate-pulse-3"/>
            
            {/* Center compass/destination */}
            <circle cx="90" cy="90" r="12" fill="#F59E0B" className="animate-glow"/>
            <circle cx="90" cy="90" r="6" fill="#FBBF24"/>
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8"/>
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#065F46" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#047857" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Website Name */}
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 px-2">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 animate-text-glow leading-tight mb-1 sm:mb-2">
            TRIPO
          </h1>
          <p className="text-emerald-200 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mt-1 sm:mt-2 animate-fade-in-up px-2 sm:px-4">
            Your Gateway to Growth & Adventure
          </p>
        </div>

        {/* Loading Progress */}
        <div className="w-40 xs:w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 mx-auto px-2">
          <div className="bg-emerald-800 rounded-full h-1 xs:h-1.5 sm:h-2 md:h-2.5 mb-2 sm:mb-3 md:mb-4 overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-emerald-400 to-yellow-400 h-full rounded-full animate-loading-bar origin-left"></div>
          </div>
          <p className="text-emerald-300 text-[10px] xs:text-xs sm:text-sm md:text-base animate-pulse">
            Preparing your journey...
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -20px, 0) rotate(10deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -15px, 0) rotate(-5deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -25px, 0) rotate(15deg); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes sway-delayed {
          0%, 100% { transform: rotate(3deg); }
          50% { transform: rotate(-3deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
        }
        
        @keyframes scale-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes draw-path {
          0% { stroke-dasharray: 0 200; }
          100% { stroke-dasharray: 200 0; }
        }
        
        @keyframes pulse-1 {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        
        @keyframes pulse-2 {
          0%, 100% { opacity: 1; transform: scale(1); }
          25%, 75% { opacity: 0.6; transform: scale(1.3); }
        }
        
        @keyframes pulse-3 {
          0%, 100% { opacity: 1; transform: scale(1); }
          33%, 66% { opacity: 0.6; transform: scale(1.3); }
        }
        
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.7)); }
          50% { filter: drop-shadow(0 0 12px rgba(251, 191, 36, 1)); }
        }
        
        @keyframes text-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5)); }
          50% { filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.8)); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes loading-bar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 3s ease-in-out infinite 1s; }
        .animate-float-fast { animation: float-fast 2.5s ease-in-out infinite; }
        .animate-sway { animation: sway 3s ease-in-out infinite; }
        .animate-sway-delayed { animation: sway-delayed 2.5s ease-in-out infinite 0.5s; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-scale-pulse { animation: scale-pulse 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-draw-path { animation: draw-path 3s ease-in-out infinite; }
        .animate-pulse-1 { animation: pulse-1 2s ease-in-out infinite; }
        .animate-pulse-2 { animation: pulse-2 2s ease-in-out infinite 0.5s; }
        .animate-pulse-3 { animation: pulse-3 2s ease-in-out infinite 1s; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-text-glow { animation: text-glow 3s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 2s ease-out 1s both; }
        .animate-loading-bar { animation: loading-bar 4s ease-in-out forwards; }

        /* Extra Small Devices (320px - 479px) */
        @media (max-width: 479px) {
          @keyframes float-slow {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -12px, 0) rotate(6deg); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -10px, 0) rotate(-3deg); }
          }
          
          @keyframes float-fast {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -15px, 0) rotate(10deg); }
          }
        }

        /* Small Devices (480px - 767px) */
        @media (min-width: 480px) and (max-width: 767px) {
          @keyframes float-slow {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -15px, 0) rotate(8deg); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -12px, 0) rotate(-4deg); }
          }
          
          @keyframes float-fast {
            0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
            50% { transform: translate3d(0, -18px, 0) rotate(12deg); }
          }
        }

        /* Performance optimizations */
        .animate-float-slow,
        .animate-float-delayed,
        .animate-float-fast,
        .animate-sway,
        .animate-sway-delayed,
        .animate-pulse-slow,
        .animate-bounce-slow,
        .animate-scale-pulse,
        .animate-spin-slow,
        .animate-pulse-1,
        .animate-pulse-2,
        .animate-pulse-3 {
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          perspective: 1000px;
          -webkit-perspective: 1000px;
        }

        .animate-text-glow,
        .animate-glow {
          will-change: filter;
        }

        /* Landscape mode adjustments */
        @media (max-height: 600px) and (orientation: landscape) {
          .animate-float-slow,
          .animate-float-delayed,
          .animate-float-fast,
          .animate-bounce-slow {
            animation-duration: 3s;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .animate-text-glow,
          .animate-glow {
            filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.6));
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .bg-gradient-to-br {
            filter: brightness(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default TripoLoadingAnimation;