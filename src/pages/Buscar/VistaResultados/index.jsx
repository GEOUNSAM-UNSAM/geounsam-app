import CardResultado from "../../../components/Buscar/CardResultado";

export default function VistaResultados({
  resultados,
  query,
  comisionesGuardadas,
  comisionesPendientes,
  onTogglePin,
}) {
  const totalComisiones = resultados.length;

  return (
    <>
      {/* Header de resultados */}
      <div className="bg-identity px-6 py-3">
        <h2 className="font-saira text-[28px] font-bold leading-10 text-base">
          {totalComisiones} {totalComisiones === 1 ? "comisión encontrada" : "comisiones encontradas"}
        </h2>
        <p className="font-saira text-base leading-6 text-neutral-light">
          para &quot;{query}&quot;
        </p>
      </div>

      {/* Lista de resultados */}
      <div className="flex-1 overflow-y-auto px-8 pt-7">
        <div className="flex flex-col gap-3">
          {resultados.map((resultado) => {
            return (
              <CardResultado
                key={resultado.comisionId}
                resultado={resultado}
                isPinned={comisionesGuardadas.has(resultado.comisionId)}
                isPending={comisionesPendientes.has(resultado.comisionId)}
                onTogglePin={onTogglePin}
              />
            );
          })}
          {totalComisiones === 0 && (
            <p className="font-saira text-sm text-neutral-main text-center py-8">
              No se encontraron resultados
            </p>
          )}
        </div>
      </div>
    </>
  );
}
