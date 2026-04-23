export default function BotonGhost({
  texto = '',
  onClick,
  type = 'button',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex flex-row justify-center items-center px-4 py-2 gap-2 min-h-[36px] rounded-xl text-body-m-serif text-action text-center transition-colors hover:bg-neutral-light/50 active:bg-neutral-light ${className}`}
    >
      {texto}
    </button>
  );
}
