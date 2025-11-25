import React, { useState, useEffect } from 'react';
import { Check, Hotel, User, DollarSign, Code, Terminal, Coffee, Wifi, Bed, MapPin, Users, UserCheck, XCircle } from 'lucide-react'; 

const api = import.meta.env.VITE_AP1_URL;

const HotelPaymentForm = () => {
  const [formData, setFormData] = useState({
    paymentType: 'group', // 'group' or 'individual'
    payerName: '',
    activityName: '',
    amount: '',
    selectedFriends: []
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendError, setFriendError] = useState("");

  const fetchFriendsFromBackend = async () => {
    setLoadingFriends(true);
    try {
      const name = localStorage.getItem("groupName");
      console.log(name);
  
      const membersResponse = await fetch(`${api}/api/getMembers?group=${name}`);
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
    
        const formattedMembers = (membersData.friends || []).map((friend, index) => ({
          id: index + 1,
          name: friend
        }));
    
        setAvailableMembers(formattedMembers);
      } else {
        console.error('Failed to fetch group members');
        setAvailableMembers([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setAvailableMembers([]);
    } finally {
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (formData.paymentType === 'individual') {
      fetchFriendsFromBackend();
    }
  }, [formData.paymentType]);

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

  const handlePaymentTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      paymentType: type,
      selectedFriends: []
    }));
  };

  const handleFriendSelection = (friendId) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.includes(friendId)
        ? prev.selectedFriends.filter(id => id !== friendId)
        : [...prev.selectedFriends, friendId]
    }));
  };

  const validateForm = async () => {
    const newErrors = {};
    setFriendError("");
    setShowSuccess(false);

    const payerName = formData.payerName?.trim();
    const groupName = localStorage.getItem("groupName");

    if (!payerName) {
      newErrors.payerName = "Payer name is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }

    if (!newErrors.payerName && groupName) {
      try {
        const response = await fetch(`${api}/api/checkFriend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ payerName, groupName })
        });

        const data = await response.json();
        console.log("Server response:", data.message);

        if (!data.success) {
          setFriendError(data.message);
          setShowSuccess(false);
        } else {
          setShowSuccess(true);
          setFriendError("");
        }

      } catch (error) {
        console.error("Server error:", error);
        setFriendError("Unable to verify friend. Try again later.");
        setShowSuccess(false);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !friendError;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) return;
    
    const groupName = localStorage.getItem("groupName");
    const requestData = {
      ...formData,
      groupName: groupName
    };
    
    console.log(formData);
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${api}/api/amount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save activity');
      }
      
      const data = await response.json();
      console.log('Activity saved:', data);
      
      setShowSuccess(true);
      setFormData({ 
        paymentType: 'group',
        payerName: '', 
        activityName: '', 
        amount: '',
        selectedFriends: []
      });
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black p-3 sm:p-4 relative overflow-hidden">
      {/* Environment/Development Background Elements - Responsive */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-4 sm:top-20 sm:left-10 text-green-400 opacity-20">
          <Code size={24} sm:size={40} />
        </div>
        <div className="absolute top-20 right-6 sm:top-40 sm:right-20 text-amber-400 opacity-20">
          <Terminal size={20} sm:size={35} />
        </div>
        <div className="absolute bottom-20 left-6 sm:bottom-32 sm:left-20 text-green-500 opacity-20">
          <Coffee size={28} sm:size={45} />
        </div>
        <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 text-yellow-400 opacity-20">
          <Code size={18} sm:size={30} />
        </div>
      </div>

      {/* Hotel Floating Elements - Responsive Positioning */}
      <div className="absolute top-6 right-10 sm:top-10 sm:right-40 text-blue-400 opacity-30 animate-hotel-float">
        <Hotel size={18} sm:size={25} />
      </div>
      <div className="absolute bottom-20 left-10 sm:bottom-40 sm:left-40 text-purple-400 opacity-30 animate-hotel-sway">
        <Bed size={20} sm:size={30} />
      </div>
      <div className="absolute top-1/2 left-4 sm:top-1/2 sm:left-10 text-indigo-400 opacity-30 animate-hotel-bounce">
        <MapPin size={16} sm:size={28} />
      </div>
      <div className="absolute top-1/4 right-6 sm:top-1/3 sm:right-20 text-cyan-400 opacity-30 animate-hotel-pulse">
        <Wifi size={18} sm:size={26} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-amber-500 rounded-full mb-3 sm:mb-4 shadow-lg animate-hotel-welcome">
            <Hotel className="text-white" size={20} sm:size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
            Hotel Payment
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Development Environment v1.0</p>
        </div>

        {/* Success Message */}
        {showSuccess && !friendError && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 sm:p-5 rounded-xl shadow-xl animate-transport-arrival">
            <div className="flex items-center">
              <Check className="mr-2 sm:mr-3 animate-transport-delivered" size={20} sm:size={24} />
              <span className="font-semibold text-base sm:text-lg">Friend exists in the group successfully!</span>
            </div>
          </div>
        )}

        {friendError && !showSuccess && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 sm:p-5 rounded-xl shadow-xl animate-transport-arrival">
            <div className="flex items-center">
              <XCircle className="mr-2 sm:mr-3 animate-shake" size={20} sm:size={24} />
              <span className="font-semibold text-base sm:text-lg">{friendError}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-green-500/30 animate-slide-up">
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Type Selection */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Payment Type
              </label>
              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('group')}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                    formData.paymentType === 'group'
                      ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-lg'
                      : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80'
                  }`}
                >
                  <Users className="mr-2" size={16} sm:size={18} />
                  <span className="text-sm sm:text-base">Group</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('individual')}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                    formData.paymentType === 'individual'
                      ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-lg'
                      : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80'
                  }`}
                >
                  <UserCheck className="mr-2" size={16} sm:size={18} />
                  <span className="text-sm sm:text-base">Individual</span>
                </button>
              </div>
            </div>

            {/* Friends Selection (only for individual payments) */}
            {formData.paymentType === 'individual' && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  <UserCheck className="inline mr-2" size={14} sm:size={16} />
                  Select Friends
                </label>
                {loadingFriends ? (
                  <div className="flex items-center justify-center py-3 sm:py-4">
                    <div className="animate-hotel-loading rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-green-400 mr-2"></div>
                    <span className="text-gray-300 text-sm sm:text-base">Loading friends...</span>
                  </div>
                ) : (
                  <div className="max-h-32 sm:max-h-48 overflow-y-auto space-y-2 bg-gray-700/50 rounded-lg p-2 sm:p-3">
                    {availableMembers.map((friend) => (
                      <label
                        key={friend.id}
                        className="flex items-center p-2 rounded-lg hover:bg-gray-600/50 cursor-pointer transition-colors duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedFriends.includes(friend.id)}
                          onChange={() => handleFriendSelection(friend.id)}
                          className="mr-2 sm:mr-3 w-4 h-4 text-green-500 bg-gray-600 border-gray-500 rounded focus:ring-green-400 focus:ring-2"
                        />
                        <span className="text-gray-200 text-sm sm:text-base">{friend.name}</span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.selectedFriends && (
                  <p className="text-red-400 text-sm mt-1 animate-hotel-error">{errors.selectedFriends}</p>
                )}
              </div>
            )}

            {/* Payer Name Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                <User className="inline mr-2" size={14} sm:size={16} />
                Payer Name
              </label>
              <input
                type="text"
                name="payerName"
                value={formData.payerName}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border ${
                  errors.payerName ? 'border-red-500' : 'border-green-500/50'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base`}
                placeholder="Enter payer name"
              />
              {errors.payerName && (
                <p className="text-red-400 text-sm mt-1 animate-hotel-error">{errors.payerName}</p>
              )}
            </div>

            {/* Hotel Name Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                <Hotel className="inline mr-2" size={14} sm:size={16} />
                Hotel Name
              </label>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border ${
                  errors.activityName ? 'border-red-500' : 'border-green-500/50'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base`}
                placeholder="Enter hotel name"
              />
              {errors.activityName && (
                <p className="text-red-400 text-sm mt-1 animate-hotel-error">{errors.activityName}</p>
              )}
            </div>

            {/* Amount Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                <DollarSign className="inline mr-2" size={14} sm:size={16} />
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border ${
                  errors.amount ? 'border-red-500' : 'border-green-500/50'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1 animate-hotel-error">{errors.amount}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 sm:px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 shadow-lg hover:shadow-xl animate-hotel-booking'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-hotel-loading rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  <span className="text-sm sm:text-base">Processing Booking...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">Submit Record</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 text-gray-400">
          <p className="text-xs sm:text-sm">Development Environment | Terminal Active</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes hotel-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes hotel-sway {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(8px); }
        }
        
        @keyframes hotel-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes hotel-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes hotel-welcome {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes hotel-checkin {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes hotel-checkmark {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        @keyframes hotel-error {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        @keyframes hotel-booking {
          0% { transform: translateY(0); }
          100% { transform: translateY(-2px); }
        }
        
        @keyframes hotel-loading {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes hotel-signal {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-hotel-float {
          animation: hotel-float 3s ease-in-out infinite;
        }
        
        .animate-hotel-sway {
          animation: hotel-sway 4s ease-in-out infinite;
        }
        
        .animate-hotel-bounce {
          animation: hotel-bounce 2.5s ease-in-out infinite;
        }
        
        .animate-hotel-pulse {
          animation: hotel-pulse 2s ease-in-out infinite;
        }
        
        .animate-hotel-welcome {
          animation: hotel-welcome 2s ease-in-out infinite;
        }
        
        .animate-hotel-checkin {
          animation: hotel-checkin 0.8s ease-out;
        }
        
        .animate-hotel-checkmark {
          animation: hotel-checkmark 0.6s ease-out;
        }
        
        .animate-hotel-error {
          animation: hotel-error 0.5s ease-in-out;
        }
        
        .animate-hotel-booking {
          animation: hotel-booking 0.3s ease-out;
        }
        
        .animate-hotel-loading {
          animation: hotel-loading 1s linear infinite;
        }
        
        .animate-hotel-signal {
          animation: hotel-signal 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default HotelPaymentForm;