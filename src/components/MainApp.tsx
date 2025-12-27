import { useState } from 'react';
import { User } from '../App';
import { HomeScreen } from './HomeScreen';
import { SellFlow } from './SellFlow';
import { OrdersScreen } from './OrdersScreen';
import { EarningsScreen } from './EarningsScreen';
import { ProfileSwitcher } from './ProfileSwitcher';

interface MainAppProps {
  user: User;
  viewMode: 'buyer' | 'seller';
  onModeChange: (mode: 'buyer' | 'seller') => void;
}

type Tab = 'home' | 'sell' | 'orders' | 'earnings';

export function MainApp({ user, viewMode, onModeChange }: MainAppProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <div className="h-full flex flex-col bg-[#FBF8F3]">
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Switcher - scrolls with content */}
        <div className="sticky top-0 z-40 bg-[#FBF8F3] p-4 border-b border-gray-200">
          <ProfileSwitcher currentMode={viewMode} onModeChange={onModeChange} />
        </div>

        {activeTab === 'home' && (
          <HomeScreen 
            user={user} 
            onNavigateToSell={() => setActiveTab('sell')} 
            onNavigateToEarnings={() => setActiveTab('earnings')}
          />
        )}
        {activeTab === 'sell' && <SellFlow user={user} />}
        {activeTab === 'orders' && <OrdersScreen user={user} />}
        {activeTab === 'earnings' && (
          <EarningsScreen user={user} onBack={() => setActiveTab('home')} />
        )}
      </div>

      {/* Bottom Navigation */}
      {activeTab !== 'earnings' && (
        <div className="bg-white border-t-2 border-[#E0E0E0] flex items-center justify-around px-4 py-3 shadow-lg">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all ${
              activeTab === 'home' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-gray-500'
            }`}
          >
            <span className="text-3xl">{activeTab === 'home' ? '🏠' : '🏘️'}</span>
            <span className="text-sm">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('sell')}
            className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all ${
              activeTab === 'sell' ? 'bg-[#FFF3E0] text-[#FF6F00]' : 'text-gray-500'
            }`}
          >
            <span className="text-3xl">{activeTab === 'sell' ? '➕' : '⊕'}</span>
            <span className="text-sm">Sell</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-all ${
              activeTab === 'orders' ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-gray-500'
            }`}
          >
            <span className="text-3xl">{activeTab === 'orders' ? '📦' : '📭'}</span>
            <span className="text-sm">Orders</span>
          </button>
        </div>
      )}
    </div>
  );
}