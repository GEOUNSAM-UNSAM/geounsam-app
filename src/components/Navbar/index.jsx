import { NavLink } from "react-router-dom";
import { House, Search, MapPin, Calendar, CircleUser } from "lucide-react";

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
        icon: <CircleUser size={24} />,
    },
];

export default function Navbar() {
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-neutral-white px-4 py-3">
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
                        {tab.icon}
                        {tab.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
