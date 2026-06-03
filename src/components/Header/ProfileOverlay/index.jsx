import { useEffect } from 'react';
import {
  ChevronRight,
  LogOut,
  Star,
  TableProperties,
  User,
  X,
  Bug,
} from 'lucide-react';
import { obtenerInicialesNombre } from '../../../utils/avatar';

function OverlayAction({
  icon,
  title,
  description,
  onClick,
  accentClass = 'bg-neutral-extra-dark text-neutral-white',
  textClass = 'text-neutral-white',
  descriptionClass = 'text-neutral-dark',
  iconStrokeClass = '',
  chevron = true,
  disabled = false,
}) {
  const IconComponent = icon;

  const content = (
    <>
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] ${accentClass}`}
      >
        <IconComponent size={24} className={iconStrokeClass} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p
          className={`text-heading-l ${textClass}`}
        >
          {title}
        </p>
        {description ? (
          <p className={`text-body-s ${descriptionClass}`}>
            {description}
          </p>
        ) : null}
      </div>
      {chevron ? (
        <ChevronRight size={22} className="shrink-0 text-neutral-white" />
      ) : null}
    </>
  );

  if (disabled) {
    return <div className="flex w-full items-center gap-3 py-4">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 py-4 text-left"
    >
      {content}
    </button>
  );
}

export default function ProfileOverlay({
  open,
  avatarUrl,
  nombre,
  carrera,
  nivel,
  onClose,
  onGoPerfil,
  onGoReporte,
  onLogout,
}) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  const iniciales = obtenerInicialesNombre(nombre);
  return (
    <div
      className="fixed inset-0 z-[60] bg-identity"
      role="dialog"
      aria-modal="true"
      aria-label="Menú de perfil"
    >
      <div className="relative flex min-h-screen flex-col px-8 pb-8 pt-5">
        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-white"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center px-4 pb-4 pt-16">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Perfil"
              className="h-20 w-20 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-main">
              <span className="text-heading-xl text-neutral-extra-dark">
                {iniciales}
              </span>
            </div>
          )}

          <span className="mt-0.5 text-heading-xl text-neutral-light text-center ">
            {nombre}
          </span>

          {carrera ? (
            <p className="mt-0.5 text-body-s text-neutral-light text-center">
              {carrera}
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex flex-col gap-1 border-t border-neutral-dark/60 pt-1">
          <OverlayAction
            icon={User}
            title="Perfil"
            description="Información de tu cuenta y carrera"
            onClick={onGoPerfil}
          />
          <OverlayAction
            icon={Bug}
            title="Hacer un reporte"
            description="Notificá si tuviste un error o si querés sugerir nuevas ideas"
            onClick={onGoReporte}
          />
        </div>

        <div className="mt-2 border-t border-neutral-dark/60 pt-3">
          <OverlayAction
            icon={LogOut}
            title="Cerrar sesión"
            description=""
            onClick={onLogout}
            accentClass="bg-data-red-900 text-error"
            textClass="text-error"
            descriptionClass="text-error"
            iconStrokeClass="text-error"
            chevron={false}
          />
        </div>
      </div>
    </div>
  );
}
