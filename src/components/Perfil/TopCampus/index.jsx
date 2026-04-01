import { Crown, ChevronRight } from 'lucide-react'

export default function TopCampus() {
  return (
    <div className="bg-neutral-white rounded-[30px] px-5 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Crown size={24} className="text-neutral-extra-dark" />
        <span className="font-saira font-semibold text-lg text-neutral-extra-dark">Top del campus</span>
      </div>
      <ChevronRight size={24} className="text-neutral-extra-dark" />
    </div>
  )
}
