import { NavLink } from "react-router-dom";

const tabs = [
    { name: "Buscar", path: "/buscar" },
    { name: "Mapa", path: "/mapa" },
    { name: "Cursada", path: "/cursada" },
    { name: "Perfil", path: "/perfil" },
];

export default function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-around">
            {tabs.map((tab) => (
                <NavLink
                    key={tab.path}
                    to={tab.path}
                    className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-sm font-medium ${
                            isActive ? "bg-gray-900" : "hover:bg-gray-700"
                        }`
                    }
                >
                    {tab.name}
                </NavLink>
            ))}
        </nav>
    );
}
