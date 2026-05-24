import { Calendar } from 'lucide-react'

export default function LabelDia({ nombre, num, prefijo }) {
  return (
    <div className="flex items-center gap-2">
      <Calendar size={16} className="text-identity shrink-0" />
      <span className="text-body-s text-identity uppercase">
        {prefijo ? `${prefijo} — ` : ''}{nombre.toUpperCase()} {num}
      </span>
    </div>
  )
}
