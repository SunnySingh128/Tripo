import React, { useState, useEffect } from 'react';
import { Users, Mail, Calendar, UserCheck, Leaf, Code, TreePine } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
const api=import.meta.env.VITE_AP1_URL;
const UserDataForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    gender: ''
  });
  
  const [storedData, setStoredData] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('userDataEntries');
    if (savedData) {
      setStoredData(JSON.parse(savedData));
    }
  }, []);
  // navigate
  const navigate = useNavigate();
  function gon(){
navigate('/Group')
  }

  // Save data to localStorage whenever storedData changes
  useEffect(() => {
    localStorage.setItem('userDataEntries', JSON.stringify(storedData));
  }, [storedData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newEntry = {
        ...formData,
        id: Date.now(),
        timestamp: new Date().toLocaleString()
      };
      
      setStoredData([...storedData, newEntry]);
      setFormData({ name: '', age: '', email: '', gender: '' });
      setShowSuccess(true);
      setErrors({});
      
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const deleteEntry = (id) => {
    setStoredData(storedData.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-emerald-200 opacity-20 animate-pulse">
          <TreePine size={120} />
        </div>
        <div className="absolute top-40 right-16 text-teal-200 opacity-20 animate-bounce">
          <Code size={100} />
        </div>
        <div className="absolute bottom-20 left-1/4 text-cyan-200 opacity-20 animate-pulse">
          <Leaf size={80} />
        </div>
        <div className="absolute bottom-40 right-1/3 text-emerald-200 opacity-20 animate-bounce">
          <Users size={90} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white animate-pulse">
              <Leaf size={36} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
             Fill Your All Details
            </h1>
            <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full text-white animate-pulse">
              <Code size={36} />
            </div>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Experience seamless data collection with style
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-lg shadow-lg animate-bounce-in">
            <div className="flex items-center justify-center gap-2">
              <UserCheck size={24} />
              <span className="font-medium">Data saved to localStorage! 🌱</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-emerald-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Users className="text-emerald-600" size={28} />
              <span>User Registration</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <UserCheck size={18} className="text-emerald-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-emerald-200 hover:border-emerald-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.name}</p>
                )}
              </div>

              {/* Age Field */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar size={18} className="text-teal-600" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    errors.age ? 'border-red-300 bg-red-50' : 'border-teal-200 hover:border-teal-300'
                  }`}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.age}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Mail size={18} className="text-cyan-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-cyan-200 hover:border-cyan-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.email}</p>
                )}
              </div>

              {/* Gender Field */}
              <div className="group">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Users size={18} className="text-emerald-600" />
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    errors.gender ? 'border-red-300 bg-red-50' : 'border-emerald-200 hover:border-emerald-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600 animate-shake">{errors.gender}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              onClick={gon}
              >
                <Leaf size={20} />
                <span>Save Data to Storage</span>
                <Code size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes bounce-in {
          0% { transform: translateY(-20px); opacity: 0; }
          50% { transform: translateY(10px); opacity: 1; }
          100% { transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out;
        }

        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(5, 150, 105, 0.3);
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(5, 150, 105, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UserDataForm;