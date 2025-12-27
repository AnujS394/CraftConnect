import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';
import { ProfileSwitcher } from './ProfileSwitcher';

interface BuyerViewProps {
  viewMode: 'buyer' | 'seller';
  onModeChange: (mode: 'buyer' | 'seller') => void;
}

const products = [
  {
    id: '1',
    name: 'Handmade Clay Pot',
    price: 450,
    image: 'https://images.unsplash.com/photo-1761210719325-283557e92487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBib3dsfGVufDF8fHx8MTc2NjY2ODc3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    artisan: 'Ramesh Kumar',
    location: 'Rajasthan',
    craft: 'Pottery',
  },
  {
    id: '2',
    name: 'Traditional Woven Basket',
    price: 600,
    image: 'https://images.unsplash.com/photo-1760328773324-f9e8082c7cd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGJhc2tldCUyMHdlYXZpbmd8ZW58MXx8fHwxNzY2NzU2MDU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    artisan: 'Lakshmi Devi',
    location: 'West Bengal',
    craft: 'Weaving',
  },
  {
    id: '3',
    name: 'Folk Art Painting',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1764344814985-83e326ba7e0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBwYWludGluZyUyMGZvbGslMjBhcnR8ZW58MXx8fHwxNzY2NzU2MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    artisan: 'Priya Sharma',
    location: 'Madhya Pradesh',
    craft: 'Painting',
  },
  {
    id: '4',
    name: 'Wooden Handicraft',
    price: 850,
    image: 'https://images.unsplash.com/photo-1744893679733-1cf3c7837982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b29kd29yayUyMGhhbmRpY3JhZnR8ZW58MXx8fHwxNzY2NzU2MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    artisan: 'Vijay Singh',
    location: 'Kerala',
    craft: 'Woodwork',
  },
];

interface CartItem {
  product: typeof products[0];
  quantity: number;
}

