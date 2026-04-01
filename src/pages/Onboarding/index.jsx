import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAccess } from "../../context/AccessContext.jsx";
import { marcarOnboardingVisto } from "../../services/alumnos";
import BurbujaDialogo from "../../components/Onboarding/BurbujaDialogo/index.jsx";
import IndicadorPasos from "../../components/Onboarding/IndicadorPasos/index.jsx";
import logotipo from "../../assets/logotipo_white.svg";
import samuSaludando from "../../assets/samu_saludando.png";
import samuMapa from "../../assets/samu_mapa.png";
import samuPulgar from "../../assets/samu_pulgar.png";

const PASOS = [
    {
        imagen: samuSaludando,
        burbuja:
            "¡Hola! Soy Samu, el jabalí del campus.\nVoy a ayudarte a\nencontrar tu aula sin vueltas.",
        titulo: "Bienvenido a GEOUNSAM",
        descripcion: "La app colaborativa del campus de San Martín",
    },
    {
        imagen: samuMapa,
        burbuja:
            "Acá vas a ver en tiempo real dónde es tu próxima clase, con el mapa del edificio incluido.",
        titulo: "Tu cursada, siempre actualizada",
        descripcion:
            "Aulas, horarios y cambios de último momento en un solo lugar",
    },
    {
        imagen: samuPulgar,
        burbuja:
            "Entre todos mantenemos la info actualizada. \nSi ves un cambio, avisás. \n¡La comunidad te cubre!",
        titulo: "Entre todos lo hacemos mejor",
        descripcion:
            "Confirmá ubicaciones y reportá cambios para ganar puntos y ayudar a otros",
    },
];

export default function Onboarding() {
    const [paso, setPaso] = useState(0);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refresh } = useAccess();
    const pasoActual = PASOS[paso];

    async function siguiente() {
        if (paso < PASOS.length - 1) {
            setPaso(paso + 1);
            return;
        }
        if (user) {
            try {
                await marcarOnboardingVisto(user.id);
                await refresh();
                navigate("/", { replace: true });
            } catch {
                navigate("/sin-conexion", { replace: true });
            }
        } else {
            localStorage.setItem("onboarding_completado", "1");
            navigate("/login", { replace: true });
        }
    }

    function atras() {
        setPaso(paso - 1);
    }

    return (
        <div className="flex flex-col h-screen w-full bg-base">
            <div className="bg-identity h-16 flex items-center px-5 shrink-0">
                <img src={logotipo} alt="GeoUNSAM" className="h-5" />
            </div>

            <div className="flex flex-col flex-1 items-center justify-between px-8 py-6 w-full">
                <IndicadorPasos total={PASOS.length} actual={paso} />

                <div className="flex flex-col items-center gap-5 w-full">
                    <BurbujaDialogo texto={pasoActual.burbuja} />
                    <img
                        src={pasoActual.imagen}
                        alt="Samu"
                        className="h-[280px] object-contain"
                    />
                </div>

                <div className="text-center w-full">
                    <h2 className="font-saira font-semibold text-[22px] leading-8 text-identity">
                        {pasoActual.titulo}
                    </h2>
                    <p className="font-saira text-base text-neutral-extra-dark mt-2 leading-6">
                        {pasoActual.descripcion}
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <button
                        onClick={siguiente}
                        className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg h-11 rounded-xl w-full"
                    >
                        {paso < PASOS.length - 1
                            ? "Siguiente"
                            : "¡Entrar al campus!"}
                    </button>
                    <button
                        onClick={atras}
                        className={`border border-identity text-identity font-saira text-sm h-11 rounded-xl w-full ${paso === 0 ? "invisible" : ""}`}
                    >
                        Atrás
                    </button>
                </div>
            </div>
        </div>
    );
}
