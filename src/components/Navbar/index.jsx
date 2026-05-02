import { NavLink } from 'react-router-dom';
import { NAV_ITEMS_MOBILE } from '../../config/navItems';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-identity px-4 py-3">
      <div className="flex items-center justify-between px-3">
        {NAV_ITEMS_MOBILE.map(({ shortLabel, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-label-caption ${
                isActive ? 'text-white' : 'text-neutral-main'
              }`
            }
          >
            <Icon size={24} />
            {shortLabel}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
