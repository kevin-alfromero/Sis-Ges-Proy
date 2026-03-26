"use client"; // Obligatorio en Next.js App Router al usar hooks como useState

import { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

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
  // Función para INICIAR SESIÓN (Versión Segura y a prueba de fallos)
  const login = async (email, password) => {
    try {
      // 1. Pedimos la lista completa de usuarios al servidor
     const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });
        // Si encontramos al usuario, iniciamos sesión
      const loggedUser = response.data.user;
      setUser(loggedUser);
      localStorage.setItem("userSession", JSON.stringify(loggedUser));
      return { success: true };
       // Si no hay coincidencia, mostramos el error
    } catch (error) {
      const mensaje =
        error.response?.data?.error || "Error al conectar con el servidor.";
      return { success: false, message: mensaje };
    }
  };
  
  // Función para REGISTRARSE
  const register = async (name, email, password, role = "Usuario") => {
        try {
          // Verificamos que el correo no exista ya
        const response = await axios.post(`${API_URL}/users/register`, {
        name,
        email,
        password,
        role,
      });
      
      const newUser = response.data.user;
      setUser(newUser);
      localStorage.setItem("userSession", JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      const mensaje =
        error.response?.data?.error || "Error al crear la cuenta.";
      return { success: false, message: mensaje };
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
