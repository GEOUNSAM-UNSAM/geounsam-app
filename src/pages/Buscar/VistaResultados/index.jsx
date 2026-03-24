import CardResultado from "../../../components/Buscar/CardResultado";

export default function VistaResultados({ resultados, query, favoritos, onToggleFav }) {
  const totalComisiones = resultados.length;

  return (
    <>
      {/* Header de resultados */}
      <div className="bg-identity px-6 py-3">
        <h2 className="font-saira font-semibold text-[24px] leading-8 text-base">
          {totalComisiones} {totalComisiones === 1 ? "comisión encontrada" : "comisiones encontradas"}
        </h2>
        <p className="font-saira text-[14px] leading-4 text-neutral-light">
          para &quot;{query}&quot;
        </p>
      </div>

      {/* Lista de resultados */}
      <div className="flex-1 overflow-y-auto px-8 pt-7">
        <div className="flex flex-col gap-3">
          {resultados.map((r, i) => {
            const key = `${r.materiaId}-${r.codigo}`;
            return (
              <CardResultado
                key={`${key}-${i}`}
                resultado={r}
                isFav={favoritos.has(key)}
                onToggleFav={onToggleFav}
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
