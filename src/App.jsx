import { Routes, Route, Navigate } from 'react-router-dom'
import Buscar from './pages/Buscar/index.jsx'
import Mapa from './pages/Mapa/index.jsx'
import Cursada from './pages/Cursada/index.jsx'
import Perfil from './pages/Perfil/index.jsx'
import Navbar from './components/Navbar/index.jsx'

function App() {
  return (
    <div className="max-w-md mx-auto  min-h-screen bg-white relative">
      <Routes>
        <Route path="/" element={<Navigate to="/buscar" />} />
        <Route path="/buscar" element={<Buscar />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/cursada" element={<Cursada />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
      <Navbar />
    </div>
  )
}

export default App
