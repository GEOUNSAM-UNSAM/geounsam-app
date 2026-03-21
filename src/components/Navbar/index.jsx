import { NavLink } from "react-router-dom";
import house from "../../assets/icons/house.svg";
import search from "../../assets/icons/search.svg";
import map from "../../assets/icons/map.svg";
import calendar from "../../assets/icons/calendar.svg";
import user from "../../assets/icons/user.svg";

const tabs = [
    { name: "Inicio", path: "/inicio", icon: house },
    { name: "Buscar", path: "/buscar", icon: search },
    { name: "Mapa", path: "/mapa", icon: map },
    { name: "Cursada", path: "/cursada", icon: calendar },
    { name: "Perfil", path: "/perfil", icon: user },
];

export default function Navbar() {
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-neutral-white rounded-t-2xl px-4 py-3">
            <div className="flex items-center justify-between px-3">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 font-saira text-sm ${
                                isActive ? "text-neutral-dark" : "text-neutral-main"
                            }`
                        }
                    >
                        <img src={tab.icon} alt={tab.name} className="w-6 h-6" />
                        {tab.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
