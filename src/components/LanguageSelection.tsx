import { Language } from '../App';

interface LanguageSelectionProps {
  onSelectLanguage: (language: Language) => void;
}

const languages = [
  { code: 'hindi' as Language, name: 'हिंदी', nativeName: 'Hindi', flag: '🇮🇳' },
  { code: 'bengali' as Language, name: 'বাংলা', nativeName: 'Bengali', flag: '🇮🇳' },
  { code: 'tamil' as Language, name: 'தமிழ்', nativeName: 'Tamil', flag: '🇮🇳' },
  { code: 'telugu' as Language, name: 'తెలుగు', nativeName: 'Telugu', flag: '🇮🇳' },
  { code: 'marathi' as Language, name: 'मराठी', nativeName: 'Marathi', flag: '🇮🇳' },
  { code: 'english' as Language, name: 'English', nativeName: 'English', flag: '🇬🇧' },
];

export function LanguageSelection({ onSelectLanguage }: LanguageSelectionProps) {
  return (
    <div className="h-full flex flex-col bg-[#FBF8F3] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 pt-10 pb-6 px-6 text-center">
        <h2 className="text-3xl text-[#2E7D32] mb-2">Choose Your Language</h2>
        <p className="text-xl text-[#558B2F]">अपनी भाषा चुनें</p>
      </div>

      {/* Language Cards */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="space-y-4 pb-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className="w-full bg-white p-5 rounded-2xl shadow-md border-2 border-transparent hover:border-[#FF6F00] active:scale-95 transition-all flex items-center gap-4"
            >
              <span className="text-4xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <div className="text-xl text-[#2E7D32] mb-1">{lang.name}</div>
                <div className="text-base text-gray-600">{lang.nativeName}</div>
              </div>
              <span className="text-2xl text-[#2E7D32]">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}