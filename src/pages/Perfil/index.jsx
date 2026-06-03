import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import usePerfilResumen from '../../hooks/usePerfilResumen';
import { LogOut } from 'lucide-react';

export default function Perfil() {
  const { user } = useAuth();
  const { carrera } = usePerfilResumen(user?.id);

  const nombre = user?.user_metadata?.full_name || 'Usuario';
  const email = user?.email || 'estudiante@unsam.edu.ar';
  const avatarUrl = user?.user_metadata?.avatar_url;

  const navigate = useNavigate();
  const handleLogout = () => navigate('/logout');

  return (
    <div className="flex flex-col w-full bg-base min-h-screen">
      <div className="flex flex-col gap-5 px-6 py-4 pb-6 lg:p-8 lg:gap-8 max-w-[800px] mx-auto w-full flex-1">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-end mb-4 lg:hidden">
          <div className="flex flex-col gap-1">
            <h1 className="text-heading-xl text-neutral-extra-dark">
              Mi perfil
            </h1>
          </div>
        </div>

        {/* TARJETA PRINCIPAL DEL USUARIO */}
        <main className="bg-neutral-white rounded-[30px] p-8 lg:p-12 shadow-sm border border-neutral-light/50 flex flex-col items-center relative overflow-hidden">
          
          {/* Banda de color superior decorativa */}
          <div className="absolute top-0 left-0 right-0 h-32 lg:h-40 bg-identity z-0"></div>

          {/* Avatar Container */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-action flex items-center justify-center text-5xl shadow-md z-10 border-4 border-neutral-white mt-10 lg:mt-16 mb-6">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={nombre} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <span className="text-neutral-white text-heading-xl">{nombre.charAt(0)}</span>
            )}
          </div>

          {/* Información Personal */}
          <h2 className="text-heading-l lg:text-heading-xl text-neutral-extra-dark text-center z-10">
            {nombre}
          </h2>
          <p className="text-body-m lg:text-title-m text-neutral-dark text-center mt-1 z-10">
            {email}
          </p>

          {/* Separador */}
          <div className="w-16 h-1 bg-action rounded-full my-8 z-10"></div>

          {/* Información Académica */}
          <div className="w-full max-w-md bg-base rounded-2xl p-6 border border-neutral-light text-center z-10">
            <p className="text-label-caption text-neutral-dark mb-3 tracking-wider uppercase">
              Carrera en curso
            </p>
            <p className="text-title-m lg:text-heading-l text-identity">
              {carrera || 'Licenciatura en Desarrollo de Software'}
            </p>
          </div>

          {/* Botón de Cerrar Sesión Minimalista */}
          <div className="mt-12 z-10 w-full max-w-xs">
            <button 
              className="flex w-full items-center justify-center gap-2 border-status-red text-status-red lg:bg-neutral-white rounded-2xl p-4 shadow-sm border lg:border-neutral-light hover:bg-state-red hover:border-error hover:text-error transition-colors lg:text-neutral-dark group"
              onClick={handleLogout}
            >
              <LogOut size={20} className="group-hover:text-error transition-colors" />
              <span className="text-body-m group-hover:text-error transition-colors">Cerrar sesión</span>
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
