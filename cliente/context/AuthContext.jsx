"use client"; // Obligatorio en Next.js App Router al usar hooks como useState

import { createContext, useState, useEffect } from "react";
import axios from "axios";

// 1. Creamos el contexto (el "megáfono" global)
export const AuthContext = createContext();

// 2. Creamos el Proveedor que envolverá nuestra aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la página, revisamos si ya hay una sesión guardada (Requisito de la rúbrica)
  useEffect(() => {
    const storedUser = localStorage.getItem("userSession");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función para INICIAR SESIÓN
  const login = async (email, password) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users?email=${email}&password=${password}`,
      );

      if (response.data.length > 0) {
        const loggedUser = response.data[0];
        setUser(loggedUser); // Guardamos en memoria
        localStorage.setItem("userSession", JSON.stringify(loggedUser)); // Guardamos en el navegador
        return { success: true };
      }
      return { success: false, message: "Correo o contraseña incorrectos." };
    } catch (error) {
      console.error("Error en login:", error);
      return { success: false, message: "Error al conectar con el servidor." };
    }
  };

  // Función para REGISTRARSE
  const register = async (name, email, password, role = "Usuario") => {
    try {
      // Verificamos que el correo no exista ya
      const checkEmail = await axios.get(
        `http://localhost:3001/users?email=${email}`,
      );
      if (checkEmail.data.length > 0) {
        return { success: false, message: "Este correo ya está registrado." };
      }

      // Creamos el usuario
      const newUser = { name, email, password, role };
      const response = await axios.post("http://localhost:3001/users", newUser);

      // Auto-iniciamos sesión después de registrar
      setUser(response.data);
      localStorage.setItem("userSession", JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      return { success: false, message: "Error al crear la cuenta." };
    }
  };

  // Función para CERRAR SESIÓN
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userSession");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
