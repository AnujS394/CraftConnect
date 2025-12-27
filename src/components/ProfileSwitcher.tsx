import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileSwitcherProps {
  currentMode: 'buyer' | 'seller';
  onModeChange: (mode: 'buyer' | 'seller') => void;
}

export function ProfileSwitcher({ currentMode, onModeChange }: ProfileSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-[#2E7D32] rounded-full px-4 py-2 flex items-center gap-2 shadow-md active:scale-95 transition-transform"
      >
        <span className="text-xl">{currentMode === 'seller' ? '🎨' : '🛍️'}</span>
        <span className="text-sm text-[#2E7D32]">
          {currentMode === 'seller' ? 'Seller Mode' : 'Buyer Mode'}
        </span>
        <span className="text-[#2E7D32]">{isOpen ? '▲' : '▼'}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-xl border-2 border-[#E0E0E0] overflow-hidden z-50"
          >
            <button
              onClick={() => {
                onModeChange('buyer');
                setIsOpen(false);
              }}
              className={`w-full p-4 flex items-center gap-3 transition-colors ${
                currentMode === 'buyer'
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-2xl">🛍️</span>
              <div className="flex-1 text-left">
                <p className="text-sm">View as Buyer</p>
                <p className="text-xs opacity-70">Browse and buy products</p>
              </div>
              {currentMode === 'buyer' && <span className="text-[#2E7D32]">✓</span>}
            </button>

            <div className="border-t border-gray-200" />

            <button
              onClick={() => {
                onModeChange('seller');
                setIsOpen(false);
              }}
              className={`w-full p-4 flex items-center gap-3 transition-colors ${
                currentMode === 'seller'
                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="text-2xl">🎨</span>
              <div className="flex-1 text-left">
                <p className="text-sm">View as Seller</p>
                <p className="text-xs opacity-70">Sell your products</p>
              </div>
              {currentMode === 'seller' && <span className="text-[#2E7D32]">✓</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
