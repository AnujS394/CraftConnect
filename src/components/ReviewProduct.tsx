import { useState } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReviewProductProps {
  imageUrl: string;
  description: string;
  title?: string;
  onPublish: () => void;
}

export function ReviewProduct({ imageUrl, description, title, onPublish }: ReviewProductProps) {
  const [price, setPrice] = useState(450);
  const [productTitle] = useState(title ?? 'Handmade Clay Pot');

  const adjustPrice = (delta: number) => {
    setPrice(Math.max(50, price + delta));
  };

  return (
    <div className="h-full flex flex-col bg-[#FBF8F3] pb-28 overflow-y-auto">
      {/* Header */}
      <div className="bg-[#2E7D32] text-white p-6 pb-8">
        <h2 className="text-2xl text-center">Review Product</h2>
        <p className="text-white/80 text-center mt-1">Confirm details before publishing</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Enhanced Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-full h-64 rounded-2xl overflow-hidden shadow-xl">
            <ImageWithFallback
              src={imageUrl}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-3 right-3 bg-[#2E7D32] text-white px-3 py-1 rounded-full text-sm">
            ✨ AI Enhanced
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-5 rounded-2xl shadow-md"
        >
          <label className="text-sm text-[#558B2F] mb-2 block">Product Name</label>
          <p className="text-2xl text-[#2E7D32]">{title}</p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 rounded-2xl shadow-md"
        >
          <label className="text-sm text-[#558B2F] mb-2 block">Description</label>
          <p className="text-lg text-[#2E7D32]">{description}</p>
        </motion.div>

        {/* Price Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 rounded-2xl shadow-md"
        >
          <label className="text-sm text-[#558B2F] mb-3 block">Price (AI Suggested)</label>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => adjustPrice(-50)}
              className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-3xl active:scale-90 transition-transform"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <p className="text-4xl text-[#2E7D32]">₹{price}</p>
            </div>
            <button
              onClick={() => adjustPrice(50)}
              className="w-14 h-14 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-3xl active:scale-90 transition-transform"
            >
              +
            </button>
          </div>
        </motion.div>

        {/* Voice Playback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#FFF3E0] p-4 rounded-xl border-2 border-[#FF6F00]"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔊</span>
            <div className="flex-1">
              <p className="text-[#FF6F00]">Listen to preview</p>
              <p className="text-[#FF6F00]/80 text-sm">"Is this correct?"</p>
            </div>
            <button className="w-12 h-12 rounded-full bg-[#FF6F00] text-white text-xl active:scale-90 transition-transform">
              ▶
            </button>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-white border-t-2 border-gray-200 space-y-3">
        <button
          onClick={onPublish}
          className="w-full bg-[#2E7D32] text-white py-5 rounded-2xl shadow-lg active:scale-95 transition-transform text-xl"
        >
          ✓ Publish Product
        </button>
        <button className="w-full bg-white text-[#FF6F00] py-5 rounded-2xl border-2 border-[#FF6F00] active:scale-95 transition-transform text-xl">
          🎤 Edit with Voice
        </button>
      </div>
    </div>
  );
}
