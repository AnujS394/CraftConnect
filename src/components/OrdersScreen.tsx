import { motion } from 'motion/react';
import { User } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrdersScreenProps {
  user: User;
}

interface Order {
  id: string;
  productName: string;
  productImage: string;
  buyerLocation: string;
  status: 'processing' | 'shipped' | 'delivered';
  price: number;
  date: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    productName: 'Handmade Clay Pot',
    productImage: 'https://images.unsplash.com/photo-1761210719325-283557e92487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBib3dsfGVufDF8fHx8MTc2NjY2ODc3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    buyerLocation: 'Mumbai',
    status: 'processing',
    price: 450,
    date: '2 hours ago',
  },
  {
    id: '2',
    productName: 'Woven Basket',
    productImage: 'https://images.unsplash.com/photo-1760328773324-f9e8082c7cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGJhc2tldCUyMHdlYXZpbmd8ZW58MXx8fHwxNzY2NzU2MDU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    buyerLocation: 'Delhi',
    status: 'shipped',
    price: 600,
    date: '1 day ago',
  },
  {
    id: '3',
    productName: 'Traditional Pottery',
    productImage: 'https://images.unsplash.com/photo-1760764541302-e3955fbc6b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwb3R0ZXJ5JTIwY2xheSUyMGhhbmRtYWRlfGVufDF8fHx8MTc2Njc1NTk5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    buyerLocation: 'Bangalore',
    status: 'delivered',
    price: 800,
    date: '3 days ago',
  },
];

const statusConfig = {
  processing: { icon: '⏳', color: 'bg-[#FFF3E0] text-[#FF6F00]', label: 'Processing' },
  shipped: { icon: '🚚', color: 'bg-[#E3F2FD] text-[#1976D2]', label: 'Shipped' },
  delivered: { icon: '✅', color: 'bg-[#E8F5E9] text-[#2E7D32]', label: 'Delivered' },
};

export function OrdersScreen({ user }: OrdersScreenProps) {
  return (
    <div className="min-h-full px-6 pt-6 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl text-[#2E7D32] mb-2">My Orders</h1>
        <p className="text-xl text-[#558B2F]">{mockOrders.length} orders in total</p>
      </div>

      {/* Voice Command Hint */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#E8F5E9] p-5 rounded-2xl border-2 border-[#2E7D32] border-dashed mb-6"
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">🎤</span>
          <p className="text-[#2E7D32]">Say "Next order" or "Mark as shipped"</p>
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="space-y-5">
        {mockOrders.map((order, index) => {
          const statusInfo = statusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="flex gap-5 p-5">
                {/* Product Image */}
                <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={order.productImage}
                    alt={order.productName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl text-[#2E7D32] mb-2 truncate">{order.productName}</h3>
                  <div className="flex items-center gap-2 text-[#558B2F] mb-2">
                    <span className="text-xl">📍</span>
                    <span>{order.buyerLocation}</span>
                  </div>
                  <p className="text-2xl text-[#2E7D32]">₹{order.price}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`${statusInfo.color} px-5 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{statusInfo.icon}</span>
                  <span className="text-lg">{statusInfo.label}</span>
                </div>
                {order.status === 'processing' && (
                  <button className="bg-white px-5 py-2 rounded-xl active:scale-95 transition-transform">
                    Mark as Shipped →
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-gradient-to-br from-[#2E7D32] to-[#558B2F] rounded-3xl p-8 shadow-xl"
      >
        <p className="text-white/90 text-lg mb-2">Total Orders Value</p>
        <p className="text-white text-4xl mb-6">
          ₹{mockOrders.reduce((sum, order) => sum + order.price, 0)}
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-white text-3xl">1</p>
            <p className="text-white/80 text-sm mt-1">Processing</p>
          </div>
          <div className="text-center">
            <p className="text-white text-3xl">1</p>
            <p className="text-white/80 text-sm mt-1">Shipped</p>
          </div>
          <div className="text-center">
            <p className="text-white text-3xl">1</p>
            <p className="text-white/80 text-sm mt-1">Delivered</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}