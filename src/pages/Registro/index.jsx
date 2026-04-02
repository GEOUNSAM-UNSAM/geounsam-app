import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import geounsam from '../../assets/geounsam.svg'
import arrowLeft from '../../assets/arrow_left.svg'
import samuAsomandoseLlave from '../../assets/samu_asomandose_llave.png'
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
        <div className="relative overflow-hidden flex flex-col min-h-screen bg-base px-8 pt-[36px] pb-8">
            <div className="flex justify-center">
                <img src={geounsam} alt="GeoUNSAM" className="w-[117px] h-4" />
            </div>

            <img
                src={samuAsomandoseLlave}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-4 w-[126px] h-[200px]"
            />

            <div className="flex items-center gap-2 mt-14">
                <button onClick={() => navigate(-1)} className="shrink-0">
                    <img src={arrowLeft} alt="Volver" className="w-[30px] h-[30px]" />
                </button>
                <h1 className="font-saira font-semibold text-[22px] text-identity leading-8">
                    Crear tu cuenta
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 pt-14">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="font-saira text-sm leading-6 text-neutral-extra-dark">Carrera</label>
                        <div className="relative">
                            <select
                                name="carrera"
                                value={form.carrera}
                                onChange={handleChange}
                                className={`w-full h-10 bg-neutral-white border border-identity rounded-xl pl-5 pr-10 font-saira text-base leading-6 appearance-none ${form.carrera ? 'text-neutral-extra-dark' : 'text-neutral-main'}`}
                            >
                                <option value="" disabled>Ingrese su carrera</option>
                                {carreras.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            <ChevronDown
                                size={16}
                                color="#A7A9AC"
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
                </div>

                <div className="flex flex-col gap-6 mt-auto pt-10">
                    <button
                        type="submit"
                        className="bg-action text-neutral-extra-dark font-saira font-semibold text-lg text-center h-11 rounded-xl w-full"
                    >
                        Crear cuenta
                    </button>
                    <Link
                        to="/bienvenida"
                        className="border border-identity text-identity font-saira text-sm leading-6 text-center h-9 rounded-xl w-full flex items-center justify-center"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}
