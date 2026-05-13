'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (base64Image: string) => void;
  buttonLabel?: string;
}

export function CameraCapture({ onCapture, buttonLabel = "Tomar Foto" }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImage(null);
  };

  const confirm = () => {
    if (image) {
      onCapture(image);
      setIsCameraOpen(false);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment" // Try to use back camera on mobile
  };

  if (!isCameraOpen && !image) {
    return (
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 h-12"
        onClick={() => setIsCameraOpen(true)}
      >
        <Camera className="h-5 w-5" />
        {buttonLabel}
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
        {image ? (
          <img src={image} alt="Captura" className="w-full h-full object-contain" />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex gap-2">
        {image ? (
          <>
            <Button type="button" variant="outline" className="flex-1" onClick={retake}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retomar
            </Button>
            <Button type="button" className="flex-1" onClick={confirm}>
              <Check className="mr-2 h-4 w-4" />
              Confirmar
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="destructive" className="flex-1" onClick={() => setIsCameraOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="button" className="flex-1" onClick={capture}>
              <Camera className="mr-2 h-4 w-4" />
              Capturar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
