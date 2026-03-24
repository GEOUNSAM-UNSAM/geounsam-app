import { useState, useMemo, useEffect } from "react";
import { getMateriasSugeridas, buscarMaterias } from "../../services/materias";

import Toast from "../../components/Buscar/Toast";
import Buscador from "../../components/Buscar/Buscador";
import VistaSugeridas from "./VistaSugeridas";
import VistaResultados from "./VistaResultados";

export default function Buscar() {
  const [query, setQuery] = useState("");
  const [favoritos, setFavoritos] = useState(new Set());
  const [toast, setToast] = useState({ visible: false, mensaje: "" });

  const resultados = useMemo(() => buscarMaterias(query), [query]);
  const materiasSugeridas = useMemo(() => getMateriasSugeridas(), []);
  const buscando = query.trim().length > 0;

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const toggleFavorito = (resultado) => {
    const key = `${resultado.materiaId}-${resultado.codigo}`;
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        setToast({ visible: true, mensaje: `Se quitó ${resultado.nombre} de favoritos` });
      } else {
        next.add(key);
        setToast({ visible: true, mensaje: `Se agregó ${resultado.nombre} a favoritos` });
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-68px-64px)] bg-base">
      <Toast mensaje={toast.mensaje} visible={toast.visible} />

      {buscando ? (
        <VistaResultados
          resultados={resultados}
          query={query}
          favoritos={favoritos}
          onToggleFav={toggleFavorito}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-8 pt-7">
          <VistaSugeridas materiasSugeridas={materiasSugeridas} />
        </div>
      )}

      <Buscador
        query={query}
        onChange={setQuery}
        onClear={() => setQuery("")}
      />
    </div>
  );
}
