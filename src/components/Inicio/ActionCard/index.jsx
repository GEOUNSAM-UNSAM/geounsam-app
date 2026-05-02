export default function ActionCard({ icon, titulo, detalle, onClick }) {
  const Icon = icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[120px] flex-1 flex-col items-start justify-center gap-1 rounded-[30px] bg-action px-6 py-4 text-left text-neutral-extra-dark"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base">
        <Icon size={18} />
      </div>
      <span className="text-title-m">{titulo}</span>
      <span className="text-label-caption">{detalle}</span>
    </button>
  );
}
