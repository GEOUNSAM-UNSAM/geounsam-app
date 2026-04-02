import { Link } from "react-router-dom";
import logo from "../../assets/logo-geounsam.svg";
import samuBienvenida from "../../assets/samu_bienvenida.png";
import BotonGoogle from "../../components/BotonGoogle/index.jsx";

export default function Bienvenida() {
    return (
        <div className="flex flex-col min-h-screen bg-base px-8 pt-[60px] pb-8">
            <div className="flex flex-col items-center gap-6">
                <img src={logo} alt="GeoUNSAM" className="w-[60px] h-[60px]" />

                <img
                    src={samuBienvenida}
                    alt="Samu te da la bienvenida"
                    className="w-[287px] h-[300px] object-contain max-w-full"
                />
            </div>

            <div className="w-full text-center mt-6">
                <h1 className="font-saira font-bold text-[28px] leading-10 text-identity">
                    ¡Te damos la bienvenida!
                </h1>
                <p className="font-saira text-[14px] leading-6 text-neutral-extra-dark mt-6">
                    Navegá por los edificios de la facultad y encontrá tu aula
                    al toque.
                    <br />
                    Validá reportes comunitarios y ganá prestigio
                </p>
            </div>

            <div className="flex flex-col gap-6 mt-auto pt-10">
                <BotonGoogle
                    texto="Registrarme con Google"
                    className="border border-neutral-extra-dark text-neutral-extra-dark h-11 py-0"
                />

                <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-px bg-neutral-main" />
                    <span className="font-saira font-semibold text-lg leading-8 text-neutral-main">
                        o
                    </span>
                    <div className="flex-1 h-px bg-neutral-main" />
                </div>

                <Link
                    to="/registro"
                    className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg h-11 rounded-xl w-full flex items-center justify-center"
                >
                    Registrarme con email
                </Link>

        <Link
          to="/login"
          className="font-faustina font-medium text-base leading-6 text-action visited:text-action active:text-action text-center py-2"
        >
          Ya tengo cuenta
        </Link>
            </div>
        </div>
    );
}
