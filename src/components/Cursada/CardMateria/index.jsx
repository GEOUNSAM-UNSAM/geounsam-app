import { ChevronRight } from 'lucide-react'

export default function CardMateria({ clase }) {
  return (
    <div className="bg-neutral-white border-l-4 border-action flex pl-4 pr-3 py-4 rounded-[20px] w-full gap-3 items-stretch">
      <div className="flex flex-col text-sm text-neutral-main text-right shrink-0 justify-center w-10 gap-0.5">
        <span>{clase.inicio}</span>
        <span>{clase.fin}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex items-center justify-between">
          <p className="font-saira font-semibold text-[18px] text-neutral-dark leading-8 pr-1">
            {clase.nombre}
          </p>
          <ChevronRight size={18} className="text-neutral-light shrink-0" />
        </div>
        <p className="font-saira text-sm text-neutral-dark">{clase.aula}</p>
      </div>
    </div>
  )
}
