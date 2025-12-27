import { ImageWithFallback } from './figma/ImageWithFallback';

interface WelcomeScreenProps {
  onLogin: () => void;
}

export function WelcomeScreen({ onLogin }: WelcomeScreenProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#E8F5E9] to-[#FBF8F3]">
      {/* Top Section - Logo and Tagline */}
      <div className="pt-12 pb-6 px-8">
        <div className="text-center">
          <h1 className="text-5xl text-[#2E7D32] mb-3">CraftConnect</h1>
          <p className="text-xl text-[#558B2F]">कारीगर से खरीदार तक</p>
          <p className="text-sm text-[#558B2F] mt-1">Artisan to Buyer</p>
        </div>
      </div>

      {/* Middle Section - Illustration */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-xs">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760156885430-cd0bd9609ff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBhcnRpc2FuJTIwaGFuZGljcmFmdCUyMHBvdHRlcnl8ZW58MXx8fHwxNzY2NzU1OTkyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Indian artisan"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Features */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-3 text-[#2E7D32]">
              <span className="text-xl">✓</span>
              <span className="text-sm">Direct connection with artisans</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E7D32]">
              <span className="text-xl">✓</span>
              <span className="text-sm">Voice-first, easy to use</span>
            </div>
            <div className="flex items-center gap-3 text-[#2E7D32]">
              <span className="text-xl">✓</span>
              <span className="text-sm">Support local crafts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Login Button */}
      <div className="p-8 pb-10">
        <button
          onClick={onLogin}
          className="w-full bg-[#2E7D32] text-white py-6 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          <span className="text-3xl">📱</span>
          <span className="text-xl">Login / Sign Up</span>
        </button>
      </div>
    </div>
  );
}