import { useEffect, useState } from "react";
import samuMapa from "../../assets/samu_mapa.png";
import samuPulgar from "../../assets/samu_pulgar.png";
import samuTriste from "../../assets/samu_triste.png";

const VARIANTS = {
  success: {
    image: samuPulgar,
    bg: "bg-state-green",
    border: "border-data-green-800",
    text: "text-data-green-800",
  },
  error: {
    image: samuTriste,
    bg: "bg-state-red",
    border: "border-data-red-900",
    text: "text-data-red-900",
  },
  info: {
    image: samuMapa,
    bg: "bg-state-blue",
    border: "border-action",
    text: "text-action",
  },
  warning: {
    image: samuPulgar,
    bg: "bg-state-yellow",
    border: "border-data-orange-700",
    text: "text-data-orange-700",
  },
};

export default function ActionToast({ toast, onClose }) {
  const [renderedToast, setRenderedToast] = useState(toast);
  const visible = Boolean(toast);
  const currentToast = renderedToast ?? toast;
  const variant = VARIANTS[currentToast?.variant] ?? VARIANTS.info;

  useEffect(() => {
    if (toast) {
      setRenderedToast(toast);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setRenderedToast(null);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!visible) return undefined;

    const timer = window.setTimeout(() => {
      onClose?.();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [visible, onClose]);

  if (!currentToast) return null;

  return (
    <div
      className={`fixed bottom-24 left-4 right-4 z-50 mx-auto w-auto max-w-[380px] transition-all duration-300 sm:left-1/2 sm:right-auto sm:w-[380px] sm:-translate-x-1/2 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`flex h-20 items-center justify-center gap-3 rounded-[20px] border px-5 py-3 shadow-[0px_4px_2px_rgba(0,0,0,0.3),0px_8px_6px_rgba(0,0,0,0.15)] ${variant.bg} ${variant.border}`}
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px]">
          <img src={variant.image} alt="" className="h-16 w-16 object-contain" />
        </div>

        <div className="min-w-0 flex-1">
          <p className={`truncate font-saira text-base leading-6 ${variant.text}`}>
            {currentToast.title}
          </p>
          {currentToast.description ? (
            <p className="mt-2 truncate font-saira text-xs font-medium leading-3 text-neutral-dark">
              {currentToast.description}
            </p>
          ) : null}
        </div>

        {currentToast.xp ? (
          <p className={`w-[60px] shrink-0 font-saira text-base leading-6 ${variant.text}`}>
            {currentToast.xp}
          </p>
        ) : null}
      </div>
    </div>
  );
}
