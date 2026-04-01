export default function BurbujaDialogo({ texto }) {
  return (
    <div className="relative w-full">
      <div className="bg-neutral-white border border-action rounded-[20px] px-4 h-[152px] flex items-center justify-center">
        <p className="font-saira font-semibold text-[22px] leading-8 text-neutral-extra-dark text-center whitespace-pre-line">
          {texto}
        </p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[11px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-action" />
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[9px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[10px] border-t-neutral-white z-10" />
    </div>
  )
}
