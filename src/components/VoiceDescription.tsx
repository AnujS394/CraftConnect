import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Language } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VoiceDescriptionProps {
  language: Language;
  onComplete: (payload: { title: string; description: string }) => void;
  imageUrl: string;
}

const translations = {
  hindi: {
    title: 'अपने उत्पाद के बारे में बताएं',
    subtitle: 'Describe your product',
    listening: 'सुन रहे हैं...',
    speak: 'बोलें',
    example: 'Example: "Handmade clay pot, traditional design"',
  },
  bengali: {
    title: 'আপনার পণ্য বর্ণনা করুন',
    subtitle: 'Describe your product',
    listening: 'শুনছি...',
    speak: 'বলুন',
    example: 'Example: "Handmade clay pot, traditional design"',
  },
  tamil: {
    title: 'உங்கள் தயாரிப்பை விவரிக்கவும்',
    subtitle: 'Describe your product',
    listening: 'கேட்கிறேன்...',
    speak: 'பேசு',
    example: 'Example: "Handmade clay pot, traditional design"',
  },
  telugu: {
    title: 'మీ ఉత్పత్తిని వివరించండి',
    subtitle: 'Describe your product',
    listening: 'వింటున్నాను...',
    speak: 'మాట్లాడండి',
    example: 'Example: "Handmade clay pot, traditional design"',
  },
  marathi: {
    title: 'तुमच्या उत्पादनाचे वर्णन करा',
    subtitle: 'Describe your product',
    listening: 'ऐकत आहे...',
    speak: 'बोला',
    example: 'Example: "Handmade clay pot, traditional design"',
  },
  english: {
    title: 'Describe your product',
    subtitle: 'Tell us about it',
    listening: 'Listening...',
    speak: 'Speak',
    example: 'Example: "Handmade clay pot, traditional design"',
  },
};

