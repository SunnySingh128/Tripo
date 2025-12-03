import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CheckCircle, Users, User, DollarSign, Activity, XCircle, Check,
  UserCheck, Hotel, Bed, MapPin, Wifi, Code, Terminal, Coffee
} from 'lucide-react';

const api = import.meta.env.VITE_AP1_URL;

const HotelPaymentForm = () => {
  // Environment detection
  const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  
  // State for background image
  const [backgroundImage, setBackgroundImage] = useState('');
  
  // Main form state - EXACTLY from first code
  const [formData, setFormData] = useState({
    paymentType: 'group',
    groupOption: 'equal', // 'equal' or 'custom'
    activityName: '',
    payerName: '',
    amount: '',
    selectedFriends: [], // For individual mode: [{name, amount}]
    equalSplitAmounts: {}, // For equal split mode
    customSplit: [] // For custom split mode: [{name, amount}]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendError, setFriendError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // EXACT colorScheme from your second code
  const colorScheme = isDevelopment ? {
    // Development Environment - Orange/Red theme
    background: 'from-green-900/80 via-red-900/80 to-pink-900/80',
    headerBg: 'bg-green-900/50',
    headerBorder: 'border-green-400/30',
    headerIcon: 'text-green-400',
    headerText: 'text-green-200',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-400/40',
    successIcon: 'text-green-400',
    successText: 'text-green-100',
    formBg: 'bg-gray-800/70',
    formBorder: 'border-orange-400/20',
    labelColor: 'text-orange-200',
    inputBg: 'bg-gray-900/70',
    inputBorder: 'border-green-400/30',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-orange-300',
    inputFocus: 'focus:ring-green-500/50 focus:border-green-400/50',
    iconColor: 'text-orange-300',
    toggleBg: 'bg-gray-900/70',
    toggleBorder: 'border-orange-400/30',
    toggleActive: 'bg-orange-500 shadow-orange-500/25',
    toggleInactive: 'text-green-200 hover:text-white hover:bg-green-800/50',
    checkboxBg: 'bg-gray-900/70',
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
    background: 'from-green-900/80 via-teal-900/80 to-blue-900/80',
    headerBg: 'bg-green-900/50',
    headerBorder: 'border-green-400/30',
    headerIcon: 'text-green-400',
    headerText: 'text-green-200',
    successBg: 'bg-green-500/20',
    successBorder: 'border-green-400/40',
    successIcon: 'text-green-400',
    successText: 'text-green-100',
    formBg: 'bg-gray-800/70',
    formBorder: 'border-green-400/20',
    labelColor: 'text-green-200',
    inputBg: 'bg-gray-900/70',
    inputBorder: 'border-green-400/30',
    inputText: 'text-white',
    inputPlaceholder: 'placeholder-green-300',
    inputFocus: 'focus:ring-green-500/50 focus:border-green-400/50',
    iconColor: 'text-green-300',
    toggleBg: 'bg-gray-900/70',
    toggleBorder: 'border-green-400/30',
    toggleActive: 'bg-green-500 shadow-green-500/25',
    toggleInactive: 'text-green-200 hover:text-white hover:bg-green-800/50',
    checkboxBg: 'bg-gray-900/70',
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

  // Fetch background image from Unsplash - EXACTLY from second code
  const fetchBackgroundImage = useCallback(async () => {
    try {
      const storedCategory = localStorage.getItem("name");
      let query = 'hotel travel'; // Changed to hotel travel theme
      
      if (storedCategory) {
        const category = JSON.parse(storedCategory);
        query = category || 'hotel travel';
      }

      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=ZiVa2ewSMubmSb6mDza20vOTcjPUnaci25V7QwXc-PE`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const imageUrl = data.results[randomIndex].urls.full;
          setBackgroundImage(imageUrl);
        }
      } else {
        console.error('Failed to fetch background image');
      }
    } catch (error) {
      console.error('Error fetching background image:', error);
    }
  }, []);

  // Fetch friends from backend - EXACTLY from first code
  const fetchFriendsFromBackend = useCallback(async () => {
    setLoadingFriends(true);
    setFriendError('');

    try {
      const groupName = localStorage.getItem('groupName');
      if (!groupName) {
        setFriendError('Group name not found in storage');
        setFriends([]);
        setLoadingFriends(false);
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

        // if currently in custom group mode and customSplit empty -> initialize
        setFormData(prev => {
          if (prev.paymentType === 'group' && prev.groupOption === 'custom') {
            // Only initialize if not already initialized
            if (!prev.customSplit || prev.customSplit.length === 0) {
              return {
                ...prev,
                customSplit: formattedMembers.map(f => ({ name: f.name, amount: 0 }))
              };
            }
          }
          return prev;
        });
      } else {
        console.error('Failed to fetch group members');
        setFriendError('Failed to load friends');
        setFriends([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFriendError('Unable to load friends. Please try again.');
      setFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  }, []);

  // Calculate total amount from selectedFriends or customSplit - EXACTLY from first code
  const calculateTotalAmount = useCallback(() => {
    if (formData.paymentType === 'individual') {
      return formData.selectedFriends.reduce((total, friend) => total + (Number(friend.amount) || 0), 0);
    } else if (formData.paymentType === 'group' && formData.groupOption === 'custom') {
      return formData.customSplit.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    }
    return Number(formData.amount) || 0;
  }, [formData]);

  // Update amount when individual/custom amounts change - EXACTLY from first code
  useEffect(() => {
    if (
      formData.paymentType === 'individual' ||
      (formData.paymentType === 'group' && formData.groupOption === 'custom')
    ) {
      const totalAmount = calculateTotalAmount();
      setFormData(prev => ({
        ...prev,
        amount: totalAmount > 0 ? totalAmount.toFixed(2) : ''
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.selectedFriends, formData.customSplit, formData.paymentType, formData.groupOption, calculateTotalAmount]);

  // Calculate equal split amounts when total amount changes - EXACTLY from first code
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

  // Fetch friends when needed and fetch background image
  useEffect(() => {
    if (formData.paymentType === 'individual' || (formData.paymentType === 'group' && formData.groupOption === 'custom')) {
      fetchFriendsFromBackend();
    }
    fetchBackgroundImage();
  }, [formData.paymentType, formData.groupOption, fetchFriendsFromBackend, fetchBackgroundImage]);

  // Generic field change - EXACTLY from first code
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
      payerName: type === 'group' ? prev.payerName : '',
      amount: '',
      selectedFriends: [],
      customSplit: [],
      equalSplitAmounts: {}
    }));
    setFriendError('');
    setMessage('');
    setShowSuccess(false);
  }, []);

  const handleGroupOptionChange = useCallback((option) => {
    setFormData(prev => ({
      ...prev,
      groupOption: option,
      amount: option === 'equal' ? '' : prev.amount,
      customSplit: option === 'custom' ? (prev.customSplit.length > 0 ? prev.customSplit : []) : [],
      equalSplitAmounts: option === 'equal' ? prev.equalSplitAmounts : {}
    }));
    setFriendError('');
    setMessage('');
    setShowSuccess(false);
  }, []);

  // Toggle friend selection with default amount 0 - EXACTLY from first code
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
          selectedFriends: [...prev.selectedFriends, { name: friendName, amount: 0 }]
        };
      }
    });
  }, []);

  // Update individual friend amount (friendName, amount string) - EXACTLY from first code
  const handleFriendAmountChange = useCallback((friendName, amount) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.map(friend =>
        friend.name === friendName ? { ...friend, amount: Number(amount) || 0 } : friend
      )
    }));
  }, []);

  // Custom split amount change - EXACTLY from first code
  const handleCustomSplitAmountChange = useCallback((index, amount) => {
    setFormData(prev => {
      const updatedCustomSplit = [...prev.customSplit];
      updatedCustomSplit[index] = {
        ...updatedCustomSplit[index],
        amount: Number(amount) || 0
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
    return friend ? friend.amount : '';
  }, [formData.selectedFriends]);

  // Proper async validation - EXACTLY from first code
  const validateForm = useCallback(async () => {
    setFriendError('');
    setMessage('');
    setShowSuccess(false);

    const { paymentType, groupOption, activityName, payerName, amount, selectedFriends, customSplit } = formData;

    if (!activityName?.trim()) {
      setFriendError('Hotel name is required');
      return false;
    }

    if (paymentType === 'individual') {
      if (selectedFriends.length === 0) {
        setFriendError('Please select at least one friend');
        return false;
      }

      const invalidAmounts = selectedFriends.some(friend => !friend.amount || friend.amount <= 0);
      if (invalidAmounts) {
        setFriendError('All selected friends must have a valid positive amount');
        return false;
      }
      return true;
    }

    if (paymentType === 'group') {
      if (!payerName?.trim()) {
        setFriendError('Payer name is required');
        return false;
      }

      const groupName = localStorage.getItem('groupName');
      if (!groupName) {
        setFriendError('Group name not found');
        return false;
      }

      // Verify payer exists
      try {
        const response = await fetch(`${api}/api/checkFriend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payerName: payerName.trim(), groupName })
        });

        const data = await response.json();
        if (!data.success) {
          setFriendError(data.message || 'Payer verification failed');
          return false;
        }
      } catch (error) {
        console.error('Validation error:', error);
        setFriendError('Unable to verify payer. Try again later.');
        return false;
      }

      if (groupOption === 'equal') {
        if (!amount || parseFloat(amount) <= 0) {
          setFriendError('Valid amount is required for equal split');
          return false;
        }
        return true;
      }

      if (groupOption === 'custom') {
        if (!customSplit || customSplit.length === 0) {
          setFriendError('No group members found');
          return false;
        }
        const invalid = customSplit.some(item => !item.amount || item.amount <= 0);
        if (invalid) {
          setFriendError('All members must have a valid positive amount');
          return false;
        }
        const totalAmount = customSplit.reduce((sum, item) => sum + item.amount, 0);
        if (totalAmount <= 0) {
          setFriendError('Total amount must be greater than 0');
          return false;
        }
        return true;
      }
    }

    return false;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setMessage('');
    setFriendError('');
    setShowSuccess(false);

    try {
      const groupName = localStorage.getItem('groupName');

      const requestData = {
        ...formData,
        groupName,
        totalAmount: calculateTotalAmount()
      };

      const response = await fetch(`${api}/api/amount`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        setMessage('Hotel payment record saved successfully!');
        setShowSuccess(true);
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
        setTimeout(() => {
          setMessage('');
          setShowSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setFriendError(errorData.message || 'Error saving payment record. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setFriendError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, calculateTotalAmount]);

  // isFormValid computed for button - EXACTLY from first code
  const isFormValid = useMemo(() => {
    const { paymentType, groupOption, activityName, payerName, amount, selectedFriends, customSplit } = formData;

    if (!activityName) return false;

    if (paymentType === 'individual') {
      return selectedFriends.length > 0 && selectedFriends.every(friend => friend.amount > 0);
    }

    if (paymentType === 'group') {
      if (!payerName) return false;
      if (groupOption === 'equal') {
        return !!amount && parseFloat(amount) > 0;
      }
      if (groupOption === 'custom') {
        return customSplit.length > 0 && customSplit.every(item => item.amount > 0);
      }
    }

    return false;
  }, [formData]);

  const individualTotal = useMemo(() => {
    return formData.selectedFriends.reduce((total, friend) => total + (Number(friend.amount) || 0), 0);
  }, [formData.selectedFriends]);

  const customSplitTotal = useMemo(() => {
    return formData.customSplit.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  }, [formData.customSplit]);

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* EXACTLY same overlay from second code */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.background}`}></div>
      
      <div className="relative z-10 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header - EXACTLY same structure from second code */}
          <div className="text-center mb-8 pt-8">
            <div className={`inline-flex items-center gap-3 ${colorScheme.headerBg} backdrop-blur-sm px-6 py-3 rounded-full border ${colorScheme.headerBorder}`}>
              <Hotel className={`w-6 h-6 ${colorScheme.headerIcon}`} />
              <h1 className="text-2xl font-bold text-white">Hotel Payment Tracker</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${isDevelopment ? 'bg-orange-500/20 text-orange-200' : 'bg-green-500/20 text-green-200'}`}>
                {colorScheme.envLabel}
              </span>
            </div>
            <p className={`${colorScheme.headerText} mt-4`}>Track your hotel expenses with style</p>
          </div>

          {/* Success/Error Messages - EXACTLY same structure from second code */}
          {message && showSuccess && !friendError && (
            <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-xl shadow-xl">
              <div className="flex items-center">
                <Check className="mr-3" size={24} />
                <span className="font-semibold text-lg">{message}</span>
              </div>
            </div>
          )}

          {friendError && !showSuccess && (
            <div className="mb-8 bg-gradient-to-r from-red-500 to-rose-500 text-white p-5 rounded-xl shadow-xl">
              <div className="flex items-center">
                <XCircle className="mr-3" size={24} />
                <span className="font-semibold text-lg">{friendError}</span>
              </div>
            </div>
          )}

          {/* Main Form - Using EXACTLY same structure from second code */}
          <div className={`${colorScheme.formBg} backdrop-blur-sm rounded-xl p-6 border ${colorScheme.formBorder} shadow-2xl`}>
            <div className="space-y-6">
              {/* Payment Type - Using second code's toggle structure */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-3`}>
                  Payment Type
                </label>
                <div className={`flex gap-1 ${colorScheme.toggleBg} p-1 rounded-lg border ${colorScheme.toggleBorder} backdrop-blur-sm`}>
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('group')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                      formData.paymentType === 'group'
                        ? colorScheme.toggleActive
                        : colorScheme.toggleInactive
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Group
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePaymentTypeChange('individual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                      formData.paymentType === 'individual'
                        ? colorScheme.toggleActive
                        : colorScheme.toggleInactive
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    Individual
                  </button>
                </div>
              </div>

              {/* Group Option - Using second code's toggle structure */}
              {formData.paymentType === 'group' && (
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-3`}>
                    Split Option
                  </label>
                  <div className={`flex gap-1 ${colorScheme.toggleBg} p-1 rounded-lg border ${colorScheme.toggleBorder} backdrop-blur-sm`}>
                    <button
                      type="button"
                      onClick={() => handleGroupOptionChange('equal')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                        formData.groupOption === 'equal'
                          ? colorScheme.toggleActive
                          : colorScheme.toggleInactive
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      Split Equally
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGroupOptionChange('custom')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                        formData.groupOption === 'custom'
                          ? colorScheme.toggleActive
                          : colorScheme.toggleInactive
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      Split Individually
                    </button>
                  </div>
                </div>
              )}

              {/* Equal Split Display - Styled to match second code */}
              {formData.paymentType === 'group' &&
                formData.groupOption === 'equal' &&
                formData.amount &&
                friends.length > 0 && (
                  <div className="mb-6">
                    <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-3`}>
                      Equal Split Amounts
                    </label>
                    <div className={`max-h-64 overflow-y-auto space-y-2 ${colorScheme.checkboxBg} rounded-lg p-3 border ${colorScheme.checkboxBorder}`}>
                      {friends.map((friend, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            colorScheme.checkboxActive
                          }`}
                        >
                          <div className="flex items-center">
                            <User className="mr-3 w-5 h-5 text-green-300" />
                            <span className="text-green-100">{friend.name}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-300 mr-2" />
                            <span className="text-green-400 font-bold">
                              ${formData.equalSplitAmounts?.[friend.name] || '0.00'}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-green-500/30">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-100">Total Amount:</span>
                          <span className="text-green-400 font-bold">${parseFloat(formData.amount || 0).toFixed(2)}</span>
                        </div>
                        {friends.length > 0 && (
                          <div className="text-green-300 text-xs mt-1 text-center">
                            Each person pays: ${(parseFloat(formData.amount || 0) / friends.length).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* Custom Split - Styled to match second code */}
              {formData.paymentType === 'group' && formData.groupOption === 'custom' && (
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-3`}>
                    Split Individually - All Group Members
                  </label>

                  {loadingFriends ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mr-2" />
                      <span className="text-orange-200">Loading group members...</span>
                    </div>
                  ) : (
                    <div className={`max-h-64 overflow-y-auto space-y-2 ${colorScheme.checkboxBg} rounded-lg p-3 border ${colorScheme.checkboxBorder}`}>
                      {formData.customSplit.map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            colorScheme.checkboxActive
                          }`}
                        >
                          <div className="flex items-center flex-1">
                            <User className="mr-3 w-5 h-5 text-green-300" />
                            <span className="text-green-100 mr-3">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-green-300" />
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.amount ?? ''}
                              onChange={e => handleCustomSplitAmountChange(index, e.target.value)}
                              className={`w-24 px-2 py-1 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg focus:outline-none focus:ring-2 ${colorScheme.inputFocus} text-white text-sm`}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      ))}

                      {formData.customSplit.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-green-500/30">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-green-100">Total Amount:</span>
                            <span className="text-green-400 font-bold">${customSplitTotal.toFixed(2)}</span>
                          </div>
                          {customSplitTotal === 0 && (
                            <div className="text-amber-300 text-xs mt-1 text-center">Enter amounts for all members</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Individual Mode - Using second code's checkbox structure */}
              {formData.paymentType === 'individual' && (
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-3`}>
                    Select Friends & Enter Amounts
                  </label>

                  {loadingFriends ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mr-2" />
                      <span className="text-orange-200">Loading friends...</span>
                    </div>
                  ) : friends.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      <div className={`grid grid-cols-2 gap-2 ${colorScheme.checkboxBg} p-3 rounded-lg border ${colorScheme.checkboxBorder}`}>
                        {friends.map(friend => (
                          <div
                            key={friend.id}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                              isFriendSelected(friend.name)
                                ? colorScheme.checkboxActive
                                : `${colorScheme.checkboxBg} border ${colorScheme.checkboxBorder} ${colorScheme.labelColor} ${colorScheme.checkboxHover}`
                            }`}
                          >
                            <label className="flex items-center flex-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isFriendSelected(friend.name)}
                                onChange={() => handleFriendSelection(friend.name)}
                                className={`w-4 h-4 ${colorScheme.checkboxInput} rounded focus:ring-2 mr-3`}
                              />
                              <span className="text-sm">{friend.name}</span>
                            </label>

                            {isFriendSelected(friend.name) && (
                              <div className="flex items-center space-x-2 ml-2">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <input
                                  type="number"
                                  min="0.01"
                                  step="0.01"
                                  value={getFriendAmount(friend.name) ?? ''}
                                  onChange={e => handleFriendAmountChange(friend.name, e.target.value)}
                                  className={`w-20 px-2 py-1 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg focus:outline-none focus:ring-2 ${colorScheme.inputFocus} text-white text-sm`}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Total for individual */}
                      {formData.selectedFriends.length > 0 && (
                        <div className={`p-3 rounded-lg border ${colorScheme.successBorder} ${colorScheme.successBg}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-green-100">Total Amount:</span>
                            <span className="text-green-400 font-bold">${individualTotal.toFixed(2)}</span>
                          </div>
                          {individualTotal === 0 && (
                            <div className="text-amber-300 text-xs mt-1 text-center">Enter amounts for selected friends</div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`text-center py-4 ${colorScheme.checkboxBg} rounded-lg border ${colorScheme.checkboxBorder}`}>
                      <span className="text-orange-200">No friends found</span>
                    </div>
                  )}
                </div>
              )}

              {/* Hotel Name Field - EXACTLY same structure from second code */}
              <div className="mb-6">
                <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-2`}>
                  Hotel Name
                </label>
                <input
                  type="text"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg ${colorScheme.inputText} ${colorScheme.inputPlaceholder} focus:outline-none focus:ring-2 ${colorScheme.inputFocus} transition-all duration-200 backdrop-blur-sm`}
                  placeholder="Enter hotel name"
                />
              </div>

              {/* Payer Name Field - EXACTLY same structure from second code */}
              {formData.paymentType === 'group' && (
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-2`}>
                    Payer Name
                  </label>
                  <input
                    type="text"
                    name="payerName"
                    value={formData.payerName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg ${colorScheme.inputText} ${colorScheme.inputPlaceholder} focus:outline-none focus:ring-2 ${colorScheme.inputFocus} transition-all duration-200 backdrop-blur-sm`}
                    placeholder="Enter payer name"
                  />
                </div>
              )}

              {/* Amount Field for equal split - EXACTLY same structure from second code */}
              {formData.paymentType === 'group' && formData.groupOption === 'equal' && (
                <div className="mb-6">
                  <label className={`block text-sm font-medium ${colorScheme.labelColor} mb-2`}>
                    Total Payment Amount
                  </label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-3 w-5 h-5 ${colorScheme.iconColor}`} />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 ${colorScheme.inputBg} border ${colorScheme.inputBorder} rounded-lg ${colorScheme.inputText} ${colorScheme.inputPlaceholder} focus:outline-none focus:ring-2 ${colorScheme.inputFocus} transition-all duration-200 backdrop-blur-sm`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button - EXACTLY same structure from second code */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`w-full bg-gradient-to-r ${colorScheme.buttonBg} text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 ${colorScheme.buttonFocus} shadow-lg ${colorScheme.buttonShadow} ${
                  !isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>Submit Hotel Payment</span>
                )}
              </button>
            </div>
          </div>

          {/* Footer - EXACTLY same structure from second code */}
          <div className="text-center mt-8">
            <p className={`${colorScheme.footerText} text-sm`}>{colorScheme.envLabel} Environment | Hotel Payment System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelPaymentForm;