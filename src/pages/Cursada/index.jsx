import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Tip from '../../components/Tip';
import { useAuth } from '../../context/AuthContext';
import { getMateriasPinneadasConHorarios } from '../../services/comisiones';
import { getDiasSemanana } from '../../utils/tiempo';
import { getClasesParaDia } from '../../utils/cursada';
import SemanaCalendar from '../../components/Cursada/SemanaCalendar';
import CardMateria from '../../components/Cursada/CardMateria';
import CardSinClases from '../../components/Cursada/CardSinClases';
import LabelDia from '../../components/Cursada/LabelDia';
import { getDetalleAulaPath } from '../../utils/edificios';

export default function Cursada() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const diasSemana = getDiasSemanana();
  const idxHoy = diasSemana.findIndex((d) => d.esHoy);
  const [diaIdx, setDiaIdx] = useState(idxHoy >= 0 ? idxHoy : 0);
  const date = new Date();
  const cuatrimestre = date.getMonth() >= 7 ? 'Segundo cuatrimestre' : 'Primer cuatrimestre';
  const anio = date.getFullYear();

  useEffect(() => {
    if (!user) return;
    getMateriasPinneadasConHorarios(user.id)
      .then(setMaterias)
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const diaActual = diasSemana[diaIdx];
  const clasesHoy = getClasesParaDia(materias, diaActual?.diaDB);

  const proximaConClases = diasSemana
    .slice(diaIdx + 1)
    .find((d) => getClasesParaDia(materias, d.diaDB).length > 0);
  const proximasClases = proximaConClases
    ? { dia: proximaConClases, clases: getClasesParaDia(materias, proximaConClases.diaDB) }
    : null;

  const diasConClases = diasSemana.map((d) => getClasesParaDia(materias, d.diaDB).length > 0);

  const abrirDetalleAula = (clase) => {
    if (clase.detalleClasePath) {
      navigate(clase.detalleClasePath, { state: clase.detalleClaseState });
      return;
    }
    if (!clase.aulaDetalle) return;

    const path = getDetalleAulaPath({ edificio: clase.edificio, aula: clase.aulaDetalle });
    if (!path) return;

    navigate(path, {
      state: { aula: clase.aulaDetalle, edificio: clase.edificio, piso: clase.piso },
    });
  };

  return (
    <div className="flex flex-col w-full bg-base min-h-screen max-h lg:min-h-full lg:max-h-[900px] lg:overflow-hidden">
      <div className="flex flex-col gap-5 px-6 py-4 pb-6 lg:p-8 lg:gap-8 max-w-[1200px] mx-auto w-full flex-1">
        {/* ENCABEZADO (Móvil y Desktop) */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-xl lg:hidden text-neutral-extra-dark">
              Mi cursada
            </h1>
            <p className="text-body-m lg:text-title-m text-neutral-dark">
              {cuatrimestre} {anio}
            </p>
          </div>
          
        </div>

        {/* LAYOUT DE COLUMNAS (Grid en Desktop, Flex en Móvil) */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-4 flex-1">
          
          {/* COLUMNA IZQUIERDA: CALENDARIO (4/12 en Desktop) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 ">
            <div className="lg:bg-neutral-white/60 lg:rounded-[30px] lg:p-6 lg:shadow-sm lg:border lg:border-neutral-light/50">
              <h2 className="hidden lg:block text-title-m text-identity mb-2">Semana actual</h2>
              <SemanaCalendar
                diasSemana={diasSemana}
                diaIdx={diaIdx}
                diasConClases={diasConClases}
                onSelect={setDiaIdx}
              />
            </div>
          </aside>

          {/* COLUMNA DERECHA: LÍNEA DE TIEMPO (8/12 en Desktop) */}
          <main className="lg:col-span-8 flex flex-col gap-4 lg:bg-neutral-white/60 lg:rounded-[30px] lg:p-8 lg:shadow-sm lg:border lg:border-neutral-light/50 lg:max-h-[900px] lg:overflow-y-auto">
            {loading ? (
              <p className="text-body-m text-neutral-main text-center my-auto">Cargando...</p>
            ) : error ? (
              <Tip
                icon={AlertCircle}
                title="No pudimos cargar tu cursada"
                description="Revisá tu conexión e intentá de nuevo."
              />
            ) : (
              <>
                {/* Título de la Agenda Desktop */}
                <div className="hidden lg:flex justify-between items-center border-b border-neutral-light/80 pb-4">
                  <div>
                    <h2 className="text-heading-l text-neutral-extra-dark">
                      {diaActual.nombre}, {diaActual.num}
                    </h2>
                    <p className="text-body-m text-neutral-dark">
                      {clasesHoy.length > 0 
                        ? `Tenés ${clasesHoy.length} materias programadas para hoy.` 
                        : 'Día libre, sin materias.'}
                    </p>
                  </div>
                </div>

                {/* Etiqueta Móvil */}
                <div className="lg:hidden">
                  <LabelDia nombre={diaActual.nombre} num={diaActual.num} />
                </div>

                {/* CONTENEDOR DE CLASES */}
                <div className="relative flex flex-col gap-4 lg:gap-6">
                  {clasesHoy.length > 0 ? (
                    clasesHoy.map((clase) => (
                      <div className="relative z-10 flex lg:gap-6 group w-full">
                        {/* Tarjeta de la Materia*/}
                        <div className="flex-1 w-full">
                          <CardMateria
                            key={clase.id}
                            clase={clase}
                            onOpen={() => abrirDetalleAula(clase)}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full">
                      <CardSinClases />
                      {proximasClases && (
                        <div className="mt-8">
                          <LabelDia
                            nombre={proximasClases.dia.nombre}
                            num={proximasClases.dia.num}
                            prefijo="PRÓXIMAS CLASES"
                          />
                          <div className="mt-4 flex flex-col gap-4">
                            {proximasClases.clases.map((clase) => (
                              <CardMateria
                                key={clase.id}
                                clase={clase}
                                onOpen={() => abrirDetalleAula(clase)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
