import { NavLink } from "react-router-dom";
import { House, Search, MapPin, Calendar, User } from "lucide-react";

const tabs = [
    {
        name: "Inicio",
        path: "/inicio",
        icon: <House size={24} />,
    },
    {
        name: "Buscar",
        path: "/buscar",
        icon: <Search size={24} />,
    },
    {
        name: "Mapa",
        path: "/mapa",
        icon: <MapPin size={24} />,
    },
    {
        name: "Cursada",
        path: "/cursada",
        icon: <Calendar size={24} />,
    },
    {
        name: "Perfil",
        path: "/perfil",
        icon: <User size={24} />,
    },
];

export default function Navbar() {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-identity px-4 py-3">
            <div className="flex items-center justify-between px-3">
                {tabs.map((tab) => (
                    <NavLink
                        key={tab.path}
                        to={tab.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 font-saira text-sm ${
                                isActive ? "text-white" : "text-neutral-main"
                            }`
                        }
                    >
                        {tab.icon}
                        {tab.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
