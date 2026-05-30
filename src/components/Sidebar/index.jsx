import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Bug, MoreHorizontal, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { obtenerInicialesNombre } from '../../utils/avatar';
import logotipoWhite from '../../assets/logotipo_white.svg';
import { NAV_ITEMS } from '../../config/navItems';

function SidebarPopover({ onGoPerfil, onGoReporte, onLogout, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-2xl border border-neutral-light/20 bg-identity shadow-xl"
      role="menu"
    >
      {/* Perfil */}
      <button
        type="button"
        onClick={onGoPerfil}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-light/10"
        role="menuitem"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-light/10">
          <User size={16} className="text-neutral-white" />
        </div>
        <div>
          <p className="text-body-m text-neutral-white">Perfil</p>
        </div>
      </button>

      <button
        type="button"
        onClick={onGoReporte}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-light/10"
        role="menuitem"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-light/10">
          <Bug size={16} className="text-neutral-white" />
        </div>
        <div>
          <p className="text-body-m text-neutral-white">Hacer un reporte</p>
        </div>
      </button>

      {/* Separador */}
      <div className="mx-4 border-t border-neutral-light/20" />

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-state-red/10"
        role="menuitem"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-data-red-900/60">
          <LogOut size={16} className="text-error" />
        </div>
        <p className="text-body-m text-error">Cerrar sesión</p>
      </button>
    </div>
  );
}

export function TopNavbar() {
  return (
    <header className="hidden lg:flex w-full h-[70px] shrink-0 bg-identity items-center px-8 z-50 border-b border-neutral-light/20">
      <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
    </header>
  );
}

export default function SidebarNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const nombre =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    'Usuario';

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

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col bg-identity">
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-body-m transition-colors ${
                isActive
                  ? 'bg-action/10 text-action'
                  : 'text-neutral-main hover:bg-neutral-light/10 hover:text-neutral-white'
              }`
            }
          >
            <Icon size={20}/>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Perfil en el pie */}
      <div className="relative border-t border-neutral-light/20 p-4">
        {menuAbierto && (
          <SidebarPopover
            onGoPerfil={irAPerfil}
            onGoReporte={irAReporte}
            onLogout={irALogout}
            onClose={() => setMenuAbierto(false)}
          />
        )}

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-neutral-light/10 outline-none focus:ring-2 focus:ring-action/50"
        >
          {/* Avatar */}
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-neutral-light/20">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Perfil"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-base">
                <span className="text-body-s font-semibold text-identity">
                  {obtenerInicialesNombre(nombre)}
                </span>
              </div>
            )}
          </div>

          <span className="min-w-0 flex-1 text-wrap text-title-m text-neutral-white">
            {nombre}
          </span>

          <MoreHorizontal
            size={18}
            className={`shrink-0 transition-colors ${menuAbierto ? 'text-action' : 'text-neutral-main'}`}
          />
        </button>
      </div>
    </aside>
  );
}
