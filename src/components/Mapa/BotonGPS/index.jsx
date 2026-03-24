import { Navigation } from "lucide-react";

export default function BotonGPS({ gpsActivo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-3 right-3 z-[1000] w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors ${
        gpsActivo ? "bg-identity" : "bg-neutral-white"
      }`}
    >
      <Navigation
        size={18}
        fill={gpsActivo ? "white" : "#111827"}
        color={gpsActivo ? "white" : "#111827"}
      />
    </button>
  );
}
