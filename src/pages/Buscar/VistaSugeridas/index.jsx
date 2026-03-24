import { Brain } from "lucide-react";
import CardSugerida from "../../../components/Buscar/CardSugerida";

export default function VistaSugeridas({ materiasSugeridas }) {
  return (
    <>
      <div className="flex gap-2 items-start mb-6">
        <Brain size={24} className="text-identity flex-shrink-0 mt-1" />
        <div className="flex flex-col gap-2">
          <h2 className="font-saira font-semibold text-lg leading-8 text-identity">
            Materias sugeridas
          </h2>
          <p className="font-saira text-sm text-identity">
            Licenciatura en Desarrollo de Software
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {materiasSugeridas.map((materia) => (
          <CardSugerida key={materia.id} materia={materia} />
        ))}
      </div>
    </>
  );
}
