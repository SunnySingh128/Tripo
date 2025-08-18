import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Home, Users, Settings, LogOut, AlertCircle } from 'lucide-react'
import  {useNavigate} from 'react-router-dom'
export default function VoiceCommandAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [pulseAnimation, setPulseAnimation] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  // Navigation commands mapping
  const navigationCommands = {
    'activity': { page: 'activity', icon: Home, description: 'go to activity' },
    'dashboard': { page: 'Dashboard', icon: Home, description: 'Open dashboard' },
    'groups': { page: 'Groups', icon: Users, description: 'View groups' },
    'profile': { page: 'Profile', icon: Users, description: 'Open profile' },
    'settings': { page: 'Settings', icon: Settings, description: 'Open settings' },
    'logout': { page: 'Logout', icon: LogOut, description: 'Sign out' },
    'login': { page: 'Login', icon: LogOut, description: 'Sign in' }
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          
          if (event.results[i].isFinal) {
            finalTranscript = transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceCommand(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        switch (event.error) {
          case 'network':
            // Implement retry logic for network errors
            setError('Connection lost. Retrying in 3 seconds...');
            setIsListening(false);
            
            // Retry after 3 seconds
            setTimeout(() => {
              if (recognitionRef.current && hasPermission) {
                try {
                  setError('Reconnecting...');
                  recognitionRef.current.start();
                  setIsListening(true);
                  setError(''); // Clear error if successful
                } catch (retryError) {
                  setError('Unable to reconnect. Please try again manually.');
                  console.error('Retry failed:', retryError);
                }
              }
            }, 3000);
            break;
            
          case 'not-allowed':
            setError('Microphone permission denied. Please allow microphone access.');
            setHasPermission(false);
            break;
            
          case 'no-speech':
            // Don't show error for no-speech, just continue listening
            console.log('No speech detected, continuing...');
            // Auto-restart if still supposed to be listening
            if (isListening && hasPermission) {
              setTimeout(() => {
                try {
                  recognitionRef.current.start();
                } catch (err) {
                  console.log('Failed to restart after no-speech');
                }
              }, 100);
            }
            break;
            
          case 'audio-capture':
            setError('No microphone found. Please check your microphone.');
            break;
            
          default:
            setError(`Recognition error: ${event.error}`);
        }
        
        // Only set listening to false for serious errors
        if (event.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Add network monitoring
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network back online');
      if (!isListening && hasPermission && isActive) {
        // Auto-restart when network is back
        setTimeout(() => {
          startListening();
        }, 1000);
      }
    };

    const handleOffline = () => {
      console.log('Network went offline');
      setError('You\'re offline. Voice recognition will resume when connection is restored.');
      stopListening();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isListening, hasPermission, isActive]);

  // Request microphone permission and start listening
  const startListening = async () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported');
      return;
    }

    try {
      setError('');
      console.log('Requesting microphone permission...');
      
      // Request microphone access - this will show the permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      console.log('Microphone permission granted!');
      streamRef.current = stream;
      setHasPermission(true);
      setPermissionRequested(true);
      
      // Start speech recognition
      recognitionRef.current.start();
      setIsListening(true);

    } catch (err) {
      console.error('Microphone access error:', err);
      setPermissionRequested(true);
      
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Click the microphone icon in your browser address bar to allow access, then try again.');
        setHasPermission(false);
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.');
        setHasPermission(false);
      } else if (err.name === 'NotReadableError') {
        setError('Microphone is being used by another application.');
        setHasPermission(false);
      } else {
        setError('Could not access microphone: ' + err.message);
        setHasPermission(false);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  };

  // Handle voice commands
  const navigate=useNavigate();
const handleVoiceCommand = (command) => {
    console.log('Processing command:', command);
    
    // Check for activation phrase
    if (command.includes('hey tripo') || command.includes('hey tripod') || command.includes('hey') || command.includes('hello')) {
      setIsActive(true);
      setPulseAnimation(true);
      setResponse('Hi! I\'m listening. How can I help you navigate?');
      setTimeout(() => setPulseAnimation(false), 1000);
      return;
    }

    // Only process navigation commands if activated
    // if (!isActive) return;
    const normalizedCommand = command.toLowerCase().trim();

    // Check for specific commands (more exact matching)
    if (
      command === 'tripo' || command==="treepo" ||command==="reepo"|| command==="prepo" || command==="report" || command==="tree" ||
      command === 'go to tripo' || 
      command === 'open tripo' ||
      command.includes('navigate to tripo')
    ) {
      console.log("Navigating to tripo");
      setResponse(`Navigating to tripo...`);
      navigate("/TripoWrap");
      // Don't deactivate here if you want to keep listening
      setIsActive(false);
      return;
    }
    // }else if( command === 'hotel' || 
    //   command === 'go to hotel' || 
    //   command === 'open hotel' ||
    //   command.includes('navigate to hotel')){
    //       console.log("Navigating to hotel");
    //   setResponse(`Navigating to hotel...`);
    //   navigate("/Hotels");
    //   // Don't deactivate here if you want to keep listening
    //   setIsActive(false);
    //   return;
    //   }else if( command === 'transportation' || 
    //   command === 'go to transportation' || 
    //   command === 'open transportation' ||
    //   command.includes('navigate to transportation')){
    //       console.log("Navigating to transportation");
    //   setResponse(`Navigating to transportation...`);
    //   navigate("/Transportation");
    //   // Don't deactivate here if you want to keep listening
    //   setIsActive(false);
    //   return;
    //   }else if( command === 'restaurant' || 
    //   command === 'go to restaurant' || 
    //   command === 'open transportation' ||
    //   command.includes('navigate to restaurant')){
    //       console.log("Navigating to restaurant");
    //   setResponse(`Navigating to restaurant...`);
    //   navigate("/Restaurants");
    //   // Don't deactivate here if you want to keep listening
    //   setIsActive(false);
    //   return;
    //   }else if( command === 'tripowrap' || 
    //   command === 'go to tripowrap' || 
    //   command === 'open tripowrap' ||
    //   command.includes('navigate to tripowrap')){
    //       console.log("Navigating to tripowrap");
    //   setResponse(`Navigating to tripowrap...`);
    //   navigate("/TripoWrap");
    //   // Don't deactivate here if you want to keep listening
    //   setIsActive(false);
    //   return;
    //   }

    // Help command
    if (command.includes('help') || command.includes('what can you do')) {
      setResponse(`I can help you navigate. Try saying: "activity", "go to activity"`);
      return;
    }

    // Stop listening
    if (command.includes('stop') || command.includes('bye') || command.includes('exit')) {
      setResponse('Goodbye! Say "Hey Tripo" to activate me again.');
      setIsActive(false);
      return;
    }

    // Default response for unrecognized commands
    setResponse('I didn\'t understand that. Try saying "help" for available commands.');
};

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Simulate voice level animation
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVoiceLevel(Math.random() * 100);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setVoiceLevel(0);
    }
  }, [isListening]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Permission Request Message */}
      {!permissionRequested && !hasPermission && (
        <div className="mb-4 bg-blue-900/95 backdrop-blur-xl rounded-2xl p-4 border border-blue-400/30 shadow-2xl shadow-blue-500/20 max-w-sm">
          <div className="flex items-center mb-2">
            <Mic className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-blue-200 font-medium text-sm">Microphone Access Required</span>
          </div>
          <p className="text-blue-100 text-sm mb-3">Click the microphone button below to grant microphone access. Your browser will show a permission dialog.</p>
          <div className="text-xs text-blue-300">
            ✓ Click "Allow" when prompted<br/>
            ✓ Say "Tripo" to activate<br/>
            ✓ Give voice commands
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-900/95 backdrop-blur-xl rounded-2xl p-4 border border-red-400/30 shadow-2xl shadow-red-500/20 max-w-sm">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
            <span className="text-red-200 font-medium text-sm">Error</span>
          </div>
          <p className="text-red-100 text-sm">{error}</p>
          {error.includes('denied') && (
            <div className="mt-3 text-xs text-red-200">
              <p>To fix this:</p>
              <p>1. Look for a microphone icon in your browser's address bar</p>
              <p>2. Click it and select "Always allow"</p>
              <p>3. Refresh the page and try again</p>
            </div>
          )}
        </div>
      )}

      {/* Voice Assistant Panel */}
      {(isActive || response) && !error && (
        <div className="mb-4 bg-gradient-to-br from-emerald-900/95 to-green-900/95 backdrop-blur-xl rounded-2xl p-4 border border-emerald-400/30 shadow-2xl shadow-emerald-500/20 max-w-sm">
          <div className="flex items-center mb-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-emerald-200 font-medium text-sm">Tripo Assistant</span>
          </div>
          
          {transcript && (
            <div className="mb-3 p-2 bg-emerald-950/50 rounded-lg border border-emerald-400/20">
              <p className="text-emerald-300 text-xs font-mono">You said: "{transcript}"</p>
            </div>
          )}
          
          {response && (
            <div className="p-3 bg-gradient-to-r from-emerald-800/50 to-green-800/50 rounded-lg border border-emerald-400/30">
              <p className="text-white text-sm">{response}</p>
            </div>
          )}

          {/* Available Commands */}
          {isActive && (
            <div className="mt-3 pt-3 border-t border-emerald-400/20">
              <p className="text-emerald-300 text-xs mb-2">Available commands:</p>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(navigationCommands).slice(0, 4).map(([key, nav]) => {
                  const IconComponent = nav.icon;
                  return (
                    <div key={key} className="flex items-center text-emerald-200 text-xs">
                      <IconComponent className="w-3 h-3 mr-1" />
                      <span>{key}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Microphone Button */}
      <div className="relative">
        {/* Pulse rings for active state */}
        {(isActive || pulseAnimation) && (
          <>
            <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping"></div>
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-pulse scale-125"></div>
          </>
        )}

        {/* Voice level indicator */}
        {isListening && (
          <div className="absolute -inset-4">
            <div 
              className="w-full h-full border-4 border-emerald-400/40 rounded-full transition-all duration-150"
              style={{ 
                transform: `scale(${1 + voiceLevel / 200})`,
                opacity: 0.6 + voiceLevel / 200 
              }}
            ></div>
          </div>
        )}

        <button
          onClick={toggleListening}
          className={`
            relative w-16 h-16 rounded-full transition-all duration-300 transform flex items-center justify-center
            ${isListening 
              ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110' 
              : hasPermission
                ? 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            }
            ${isActive ? 'shadow-2xl shadow-emerald-400/40' : 'shadow-xl shadow-emerald-500/25'}
            hover:scale-105 active:scale-95
            border-2 border-white/20
          `}
        >
          {/* Microphone Icon */}
          {isListening ? (
            <div className="relative flex items-center justify-center">
              <Mic className="w-5 h-5 text-white drop-shadow-lg" />
              {/* Recording indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <Mic className={`w-5 h-5 text-white drop-shadow-lg ${!hasPermission ? 'opacity-75' : ''}`} />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 rounded-full pointer-events-none"></div>
          
          {/* Activation indicator */}
          {isActive && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full border-2 border-white animate-bounce">
              <div className="w-full h-full bg-lime-300 rounded-full animate-pulse"></div>
            </div>
          )}
        </button>

        {/* Status indicator text */}
        {isListening && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-emerald-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-400/30">
              <span className="text-emerald-200 text-xs font-medium flex items-center">
                <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                {isActive ? 'Listening...' : 'Say "Hey Tripo"'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isListening && !error && hasPermission && (
        <div className="absolute -top-16 -left-32 bg-emerald-900/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-400/30 shadow-xl">
          <p className="text-emerald-200 text-xs whitespace-nowrap">
            Click to start listening • Say "Hello"
          </p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-400/30"></div>
        </div>
      )}
    </div>
  );
}