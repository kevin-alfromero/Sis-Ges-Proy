"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");

  //Obtener tareas
  const fetchData = () => {
    fetch("http://localhost:3001/tasks")
      .then(res => res.json())
      .then(setTasks);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Crear tarea
  const handleAddTask = () => {
    if (!newTask.trim()) return;

    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "pendiente",
        title: newTask
      })
    }).then(() => {
      setNewTask("");
      fetchData();
    });
  };

  // Cambiar estado
  const toggleTaskStatus = (task: any) => {
    const newStatus =
      task.status === "completada" ? "pendiente" : "completada";

    fetch(`http://localhost:3001/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    }).then(() => fetchData());
  };

  //calculos
  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === "completada").length;
  const pending = tasks.filter(t => t.status === "pendiente").length;
  const progress =
    totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Total Tareas</h2>
          <p className="text-2xl font-bold text-blue-600">
            {totalTasks}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-gray-500">Completadas</h2>
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

      {/* Crear tarea */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-gray-700 font-semibold mb-4">
          Crear Tarea
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Escribe una tarea..."
            className="border p-2 rounded w-full text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-gray-700 font-semibold mb-4">
          Tareas
        </h2>

        {tasks.map(t => (
          <div
            key={t.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span className="text-black font-medium">
              {t.title || `Tarea #${t.id}`}
            </span>

            <button
              onClick={() => toggleTaskStatus(t)}
              className={
                t.status === "completada"
                  ? "bg-green-500 text-white px-3 py-1 rounded"
                  : "bg-red-500 text-white px-3 py-1 rounded"
              }
            >
              {t.status}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}