import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookX, CircleX, Lightbulb, Siren } from 'lucide-react';
import ActionToast from '../../components/ActionToast';
import BotonOutline from '../../components/BotonOutline';
import BotonPrincipal from '../../components/BotonPrincipal';
import SelectableOptionCard from '../../components/SelectableOptionCard';
import { useAuth } from '../../context/AuthContext';
import { enviarReporteApp } from '../../services/reportesApp';

const TIPOS_REPORTE = [
  {
    id: 'error_app',
    titulo: 'Error en la app',
    descripcion: 'Algo no funciona',
    icon: CircleX,
    iconContainerClass: 'bg-state-red text-error',
  },
  {
    id: 'info_incorrecta',
    titulo: 'Info incorrecta',
    descripcion: 'Datos de aula o materia',
    icon: BookX,
    iconContainerClass: 'bg-state-yellow text-data-orange-500',
  },
  {
    id: 'sugerencia',
    titulo: 'Sugerencia',
    descripcion: 'Quiero proponer algo',
    icon: Lightbulb,
    iconContainerClass: 'bg-data-green-200 text-data-green-800',
  },
];

export default function HacerReporte() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nombreUsuario =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    null;
  const [tipoSeleccionado, setTipoSeleccionado] = useState('sugerencia');
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [toast, setToast] = useState(null);

  const volver = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/inicio');
  };

  const enviarReporte = async () => {
    const descripcionNormalizada = descripcion.trim();

    if (!descripcionNormalizada) {
      setToast({
        variant: 'error',
        title: 'Falta la descripción',
        description: 'Contanos brevemente qué pasó.',
      });
      return;
    }

    setEnviando(true);

    try {
      await enviarReporteApp({
        userId: user?.id,
        userName: nombreUsuario,
        tipo: tipoSeleccionado,
        descripcion: descripcionNormalizada,
      });

      setDescripcion('');
      setToast({
        variant: 'success',
        title: 'Reporte enviado',
        description: 'Gracias por ayudarnos a mejorar la app.',
      });
    } catch (error) {
      console.error(error);
      setToast({
        variant: 'error',
        title: 'No pudimos enviar el reporte',
        description: error?.message ?? 'Intentá nuevamente en unos minutos.',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-base pb-24 lg:pb-8">
      <div className="flex h-[92px] items-center gap-3 bg-base px-6 py-3 lg:px-8">
        <button
          type="button"
          onClick={volver}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-identity"
          aria-label="Volver"
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="text-heading-xl truncate text-identity">
          Hacer un reporte
        </h1>
      </div>

      <main className="flex min-h-0 flex-1 flex-col px-8 pb-6 pt-2 lg:max-w-[560px]">
        <section className="flex flex-col gap-3">
          <p className="text-body-s uppercase text-identity">
            ¿De qué tipo es tu reporte?
          </p>

          <div className="flex flex-col gap-3">
            {TIPOS_REPORTE.map((tipo) => (
              <SelectableOptionCard
                key={tipo.id}
                icon={tipo.icon}
                title={tipo.titulo}
                description={tipo.descripcion}
                iconContainerClass={tipo.iconContainerClass}
                selected={tipoSeleccionado === tipo.id}
                onSelect={() => setTipoSeleccionado(tipo.id)}
              />
            ))}
          </div>
        </section>

        <section className="mt-5 flex flex-col gap-2">
          <label
            htmlFor="descripcion-reporte"
            className="text-body-s uppercase text-identity"
          >
            Descripción
          </label>
          <textarea
            id="descripcion-reporte"
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            placeholder="Contanos qué pasó, en que lugar de la app y cuáles fueron tus pasos..."
            className="min-h-[60px] w-full resize-none rounded-[15px] border border-neutral-light bg-neutral-white px-5 py-3 text-body-s text-neutral-extra-dark outline-none placeholder:text-neutral-dark focus:border-action"
          />
        </section>

        <section className="mt-6 flex items-start gap-2 rounded-[20px] border-2 border-action bg-state-blue p-4 text-neutral-extra-dark">
          <Siren size={20} className="mt-0.5 shrink-0 text-action" />
          <p className="text-body-m">
            Revisamos los reportes únicamente con el fin de mejorar la app y tu
            experiencia
          </p>
        </section>

        <div className="mt-auto flex flex-col gap-6 pt-16">
          <BotonPrincipal
            texto={enviando ? 'Enviando...' : 'Enviar reporte'}
            onClick={enviarReporte}
            disabled={enviando}
          />
          <BotonOutline texto="Cancelar" onClick={volver} disabled={enviando} />
        </div>
      </main>

      <ActionToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
