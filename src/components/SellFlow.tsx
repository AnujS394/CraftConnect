import { useState } from 'react';
import { User } from '../App';
import { CaptureImage } from './CaptureImage';
import { VoiceDescription } from './VoiceDescription';
import { AIProcessing } from './AIProcessing';
import { ReviewProduct } from './ReviewProduct';

interface SellFlowProps {
  user: User;
}

type SellStep = 'capture' | 'describe' | 'processing' | 'review' | 'success';

export function SellFlow({ user }: SellFlowProps) {
  const [step, setStep] = useState<SellStep>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [voiceDescription, setVoiceDescription] = useState<string>('');
  const [productTitle, setProductTitle] = useState<string>('');

  const handleImageCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
    setStep('describe');
  };

  const handleVoiceComplete = (payload: { title: string; description: string }) => {
    setProductTitle(payload.title || 'Untitled Product');
    setVoiceDescription(payload.description);
    setStep('processing');

    // Simulate AI processing
    setTimeout(() => {
      setStep('review');
    }, 4000);
  };

  const handlePublish = () => {
    setStep('success');
    setTimeout(() => {
      setStep('capture');
    }, 2000);
  };

  return (
    <div className="h-full">
      {step === 'capture' && <CaptureImage onCapture={handleImageCapture} />}
        {step === 'describe' && (
        <VoiceDescription 
          language={user.language} 
          onComplete={handleVoiceComplete}
          imageUrl={capturedImage}
        />
      )}
      {step === 'processing' && <AIProcessing />}
        {step === 'review' && (
        <ReviewProduct 
          imageUrl={capturedImage}
          description={voiceDescription}
          title={productTitle}
          onPublish={handlePublish}
        />
      )}
      {step === 'success' && (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#E8F5E9] to-[#FBF8F3]">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-3xl text-[#2E7D32] text-center">Product Published!</h2>
          <p className="text-xl text-[#558B2F] text-center mt-2">Your product is now live</p>
        </div>
      )}
    </div>
  );
}
