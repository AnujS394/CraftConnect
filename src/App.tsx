import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LanguageSelection } from './components/LanguageSelection';
import { LoginScreen } from './components/LoginScreen';
import { ViewModeSelection } from './components/ViewModeSelection';
import { VoiceRegistration } from './components/VoiceRegistration';
import { MainApp } from './components/MainApp';
import { BuyerView } from './components/BuyerView';

/* ---------- TYPES ---------- */

export type Language =
  | 'hindi'
  | 'bengali'
  | 'tamil'
  | 'telugu'
  | 'marathi'
  | 'english';

export type Craft =
  | 'pottery'
  | 'weaving'
  | 'painting'
  | 'woodwork'
  | 'metalwork';

export interface User {
  name: string;
  craft: Craft;
  language: Language;
  mobile: string;
}

type Screen =
  | 'welcome'
  | 'login'
  | 'language'
  | 'viewMode'
  | 'registration'
  | 'main';

type ViewMode = 'buyer' | 'seller';

/* ---------- APP ---------- */

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>('english');
  const [mobileNumber, setMobileNumber] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('buyer');

  /* ---------- HANDLERS ---------- */

  const handleStartVoice = () => {
    setCurrentScreen('login');
  };

  // OTP related state and handlers
  const [pendingMobile, setPendingMobile] = useState('');
  const [otpCode, setOtpCode] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);

  const handleSendOtp = (mobile: string) => {
    // Generate a 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(code);
    setPendingMobile(mobile);
    setOtpExpiresAt(Date.now() + 2 * 60 * 1000); // expires in 2 minutes

    // For now (demo) we log the OTP. Replace with a real SMS service (Twilio, etc.) in production.
    // Example: call your backend API here to send SMS to +91{mobile}
    // fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ mobile, code }) })
    //   .catch(console.error);
    // Show for developer/testing
    // eslint-disable-next-line no-console
    console.log(`OTP for +91${mobile}: ${code}`);
    alert(`(DEV) OTP for +91${mobile}: ${code}`);
  };

  const handleVerifyOtp = (code: string) => {
    // Check expiry
    if (!otpCode || !otpExpiresAt || Date.now() > otpExpiresAt) {
      return { success: false, reason: 'expired' } as const;
    }

    if (code === otpCode) {
      // Verified — complete login
      setMobileNumber(pendingMobile);
      setOtpCode(null);
      setOtpExpiresAt(null);
      setPendingMobile('');
      setCurrentScreen('language');
      return { success: true } as const;
    }

    return { success: false, reason: 'invalid' } as const;
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setCurrentScreen('viewMode');
  };

  const handleViewModeSelect = (mode: ViewMode) => {
    setViewMode(mode);

    if (mode === 'seller') {
      setCurrentScreen('registration');
    } else {
      // Buyer skips registration
      setUser({
        name: 'Guest Buyer',
        craft: 'pottery',
        language: selectedLanguage,
        mobile: mobileNumber,
      });
      setCurrentScreen('main');
    }
  };

  const handleRegistrationComplete = (craft: Craft, name: string) => {
    setUser({
      name,
      craft,
      language: selectedLanguage,
      mobile: mobileNumber,
    });
    setCurrentScreen('main');
  };

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-[#FBF8F3] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] h-[800px] bg-[#FBF8F3] shadow-2xl rounded-3xl overflow-hidden relative">

        {currentScreen === 'welcome' && (
          <WelcomeScreen onLogin={handleStartVoice} />
        )}

        {currentScreen === 'login' && (
          <LoginScreen onSendOtp={handleSendOtp} onVerifyOtp={handleVerifyOtp} />
        )}

        {currentScreen === 'language' && (
          <LanguageSelection onSelectLanguage={handleLanguageSelect} />
        )}

        {currentScreen === 'viewMode' && (
          <ViewModeSelection
            language={selectedLanguage}
            onSelectMode={handleViewModeSelect}
          />
        )}

        {currentScreen === 'registration' && (
          <VoiceRegistration
            language={selectedLanguage}
            onComplete={handleRegistrationComplete}
          />
        )}

        {currentScreen === 'main' && user && (
          viewMode === 'seller' ? (
            <MainApp
              user={user}
              viewMode="seller"
              onModeChange={handleModeChange}
            />
          ) : (
            <BuyerView
              user={user}
              viewMode="buyer"
              onModeChange={handleModeChange}
            />
          )
        )}

      </div>
    </div>
  );
}

export default App;
