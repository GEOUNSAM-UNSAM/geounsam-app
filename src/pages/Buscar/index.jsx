import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getMateriasSugeridasDeCarrera,
  buscarMaterias,
} from "../../services/materias";
import { useAuth } from "../../context/AuthContext";

import Toast from "../../components/Buscar/Toast";
import Buscador from "../../components/Buscar/Buscador";
import VistaSugeridas from "./VistaSugeridas";
import VistaResultados from "./VistaResultados";

export default function Buscar() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoritos, setFavoritos] = useState(new Set());
  const [toast, setToast] = useState({ visible: false, mensaje: "" });
  const [materiasSugeridas, setMateriasSugeridas] = useState([]);
  const [carreraNombre, setCarreraNombre] = useState("");

  const query = searchParams.get("q") ?? "";
  const [resultados, setResultados] = useState([]);
  const buscando = query.trim().length > 0;

  const updateQuery = (value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    if (!buscando) return;
    buscarMaterias(query).then(setResultados).catch(console.error);
  }, [buscando, query]);

  useEffect(() => {
    if (!user) return;
    getMateriasSugeridasDeCarrera(user.id)
      .then(({ materias, carreraNombre }) => {
        setMateriasSugeridas(materias);
        setCarreraNombre(carreraNombre);
      })
      .catch(console.error);
  }, [user]);

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
          <VistaSugeridas materiasSugeridas={materiasSugeridas} carreraNombre={carreraNombre} />
        </div>
      )}

      <Buscador
        query={query}
        onChange={updateQuery}
        onClear={() => updateQuery("")}
      />
    </div>
  );
}
