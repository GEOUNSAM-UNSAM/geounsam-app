import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import geounsam from '../../assets/geounsam.svg';
import arrowLeft from '../../assets/arrow_left.svg';
import samuLlaveMobile from '../../assets/samu_asomandose_llave.png';
import samuLlaveDesktop from '../../assets/samu_llave_desktop.png';
import AuthInput from '../../components/AuthInput/index.jsx';
import { supabase } from '../../lib/supabase';
import {
  esEmailValido,
  validarRegistro,
} from '../../utils/validacionesAuth.js';
import BotonPrincipal from '../../components/BotonPrincipal/index.jsx';
import BotonOutline from '../../components/BotonOutline/index.jsx';

function parseCarreraId(value) {
  if (!value) return null;
  const carreraId = Number.parseInt(value, 10);
  return Number.isInteger(carreraId) && carreraId > 0 ? carreraId : null;
}

export default function Registro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    email: '',
    nombre: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    nombre: '',
    password: '',
    form: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
      form: '',
    }));
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextValues = {
      ...form,
      email: form.email.trim(),
      nombre: form.nombre.trim(),
    };
    const carreraId = parseCarreraId(searchParams.get('carrera_id'));
    const nextErrors = validarRegistro(nextValues);

    if (nextErrors.email || nextErrors.nombre || nextErrors.password) {
      setErrors((prev) => ({ ...prev, ...nextErrors, form: '' }));
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: '' }));
    setSuccessMessage('');

    const userData = {
      full_name: nextValues.nombre,
    };

    if (carreraId !== null) {
      userData.carrera_id = carreraId;
    }

    const { data, error } = await supabase.auth.signUp({
      email: nextValues.email,
      password: nextValues.password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log('[Registro] signUp response', { data, error });

    if (error) {
      setErrors((prev) => ({
        ...prev,
        form: error.message || 'No se pudo crear la cuenta.',
      }));
      setLoading(false);
      return;
    }

    if (data.session) {
      await supabase.auth.signOut();
    }

    setSuccessMessage(
      data.session
        ? 'Cuenta creada correctamente. Ya podés iniciar sesión.'
        : 'Cuenta creada. Revisá tu correo para confirmar la cuenta.'
    );
    setLoading(false);
  };

  const isSubmitDisabled =
    loading ||
    !form.email.trim() ||
    !esEmailValido(form.email) ||
    !form.nombre.trim() ||
    form.nombre.trim().length < 3 ||
    !form.password ||
    form.password.length < 6;

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-base">
      {/* ========== MOBILE ========== */}
      <div className="relative lg:hidden flex flex-col px-8 p-10">
        <div className="flex justify-center">
          <img src={geounsam} alt="GeoUNSAM" className="w-[117px]" />
        </div>
        <img
          src={samuLlaveMobile}
          alt="Samu asomándose con llave"
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-4 h-[200px]"
        />
      </div>

      {/* ========== DESKTOP PANEL VISUAL (derecha) ========== */}
      <div className="hidden lg:flex flex-col items-center justify-center lg:justify-center pt-16 lg:py-12 px-8 gap-6 lg:gap-16 lg:w-1/2 lg:bg-neutral-light">
        <img src={geounsam} alt="GeoUNSAM" className="w-[150px]" />
        <img
          src={samuLlaveDesktop}
          alt="Samu con llave"
          className="w-full h-auto max-h-[300px] object-contain mr-4"
        />
      </div>

      {/* ========== PANEL CONTENIDO (izquierda en desktop, debajo del Samu mobile) ========== */}
      <div className="flex flex-col justify-between flex-1 px-8 pb-8 lg:p-20 lg:w-1/2 lg:justify-center bg-base">
        {/* Header con back + título */}
        <div className="flex items-center gap-2 w-full lg:max-w-[348px] lg:mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="shrink-0"
            aria-label="Volver"
          >
            <img src={arrowLeft} alt="" className="w-[30px] h-[30px]" />
          </button>
          <h1 className="text-heading-l text-identity">Crear tu cuenta</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 w-full lg:max-w-[348px] justify-center lg:mx-auto"
        >
          <div className="flex flex-col gap-6 py-5">
            <AuthInput
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ingrese su email"
              type="email"
              autoComplete="email"
              error={errors.email}
            />
            <AuthInput
              label="Nombre y apellido"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingrese su nombre y apellido"
              autoComplete="name"
              error={errors.nombre}
            />
            <AuthInput
              label="Contraseña"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              type="password"
              autoComplete="new-password"
              error={errors.password}
            />
          </div>

          {errors.form && (
            <p className="font-saira text-sm text-error mt-3">{errors.form}</p>
          )}
          {successMessage && (
            <p className="font-saira text-sm text-data-green-800 mt-3">
              {successMessage}
            </p>
          )}
        </form>

        <div className="flex flex-col gap-6 pt-6 lg:min-w-[348px] lg:mx-auto">
            <BotonPrincipal
              type="submit"
              texto={loading ? 'Creando cuenta...' : 'Crear cuenta'}
              disabled={isSubmitDisabled}
            />
            <BotonOutline
              type="button"
              texto="Cancelar"
              onClick={() => navigate('/bienvenida')}
            />
          </div>
      </div>
    </main>
  );
}
