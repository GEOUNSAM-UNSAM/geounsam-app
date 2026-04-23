import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccess } from '../../context/AccessContext.jsx';
import { getCarreras, setAlumnoCarrera } from '../../services/alumnos';
import geounsam from '../../assets/geounsam.svg';
import logo from '../../assets/logo-geounsam.svg';
import samuSaludando from '../../assets/samu_saludando.png';
import BotonPrincipal from '../../components/BotonPrincipal';
import BotonGhost from '../../components/BotonGhost';
import Dropdown from '../../components/Dropdown';

export default function SeleccionCarrera() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refresh } = useAccess();
  const [carreras, setCarreras] = useState([]);
  const [carreraId, setCarreraId] = useState('');
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [cargandoCarreras, setCargandoCarreras] = useState(true);

  useEffect(() => {
    getCarreras()
      .then(setCarreras)
      .catch((err) => setError(err.message))
      .finally(() => setCargandoCarreras(false));
  }, []);

  const primerNombre =
    user?.user_metadata?.full_name?.trim()?.split(/\s+/)?.[0] ?? 'estudiante';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carreraId) return;

    setGuardando(true);
    try {
      await setAlumnoCarrera(user.id, Number(carreraId));
      await refresh();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-base gap-6">
      {/* ========== PANEL VISUAL (izquierda en desktop, arriba en mobile) ========== */}
      <div className="flex flex-col items-center justify-center lg:justify-center pt-16 lg:py-12 px-8 gap-6 lg:gap-16 lg:w-1/2 lg:bg-neutral-light">
        <div className="flex items-center justify-center w-16 h-16">
          <img
            src={logo}
            alt="Logo GeoUNSAM"
            className="w-full h-full lg:hidden object-contain"
          />
          <img
            src={geounsam}
            alt="GeoUNSAM"
            className="hidden lg:block absolute w-[150px]"
          />
        </div>

        <img
          src={samuSaludando}
          alt="Samu saludándote"
          className="w-full max-w-[287px] lg:max-w-[400px] h-auto max-h-[300px] lg:max-h-[300px] object-contain"
        />
      </div>

      {/* ========== PANEL CONTENIDO (derecha en desktop, abajo en mobile) ========== */}
      <div className="flex flex-col items-center justify-between lg:justify-center flex-1 px-8 p-6 lg:w-1/2 bg-base">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-full max-w-[348px] gap-6"
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-heading-l text-identity">
              ¡Hola, {primerNombre}!
            </h1>
            <p className="text-body-s text-neutral-extra-dark">
              Sólo nos falta un dato para personalizar tu experiencia
            </p>
          </div>

          <Dropdown
            label="¿Qué carrera estudias?"
            value={carreraId}
            onChange={(e) => setCarreraId(e.target.value)}
            options={carreras.map((c) => ({ value: c.id, label: c.nombre }))}
            placeholder={cargandoCarreras ? 'Cargando carreras...' : 'Ingresá tu carrera'}
            disabled={guardando || cargandoCarreras}
          />

          {error && (
            <p className="text-label-caption text-error">{error}</p>
          )}

          <div className="flex flex-col gap-4 pt-8">
            <BotonPrincipal
              type="submit"
              texto={guardando ? 'Guardando...' : 'Continuar'}
              disabled={!carreraId || guardando}
            />
            <BotonGhost
              texto="Cambiar de cuenta"
              onClick={() => navigate('/logout')}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
