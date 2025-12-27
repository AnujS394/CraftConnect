import { User } from '../App';
import { motion } from 'motion/react';

interface HomeScreenProps {
  user: User;
  onNavigateToSell: () => void;
  onNavigateToEarnings?: () => void;
}

export function HomeScreen({ user, onNavigateToSell, onNavigateToEarnings }: HomeScreenProps) {
  return (
    <div className="min-h-full px-6 pt-6 pb-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-4xl text-[#2E7D32]">
          Hello {user.name} 👋
        </h1>
        <p className="text-lg text-[#558B2F] mt-2">Welcome back to CraftConnect</p>
      </motion.div>

      {/* Earnings Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#2E7D32] to-[#558B2F] rounded-3xl p-8 shadow-xl mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-lg mb-2">Today's Earnings</p>
            <p className="text-white text-5xl">₹1,200</p>
          </div>
          <div className="text-6xl">💰</div>
        </div>
        <div className="mt-4 flex gap-2 text-white/90">
          <span>↗️ +15% from yesterday</span>
        </div>
      </motion.div>

      {/* Action Cards */}
      <div className="space-y-5">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onNavigateToSell}
          className="w-full bg-[#FF6F00] text-white p-7 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-5">
            <span className="text-6xl">📸</span>
            <div className="flex-1 text-left">
              <p className="text-2xl">Add New Product</p>
              <p className="text-white/90 mt-1 text-lg">Take photo & sell</p>
            </div>
            <span className="text-4xl">→</span>
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full bg-white p-7 rounded-2xl shadow-md"
        >
          <div className="flex items-center gap-5">
            <span className="text-6xl">📦</span>
            <div className="flex-1 text-left">
              <p className="text-2xl text-[#2E7D32]">My Orders</p>
              <p className="text-[#558B2F] mt-1 text-lg">3 pending orders</p>
            </div>
            <div className="bg-[#FF6F00] text-white w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-xl">3</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onNavigateToEarnings}
          className="w-full bg-white p-7 rounded-2xl shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-5">
            <span className="text-6xl">💳</span>
            <div className="flex-1 text-left">
              <p className="text-2xl text-[#2E7D32]">My Earnings</p>
              <p className="text-[#558B2F] mt-1 text-lg">View payment history</p>
            </div>
            <span className="text-4xl text-[#2E7D32]">→</span>
          </div>
        </motion.div>
      </div>

      {/* Voice Command Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-[#E8F5E9] p-5 rounded-2xl border-2 border-[#2E7D32] border-dashed"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">💡</span>
          <div>
            <p className="text-[#2E7D32] text-lg">Try saying:</p>
            <p className="text-[#558B2F]">"Add new product" or "Show my orders"</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}