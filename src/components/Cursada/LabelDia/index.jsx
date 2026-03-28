import { Calendar } from 'lucide-react'

export default function LabelDia({ nombre, num, prefijo }) {
  return (
    <div className="flex items-center gap-2">
      <Calendar size={16} className="text-identity shrink-0" />
      <span className="font-saira text-sm text-identity uppercase tracking-wide">
        {prefijo ? `${prefijo} — ` : ''}{nombre.toUpperCase()} {num}
      </span>
    </div>
  )
}
