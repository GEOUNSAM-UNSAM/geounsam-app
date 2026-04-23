import { ArrowRight } from 'lucide-react';

export default function BotonPrincipal({
  texto = '',
  onClick,
  type = 'button',
  conIcono = false,
  disabled = false,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
                disabled:opacity-50 disabled:cursor-not-allowed
                text-neutral-extra-dark flex flex-row justify-center items-center
                px-4 py-2 gap-2 min-h-[44px] w-full
                bg-action rounded-xl
                transition-colors
                hover:brightness-95 active:brightness-90
                ${className}
            `}
    >
      <span className="text-title-m text-center">{texto}</span>
      {conIcono && <ArrowRight size={24} aria-hidden="true" />}
    </button>
  );
}
