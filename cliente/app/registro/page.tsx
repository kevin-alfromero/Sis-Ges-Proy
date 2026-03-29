"use client";

import { useRouter } from "next/navigation";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function RegistroPage() {
  // Variables para guardar los datos del nuevo usuario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Usuario"); // Por defecto será Usuario
  const [errorMensaje, setErrorMensaje] = useState("");
  const router = useRouter();

  // Traemos la función 'register' de nuestro Contexto
  const { register } = useContext(AuthContext);

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMensaje("");

    // Llamamos a la función de registro
    const resultado = await register(name, email, password, role);

    if (resultado.success) {
      router.push("/"); // Esto te envía a la página principal
      // Nota: Aquí luego redirigiremos al Dashboard
    } else {
      setErrorMensaje(resultado.message); // Por ejemplo: "El correo ya existe"
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">
          Crear Cuenta
        </h3>

        <form onSubmit={manejarRegistro} className="mt-6">
          <div className="mt-4">
           <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ej. Roger Ramirez"
              // Agregamos text-gray-900, placeholder:text-gray-400 y bg-white
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder:text-gray-400 bg-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              // Agregamos text-gray-900 y placeholder:text-gray-400
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400 bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="role"
            >
              Rol en el sistema
            </label>
            <select
              id="role"
              // Solo agregamos text-gray-900 (ya tenías bg-white)
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Usuario">Usuario (Ver proyectos)</option>
              <option value="Gerente">Gerente (Crear proyectos)</option>
            </select>
          </div>

          {errorMensaje && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {errorMensaje}
            </div>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Registrarse
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-green-600 hover:underline">
              Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