export function VoiceDescription({ language, onComplete, imageUrl }: VoiceDescriptionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [translated, setTranslated] = useState<string | null>(null);
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const t = translations[language] || translations.english;

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const win = window as any;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRec) {
      const r = new SpeechRec();
      r.lang = 'en-US';
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.onresult = (ev: any) => {
        const text = ev.results[0][0].transcript;
        setTranscription(text);
        // auto-translate if enabled
        if (translateEnabled) {
          doTranslate(text, language);
        }
      };
      r.onerror = () => {
        setIsListening(false);
      };
      r.onend = () => setIsListening(false);
      recognitionRef.current = r;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current = null;
      }
    };
  }, [translateEnabled, language]);

  const handleMicClick = () => {
    setTranscription('');
    setTranslated(null);
    setIsListening(true);

    const rec = recognitionRef.current as any | null;
    if (rec) {
      try {
        rec.start();
      } catch (e) {
        // some browsers throw if started twice; ignore
      }
      return;
    }

    // Fallback if SpeechRecognition not available
    setTimeout(() => {
      const mockDescription = 'Handmade clay pot with traditional design, perfect for home decor';
      setTranscription(mockDescription);
      setIsListening(false);
      if (translateEnabled) doTranslate(mockDescription, language);
    }, 1200);
  };

  const extractTitleFromText = (text: string) => {
    // Heuristic: if user says "<title>, <description>" use part before comma as title.
    if (!text) return '';
    const commaSplit = text.split(/,|\.|;/).map(s => s.trim()).filter(Boolean);
    if (commaSplit.length > 1) {
      return capitalizeWords(commaSplit[0]);
    }
    // Otherwise use first 3 words as title
    const words = text.split(/\s+/).filter(Boolean);
    return capitalizeWords(words.slice(0, Math.min(4, words.length)).join(' '));
  };

  const capitalizeWords = (s: string) =>
    s.replace(/\b\w/g, (c) => c.toUpperCase());

  const stopListening = () => {
    const rec = recognitionRef.current as any | null;
    if (rec) {
      try { rec.stop(); } catch {}
    }
    setIsListening(false);
  };

  const doTranslate = async (text: string, lang: string) => {
    setIsTranslating(true);
    // Mock translation for demo purposes. Replace with real API/model.
    await new Promise((r) => setTimeout(r, 600));
    // Basic demos for a couple languages
    const demoMap: Record<string, string> = {
      hindi: 'हाथ से बनी मिट्टी का बर्तन पारंपरिक डिज़ाइन, घर की सजावट के लिए उत्तम',
      bengali: 'হ্যান্ডমেড মাটি পাত্র, ঐতিহ্যবাহী ডিজাইন, বাড়ির সাজসই',
      tamil: 'கையேந்திய மண் பானை பழமையான வடிவம், வீட்டு அலங்காரத்திற்கு சிறந்தது',
      telugu: 'చేతిద్దిన మట్టి బాణ్సి సంప్రదాయ డిజైన్, ఇంటి అలంకరణకు తగ్గది',
      marathi: 'हाताने बनवलेले मातीचे भांडे पारंपारिक डिझाइन, घराच्या सजावटीसाठी उत्तम',
      english: text,
    };

    setTranslated(demoMap[lang as keyof typeof demoMap] ?? `${text} (translated)`);
    setIsTranslating(false);
  };

  return (
    <div className="h-full flex flex-col p-6 bg-gradient-to-b from-[#FBF8F3] to-[#E8F5E9] pb-28">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl text-[#2E7D32] mb-1">{t.title}</h2>
        <p className="text-lg text-[#558B2F]">{t.subtitle}</p>
      </div>

      {/* Product Image Preview */}
      <div className="w-full h-48 rounded-2xl overflow-hidden shadow-lg mb-6">
        <ImageWithFallback
          src={imageUrl}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Microphone */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.button
          onClick={isListening ? stopListening : handleMicClick}
          className="w-32 h-32 rounded-full bg-[#FF6F00] flex items-center justify-center shadow-2xl active:scale-95 transition-transform disabled:opacity-50"
          animate={isListening ? {
            scale: [1, 1.08, 1],
            boxShadow: [
              '0 0 0 0 rgba(255, 111, 0, 0.4)',
              '0 0 0 18px rgba(255, 111, 0, 0)',
              '0 0 0 0 rgba(255, 111, 0, 0)',
            ],
          } : {}}
          transition={{ duration: 1.2, repeat: isListening ? Infinity : 0 }}
        >
          <span className="text-6xl">{isListening ? '🔴' : '🎤'}</span>
        </motion.button>

        <p className="text-xl text-[#2E7D32] mt-6 text-center">
          {isListening ? t.listening : t.speak}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={translateEnabled}
              onChange={(e) => {
                setTranslateEnabled(e.target.checked);
                if (e.target.checked && transcription) doTranslate(transcription, language);
                if (!e.target.checked) setTranslated(null);
              }}
            />
            <span className="text-sm text-[#558B2F]">Show translation</span>
          </label>

          {isTranslating && <span className="text-sm text-[#FF6F00]">Translating…</span>}
        </div>

        {/* Waveform animation */}
        {isListening && (
          <div className="flex gap-2 mt-6">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 bg-[#FF6F00] rounded-full"
                animate={{
                  height: [20, 50, 20],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            ))}
          </div>
        )}

        {/* Transcription */}
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white p-4 rounded-xl shadow-md w-full"
          >
            <p className="text-[#2E7D32] text-center">"{transcription}"</p>
            {translateEnabled && translated && (
              <p className="text-sm text-[#2E7D32] text-center mt-2">Translated: "{translated}"</p>
            )}

            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  // Finalize — extract a title heuristically and send original transcription (not translated)
                  const title = extractTitleFromText(transcription || '');
                  onComplete({ title, description: transcription });
                }}
                className="px-6 py-3 rounded-xl bg-[#2E7D32] text-white"
              >
                Use this description
              </button>

              <button
                onClick={() => {
                  setTranscription('');
                  setTranslated(null);
                }}
                className="px-4 py-2 rounded-xl border border-[#2E7D32] text-[#2E7D32]"
              >
                Re-record
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Example Hint */}
      {!isListening && !transcription && (
        <div className="bg-[#E8F5E9] p-4 rounded-xl border-2 border-[#2E7D32] border-dashed">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-[#2E7D32] text-sm">{t.example}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
