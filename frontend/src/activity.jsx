import React, { useState, useEffect } from 'react';
import { CheckCircle, Users, User, DollarSign, Activity, XCircle, Check } from 'lucide-react';

const api = import.meta.env.VITE_AP1_URL;

const ActivityTrackerForm = () => {
  // Environment detection
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  // Environment-based color schemes
  const colorScheme = isDevelopment ? {
    // Development Environment - Orange/Red theme
    background: 'from-green-900 via-red-900 to-pink-900',
    headerBg: 'bg-green-900/30',
    headerBorder: 'border-green-400/30',
    headerIcon: 'text-green-400',
    headerText: 'text-green-200',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-400/40',
    successIcon: 'text-green-400',
    successText: 'text-green-100',
    formBg: 'bg-gray-800/40',
    formBorder: 'border-orange-400/20',
    labelColor: 'text-orange-200',
    inputBg: 'bg-gray-900/50',
    inputBorder: 'border-green-400/30',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-orange-300',
    inputFocus: 'focus:ring-green-500/50 focus:border-green-400/50',
    iconColor: 'text-orange-300',
    toggleBg: 'bg-gray-900/50',
    toggleBorder: 'border-orange-400/30',
    toggleActive: 'bg-orange-500 shadow-orange-500/25',
    toggleInactive: 'text-green-200 hover:text-white hover:bg-green-800/50',
    checkboxBg: 'bg-gray-900/50',
    checkboxBorder: 'border-orange-400/30',
    checkboxHover: 'hover:bg-orange-800/30',
    checkboxActive: 'bg-orange-500/20 border-orange-400/40 text-green-100',
    checkboxInput: 'text-green-500 border-orange-300/50 focus:ring-orange-500/50',
    buttonBg: 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
    buttonFocus: 'focus:ring-green-500/50',
    buttonShadow: 'shadow-orange-500/25',
    footerText: 'text-orange-300',
    envLabel: 'DEVELOPMENT'
  } : {
    // Production Environment - Green/Blue theme
    background: 'from-green-900 via-teal-900 to-blue-900',
    headerBg: 'bg-green-900/30',
    headerBorder: 'border-green-400/30',
    headerIcon: 'text-green-400',
    headerText: 'text-green-200',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-400/40',
    successIcon: 'text-green-400',
    successText: 'text-green-100',
    formBg: 'bg-gray-800/40',
    formBorder: 'border-green-400/20',
    labelColor: 'text-green-200',
    inputBg: 'bg-gray-900/50',
    inputBorder: 'border-green-400/30',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-green-300',
    inputFocus: 'focus:ring-green-500/50 focus:border-green-400/50',
    iconColor: 'text-green-300',
    toggleBg: 'bg-gray-900/50',
    toggleBorder: 'border-green-400/30',
    toggleActive: 'bg-green-500 shadow-green-500/25',
    toggleInactive: 'text-green-200 hover:text-white hover:bg-green-800/50',
    checkboxBg: 'bg-gray-900/50',
    checkboxBorder: 'border-green-400/30',
    checkboxHover: 'hover:bg-green-800/30',
    checkboxActive: 'bg-green-500/20 border-green-400/40 text-green-100',
    checkboxInput: 'text-green-500 border-green-300/50 focus:ring-green-500/50',
    buttonBg: 'from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
    buttonFocus: 'focus:ring-green-500/50',
    buttonShadow: 'shadow-green-500/25',
    footerText: 'text-green-300',
    envLabel: 'PRODUCTION'
  };

  const [formData, setFormData] = useState({
    payerName: '',
    activityName: '',
    amount: '',
    type: 'individual',
    groupMembers: []
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [friendError, setFriendError] = useState("");
  const [availableMembers, setAvailableMembers] = useState([]);

  const fetchGroupAndMembers = async () => {
    try {
      const groupResponse = await fetch(`${api}/api/get`);
      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        if (Array.isArray(groupData) && groupData.length > 0) {
          const name = localStorage.getItem("groupName");
          const membersResponse = await fetch(`${api}/api/getMembers?group=${name}`);
          if (membersResponse.ok) {
            const membersData = await membersResponse.json();
            setAvailableMembers(membersData.friends || []);
          } else {
            console.error('Failed to fetch group members');
          }
        } else {
          console.error('No group data found');
        }
      } else {
        console.error('Failed to fetch group name');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchGroupAndMembers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      groupMembers: type === 'individual' ? [] : prev.groupMembers
    }));
  };

  const handleGroupMemberToggle = (member) => {
    setFormData(prev => ({
      ...prev,
      groupMembers: prev.groupMembers.includes(member)
        ? prev.groupMembers.filter(m => m !== member)
        : [...prev.groupMembers, member]
    }));
  };

  const validateForm = async () => {
    setFriendError("");
    setShowSuccess(false);

    const payerName = formData.payerName?.trim();
    const groupName = localStorage.getItem("groupName");

    if (!payerName) {
      setFriendError("Payer name is required");
      return false;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setFriendError("Valid amount is required");
      return false;
    }

    if (groupName) {
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
          return false;
        } else {
          setShowSuccess(true);
          setFriendError("");
          return true;
        }

      } catch (error) {
        console.error("Server error:", error);
        setFriendError("Unable to verify friend. Try again later.");
        setShowSuccess(false);
        return false;
      }
    }

    setFriendError("Group name not found.");
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const groupName = localStorage.getItem("groupName");
    const requestData = {
      ...formData,
      groupName: groupName
    };
    
    fetch(`${api}/api/amount`, {
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

    setShowSuccess(true);
    setFormData({
      payerName: '',
      activityName: '',
      amount: '',
      type: 'individual',
      groupMembers: [],
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorScheme.background} p-3 sm:p-4 md:p-6`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 pt-6 sm:pt-8">
          <div className={`inline-flex items-center gap-2 sm:gap-3 ${colorScheme.headerBg} backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border ${colorScheme.headerBorder}`}>
            <Activity className={`w-5 h-5 sm:w-6 sm:h-6 ${colorScheme.headerIcon}`} />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Activity Tracker</h1>
            <span className={`text-xs px-2 py-1 rounded-full ${isDevelopment ? 'bg-orange-500/20 text-orange-200' : 'bg-green-500/20 text-green-200'}`}>
              {colorScheme.envLabel}
            </span>
          </div>
          <p className={`${colorScheme.headerText} mt-3 sm:mt-4 text-sm sm:text-base`}>Track your expenses with style</p>
        </div>

        {/* Success/Error Messages */}
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

        {/* Main Form */}
        <form onSubmit={handleSubmit} className={`${colorScheme.formBg} backdrop-blur-sm rounded-xl p-4 sm:p-6 border ${colorScheme.formBorder} shadow-2xl`}>
          {/* Payer Name */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-2`}>
              Payer Name
            </label>
            <input
              type="text"
              name="payerName"
              value={formData.payerName}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg ${colorScheme.inputText} ${colorScheme.inputPlaceholder} focus:outline-none focus:ring-2 ${colorScheme.inputFocus} transition-all duration-200 text-sm sm:text-base`}
              placeholder="Enter payer name"
            />
            {errors.payerName && (
              <p className="text-red-400 text-sm mt-1">{errors.payerName}</p>
            )}
          </div>

          {/* Activity Name */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-2`}>
              Activity Name
            </label>
            <input
              type="text"
              name="activityName"
              value={formData.activityName}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg ${colorScheme.inputText} ${colorScheme.inputPlaceholder} focus:outline-none focus:ring-2 ${colorScheme.inputFocus} transition-all duration-200 text-sm sm:text-base`}
              placeholder="Enter activity name"
            />
            {errors.activityName && (
              <p className="text-red-400 text-sm mt-1">{errors.activityName}</p>
            )}
          </div>

          {/* Amount */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-2`}>
              Amount
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-2 sm:top-3 w-4 h-4 sm:w-5 sm:h-5 ${colorScheme.iconColor}`} />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg ${colorScheme.inputText} ${colorScheme.inputPlaceholder} focus:outline-none focus:ring-2 ${colorScheme.inputFocus} transition-all duration-200 text-sm sm:text-base`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Activity Type Toggle */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-3`}>
              Activity Type
            </label>
            <div className={`flex gap-1 ${colorScheme.toggleBg} p-1 rounded-lg border ${colorScheme.toggleBorder}`}>
              <button
                type="button"
                onClick={() => handleTypeChange('individual')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-md font-medium transition-all duration-300 text-xs sm:text-sm ${
                  formData.type === 'individual'
                    ? colorScheme.toggleActive
                    : colorScheme.toggleInactive
                }`}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Individual
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('group')}
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-md font-medium transition-all duration-300 text-xs sm:text-sm ${
                  formData.type === 'group'
                    ? colorScheme.toggleActive
                    : colorScheme.toggleInactive
                }`}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                Group
              </button>
            </div>
          </div>

          {/* Group Members Selection */}
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
            formData.type === 'group' ? 'max-h-96 opacity-100 mb-4 sm:mb-6' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-3">
              <label className={`block text-sm font-medium ${colorScheme.labelColor}`}>
                Select Group Members
              </label>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 max-h-32 sm:max-h-40 overflow-y-auto">
                {availableMembers.map((member) => (
                  <label
                    key={member}
                    className={`flex items-center gap-2 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm ${
                      formData.groupMembers.includes(member)
                        ? colorScheme.checkboxActive
                        : `${colorScheme.checkboxBg} border ${colorScheme.checkboxBorder} ${colorScheme.labelColor} ${colorScheme.checkboxHover}`
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.groupMembers.includes(member)}
                      onChange={() => handleGroupMemberToggle(member)}
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${colorScheme.checkboxInput} bg-transparent border-2 rounded focus:ring-2`}
                    />
                    <span className="text-xs sm:text-sm truncate">{member}</span>
                  </label>
                ))}
              </div>
              {errors.groupMembers && (
                <p className="text-red-400 text-sm mt-1">{errors.groupMembers}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-gradient-to-r ${colorScheme.buttonBg} text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 ${colorScheme.buttonFocus} shadow-lg ${colorScheme.buttonShadow} text-sm sm:text-base`}
          >
            Submit Activity
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className={`${colorScheme.footerText} text-xs sm:text-sm`}>
            Environment: {colorScheme.envLabel} | v1.0.0
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes transport-arrival {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          50% {
            opacity: 1;
            transform: translateY(5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes transport-delivered {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-transport-arrival {
          animation: transport-arrival 0.6s ease-out forwards;
        }
        
        .animate-transport-delivered {
          animation: transport-delivered 0.5s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ActivityTrackerForm;