import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import geounsam from '../../assets/geounsam.svg'
import arrowLeft from '../../assets/arrow_left.svg'
import AuthInput from '../../components/AuthInput/index.jsx'
import { getCarreras } from '../../services/alumnos'

export default function Registro() {
    const navigate = useNavigate()
    const [carreras, setCarreras] = useState([])
    const [form, setForm] = useState({
        carrera: '',
        email: '',
        nombre: '',
        password: '',
    })

    useEffect(() => {
        getCarreras().then(setCarreras).catch(console.error)
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // TODO: conectar con backend
        navigate('/buscar')
    }

    return (
        <div className="flex flex-col min-h-screen bg-base px-8 pt-10 pb-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-16">
                <button onClick={() => navigate(-1)} className="shrink-0">
                    <img src={arrowLeft} alt="Volver" className="w-7 h-7" />
                </button>
                <h1 className="font-saira font-semibold text-[22px] text-identity leading-8">
                    Crear tu cuenta
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
                {/* Carrera */}
                <div className="flex flex-col gap-2">
                    <label className="font-saira text-sm text-neutral-extra-dark">Carrera</label>
                    <div className="relative">
                        <select
                            name="carrera"
                            value={form.carrera}
                            onChange={handleChange}
                            className="w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 pr-10 font-saira text-neutral-extra-dark appearance-none"
                        >
                            <option value="" disabled>Ingrese su carrera</option>
                            {carreras.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                        <ChevronDown
                            size={16}
                            color="#00205b"
                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                    </div>
                </div>

                <AuthInput
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ingrese su email"
                />
                <AuthInput
                    label="Nombre y apellido"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ingrese su nombre y apellido"
                />
                <AuthInput
                    label="Contraseña"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Ingrese su contraseña"
                    type="password"
                />

                {/* Actions */}
                <div className="flex flex-col gap-4 mt-auto pt-6">
                    <button
                        type="submit"
                        className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg text-center py-3 rounded-xl w-full"
                    >
                        Crear cuenta
                    </button>
                    <Link
                        to="/onboarding"
                        className="border border-action text-action font-faustina font-medium text-[16px] text-center py-2 rounded-xl w-full block"
                    >
                        Cancelar
                    </Link>
                </div>

                {/* Logo */}
                <div className="flex justify-center pt-2">
                    <img src={geounsam} alt="GeoUNSAM" className="w-28 h-6" />
                </div>
            </form>
        </div>
    )
}
