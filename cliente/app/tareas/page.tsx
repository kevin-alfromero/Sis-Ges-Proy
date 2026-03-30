'use client';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Link from 'next/link';

export default function TareasPage() {
  const { user } = useContext(AuthContext);
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);
  
  // Estado inicial adaptado al backend de tareas
  const [nuevaTarea, setNuevaTarea] = useState({ 
    title: '', 
    description: '', 
    projectId: '', 
    priority: 'Media', 
    status: 'Pendiente', 
    assignedTo: '' 
  });

  const esJefe = user?.role === 'Gerente';

  useEffect(() => { 
    cargarDatos(); 
  }, []);

  // Cargamos tareas, proyectos (para el dropdown) y usuarios (para asignar)
  const cargarDatos = async () => {
    try {
      const [resTareas, resProyectos, resUsuarios] = await Promise.all([
        fetch('http://localhost:3001/api/tasks').then(res => res.json()),
        fetch('http://localhost:3001/api/projects').then(res => res.json()),
        fetch('http://localhost:3001/api/users').then(res => res.json())
      ]);
      setTareas(resTareas);
      setProyectos(resProyectos);
      setUsuarios(resUsuarios);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editandoId ? `http://localhost:3001/api/tasks/${editandoId}` : 'http://localhost:3001/api/tasks';
    const method = editandoId ? 'PUT' : 'POST';

    // Preparamos los datos, asegurando que si no eligen usuario, se envíe como null
    let datosAEnviar = { ...nuevaTarea };
    if (!datosAEnviar.assignedTo) {
      datosAEnviar.assignedTo = null;
    }
    // Si es una tarea nueva y no se seleccionó proyecto, toma el primero por defecto
    if (!datosAEnviar.projectId && proyectos.length > 0) {
      datosAEnviar.projectId = proyectos[0].id;
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosAEnviar)
    });
    
    if (response.ok) {
      cargarDatos();
      setNuevaTarea({ title: '', description: '', projectId: '', priority: 'Media', status: 'Pendiente', assignedTo: '' }); 
      setMostrarForm(false);
      setEditandoId(null);
    } else {
      const errorData = await response.json();
      alert(`Error al guardar: ${errorData.error}`);
    }
  };

  const handleEliminar = async (id: string) => {
    if (confirm("¿Eliminar esta tarea?")) {
      await fetch(`http://localhost:3001/api/tasks/${id}`, { method: 'DELETE' });
      cargarDatos();
    }
  };

  if (!user) return <div className="p-10 text-center">Cargando sesión...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Tareas</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Hola, <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span> • {user.role}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/"
              className="px-6 py-2.5 rounded-full font-bold shadow-lg bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition-all transform hover:scale-105 flex items-center justify-center"
            >
              Volver al Inicio
            </Link>
            {esJefe && (
              <button 
                onClick={() => { setMostrarForm(!mostrarForm); setEditandoId(null); }}
                className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 ${
                  mostrarForm ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {mostrarForm ? 'Cerrar' : '+ Nueva Tarea'}
              </button>
            )}
          </div>
        </header>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Tareas</p>
            <p className="text-2xl font-black">{tareas.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">Pendientes</p>
            <p className="text-2xl font-black text-amber-500">{tareas.filter((t:any) => t.status === 'Pendiente').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">En Progreso</p>
            <p className="text-2xl font-black text-blue-500">{tareas.filter((t:any) => t.status === 'En Progreso').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">Completadas</p>
            <p className="text-2xl font-black text-emerald-500">{tareas.filter((t:any) => t.status === 'Completada').length}</p>
          </div>
        </div>

        {/* Formulario */}
        {esJefe && mostrarForm && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4">{editandoId ? 'Editar Tarea' : 'Datos de la Tarea'}</h2>
            <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"> 
              
              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Título</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevaTarea.title}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Proyecto Asignado</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevaTarea.projectId}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, projectId: e.target.value})}
                  required
                >
                  <option value="" disabled>Selecciona un proyecto</option>
                  {proyectos.map((p:any) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Asignar a Usuario</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevaTarea.assignedTo || ''}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, assignedTo: e.target.value})}
                >
                  <option value="">Sin asignar</option>
                  {usuarios.map((u:any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Prioridad</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevaTarea.priority}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, priority: e.target.value})}
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Estado</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevaTarea.status}
                  onChange={(e) => setNuevaTarea({...nuevaTarea, status: e.target.value})}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl font-bold transition-colors">
                {editandoId ? 'Guardar Cambios' : 'Registrar Tarea'}
              </button>
            </form>
          </div>
        )}

        {/* Tabla Minimalista */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto"> 
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Tarea</th>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Proyecto</th>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Prioridad</th>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Estado</th>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Asignado a</th> 
                {esJefe && <th className="p-4 text-right text-xs uppercase font-bold text-slate-500">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {tareas.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-semibold max-w-[200px] md:max-w-md">
                    <p className="truncate" title={t.title}>{t.title}</p>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {t.projectName}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      t.priority === 'Alta' ? 'bg-rose-100 text-rose-700' : 
                      t.priority === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.status === 'Completada' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      t.status === 'En Progreso' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      t.status === 'Cancelada' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {t.assignedUserName || <span className="text-slate-400 italic">Sin asignar</span>}
                  </td>
                  {esJefe && (
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => { setNuevaTarea(t); setEditandoId(t.id); setMostrarForm(true); }} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">Editar</button>
                      <button onClick={() => setModalEliminar(t.id)} className="text-rose-500 font-bold text-sm hover:underline">Eliminar</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
                  {modalEliminar && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl text-center">
                <p className="font-bold mb-4 text-blue-500">¿Seguro que quieres eliminar esta tarea?</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setModalEliminar(null)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
                  <button onClick={async () => { await fetch(`http://localhost:3001/api/tasks/${modalEliminar}`, { method: 'DELETE' }); setModalEliminar(null); cargarDatos(); }} className="px-4 py-2 bg-rose-500 text-white rounded-lg">Eliminar</button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}