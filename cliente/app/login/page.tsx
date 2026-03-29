"use client"; // Obligatorio porque usaremos interactividad (formularios y estados)

import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
// Importamos el contexto subiendo dos niveles en las carpetas (../../)
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const router = useRouter();

  // Traemos la función 'login' de tu contexto
  const { login } = useContext(AuthContext);

  // Función que se ejecuta al darle clic a "Ingresar"
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página recargue
    setErrorMensaje(""); // Limpiamos errores anteriores

    // Llamamos a tu función de login
    const resultado = await login(email, password);

    if (resultado.success) {
      router.push("/"); // página principal
      // codigo que lleval usuario al Dashboard
    } else {
      setErrorMensaje(resultado.message); // Mostramos si la contraseña o correo están mal
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">
          Iniciar Sesión
        </h3>

        <form onSubmit={manejarEnvio} className="mt-6">
          <div className="mt-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              // Agregamos text-gray-900 y placeholder:text-gray-400
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Caja de error: solo aparece si hay un errorMensaje */}
          {errorMensaje && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {errorMensaje}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Ingresar
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a href="/registro" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
