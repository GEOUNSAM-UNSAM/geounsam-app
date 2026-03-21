import { Link } from 'react-router-dom'
import logo from '../../assets/logo-geounsam.svg'

export default function Onboarding() {
  return (
    <div className="flex flex-col items-center h-screen bg-base px-8 py-10">
      <div className="flex-1 flex items-center">
        <img src={logo} alt="GeoUNSAM" className="w-24 h-24" />
      </div>

      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="font-saira font-bold text-3xl text-identity leading-tight">
          ¡Te damos la bienvenida!
        </h1>
        <p className="font-saira text-sm text-neutral-dark leading-relaxed">
          Navegá por los edificios de la facultad y encontrá tu aula al toque.
          <br />
          Validá reportes comunitarios y ganá prestigio
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 justify-end w-full pb-4">
        <Link
          to="/registro"
          className="bg-action text-neutral-dark font-saira font-semibold text-lg text-center py-3 rounded-xl w-full block"
        >
          Registrarme
        </Link>
        <Link
          to="/login"
          className="font-faustina font-medium text-action text-center py-2 block"
        >
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  )
}
