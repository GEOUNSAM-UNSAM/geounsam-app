import { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { MoreHorizontal, User, TableProperties, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { obtenerInicialesNombre } from '../../utils/avatar';
import logotipoWhite from '../../assets/logotipo_white.svg';
import { NAV_ITEMS } from '../../config/navItems';

function SidebarPopover({ onGoPerfil, onLogout, onClose }) {
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
      className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-2xl border border-white/10 bg-identity shadow-xl"
      role="menu"
    >
      {/* Perfil */}
      <button
        type="button"
        onClick={onGoPerfil}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
        role="menuitem"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <User size={16} className="text-white" />
        </div>
        <div>
          <p className="text-body-m text-white">Perfil</p>
        </div>
      </button>

      {/* Editar info — disabled */}
      <div className="flex w-full items-center gap-3 px-4 py-3 opacity-40">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <TableProperties size={16} className="text-white" />
        </div>
        <div>
          <p className="text-body-m text-white">Editar información</p>
        </div>
      </div>

      {/* Separador */}
      <div className="mx-4 border-t border-white/10" />

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
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
  const irALogout = () => {
    setMenuAbierto(false);
    navigate('/logout');
  };

  return (
    <aside className="hidden lg:flex w-[220px] shrink-0 flex-col bg-identity">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-body-s font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-neutral-main hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Perfil en el pie — posición relativa para anclar el popover */}
      <div className="relative border-t border-white/10 px-3 py-4">
        {menuAbierto && (
          <SidebarPopover
            onGoPerfil={irAPerfil}
            onLogout={irALogout}
            onClose={() => setMenuAbierto(false)}
          />
        )}

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/10"
        >
          {/* Avatar */}
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Perfil"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-main">
                <span className="font-saira text-xs font-bold text-neutral-extra-dark">
                  {obtenerInicialesNombre(nombre)}
                </span>
              </div>
            )}
          </div>

          <span className="min-w-0 flex-1 truncate text-body-s font-medium text-white">
            {nombre}
          </span>

          <MoreHorizontal
            size={16}
            className={`shrink-0 transition-colors ${menuAbierto ? 'text-white' : 'text-neutral-main'}`}
          />
        </button>
      </div>
    </aside>
  );
}
