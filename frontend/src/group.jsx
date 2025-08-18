import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
const GroupTripPlanner = () => {
  const [formData, setFormData] = useState({
    groupName: '',
    totalMembers: '',
    friendsNames: [],
    destination: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fade in animation on component mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTotalMembersChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      totalMembers: value,
      friendsNames: new Array(value).fill('')
    }));
  };

  const handleFriendNameChange = (index, value) => {
    const newFriendsNames = [...formData.friendsNames];
    newFriendsNames[index] = value;
    setFormData(prev => ({
      ...prev,
      friendsNames: newFriendsNames
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }
    
    if (!formData.totalMembers || formData.totalMembers < 1) {
      newErrors.totalMembers = 'Please select number of members';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    formData.friendsNames.forEach((name, index) => {
      if (!name.trim()) {
        newErrors[`friend${index}`] = `Friend ${index + 1} name is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const navigate=useNavigate();
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  setSubmitStatus('');

  try {
    localStorage.setItem("groupName", formData.groupName);
    const response = await fetch('/api/store', { // updated port
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        groupName: formData.groupName,
        friends: formData.friendsNames, // schema key
        place: formData.destination // schema key
      })
    });

    if (response.ok) {
      setSubmitStatus('success');

      // Reset foam before navigating
      setFormData({
        groupName: '',
        totalMembers: '',
        friendsNames: [],
        destination: ''
      });

      navigate("/Home", { state: { name: formData.groupName } });
    }else {
      const errorData = await response.json();
      console.error('Backend error:', errorData);
      throw new Error(errorData.error || errorData.message || 'Failed to submit');
    }
  }catch (error) {
    console.error('Submission error:', error.message);
    setSubmitStatus(error.message); // Set error message to display in UI
  }finally {
    setIsSubmitting(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 p-4 flex items-center justify-center relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Clouds */}
        <div className="absolute top-10 left-10 w-20 h-12 bg-white bg-opacity-40 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
        <div className="absolute top-32 right-20 w-16 h-8 bg-white bg-opacity-30 rounded-full animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-20 right-1/3 w-24 h-14 bg-white bg-opacity-35 rounded-full animate-[float_7s_ease-in-out_infinite]"></div>
        
        {/* Floating Airplanes */}
        <div className="absolute top-16 left-1/4 animate-[flyAcross_15s_linear_infinite]">
          ✈️
        </div>
        <div className="absolute top-40 right-1/4 animate-[flyAcrossReverse_20s_linear_infinite]">
          🛩️
        </div>
        
        {/* Floating Travel Icons */}
        <div className="absolute top-1/4 left-12 text-2xl animate-[bounce_3s_ease-in-out_infinite] text-green-400 opacity-60">
          🗺️
        </div>
        <div className="absolute top-1/3 right-16 text-xl animate-[bounce_4s_ease-in-out_infinite_0.5s] text-green-500 opacity-50">
          🧳
        </div>
        <div className="absolute bottom-1/4 left-1/3 text-2xl animate-[bounce_3.5s_ease-in-out_infinite_1s] text-emerald-400 opacity-40">
          🏔️
        </div>
        <div className="absolute bottom-1/3 right-1/3 text-xl animate-[bounce_4.5s_ease-in-out_infinite_1.5s] text-green-600 opacity-50">
          🏖️
        </div>
        <div className="absolute top-3/4 left-20 text-lg animate-[bounce_2.8s_ease-in-out_infinite_0.8s] text-emerald-500 opacity-45">
          🌴
        </div>
        <div className="absolute top-2/3 right-24 text-xl animate-[bounce_3.2s_ease-in-out_infinite_2s] text-green-400 opacity-55">
          🏕️
        </div>
        
        {/* Animated Compass */}
        <div className="absolute bottom-20 left-10 text-3xl animate-[spin_10s_linear_infinite] text-green-500 opacity-30">
          🧭
        </div>
        
        {/* Moving Path/Trail */}
        <div className="absolute top-1/2 left-0 w-full h-1">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-[movePath_8s_linear_infinite] opacity-40"></div>
        </div>
        
        {/* Floating Leaves */}
        <div className="absolute top-24 left-1/2 text-lg animate-[leafFloat_12s_ease-in-out_infinite] text-green-600 opacity-40">
          🍃
        </div>
        <div className="absolute top-60 right-1/5 text-sm animate-[leafFloat_10s_ease-in-out_infinite_2s] text-emerald-600 opacity-35">
          🍃
        </div>
        <div className="absolute bottom-32 left-2/3 text-base animate-[leafFloat_14s_ease-in-out_infinite_1s] text-green-500 opacity-30">
          🍃
        </div>
        
        {/* Hot Air Balloons */}
        <div className="absolute top-8 right-10 text-2xl animate-[balloonFloat_18s_ease-in-out_infinite] text-green-400 opacity-50">
          🎈
        </div>
        
        {/* Twinkling Stars/Points of Interest */}
        <div className="absolute top-16 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-[twinkle_3s_ease-in-out_infinite] opacity-60"></div>
        <div className="absolute top-36 right-1/3 w-1.5 h-1.5 bg-green-500 rounded-full animate-[twinkle_4s_ease-in-out_infinite_1s] opacity-50"></div>
        <div className="absolute bottom-40 left-1/5 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-[twinkle_5s_ease-in-out_infinite_2s] opacity-40"></div>
        <div className="absolute bottom-24 right-2/5 w-1 h-1 bg-green-600 rounded-full animate-[twinkle_3.5s_ease-in-out_infinite_0.5s] opacity-55"></div>
      </div>
      <div className={`w-full max-w-lg transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3 animate-bounce">
            <CheckCircle className="text-green-600 w-6 h-6" />
            <div>
              <p className="text-green-800 font-medium">Trip planned successfully! ✈️</p>
              <p className="text-green-600 text-sm">Get ready for an amazing adventure!</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus && submitStatus !== 'success' && (
  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
    <AlertCircle className="text-red-600 w-6 h-6" />
    <div>
      <p className="text-red-800 font-medium">{submitStatus}</p>
      <p className="text-red-600 text-sm">Please try again later</p>
    </div>
  </div>
        )}

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 text-green-300 opacity-40">
            <Plane className="w-12 h-12 transform rotate-45 animate-pulse" />
          </div>
          <div className="absolute bottom-4 left-4 text-emerald-300 opacity-40">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-full animate-pulse">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 font-['Poppins']">
                Group Trip Planner
              </h1>
            </div>
            <p className="text-gray-600">Plan your next adventure with friends!</p>
          </div>

          <div className="space-y-6">
            
            {/* Group Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Group Name *
              </label>
              <input
                type="text"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.groupName ? 'border-red-300' : 'border-gray-200 focus:border-emerald-500'
                }`}
                placeholder="e.g., Adventure Squad"
              />
              {errors.groupName && (
                <p className="text-red-500 text-sm">{errors.groupName}</p>
              )}
            </div>

            {/* Total Members */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Total Members *
              </label>
              <select
                name="totalMembers"
                value={formData.totalMembers}
                onChange={handleTotalMembersChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.totalMembers ? 'border-red-300' : 'border-gray-200 focus:border-emerald-500'
                }`}
              >
                <option value="">Select number of members</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Member' : 'Members'}
                  </option>
                ))}
              </select>
              {errors.totalMembers && (
                <p className="text-red-500 text-sm">{errors.totalMembers}</p>
              )}
            </div>

            {/* Friends' Names - Dynamic Fields */}
            {formData.totalMembers > 0 && (
              <div className="space-y-4 animate-[slideDown_0.5s_ease-out]">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Friends' Names</span>
                </h3>
                {formData.friendsNames.map((name, index) => (
                  <div 
                    key={index} 
                    className="transform transition-all duration-300 animate-[fadeInUp_0.5s_ease-out]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Friend {index + 1} Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleFriendNameChange(index, e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors[`friend${index}`] ? 'border-red-300' : 'border-gray-200 focus:border-emerald-500'
                      }`}
                      placeholder={`Enter friend ${index + 1}'s name`}
                    />
                    {errors[`friend${index}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`friend${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Destination */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Where do you want to go? *</span>
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.destination ? 'border-red-300' : 'border-gray-200 focus:border-emerald-500'
                }`}
                placeholder="e.g., Bali, Indonesia"
              />
              {errors.destination && (
                <p className="text-red-500 text-sm">{errors.destination}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Planning your trip...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Plan Our Trip!</span>
                </>
              )}
            </button>
          </div>

          {/* Character Illustration */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full text-white text-2xl animate-[wiggle_2s_ease-in-out_infinite]">
              🎒
            </div>
            <p className="text-xs text-gray-500 mt-2">Ready for adventure!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 1000px;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes flyAcross {
          0% {
            transform: translateX(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) rotate(0deg);
            opacity: 0;
          }
        }
        
        @keyframes flyAcrossReverse {
          0% {
            transform: translateX(calc(100vw + 100px)) rotate(180deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(-100px) rotate(180deg);
            opacity: 0;
          }
        }
        
        @keyframes movePath {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }
        
        @keyframes leafFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          50% {
            transform: translateY(-5px) rotate(-5deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
        
        @keyframes balloonFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
          }
          75% {
            transform: translateY(-25px) translateX(15px);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GroupTripPlanner;