export function BuyerView({ viewMode, onModeChange }: BuyerViewProps) {
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
  };

  const addToCart = (product: typeof products[0]) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart View
  if (showCart) {
    return (
      <div className="h-full flex flex-col bg-[#FBF8F3]">
        {/* Profile Switcher */}
        <div className="sticky top-0 z-40 bg-[#FBF8F3] p-4 border-b border-gray-200">
          <ProfileSwitcher currentMode={viewMode} onModeChange={onModeChange} />
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Header */}
          <div className="p-6">
            <button
              onClick={() => setShowCart(false)}
              className="text-[#2E7D32] text-2xl mb-4 active:scale-90 transition-transform"
            >
              ← Back
            </button>
            <h1 className="text-3xl text-[#2E7D32]">Shopping Cart</h1>
            <p className="text-lg text-[#558B2F] mt-1">{cartItemCount} items</p>
          </div>

          {/* Cart Items */}
          <div className="px-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <p className="text-xl text-[#558B2F]">Your cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-md">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-[#2E7D32] mb-1">{item.product.name}</h3>
                      <p className="text-xl text-[#FF6F00] mb-2">₹{item.product.price}</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xl active:scale-90 transition-transform"
                        >
                          −
                        </button>
                        <span className="text-lg text-[#2E7D32]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xl active:scale-90 transition-transform"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-2xl text-red-500 active:scale-90 transition-transform"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Checkout Footer */}
        {cart.length > 0 && (
          <div className="bg-white border-t-2 border-gray-200 p-6 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl text-[#558B2F]">Total:</span>
              <span className="text-3xl text-[#2E7D32]">₹{cartTotal}</span>
            </div>
            <button className="w-full bg-[#2E7D32] text-white py-5 rounded-2xl shadow-lg active:scale-95 transition-transform text-xl">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div className="h-full flex flex-col bg-[#FBF8F3]">
        {/* Profile Switcher */}
        <div className="sticky top-0 z-40 bg-[#FBF8F3] p-4 border-b border-gray-200">
          <ProfileSwitcher currentMode={viewMode} onModeChange={onModeChange} />
        </div>

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Back Button */}
          <div className="p-4">
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-[#2E7D32] text-2xl active:scale-90 transition-transform"
            >
              ← Back
            </button>
          </div>

          {/* Product Image */}
          <div className="w-full h-80 relative">
            <ImageWithFallback
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#2E7D32] text-white px-4 py-2 rounded-full flex items-center gap-2">
              <span>✓</span>
              <span>Verified Handmade</span>
            </div>
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl text-[#2E7D32] mb-2">{selectedProduct.name}</h1>
              <p className="text-4xl text-[#FF6F00]">₹{selectedProduct.price}</p>
            </div>

            {/* Artisan Card */}
            <div className="bg-[#E8F5E9] rounded-2xl p-5 border-2 border-[#2E7D32]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-full bg-[#2E7D32] flex items-center justify-center text-2xl">
                  👤
                </div>
                <div className="flex-1">
                  <p className="text-xl text-[#2E7D32]">{selectedProduct.artisan}</p>
                  <div className="flex items-center gap-2 text-[#558B2F]">
                    <span>📍</span>
                    <span>{selectedProduct.location}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-[#558B2F] text-sm">
                  "I have been making {selectedProduct.craft.toLowerCase()} for over 20 years. Each piece is handcrafted with care and traditional techniques passed down through generations."
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <h3 className="text-xl text-[#2E7D32] mb-3">About this product</h3>
              <p className="text-[#558B2F]">
                Authentic handmade {selectedProduct.craft.toLowerCase()} crafted using traditional methods. 
                Each piece is unique and supports rural artisans directly. Made with natural materials 
                and eco-friendly processes.
              </p>
            </div>

            {/* AI Chat for Questions */}
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl text-[#2E7D32]">Have questions?</h3>
                <span className="text-2xl">🤖</span>
              </div>
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full bg-[#FFF3E0] text-[#FF6F00] py-3 rounded-xl border-2 border-[#FF6F00] active:scale-95 transition-transform"
              >
                💬 Chat with AI Assistant
              </button>
              {showChat && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  <div className="bg-[#E8F5E9] p-3 rounded-xl">
                    <p className="text-[#2E7D32] text-sm">
                      Hi! I can help answer questions about this product, shipping, or custom orders. What would you like to know?
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border-t-2 border-gray-200 p-6 space-y-3">
          <button 
            onClick={() => {
              addToCart(selectedProduct);
              setSelectedProduct(null);
            }}
            className="w-full bg-[#FF6F00] text-white py-5 rounded-2xl shadow-lg active:scale-95 transition-transform text-xl"
          >
            🛒 Add to Cart
          </button>
          <button className="w-full bg-[#2E7D32] text-white py-5 rounded-2xl shadow-lg active:scale-95 transition-transform text-xl">
            💳 Buy Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#FBF8F3]">
      {/* Profile Switcher */}
      <div className="sticky top-0 z-40 bg-[#FBF8F3] p-4 border-b border-gray-200">
        <ProfileSwitcher currentMode={viewMode} onModeChange={onModeChange} />
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#558B2F] p-6 pb-8">
          <h1 className="text-white text-3xl mb-2">CraftConnect</h1>
          <p className="text-white/80 text-lg">Authentic handmade crafts</p>
        </div>

        <div className="p-6 -mt-2">
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-3 mb-6">
            <span className="text-2xl">🔍</span>
            <input
              type="text"
              placeholder="Search for products..."
              className="flex-1 bg-transparent outline-none text-[#2E7D32]"
            />
            <button className="text-2xl">🎤</button>
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
            {['All', 'Pottery', 'Weaving', 'Painting', 'Woodwork'].map((category) => (
              <button
                key={category}
                className={`px-5 py-2 rounded-full whitespace-nowrap ${
                  category === 'All'
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-white text-[#2E7D32] border-2 border-[#2E7D32]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Artisan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFF3E0] rounded-2xl p-5 mb-6 border-2 border-[#FF6F00]"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⭐</span>
              <h3 className="text-xl text-[#FF6F00]">Featured Artisan</h3>
            </div>
            <p className="text-[#FF6F00]/80">
              Supporting rural artisans directly. 100% of payment goes to the maker.
            </p>
          </motion.div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProductClick(product)}
                className="bg-white rounded-2xl overflow-hidden shadow-md active:scale-95 transition-transform"
              >
                <div className="relative h-40">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#2E7D32] text-white px-2 py-1 rounded-full text-xs">
                    ✓ Verified
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm text-[#2E7D32] mb-1 truncate">{product.name}</h3>
                  <p className="text-lg text-[#FF6F00] mb-2">₹{product.price}</p>
                  <div className="flex items-center gap-1 text-xs text-[#558B2F]">
                    <span>📍</span>
                    <span className="truncate">{product.location}</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-[#E8F5E9] p-4 rounded-xl border-2 border-[#2E7D32] border-dashed"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">💚</span>
              <p className="text-[#2E7D32] text-sm">
                Every purchase supports a rural artisan family
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowCart(true)}
          className="bg-[#FF6F00] text-white w-16 h-16 rounded-full shadow-2xl active:scale-90 transition-transform flex items-center justify-center relative"
        >
          <span className="text-3xl">🛒</span>
          {cartItemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-[#2E7D32] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">
              {cartItemCount}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}