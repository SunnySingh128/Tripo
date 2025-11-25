import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const api = import.meta.env.VITE_AP1_URL;

const TripoWrap = () => {
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState({
    totalAmount: 0,
    groupName: '',
    friends: [],
    activities: [],
    topSpender: null,
    leastSpender: null,
    name1: null,
    seperateBill: [],
  });
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    fetchTripData();
  }, []);

  const fetchTripData = async () => {
    try {
      setLoading(true);
      const groupName = localStorage.getItem("groupName");
      if (!groupName) throw new Error("Group name not found in localStorage");

      const response = await fetch(`${api}/api/fetchall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupName })
      });

      if (!response.ok) throw new Error("Failed to fetch trip data");
      const result = await response.json();
      console.log(result.fullbalance);
      
      // Transform friends with their specific activities
      const enrichedFriends = result.friends?.map(friend => {
        const friendBalances = result.fullbalance?.filter(b => {
          const match = String(b?.friendId) === String(friend?.id);
          if (!match) return false;
          return true;
        }) || [];

        const totalPaid = friendBalances.reduce((sum, b) => {
          const amount = parseFloat(b?.totalPaid) || 0;
          if (isNaN(amount)) {
            return sum;
          }
          return sum + amount;
        }, 0);
        
        const activities = friendBalances
          .map(b => b?.latestActivityName)
          .filter(name => name);

        return {
          ...friend,
          latestActivityName: activities[0] || "No activity",
          totalPaid,
          amount: totalPaid,
          allActivities: activities
        };
      }) || [];

      const sortedFriends = [...enrichedFriends].sort((a, b) => b.totalPaid - a.totalPaid);

      const activityMap = new Map();
      result.fullbalance?.forEach(balance => {
        if (balance?.latestActivityName) {
          const amount = parseFloat(balance?.totalPaid) || 0;
          const current = activityMap.get(balance.latestActivityName) || 0;
          activityMap.set(balance.latestActivityName, current + amount);
        }
      });

      const activities = Array.from(activityMap.entries()).map(([name, amount], index) => ({
        name,
        amount,
        color: `hsl(${index * 60}, 70%, 50%)`,
        icon: ['🍔', '🏨', '✈️', '🎡', '🛒', '🍻'][index % 6] || '💰'
      }));

      const validFriends = sortedFriends.filter(f => !isNaN(f.totalPaid));
      const topSpender = validFriends[0] || null;
      const leastSpender = validFriends[validFriends.length - 1] || null;

      setTripData({
        totalAmount: parseFloat(result.TotalAmount) || 0,
        groupName: result.groupName || '',
        activities,
        friends: validFriends,
        topSpender,
        leastSpender,
        name1: result.friends || null,
        seperateBill: result.fullbalance,
      });

      setTimeout(() => setAnimateCards(true), 300);
    } catch (error) {
      console.error("Error fetching trip data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="10"
        fontWeight="bold"
        className="text-xs sm:text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-green-300/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 sm:inset-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-2xl sm:text-4xl">💰</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Calculating Your Trip Wrap</h2>
          <p className="text-green-200 text-sm sm:text-base">Crunching the numbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-800 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce">🎉</span>
            Tripo Wrap 2024
            <span className="text-4xl sm:text-5xl md:text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>🎊</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-green-200">
            Your amazing trip with <span className="font-bold text-green-300">{tripData.groupName}</span>
          </p>
        </div>

        {/* Total Amount Card */}
        <div className={`bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-center shadow-2xl transform transition-all duration-1000 ${
          animateCards ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
        }`}>
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">💸</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Total Trip Cost</h2>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 animate-pulse">
            {formatCurrency(tripData.totalAmount)}
          </div>
          <p className="text-green-100 text-sm sm:text-base md:text-lg">What an adventure it was!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          
          {/* Spending Breakdown Pie Chart */}
          <div className={`bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-green-400/20 shadow-2xl transform transition-all duration-1000 ${
            animateCards ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`} style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
              📊 Spending Breakdown
            </h3>
            {tripData.activities.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
                  <PieChart>
                    <Pie
                      data={tripData.activities}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {tripData.activities.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Amount']}
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-4 text-xs sm:text-sm">
                  {tripData.activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" 
                        style={{backgroundColor: activity.color}}
                      ></div>
                      <span className="text-white truncate">{activity.icon} {activity.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center text-white py-8">
                <p>No activities data available</p>
              </div>
            )}
          </div>

          {/* Top & Least Spenders */}
          <div className={`space-y-4 sm:space-y-6 transform transition-all duration-1000 ${
            animateCards ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`} style={{animationDelay: '0.4s'}}>
            
            {/* Top Spender */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-xl">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">👑</div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">Biggest Spender</h3>
              {tripData.topSpender ? (
                <>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">{tripData.topSpender.avatar}</span>
                    <div>
                      <p className="font-bold text-white text-sm sm:text-base md:text-lg">{tripData.topSpender.name}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">{formatCurrency(tripData.topSpender.amount)}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-full p-1 sm:p-2">
                    <p className="text-white text-xs sm:text-sm">Spent on: {tripData.topSpender.latestActivityName || 'Various activities'} 🌟</p>
                  </div>
                </>
              ) : (
                <p className="text-white text-sm">No data available</p>
              )}
            </div>

            {/* Least Spender */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-xl">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">💰</div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">Most Frugal</h3>
              {tripData.leastSpender ? (
                <>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-2xl sm:text-3xl">{tripData.leastSpender.avatar}</span>
                    <div>
                      <p className="font-bold text-white text-sm sm:text-base md:text-lg">{tripData.leastSpender.name}</p>
                      <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">{formatCurrency(tripData.leastSpender.amount)}</p>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-full p-1 sm:p-2">
                    <p className="text-white text-xs sm:text-sm">Spent on: {tripData.leastSpender.latestActivityName || 'Few activities'} 🤑</p>
                  </div>
                </>
              ) : (
                <p className="text-white text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Friends Spending Leaderboard */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-green-400/20 shadow-2xl mb-6 sm:mb-8 transform transition-all duration-1000 ${
          animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{animationDelay: '0.6s'}}>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
            🏆 Spending Leaderboard
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {tripData.friends.length > 0 ? (
              tripData.friends.map((friend, index) => {
                const billAmount = tripData.seperateBill?.[index]?.totalPaid || friend.amount || 0;
                
                return (
                  <div 
                    key={friend.id} 
                    className={`bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-green-400/30 transform transition-all duration-500 hover:scale-105 animate-slideIn`}
                    style={{animationDelay: `${0.8 + index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <span className="text-lg sm:text-xl font-bold text-green-300">#{index + 1}</span>
                          {index === 0 && <span className="text-lg sm:text-xl">🥇</span>}
                          {index === 1 && <span className="text-lg sm:text-xl">🥈</span>}
                          {index === 2 && <span className="text-lg sm:text-xl">🥉</span>}
                        </div>
                        <span className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">{friend.avatar}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-sm sm:text-base md:text-lg truncate">{friend[0]}</p>
                          <p className="text-green-200 text-xs sm:text-sm truncate">
                            {friend.allActivities[index] || 'Various activities'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
                        <p className="text-lg sm:text-xl md:text-2xl font-black text-white whitespace-nowrap">
                          {formatCurrency(billAmount)}
                        </p>
                        <div className="w-20 sm:w-24 md:w-32 bg-green-800 rounded-full h-1 sm:h-2 mt-1 sm:mt-2">
                          <div 
                            className="h-1 sm:h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-1000"
                            style={{
                              width: `${tripData.topSpender && tripData.topSpender.amount > 0 ? (billAmount / tripData.topSpender.amount) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-white py-4">
                <p>No friends data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Activities Bar Chart */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-green-400/20 shadow-2xl mb-6 sm:mb-8 transform transition-all duration-1000 ${
          animateCards ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`} style={{animationDelay: '1s'}}>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
            📈 Spending by Category
          </h3>
          {tripData.activities.length > 0 ? (
            <ResponsiveContainer width="100%" height={250} className="text-xs sm:text-sm">
              <BarChart data={tripData.activities} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10B981" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{fill: 'white', fontSize: 10}}
                  tickFormatter={(value) => {
                    const activity = tripData.activities.find(a => a.name === value);
                    return activity ? (activity.icon + ' ' + value.substring(0, 8) + (value.length > 8 ? '...' : '')) : value;
                  }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{fill: 'white', fontSize: 10}} 
                  tickFormatter={(value) => `$${value}`} 
                  width={40}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} animationDuration={1500}>
                  {tripData.activities.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-white py-8">
              <p>No activities data available</p>
            </div>
          )}
        </div>

        {/* Fun Footer */}
        <div className="text-center py-6 sm:py-8">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 animate-bounce">🌟</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">What a Journey!</h2>
          <p className="text-green-200 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 max-w-2xl mx-auto px-4">
            Thanks for using Tripo to track your amazing adventure with {tripData.groupName}!
          </p>
          <div className="flex justify-center gap-1 sm:gap-2 text-2xl sm:text-3xl md:text-4xl">
            <span className="animate-pulse">🎊</span>
            <span className="animate-pulse" style={{animationDelay: '0.2s'}}>🎉</span>
            <span className="animate-pulse" style={{animationDelay: '0.4s'}}>🥳</span>
            <span className="animate-pulse" style={{animationDelay: '0.6s'}}>🎈</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }

        /* Custom responsive text sizes */
        @media (max-width: 480px) {
          .text-responsive {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TripoWrap;