import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BellDot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationsContext';
import { obtenerInicialesNombre } from '../../utils/avatar.js';
import logotipoWhite from '../../assets/logotipo_white.svg';
import ProfileOverlay from './ProfileOverlay/index.jsx';
import usePerfilResumen from '../../hooks/usePerfilResumen';

function AvatarButton({ avatarUrl, nombre, onClick, className = 'h-8 w-8' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center rounded-full ${className}`}
      aria-label="Abrir menú de perfil"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Perfil"
          className="h-full w-full rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-neutral-main">
          <span className="text-label-caption text-neutral-extra-dark">
            {obtenerInicialesNombre(nombre)}
          </span>
        </div>
      )}
    </button>
  );
}

export default function Header() {
  const { user } = useAuth();
  const { hayNotificaciones } = useNotifications();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const nombre =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    'Usuario';
  const esPerfil = pathname === '/perfil';
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { carrera, nivel } = usePerfilResumen(user?.id, menuAbierto);

  const abrirMenu = () => setMenuAbierto(true);
  const cerrarMenu = () => setMenuAbierto(false);
  const irAPerfil = () => {
    setMenuAbierto(false);
    navigate('/perfil');
  };
  const irAReporte = () => {
    setMenuAbierto(false);
    navigate('/hacer-reporte');
  };
  const irALogout = () => {
    setMenuAbierto(false);
    navigate('/logout');
  };
  const irANotificaciones = () => navigate('/notificaciones');

  return (
    <>
      <header className="bg-identity px-4 h-16 flex items-center justify-between gap-3">
        <img src={logotipoWhite} alt="GEOUNSAM" className="h-5 shrink-0" />

        <div className="flex items-center gap-3 ml-auto">
          <button
            type="button"
            onClick={irANotificaciones}
            className="relative text-neutral-white"
            aria-label="Notificaciones"
          >
            <BellDot size={22} />
            {hayNotificaciones ? (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-action ring-2 ring-identity" />
            ) : null}
          </button>

          <AvatarButton
            avatarUrl={avatarUrl}
            nombre={nombre}
            onClick={abrirMenu}
          />
        </div>
      </header>
      <ProfileOverlay
        open={menuAbierto}
        avatarUrl={avatarUrl}
        nombre={nombre}
        carrera={carrera}
        nivel={nivel}
        onClose={cerrarMenu}
        onGoPerfil={irAPerfil}
        onGoReporte={irAReporte}
        onLogout={irALogout}
      />
    </>
  );
}
