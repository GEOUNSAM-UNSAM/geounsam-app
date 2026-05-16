import { Check } from "lucide-react";

export default function Stepper({ activeStep }) {
  return (
    <div className="flex w-full items-center gap-2 p-2">
      {[1, 2, 3].map((step, index) => (
        <div key={step} className="flex flex-1 items-center gap-2 last:flex-none">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-saira text-sm leading-4 ${
              step < activeStep
                ? "bg-status-green text-neutral-extra-dark"
                : step === activeStep
                  ? "bg-identity text-base"
                  : "border border-neutral-main text-neutral-main"
            }`}
          >
            {step < activeStep ? <Check size={16} strokeWidth={3} /> : step}
          </div>
          {index < 2 ? <div className="h-px flex-1 bg-neutral-main" /> : null}
        </div>
      ))}
    </div>
  );
}
