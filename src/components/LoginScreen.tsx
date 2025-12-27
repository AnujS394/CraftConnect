import { useState } from 'react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onSendOtp: (mobile: string) => void;
  onVerifyOtp: (
    code: string,
  ) => { success: boolean; reason?: 'expired' | 'invalid' } | Promise<{ success: boolean; reason?: 'expired' | 'invalid' }>;
}

export function LoginScreen({ onSendOtp, onVerifyOtp }: LoginScreenProps) {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      // ask parent to send OTP (parent may call real SMS API)
      onSendOtp(mobile);
      setStatusMessage('OTP sent to your number');
      setStep('otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      // Auto-submit when all filled
      if (index === 5 && value && newOtp.every(d => d !== '')) {
        const code = newOtp.join('');
        setIsVerifying(true);
        Promise.resolve(onVerifyOtp(code)).then((res) => {
          setIsVerifying(false);
          if (res.success) {
            setStatusMessage('Verified!');
            // parent will navigate away on success
          } else if (res.reason === 'expired') {
            setStatusMessage('OTP expired. Please resend.');
            setStep('mobile');
            setOtp(['', '', '', '', '', '']);
          } else {
            setStatusMessage('Invalid OTP. Try again.');
            setOtp(['', '', '', '', '', '']);
          }
        });
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#E8F5E9] to-[#FBF8F3]">
      {/* Logo */}
      <div className="pt-10 pb-6 px-6 text-center">
        <h1 className="text-4xl text-[#2E7D32] mb-2">CraftConnect</h1>
        <p className="text-lg text-[#558B2F]">Welcome back!</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        {step === 'mobile' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <div className="text-7xl mb-6">📱</div>
              <h2 className="text-3xl text-[#2E7D32] mb-3">Enter Mobile Number</h2>
              <p className="text-lg text-[#558B2F]">We'll send you an OTP</p>
            </div>

            <form onSubmit={handleMobileSubmit} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-1">
                <div className="flex items-center gap-3 p-5">
                  <span className="text-2xl text-[#558B2F]">+91</span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10 digit number"
                    className="flex-1 text-2xl text-[#2E7D32] outline-none bg-transparent"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={mobile.length !== 10}
                className="w-full bg-[#2E7D32] text-white py-6 rounded-2xl shadow-lg active:scale-95 transition-transform text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send OTP →
              </button>
            </form>

            <div className="mt-8 bg-[#E8F5E9] p-5 rounded-2xl border-2 border-[#2E7D32] border-dashed">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔒</span>
                <p className="text-[#2E7D32]">Your number is safe and secure</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <div className="text-center mb-10">
              <div className="text-7xl mb-6">🔐</div>
              <h2 className="text-3xl text-[#2E7D32] mb-3">Enter OTP</h2>
              <p className="text-lg text-[#558B2F] mb-2">Sent to +91 {mobile}</p>
              {statusMessage && (
                <p className="text-sm text-[#FF6F00] mt-2">{statusMessage}</p>
              )}
              <button
                onClick={() => setStep('mobile')}
                className="text-[#FF6F00] active:scale-95 transition-transform"
              >
                Change number
              </button>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-16 text-center text-2xl text-[#2E7D32] bg-white rounded-xl shadow-lg outline-none focus:ring-2 focus:ring-[#FF6F00] transition-all"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              onClick={() => {
                // resend
                onSendOtp(mobile);
                setStatusMessage('OTP resent');
                setOtp(['', '', '', '', '', '']);
              }}
              className="w-full text-[#FF6F00] text-center py-4 active:scale-95 transition-transform"
            >
              Didn't receive OTP? Resend
            </button>

            <div className="mt-6 bg-[#FFF3E0] p-5 rounded-2xl border-2 border-[#FF6F00]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⏱️</span>
                <p className="text-[#FF6F00]">OTP expires in 2:00 minutes</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-10"></div>
    </div>
  );
}