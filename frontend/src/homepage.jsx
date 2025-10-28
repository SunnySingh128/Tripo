import React, { useState, useEffect } from 'react';
import { ChevronDown, User, MapPin, Utensils, Bed, Car, Plus, Settings, LogOut, Star, Heart, Sparkles, Zap, Globe, Camera, ShoppingBag, Music, Coffee, Gamepad2, Mountain, Waves, TreePine, Sun, Wallet } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const api = import.meta.env.VITE_AP1_URL;

const Navbar = ({ onUserClick, showDropdown, onCloseDropdown }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { name } = location.state || {};

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      scrolled 
        ? 'bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur-lg shadow-2xl' 
        : 'bg-gradient-to-r from-emerald-800 to-teal-800'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl w-12 h-12 flex items-center justify-center font-bold text-xl text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
                <circle cx="60" cy="60" r="50" fill="#10B981" opacity="0.2"/>
                <path d="M30 60 L50 40 L70 60 L90 40" stroke="#10B981" strokeWidth="4" fill="none"/>
                <circle cx="60" cy="70" r="8" fill="#F59E0B"/>
                <text x="60" y="95" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">TRIPO</text>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Tripo
          </span>
          <div className="hidden sm:flex items-center space-x-1 ml-2">
            <Star className="text-yellow-400 animate-pulse" size={16} />
            <span className="text-emerald-200 text-sm">Adventure Awaits</span>
          </div>
        </div>
        
        {name && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-xl font-semibold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
              {name}
            </span>
          </div>
        )}
                
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/TripoWrap')}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 px-5 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
          >
            <div className="bg-white/20 rounded-full p-1">
              <Wallet size={20} className="text-white" />
            </div>
            <span className="text-white font-semibold">Expenses</span>
          </button>

          <div className="relative">
            <button
              onClick={onUserClick}
              className="flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              <div className="bg-white/20 rounded-full p-1">
                <User size={20} className="text-white" />
              </div>
              <span className="text-white font-semibold">Account</span>
              <ChevronDown size={16} className={`text-white transform transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
                        
            {showDropdown && (
              <UserDropdown onClose={onCloseDropdown} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const UserDropdown = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    loadUserData();
  }, []);

  const loadUserData = () => {
    const savedData = localStorage.getItem('userDataEntries');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.length > 0) {
          const latestEntry = parsedData[parsedData.length - 1];
          setUserData({
            name: latestEntry.name || 'Guest User',
            email: latestEntry.email || 'No email provided'
          });
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  };

  const handleAction = (action) => {
    navigate("/profile");
  };

  return (
    <div 
      className={`absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 transform transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full w-10 h-10 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 truncate max-w-[140px]">
                {userData?.name}
              </p>
              <p className="text-sm text-gray-500 truncate max-w-[140px]">
                {userData?.email}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleAction('Profile')}
          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl flex items-center space-x-3 transition-all duration-200 hover:scale-[1.02] m-1"
        >
          <User size={18} className="text-emerald-600" />
          <span className="font-medium">Profile</span>
        </button>

        <hr className="my-2 border-gray-200" />

        <button
          onClick={() => handleAction('Logout')}
          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl flex items-center space-x-3 transition-all duration-200 hover:scale-[1.02] m-1"
        >
          <LogOut size={18} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

const OptionCard = ({ icon: Icon, label, onClick, gradient, category, isSelected, onToggleSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick();
  };

  return (
    <div className="group relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-8 flex flex-col items-center space-y-4 border border-white/30 relative overflow-hidden transform ${
          isHovered ? 'scale-105 -rotate-1' : 'scale-100 rotate-0'
        } ${isPressed ? 'scale-95' : ''}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
        
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-2 h-2 bg-white rounded-full animate-ping top-4 right-4 ${isHovered ? 'opacity-50' : 'opacity-0'} transition-opacity duration-300`}></div>
          <div className={`absolute w-1 h-1 bg-white rounded-full animate-pulse top-8 left-6 ${isHovered ? 'opacity-30' : 'opacity-0'} transition-opacity duration-500`}></div>
        </div>
        
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'} relative`}>
          <Icon size={36} className="text-white drop-shadow-lg" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="text-center z-10">
          <span className="text-xl font-bold text-gray-800 mb-2 block">{label}</span>
          <div className="flex items-center justify-center space-x-1">
            <Star className="text-yellow-400" size={14} />
            <span className="text-sm text-gray-600">Popular</span>
          </div>
        </div>
        
        <div className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br ${gradient} transform transition-all duration-300 ${
          isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradient} opacity-20 transform transition-all duration-300 ${
          isPressed ? 'scale-100' : 'scale-0'
        }`}></div>
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
        className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white shadow-lg transform transition-all duration-300 ${
          isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
        }`}
      >
        <Heart size={14} className={isSelected ? 'fill-current' : ''} />
      </button>
    </div>
  );
};

