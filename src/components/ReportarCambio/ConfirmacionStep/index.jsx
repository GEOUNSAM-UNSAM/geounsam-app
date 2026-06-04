function ResumenRow({ label, value, strike = false, accent = false }) {
  return (
    <div className="flex min-h-10 items-center gap-4 px-5 py-2">
      <span className="min-w-0 flex-1 text-body-m text-neutral-extra-dark">
        {label}
      </span>
      <span
        className={`min-w-0 truncate text-right text-body-m ${
          accent ? "text-data-orange-500" : "text-neutral-main"
        } ${strike ? "line-through" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function ResumenReporte({ rows }) {
  return (
    <section className="flex flex-col gap-0 rounded-[20px] bg-neutral-white p-3">
      {rows.map((row, index) => (
        <div key={row.label}>
          <ResumenRow {...row} />
          {index < rows.length - 1 ? (
            <div className="mx-0 h-px bg-neutral-light" />
          ) : null}
        </div>
      ))}
    </section>
  );
}

export default function ConfirmacionStep({ rows, comentario, enviando, feedback, onComentario }) {
  return (
    <section className="flex flex-col gap-3 py-3">
      <div className="flex flex-col gap-2 py-3">
        <p className="text-body-m text-identity">
          CONFIRMÁ EL REPORTE
        </p>
        <p className="text-body-s text-neutral-extra-dark">
          Revisá antes de enviar
        </p>
      </div>

      <ResumenReporte rows={rows} />

      <label className="flex flex-col gap-2 py-3">
        <span className="text-body-s text-identity">
          COMENTARIO (OPCIONAL)
        </span>
        <textarea
          value={comentario}
          onChange={(event) => onComentario(event.target.value)}
          disabled={enviando}
          rows={3}
          className="h-[60px] resize-none rounded-[15px] border border-neutral-light bg-neutral-white px-5 py-3 text-body-s text-neutral-extra-dark outline-none placeholder:text-neutral-dark disabled:opacity-50"
          placeholder="Ej: El profesor lo pasó a la 201 tornavias..."
        />
      </label>

      {feedback ? (
        <p
          className={`rounded-[20px] px-4 py-3 text-center text-body-s ${
            feedback.tipo === "success"
              ? "bg-state-green text-data-green-800"
              : "bg-state-red text-error"
          }`}
        >
          {feedback.mensaje}
        </p>
      ) : null}
    </section>
  );
}
