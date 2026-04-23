import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import geounsam from '../../assets/geounsam.svg';
import logo from '../../assets/logo-geounsam.svg';
import samuLaptop from '../../assets/samu_laptop.png';
import AuthInput from '../../components/AuthInput/index.jsx';
import BotonGoogle from '../../components/BotonGoogle/index.jsx';
import BotonPrincipal from '../../components/BotonPrincipal/index.jsx';
import { supabase } from '../../lib/supabase';
import { esEmailValido, validarLogin } from '../../utils/validacionesAuth.js';
import BotonGhost from '../../components/BotonGhost/index.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    form: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', form: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    const nextErrors = validarLogin({ ...form, email });

    if (nextErrors.email || nextErrors.password) {
      setErrors((prev) => ({ ...prev, ...nextErrors, form: '' }));
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, form: '' }));

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: form.password,
    });

    if (signInError) {
      setErrors((prev) => ({
        ...prev,
        form: 'Email o contraseña incorrectos.',
      }));
      setLoading(false);
      return;
    }

    navigate('/inicio', { replace: true });
  };

  const isEmailValid = esEmailValido(form.email);
  const isSubmitDisabled =
    loading || !form.email.trim() || !form.password || !isEmailValid;

  return (
    <main className="flex flex-col lg:flex-row min-h-screen bg-base">
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
          src={samuLaptop}
          alt="Samu usando una laptop"
          className="w-full max-w-[287px] lg:max-w-[400px] h-auto max-h-[200px] lg:max-h-[300px] object-contain"
        />
      </div>

      {/* ========== PANEL CONTENIDO (derecha en desktop, abajo en mobile) ========== */}
      <div className="flex flex-col flex-1 px-8 pb-8 lg:pb-6 lg:w-1/2 lg:justify-center bg-base">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 pt-6 justify-center w-full lg:max-w-[348px] lg:mx-auto"
        >
          <div className="flex flex-col gap-5 lg:gap-8">
            <h1 className="text-heading-l text-identity">
              Ingresá a tu cuenta
            </h1>

            <div className="flex flex-col gap-5">
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
                label="Contraseña"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                type="password"
                autoComplete="current-password"
                error={errors.password}
              />
            </div>
          </div>

          {errors.form && (
            <p className="font-saira text-sm text-error mt-3">{errors.form}</p>
          )}

          <div className="flex flex-col gap-6 pt-16">
            <BotonGoogle texto="Registrarme con Google" className="w-full" />
            

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-neutral-main" />
              <span className="font-saira font-semibold text-lg leading-8 text-neutral-dark">
                o
              </span>
              <div className="flex-1 h-px bg-neutral-main" />
            </div>

            <BotonPrincipal
              type="submit"
              texto={loading ? 'Ingresando...' : 'Iniciar sesión'}
              disabled={isSubmitDisabled}
            />

            <BotonGhost
              texto="¿Aún no te registraste? Hacé click acá."
              onClick={() => navigate('/registro')}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
