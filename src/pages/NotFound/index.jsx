import { useNavigate } from "react-router-dom";
import BurbujaDialogo from "../../components/Onboarding/BurbujaDialogo/index.jsx";
import Header from "../../components/Header/index.jsx";
import samuTriste from "../../assets/samu_triste.png";

const MENSAJE_NOT_FOUND = "No pude encontrar lo que estabas buscando...";

export default function NotFound() {
    const navigate = useNavigate();

    function reintentar() {
        navigate("/", { replace: true });
    }

    return (
        <div className="flex min-h-screen flex-col bg-state-red">
            <Header />

            <div className="flex flex-1 flex-col items-center justify-between px-8 py-8">
                <div className="flex w-full flex-col items-center gap-4">
                    <BurbujaDialogo texto={MENSAJE_NOT_FOUND} />

                    <img
                        src={samuTriste}
                        alt="Samu triste"
                        className="mt-6 h-[300px] w-[191px] object-contain"
                    />
                </div>

                <div className="flex w-full flex-col items-center gap-4 text-center">
                    <h1 className="font-saira text-[22px] font-semibold leading-8 text-identity">
                        No encontrado
                    </h1>
                    <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                        Volvé al inicio e intentá nuevamente
                    </p>
                </div>

                <button
                    type="button"
                    onClick={reintentar}
                    className="h-11 w-full rounded-xl bg-action font-saira text-lg font-semibold text-neutral-extra-dark"
                >
                    Reintentar
                </button>
            </div>
        </div>
    );
}
