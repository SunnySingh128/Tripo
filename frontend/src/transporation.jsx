import React, { useState } from 'react';
import { Check, User, DollarSign, Car, Plane, Train, Bus, Bike, Navigation, Code2, GitBranch, Database, XCircle } from 'lucide-react';

const TransportationPaymentForm = () => {
  const [formData, setFormData] = useState({
    payerName: '',
    amount: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
const [friendError, setFriendError] = useState("");
const [showSuccess, setShowSuccess] = useState(false);



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

const validateForm = async () => {
  const newErrors = {};
  setFriendError("");
  setShowSuccess(false); // Reset success state

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
      const response = await fetch("/api/checkFriend", {
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
        setShowSuccess(false); // Don't show success
      } else {
        setShowSuccess(true);  // Friend is valid, show success
        setFriendError("");    // Clear friend error
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




  const handleSubmit = async () => {
    if (!validateForm()) return;
        const groupName = localStorage.getItem("groupName");

// Prepare the data to send including group name
const requestData = {
  ...formData,  // Spread the existing form data
  groupName: groupName  // Add the group name
};
            fetch('/api/amount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save activity');
      }
      return response.json();
    })
    .then(data => {
      console.log('Activity saved:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    setFormData({ payerName: '', amount: '' });
    setIsSubmitting(false);
    
    // Hide success message after 4 seconds
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 p-4 relative overflow-hidden">
      {/* Development Environment Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-8 text-green-400 opacity-25">
          <Code2 size={42} />
        </div>
        <div className="absolute top-52 right-12 text-emerald-400 opacity-25">
          <GitBranch size={38} />
        </div>
        <div className="absolute bottom-40 left-16 text-lime-400 opacity-25">
          <Database size={46} />
        </div>
        <div className="absolute bottom-16 right-8 text-teal-300 opacity-25">
          <Code2 size={34} />
        </div>
      </div>

      {/* Transportation Vehicle Animations */}
      <div className="absolute top-20 right-32 text-amber-400 opacity-40 animate-transport-drive">
        <Car size={28} />
      </div>
      <div className="absolute top-60 left-24 text-yellow-400 opacity-40 animate-transport-fly">
        <Plane size={32} />
      </div>
      <div className="absolute bottom-48 right-40 text-emerald-400 opacity-40 animate-transport-ride">
        <Train size={35} />
      </div>
      <div className="absolute bottom-24 left-32 text-green-400 opacity-40 animate-transport-move">
        <Bus size={30} />
      </div>
      <div className="absolute top-1/2 right-16 text-lime-400 opacity-40 animate-transport-cycle">
        <Bike size={26} />
      </div>
      <div className="absolute top-1/3 left-12 text-teal-400 opacity-40 animate-transport-navigate">
        <Navigation size={24} />
      </div>

      <div className="relative z-10 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-xl animate-transport-hub">
            <Car className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Transportation
          </h1>
          <p className="text-gray-300 text-lg">Development Environment | Energy Optimized v2.1.0</p>
        </div>

{showSuccess && !friendError && (
  <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-xl shadow-xl animate-transport-arrival">
    <div className="flex items-center">
      <Check className="mr-3 animate-transport-delivered" size={24} />
      <span className="font-semibold text-lg">Friend exists in the group successfully!</span>
    </div>
  </div>
)}

{friendError && !showSuccess && (
  <div className="mb-8 bg-gradient-to-r from-red-500 to-rose-500 text-white p-5 rounded-xl shadow-xl animate-transport-arrival">
    <div className="flex items-center">
      <XCircle className="mr-3 animate-shake" size={24} />
      <span className="font-semibold text-lg">{friendError}</span>
    </div>
  </div>
)}


        {/* Form Container */}
        <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-green-400/30 animate-slide-up">
          <div className="space-y-8">
            {/* Payer Name Field */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-200 mb-3 flex items-center">
                <User className="mr-2 text-green-400" size={18} />
                Payer Name
              </label>
              <input
                type="text"
                name="payerName"
                value={formData.payerName}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 bg-gray-700/90 border-2 ${
                  errors.payerName ? 'border-red-500' : 'border-green-400/60'
                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-400 transition-all duration-300 text-lg`}
                placeholder="Enter your name"
              />
              {errors.payerName && (
                <p className="text-red-400 text-sm mt-2 animate-transport-alert flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.payerName}
                </p>
              )}
            </div>

            {/* Amount Field */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-200 mb-3 flex items-center">
                <DollarSign className="mr-2 text-emerald-400" size={18} />
                Transportation Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full px-5 py-4 bg-gray-700/90 border-2 ${
                  errors.amount ? 'border-red-500' : 'border-green-400/60'
                } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-400/30 focus:border-green-400 transition-all duration-300 text-lg`}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="text-red-400 text-sm mt-2 animate-transport-alert flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.amount}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 px-8 rounded-xl font-bold text-white text-lg transition-all duration-300 transform ${
                isSubmitting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-2xl hover:scale-105 animate-transport-ready'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-transport-processing rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Journey...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Car className="mr-2 animate-transport-go" size={20} />
                  Submit Payment
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-400">
          <p className="text-sm mb-3">Development Environment | Eco-Friendly Transport API</p>
          <div className="flex justify-center items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-transport-status"></div>
              <span className="text-xs">Green Energy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-transport-status" style={{animationDelay: '0.5s'}}></div>
              <span className="text-xs">Carbon Neutral</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes transport-drive {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
        
        @keyframes transport-fly {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes transport-ride {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        
        @keyframes transport-move {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes transport-cycle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes transport-navigate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
        }
        
        @keyframes transport-hub {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        
        @keyframes transport-arrival {
          0% { transform: translateY(-100px) scale(0.8); opacity: 0; }
          50% { transform: translateY(0px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        
        @keyframes transport-delivered {
          0% { transform: scale(0) rotate(0deg); }
          50% { transform: scale(1.3) rotate(180deg); }
          100% { transform: scale(1) rotate(360deg); }
        }
        
        @keyframes transport-alert {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        
        @keyframes transport-ready {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes transport-processing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes transport-go {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(4px); }
        }
        
        @keyframes transport-status {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-transport-drive {
          animation: transport-drive 4s ease-in-out infinite;
        }
        
        .animate-transport-fly {
          animation: transport-fly 3s ease-in-out infinite;
        }
        
        .animate-transport-ride {
          animation: transport-ride 3.5s ease-in-out infinite;
        }
        
        .animate-transport-move {
          animation: transport-move 2.8s ease-in-out infinite;
        }
        
        .animate-transport-cycle {
          animation: transport-cycle 6s linear infinite;
        }
        
        .animate-transport-navigate {
          animation: transport-navigate 4s ease-in-out infinite;
        }
        
        .animate-transport-hub {
          animation: transport-hub 3s ease-in-out infinite;
        }
        
        .animate-transport-arrival {
          animation: transport-arrival 1s ease-out;
        }
        
        .animate-transport-delivered {
          animation: transport-delivered 0.8s ease-out;
        }
        
        .animate-transport-alert {
          animation: transport-alert 0.6s ease-in-out;
        }
        
        .animate-transport-ready {
          animation: transport-ready 2s ease-in-out infinite;
        }
        
        .animate-transport-processing {
          animation: transport-processing 1.2s linear infinite;
        }
        
        .animate-transport-go {
          animation: transport-go 1s ease-in-out infinite;
        }
        
        .animate-transport-status {
          animation: transport-status 2s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TransportationPaymentForm;