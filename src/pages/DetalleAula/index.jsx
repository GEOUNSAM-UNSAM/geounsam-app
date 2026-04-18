import { useEffect, useMemo, useState } from "react";
import { Siren } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ActualizacionesCard from "../../components/DetalleAula/ActualizacionesCard";
import ActionButtons from "../../components/DetalleAula/ActionButtons";
import ClaseCard from "../../components/DetalleAula/ClaseCard";
import DetalleHeader from "../../components/DetalleAula/DetalleHeader";
import ValidacionComunitaria from "../../components/DetalleAula/ValidacionComunitaria";
import Tip from "../../components/Tip";
import { useAuth } from "../../context/AuthContext";
import { getEstadosEdificio } from "../../services/aulas";
import {
	confirmarAula,
	getResumenConfirmacionesAula,
} from "../../services/confirmaciones";
import {
	buildDetalleAula,
	buildDetalleAulaStateFromEstados,
} from "../../utils/detalleAula";
import { getEdificioSlug } from "../../utils/edificios";

function getConfirmacionErrorMessage(error) {
	return error?.message ?? "No pudimos confirmar esta ubicación";
}

export default function DetalleAula() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { edificioSlug, aulaId } = useParams();
	const [detalleState, setDetalleState] = useState(location.state ?? null);
	const detalle = useMemo(
		() => buildDetalleAula({ state: detalleState, aulaId }),
		[detalleState, aulaId],
	);
	const [confirmando, setConfirmando] = useState(false);
	const [confirmado, setConfirmado] = useState(false);
	const [validacion, setValidacion] = useState(detalle.validacion);
	const [actualizaciones, setActualizaciones] = useState(detalle.actualizaciones);
	const [feedback, setFeedback] = useState(null);

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

	useEffect(() => {
		let ignore = false;
		const { horarioId, aulaId } = detalle.confirmacion;

		setConfirmando(false);
		setConfirmado(false);
		setValidacion(detalle.validacion);
		setActualizaciones(detalle.actualizaciones);
		setFeedback(null);

		if (!horarioId || !aulaId) return undefined;

		getResumenConfirmacionesAula({
			horarioId,
			aulaId,
		})
			.then((resumen) => {
				if (ignore) return;
				setConfirmado(resumen.yaConfirmo);
				setValidacion({
					confirmaciones: resumen.confirmaciones,
					total: resumen.total,
				});
				setActualizaciones(resumen.actualizaciones);
			})
			.catch(console.error);

		return () => {
			ignore = true;
		};
	}, [detalle, user?.id]);

	const volver = () => {
		if (window.history.length > 1) {
			navigate(-1);
		} else {
			navigate("/mapa");
		}
	};

	const puedeConfirmar = Boolean(user && detalle.confirmacion.puedeConfirmar);

	const handleConfirmar = async () => {
		if (!puedeConfirmar || confirmando || confirmado) return;

		setConfirmando(true);
		setFeedback(null);

		try {
			const resultado = await confirmarAula({
				horarioId: detalle.confirmacion.horarioId,
				aulaId: detalle.confirmacion.aulaId,
			});
			const resumen = await getResumenConfirmacionesAula({
				horarioId: detalle.confirmacion.horarioId,
				aulaId: detalle.confirmacion.aulaId,
			});

			setConfirmado(true);
			setValidacion({
				confirmaciones: Number(
					resumen.confirmaciones ?? resultado?.total_confirmaciones ?? 0,
				),
				total: resumen.total,
			});
			setActualizaciones(resumen.actualizaciones);
			setFeedback({
				tipo: "success",
				mensaje: "Ubicación confirmada",
			});
		} catch (error) {
			console.error(error);
			setFeedback({
				tipo: "error",
				mensaje: getConfirmacionErrorMessage(error),
			});
		} finally {
			setConfirmando(false);
		}
	};

	return (
		<div className="flex h-full flex-col bg-base pb-20">
			<DetalleHeader detalle={detalle} onBack={volver} />

			<main className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-8 pb-4 pt-5">
				<div className="flex flex-col gap-4">
					{detalle.clase ? <ClaseCard clase={detalle.clase} /> : null}
					{validacion ? <ValidacionComunitaria validacion={validacion} /> : null}
					<ActualizacionesCard actualizaciones={actualizaciones} />
				</div>

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
				onConfirm={handleConfirmar}
			/>
		</div>
	);
}
