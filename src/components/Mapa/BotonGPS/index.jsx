export default function BotonGPS({ gpsActivo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-3 right-3 z-[1000] w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-colors ${
        gpsActivo ? "bg-identity" : "bg-neutral-white"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={gpsActivo ? "white" : "#111827"}
        stroke="none"
      >
        <path d="M3 11.5l17.5-9L12.5 20v-8.5H3z" />
      </svg>
    </button>
  );
}
