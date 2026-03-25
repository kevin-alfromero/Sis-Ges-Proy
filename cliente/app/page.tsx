"use client"; 

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Sistema de Gestión de Proyectos
        </h1>

        {/* SI EL USUARIO HA INICIADO SESIÓN */}
        {user ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800">
              ¡Bienvenido, {user.name}!
            </h2>
            <p className="text-blue-600 mt-2 text-lg">
              Tu rol actual es: <span className="font-bold">{user.role}</span>
            </p>

            {/* --- ESTO ES LO NUEVO: BOTONES DE NAVEGACIÓN --- */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/proyectos"
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all font-bold shadow-md"
              >
                Ir a Proyectos
              </Link>
              
              <button
                onClick={logout}
                className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
            {/* ----------------------------------------------- */}

          </div>
        ) : (
          /* SI NADIE HA INICIADO SESIÓN */
          <div className="space-y-4">
            <p className="text-gray-600 mb-6 text-lg">
              Por favor, inicia sesión para acceder al panel de control.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
