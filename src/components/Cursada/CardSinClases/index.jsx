import { Calendar } from 'lucide-react'

export default function CardSinClases() {
  return (
    <div className="bg-base flex flex-col items-center justify-center gap-2 p-10 rounded-[20px] w-full">
      <Calendar size={56} className="text-neutral-light" strokeWidth={1.5} />
      <p className="font-saira font-semibold text-[22px] text-neutral-extra-dark mt-1">Sin clases</p>
      <p className="font-saira text-sm text-neutral-main text-center">
        No tenés materias guardadas para este día
      </p>
    </div>
  )
}
