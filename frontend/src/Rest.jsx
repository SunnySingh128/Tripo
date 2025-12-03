import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Send, DollarSign, User, Building, Utensils, Coffee, Star, Sparkles, CheckCircle, Users, UserCheck, XCircle, Check } from 'lucide-react';
const api = import.meta.env.VITE_AP1_URL 
export default function RestaurantForm() {
  const [formData, setFormData] = useState({
    paymentType: 'group',
    groupOption: 'equal', // 'equal' or 'custom'
    activityName: '',
    payerName: '',
    amount: '',
    selectedFriends: [], // For individual mode
    equalSplitAmounts: {}, // For equal split mode
    customSplit: [] // For custom split mode
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [chefMood, setChefMood] = useState('happy');
  const [showConfetti, setShowConfetti] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendError, setFriendError] = useState("");

  // Memoized particles to avoid recalculation on every render
  const particles = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 15;
    
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
      size: isMobile ? 0.3 + Math.random() * 0.7 : 0.5 + Math.random() * 1,
      icon: [Coffee, Utensils, Star][Math.floor(Math.random() * 3)]
    }));
  }, []);

  // Fetch friends from backend
  const fetchFriendsFromBackend = useCallback(async () => {
    setLoadingFriends(true);
    setFriendError("");
    
    try {
      const groupName = localStorage.getItem("groupName");
      
      if (!groupName) {
        setFriendError("Group name not found in storage");
        setFriends([]);
        return;
      }

      const membersResponse = await fetch(`${api}/api/getMembers?group=${encodeURIComponent(groupName)}`);
      
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        const formattedMembers = (membersData.friends || []).map((friend, index) => ({
          id: index + 1,
          name: friend
        }));
        setFriends(formattedMembers);
        
        // Initialize custom split with all members when switching to custom mode
        if (formData.paymentType === 'group' && formData.groupOption === 'custom') {
          setFormData(prev => ({
            ...prev,
            customSplit: formattedMembers.map(friend => ({
              name: friend.name,
              amount: 0
            }))
          }));
        }
      } else {
        console.error('Failed to fetch group members');
        setFriendError("Failed to load friends");
        setFriends([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFriendError("Unable to load friends. Please try again.");
      setFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  }, [formData.paymentType, formData.groupOption]);

  // Calculate total amount from individual friend amounts
  const calculateTotalAmount = useCallback(() => {
    if (formData.paymentType === 'individual') {
      return formData.selectedFriends.reduce((total, friend) => total + (friend.amount || 0), 0);
    } else if (formData.paymentType === 'group' && formData.groupOption === 'custom') {
      return formData.customSplit.reduce((total, item) => total + (item.amount || 0), 0);
    }
    return parseFloat(formData.amount) || 0;
  }, [formData]);

  // Update total amount when amounts change
  useEffect(() => {
    if (formData.paymentType === 'individual' || 
        (formData.paymentType === 'group' && formData.groupOption === 'custom')) {
      const totalAmount = calculateTotalAmount();
      setFormData(prev => ({
        ...prev,
        amount: totalAmount > 0 ? totalAmount.toFixed(2) : ''
      }));
    }
  }, [formData.paymentType, formData.groupOption, formData.selectedFriends, formData.customSplit, calculateTotalAmount]);

  // Calculate equal split amounts when total amount changes
  useEffect(() => {
    if (formData.paymentType === 'group' && formData.groupOption === 'equal' && formData.amount && friends.length > 0) {
      const total = parseFloat(formData.amount);
      if (!isNaN(total) && total > 0) {
        const perPerson = total / friends.length;
        const equalSplitAmounts = {};
        friends.forEach(friend => {
          equalSplitAmounts[friend.name] = perPerson.toFixed(2);
        });
        setFormData(prev => ({
          ...prev,
          equalSplitAmounts
        }));
      }
    }
  }, [formData.amount, formData.paymentType, formData.groupOption, friends]);

  // Fetch friends when needed
  useEffect(() => {
    if ((formData.paymentType === 'individual') || 
        (formData.paymentType === 'group' && formData.groupOption === 'custom')) {
      fetchFriendsFromBackend();
    }
  }, [formData.paymentType, formData.groupOption, fetchFriendsFromBackend]);

  // Update chef mood based on form completion
  useEffect(() => {
    let requiredFields = [];
    
    if (formData.paymentType === 'individual') {
      requiredFields = [formData.activityName, formData.selectedFriends.length > 0];
    } else if (formData.paymentType === 'group') {
      if (formData.groupOption === 'equal') {
        requiredFields = [formData.activityName, formData.payerName, formData.amount];
      } else if (formData.groupOption === 'custom') {
        requiredFields = [formData.activityName, formData.payerName, formData.customSplit.length > 0];
      }
    }
    
    const filledCount = requiredFields.filter(Boolean).length;
    
    if (filledCount === requiredFields.length) {
      setChefMood('excited');
    } else if (filledCount >= 1) {
      setChefMood('happy');
    } else {
      setChefMood('thinking');
    }
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePaymentTypeChange = useCallback((type) => {
    setFormData(prev => ({
      ...prev,
      paymentType: type,
      groupOption: type === 'group' ? 'equal' : undefined,
      payerName: type === 'group' ? prev.payerName : '', // Clear payerName for individual mode
      amount: '',
      selectedFriends: [],
      customSplit: [],
      equalSplitAmounts: {}
    }));
    setFriendError("");
    setMessage('');
  }, []);

  const handleGroupOptionChange = useCallback((option) => {
    setFormData(prev => ({
      ...prev,
      groupOption: option,
      amount: option === 'equal' ? '' : prev.amount,
      customSplit: option === 'custom' ? (prev.customSplit.length > 0 ? prev.customSplit : []) : [],
      equalSplitAmounts: option === 'equal' ? prev.equalSplitAmounts : {}
    }));
    setFriendError("");
    setMessage('');
  }, []);

  // Individual mode functions
  const handleFriendSelection = useCallback((friendName) => {
    setFormData(prev => {
      const isCurrentlySelected = prev.selectedFriends.some(friend => friend.name === friendName);
      
      if (isCurrentlySelected) {
        return {
          ...prev,
          selectedFriends: prev.selectedFriends.filter(friend => friend.name !== friendName)
        };
      } else {
        return {
          ...prev,
          selectedFriends: [
            ...prev.selectedFriends,
            { name: friendName, amount: 0 }
          ]
        };
      }
    });
  }, []);

  const handleFriendAmountChange = useCallback((friendName, amount) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.map(friend =>
        friend.name === friendName 
          ? { ...friend, amount: parseFloat(amount) || 0 }
          : friend
      )
    }));
  }, []);

  // Custom split functions - removed Add/Remove functionality
  const handleCustomSplitAmountChange = useCallback((index, amount) => {
    setFormData(prev => {
      const updatedCustomSplit = [...prev.customSplit];
      updatedCustomSplit[index] = {
        ...updatedCustomSplit[index],
        amount: parseFloat(amount) || 0
      };
      return {
        ...prev,
        customSplit: updatedCustomSplit
      };
    });
  }, []);

  const isFriendSelected = useCallback((friendName) => {
    return formData.selectedFriends.some(friend => friend.name === friendName);
  }, [formData.selectedFriends]);

  const getFriendAmount = useCallback((friendName) => {
    const friend = formData.selectedFriends.find(f => f.name === friendName);
    return friend ? friend.amount : 0;
  }, [formData.selectedFriends]);

  // Validation function
  const validateForm = useCallback(async () => {
    setFriendError("");
    setMessage('');

    const { paymentType, groupOption, activityName, payerName, amount, selectedFriends, customSplit } = formData;

    // Basic validation
    if (!activityName?.trim()) {
      setFriendError("Hotel name is required");
      return false;
    }

    // Individual mode validation
    if (paymentType === 'individual') {
      if (selectedFriends.length === 0) {
        setFriendError("Please select at least one friend");
        return false;
      }

      const invalidAmounts = selectedFriends.some(friend => 
        !friend.amount || friend.amount <= 0
      );

      if (invalidAmounts) {
        setFriendError("All selected friends must have a valid positive amount");
        return false;
      }

      return true;
    }

    // Group mode validation
    if (paymentType === 'group') {
      if (!payerName?.trim()) {
        setFriendError("Payer name is required");
        return false;
      }

      const groupName = localStorage.getItem("groupName");
      if (!groupName) {
        setFriendError("Group name not found");
        return false;
      }

      // Verify payer exists in group
      try {
        const response = await fetch(`${api}/api/checkFriend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ payerName: payerName.trim(), groupName })
        });

        const data = await response.json();

        if (!data.success) {
          setFriendError(data.message || "Payer verification failed");
          return false;
        }
      } catch (error) {
        console.error("Validation error:", error);
        setFriendError("Unable to verify payer. Try again later.");
        return false;
      }

      // Equal split validation
      if (groupOption === 'equal') {
        if (!amount || parseFloat(amount) <= 0) {
          setFriendError("Valid amount is required for equal split");
          return false;
        }
        return true;
      }

      // Custom split validation
      if (groupOption === 'custom') {
        if (customSplit.length === 0) {
          setFriendError("No group members found");
          return false;
        }

        const invalidAmounts = customSplit.some(item => 
          !item.amount || item.amount <= 0
        );

        if (invalidAmounts) {
          setFriendError("All members must have a valid positive amount");
          return false;
        }

        const totalAmount = customSplit.reduce((sum, item) => sum + item.amount, 0);
        if (totalAmount <= 0) {
          setFriendError("Total amount must be greater than 0");
          return false;
        }

        return true;
      }
    }

    return false;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setMessage('');
    setChefMood('cooking');

    try {
      const groupName = localStorage.getItem("groupName");

      const requestData = {
        ...formData,
        groupName: groupName,
        totalAmount: calculateTotalAmount()
      };
      
      const response = await fetch(`${api}/api/amount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setMessage('Payment record saved successfully!');
        setChefMood('celebrating');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        // Reset form
        setFormData({
          paymentType: 'group',
          groupOption: 'equal',
          activityName: '',
          payerName: '',
          amount: '',
          selectedFriends: [],
          equalSplitAmounts: {},
          customSplit: []
        });
      } else {
        const errorData = await response.json();
        setMessage('');
        setFriendError(errorData.message || 'Error saving payment record. Please try again.');
        setChefMood('sad');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage('');
      setFriendError('Network error. Please check your connection and try again.');
      setChefMood('sad');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, calculateTotalAmount]);

  // Form validation check
  const isFormValid = useMemo(() => {
    const { paymentType, groupOption, activityName, payerName, amount, selectedFriends, customSplit } = formData;
    
    if (!activityName) return false;
    
    if (paymentType === 'individual') {
      return selectedFriends.length > 0 && 
             selectedFriends.every(friend => friend.amount > 0);
    }
    
    if (paymentType === 'group') {
      if (!payerName) return false; // Payer name required only in group mode
      
      if (groupOption === 'equal') {
        return !!amount && parseFloat(amount) > 0;
      }
      
      if (groupOption === 'custom') {
        return customSplit.length > 0 && 
               customSplit.every(item => item.amount > 0);
      }
    }
    
    return false;
  }, [formData]);

  // Calculate totals
  const individualTotal = useMemo(() => {
    return formData.selectedFriends.reduce((total, friend) => total + (friend.amount || 0), 0);
  }, [formData.selectedFriends]);

  const customSplitTotal = useMemo(() => {
    return formData.customSplit.reduce((total, item) => total + (item.amount || 0), 0);
  }, [formData.customSplit]);

  const ChefCharacter = () => {
    const expressions = {
      happy: "😊",
      thinking: "🤔",
      excited: "🤩",
      cooking: "👨‍🍳",
      celebrating: "🎉",
      sad: "😔"
    };

    return (
      <div className="relative">
        <div className={`text-4xl md:text-6xl transition-all duration-500 ${
          chefMood === 'celebrating' ? 'animate-bounce' : 
          chefMood === 'cooking' ? 'animate-pulse' : 'animate-pulse'
        }`}>
          {expressions[chefMood]}
        </div>
        {chefMood === 'celebrating' && (
          <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-xl md:text-2xl animate-spin">
            ✨
          </div>
        )}
      </div>
    );
  };

  const FloatingParticles = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => {
        const Icon = particle.icon;
        return (
          <div
            key={particle.id}
            className="absolute text-emerald-300 opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: `${particle.size}rem`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          >
            <Icon className="animate-ping" />
          </div>
        );
      })}
    </div>
  );

  const Confetti = () => (
    showConfetti && (
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>
    )
  );

  // Calculate progress for indicator
  const progressSteps = useMemo(() => {
    let requiredFields = [];
    
    if (formData.paymentType === 'individual') {
      requiredFields = [formData.activityName, formData.selectedFriends.length > 0];
    } else if (formData.paymentType === 'group') {
      if (formData.groupOption === 'equal') {
        requiredFields = [formData.activityName, formData.payerName, formData.amount];
      } else if (formData.groupOption === 'custom') {
        requiredFields = [formData.activityName, formData.payerName, formData.customSplit.length > 0];
      }
    }
    
    return requiredFields.filter(Boolean).length;
  }, [formData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 p-3 sm:p-4 relative overflow-hidden">
      <FloatingParticles />
      <Confetti />
      
      {/* Animated background elements - reduced size for mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-5 w-20 h-20 md:w-32 md:h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-24 h-24 md:w-48 md:h-48 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-10 w-20 h-20 md:w-40 md:h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mt-4 md:mt-8 border border-white/20">
          <div className="text-center mb-6 md:mb-8">
            <div className="bg-emerald-500/20 backdrop-blur-sm w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-30 animate-pulse"></div>
              <ChefCharacter />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Restaurant Payment Portal
            </h1>
            <p className="text-emerald-200 text-sm sm:text-lg">Let's process your payment! 🍽️</p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Payment Type Selection */}
            <div className="group">
              <label className="block text-sm font-medium text-emerald-200 mb-3">
                Payment Type
              </label>
              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('group')}
                  className={`py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                    formData.paymentType === 'group'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50'
                      : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                  }`}
                >
                  <Users className="mr-2" size={18} />
                  Group
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('individual')}
                  className={`py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                    formData.paymentType === 'individual'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50'
                      : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                  }`}
                >
                  <UserCheck className="mr-2" size={18} />
                  Individual
                </button>
              </div>
            </div>

            {/* Group Option Selection */}
            {formData.paymentType === 'group' && (
              <div className="group">
                <label className="block text-sm font-medium text-emerald-200 mb-3">
                  Split Option
                </label>
                <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => handleGroupOptionChange('equal')}
                    className={`py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                      formData.groupOption === 'equal'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50'
                        : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                    }`}
                  >
                    <Users className="mr-2" size={18} />
                    Split Equally
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGroupOptionChange('custom')}
                    className={`py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                      formData.groupOption === 'custom'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/50'
                        : 'bg-white/10 text-emerald-200 hover:bg-white/20'
                    }`}
                  >
                    <UserCheck className="mr-2" size={18} />
                    Split Individually
                  </button>
                </div>
              </div>
            )}

            {/* Equal Split Section */}
            {formData.paymentType === 'group' && formData.groupOption === 'equal' && (
              <>
                {/* Equal Split Amounts Display */}
                {formData.amount && friends.length > 0 && (
                  <div className="group">
                    <label className="block text-sm font-medium text-emerald-200 mb-3">
                      Equal Split Amounts
                    </label>
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                      {friends.map((friend, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20"
                        >
                          <div className="flex items-center">
                            <User className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                            <span className="text-emerald-200 text-sm sm:text-base">{friend.name}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-emerald-300 mr-2" />
                            <span className="text-emerald-300 font-bold">
                              ${formData.equalSplitAmounts?.[friend.name] || '0.00'}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-emerald-300/20">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-emerald-200">Total Amount:</span>
                          <span className="text-emerald-300 font-bold">
                            ${parseFloat(formData.amount || 0).toFixed(2)}
                          </span>
                        </div>
                        {friends.length > 0 && (
                          <div className="text-emerald-300 text-xs mt-1 text-center">
                            Each person pays: ${(parseFloat(formData.amount || 0) / friends.length).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Custom Split Section */}
            {formData.paymentType === 'group' && formData.groupOption === 'custom' && (
              <div className="group">
                <label className="block text-sm font-medium text-emerald-200 mb-3">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 animate-pulse" />
                  Split Individually - All Group Members
                </label>
                {loadingFriends ? (
                  <div className="flex items-center justify-center py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-emerald-400 mr-2"></div>
                    <span className="text-emerald-200 text-sm sm:text-base">Loading group members...</span>
                  </div>
                ) : (
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                    {formData.customSplit.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20"
                      >
                        <div className="flex items-center flex-1">
                          <User className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                          <span className="text-emerald-200 text-sm sm:text-base mr-3">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-emerald-300" />
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.amount || ''}
                            onChange={(e) => handleCustomSplitAmountChange(index, e.target.value)}
                            className="w-20 sm:w-24 px-2 py-1 bg-white/20 backdrop-blur-sm border border-emerald-300/30 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-transparent text-white text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* Total amount display */}
                    {formData.customSplit.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-emerald-300/20">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-emerald-200">Total Amount:</span>
                          <span className="text-emerald-300 font-bold">
                            ${customSplitTotal.toFixed(2)}
                          </span>
                        </div>
                        {customSplitTotal === 0 && (
                          <div className="text-amber-300 text-xs mt-1 text-center">
                            Enter amounts for all members
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Friends Selection with Amount Inputs (only for individual payments) */}
            {formData.paymentType === 'individual' && (
              <div className="group">
                <label className="block text-sm font-medium text-emerald-200 mb-3">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 animate-pulse" />
                  Select Friends & Enter Amounts
                </label>
                {loadingFriends ? (
                  <div className="flex items-center justify-center py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-emerald-400 mr-2"></div>
                    <span className="text-emerald-200 text-sm sm:text-base">Loading friends...</span>
                  </div>
                ) : friends.length > 0 ? (
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2 bg-white/10 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                    {friends.map((friend) => (
                      <div
                        key={friend.id}
                        className={`flex items-center justify-between p-2 sm:p-3 rounded-xl transition-all duration-300 ${
                          isFriendSelected(friend.name) 
                            ? 'bg-emerald-500/20 border border-emerald-400/30' 
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <label className="flex items-center flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isFriendSelected(friend.name)}
                            onChange={() => handleFriendSelection(friend.name)}
                            className="mr-2 sm:mr-3 w-4 h-4 text-emerald-500 bg-white/20 border-emerald-300 rounded focus:ring-emerald-400 focus:ring-2"
                          />
                          <span className="text-emerald-200 text-sm sm:text-base">{friend.name}</span>
                        </label>
                        
                        {isFriendSelected(friend.name) && (
                          <div className="flex items-center space-x-2 ml-2">
                            <DollarSign className="w-4 h-4 text-emerald-300" />
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={getFriendAmount(friend.name) || ''}
                              onChange={(e) => handleFriendAmountChange(friend.name, e.target.value)}
                              className="w-20 sm:w-24 px-2 py-1 bg-white/20 backdrop-blur-sm border border-emerald-300/30 rounded-lg focus:ring-1 focus:ring-emerald-400 focus:border-transparent text-white text-sm"
                              placeholder="0.00"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Total amount display */}
                    {formData.selectedFriends.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-emerald-300/20">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-emerald-200">Total Amount:</span>
                          <span className="text-emerald-300 font-bold">
                            ${individualTotal.toFixed(2)}
                          </span>
                        </div>
                        {individualTotal === 0 && (
                          <div className="text-amber-300 text-xs mt-1 text-center">
                            Enter amounts for selected friends
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <span className="text-emerald-200 text-sm sm:text-base">No friends found</span>
                  </div>
                )}
              </div>
            )}

            {/* Hotel Name Field */}
            <div className="group">
              <label htmlFor="activityName" className="block text-sm font-medium text-emerald-200 mb-3 transition-all duration-300 group-focus-within:text-emerald-100">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 animate-pulse" />
                Hotel Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="activityName"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-emerald-300/30 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-white placeholder-emerald-300 hover:bg-white/20 focus:bg-white/20 text-base sm:text-lg"
                  placeholder="Enter your hotel name..."
                  required
                />
                {formData.activityName && (
                  <CheckCircle className="absolute right-3 sm:right-4 top-3 sm:top-4 w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
                )}
              </div>
            </div>

            {/* Who Pays Field (ONLY for group mode - NOT for individual mode) */}
            {formData.paymentType === 'group' && (
              <div className="group">
                <label htmlFor="payerName" className="block text-sm font-medium text-emerald-200 mb-3 transition-all duration-300 group-focus-within:text-emerald-100">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 animate-pulse" />
                  Who's Paying?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="payerName"
                    name="payerName"
                    value={formData.payerName}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-emerald-300/30 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-white placeholder-emerald-300 hover:bg-white/20 focus:bg-white/20 text-base sm:text-lg"
                    placeholder="Enter payer name..."
                    required
                  />
                  {formData.payerName && (
                    <CheckCircle className="absolute right-3 sm:right-4 top-3 sm:top-4 w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {/* Amount Field (only for group equal split mode) */}
            {formData.paymentType === 'group' && formData.groupOption === 'equal' && (
              <div className="group">
                <label htmlFor="amount" className="block text-sm font-medium text-emerald-200 mb-3 transition-all duration-300 group-focus-within:text-emerald-100">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2 animate-pulse" />
                  Total Payment Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-emerald-300/30 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-white placeholder-emerald-300 hover:bg-white/20 focus:bg-white/20 text-base sm:text-lg"
                    placeholder="Enter total amount..."
                    min="0"
                    step="0.01"
                    required
                  />
                  {formData.amount && (
                    <CheckCircle className="absolute right-3 sm:right-4 top-3 sm:top-4 w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 animate-pulse" />
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 sm:py-4 px-6 sm:px-8 rounded-2xl font-bold text-base sm:text-lg shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 transform hover:scale-105 active:scale-95 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/50'
                  : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                  <span className="text-sm sm:text-base">Processing Magic...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">Submit Payment Record</span>
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
          {message && !friendError && (
            <div className="mt-6 mb-4 md:mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 sm:p-5 rounded-xl shadow-xl animate-transport-arrival">
              <div className="flex items-center">
                <Check className="mr-2 sm:mr-3 animate-transport-delivered" size={20} />
                <span className="font-semibold text-sm sm:text-lg">{message}</span>
              </div>
            </div>
          )}

          {friendError && (
            <div className="mt-6 mb-4 md:mb-8 bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 sm:p-5 rounded-xl shadow-xl animate-transport-arrival">
              <div className="flex items-center">
                <XCircle className="mr-2 sm:mr-3 animate-shake" size={20} />
                <span className="font-semibold text-sm sm:text-lg">{friendError}</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
          {[0, 1, 2].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-500 ${
                step < progressSteps ? 'bg-emerald-400 scale-110' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}