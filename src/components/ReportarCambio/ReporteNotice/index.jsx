import { MapPinCheck, Monitor } from "lucide-react";

export default function ReporteNotice({ variant = "location" }) {
  const isRemote = variant === "remote";
  const Icon = isRemote ? Monitor : MapPinCheck;
  const text = isRemote
    ? "Podés reportar desde cualquier lugar"
    : "Verificado - Estás en el edificio";

  return (
    <div
      className={`flex min-h-12 w-full items-center gap-2 rounded-[20px] px-3 py-2 ${
        isRemote ? "bg-state-purple" : "bg-data-green-200"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center px-1 py-2 ${
          isRemote ? "text-data-purple-900" : "text-identity"
        }`}
      >
        <Icon size={isRemote ? 18 : 20} strokeWidth={2} />
      </span>
      <p className="font-saira text-base leading-6 text-neutral-extra-dark">
        {text}
      </p>
    </div>
  );
}
