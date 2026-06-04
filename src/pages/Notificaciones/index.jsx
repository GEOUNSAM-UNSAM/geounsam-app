import { ArrowLeft, CircleCheck, MoveRight, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';
import logotipoWhite from '../../assets/logotipo_white.svg';
import samuLupa from '../../assets/samu_lupa.png';
import BotonGhost from '../../components/BotonGhost';

function NotificationIcon({ tipo }) {
  if (tipo === 'confirmado') {
    return (
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-state-green text-status-green">
        <CircleCheck size={24} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-state-yellow text-data-orange-500">
      <TriangleAlert size={24} strokeWidth={2} />
    </span>
  );
}

function CambioDetalle({ detalle }) {
  if (!detalle) return null;

  return (
    <div className="flex min-w-0 items-center gap-2 pb-1">
      <span className="truncate text-label-caption text-neutral-dark line-through">
        {detalle.anterior}
      </span>
      <MoveRight size={20} className="shrink-0 text-neutral-dark" />
      <span className="truncate text-label-caption text-data-orange-500">
        {detalle.nuevo}
      </span>
    </div>
  );
}

function NotificacionCard({ notificacion, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(notificacion)}
      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-state-neutral"
    >
      <NotificationIcon tipo={notificacion.tipo} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-m text-neutral-extra-dark">
          {notificacion.titulo}
        </p>
        {notificacion.descripcion ? (
          <p className="line-clamp-2 text-body-s text-neutral-dark">
            {notificacion.descripcion}
          </p>
        ) : (
          <CambioDetalle detalle={notificacion.detalle} />
        )}
        <p className="text-label-caption text-neutral-main">
          {notificacion.tiempo}
        </p>
      </div>

      {!notificacion.read ? (
        <span className="h-2 w-2 shrink-0 rounded-full bg-action" />
      ) : (
        <span className="h-2 w-2 shrink-0" />
      )}
    </button>
  );
}

function EstadoVacio() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 pb-16 pt-10 text-center">
      <img
        src={samuLupa}
        alt=""
        className="h-[200px] w-[195px] max-w-full object-contain"
      />
      <div className="mt-4 flex max-w-[348px] flex-col gap-4">
        <h2 className="text-heading-l text-identity">Todo tranquilo por acá</h2>
        <p className="text-body-m text-neutral-extra-dark">
          Cuando haya cambios en tus clases o confirmaciones de reportes, te
          avisamos acá
        </p>
      </div>
    </main>
  );
}

export default function Notificaciones() {
  const navigate = useNavigate();
  const { loading, error, notificaciones, hayNotificaciones, limpiarTodo } =
    useNotifications();

  const abrirNotificacion = (notificacion) => {
    if (notificacion.horarioId) {
      navigate(`/cursada/clases/${notificacion.horarioId}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-white">
      <header className="flex h-16 items-center bg-identity px-4">
        <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
      </header>

      <div className="flex h-[92px] items-center gap-3 bg-identity px-6 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center text-action"
          aria-label="Volver"
        >
          <ArrowLeft size={30} />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
          <h1 className="text-heading-xl truncate text-neutral-white">
            Notificaciones
          </h1>
          {hayNotificaciones ? (
            <BotonGhost
              texto="Limpiar todo"
              onClick={limpiarTodo}
            />
          ) : null}
        </div>
      </div>

      {loading ? (
        <main className="flex flex-1 items-center justify-center px-8 text-center">
          <p className="text-body-m text-neutral-dark">
            Cargando notificaciones...
          </p>
        </main>
      ) : hayNotificaciones ? (
        <main className="flex-1 pt-3">
          {error ? (
            <p className="px-5 pb-3 text-label-caption text-error">
              {error}
            </p>
          ) : null}
          <div className="divide-y divide-neutral-main/70">
            {notificaciones.map((notificacion) => (
              <NotificacionCard
                key={notificacion.id}
                notificacion={notificacion}
                onOpen={abrirNotificacion}
              />
            ))}
          </div>
        </main>
      ) : (
        <EstadoVacio />
      )}
    </div>
  );
}
