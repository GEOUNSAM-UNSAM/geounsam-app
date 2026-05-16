import { ArrowRight, Send } from "lucide-react";

export default function FooterActions({
  step,
  disabled,
  enviando,
  onBack,
  onContinue,
  onSend,
}) {
  return (
    <footer className="px-4 py-5">
      <div className="grid w-full grid-cols-2 gap-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 items-center justify-center rounded-xl border border-identity px-3 py-1.5 font-saira text-sm leading-4 text-identity"
          >
            Atrás
          </button>
        ) : null}
        <button
          type="button"
          onClick={step === 3 ? onSend : onContinue}
          disabled={disabled || enviando}
          className={`flex h-11 items-center justify-center gap-1 rounded-xl px-3 py-1.5 font-saira text-lg font-semibold leading-8 disabled:bg-neutral-light disabled:text-neutral-dark ${
            step === 1 ? "col-span-2" : ""
          } ${step === 3 ? "bg-identity text-base" : "bg-action text-neutral-extra-dark"}`}
        >
          {step === 3 ? (
            <>
              <Send size={24} className="text-action" />
              {enviando ? "Enviando..." : "Enviar - +25 XP"}
            </>
          ) : (
            <>
              Continuar
              <ArrowRight size={24} />
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
