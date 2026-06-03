import { X, CircleCheck, MoveRight, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';
import samuLupa from '../../assets/samu_lupa.png';
import BotonGhost from '../BotonGhost';

function NotificationIcon({ tipo }) {
  if (tipo === 'confirmado') {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-state-green text-status-green">
        <CircleCheck size={20} strokeWidth={2} />
      </span>
    );
  }
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-state-yellow text-data-orange-500">
      <TriangleAlert size={20} strokeWidth={2} />
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
      <MoveRight size={16} className="shrink-0 text-neutral-dark" />
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
      className="flex w-full items-center justify-between gap-4 border-b border-neutral-light/30 px-5 py-4 text-left transition-colors hover:bg-neutral-light/10"
    >
      <NotificationIcon tipo={notificacion.tipo} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-s text-neutral-extra-dark">
          {notificacion.titulo}
        </p>
        {notificacion.descripcion ? (
          <p className="line-clamp-2 text-body-s text-neutral-dark mt-0.5">
            {notificacion.descripcion}
          </p>
        ) : (
          <div className="mt-0.5"><CambioDetalle detalle={notificacion.detalle} /></div>
        )}
        <p className="text-label-caption text-neutral-main mt-1.5">
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
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-16 pt-10 text-center h-full">
      <img src={samuLupa} alt="" className="h-[140px] w-auto max-w-full object-contain" />
      <div className="mt-6 flex flex-col gap-2">
        <h2 className="text-title-m text-identity font-bold">Todo tranquilo por acá</h2>
        <p className="text-body-s text-neutral-dark">
          Cuando haya cambios en tus clases o confirmaciones, te avisamos acá.
        </p>
      </div>
    </div>
  );
}

export default function NotificationDrawer({ onClose }) {
  const navigate = useNavigate();
  const { loading, error, notificaciones, hayNotificaciones, limpiarTodo } = useNotifications();

  const abrirNotificacion = (notificacion) => {
    if (notificacion.horarioId) {
      navigate(`/cursada/clases/${notificacion.horarioId}`);
      onClose(); // Cerrar el panel al navegar a la clase
    }
  };

  return (
    <div className="absolute top-[70px] right-0 bottom-0 w-[380px] bg-neutral-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-neutral-light/50 z-40 flex flex-col">
      {/* Cabecera del Panel */}
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-light/30 px-6 py-4 bg-neutral-white">
        <h3 className="font-bold text-identity text-title-m">Notificaciones</h3>
        <div className="flex items-center gap-3">
          {hayNotificaciones && (
            <BotonGhost
              texto="Limpiar todo"
              onClick={limpiarTodo}
              className='font-semibold'
            />
          )}
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-neutral-dark hover:bg-neutral-light/30 transition-colors"
            aria-label="Cerrar notificaciones"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Cuerpo del Panel */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-body-m text-neutral-dark">Cargando...</p>
          </div>
        ) : hayNotificaciones ? (
          <div className="flex flex-col pb-4">
            {error && (
              <p className="px-5 py-3 text-label-caption text-error bg-state-red/10">
                {error}
              </p>
            )}
            {notificaciones.map((notificacion) => (
              <NotificacionCard
                key={notificacion.id}
                notificacion={notificacion}
                onOpen={abrirNotificacion}
              />
            ))}
          </div>
        ) : (
          <EstadoVacio />
        )}
      </div>
    </div>
  );
}
