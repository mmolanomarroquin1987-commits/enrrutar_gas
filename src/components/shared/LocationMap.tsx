'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LocationMapProps {
  onLocationChange: (lat: number, lng: number) => void;
}

export function LocationMap({ onLocationChange }: LocationMapProps) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocalización no soportada por tu navegador');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        onLocationChange(newLocation.lat, newLocation.lng);
        setLoading(false);
        toast.success('Ubicación capturada correctamente');
      },
      (error) => {
        toast.error('Error al obtener la ubicación. Por favor, da permisos.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={getLocation} 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 h-12"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5" />}
        {location ? 'Actualizar Ubicación' : 'Obtener Coordenadas GPS'}
      </Button>

      {location && (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-primary/10 p-3 rounded-lg border border-primary/20">
          <MapPin className="h-5 w-5 text-primary" />
          <span>
            Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  );
}
