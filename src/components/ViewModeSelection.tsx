import { Language } from '../App';
import { motion } from 'motion/react';

interface ViewModeSelectionProps {
  language: Language;
  onSelectMode: (mode: 'buyer' | 'seller') => void;
}

const translations = {
  hindi: {
    title: 'आप कैसे जारी रखना चाहेंगे?',
    subtitle: 'How would you like to continue?',
    buyer: 'खरीदार के रूप में',
    buyerDesc: 'Browse and buy products',
    seller: 'विक्रेता के रूप में',
    sellerDesc: 'Sell your handmade products',
  },
  bengali: {
    title: 'আপনি কীভাবে চালিয়ে যেতে চান?',
    subtitle: 'How would you like to continue?',
    buyer: 'ক্রেতা হিসাবে',
    buyerDesc: 'Browse and buy products',
    seller: 'বিক্রেতা হিসাবে',
    sellerDesc: 'Sell your handmade products',
  },
  tamil: {
    title: 'நீங்கள் எவ்வாறு தொடர விரும்புகிறீர்கள்?',
    subtitle: 'How would you like to continue?',
    buyer: 'வாங்குபவராக',
    buyerDesc: 'Browse and buy products',
    seller: 'விற்பவராக',
    sellerDesc: 'Sell your handmade products',
  },
  telugu: {
    title: 'మీరు ఎలా కొనసాగించాలనుకుంటున్నారు?',
    subtitle: 'How would you like to continue?',
    buyer: 'కొనుగోలుదారుగా',
    buyerDesc: 'Browse and buy products',
    seller: 'అమ్మకందారుగా',
    sellerDesc: 'Sell your handmade products',
  },
  marathi: {
    title: 'तुम्ही कसे सुरू ठेवू इच्छिता?',
    subtitle: 'How would you like to continue?',
    buyer: 'खरेदीदार म्हणून',
    buyerDesc: 'Browse and buy products',
    seller: 'विक्रेता म्हणून',
    sellerDesc: 'Sell your handmade products',
  },
  english: {
    title: 'How would you like to continue?',
    subtitle: 'Choose your role',
    buyer: 'View as Buyer',
    buyerDesc: 'Browse and buy handmade products',
    seller: 'View as Seller',
    sellerDesc: 'Sell your handmade creations',
  },
};

export function ViewModeSelection({ language, onSelectMode }: ViewModeSelectionProps) {
  const t = translations[language] || translations.english;

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#FBF8F3] to-[#E8F5E9]">
      {/* Header */}
      <div className="pt-12 pb-8 px-6 text-center">
        <h2 className="text-3xl text-[#2E7D32] mb-2">{t.title}</h2>
        <p className="text-lg text-[#558B2F]">{t.subtitle}</p>
      </div>

      {/* Mode Selection Cards */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-6">
        <div className="space-y-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => onSelectMode('buyer')}
            className="w-full bg-white p-8 rounded-3xl shadow-xl border-2 border-transparent hover:border-[#2E7D32] active:scale-95 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#E8F5E9] flex items-center justify-center flex-shrink-0">
                <span className="text-5xl">🛍️</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl text-[#2E7D32] mb-2">{t.buyer}</h3>
                <p className="text-[#558B2F]">{t.buyerDesc}</p>
              </div>
              <span className="text-3xl text-[#2E7D32]">→</span>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => onSelectMode('seller')}
            className="w-full bg-gradient-to-br from-[#2E7D32] to-[#558B2F] p-8 rounded-3xl shadow-xl active:scale-95 transition-all"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl">🎨</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-2xl text-white mb-2">{t.seller}</h3>
                <p className="text-white/80">{t.sellerDesc}</p>
              </div>
              <span className="text-3xl text-white">→</span>
            </div>
          </motion.button>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-[#FFF3E0] p-5 rounded-2xl border-2 border-[#FF6F00]"
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <p className="text-[#FF6F00] flex-1">
              You can switch between buyer and seller mode anytime from your profile
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}