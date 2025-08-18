import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const TripoLoadingAnimation = () => {
    // for navigation on another page
    const navigate = useNavigate();
    // ---------------
  const [animationComplete, setAnimationComplete] = useState(false);
  useEffect(() => {
    // Set animation complete after 9 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    // Replace this URL with your actual website URL
    navigate('/First')
    ;}

  if (animationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
              <circle cx="60" cy="60" r="50" fill="#10B981" opacity="0.2"/>
              <path d="M30 60 L50 40 L70 60 L90 40" stroke="#10B981" strokeWidth="4" fill="none"/>
              <circle cx="60" cy="70" r="8" fill="#F59E0B"/>
              <text x="60" y="95" textAnchor="middle" fontSize="14" fill="#065F46" fontWeight="bold">TRIPO</text>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800 mb-4">Welcome to Tripo!</h2>
          <p className="text-emerald-600 mb-6">Your journey begins here</p>
          <button
            onClick={handleRedirect}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Enter Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Money Symbols */}
        <div className="absolute top-20 left-20 animate-float-slow">
          <div className="text-yellow-400 text-4xl opacity-60">💰</div>
        </div>
        <div className="absolute top-40 right-32 animate-float-delayed">
          <div className="text-green-400 text-3xl opacity-70">💵</div>
        </div>
        <div className="absolute bottom-32 left-32 animate-float-fast">
          <div className="text-yellow-300 text-3xl opacity-50">🪙</div>
        </div>
        
        {/* Nature Elements */}
        <div className="absolute top-32 right-20 animate-sway">
          <div className="text-green-400 text-5xl opacity-40">🌿</div>
        </div>
        <div className="absolute bottom-20 right-40 animate-sway-delayed">
          <div className="text-emerald-400 text-4xl opacity-60">🌱</div>
        </div>
        <div className="absolute top-60 left-40 animate-pulse-slow">
          <div className="text-lime-400 text-4xl opacity-50">🍃</div>
        </div>
        
        {/* Growth Arrow Patterns */}
        <div className="absolute bottom-40 left-20 animate-bounce-slow">
          <div className="text-emerald-300 text-3xl opacity-70">📈</div>
        </div>
      </div>

      {/* Main Logo Container */}
      <div className="relative z-10 text-center">
        {/* Logo Symbol */}
        <div className="mb-8 animate-scale-pulse">
          <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
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
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 animate-text-glow">
            TRIPO
          </h1>
          <p className="text-emerald-200 text-xl mt-2 animate-fade-in-up">
            Your Gateway to Growth & Adventure
          </p>
        </div>

        {/* Loading Progress */}
        <div className="w-64 mx-auto">
          <div className="bg-emerald-800 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-400 to-yellow-400 h-full rounded-full animate-loading-bar origin-left"></div>
          </div>
          <p className="text-emerald-300 text-sm animate-pulse">
            Preparing your journey...
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(15deg); }
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
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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
          25% { opacity: 0.6; transform: scale(1.3); }
          75% { opacity: 0.6; transform: scale(1.3); }
        }
        
        @keyframes pulse-3 {
          0%, 100% { opacity: 1; transform: scale(1); }
          33% { opacity: 0.6; transform: scale(1.3); }
          66% { opacity: 0.6; transform: scale(1.3); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.7); }
          50% { box-shadow: 0 0 30px rgba(251, 191, 36, 1); }
        }
        
        @keyframes text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
          50% { text-shadow: 0 0 30px rgba(16, 185, 129, 0.8); }
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
        .animate-loading-bar { animation: loading-bar 8s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default TripoLoadingAnimation;