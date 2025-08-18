import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  MousePointer, 
  Mic, 
  Volume2, 
  Eye, 
  ArrowRight, 
  CheckCircle, 
  Play,
  Code,
  Server,
  Database,
  Zap,
  Home
} from 'lucide-react';
const api=import.meta.env.VITE_AP1_URL;
 // Import navigate from react-router-dom
const VoiceCommandGuidance = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [shouldNavigate, setShouldNavigate] = useState(false);
const navigate = useNavigate();
  // Simulate navigation function
  const navigateToHome = () => {
    navigate('/Group');
  };

  const steps = [
    {
      id: 1,
      icon: <MousePointer className="w-8 h-8" />,
      title: "Step 1: Click to Start",
      description: "Click the microphone button to enable voice recognition",
      detail: "This will activate your browser's speech recognition feature",
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-400/30"
    },
    {
      id: 2,
      icon: <Volume2 className="w-8 h-8" />,
      title: "Step 2: Say 'Hello'",
      description: "Speak clearly and say 'Hello' for activation",
      detail: "This is the first activation command that unlocks the system",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-400/30"
    },
    {
      id: 3,
      icon: <Eye className="w-8 h-8" />,
      title: "Step 3: See Final Expenses",
      description: "Wait to see your final expenses displayed",
      detail: "The system will show you a summary of all expenses and data",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-400/30"
    },
    {
      id: 4,
      icon: <Mic className="w-8 h-8" />,
      title: "Step 4: Say 'Tripo'",
      description: "Finally, say 'Tripo' to access the development environment",
      detail: "This command will reveal the complete development dashboard",
      color: "from-lime-500 to-emerald-500",
      bgColor: "bg-lime-500/10",
      borderColor: "border-lime-400/30"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % steps.length;
          // Mark current step as completed when moving to next
          setCompletedSteps(prevCompleted => new Set([...prevCompleted, prev]));
          
          // If we've completed all steps, navigate to /Home after a short delay
          if (nextStep === 0) {
            setTimeout(() => {
              navigateToHome();
            }); // 2 second delay to show completion
          }
          
          return nextStep;
        });
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [steps.length]);

  const handleStepClick = (index) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(index);
      // Mark clicked step and all previous steps as completed
      setCompletedSteps(prevCompleted => {
        const newCompleted = new Set(prevCompleted);
        for (let i = 0; i <= index; i++) {
          newCompleted.add(i);
        }
        return newCompleted;
      });
      setIsAnimating(false);
    }, 200);
  };

  const handleNextStep = () => {
    const nextStep = (currentStep + 1) % steps.length;
    setCompletedSteps(prevCompleted => new Set([...prevCompleted, currentStep]));
    
    // If completing the last step, navigate to /Home
    if (currentStep === steps.length - 1) {
      setTimeout(() => {
        navigateToHome();
      }, 1000);
    } else {
      setCurrentStep(nextStep);
    }
  };

  const allStepsCompleted = completedSteps.size === steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center py-12 px-6">
          <div className="animate-fade-in-down">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Voice Command Guide
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Learn how to navigate the development environment using voice commands
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-400/30">
                <Code className="w-4 h-4 text-green-400" />
                <span className="text-green-300">Development</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/30">
                <Server className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">Environment</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-400/30">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300">Production Ready</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full">
            {/* Step Indicators */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-4">
                {steps.map((_, index) => (
                  <React.Fragment key={index}>
                    <button
                      onClick={() => handleStepClick(index)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 hover:scale-110 relative ${
                        index === currentStep
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30'
                          : completedSteps.has(index)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {completedSteps.has(index) ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        index + 1
                      )}
                    </button>
                    {index < steps.length - 1 && (
                      <ArrowRight className={`w-6 h-6 transition-colors duration-300 ${
                        completedSteps.has(index) ? 'text-emerald-400' : 'text-gray-600'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Completion Message */}
            {allStepsCompleted && (
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-600/20 border border-green-400/30 rounded-full animate-pulse">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-green-300 font-semibold">All Steps Completed! Redirecting to Home...</span>
                </div>
              </div>
            )}

            {/* Current Step Display */}
            <div className="text-center mb-12">
              <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${steps[currentStep].color} mb-6 animate-pulse-slow`}>
                  {steps[currentStep].icon}
                </div>
                <h2 className="text-4xl font-bold mb-4 text-white">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xl text-gray-300 mb-2">
                  {steps[currentStep].description}
                </p>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  {steps[currentStep].detail}
                </p>
              </div>
            </div>

            {/* Visual Demonstration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Visual Demo */}
              <div className="flex justify-center">
                <div className={`relative p-8 rounded-2xl ${steps[currentStep].bgColor} border ${steps[currentStep].borderColor} backdrop-blur-lg transition-all duration-500`}>
                  {currentStep === 0 && (
                    <div className="animate-bounce-in">
                      <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 animate-pulse">
                        <Mic className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 animate-pulse">
                        <MousePointer className="w-8 h-8 text-emerald-400" />
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 1 && (
                    <div className="animate-bounce-in">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Volume2 className="w-16 h-16 text-white animate-pulse" />
                        </div>
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-white text-black px-4 py-2 rounded-lg font-semibold animate-bounce">
                            "Hello"
                          </div>
                        </div>
                        {/* Sound waves */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute border-2 border-green-400 rounded-full animate-ping"
                              style={{
                                width: `${140 + i * 20}px`,
                                height: `${140 + i * 20}px`,
                                animationDelay: `${i * 0.3}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="animate-bounce-in text-center">
                      <Eye className="w-16 h-16 text-teal-400 mx-auto mb-4 animate-pulse" />
                      <div className="bg-gradient-to-r from-teal-500 to-green-500 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-3">Final Expenses</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-white">
                            <span>Development Costs:</span>
                            <span>$2,450</span>
                          </div>
                          <div className="flex justify-between text-white">
                            <span>Server Expenses:</span>
                            <span>$890</span>
                          </div>
                          <div className="flex justify-between text-white font-bold border-t pt-2">
                            <span>Total:</span>
                            <span>$3,340</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <div className="animate-bounce-in">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Mic className="w-16 h-16 text-white animate-pulse" />
                        </div>
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-white text-black px-4 py-2 rounded-lg font-semibold animate-bounce">
                            "Tripo"
                          </div>
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                          <Zap className="w-8 h-8 text-green-400 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Step Details */}
              <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <div className="space-y-6">
                  <div className={`p-6 rounded-xl ${steps[currentStep].bgColor} border ${steps[currentStep].borderColor} backdrop-blur-lg`}>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      What Happens Next?
                    </h3>
                    {currentStep === 0 && (
                      <p className="text-gray-300">
                        Your browser will request microphone permission. Click "Allow" to enable voice recognition. 
                        The microphone icon will glow to indicate it's listening for your commands.
                      </p>
                    )}
                    {currentStep === 1 && (
                      <p className="text-gray-300">
                        The system will recognize your "Hello" command and activate the first stage. 
                        You'll see visual confirmation that the voice command was received successfully.
                      </p>
                    )}
                    {currentStep === 2 && (
                      <p className="text-gray-300">
                        A detailed expense report will appear, showing all development costs, server expenses, 
                        and total project costs. Review this information before proceeding.
                      </p>
                    )}
                    {currentStep === 3 && (
                      <p className="text-gray-300">
                        The "Tripo" command will unlock the full development environment dashboard with 
                        real-time metrics, environment status, and development tools. After completion, you'll be redirected to the Home page.
                      </p>
                    )}
                  </div>

                  <div className={`p-6 rounded-xl bg-gray-800/50 border border-gray-600/30 backdrop-blur-lg`}>
                    <h3 className="text-xl font-semibold mb-3 text-emerald-400">Pro Tips:</h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Speak clearly and at normal volume</li>
                      <li>• Wait for visual confirmation between steps</li>
                      <li>• Ensure your microphone is working properly</li>
                      <li>• Try again if a command isn't recognized</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center py-8">
          <button
            onClick={handleNextStep}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg font-semibold hover:from-emerald-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Home className="w-5 h-5" />
                Complete & Go Home
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Next Step
              </>
            )}
          </button>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in-down { animation: fade-in-down 1s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default VoiceCommandGuidance;