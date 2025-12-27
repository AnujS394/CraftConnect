import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface CaptureImageProps {
  onCapture: (imageUrl: string) => void;
}

export function CaptureImage({ onCapture }: CaptureImageProps) {
  const [showHint, setShowHint] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    labels: string[];
    confidence: number;
    reason?: string;
  } | null>(null);

  // Hidden file inputs (one with capture for camera, one for gallery)
  const cameraInputId = 'camera-input';
  const galleryInputId = 'gallery-input';
  // default to front camera per user request
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('user');
  const [liveCameraOpen, setLiveCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);
  const [captureRetries, setCaptureRetries] = useState(0);

  const handleFileSelected = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setVerificationResult(null);
    // auto-start verification after small delay to allow preview render
    setTimeout(() => verifyImage(url), 300);
  };

  const handleTakePhoto = () => {
    // Trigger camera file input if available
    const camera = document.getElementById(cameraInputId) as HTMLInputElement | null;
    if (camera) {
      camera.value = '';
      camera.click();
      return;
    }

    // Fallback: use sample product image
    const sample = 'https://images.unsplash.com/photo-1761210719325-283557e92487?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBib3dsfGVufDF8fHx8MTc2NjY2ODc3NHww&ixlib=rb-4.1.0&q=80&w=1080';
    setPreview(sample);
    setVerificationResult(null);
    setTimeout(() => verifyImage(sample), 300);
  };

  const toggleFacing = () => {
    setFacingMode((m) => {
      const next = m === 'environment' ? 'user' : 'environment';
      if (liveCameraOpen) {
        stopCamera();
        setTimeout(() => startCamera(next), 150);
      }
      return next;
    });
  };

  const startCamera = async (mode?: 'environment' | 'user') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus('no-device');
      return;
    }

    setStatus('starting');

    // Try a few times in case the device is slow or browser needs a bit
    const attempts = 3;
    let lastError: any = null;
    for (let i = 0; i < attempts; i++) {
      try {
        // Stop any existing stream first
        stopCamera();

        const useMode = mode ?? facingMode;
        const constraints: MediaStreamConstraints = {
          video: { facingMode: useMode },
          audio: false,
        };

        // eslint-disable-next-line no-console
        console.log('Attempting to getUserMedia', i + 1, constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          // set element attributes to improve autoplay chances
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
          (videoRef.current as HTMLVideoElement).playsInline = true;
          videoRef.current.srcObject = stream;

          // reset flags and attach handlers
          setVideoReady(false);
          setShowStartButton(false);
          videoRef.current.onplaying = () => {
            setVideoReady(true);
            setStatus('ready');
          };
          videoRef.current.onloadedmetadata = () => {
            try { videoRef.current?.play(); } catch {}
          };

          try { await videoRef.current.play(); } catch (err) {
            // autoplay may be blocked until a user gesture
            // show start button after short delay
            setTimeout(() => {
              if (!videoReady) {
                setShowStartButton(true);
                setStatus('blocked');
              }
            }, 600);
          }
        }

        setLiveCameraOpen(true);
        // success
        return;
      } catch (err: any) {
        // store last error and retry
        lastError = err;
        // common errors: NotAllowedError (permission), NotFoundError (no camera)
        if (err && err.name === 'NotAllowedError') {
          setStatus('permission');
          break;
        }
        if (err && err.name === 'NotFoundError') {
          setStatus('no-device');
          break;
        }
        // otherwise wait a bit and retry
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    // If we reach here, failed to start
    // eslint-disable-next-line no-console
    console.error('Camera start failed after retries', lastError);
    setStatus((s) => (s === 'starting' ? 'error' : s));
    // suggest using file picker as fallback
    setTimeout(() => {
      const camera = document.getElementById(cameraInputId) as HTMLInputElement | null;
      camera?.click();
    }, 300);
  };

  const stopCamera = () => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch {}
      videoRef.current.srcObject = null;
      videoRef.current.onplaying = null;
      videoRef.current.onloadedmetadata = null;
      setVideoReady(false);
      setShowStartButton(false);
    }
    setLiveCameraOpen(false);
  };

  const handleTakeLivePhoto = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;

    const waitForReady = async () => {
      let attempts = 0;
      while ((v.videoWidth === 0 || v.videoHeight === 0 || !videoReady) && attempts < 15) {
        // wait up to ~1.5s
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }
      return v.videoWidth > 0 && v.videoHeight > 0 && videoReady;
    };

    waitForReady().then((ready) => {
      if (!ready) {
        alert('Camera not ready — please try again');
        return;
      }

      const doCapture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = v.videoWidth || 1280;
        canvas.height = v.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // If using front camera, mirror the canvas so the saved image matches preview
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(v, 0, 0, canvas.width, canvas.height);

        if (facingMode === 'user') {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        // check average brightness to avoid black frames
        try {
          const imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let sum = 0;
          const d = imgd.data;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            sum += lum;
          }
          const avg = sum / (canvas.width * canvas.height);
          const url = canvas.toDataURL('image/jpeg', 0.9);
          return { url, avg };
        } catch (err) {
          return null;
        }
      };

      const attempt = () => {
        const result = doCapture();
        if (!result) {
          alert('Capture failed, please try again');
          return;
        }

        // if image is almost black, retry a couple times
        if (result.avg < 6 && captureRetries < 2) {
          setCaptureRetries((r) => r + 1);
          setTimeout(attempt, 300);
          return;
        }

        setCaptureRetries(0);
        setPreview(result.url);
        setVerificationResult(null);
        // stop camera after snapshot
        stopCamera();
        setTimeout(() => verifyImage(result.url), 300);
      };

      attempt();
    });
  };

  // Cleanup camera on unmount
  useEffect(() => {
    // Auto-open camera when this component mounts (auto capture flow)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // try to start with the currently selected facing mode
      startCamera(facingMode);
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGalleryPick = () => {
    const gallery = document.getElementById(galleryInputId) as HTMLInputElement | null;
    if (gallery) {
      gallery.value = '';
      gallery.click();
    }
  };

  const resetPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setVerificationResult(null);
  };

  const verifyImage = async (imageUrl: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const img = await loadImage(imageUrl);

      // draw to canvas to inspect pixels
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = Math.min(400, img.width);
      canvas.height = Math.min(400, img.height);
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const data = ctx?.getImageData(0, 0, canvas.width, canvas.height).data;
      let sum = 0;
      if (data) {
        for (let i = 0; i < data.length; i += 4) {
          // luminance
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          sum += lum;
        }
        const avg = sum / (canvas.width * canvas.height);

        // simple heuristic: bright enough and not too small -> likely a good product photo
        const verified = avg > 40 && img.width > 200 && img.height > 200;
        const confidence = Math.min(0.99, Math.max(0.2, (avg - 20) / 200));
        const labels = verified ? ['product', 'clear-photo'] : ['unclear', 'low-confidence'];

        // simulate model delay
        await new Promise((r) => setTimeout(r, 800));

        setVerificationResult({ verified, labels, confidence });
        if (verified) {
          // pass to parent after a short success delay
          setTimeout(() => onCapture(imageUrl), 800);
        }
      } else {
        setVerificationResult({ verified: false, labels: ['error'], confidence: 0, reason: 'processing_failed' });
      }
    } catch (err) {
      setVerificationResult({ verified: false, labels: ['error'], confidence: 0, reason: 'load_failed' });
    } finally {
      setIsVerifying(false);
    }
  };

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  return (
    <div className="h-full flex flex-col bg-[#1A1A1A] relative">
      {/* Camera Viewfinder */}
      <div className="flex-1 relative overflow-hidden">
        {/* Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-10 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={`v-${i}`} className="border-r border-white/20" />
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={`h-${i}`} className="border-b border-white/20 col-span-3" />
          ))}
        </div>

        {/* Focus Frame */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-64 h-64 border-4 border-[#FF6F00] rounded-2xl">
            {/* Corner markers */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white" />
          </div>
        </div>

        {/* Hint Banner */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-4 right-4 bg-[#FF6F00] rounded-xl p-4 z-30"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-white">Good lighting helps!</p>
                <p className="text-white/80 text-sm mt-1">Place product in bright area</p>
              </div>
              <button
                onClick={() => setShowHint(false)}
                className="text-white text-xl"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Placeholder camera view */}
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
          <span className="text-9xl opacity-20">📷</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-[#2A2A2A] p-6 pb-28">
        {/* Hidden file inputs */}
        <input
          id={cameraInputId}
          type="file"
          accept="image/*"
          capture={facingMode}
          className="hidden"
          onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
        />
        <input
          id={galleryInputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelected(e.target.files?.[0] ?? null)}
        />

        <div className="flex items-center justify-center gap-8">
          {/* Gallery Button */}
          <button
            onClick={handleGalleryPick}
            className="w-14 h-14 rounded-xl bg-white/10 border-2 border-white/30 flex items-center justify-center"
            aria-label="Pick from gallery"
          >
            <span className="text-2xl">🖼️</span>
          </button>

          {/* Capture Button (opens live camera if possible, otherwise file input) */}
          <motion.button
            onClick={() => {
              if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // explicitly request the currently selected facing mode (default front)
                startCamera(facingMode);
              } else {
                handleTakePhoto();
              }
            }}
            className="w-20 h-20 rounded-full bg-white border-4 border-[#FF6F00] shadow-2xl active:scale-90 transition-transform flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            aria-label="Open camera"
          >
            <div className="w-16 h-16 rounded-full bg-[#FF6F00]" />
          </motion.button>

          {/* Flash Button (no-op) */}
          <button className="w-14 h-14 rounded-xl bg-white/10 border-2 border-white/30 flex items-center justify-center" aria-hidden>
            <span className="text-2xl">⚡</span>
          </button>

          {/* Flip Camera */}
          <button
            onClick={toggleFacing}
            className="w-14 h-14 rounded-xl bg-white/10 border-2 border-white/30 flex items-center justify-center"
            title={facingMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}
          >
            <span className="text-2xl">{facingMode === 'environment' ? '↺' : '↻'}</span>
          </button>
        </div>

        {/* Instructions */}
        <p className="text-white text-center mt-4 text-lg">
          Take a clear photo of your product
        </p>
        <p className="text-xs text-white/70 text-center mt-2">Camera: <span className="font-medium">{facingMode === 'environment' ? 'Back' : 'Front'}</span></p>

        {/* Live camera overlay */}
        {liveCameraOpen && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-end p-6 bg-black/40">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-3">
                <button onClick={stopCamera} className="px-3 py-2 rounded-lg bg-white/10 text-white">Close</button>
                <div className="flex gap-2">
                  <button onClick={() => { toggleFacing(); }} className="px-3 py-2 rounded-lg bg-white/10 text-white">Flip</button>
                </div>
              </div>
                      <div className="w-full bg-black rounded-xl overflow-hidden relative">
                        <video
                          ref={videoRef}
                          className={`w-full h-64 object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                          playsInline
                          autoPlay
                          muted
                        />
                        {showStartButton && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => {
                                // user gesture to start the camera
                                  setStatus('starting');
                                  // user initiated start
                                  startCamera(facingMode);
                                  setShowStartButton(false);
                              }}
                              className="px-4 py-3 bg-[#FF6F00] text-white rounded-xl shadow-lg"
                            >
                              Tap to start camera
                            </button>
                          </div>
                        )}
                      </div>
                      {/* status / instructions */}
                      <div className="mt-3 text-center">
                        {status === 'starting' && (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF6F00] animate-pulse" />
                            <div className="text-sm text-white/80">Starting camera…</div>
                          </div>
                        )}
                        {status === 'blocked' && <div className="text-sm text-white/80">Autoplay blocked — tap to start</div>}
                        {status === 'permission' && (
                          <div className="text-sm text-amber-300">Camera permission denied. Allow access or use gallery.</div>
                        )}
                        {status === 'no-device' && <div className="text-sm text-white/80">No camera found — try gallery</div>}
                        {status === 'error' && <div className="text-sm text-red-300">Unable to access camera — try gallery</div>}
                      </div>
              <div className="flex items-center justify-center mt-4">
                <button onClick={handleTakeLivePhoto} className="w-20 h-20 rounded-full bg-white border-4 border-[#FF6F00] shadow-2xl flex items-center justify-center"> <div className="w-16 h-16 rounded-full bg-[#FF6F00]" /> </button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3">
                <button onClick={handleGalleryPick} className="px-4 py-2 rounded-xl bg-white/10 text-white">Use gallery</button>
              </div>
            </div>
          </div>
        )}

          {/* Preview area + verification */}
        {preview && (
          <div className="mt-6 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div className="w-28 h-28 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <p className="text-white font-semibold">Preview</p>
                {isVerifying ? (
                  <p className="text-sm text-[#FF6F00] mt-1">Verifying image…</p>
                ) : verificationResult ? (
                  <p className={`text-sm mt-1 ${verificationResult.verified ? 'text-green-400' : 'text-red-400'}`}>
                    {verificationResult.verified ? `Verified • ${(verificationResult.confidence * 100).toFixed(0)}%` : 'Verification failed'}
                  </p>
                ) : (
                  <p className="text-sm text-white/80 mt-1">Tap Verify to check image quality</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => verificationResult?.verified ? null : verifyImage(preview)}
                  className="px-4 py-2 rounded-xl bg-[#2E7D32] text-white text-sm"
                  disabled={isVerifying || (verificationResult && verificationResult.verified)}
                >
                  {verificationResult?.verified ? 'Using Photo' : 'Verify'}
                </button>

                <button
                  onClick={resetPreview}
                  className="px-4 py-2 rounded-xl border border-white/20 text-white text-sm"
                >
                  Retake
                </button>
              </div>
            </div>

            {/* show labels if available */}
            {verificationResult && verificationResult.labels?.length > 0 && (
              <div className="mt-4 text-sm text-white/80">Labels: {verificationResult.labels.join(', ')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
