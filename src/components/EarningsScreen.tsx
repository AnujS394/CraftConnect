import { motion } from 'motion/react';
import { User } from '../App';

interface EarningsScreenProps {
  user: User;
  onBack: () => void;
}

const earningsData = {
  today: 1200,
  thisWeek: 5400,
  thisMonth: 18600,
  total: 45000,
  pending: 2400,
};

const recentTransactions = [
  { date: 'Today', amount: 450, status: 'received', product: 'Clay Pot' },
  { date: 'Today', amount: 600, status: 'received', product: 'Woven Basket' },
  { date: 'Yesterday', amount: 800, status: 'received', product: 'Traditional Pottery' },
  { date: '2 days ago', amount: 1200, status: 'pending', product: 'Painted Vase' },
];

export function EarningsScreen({ user, onBack }: EarningsScreenProps) {
  return (
    <div className="min-h-full pb-28 bg-[#FBF8F3]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2E7D32] to-[#558B2F] p-6 pb-12">
        <button
          onClick={onBack}
          className="text-white text-2xl mb-4 active:scale-90 transition-transform"
        >
          ← Back
        </button>
        <h1 className="text-white text-3xl mb-2">My Earnings</h1>
        <p className="text-white/80 text-lg">Track your income</p>
      </div>

      <div className="p-6 -mt-6">
        {/* Main Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <p className="text-[#558B2F] mb-2">Total Available</p>
          <p className="text-5xl text-[#2E7D32] mb-6">₹{earningsData.total.toLocaleString()}</p>
          
          <button className="w-full bg-[#FF6F00] text-white py-4 rounded-2xl shadow-lg active:scale-95 transition-transform text-xl flex items-center justify-center gap-2">
            <span>💳</span>
            <span>Withdraw to UPI</span>
          </button>
          
          <div className="mt-4 bg-[#E8F5E9] p-3 rounded-xl">
            <p className="text-[#2E7D32] text-sm text-center">
              ✓ Payment received within 24 hours
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-md"
          >
            <p className="text-[#558B2F] text-sm mb-1">This Week</p>
            <p className="text-2xl text-[#2E7D32]">₹{earningsData.thisWeek.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-md"
          >
            <p className="text-[#558B2F] text-sm mb-1">This Month</p>
            <p className="text-2xl text-[#2E7D32]">₹{earningsData.thisMonth.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Simple Bar Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-md mb-6"
        >
          <h3 className="text-xl text-[#2E7D32] mb-4">Weekly Earnings</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const heights = [60, 45, 80, 70, 90, 100, 75];
              return (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heights[index]}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-[#2E7D32] to-[#66BB6A] rounded-t-lg"
                  />
                  <p className="text-xs text-[#558B2F] mt-2">{day}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <h3 className="text-xl text-[#2E7D32] mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-[#2E7D32]">{transaction.product}</p>
                  <p className="text-sm text-[#558B2F]">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl text-[#2E7D32]">₹{transaction.amount}</p>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'received'
                      ? 'bg-[#E8F5E9] text-[#2E7D32]'
                      : 'bg-[#FFF3E0] text-[#FF6F00]'
                  }`}>
                    {transaction.status === 'received' ? '✓ Received' : '⏳ Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Voice Command Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-[#E8F5E9] p-4 rounded-xl border-2 border-[#2E7D32] border-dashed"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎤</span>
            <p className="text-[#2E7D32] text-sm">Say "Withdraw money" to start withdrawal</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
