import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestión de Proyectos",
  description: "Proyecto creado para la materia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* ENVOLVEMOS LA APLICACIÓN */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
