import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMateriasPinneadasConHorarios } from '../../services/comisiones'
import { getDiasSemanana } from '../../utils/tiempo'
import { getClasesParaDia } from '../../utils/cursada'
import SemanaCalendar from '../../components/Cursada/SemanaCalendar'
import CardMateria from '../../components/Cursada/CardMateria'
import CardSinClases from '../../components/Cursada/CardSinClases'
import LabelDia from '../../components/Cursada/LabelDia'

export default function Cursada() {
  const { user } = useAuth()
  const [materias, setMaterias] = useState([])
  const [loading, setLoading] = useState(true)

  const diasSemana = getDiasSemanana()
  const idxHoy = diasSemana.findIndex((d) => d.esHoy)
  const [diaIdx, setDiaIdx] = useState(idxHoy >= 0 ? idxHoy : 0)

  useEffect(() => {
    if (!user) return
    getMateriasPinneadasConHorarios(user.id)
      .then(setMaterias)
      .catch(console.error)
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

  return (
    <div className="flex flex-col gap-5 px-6 py-4 pb-6 bg-[#efefef] min-h-[calc(100dvh-68px-64px)]">
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
          <LabelDia nombre={diaActual.nombre} num={diaActual.num} />

          {clasesHoy.length > 0 ? (
            clasesHoy.map((clase) => <CardMateria key={clase.id} clase={clase} />)
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
                    <CardMateria key={clase.id} clase={clase} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
