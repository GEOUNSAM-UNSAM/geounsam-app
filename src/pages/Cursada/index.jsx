import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import Tip from '../../components/Tip'
import { useAuth } from '../../context/AuthContext'
import { getMateriasPinneadasConHorarios } from '../../services/comisiones'
import { getDiasSemanana } from '../../utils/tiempo'
import { getClasesParaDia } from '../../utils/cursada'
import SemanaCalendar from '../../components/Cursada/SemanaCalendar'
import CardMateria from '../../components/Cursada/CardMateria'
import CardSinClases from '../../components/Cursada/CardSinClases'
import LabelDia from '../../components/Cursada/LabelDia'
import { getDetalleAulaPath } from '../../utils/edificios'

export default function Cursada() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const diasSemana = getDiasSemanana()
  const idxHoy = diasSemana.findIndex((d) => d.esHoy)
  const [diaIdx, setDiaIdx] = useState(idxHoy >= 0 ? idxHoy : 0)

  useEffect(() => {
    if (!user) return
    getMateriasPinneadasConHorarios(user.id)
      .then(setMaterias)
      .catch((err) => {
        console.error(err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [user])

  const diaActual = diasSemana[diaIdx]
  const clasesHoy = getClasesParaDia(materias, diaActual?.diaDB)

  const proximaConClases = diasSemana
    .slice(diaIdx + 1)
    .find((d) => getClasesParaDia(materias, d.diaDB).length > 0)
  const proximasClases = proximaConClases
    ? { dia: proximaConClases, clases: getClasesParaDia(materias, proximaConClases.diaDB) }
    : null

  const diasConClases = diasSemana.map((d) => getClasesParaDia(materias, d.diaDB).length > 0)

  const abrirDetalleAula = (clase) => {
    if (clase.detalleClasePath) {
      navigate(clase.detalleClasePath, {
        state: clase.detalleClaseState,
      })
      return
    }

    if (!clase.aulaDetalle) return

    const path = getDetalleAulaPath({
      edificio: clase.edificio,
      aula: clase.aulaDetalle,
    })
    if (!path) return

    navigate(path, {
      state: {
        aula: clase.aulaDetalle,
        edificio: clase.edificio,
        piso: clase.piso,
      },
    })
  }

  return (
    <div className="flex flex-col gap-5 px-6 py-4 pb-6 bg-base min-h-[calc(100dvh-64px-64px)]">
      <div className="flex flex-col gap-1 pt-1">
        <h1 className="font-saira font-bold text-[28px] text-neutral-extra-dark leading-10">Mi cursada</h1>
        <p className="font-saira text-base text-neutral-main">Primer cuatrimestre 2026</p>
      </div>

      <SemanaCalendar
        diasSemana={diasSemana}
        diaIdx={diaIdx}
        diasConClases={diasConClases}
        onSelect={setDiaIdx}
      />

      {!loading && (
        <div className="flex flex-col gap-4">
          {error ? (
            <Tip
              icon={AlertCircle}
              title="No pudimos cargar tu cursada"
              description="Revisá tu conexión e intentá de nuevo."
            />
          ) : (
            <>
              <LabelDia nombre={diaActual.nombre} num={diaActual.num} />

              {clasesHoy.length > 0 ? (
                clasesHoy.map((clase) => (
                  <CardMateria
                    key={clase.id}
                    clase={clase}
                    onOpen={() => abrirDetalleAula(clase)}
                  />
                ))
              ) : (
                <>
                  <CardSinClases />
                  {proximasClases && (
                    <>
                      <LabelDia
                        nombre={proximasClases.dia.nombre}
                        num={proximasClases.dia.num}
                        prefijo="PRÓXIMAS CLASES"
                      />
                      {proximasClases.clases.map((clase) => (
                        <CardMateria
                          key={clase.id}
                          clase={clase}
                          onOpen={() => abrirDetalleAula(clase)}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
