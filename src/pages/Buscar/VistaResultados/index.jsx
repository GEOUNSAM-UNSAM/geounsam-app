import CardResultado from "../../../components/Buscar/CardResultado";
import samuLupa from "../../../assets/samu_lupa.png";

export default function VistaResultados({
  resultados,
  query,
  comisionesGuardadas,
  comisionesPendientes,
  onTogglePin,
  onVerDetalle,
}) {
  const totalComisiones = resultados.length;

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header de resultados (Azul en mobile, transparente con letras azules en desktop) */}
      <div className="bg-identity px-8 py-5 lg:bg-transparent lg:border-b lg:border-neutral-light lg:px-12 lg:py-2 shrink-0">
        <h2 className="text-heading-l lg:text-heading-xl text-neutral-white lg:text-identity">
            {totalComisiones} {totalComisiones === 1 ? "comisión encontrada" : "comisiones encontradas"}
        </h2>
        <p className="text-body-s lg:text-body-m text-neutral-light lg:text-neutral-dark mt-1">
            para &quot;{query}&quot;
        </p>
      </div>

      {/* Lista de resultados en Grilla */}
      <div className="flex-1 overflow-y-auto px-8 py-6 lg:px-12 lg:py-8">
        {totalComisiones === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 lg:mt-24 gap-4 w-full">
            <img
              src={samuLupa}
              alt="Samu buscando"
              className="w-[195px] h-[200px] object-contain"
            />
            
            {/* Textos (Título y Descripción) */}
            <div className="flex flex-col items-center gap-4 w-full max-w-[348px] text-center">
              <h3 className="text-heading-l text-identity">
                Sin resultados
              </h3>
              <p className="text-body-m text-neutral-extra-dark">
                No pudimos encontrar materias que coincidan con tu búsqueda.<br />
                Intentá usar otro término.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 auto-rows-max">
            {resultados.map((resultado) => (
              <CardResultado
                key={resultado.comisionId}
                resultado={resultado}
                isPinned={comisionesGuardadas.has(resultado.comisionId)}
                isPending={comisionesPendientes.has(resultado.comisionId)}
                onTogglePin={onTogglePin}
                onVerDetalle={onVerDetalle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
