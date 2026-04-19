import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Map } from "lucide-react";
import ActionCard from "../../components/Inicio/ActionCard/index.jsx";
import BannerCambios from "../../components/Inicio/BannerCambios/index.jsx";
import CardMateria from "../../components/Cursada/CardMateria/index.jsx";
import CardProximaClase from "../../components/Inicio/CardProximaClase/index.jsx";
import CtaCursada from "../../components/Inicio/CtaCursada/index.jsx";
import HeroBusqueda from "../../components/Inicio/HeroBusqueda/index.jsx";
import SaludoInicio from "../../components/Inicio/SaludoInicio/index.jsx";
import SectionTitle from "../../components/Inicio/SectionTitle/index.jsx";
import PantallaCarga from "../../components/PantallaCarga/index.jsx";
import Tip from "../../components/Tip/index.jsx";
import { useAuth } from "../../context/AuthContext";
import { getMateriasPinneadasConHorarios } from "../../services/comisiones";
import { buildInicioState } from "../../utils/inicio";

const INICIO_STATE_INICIAL = {
    usuario: { nombre: "estudiante" },
    cambiosPendientes: { visible: false },
    proximaClase: null,
    programacionTitulo: "Programación del día",
    programacion: [],
    mostrarEstadoVacio: true,
};

export default function Inicio() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [busquedaInicio, setBusquedaInicio] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [inicioState, setInicioState] = useState(INICIO_STATE_INICIAL);

    const irABuscar = (query = "") => {
        const termino = query.trim();
        navigate(termino ? `/buscar?q=${encodeURIComponent(termino)}` : "/buscar");
    };

    const abrirClase = (clase) => {
        if (!clase.detalleAulaPath) {
            navigate("/cursada");
            return;
        }

        navigate(clase.detalleAulaPath, {
            state: clase.detalleAulaState,
        });
    };

    useEffect(() => {
        if (!user) return;

        let mounted = true;

        getMateriasPinneadasConHorarios(user.id)
            .then((materias) => {
                if (!mounted) return;
                setInicioState(buildInicioState({ user, materias }));
            })
            .catch((fetchError) => {
                console.error(fetchError);
                if (!mounted) return;
                setError("No pudimos cargar tu inicio por ahora.");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [user]);

    if (loading) {
        return <PantallaCarga mensaje="Cargando inicio..." compact />;
    }

    return (
        <div className="min-h-full bg-base px-5 py-4 pb-28">
            <div className="flex flex-col gap-7">
                <SaludoInicio nombre={inicioState.usuario.nombre} />

                {error ? (
                    <div className="rounded-[20px] border border-error bg-state-red px-4 py-3">
                        <p className="font-saira text-sm leading-4 text-neutral-extra-dark">
                            {error}
                        </p>
                    </div>
                ) : null}

                {inicioState.cambiosPendientes.visible ? (
                    <BannerCambios onClick={() => navigate("/cursada")} />
                ) : null}

                {inicioState.mostrarEstadoVacio ? (
                    <>
                        <HeroBusqueda
                            query={busquedaInicio}
                            onChange={setBusquedaInicio}
                            onClear={() => setBusquedaInicio("")}
                            onSubmit={irABuscar}
                        />

                        <section className="space-y-3">
                            <SectionTitle>Explorá el campus</SectionTitle>
                            <div className="flex gap-4">
                                <ActionCard
                                    icon={Map}
                                    titulo="Ver mapa"
                                    detalle="Campus UNSAM"
                                    onClick={() => navigate("/mapa")}
                                />
                                <ActionCard
                                    icon={Calendar}
                                    titulo="Mi cursada"
                                    detalle="Calendario de clases"
                                    onClick={() => navigate("/cursada")}
                                />
                            </div>
                        </section>

                        <Tip>
                            Pineá tus materias para recibir alertas cuando
                            cambie tu aula.
                        </Tip>
                    </>
                ) : (
                    <>
                        {inicioState.proximaClase ? (
                            <section className="space-y-3">
                                <SectionTitle>
                                    {inicioState.proximaClase.tituloSeccion}
                                </SectionTitle>
                                <CardProximaClase
                                    clase={inicioState.proximaClase}
                                    onOpen={() => abrirClase(inicioState.proximaClase)}
                                />
                            </section>
                        ) : null}

                        {inicioState.programacion.length > 0 ? (
                            <section className="space-y-3">
                                <SectionTitle>
                                    {inicioState.programacionTitulo}
                                </SectionTitle>
                                <div className="space-y-2">
                                    {inicioState.programacion.map((clase) => (
                                        <CardMateria
                                            key={clase.id}
                                            clase={clase}
                                            onOpen={() => abrirClase(clase)}
                                        />
                                    ))}
                                </div>
                                <CtaCursada
                                    onClick={() => navigate("/cursada")}
                                />
                            </section>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}
