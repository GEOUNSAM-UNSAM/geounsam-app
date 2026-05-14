import { useEffect, useState } from "react";
import { Siren } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActionToast from "../../components/ActionToast";
import ActualizacionesCard from "../../components/Clase/ActualizacionesCard";
import ActionButtons from "../../components/Clase/ActionButtons";
import AgendaDiaCard from "../../components/Clase/AgendaDiaCard";
import CambioReportadoTip from "../../components/Clase/CambioReportadoTip";
import ClaseCard from "../../components/Clase/ClaseCard";
import DetalleHeader from "../../components/Clase/DetalleHeader";
import UbicacionActions from "../../components/Clase/UbicacionActions";
import ValidacionComunitaria from "../../components/Clase/ValidacionComunitaria";
import Tip from "../../components/Tip";
import { useAuth } from "../../context/AuthContext";
import { useDetalleLogic } from "../../hooks/useDetalleLogic";
import { getEstadosEdificio } from "../../services/aulas";
import {
	buildDetalleAula,
	buildDetalleAulaStateFromEstados,
} from "../../utils/detalleAula";
import { getEdificioSlug } from "../../utils/edificios";

export default function DetalleAula() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { edificioSlug, aulaId } = useParams();
	const [detalleState, setDetalleState] = useState(location.state ?? null);
	const detalle = buildDetalleAula({ state: detalleState, aulaId });

	const {
		confirmando,
		confirmado,
		validacion,
		actualizaciones,
		reporteCambio,
		feedback,
		actionToast,
		setActionToast,
		validandoCambio,
		puedeConfirmar,
		puedeReportar,
		detalleVista,
		handleConfirmar,
		handleValidarCambio,
	} = useDetalleLogic({
		detalle,
		user,
		mensajeErrorConfirmacion: "No pudimos confirmar esta ubicación",
	});

	useEffect(() => {
		if (location.state?.aula) {
			setDetalleState(location.state);
			if (!edificioSlug) {
				const inferredSlug = getEdificioSlug(location.state.edificio);
				if (inferredSlug) {
					navigate(
						`/${encodeURIComponent(inferredSlug)}/aulas/${encodeURIComponent(aulaId)}`,
						{ replace: true, state: location.state },
					);
				}
			}
			return;
		}

		if (!user?.id || !edificioSlug || !aulaId) {
			setDetalleState(null);
			return;
		}

		let ignore = false;

		getEstadosEdificio(edificioSlug, user.id)
			.then((estados) => {
				if (ignore) return;
				setDetalleState(buildDetalleAulaStateFromEstados({ aulaId, estados }));
			})
			.catch((error) => {
				console.error(error);
				if (!ignore) setDetalleState(null);
			});

		return () => {
			ignore = true;
		};
	}, [location.state, user?.id, edificioSlug, aulaId, navigate]);

	const volver = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate("/mapa");
		}
	};

	const getDetalleEdificioSlug = () =>
		edificioSlug ?? getEdificioSlug(detalleState?.edificio);

	const verUbicacionEdificio = () => {
		const targetEdificioSlug = getDetalleEdificioSlug();
		navigate("/mapa", {
			state: {
				mapFocus: "edificio",
				edificioSlug: targetEdificioSlug,
				edificio: detalleState?.edificio ?? {
					nombre: detalle.edificio,
					slug: targetEdificioSlug,
				},
			},
		});
	};

	const verUbicacionAula = () => {
		const targetEdificioSlug = getDetalleEdificioSlug();
		navigate("/mapa", {
			state: {
				mapFocus: "aula",
				edificioSlug: targetEdificioSlug,
				edificio: detalleState?.edificio ?? {
					nombre: detalle.edificio,
					slug: targetEdificioSlug,
				},
				aulaId: detalleState?.aula?.nombre ?? aulaId,
				pisoSlug: detalleState?.aula?.pisoSlug ?? detalleState?.piso?.slug,
			},
		});
	};

	const abrirReporte = () => {
		if (!puedeReportar) return;
		navigate("/reportar-cambio", {
			state: {
				detalle,
				detalleState,
				edificioSlug: getDetalleEdificioSlug(),
				aulaId,
			},
		});
	};

	return (
		<div className="flex h-full flex-col bg-base pb-20">
			<DetalleHeader detalle={detalleVista} onBack={volver} />

			<main className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-8 pb-4 pt-5">
				<div className="flex flex-col gap-4">
					<UbicacionActions
						onVerEdificio={verUbicacionEdificio}
						onVerAula={verUbicacionAula}
						puedeVerEdificio={!detalle.esVirtual}
						puedeVerAula={Boolean(!detalle.esVirtual && (aulaId || detalleState?.aula?.nombre))}
					/>
					{detalle.clase ? <ClaseCard clase={detalle.clase} /> : null}
					<AgendaDiaCard agenda={detalle.agendaDia} titulo={detalle.agendaTitulo} />
					{validacion ? <ValidacionComunitaria validacion={validacion} /> : null}
					<ActualizacionesCard actualizaciones={actualizaciones} />
				</div>

				<CambioReportadoTip reporte={reporteCambio} />

				{feedback ? (
					<p
						className={`rounded-[20px] px-4 py-3 text-center font-saira text-sm font-medium leading-4 ${
							feedback.tipo === "success"
								? "bg-state-green text-data-green-800"
								: "bg-state-red text-error"
						}`}
					>
						{feedback.mensaje}
					</p>
				) : null}

				{detalle.tieneClase && !detalle.enCursada ? (
					<Tip
						icon={Siren}
						title="Esta materia no está en tu cursada"
						description="Pineala para poder confirmar o reportar cambios de aula"
						actionLabel="Ver toda mi cursada"
						actionTo="/cursada"
					/>
				) : null}
			</main>

			<ActionButtons
				canConfirm={puedeConfirmar}
				confirming={confirmando}
				confirmed={confirmado}
				canReport={puedeReportar}
				changeMode={Boolean(reporteCambio)}
				canConfirmChange={Boolean(reporteCambio && !reporteCambio.yaReporto && !validandoCambio)}
				canDenyChange={Boolean(reporteCambio && !validandoCambio)}
				onConfirm={handleConfirmar}
				onReport={abrirReporte}
				onConfirmChange={() => handleValidarCambio("confirmar")}
				onDenyChange={() => handleValidarCambio("denegar")}
			/>
			<ActionToast toast={actionToast} onClose={() => setActionToast(null)} />
		</div>
	);
}
