import { useState, useEffect, useCallback, useRef } from "react";

export function useGeolocalizacion(mapRef) {
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [gpsActivo, setGpsActivo] = useState(false);
  const watchIdRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUbicacionUsuario([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const centrarEnUsuario = useCallback(() => {
    if (ubicacionUsuario && mapRef.current) {
      mapRef.current.flyTo(ubicacionUsuario, 18, { duration: 0.5 });
      setGpsActivo(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setGpsActivo(false), 1500);
    }
  }, [ubicacionUsuario, mapRef]);

  return { ubicacionUsuario, gpsActivo, centrarEnUsuario };
}
