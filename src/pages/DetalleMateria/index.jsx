import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Heart, ChevronRight, CalendarClock, MapPin, Siren } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getComisionDetalle } from "../../services/materias";
import {
  getAlumnoComisionIds,
  guardarAlumnoComision,
  quitarAlumnoComision,
} from "../../services/comisiones";
import { buildClaseDetalleFromHorario } from "../../utils/detalleClase";

import DetalleHeader from "../../components/Clase/DetalleHeader";
import PantallaCarga from "../../components/PantallaCarga";
import Tip from "../../components/Tip";

const hhmm = (valor) => String(valor ?? "").slice(0, 5);

export default function DetalleMateria() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { comisionId } = useParams();

  const [comision, setComision] = useState(location.state?.comision ?? null);
  const [loading, setLoading] = useState(!location.state?.comision);
  const [isPinned, setIsPinned] = useState(false);
  const [pinPending, setPinPending] = useState(false);

  // Carga de la comisión (fallback deep-link / refresh)
  useEffect(() => {
    if (location.state?.comision) {
      setComision(location.state.comision);
      setLoading(false);
      return undefined;
    }
    if (!comisionId) return undefined;

    let ignore = false;
    setLoading(true);
    getComisionDetalle(comisionId)
      .then((data) => {
        if (!ignore) setComision(data);
      })
      .catch((error) => {
        console.error(error);
        if (!ignore) setComision(null);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [location.state, comisionId]);

  // Estado de favorito
  useEffect(() => {
    if (!user?.id || !comision?.comisionId) return;
    getAlumnoComisionIds(user.id)
      .then((ids) => setIsPinned(ids.includes(comision.comisionId)))
      .catch(console.error);
  }, [user?.id, comision?.comisionId]);

  const volver = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/buscar");
  };

  const toggleFav = async () => {
    if (!user?.id || !comision?.comisionId || pinPending) return;
    const estaba = isPinned;
    setPinPending(true);
    setIsPinned(!estaba);
    try {
      if (estaba) await quitarAlumnoComision(user.id, comision.comisionId);
      else await guardarAlumnoComision(user.id, comision.comisionId);
    } catch (error) {
      console.error(error);
      setIsPinned(estaba);
    } finally {
      setPinPending(false);
    }
  };

  const verHorario = (horario) => {
    const clase = buildClaseDetalleFromHorario(horario, isPinned);
    navigate(`/cursada/clases/${horario.id}`, { state: { clase } });
  };

  if (loading) return <PantallaCarga mensaje="Cargando materia..." compact />;

  if (!comision) {
    return (
      <div className="flex h-full flex-col bg-base pb-20">
        <DetalleHeader detalle={{ aula: "Materia no encontrada", estado: null }} onBack={volver} />
        <main className="px-8 py-5">
          <Tip
            icon={Siren}
            title="No encontramos esta materia"
            description="Volvé a la búsqueda e intentá abrirla nuevamente."
            actionLabel="Volver a buscar"
            actionTo="/buscar"
          />
        </main>
      </div>
    );
  }

  const ubicacion = [comision.aula, comision.edificio].filter(Boolean).join(" · ");

  return (
    <div className="flex h-full flex-col bg-base">
      <DetalleHeader
        detalle={{ aula: comision.nombre, edificio: comision.codigo, estado: null }}
        onBack={volver}
      />

      <main className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-8 py-6 lg:px-12">
        {/* Resumen + favorito */}
        <div className="flex items-start justify-between gap-3 rounded-[20px] bg-neutral-white px-5 py-4">
          <div className="min-w-0 flex flex-col gap-1">
            <span className="inline-flex self-start border border-action rounded-full px-2 py-0.5 text-label-caption text-neutral-extra-dark">
              {comision.codigo}
            </span>
            {ubicacion ? (
              <span className="flex items-center gap-2 text-body-s text-neutral-dark">
                <MapPin size={16} className="shrink-0 text-identity" />
                {ubicacion}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={toggleFav}
            disabled={pinPending}
            aria-label={isPinned ? "Quitar de mi cursada" : "Agregar a mi cursada"}
            className="shrink-0 rounded-full p-2 transition-all active:scale-90 disabled:cursor-wait outline-none"
          >
            <Heart
              size={22}
              className={isPinned ? "text-action fill-action" : "text-neutral-main hover:text-action"}
            />
          </button>
        </div>

        {/* Horarios de la comisión */}
        <section className="flex flex-col gap-3">
          <p className="text-body-s uppercase text-identity">
            {comision.horarios.length === 1 ? "Horario" : "Horarios"} de la comisión
          </p>

          {comision.horarios.length === 0 ? (
            <p className="text-body-m text-neutral-dark">Esta comisión no tiene horarios cargados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {comision.horarios.map((h) => {
                const esVirtual = h.modalidad === "virtual";
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => verHorario(h)}
                    className="flex items-center gap-3 rounded-[20px] border-l-4 border-identity bg-neutral-white px-5 py-4 text-left transition-all hover:shadow-sm active:scale-[0.99] outline-none"
                  >
                    <CalendarClock size={20} className="shrink-0 text-identity" />
                    <div className="min-w-0 flex-1">
                      <p className="text-heading-l text-neutral-extra-dark">{h.dia}</p>
                      <p className="text-body-s text-neutral-dark">
                        {hhmm(h.inicio)} - {hhmm(h.fin)}
                        {esVirtual ? " · Virtual" : ""}
                      </p>
                    </div>
                    <ChevronRight size={20} className="shrink-0 text-neutral-main" />
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
