import React, { useState, useEffect } from 'react';
import { ChevronRight, User, UserCheck, UserX, Sparkles, Code, Globe, Shield, Lock, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const api=import.meta.env.VITE_AP1_URL;
export default function LoginCheckForm() {
  const [currentStep, setCurrentStep] = useState('form');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [environment] = useState('development'); // Can be 'development' or 'production'
  const [ripples, setRipples] = useState([]);
  const navigate = useNavigate();

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
      <div className="text-center mb-10">
        {/* Animated Icon Container */}
        <div className="relative mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl ${colors.card} backdrop-blur-md border border-emerald-400/20 shadow-2xl ${colors.glow} transition-all duration-500 hover:scale-110 group`}>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Shield className={`w-12 h-12 ${colors.icon} transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`} />
          </div>
          
          {/* Floating Security Icons */}
          <div className="absolute -top-2 -right-2">
            <Lock className={`w-6 h-6 ${colors.icon} animate-bounce`} style={{ animationDelay: '0.5s' }} />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Unlock className={`w-6 h-6 ${colors.icon} animate-bounce`} style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <h1 className={`text-5xl font-black ${colors.textPrimary} mb-4 bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent animate-pulse`}>
          Security Check
        </h1>
        <p className={`${colors.textSecondary} text-xl font-medium leading-relaxed`}>
          Please verify your authentication status
        </p>
        
        {/* Environment Badge */}
        <div className="flex items-center justify-center mt-6 space-x-3">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${colors.card} backdrop-blur-sm border border-emerald-400/20 ${colors.glow}`}>
            <Code className={`w-4 h-4 ${colors.icon} animate-spin`} style={{ animationDuration: '3s' }} />
            <span className={`text-sm ${colors.icon} font-bold uppercase tracking-widest`}>
              {environment}
            </span>
            <Sparkles className={`w-4 h-4 ${colors.icon} animate-pulse`} />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Authenticated Button */}
        <button
          onClick={() => handleOptionSelect('yes')}
          className={`w-full p-6 rounded-2xl ${colors.button} ${colors.glow} text-white font-bold text-xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden border border-emerald-400/20`}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Button Content */}
          <div className="flex items-center justify-center space-x-4 relative z-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <UserCheck className="w-5 h-5 animate-pulse" />
            </div>
            <span className="flex-1 text-left">Yes, I'm authenticated</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <ChevronRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Success Indicator */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
        </button>

        {/* Unauthenticated Button */}
        <button
          onClick={() => handleOptionSelect('no')}
          className={`w-full p-6 rounded-2xl ${colors.buttonSecondary} hover:shadow-slate-500/20 text-white font-bold text-xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 group relative overflow-hidden border border-slate-400/20`}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Button Content */}
          <div className="flex items-center justify-center space-x-4 relative z-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
              <UserX className="w-5 h-5 animate-pulse" />
            </div>
            <span className="flex-1 text-left">No, I need to login</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <ChevronRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
          
          {/* Warning Indicator */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
        </button>
      </div>

      {/* Security Status Bar */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.button} animate-pulse`}
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
        <span className={`text-sm ${colors.textSecondary} font-medium`}>Secure Connection</span>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.button} animate-pulse`}
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
        {/* Large Orbs */}
        <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-radial from-emerald-400/10 via-teal-500/5 to-transparent animate-pulse`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-radial from-teal-400/10 via-emerald-500/5 to-transparent animate-pulse`} style={{ animationDuration: '6s' }}></div>
        
        {/* Rotating Elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400/5 to-teal-400/5 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 rounded-full bg-gradient-to-r from-teal-400/5 to-emerald-400/5 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className={`absolute w-4 h-4 rounded-full animate-ping ${ripple.type === 'yes' ? 'bg-emerald-400/30' : 'bg-slate-400/30'}`}
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            animationDuration: '2s'
          }}
        ></div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-lg">
          <div className={`${colors.backdrop} backdrop-blur-2xl rounded-3xl p-10 border border-emerald-400/20 shadow-2xl ${colors.glow} transition-all duration-500 hover:shadow-emerald-500/30`}>
            {currentStep === 'form' && <FormStep />}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'w-3 h-3 bg-emerald-400/20' : i % 3 === 1 ? 'w-2 h-2 bg-teal-400/30' : 'w-1 h-1 bg-green-400/40'} animate-float`}
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
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
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
      `}</style>
    </div>
  );
}