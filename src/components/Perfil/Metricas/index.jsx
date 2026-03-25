import { Flame } from 'lucide-react'

export default function Metricas({ estadisticas }) {
  return (
    <div className="bg-neutral-white flex items-center justify-between px-6 py-4">
      <div className="flex flex-col items-center">
        <span className="font-saira font-semibold text-lg text-neutral-dark">{estadisticas.puntos}</span>
        <span className="font-saira font-medium text-xs text-neutral-dark">Puntos</span>
      </div>
      <div className="w-px h-12 bg-neutral-light" />
      <div className="flex flex-col items-center">
        <span className="font-saira font-semibold text-lg text-neutral-dark">{estadisticas.reportes}</span>
        <span className="font-saira font-medium text-xs text-neutral-dark">Reportes</span>
      </div>
      <div className="w-px h-12 bg-neutral-light" />
      <div className="flex flex-col items-center">
        <span className="font-saira font-semibold text-lg text-neutral-dark">{estadisticas.confirmaciones}</span>
        <span className="font-saira font-medium text-xs text-neutral-dark">Confirmaciones</span>
      </div>
      <div className="w-px h-12 bg-neutral-light" />
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <Flame size={20} className="text-neutral-dark" />
          <span className="font-saira font-semibold text-lg text-neutral-dark">{estadisticas.racha}</span>
        </div>
        <span className="font-saira font-medium text-xs text-neutral-dark">Racha</span>
      </div>
    </div>
  )
}
