// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Laptop2, Leaf } from 'lucide-react';
const api=import.meta.env.VITE_AP1_URL;
const getThemeStyles = (theme) => {
  switch (theme) {
    case 'development':
      return {
        bg: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
        cardBg: 'bg-gradient-to-br from-blue-800/50 to-indigo-900/40',
        color: 'text-white',
        accent: 'text-cyan-300',
        secondaryAccent: 'text-blue-200',
        primaryColor: 'text-blue-400',
        highlightColor: 'text-cyan-400',
        icon: <Laptop2 className="w-6 h-6 text-cyan-400 drop-shadow-lg" />,
        emoji: '💻',
        glow: 'shadow-2xl shadow-cyan-500/40',
        border: 'border border-cyan-400/50',
        particles: 'from-cyan-400/20 to-blue-400/20',
        hoverBg: 'hover:bg-cyan-500/25',
        detailsBg: 'bg-gradient-to-r from-blue-800/30 to-cyan-800/20',
        profileTypeBg: 'bg-gradient-to-r from-cyan-800/40 to-blue-800/30',
        cardBorder: 'border-cyan-400/30',
        glowAnimation: 'shadow-cyan-400/30',
      };
    case 'environment':
      return {
        bg: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900',
        cardBg: 'bg-gradient-to-br from-emerald-800/50 to-green-900/40',
        color: 'text-white',
        accent: 'text-lime-300',
        secondaryAccent: 'text-emerald-200',
        primaryColor: 'text-green-400',
        highlightColor: 'text-lime-400',
        icon: <Leaf className="w-6 h-6 text-lime-400 drop-shadow-lg" />,
        emoji: '🌿',
        glow: 'shadow-2xl shadow-lime-500/40',
        border: 'border border-lime-400/50',
        particles: 'from-lime-400/20 to-emerald-400/20',
        hoverBg: 'hover:bg-lime-500/25',
        detailsBg: 'bg-gradient-to-r from-emerald-800/30 to-lime-800/20',
        profileTypeBg: 'bg-gradient-to-r from-lime-800/40 to-emerald-800/30',
        cardBorder: 'border-lime-400/30',
        glowAnimation: 'shadow-lime-400/30',
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-800 via-gray-700 to-slate-800',
        cardBg: 'bg-gradient-to-br from-gray-700/30 to-slate-600/20',
        color: 'text-white',
        accent: 'text-gray-300',
        secondaryAccent: 'text-slate-300',
        primaryColor: 'text-gray-400',
        highlightColor: 'text-white',
        icon: <Laptop2 className="w-6 h-6 text-gray-400 drop-shadow-lg" />,
        emoji: '👤',
        glow: 'shadow-2xl shadow-gray-500/20',
        border: 'border border-gray-400/30',
        particles: 'from-gray-400/10 to-slate-400/10',
        hoverBg: 'hover:bg-gray-500/20',
        detailsBg: 'bg-gray-700/20',
        profileTypeBg: 'bg-gray-600/30',
        cardBorder: 'border-gray-400/30',
        glowAnimation: 'shadow-gray-400/20',
      };
  }
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('userDataEntries');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const latest = Array.isArray(parsed) ? parsed[parsed.length - 1] : parsed;
        setUser(latest);
      } catch (err) {
        console.error('Failed to parse localStorage:', err);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="text-white text-2xl font-light tracking-wider"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  const {
    name = 'Unknown',
    gender = 'N/A',
    email = 'Not provided',
    age = 'N/A',
    theme = 'default',
  } = user;

  const { bg, cardBg, color, accent, secondaryAccent, primaryColor, highlightColor, icon, emoji, glow, border, particles, hoverBg, detailsBg, profileTypeBg, cardBorder, glowAnimation } = getThemeStyles(theme);

  return (
    <div className={`${bg} min-h-screen flex items-center justify-center px-4 relative overflow-hidden`}>
      {/* Animated background particles with theme colors */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 bg-gradient-to-r ${particles} rounded-full opacity-30`}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Additional floating elements for development theme */}
        {theme === 'development' && [...Array(8)].map((_, i) => (
          <motion.div
            key={`dev-${i}`}
            className="absolute text-cyan-400/20 text-2xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {['⚡', '🚀', '⭐', '💎'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
        
        {/* Additional floating elements for environment theme */}
        {theme === 'environment' && [...Array(8)].map((_, i) => (
          <motion.div
            key={`env-${i}`}
            className="absolute text-lime-400/20 text-2xl"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, -360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {['🌱', '🌸', '🦋', '✨'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      {/* Main profile card with enhanced animations */}
      <motion.div
        initial={{ opacity: 0, y: 100, rotateX: -15, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ 
          duration: 1.5, 
          type: "spring", 
          stiffness: 80,
          damping: 20
        }}
        whileHover={{ 
          scale: 1.03, 
          rotateY: 3,
          boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`,
          transition: { duration: 0.4 }
        }}
        className={`max-w-md w-full p-8 rounded-3xl ${cardBg} ${glow} ${cardBorder} backdrop-blur-xl ${color} relative z-10 border-2`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%), ${cardBg}`,
        }}
      >
        {/* Animated border glow effect */}
        <motion.div 
          className={`absolute inset-0 rounded-3xl opacity-50`}
          animate={{
            boxShadow: [
              `0 0 20px ${glowAnimation}`,
              `0 0 40px ${glowAnimation}`,
              `0 0 20px ${glowAnimation}`
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          {/* Enhanced animated emoji with pulsing glow */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 15,
              delay: 0.3
            }}
            whileHover={{ 
              scale: 1.15, 
              rotate: 10,
              transition: { duration: 0.3 }
            }}
            className="relative"
          >
            <motion.div 
              className={`text-8xl drop-shadow-2xl`}
              animate={{ 
                scale: [1, 1.05, 1],
                filter: [
                  "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
                  "drop-shadow(0 0 30px rgba(255,255,255,0.6))",
                  "drop-shadow(0 0 20px rgba(255,255,255,0.3))"
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {emoji}
            </motion.div>
            
            {/* Theme-specific glow ring */}
            <motion.div
              className={`absolute inset-0 rounded-full ${theme === 'development' ? 'bg-cyan-400/10' : theme === 'environment' ? 'bg-lime-400/10' : 'bg-white/10'}`}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Enhanced name with rainbow typing effect */}
          <motion.h1 
            className={`text-4xl font-bold text-center tracking-wide ${highlightColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-current"
              style={{ 
                animation: "blink 1s infinite",
                background: theme === 'development' 
                  ? 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)' 
                  : theme === 'environment'
                  ? 'linear-gradient(45deg, #84cc16, #10b981, #06d6a0)'
                  : 'linear-gradient(45deg, #64748b, #94a3b8, #cbd5e1)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {name}
            </motion.span>
          </motion.h1>

          {/* Profile details with staggered animation */}
          <motion.div 
            className="text-lg text-center space-y-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { label: "Gender", value: gender },
              { label: "Email", value: email },
              { label: "Age", value: age }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05, 
                  x: 5,
                  transition: { duration: 0.2 }
                }}
                className={`p-3 rounded-xl ${detailsBg} backdrop-blur-sm border border-white/10 ${hoverBg} transition-all duration-300`}
              >
                <p className="flex justify-between items-center">
                  <strong className={`${accent} font-semibold`}>{item.label}:</strong> 
                  <span className="font-medium">{item.value}</span>
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced profile type indicator */}
          <motion.div 
            className={`mt-8 flex items-center gap-4 px-6 py-3 rounded-full ${profileTypeBg} backdrop-blur-sm border-2 ${cardBorder}`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
            whileHover={{ 
              scale: 1.08,
              y: -2,
              boxShadow: `0 10px 25px -5px ${glowAnimation}`,
              transition: { duration: 0.3 }
            }}
          >
            <motion.span 
              className={`text-sm font-medium ${accent} italic`}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Profile type:
            </motion.span>
            <motion.div
              whileHover={{ 
                rotate: 360, 
                scale: 1.2,
                filter: theme === 'development' 
                  ? 'drop-shadow(0 0 8px #06b6d4)' 
                  : theme === 'environment'
                  ? 'drop-shadow(0 0 8px #84cc16)'
                  : 'drop-shadow(0 0 8px #ffffff)'
              }}
              transition={{ duration: 0.5 }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              style={{
                animation: "float 3s ease-in-out infinite"
              }}
            >
              {icon}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: current; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }
        
        .development-gradient {
          background: linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .environment-gradient {
          background: linear-gradient(45deg, #84cc16, #10b981, #06d6a0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;