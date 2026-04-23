import { useNavigate } from 'react-router-dom';
import geounsam from '../../assets/geounsam.svg';
import logo from '../../assets/logo-geounsam.svg';
import samuBienvenida from '../../assets/samu_bienvenida.png';
import BotonGoogle from '../../components/BotonGoogle';
import BotonGhost from '../../components/BotonGhost';
import BotonPrincipal from '../../components/BotonPrincipal';

export default function Bienvenida() {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-base">
      {/* --- PANEL VISUAL --- */}
      {/* Mobile: Arriba, sin fondo extra. Desktop: Mitad izquierda, centrado */}
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
          src={samuBienvenida}
          alt="Samu te da la bienvenida"
          className="w-full max-w-[287px] lg:max-w-[400px] h-auto max-h-[40vh] lg:max-h-[300px] object-contain"
        />
      </div>
      {/* --- PANEL CONTENIDO E INTERACCIONES --- */}
      {/* Mobile: Abajo. Desktop: Mitad derecha. */}
      <div className="flex flex-col items-center flex-1 px-8 py-6 gap-6 lg:gap-16 lg:w-1/2 lg:justify-center bg-base">
        {/* Textos */}
        <div className="flex flex-col justify-center items-center gap-6 lg:gap-8 w-full max-w-[348px]">
          <h1 className="text-heading-xl text-identity text-center">
            ¡Te damos la bienvenida!
          </h1>
          <p className="text-body-s text-neutral-extra-dark text-center">
            Navegá por los edificios de la facultad y encontrá tu aula al toque.
            <br />
            Validá reportes comunitarios y ganá prestigio
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-end items-center py-6 gap-6 w-full max-w-[348px] mt-auto lg:mt-0">
          <BotonGoogle texto="Registrarme con Google" className="w-full" />

          {/* Separador */}
          <div className="flex flex-row justify-center items-center gap-1 w-full">
            <div className="flex-1 border-t border-neutral-dark" />
            <span className="text-title-m text-neutral-dark w-8 text-center">
              o
            </span>
            <div className="flex-1 border-t border-neutral-dark" />
          </div>

          <BotonPrincipal
            texto="Registrarme con email"
            onClick={() => navigate('/registro')}
            className="w-full"
          />

          <BotonGhost
            texto="Ya tengo cuenta"
            onClick={() => navigate('/login')}
            className="w-full"
          />
        </div>
      </div>
    </main>
  );
}
