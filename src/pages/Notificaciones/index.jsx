import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logotipoWhite from "../../assets/logotipo_white.svg";
import samuLupa from "../../assets/samu_lupa.png";

export default function Notificaciones() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col bg-neutral-white">
            <header className="bg-identity px-4 py-5">
                <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
            </header>

            <div className="flex items-center gap-4 bg-identity px-6 py-5">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex h-8 w-8 items-center justify-center text-action"
                    aria-label="Volver"
                >
                    <ArrowLeft size={28} />
                </button>
                <h1 className="font-saira font-bold text-[28px] leading-10 text-white">
                    Notificaciones
                </h1>
            </div>

            <main className="flex flex-1 flex-col items-center justify-center px-8 pb-16 pt-10 text-center">
                <img
                    src={samuLupa}
                    alt=""
                    className="w-[195px] max-w-full object-contain"
                />
                <div className="mt-4 flex max-w-[348px] flex-col gap-4">
                    <h2 className="font-saira text-[22px] font-semibold leading-8 text-identity">
                        Todo tranquilo por acá
                    </h2>
                    <p className="font-saira text-base leading-6 text-neutral-extra-dark">
                        Cuando haya cambios en tus clases o confirmaciones de
                        reportes, te avisamos acá
                    </p>
                </div>
            </main>
        </div>
    );
}
