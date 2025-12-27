import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const processingSteps = [
  { icon: '✨', text: 'Enhancing image...', duration: 1000 },
  { icon: '✍️', text: 'Writing description...', duration: 1500 },
  { icon: '💰', text: 'Calculating fair price...', duration: 1000 },
  { icon: '🌐', text: 'Publishing to buyers...', duration: 500 },
];

export function AIProcessing() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < processingSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, processingSteps[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#E8F5E9] to-[#FBF8F3]">
      {/* AI Animation */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="text-9xl mb-8"
      >
        🤖
      </motion.div>

      {/* Title */}
      <h2 className="text-3xl text-[#2E7D32] mb-12 text-center">AI is working...</h2>

      {/* Processing Steps */}
      <div className="space-y-6 w-full">
        {processingSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: currentStep >= index ? 1 : 0.3,
              x: 0,
            }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentStep > index
                ? 'bg-[#2E7D32]'
                : currentStep === index
                ? 'bg-[#FF6F00]'
                : 'bg-gray-200'
            }`}>
              {currentStep > index ? (
                <span className="text-2xl">✓</span>
              ) : (
                <span className="text-2xl">{step.icon}</span>
              )}
            </div>
            
            <div className="flex-1">
              <p className={`text-xl ${
                currentStep >= index ? 'text-[#2E7D32]' : 'text-gray-400'
              }`}>
                {step.text}
              </p>
            </div>

            {currentStep === index && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-3 border-[#FF6F00] border-t-transparent rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-3 rounded-full mt-12 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#FF6F00]"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / processingSteps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
