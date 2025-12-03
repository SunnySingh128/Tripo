import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Check,
  Hotel,
  User,
  DollarSign,
  Code,
  Terminal,
  Coffee,
  Wifi,
  Bed,
  MapPin,
  Users,
  UserCheck,
  XCircle
} from 'lucide-react';

const api = import.meta.env.VITE_AP1_URL

const HotelPaymentForm = () => {
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

  // Fetch friends from backend
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

  // Calculate total amount from selectedFriends or customSplit
  const calculateTotalAmount = useCallback(() => {
    if (formData.paymentType === 'individual') {
      return formData.selectedFriends.reduce((total, friend) => total + (Number(friend.amount) || 0), 0);
    } else if (formData.paymentType === 'group' && formData.groupOption === 'custom') {
      return formData.customSplit.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    }
    return Number(formData.amount) || 0;
  }, [formData]);

  // Update amount when individual/custom amounts change
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
    if (formData.paymentType === 'individual' || (formData.paymentType === 'group' && formData.groupOption === 'custom')) {
      fetchFriendsFromBackend();
    }
  }, [formData.paymentType, formData.groupOption, fetchFriendsFromBackend]);

  // Generic field change
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
  }, []);

  // Toggle friend selection with default amount 0
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

  // Update individual friend amount (friendName, amount string)
  const handleFriendAmountChange = useCallback((friendName, amount) => {
    setFormData(prev => ({
      ...prev,
      selectedFriends: prev.selectedFriends.map(friend =>
        friend.name === friendName ? { ...friend, amount: Number(amount) || 0 } : friend
      )
    }));
  }, []);

  // Custom split amount change
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

  // Proper async validation
  const validateForm = useCallback(async () => {
    setFriendError('');
    setMessage('');

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

  const handleSubmit = useCallback(async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setMessage('');
    setFriendError('');

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
        setMessage('Payment record saved successfully!');
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
        setTimeout(() => setMessage(''), 3000);
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

  // isFormValid computed for button
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-4 sm:top-20 sm:left-10 text-green-400 opacity-20">
          <Code size={24} />
        </div>
        <div className="absolute top-20 right-6 sm:top-40 sm:right-20 text-amber-400 opacity-20">
          <Terminal size={20} />
        </div>
        <div className="absolute bottom-20 left-6 sm:bottom-32 sm:left-20 text-green-500 opacity-20">
          <Coffee size={28} />
        </div>
        <div className="absolute bottom-10 right-4 sm:bottom-20 sm:right-10 text-yellow-400 opacity-20">
          <Code size={18} />
        </div>
      </div>

      <div className="absolute top-6 right-10 sm:top-10 sm:right-40 text-blue-400 opacity-30 animate-hotel-float">
        <Hotel size={18} />
      </div>
      <div className="absolute bottom-20 left-10 sm:bottom-40 sm:left-40 text-purple-400 opacity-30 animate-hotel-sway">
        <Bed size={20} />
      </div>
      <div className="absolute top-1/2 left-4 sm:top-1/2 sm:left-10 text-indigo-400 opacity-30 animate-hotel-bounce">
        <MapPin size={16} />
      </div>
      <div className="absolute top-1/4 right-6 sm:top-1/3 sm:right-20 text-cyan-400 opacity-30 animate-hotel-pulse">
        <Wifi size={18} />
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-amber-500 rounded-full mb-3 sm:mb-4 shadow-lg animate-hotel-welcome">
            <Hotel className="text-white" size={20} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 bg-gradient-to-r from-green-400 to-amber-400 bg-clip-text text-transparent">
            Hotel Payment
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">Development Environment v1.0</p>
        </div>

        {message && !friendError && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 sm:p-5 rounded-xl shadow-xl animate-hotel-checkin">
            <div className="flex items-center">
              <Check className="mr-2 sm:mr-3 animate-hotel-checkmark" size={20} />
              <span className="font-semibold text-base sm:text-lg">{message}</span>
            </div>
          </div>
        )}

        {friendError && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-red-500 to-rose-500 text-white p-4 sm:p-5 rounded-xl shadow-xl animate-hotel-checkin">
            <div className="flex items-center">
              <XCircle className="mr-2 sm:mr-3 animate-hotel-error" size={20} />
              <span className="font-semibold text-base sm:text-lg">{friendError}</span>
            </div>
          </div>
        )}

        <div className="bg-gray-800/90 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-green-500/30 animate-slide-up">
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Type */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-200 mb-3">Payment Type</label>
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
                  <Users className="mr-2" size={16} />
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
                  <UserCheck className="mr-2" size={16} />
                  <span className="text-sm sm:text-base">Individual</span>
                </button>
              </div>
            </div>

            {/* Group Option */}
            {formData.paymentType === 'group' && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-200 mb-3">Split Option</label>
                <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => handleGroupOptionChange('equal')}
                    className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                      formData.groupOption === 'equal'
                        ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80'
                    }`}
                  >
                    <Users className="mr-2" size={16} />
                    <span className="text-sm sm:text-base">Split Equally</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGroupOptionChange('custom')}
                    className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
                      formData.groupOption === 'custom'
                        ? 'bg-gradient-to-r from-green-600 to-amber-600 text-white shadow-lg'
                        : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600/80'
                    }`}
                  >
                    <UserCheck className="mr-2" size={16} />
                    <span className="text-sm sm:text-base">Split Individually</span>
                  </button>
                </div>
              </div>
            )}

            {/* Equal Split Display */}
            {formData.paymentType === 'group' &&
              formData.groupOption === 'equal' &&
              formData.amount &&
              friends.length > 0 && (
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Equal Split Amounts</label>
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2 bg-gray-700/50 rounded-lg p-2 sm:p-3">
                    {friends.map((friend, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-green-600/10 border border-green-400/20"
                      >
                        <div className="flex items-center">
                          <User className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                          <span className="text-gray-200 text-sm sm:text-base">{friend.name}</span>
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
                        <span className="text-gray-200">Total Amount:</span>
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

            {/* Custom Split */}
            {formData.paymentType === 'group' && formData.groupOption === 'custom' && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  <UserCheck className="inline mr-2" size={14} />
                  Split Individually - All Group Members
                </label>

                {loadingFriends ? (
                  <div className="flex items-center justify-center py-3 sm:py-4">
                    <div className="animate-hotel-loading rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-green-400 mr-2" />
                    <span className="text-gray-300 text-sm sm:text-base">Loading group members...</span>
                  </div>
                ) : (
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2 bg-gray-700/50 rounded-lg p-2 sm:p-3">
                    {formData.customSplit.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-green-600/10 border border-green-400/20"
                      >
                        <div className="flex items-center flex-1">
                          <User className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                          <span className="text-gray-200 text-sm sm:text-base mr-3">{item.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-300" />
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={item.amount ?? ''}
                            onChange={e => handleCustomSplitAmountChange(index, e.target.value)}
                            className="w-20 sm:w-24 px-2 py-1 bg-gray-700/80 border border-green-500/50 rounded-lg focus:ring-1 focus:ring-green-400 text-white text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    ))}

                    {formData.customSplit.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-500/30">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-200">Total Amount:</span>
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

            {/* Individual Mode: select friends & enter amounts */}
            {formData.paymentType === 'individual' && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  <UserCheck className="inline mr-2" size={14} />
                  Select Friends & Enter Amounts
                </label>

                {loadingFriends ? (
                  <div className="flex items-center justify-center py-3 sm:py-4">
                    <div className="animate-hotel-loading rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-green-400 mr-2" />
                    <span className="text-gray-300 text-sm sm:text-base">Loading friends...</span>
                  </div>
                ) : friends.length > 0 ? (
                  <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-2 bg-gray-700/50 rounded-lg p-2 sm:p-3">
                    {friends.map(friend => (
                      <div
                        key={friend.id}
                        className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                          isFriendSelected(friend.name) ? 'bg-green-600/20 border border-green-400/30' : 'hover:bg-gray-600/50'
                        }`}
                      >
                        <label className="flex items-center flex-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isFriendSelected(friend.name)}
                            onChange={() => handleFriendSelection(friend.name)}
                            className="mr-2 sm:mr-3 w-4 h-4 text-green-500 bg-gray-600 border-gray-500 rounded focus:ring-green-400 focus:ring-2"
                          />
                          <span className="text-gray-200 text-sm sm:text-base">{friend.name}</span>
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
                              className="w-20 sm:w-24 px-2 py-1 bg-gray-700/80 border border-green-500/50 rounded-lg focus:ring"
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Total for individual */}
                    {formData.selectedFriends.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-500/30">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-200">Total Amount:</span>
                          <span className="text-green-400 font-bold">${individualTotal.toFixed(2)}</span>
                        </div>
                        {individualTotal === 0 && (
                          <div className="text-amber-300 text-xs mt-1 text-center">Enter amounts for selected friends</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-3 sm:py-4 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300 text-sm sm:text-base">No friends found</span>
                  </div>
                )}
              </div>
            )}

            {/* Hotel Name Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                <Hotel className="inline mr-2" size={14} />
                Hotel Name
              </label>
              <input
                type="text"
                name="activityName"
                value={formData.activityName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-green-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                placeholder="Enter hotel name"
              />
            </div>

            {/* Payer Name Field */}
            {formData.paymentType === 'group' && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  <User className="inline mr-2" size={14} />
                  Payer Name
                </label>
                <input
                  type="text"
                  name="payerName"
                  value={formData.payerName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-green-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter payer name"
                />
              </div>
            )}

            {/* Amount Field for equal split */}
            {formData.paymentType === 'group' && formData.groupOption === 'equal' && (
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  <DollarSign className="inline mr-2" size={14} />
                  Total Payment Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700/80 border border-green-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  placeholder="Enter amount"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-3 px-4 sm:px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-green-600 to-amber-600 hover:from-green-700 hover:to-amber-700 shadow-lg hover:shadow-xl animate-hotel-booking'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-hotel-loading rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2" />
                  <span className="text-sm sm:text-base">Processing...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">Submit Record</span>
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8 text-gray-400">
          <p className="text-xs sm:text-sm">Development Environment | Terminal Active</p>
        </div>
      </div>

      <style>{`
        @keyframes hotel-float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);} }
        @keyframes hotel-sway  { 0%,100%{transform:translateX(0);}50%{transform:translateX(8px);} }
        @keyframes hotel-bounce{ 0%,100%{transform:translateY(0);}50%{transform:translateY(-15px);} }
        @keyframes hotel-pulse { 0%,100%{opacity:0.3;}50%{opacity:0.7;} }
        @keyframes hotel-welcome{ 0%{transform:scale(1);}50%{transform:scale(1.1);}100%{transform:scale(1);} }
        @keyframes hotel-checkin{ 0%{transform:translateX(-100px);opacity:0;}100%{transform:translateX(0);opacity:1;} }
        @keyframes hotel-checkmark{ 0%{transform:scale(0);}50%{transform:scale(1.3);}100%{transform:scale(1);} }
        @keyframes hotel-error{ 0%,100%{transform:translateX(0);}25%{transform:translateX(-3px);}75%{transform:translateX(3px);} }
        @keyframes hotel-booking{ 0%{transform:translateY(0);}100%{transform:translateY(-2px);} }
        @keyframes hotel-loading{ 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
        @keyframes fade-in{ from{opacity:0;transform:translateY(-20px);} to{opacity:1;transform:translateY(0);} }
        @keyframes slide-up{ from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        .animate-hotel-float{ animation: hotel-float 3s ease-in-out infinite; }
        .animate-hotel-sway{ animation: hotel-sway 4s ease-in-out infinite; }
        .animate-hotel-bounce{ animation: hotel-bounce 2.5s ease-in-out infinite; }
        .animate-hotel-pulse{ animation: hotel-pulse 2s ease-in-out infinite; }
        .animate-hotel-welcome{ animation: hotel-welcome 2s ease-in-out infinite; }
        .animate-hotel-checkin{ animation: hotel-checkin 0.8s ease-out; }
        .animate-hotel-checkmark{ animation: hotel-checkmark 0.6s ease-out; }
        .animate-hotel-error{ animation: hotel-error 0.5s ease-in-out; }
        .animate-hotel-booking{ animation: hotel-booking 0.3s ease-out; }
        .animate-hotel-loading{ animation: hotel-loading 1s linear infinite; }
        .animate-fade-in{ animation: fade-in 0.8s ease-out; }
        .animate-slide-up{ animation: slide-up 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default HotelPaymentForm;
