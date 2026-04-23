import { ArrowLeft } from 'lucide-react';

export default function BotonOutline({
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
                flex flex-row justify-center items-center
                px-3 py-1.5 gap-2 h-9 w-full
                bg-transparent border border-identity text-identity rounded-xl
                transition-colors
                hover:bg-identity/5 active:bg-identity/10
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
    >
      {conIcono && <ArrowLeft size={24} aria-hidden="true" />}
      <span className="text-body-s text-center">{texto}</span>
    </button>
  );
}
