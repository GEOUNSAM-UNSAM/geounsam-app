import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getMateriasSugeridasDeCarrera,
  buscarMaterias,
} from "../../services/materias";
import {
  getAlumnoComisionIds,
  guardarAlumnoComision,
  quitarAlumnoComision,
} from "../../services/comisiones";
import { useAuth } from "../../context/AuthContext";

import Toast from "../../components/Buscar/Toast";
import Buscador from "../../components/Buscar/Buscador";
import VistaSugeridas from "./VistaSugeridas";
import VistaResultados from "./VistaResultados";

export default function Buscar() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [comisionesGuardadas, setComisionesGuardadas] = useState(new Set());
  const [comisionesPendientes, setComisionesPendientes] = useState(new Set());
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
    if (!user) return;
    getAlumnoComisionIds(user.id)
      .then((comisionIds) => {
        setComisionesGuardadas(new Set(comisionIds));
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const buscarMateria = (materia) => {
    updateQuery(materia.nombre);
  };

  const toggleComision = async (resultado) => {
    if (!user) return;

    const { comisionId, nombre } = resultado;
    if (comisionesPendientes.has(comisionId)) return;

    const estabaGuardada = comisionesGuardadas.has(comisionId);

    setComisionesPendientes((prev) => {
      const next = new Set(prev);
      next.add(comisionId);
      return next;
    });

    setComisionesGuardadas((prev) => {
      const next = new Set(prev);
      if (estabaGuardada) {
        next.delete(comisionId);
      } else {
        next.add(comisionId);
      }
      return next;
    });

    try {
      if (estabaGuardada) {
        await quitarAlumnoComision(user.id, comisionId);
        setToast({
          visible: true,
          mensaje: `Se quitó ${nombre} de tu cursada`,
        });
      } else {
        await guardarAlumnoComision(user.id, comisionId);
        setToast({
          visible: true,
          mensaje: `Se agregó ${nombre} a tu cursada`,
        });
      }
    } catch (error) {
      console.error(error);
      setComisionesGuardadas((prev) => {
        const next = new Set(prev);
        if (estabaGuardada) {
          next.add(comisionId);
        } else {
          next.delete(comisionId);
        }
        return next;
      });
      setToast({
        visible: true,
        mensaje: "No pudimos actualizar tu cursada",
      });
    } finally {
      setComisionesPendientes((prev) => {
        const next = new Set(prev);
        next.delete(comisionId);
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-68px-64px)] bg-base">
      <Toast mensaje={toast.mensaje} visible={toast.visible} />

      {buscando ? (
        <VistaResultados
          resultados={resultados}
          query={query}
          comisionesGuardadas={comisionesGuardadas}
          comisionesPendientes={comisionesPendientes}
          onTogglePin={toggleComision}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-8 pt-7">
          <VistaSugeridas
            materiasSugeridas={materiasSugeridas}
            carreraNombre={carreraNombre}
            onSelectMateria={buscarMateria}
          />
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
