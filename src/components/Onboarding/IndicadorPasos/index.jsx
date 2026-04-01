export default function IndicadorPasos({ total, actual }) {
  return (
    <div className="flex gap-2 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded-full transition-all duration-300 ${
            i === actual ? 'w-[30px] bg-action' : 'w-3 bg-neutral-light'
          }`}
        />
      ))}
    </div>
  )
}
