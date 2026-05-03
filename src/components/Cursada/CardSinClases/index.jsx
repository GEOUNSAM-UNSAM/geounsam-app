import { CalendarX } from 'lucide-react';

export default function CardSinClases({
  titulo = 'Sin clases',
  descripcion = 'No tenés materias guardadas para este día',
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 rounded-[30px] bg-neutral-light py-7">
      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-neutral-dark">
        <CalendarX size={30} className="text-base" strokeWidth={2} />
      </div>
      <p className="text-heading-l text-neutral-extra-dark">{titulo}</p>
      <p className="text-body-s text-center text-neutral-dark">{descripcion}</p>
    </div>
  );
}
