import { Brain } from "lucide-react";
import CardSugerida from "../../../components/Buscar/CardSugerida";

export default function VistaSugeridas({
  materiasSugeridas,
  carreraNombre,
  onSelectMateria,
}) {
  return (
    <>
      <div className="flex gap-3 items-start mb-6 px-1">
        <Brain size={24} className="text-identity flex-shrink-0 mt-1" />
        <div className="flex flex-col">
          <h2 className="text-title-m text-identity">
            Materias sugeridas
          </h2>
          {carreraNombre && (
            <p className="text-body-s text-identity">{carreraNombre}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {materiasSugeridas.map((materia) => (
          <CardSugerida
            key={materia.id}
            materia={materia}
            onSelect={onSelectMateria}
          />
        ))}
      </div>
    </>
  );
}
