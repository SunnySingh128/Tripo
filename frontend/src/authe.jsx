import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Lock, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from './auth.jsx';
const api=import.meta.env.VITE_AP1_URL;

export default function SimpleGroupForm() {
  const [formData, setFormData] = useState({
    groupName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState({
    groupName: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Realistic green color theme
  const colors = {
    primary: 'bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-900',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    input: 'border-emerald-400/40 focus:border-emerald-300 focus:shadow-emerald-300/20',
    icon: 'text-emerald-300',
    error: 'text-rose-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    card: 'bg-gradient-to-br from-gray-900/80 via-slate-900/80 to-gray-900/80'
  };

  function GoBack() {
    setTimeout(() => {
      navigate("/Login")
    }, 2000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleFocus = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.groupName.trim() || !formData.password.trim()) {
      setError('Both fields are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${api}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: formData.groupName,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log(data);

      if (response.ok && data.message === "Login successful") {
        localStorage.setItem("groupName", formData.groupName);
        setIsAuthenticated(true);
        navigate("/Home", { state: { name: formData.groupName } });
      } else {
        setError(data.error || 'Authentication failed');
        GoBack();
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${colors.primary} animate-gradient-x`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-emerald-500/10"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(40px)',
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className={`w-full max-w-md ${colors.card} backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl relative overflow-hidden z-10 transition-all duration-500 hover:shadow-emerald-500/20`}>
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-500/10 rounded-full filter blur-3xl"></div>
        
        {/* Animated header with sparkles */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
            Join a Group
            <Sparkles className="w-5 h-5 ml-2 text-yellow-300 animate-pulse" />
          </h1>
          <p className="text-gray-300/80">Enter your group details to get started</p>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mt-2 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Group Name Field */}
          <div className="relative">
            <label className="block text-white/90 font-medium mb-2">
              <Users className={`w-5 h-5 inline mr-2 ${colors.icon} transition-transform ${isFocused.groupName ? 'scale-110' : ''}`} />
              Group Name
            </label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleInputChange}
              onFocus={() => handleFocus('groupName')}
              onBlur={() => handleBlur('groupName')}
              className={`w-full p-3 rounded-lg bg-black/20 backdrop-blur-sm border ${colors.input} text-white placeholder-gray-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/30 transition-all duration-300 ${
                isFocused.groupName ? 'ring-2 ring-emerald-300/30 ' + colors.glow : ''
              }`}
              placeholder="Enter group name"
            />
            {isFocused.groupName && (
              <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/80 to-emerald-400/0 w-full"></div>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-white/90 font-medium mb-2">
              <Lock className={`w-5 h-5 inline mr-2 ${colors.icon} transition-transform ${isFocused.password ? 'scale-110' : ''}`} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={() => handleFocus('password')}
                onBlur={() => handleBlur('password')}
                className={`w-full p-3 pr-12 rounded-lg bg-black/20 backdrop-blur-sm border ${colors.input} text-white placeholder-gray-400/70 focus:outline-none focus:ring-2 focus:ring-emerald-300/30 transition-all duration-300 ${
                  isFocused.password ? 'ring-2 ring-emerald-300/30 ' + colors.glow : ''
                }`}
                placeholder="Enter group password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {isFocused.password && (
              <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/80 to-emerald-400/0 w-full"></div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className={`flex items-center p-3 rounded-lg bg-rose-900/30 border border-rose-400/30 ${colors.error} animate-shake`}>
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 rounded-lg ${colors.button} text-white font-medium flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-[1.02] ${
              isSubmitting ? 'opacity-80' : 'hover:shadow-lg hover:shadow-emerald-500/20'
            } relative overflow-hidden group`}
          >
            <span className="absolute inset-0 bg-white/10 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></span>
            
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Login to Group</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}