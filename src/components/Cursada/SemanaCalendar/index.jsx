export default function SemanaCalendar({ diasSemana, diaIdx, diasConClases, onSelect }) {
  return (
    <div className="flex gap-1 justify-between">
      {diasSemana.map((dia, i) => {
        const activo = i === diaIdx
        return (
          <button
            key={dia.label}
            onClick={() => onSelect(i)}
            className={`flex-1 flex flex-col items-center py-2 rounded-[10px] transition-colors ${
              activo ? 'bg-identity' : ''
            }`}
          >
            <span className={`font-saira font-medium text-xs leading-none ${
              activo ? 'text-neutral-light' : 'text-neutral-main'
            }`}>
              {dia.label}
            </span>
            <span className={`font-saira font-semibold text-[18px] leading-8 ${
              activo ? 'text-[#efefef]' : 'text-neutral-extra-dark'
            }`}>
              {dia.num}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-colors ${
              diasConClases[i]
                ? activo ? 'bg-[#efefef]' : 'bg-action'
                : 'bg-transparent'
            }`} />
          </button>
        )
      })}
    </div>
  )
}