const Customize = ({ customCategories, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const categoryIcons = [Camera, ShoppingBag, Music, Coffee, Gamepad2, Mountain, Waves, TreePine, Sun];

  const handleAddCategory = () => {
    if (newCategory.trim() && !customCategories.some(cat => cat.name === newCategory.trim())) {
      setIsAdding(true);
      setTimeout(() => {
        const randomIcon = categoryIcons[Math.floor(Math.random() * categoryIcons.length)];
        const gradients = [
          'from-purple-500 to-pink-500',
          'from-blue-500 to-cyan-500',
          'from-green-500 to-teal-500',
          'from-yellow-500 to-orange-500',
          'from-red-500 to-pink-500',
          'from-indigo-500 to-purple-500'
        ];
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
        
        onAddCategory({
          name: newCategory.trim(),
          icon: randomIcon,
          gradient: randomGradient,
          id: Date.now()
        });
        setNewCategory('');
        setIsAdding(false);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-3">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Customize Your Adventure
            </h3>
            <p className="text-gray-600">Create unique categories for your perfect trip</p>
          </div>
        </div>
        
        <div className="flex space-x-3 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add custom category (e.g., Photography, Wellness)"
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500"
              disabled={isAdding}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Zap className="text-emerald-500 animate-pulse" size={20} />
            </div>
          </div>
          <button
            onClick={handleAddCategory}
            disabled={isAdding}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} className={isAdding ? 'animate-spin' : ''} />
            <span className="font-semibold">{isAdding ? 'Adding...' : 'Add'}</span>
          </button>
        </div>
        
        {customCategories.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-700 flex items-center space-x-2">
              <Globe size={20} className="text-emerald-600" />
              <span>Your Custom Categories</span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-sm">
                {customCategories.length}
              </span>
            </h4>
            <div className="flex flex-wrap gap-3">
              {customCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white/80 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
                >
                  <div className={`bg-gradient-to-r ${category.gradient} rounded-full p-1`}>
                    <category.icon size={16} className="text-white" />
                  </div>
                  <span className="text-gray-800 font-medium">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Options = ({ customCategories, onAddCategory, selectedCategories, onToggleCategory }) => {
  const navigate = useNavigate();
  
  const predefinedOptions = [
    { 
      icon: Utensils, 
      label: 'Restaurants', 
      category: 'dining',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      icon: MapPin, 
      label: 'Activities', 
      category: 'entertainment',
      gradient: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Bed, 
      label: 'Hotels', 
      category: 'accommodation',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Car, 
      label: 'Transportation', 
      category: 'transportation',
      gradient: 'from-green-500 to-emerald-500'
    },
  ];
  
  function addchanges(option){
    console.log(option.label);
    navigate(`/${option.label}`);
  }

  async function setpages(name) {
    console.log(name);
    localStorage.setItem("name", JSON.stringify(name));
    navigate("/custom");
  }

  return (
    <div className="space-y-12">
      <div className="text-center relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover amazing destinations and create unforgettable memories with our intelligent travel planning
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-300"></div>
              <span className="text-gray-600">Personalized</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-500"></div>
              <span className="text-gray-600">Sustainable</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {predefinedOptions.map((option, index) => (
          <OptionCard
            key={index}
            icon={option.icon}
            label={option.label}
            gradient={option.gradient}
            category={option.category}
            isSelected={selectedCategories.includes(option.category)}
            onToggleSelect={() => onToggleCategory(option.category)}
            onClick={() => addchanges(option)}
          />
        ))}
      </div>
      
      <Customize
        customCategories={customCategories}
        onAddCategory={onAddCategory}
      />
      
      {customCategories.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Your Custom Adventures
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customCategories.map((category) => (
              <OptionCard
                key={category.id}
                icon={category.icon}
                label={category.name}
                gradient={category.gradient}
                category={category.name}
                isSelected={selectedCategories.includes(category.name)}
                onToggleSelect={() => onToggleCategory(category.name)}
                onClick={() => setpages(category.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [customCategories, setCustomCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleUserClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleCloseDropdown = () => {
    setShowUserDropdown(false);
  };

  const handleAddCategory = (category) => {
    setCustomCategories([...customCategories, category]);
  };

  const handleToggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.relative')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      
      <Navbar
        onUserClick={handleUserClick}
        showDropdown={showUserDropdown}
        onCloseDropdown={handleCloseDropdown}
      />
      
      <main className="container mx-auto px-6 py-8 pt-28 relative z-10">
        <Options
          customCategories={customCategories}
          onAddCategory={handleAddCategory}
          selectedCategories={selectedCategories}
          onToggleCategory={handleToggleCategory}
        />
        
        {selectedCategories.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <Star className="text-yellow-300" size={24} />
              <h4 className="text-2xl font-bold">Your Trip Planning Progress</h4>
            </div>
            <p className="text-emerald-100 mb-4">
              You've selected {selectedCategories.length} categories for your adventure!
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white py-12 mt-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Globe className="text-emerald-400" size={24} />
            <span className="text-2xl font-bold">Tripo</span>
          </div>
          <p className="text-emerald-200 text-lg">
            © 2025 Tripo - Discover the world sustainably, one adventure at a time
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <Heart className="text-pink-400 fill-current" size={16} />
              <span className="text-emerald-300 text-sm">Made with love</span>
            </div>
            <div className="flex items-center space-x-2">
              <TreePine className="text-green-400" size={16} />
              <span className="text-emerald-300 text-sm">Eco-friendly travel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;