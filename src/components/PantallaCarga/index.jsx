import samuLoading from "../../assets/samu_loading.png";

export default function PantallaCarga({ mensaje = "Cargando..." }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-base px-6">
            <div className="flex flex-col items-center gap-10 text-center">
                <img
                    src={samuLoading}
                    alt="Samu cargando"
                    className="h-[280px] w-auto object-contain"
                />
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-neutral/30 border-t-identity" />
                <p className="font-saira text-[28px] font-bold leading-10 text-identity">{mensaje}</p>
            </div>
        </div>
    );
}
