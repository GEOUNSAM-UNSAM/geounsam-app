import { useNavigate } from "react-router-dom";
import BurbujaDialogo from "../../components/Onboarding/BurbujaDialogo/index.jsx";
import Header from "../../components/Header/index.jsx";
import samuTriste from "../../assets/samu_triste.png";
import BotonPrincipal from "../../components/BotonPrincipal/index.jsx";

const MENSAJE_NOT_FOUND = "No pude encontrar lo que estabas buscando...";

export default function NotFound() {
    const navigate = useNavigate();

    function reintentar() {
        navigate("/", { replace: true });
    }

    return (
        <div className="flex flex-1 flex-col h-screen items-center bg-state-red justify-between p-16">
            <div className="flex w-full flex-col items-center gap-12">
                <BurbujaDialogo texto={MENSAJE_NOT_FOUND} />

                <img
                    src={samuTriste}
                    alt="Samu triste"
                    className="h-[350px] w-[400px] object-contain"
                />
            </div>

            <div className="flex w-full flex-col items-center gap-4 text-center">
                <h1 className="text-heading-l text-identity">
                    No encontrado
                </h1>
                <p className="text-body-m text-neutral-extra-dark">
                    Volvé al inicio e intentá nuevamente
                </p>
            </div>

            <BotonPrincipal
                texto="Reintentar"
                className="w-full lg:w-1/2"
                onClick={reintentar}
            />
        </div>
    );
}
