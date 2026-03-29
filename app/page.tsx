"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [view, setView] = useState("tasks"); // tasks | projects

  const fetchData = async () => {
    try {
      const endpoint =
        view === "tasks"
          ? "http://localhost:3001/api/tasks"
          : "http://localhost:3001/api/projects";

      const res = await fetch(endpoint);
      const result = await res.json();

      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  // cálculos (adaptables)
  const total = data.length;

  const completed =
    view === "tasks"
<<<<<<< Updated upstream
      ? data.filter(d => d.status === "completada").length
      : data.filter(d => d.status === "finalizado").length;

  const pending =
    view === "tasks"
      ? data.filter(d => d.status === "pendiente").length
      : data.filter(d => d.status !== "finalizado").length;
=======
      ? data.filter(d => d.status === "Completada").length
      : data.filter(d => d.status === "Finalizado").length;

  const pending =
    view === "tasks"
      ? data.filter(d => d.status === "Pendiente").length
      : data.filter(d => d.status !== "Finalizado").length;
>>>>>>> Stashed changes

  const progress =
    total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("tasks")}
          className={`px-4 py-2 rounded ${
            view === "tasks"
              ? "bg-blue-500 text-white"
              : "bg-white"
          }`}
        >
          Tareas
        </button>

        <button
          onClick={() => setView("projects")}
          className={`px-4 py-2 rounded ${
            view === "projects"
              ? "bg-blue-500 text-white"
              : "bg-white"
          }`}
        >
          Proyectos
        </button>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">
            Total {view === "tasks" ? "Tareas" : "Proyectos"}
          </h2>
          <p className="text-2xl font-bold text-blue-600">
            {total}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Completados</h2>
          <p className="text-2xl font-bold text-green-600">
            {completed}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Pendientes</h2>
          <p className="text-2xl font-bold text-red-600">
            {pending}
          </p>
        </div>

      </div>

      {/* Barra de progreso */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-gray-700 mb-4 font-semibold">
          Progreso general
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="mt-2 text-sm text-gray-600">
          {progress.toFixed(0)}% completado
        </p>
      </div>
    </div>
  );
}