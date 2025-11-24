import React, { useState, useEffect } from 'react';
import { ChevronRight, User, UserCheck, UserX, Sparkles, Code, Globe, Shield, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_AP1_URL;

export default function LoginCheckForm() {
  const [currentStep, setCurrentStep] = useState('form');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [environment] = useState('development'); // Can be 'development' or 'production'
  const [ripples, setRipples] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Enhanced realistic green color theme
  const colors = {
    primary: 'bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-900',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    input: 'border-emerald-400/40 focus:border-emerald-300 focus:shadow-emerald-300/20',
    icon: 'text-emerald-300',
    error: 'text-rose-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    card: 'bg-gradient-to-br from-gray-900/80 via-slate-900/80 to-gray-900/80',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-200',
    backdrop: 'bg-emerald-950/40',
    buttonSecondary: 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500'
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsAnimating(true);
    
    // Create ripple effect
    createRipple(option);
    
    if (option === 'yes') {
      navigate('/Auth');
    } else {
      navigate('/Signup');
    }
    setIsAnimating(false);
  };

  const createRipple = (type) => {
    const newRipple = {
      id: Date.now(),
      type,
      x: Math.random() * 100,
      y: Math.random() * 100
    };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  };

  const resetForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep('form');
      setSelectedOption(null);
      setIsAnimating(false);
    }, 500);
  };

  const FormStep = () => (
    <div className={`transform transition-all duration-1000 ease-out ${isAnimating ? 'scale-90 opacity-0 rotate-3' : 'scale-100 opacity-100 rotate-0'}`}>
      <div className="text-center mb-6 md:mb-10">
        {/* Animated Icon Container */}
        <div className="relative mb-6 md:mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl md:rounded-2xl ${colors.card} backdrop-blur-md border border-emerald-400/20 shadow-2xl ${colors.glow} transition-all duration-500 hover:scale-110 group`}>
            <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Shield className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${colors.icon} transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`} />
          </div>
          
          {/* Floating Security Icons */}
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2">
            <Lock className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${colors.icon} animate-bounce`} style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2">
            <Unlock className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${colors.icon} animate-bounce`} style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-black ${colors.textPrimary} mb-3 md:mb-4 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent animate-pulse`}>
          Security Check
        </h1>
        <p className={`${colors.textSecondary} text-base md:text-lg lg:text-xl font-medium leading-relaxed px-2 md:px-0`}>
          Please verify your authentication status
        </p>
        
        {/* Environment Badge */}
        <div className="flex items-center justify-center mt-4 md:mt-6 space-x-2 md:space-x-3">
          <div className={`flex items-center space-x-1 md:space-x-2 px-3 py-1 md:px-4 md:py-2 rounded-full ${colors.card} backdrop-blur-sm border border-emerald-400/20 ${colors.glow}`}>
            <Code className={`w-3 h-3 md:w-4 md:h-4 ${colors.icon} animate-spin`} style={{ animationDuration: '3s' }} />
            <span className={`text-xs md:text-sm ${colors.icon} font-bold uppercase tracking-widest`}>
              {environment}
            </span>
            <Sparkles className={`w-3 h-3 md:w-4 md:h-4 ${colors.icon} animate-pulse`} />
          </div>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Authenticated Button */}
        <button
          onClick={() => handleOptionSelect('yes')}
          className={`w-full p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl ${colors.button} ${colors.glow} text-white font-bold text-lg md:text-xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 group relative overflow-hidden border border-emerald-400/20`}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Button Content */}
          <div className="flex items-center justify-center space-x-3 md:space-x-4 relative z-10">
            <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20">
              <UserCheck className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            </div>
            <span className="flex-1 text-left text-sm md:text-base lg:text-lg">Yes, I'm authenticated</span>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transform group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Success Indicator */}
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-ping"></div>
        </button>

        {/* Unauthenticated Button */}
        <button
          onClick={() => handleOptionSelect('no')}
          className={`w-full p-4 md:p-5 lg:p-6 rounded-xl md:rounded-2xl ${colors.buttonSecondary} hover:shadow-slate-500/20 text-white font-bold text-lg md:text-xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 md:hover:-translate-y-2 group relative overflow-hidden border border-slate-400/20`}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Button Content */}
          <div className="flex items-center justify-center space-x-3 md:space-x-4 relative z-10">
            <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10">
              <UserX className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
            </div>
            <span className="flex-1 text-left text-sm md:text-base lg:text-lg">No, I need to login</span>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-400 rounded-full animate-pulse"></div>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transform group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Warning Indicator */}
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2 h-2 md:w-3 md:h-3 bg-orange-400 rounded-full animate-ping"></div>
        </button>
      </div>

      {/* Security Status Bar */}
      <div className="mt-6 md:mt-8 flex items-center justify-center space-x-2 md:space-x-4">
        <div className="flex space-x-0.5 md:space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r ${colors.button} animate-pulse`}
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
        <span className={`text-xs md:text-sm ${colors.textSecondary} font-medium`}>Secure Connection</span>
        <div className="flex space-x-0.5 md:space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r ${colors.button} animate-pulse`}
              style={{ animationDelay: `${(i + 3) * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${colors.primary} relative overflow-hidden animate-gradient-x`}>
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Orbs - Responsive sizing */}
        <div className={`absolute -top-20 -right-20 md:-top-40 md:-right-40 w-48 h-48 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-radial from-emerald-400/10 via-teal-500/5 to-transparent animate-pulse`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute -bottom-20 -left-20 md:-bottom-40 md:-left-40 w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-radial from-teal-400/10 via-emerald-500/5 to-transparent animate-pulse`} style={{ animationDuration: '6s' }}></div>
        
        {/* Rotating Elements - Hidden on very small screens */}
        <div className="hidden sm:block absolute top-1/4 right-1/4 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-emerald-400/5 to-teal-400/5 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="hidden sm:block absolute bottom-1/4 left-1/4 w-12 h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r from-teal-400/5 to-emerald-400/5 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full animate-ping ${ripple.type === 'yes' ? 'bg-emerald-400/30' : 'bg-slate-400/30'}`}
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            animationDuration: '2s'
          }}
        ></div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
          <div className={`${colors.backdrop} backdrop-blur-2xl rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 border border-emerald-400/20 shadow-2xl ${colors.glow} transition-all duration-500 hover:shadow-emerald-500/30`}>
            {currentStep === 'form' && <FormStep />}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Particles - Reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(isMobile ? 15 : 25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 md:w-3 md:h-3 bg-emerald-400/20' : 
              i % 3 === 1 ? 'w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-400/30' : 
              'w-1 h-1 md:w-1 md:h-1 bg-green-400/40'
            } animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* CSS for custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(-5px) rotate(240deg); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-float {
          animation: float linear infinite;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-float {
            animation-duration: 6s !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) {
          .hover\\:scale-105:hover {
            transform: scale(1.02);
          }
          .hover\\:-translate-y-2:hover {
            transform: translateY(-1px);
          }
        }
      `}</style>
    </div>
  );
}