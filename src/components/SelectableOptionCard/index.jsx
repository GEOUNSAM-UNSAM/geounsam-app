import { Check, Circle } from 'lucide-react';

export default function SelectableOptionCard({
  icon: Icon,
  title,
  description,
  selected,
  onSelect,
  iconContainerClass = 'bg-identity text-neutral-white',
  selectedClass = 'border-2 border-action bg-state-blue',
  unselectedClass = 'border-2 border-transparent bg-neutral-white',
  checkClass = 'bg-action text-neutral-white',
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-[20px] px-3 py-4 text-left transition-colors ${
        selected ? selectedClass : unselectedClass
      }`}
    >
      <span
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] ${iconContainerClass}`}
      >
        <Icon size={24} strokeWidth={2} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-heading-l text-neutral-extra-dark">{title}</span>
        {description ? (
          <span className="text-body-s text-neutral-dark">{description}</span>
        ) : null}
      </span>

      {selected ? (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${checkClass}`}
        >
          <Check size={20} strokeWidth={3} />
        </span>
      ) : (
        <Circle
          size={32}
          strokeWidth={1.5}
          className="shrink-0 text-neutral-dark"
        />
      )}
    </button>
  );
}
