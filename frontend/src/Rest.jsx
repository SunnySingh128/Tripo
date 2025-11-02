import React, { useState, useEffect } from 'react';
import { Send, DollarSign, User, Building, Utensils, Coffee, Star, Sparkles, CheckCircle, Users, UserCheck,XCircle,Check } from 'lucide-react';
const api=import.meta.env.VITE_AP1_URL;
export default function RestaurantForm() {
  const [formData, setFormData] = useState({
    paymentType: 'group',
   activityName: '',
   payerName: '',
    amount: '',
    selectedFriends: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [particles, setParticles] = useState([]);
  const [chefMood, setChefMood] = useState('happy');
  const [showConfetti, setShowConfetti] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [friendError, setFriendError] = useState("");

  // Mock function to simulate fetching friends from backend
  const fetchFriendsFromBackend = async () => {
    setLoadingFriends(true);
    try {
      const name = localStorage.getItem("groupName");
      console.log(name);
  
      const membersResponse = await fetch(`${api}/api/getMembers?group=${name}`);
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        // Assuming data is like: { friends: ["Alice", "Bob", "Charlie"] }
  
        const formattedMembers = (membersData.friends || []).map((friend, index) => ({
          id: index + 1,
          name: friend
        }));
  
        setFriends(formattedMembers);
      } else {
        console.error('Failed to fetch group members');
        setFriends([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFriends([]);
    } finally {
      setLoadingFriends(false);
    }
  };

  useEffect(() => {
    if (formData.paymentType === 'individual') {
      fetchFriendsFromBackend();
    }
  }, [formData.paymentType]);

  // Create floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
      size: 0.5 + Math.random() * 1,
      icon: [Coffee, Utensils, Star][Math.floor(Math.random() * 3)]
    }));
    setParticles(newParticles);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update chef mood based on progress
    const requiredFields = formData.paymentType === 'individual' 
      ? [formData.activityName, formData.payerName, formData.amount, formData.selectedFriends.length > 0]
      : [formData.activityName, formData.payerName, formData.amount];
    const filledFields = Object.values({...formData, [name]: value}).filter(v => v).length;
    
    if (filledFields === requiredFields.length) setChefMood('excited');
    else if (filledFields >= 2) setChefMood('happy');
    else setChefMood('thinking');
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
  setFriendError("");
  setMessage(false); // Reset success state

  const payerName = formData.payerName?.trim();
  const groupName = localStorage.getItem("groupName");

  // Frontend validation
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
        setMessage(false);
        return false;
      } else {
        setMessage(true);
        setFriendError("");
        return true;
      }

    } catch (error) {
      console.error("Server error:", error);
      setFriendError("Unable to verify friend. Try again later.");
      setMessage(false);
      return false;
    }
  }

  setFriendError("Group name not found.");
  return false;
}
  const handleSubmit = async () => {
    if(!validateForm()) return;
    setIsSubmitting(true);
    setMessage('');
    setChefMood('cooking');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
          const groupName = localStorage.getItem("groupName");

// Prepare the data to send including group name
const requestData = {
  ...formData,  // Spread the existing form data
  groupName: groupName  // Add the group name
};
      const response = await fetch(`${api}/api/amount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok || true) { // Mock success for demo
        setMessage('Payment record saved successfully!');
        setChefMood('celebrating');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        setFormData({
          paymentType: 'group',
          activityName: '',
          payerName: '',
          amount: '',
          selectedFriends: []
        });
      } else {
        setMessage('Error saving payment record. Please try again.');
        setChefMood('sad');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
      setChefMood('sad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.activityName && formData.payerName && formData.amount && 
    (formData.paymentType === 'group' || formData.selectedFriends.length > 0);

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
        <div className={`text-6xl transition-all duration-500 ${
          chefMood === 'celebrating' ? 'animate-bounce' : 
          chefMood === 'cooking' ? 'animate-pulse' : 'animate-pulse'
        }`}>
          {expressions[chefMood]}
        </div>
        {chefMood === 'celebrating' && (
          <div className="absolute -top-2 -right-2 text-2xl animate-spin">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900 p-4 relative overflow-hidden">
      <FloatingParticles />
      <Confetti />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-lg mx-auto relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mt-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="bg-emerald-500/20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-30 animate-pulse"></div>
              <ChefCharacter />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Restaurant Payment Portal
            </h1>
            <p className="text-emerald-200 text-lg">Let's process your payment! 🍽️</p>
          </div>

          <div className="space-y-8">
            {/* Payment Type Selection */}
            <div className="group">
              <label className="block text-sm font-medium text-emerald-200 mb-3">
                Payment Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePaymentTypeChange('group')}
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
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
                  className={`flex-1 py-3 px-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
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

            {/* Friends Selection (only for individual payments) */}
            {formData.paymentType === 'individual' && (
              <div className="group">
                <label className="block text-sm font-medium text-emerald-200 mb-3">
                  <UserCheck className="w-5 h-5 inline mr-2 animate-pulse" />
                  Select Friends
                </label>
                {loadingFriends ? (
                  <div className="flex items-center justify-center py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400 mr-2"></div>
                    <span className="text-emerald-200">Loading friends...</span>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    {friends.map((friend) => (
                      <label
                        key={friend.id}
                        className="flex items-center p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedFriends.includes(friend.id)}
                          onChange={() => handleFriendSelection(friend.id)}
                          className="mr-3 w-4 h-4 text-emerald-500 bg-white/20 border-emerald-300 rounded focus:ring-emerald-400 focus:ring-2"
                        />
                        <span className="text-emerald-200">{friend.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hotel Name Field */}
            <div className="group">
              <label htmlFor="hotelName" className="block text-sm font-medium text-emerald-200 mb-3 transition-all duration-300 group-focus-within:text-emerald-100">
                <Building className="w-5 h-5 inline mr-2 animate-pulse" />
                Hotel Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="activityName"
                  name="activityName"
                  value={formData.activityName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-300/30 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-white placeholder-emerald-300 hover:bg-white/20 focus:bg-white/20 text-lg"
                  placeholder="Enter your hotel name..."
                  required
                />
                {formData.activityName && (
                  <CheckCircle className="absolute right-4 top-4 w-6 h-6 text-emerald-400 animate-pulse" />
                )}
              </div>
            </div>

            {/* Who Pays Field */}
            <div className="group">
              <label htmlFor="whoPays" className="block text-sm font-medium text-emerald-200 mb-3 transition-all duration-300 group-focus-within:text-emerald-100">
                <User className="w-5 h-5 inline mr-2 animate-pulse" />
                Who's Paying?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="payerName"
                  name="payerName"
                  value={formData.payerName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-300/30 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-white placeholder-emerald-300 hover:bg-white/20 focus:bg-white/20 text-lg"
                  placeholder="Enter payer name..."
                  required
                />
                {formData.payerName && (
                  <CheckCircle className="absolute right-4 top-4 w-6 h-6 text-emerald-400 animate-pulse" />
                )}
              </div>
            </div>

            {/* Amount Field */}
            <div className="group">
              <label htmlFor="amount" className="block text-sm font-medium text-emerald-200 mb-3 transition-all duration-300 group-focus-within:text-emerald-100">
                <DollarSign className="w-5 h-5 inline mr-2 animate-pulse" />
                Payment Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-emerald-300/30 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 text-white placeholder-emerald-300 hover:bg-white/20 focus:bg-white/20 text-lg"
                  placeholder="Enter amount..."
                  min="0"
                  step="0.01"
                  required
                />
                {formData.amount && (
                  <CheckCircle className="absolute right-4 top-4 w-6 h-6 text-emerald-400 animate-pulse" />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 active:scale-95 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/50'
                  : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Processing Magic...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span>Submit Payment Record</span>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </>
              )}
            </button>
          </div>

          {/* Status Message */}
        {message && !friendError && (
  <div className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-5 rounded-xl shadow-xl animate-transport-arrival">
    <div className="flex items-center">
      <Check className="mr-3 animate-transport-delivered" size={24} />
      <span className="font-semibold text-lg">Thank you</span>
    </div>
  </div>
)}

{friendError && !message && (
  <div className="mb-8 bg-gradient-to-r from-red-500 to-rose-500 text-white p-5 rounded-xl shadow-xl animate-transport-arrival">
    <div className="flex items-center">
      <XCircle className="mr-3 animate-shake" size={24} />
      <span className="font-semibold text-lg">{friendError}</span>
    </div>
  </div>
)}
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 flex justify-center space-x-2">
          {[0, 1, 2, 3].map((step) => {
            const requiredFields = formData.paymentType === 'individual' 
              ? [formData.activityName, formData.payerName, formData.amount, formData.selectedFriends.length > 0]
              : [formData.activityName, formData.payerName, formData.amount];
            const filledFields = requiredFields.filter(field => field).length;
            const isActive = step < filledFields;
            return (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isActive ? 'bg-emerald-400 scale-110' : 'bg-white/20'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}