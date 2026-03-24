import { Routes, Route, Navigate } from 'react-router-dom'
import Buscar from './pages/Buscar/index.jsx'
import Mapa from './pages/Mapa/index.jsx'
import Cursada from './pages/Cursada/index.jsx'
import Perfil from './pages/Perfil/index.jsx'
import Inicio from './pages/Inicio/index.jsx'
import Onboarding from './pages/Onboarding/index.jsx'
import Registro from './pages/Registro/index.jsx'
import Login from './pages/Login/index.jsx'
import Navbar from './components/Navbar/index.jsx'
import logotipoWhite from './assets/logotipo_white.svg'

function AppLayout() {
  return (
    <>
      <header className="bg-identity px-5 h-16 flex items-center justify-center">
        <img src={logotipoWhite} alt="GEOUNSAM" className="h-5" />
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/cursada" element={<Cursada />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Navbar />
    </>
  )
}

function App() {
  return (
    <div className="w-full min-h-screen bg-base relative">
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </div>
  )
}

export default App
