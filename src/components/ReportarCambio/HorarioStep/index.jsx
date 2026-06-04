import { Clock, MoveRight } from "lucide-react";
import ReporteNotice from "../ReporteNotice";

function TimeSelect({ value, onChange, horas }) {
  return (
    <label className="flex w-28 items-center gap-2 rounded-xl border border-neutral-light bg-neutral-white p-2.5">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 appearance-none bg-transparent text-body-m text-neutral-extra-dark outline-none"
      >
        {horas.map((hora) => (
          <option key={hora} value={hora}>
            {hora}
          </option>
        ))}
      </select>
      <Clock size={16} className="shrink-0 text-neutral-extra-dark" />
    </label>
  );
}

export default function HorarioStep({ clase, horas, nuevoInicio, nuevoFin, onInicio, onFin }) {
  return (
    <>
      <ReporteNotice />

      <section className="flex flex-col gap-3 py-3">
        <div className="flex flex-col gap-2">
          <p className="text-body-m text-identity">
            NUEVO HORARIO
          </p>
          <p className="text-body-s text-neutral-extra-dark">
            ¿A qué hora cambió la clase?
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-neutral-white p-3">
          <p className="text-body-s text-identity">
            HORARIO ACTUAL
          </p>
          <p className="w-full text-center text-title-m text-neutral-main">
            {clase.inicio} - {clase.fin}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-neutral-white p-3">
          <p className="text-body-s text-identity">
            NUEVO HORARIO
          </p>
          <div className="flex w-full items-center justify-center gap-3">
            <TimeSelect value={nuevoInicio} onChange={onInicio} horas={horas} />
            <MoveRight size={24} className="shrink-0 text-neutral-extra-dark" />
            <TimeSelect value={nuevoFin} onChange={onFin} horas={horas} />
          </div>
        </div>
      </section>
    </>
  );
}
