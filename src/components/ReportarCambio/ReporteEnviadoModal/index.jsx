import { useEffect } from "react";
import { MoveRight } from "lucide-react";
import confetti from "canvas-confetti";
import samuFestejo from "../../../assets/samu_festejo.png";
import BotonPrincipal from "../../BotonPrincipal";
import BotonGhost from "../../BotonGhost";

function formatReporteValue(value) {
  const text = String(value ?? "");
  if (/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/.test(text)) return text;
  return text.replace(/\s*-\s*/, " -\n");
}

export default function ReporteEnviadoModal({
  clase,
  tipo,
  valorAnterior,
  valorNuevo,
  onVerCursada,
  onVolverInicio,
}) {
  const esVirtual = tipo === "virtual";

  useEffect(() => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.5 },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-extra-dark/40 px-5 pb-10 pt-[92px]">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[20px] bg-neutral-white px-5 pb-5 pt-8 shadow-[0px_1px_3px_rgba(0,0,0,0.3),0px_4px_8px_3px_rgba(0,0,0,0.15)]">
        <img
          src={samuFestejo}
          alt=""
          className="h-[260px] w-[260px] object-contain"
        />

        <p className="text-body-m text-data-green-800">
          REPORTE ENVIADO
        </p>
        <h2 className="text-heading-xl text-neutral-extra-dark">
          ¡Buen trabajo!
        </h2>

        {esVirtual ? (
          <div className="flex max-w-full items-center justify-center rounded-[20px] border border-data-purple-500 bg-state-purple px-5 py-3">
            <p className="truncate text-center text-body-m text-data-purple-900">
              La modalidad de la clase es virtual
            </p>
          </div>
        ) : (
          <div className="flex w-full max-w-[340px] items-center justify-center gap-4 rounded-[20px] border border-status-yellow bg-state-yellow px-4 py-3">
            <p className="max-w-[132px] whitespace-pre-line text-center text-body-m text-neutral-dark line-through">
              {formatReporteValue(valorAnterior)}
            </p>
            <MoveRight size={24} className="shrink-0 text-neutral-extra-dark" />
            <p className="max-w-[132px] whitespace-pre-line text-center text-body-m text-data-orange-700">
              {formatReporteValue(valorNuevo)}
            </p>
          </div>
        )}

        <p className="max-w-[297px] text-center text-body-m leading-6 text-neutral-dark">
          La comunidad va a verificar el cambio en {clase.nombre}
        </p>

        <BotonPrincipal
          text="Ver en mi cursada"
          onClick={onVerCursada}
          className="w-full"
        />

        <BotonGhost
          text="Volver al inicio"
          onClick={onVolverInicio}
        />
      </div>
    </div>
  );
}
