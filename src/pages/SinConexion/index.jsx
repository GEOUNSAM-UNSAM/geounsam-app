import BurbujaDialogo from "../../components/Onboarding/BurbujaDialogo/index.jsx";
import Header from "../../components/Header/index.jsx";
import samuTriste from "../../assets/samu_triste.png";

const MENSAJE_SIN_CONEXION =
    "No puedo traerte info del campus ahora. Revisá tu conexión y volvé a intentar";

export default function SinConexion() {
    function reintentar() {
        window.location.reload();
    }

    return (
    <div className="flex min-h-screen flex-col bg-state-red">
            <Header />

            <div className="flex flex-1 flex-col items-center justify-between px-8 py-8">
                <div className="flex w-full flex-col items-center gap-4">
                    <BurbujaDialogo texto={MENSAJE_SIN_CONEXION} />

                    <img
                        src={samuTriste}
                        alt="Samu sin conexión"
                        className="mt-6 h-[300px] w-auto object-contain"
                    />
                </div>

                <div className="flex w-full flex-col items-center gap-4 text-center">
                    <h1 className="font-saira text-[22px] font-semibold leading-8 text-identity">
                        Sin conexión
                    </h1>
                    <p className="font-saira text-base leading-6 text-black">
                        Revisá tu conexión a internet
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
