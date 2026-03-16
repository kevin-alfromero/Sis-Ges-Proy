"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

// Definimos la estructura de una Tarea
interface Task {
  id: number;
  name: string;
  assignee: string;
  status: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    assignee: "",
    status: "Pendiente",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí es donde usarías Axios para enviar los datos a tu backend.
    // Ejemplo de cómo se vería:
    /*
    try {
      const response = await axios.post('/api/tareas', formData);
      console.log("Tarea guardada en BD:", response.data);
    } catch (error) {
      console.error("Hubo un error al guardar la tarea", error);
    }
    */

    // Para esta demostración, agregamos la tarea al estado local directamente
    const newTask: Task = {
      id: Date.now(),
      name: formData.name,
      assignee: formData.assignee,
      status: formData.status,
    };

    setTasks([...tasks, newTask]);
    
    // Limpiamos el formulario y lo ocultamos
    setFormData({ name: "", assignee: "", status: "Pendiente" });
    setShowTaskForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Navbar / Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Gestor de Proyectos</h1>
        <Link 
          href="/login" 
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Iniciar Sesión
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 mt-8">
        
        {/* Botones de Acción */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
          >
            {showTaskForm ? "Cancelar Creación" : "Crear Tarea"}
          </button>
          <button 
            onClick={() => alert("Lógica para crear proyecto próximamente")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
          >
            Crear Proyecto
          </button>
        </div>

        {/* Formulario de Tarea */}
        {showTaskForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Nueva Tarea</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la tarea</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ej. Configurar servidor Ubuntu"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Asignada a</label>
                <input 
                  type="text" 
                  name="assignee"
                  value={formData.assignee}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nombre de la persona"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Guardar Tarea
              </button>
            </form>
          </div>
        )}

        {/* Lista de Tareas */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Tareas Recientes</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500 italic">No hay tareas creadas aún.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col gap-2">
                  <h3 className="font-bold text-lg text-gray-800">{task.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Asignada a:</span> {task.assignee}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs font-bold py-1 px-3 rounded-full ${
                      task.status === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}