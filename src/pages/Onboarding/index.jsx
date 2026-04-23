import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAccess } from "../../context/AccessContext.jsx";
import { marcarOnboardingVisto } from "../../services/alumnos";
import BurbujaDialogo from "../../components/Onboarding/BurbujaDialogo/index.jsx";
import IndicadorPasos from "../../components/Onboarding/IndicadorPasos/index.jsx";
import logotipo from "../../assets/logotipo_white.svg";
import samuOnboarding from "../../assets/samu_onboarding.png";
import samuMapa from "../../assets/samu_mapa.png";
import samuPulgar from "../../assets/samu_pulgar.png";
import BotonPrincipal from "../../components/BotonPrincipal/index.jsx";
import BotonOutline from "../../components/BotonOutline/index.jsx";

const PASOS = [
    {
        imagen: samuOnboarding,
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
                navigate("/404", { replace: true });
            }
        } else {
            localStorage.setItem("onboarding_completado", "1");
            navigate("/bienvenida", { replace: true });
        }
    }

    function atras() {
        setPaso(paso - 1);
    }

    return (
        <div className="flex flex-col flex-1 items-center h-screen justify-between p-12 w-full">
            <IndicadorPasos total={PASOS.length} actual={paso} />

            <div className="flex flex-col items-center gap-10 w-full">
                <BurbujaDialogo texto={pasoActual.burbuja} />
                <img
                    src={pasoActual.imagen}
                    alt="Samu"
                    className="h-[280px] object-contain"
                />
            </div>

            <div className="text-center w-full gap-2 flex flex-col">
                <h2 className="text-heading-l text-identity">
                    {pasoActual.titulo}
                </h2>
                <p className="text-body-m text-neutral-extra-dark">
                    {pasoActual.descripcion}
                </p>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-1/2">
                <BotonPrincipal
                    onClick={siguiente}
                    texto={
                        paso < PASOS.length - 1
                            ? "Siguiente"
                            : "¡Entrar al campus!"
                    }
                    className="w-full"
                />
                <BotonOutline
                    onClick={atras}
                    texto="Atrás"
                    className={`w-full ${paso === 0 ? "invisible" : ""}`}
                />
            </div>
        </div>
    );
}
