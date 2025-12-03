import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, Check, CreditCard } from 'lucide-react';
const api = import.meta.env.VITE_AP1_URL
export default function TripExpenseDashboard() {
  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payingTransactions, setPayingTransactions] = useState({}); // Track paying transactions
  const [paidTransactions, setPaidTransactions] = useState({}); // Track paid transactions

  useEffect(() => {
    fetchTripData();
    // Load paid transactions from localStorage
    const savedPaid = localStorage.getItem('paidTransactions');
    if (savedPaid) {
      setPaidTransactions(JSON.parse(savedPaid));
    }
  }, []);

  // Save paid transactions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('paidTransactions', JSON.stringify(paidTransactions));
  }, [paidTransactions]);

  // Function to calculate total owed from givesTo array
  const calculateTotalOwed = (givesToArray) => {
    if (!givesToArray || givesToArray.length === 0) return 0;
    return givesToArray.reduce((total, transaction) => total + Number(transaction.amount), 0);
  };

  const fetchTripData = async () => {
    try {
      setLoading(true);
      
      const storedGroup = localStorage.getItem("groupName");
      if (!storedGroup) throw new Error("Group name not found in localStorage");

      const response = await fetch(
        `${api}/api/summary?groupName=${encodeURIComponent(storedGroup)}`
      );

      if (!response.ok) throw new Error("Failed to fetch trip data");

      const data = await response.json();

      // Calculate total owed for each member from givesTo array
      const membersWithCalculatedOwed = data.members.map(member => ({
        ...member,
        // Calculate totalOwed from givesTo if not already provided by API
        totalOwed: member.totalOwed || calculateTotalOwed(member.givesTo)
      }));

      setMembers(membersWithCalculatedOwed);
      setGroupName(data.groupName);
      setTotalBudget(data.totalTripBudget);

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toFixed(2)}`;
  };

  // Function to calculate total givesTo amount for display
  const getTotalGivesTo = (givesToArray) => {
    return calculateTotalOwed(givesToArray);
  };

  // Function to calculate total getsFrom amount for display
  const getTotalGetsFrom = (getsFromArray) => {
    if (!getsFromArray || getsFromArray.length === 0) return 0;
    return getsFromArray.reduce((total, transaction) => total + Number(transaction.amount), 0);
  };

  // Function to generate a unique transaction ID
  const getTransactionId = (memberName, friendName, activityName, amount) => {
    return `${memberName}_${friendName}_${activityName}_${amount}`.replace(/\s+/g, '_');
  };

  // Check if a transaction is marked as paid
  const isTransactionPaid = (memberName, friendName, activityName, amount) => {
    const transactionId = getTransactionId(memberName, friendName, activityName, amount);
    return paidTransactions[transactionId] === true;
  };

  // Check if a transaction is being paid
  const isTransactionPaying = (memberName, friendName, activityName, amount) => {
    const transactionId = getTransactionId(memberName, friendName, activityName, amount);
    return payingTransactions[transactionId] === true;
  };

  // Handle payment for a transaction
  const handlePayment = async (memberName, friendName, activityName, amount) => {
    const transactionId = getTransactionId(memberName, friendName, activityName, amount);
    
    // Mark as paying
    setPayingTransactions(prev => ({
      ...prev,
      [transactionId]: true
    }));

    // Simulate payment processing
    setTimeout(() => {
      // Mark as paid
      setPaidTransactions(prev => ({
        ...prev,
        [transactionId]: true
      }));

      // Remove from paying state
      setPayingTransactions(prev => {
        const newState = { ...prev };
        delete newState[transactionId];
        return newState;
      });

      // Optional: Send to backend
      sendPaymentToBackend(memberName, friendName, activityName, amount);
    }, 1500); // 1.5 second delay to simulate payment processing
  };

  // Send payment confirmation to backend
  const sendPaymentToBackend = async (memberName, friendName, activityName, amount) => {
    try {
      const groupName = localStorage.getItem("groupName");
      const paymentData = {
        groupName,
        payer: memberName,
        receiver: friendName,
        activityName,
        amount,
        status: 'paid',
        timestamp: new Date().toISOString()
      };

      // You can send this to your backend API
      // await fetch('http://localhost:3000/api/markPaymentPaid', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(paymentData),
      // });
      
      console.log('Payment marked as paid:', paymentData);
    } catch (error) {
      console.error('Error sending payment to backend:', error);
    }
  };

  // Handle payment for an individual activity
  const handleActivityPayment = async (memberName, activityName, amount) => {
    const transactionId = getTransactionId(memberName, 'system', activityName, amount);
    
    setPayingTransactions(prev => ({
      ...prev,
      [transactionId]: true
    }));

    setTimeout(() => {
      setPaidTransactions(prev => ({
        ...prev,
        [transactionId]: true
      }));

      setPayingTransactions(prev => {
        const newState = { ...prev };
        delete newState[transactionId];
        return newState;
      });

      console.log('Activity payment marked as paid:', { memberName, activityName, amount });
    }, 1500);
  };

  // Calculate paid and pending amounts
  const calculatePaidAmounts = (member) => {
    let totalPaid = 0;
    let totalPending = 0;
    
    // Calculate for givesTo transactions
    if (member.givesTo) {
      member.givesTo.forEach(transaction => {
        if (isTransactionPaid(member.name, transaction.friendName, transaction.activityName, transaction.amount)) {
          totalPaid += Number(transaction.amount);
        } else {
          totalPending += Number(transaction.amount);
        }
      });
    }
    
    // Calculate for activities
    if (member.activities) {
      member.activities.forEach(activity => {
        const transactionId = getTransactionId(member.name, 'system', activity.activityName, activity.amount);
        if (paidTransactions[transactionId]) {
          totalPaid += Number(activity.amount);
        } else {
          totalPending += Number(activity.amount);
        }
      });
    }
    
    return { totalPaid, totalPending };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-20 md:w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 text-base md:text-lg font-medium">Loading trip data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-6 md:p-8 max-w-md w-full border border-red-100">
          <div className="text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">Error Loading Data</h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">{error}</p>
            <button
              onClick={fetchTripData}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-lg md:rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 mb-2 sm:mb-3 tracking-tight px-2">
            Trip Expense Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium px-2">
            {groupName && `Group: ${groupName}`}
          </p>
        </div>

        {/* Payment Summary */}
        <div className="mb-6 sm:mb-8 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="mb-3 sm:mb-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">Payment Status</h3>
              <p className="text-gray-600 text-sm sm:text-base">Track and manage all payments</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-600">Paid</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-full mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-600">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full mr-1 sm:mr-2"></div>
                <span className="text-xs sm:text-sm text-gray-600">Processing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Budget Card */}
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10 text-white transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/5 rounded-full -mr-24 sm:-mr-32 md:-mr-48 -mt-24 sm:-mt-32 md:-mt-48"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/5 rounded-full -ml-16 sm:-ml-24 md:-ml-32 -mb-16 sm:-mb-24 md:-mb-32"></div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
            <div className="mb-4 sm:mb-0">
              <p className="text-emerald-100 text-xs sm:text-sm uppercase tracking-widest mb-2 sm:mb-3 font-semibold">Overall Trip Budget</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1 sm:mb-2 drop-shadow-lg">{formatCurrency(totalBudget)}</h2>
              <div className="h-0.5 sm:h-1 w-16 sm:w-24 bg-white/40 rounded-full"></div>
            </div>
            <div className="flex items-center justify-center sm:justify-end">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-200">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 mx-auto mb-2 sm:mb-3 drop-shadow-md" />
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">{members.length}</p>
                <p className="text-emerald-100 text-xs sm:text-sm uppercase tracking-wide">Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {members.map((member, index) => {
            const totalGivesTo = getTotalGivesTo(member.givesTo);
            const totalGetsFrom = getTotalGetsFrom(member.getsFrom);
            const { totalPaid, totalPending } = calculatePaidAmounts(member);
            
            return (
              <div 
                key={member._id} 
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                
                {/* Member Header */}
                <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/5 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-white/5 rounded-full -ml-12 sm:-ml-18 md:-ml-24 -mb-12 sm:-mb-18 md:-mb-24"></div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black capitalize mb-3 sm:mb-4 md:mb-6 relative z-10 drop-shadow-md">{member.name}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 relative z-10">
                    <div className="bg-white/15 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 hover:bg-white/25 transition-all duration-200">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <p className="text-xs sm:text-sm font-semibold tracking-wide">Total Paid</p>
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black">{formatCurrency(member.totalPaid)}</p>
                      <div className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 text-emerald-100">
                        Personal: {formatCurrency(member.totalPaid)}
                      </div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 hover:bg-white/25 transition-all duration-200">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        <p className="text-xs sm:text-sm font-semibold tracking-wide">Total Owed</p>
                      </div>
                      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black">
                        {formatCurrency(member.totalOwed || totalGivesTo)}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        <span className="text-green-200 mb-0.5 sm:mb-0">Paid: {formatCurrency(totalPaid)}</span>
                        <span className="text-amber-200">Pending: {formatCurrency(totalPending)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5 md:space-y-6 bg-gradient-to-b from-gray-50 to-white">
                  
                  {/* Money Given */}
                  {member.givesTo?.length > 0 && (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-600 rounded-full shadow-lg"></div>
                          Money Pays
                        </h4>
                        <div className="bg-emerald-100 text-emerald-800 px-2 py-1 sm:px-3 sm:py-1 rounded-lg font-bold text-sm sm:text-base">
                          Total: {formatCurrency(totalGivesTo)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 border border-emerald-100 shadow-sm">
                        {member.givesTo.map((t, idx) => {
                          const isPaid = isTransactionPaid(member.name, t.friendName, t.activityName, t.amount);
                          const isPaying = isTransactionPaying(member.name, t.friendName, t.activityName, t.amount);
                          
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200 border-l-2 sm:border-l-4 border-l-emerald-500 gap-2 sm:gap-0">
                              <div className="flex-1 mb-2 sm:mb-0">
                                <p className="text-gray-700 mb-1 text-xs sm:text-sm">
                                  <span className="font-bold capitalize text-emerald-700">{member.name}</span> pays to{' '}
                                  <span className="font-bold capitalize text-emerald-700">{t.friendName}</span>
                                </p>
                                <p className="text-[10px] sm:text-xs text-gray-500">
                                  <span className="font-semibold capitalize">{t.activityName}</span>
                                </p>
                                <div className="flex items-center mt-1 sm:mt-2">
                                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 ${isPaid ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                  <span className="text-[10px] sm:text-xs font-medium">
                                    {isPaid ? 'Paid' : isPaying ? 'Processing...' : 'Pending'}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <span className="font-black text-emerald-700 text-base sm:text-lg md:text-lg ml-0 sm:ml-4">{formatCurrency(t.amount)}</span>
                                <div className="flex justify-end sm:justify-start">
                                  {!isPaid && !isPaying && (
                                    <button
                                      onClick={() => handlePayment(member.name, t.friendName, t.activityName, t.amount)}
                                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 text-xs sm:text-sm flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center"
                                    >
                                      <CreditCard size={12} className="sm:hidden" />
                                      <CreditCard size={14} className="hidden sm:block" />
                                      <span>Pay</span>
                                    </button>
                                  )}
                                  {isPaying && (
                                    <button
                                      disabled
                                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center opacity-90"
                                    >
                                      <div className="animate-spin rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 border-b-2 border-white"></div>
                                      <span>Processing</span>
                                    </button>
                                  )}
                                  {isPaid && (
                                    <button
                                      disabled
                                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center"
                                    >
                                      <Check size={12} className="sm:hidden" />
                                      <Check size={14} className="hidden sm:block" />
                                      <span>Paid</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Money Received */}
                  {member.getsFrom?.length > 0 && (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-teal-600 rounded-full shadow-lg"></div>
                          Money Collects
                        </h4>
                        <div className="bg-teal-100 text-teal-800 px-2 py-1 sm:px-3 sm:py-1 rounded-lg font-bold text-sm sm:text-base">
                          Total: {formatCurrency(totalGetsFrom)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 border border-teal-100 shadow-sm">
                        {member.getsFrom.map((t, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200 border-l-2 sm:border-l-4 border-l-teal-500 gap-2 sm:gap-0">
                            <div className="flex-1 mb-2 sm:mb-0">
                              <p className="text-gray-700 mb-1 text-xs sm:text-sm">
                                <span className="font-bold capitalize text-teal-700">{member.name}</span> collects from{' '}
                                <span className="font-bold capitalize text-teal-700">{t.friendName}</span>
                              </p>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                <span className="font-semibold capitalize">{t.activityName}</span>
                              </p>
                              <div className="flex items-center mt-1 sm:mt-2">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 bg-blue-500"></div>
                                <span className="text-[10px] sm:text-xs font-medium text-blue-600">Received</span>
                              </div>
                            </div>
                            <span className="font-black text-teal-700 text-base sm:text-lg md:text-lg ml-0 sm:ml-4">{formatCurrency(t.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activities List */}
                  {member.activities && member.activities.length > 0 && (
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-600 rounded-full shadow-lg"></div>
                        Individual Payments
                      </h4>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 border border-green-100 shadow-sm">
                        {member.activities.map((act, idx) => {
                          const transactionId = getTransactionId(member.name, 'system', act.activityName, act.amount);
                          const isPaid = paidTransactions[transactionId];
                          const isPaying = payingTransactions[transactionId];
                          
                          return (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200 border-l-2 sm:border-l-4 border-l-green-500 gap-2 sm:gap-0"
                            >
                              <div className="flex-1">
                                <p className="text-gray-700 font-semibold capitalize flex-1 text-xs sm:text-sm">{act.activityName}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <span className="font-black text-green-700 text-base sm:text-lg md:text-lg ml-0 sm:ml-4">
                                  {formatCurrency(act.amount)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No Transactions */}
                  {member.givesTo?.length === 0 && member.getsFrom?.length === 0 && (
                    <div className="text-center py-8 sm:py-10 md:py-12 bg-gray-50 rounded-lg sm:rounded-xl">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400 font-medium text-sm sm:text-base">No transactions yet</p>
                    </div>
                  )}

                  {/* Summary Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Transaction Summary</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                      <div className="text-center bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Pays</p>
                        <p className="text-lg sm:text-xl md:text-xl font-bold text-emerald-700">{formatCurrency(totalGivesTo)}</p>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                          <span className="text-green-600">Paid: {formatCurrency(totalPaid)}</span>
                        </div>
                      </div>
                      <div className="text-center bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Total Collects</p>
                        <p className="text-lg sm:text-xl md:text-xl font-bold text-teal-700">{formatCurrency(totalGetsFrom)}</p>
                      </div>
                      <div className="text-center bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Net Balance</p>
                        <p className={`text-lg sm:text-xl md:text-xl font-bold ${totalGetsFrom - totalGivesTo >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {formatCurrency(totalGetsFrom - totalGivesTo)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Latest Activity */}
                  {member.latestActivityName && (
                    <div className="pt-3 sm:pt-4 border-t border-gray-200">
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Latest activity with:{' '}
                        <span className="font-bold capitalize text-gray-700">
                          {member.latestActivityName}
                        </span>
                      </p>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-6 sm:mt-8 md:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
          <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-800 mb-4 sm:mb-5 md:mb-6">Trip Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center p-4 sm:p-5 md:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg sm:rounded-xl border border-emerald-100 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">Total Expenses</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-700">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="text-center p-4 sm:p-5 md:p-6 bg-gradient-to-br from-teal-50 to-green-50 rounded-lg sm:rounded-xl border border-teal-100 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">Per Person Average</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-teal-700">
                {formatCurrency(members.length > 0 ? totalBudget / members.length : 0)}
              </p>
            </div>
            <div className="text-center p-4 sm:p-5 md:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-100 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">Total Members</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-green-700">{members.length}</p>
            </div>
            <div className="text-center p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100 hover:shadow-lg transition-shadow duration-200">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 font-semibold uppercase tracking-wide">Total Owed</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-blue-700">
                {formatCurrency(members.reduce((total, member) => total + (member.totalOwed || 0), 0))}
              </p>
            </div>
          </div>
        </div>

        {/* Clear All Payments Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={() => {
              setPaidTransactions({});
              localStorage.removeItem('paidTransactions');
            }}
            className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Clear All Payment Status
          </button>
        </div>

      </div>
    </div>
  );
}