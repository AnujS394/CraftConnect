import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Language, Craft } from '../App';

interface VoiceRegistrationProps {
  language: Language;
  onComplete: (craft: Craft, name: string) => void;
}

const translations = {
  hindi: {
    title: 'आप क्या बनाते हैं?',
    subtitle: 'Tell us what you make',
    listening: 'सुन रहे हैं...',
    speak: 'माइक दबाएं और बोलें',
  },
  bengali: {
    title: 'আপনি কী তৈরি করেন?',
    subtitle: 'Tell us what you make',
    listening: 'শুনছি...',
    speak: 'মাইক্রোফোন চাপুন এবং বলুন',
  },
  tamil: {
    title: 'நீங்கள் என்ன செய்கிறீர்கள்?',
    subtitle: 'Tell us what you make',
    listening: 'கேட்கிறேன்...',
    speak: 'மைக்கை அழுத்தி பேசுங்கள்',
  },
  telugu: {
    title: 'మీరు ఏమి తయారు చేస్తారు?',
    subtitle: 'Tell us what you make',
    listening: 'వింటున్నాను...',
    speak: 'మైక్ నొక్కి మాట్లాడండి',
  },
  marathi: {
    title: 'तुम्ही काय बनवता?',
    subtitle: 'Tell us about your craft',
    listening: 'ऐकत आहे...',
    speak: 'माईक दाबा आणि बोला',
  },
  english: {
    title: 'What do you make?',
    subtitle: 'Tell us about your craft',
    listening: 'Listening...',
    speak: 'Press mic and speak',
  },
};

const craftOptions: { craft: Craft; icon: string; label: string }[] = [
  { craft: 'pottery', icon: '🏺', label: 'Pottery' },
  { craft: 'weaving', icon: '🧵', label: 'Weaving' },
  { craft: 'painting', icon: '🎨', label: 'Painting' },
  { craft: 'woodwork', icon: '🪵', label: 'Woodwork' },
  { craft: 'metalwork', icon: '⚒️', label: 'Metalwork' },
];

export function VoiceRegistration({ language, onComplete }: VoiceRegistrationProps) {
  const [isListening, setIsListening] = useState(false);
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const t = translations[language] || translations.english;

  const handleMicClick = () => {
    setIsListening(true);
    // Simulate voice recognition after 2 seconds
    setTimeout(() => {
      setIsListening(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleCraftSelect = (craft: Craft) => {
    setSelectedCraft(craft);
    setTimeout(() => {
      // Simulate voice confirmation
      onComplete(craft, 'Ramesh'); // Mock name
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FBF8F3] to-[#E8F5E9]">
      {/* Title */}
      <div className="pt-12 pb-6 px-6 text-center">
        <h2 className="text-3xl text-[#2E7D32] mb-2">{t.title}</h2>
        <p className="text-lg text-[#558B2F]">{t.subtitle}</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        {!showConfirmation ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.button
              onClick={handleMicClick}
              className="w-44 h-44 rounded-full bg-[#FF6F00] flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
              animate={isListening ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 0 0 rgba(255, 111, 0, 0.4)',
                  '0 0 0 20px rgba(255, 111, 0, 0)',
                  '0 0 0 0 rgba(255, 111, 0, 0)',
                ],
              } : {}}
              transition={{ duration: 1.5, repeat: isListening ? Infinity : 0 }}
            >
              <span className="text-8xl">🎤</span>
            </motion.button>

            <p className="text-2xl text-[#2E7D32] mt-10 text-center px-4">
              {isListening ? t.listening : t.speak}
            </p>

            {/* Waveform animation when listening */}
            {isListening && (
              <div className="flex gap-2 mt-10">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 bg-[#FF6F00] rounded-full"
                    animate={{
                      height: [20, 50, 20],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
            <p className="text-2xl text-[#2E7D32] text-center mb-8 mt-6">Select your craft:</p>
            <div className="space-y-4">
              {craftOptions.map((option) => (
                <button
                  key={option.craft}
                  onClick={() => handleCraftSelect(option.craft)}
                  className="w-full bg-white p-6 rounded-2xl shadow-md border-2 border-transparent hover:border-[#FF6F00] active:scale-95 transition-all flex items-center gap-5"
                >
                  <span className="text-5xl">{option.icon}</span>
                  <span className="text-2xl text-[#2E7D32]">{option.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-10"></div>
    </div>
  );
}