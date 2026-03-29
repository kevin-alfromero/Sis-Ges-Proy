'use client';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function ProyectosPage() {
<<<<<<< Updated upstream
  const { user } = useContext(AuthContext);
=======
  const { user, logout } = useContext(AuthContext);
>>>>>>> Stashed changes
  const [proyectos, setProyectos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  // Diseño: Agregado campo 'date' al estado inicial
  const [nuevoProyecto, setNuevoProyecto] = useState({ name: '', status: 'En Progreso', date: '' }); 
  const [editandoId, setEditandoId] = useState(null);
<<<<<<< Updated upstream

=======
  const [modalEliminar, setModalEliminar] = useState(null);
>>>>>>> Stashed changes
  const esJefe = user?.role === 'Gerente';

  useEffect(() => { cargarProyectos(); }, []);

  const cargarProyectos = () => {
<<<<<<< Updated upstream
    fetch('http://localhost:3001/projects').then(res => res.json()).then(setProyectos);
=======
    fetch('http://localhost:3001/api/projects').then(res => res.json()).then(setProyectos);
>>>>>>> Stashed changes
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< Updated upstream
    const url = editandoId ? `http://localhost:3001/projects/${editandoId}` : 'http://localhost:3001/projects';
=======
    const url = editandoId ? `http://localhost:3001/api/projects/${editandoId}` : 'http://localhost:3001/api/projects';
>>>>>>> Stashed changes
    const method = editandoId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
<<<<<<< Updated upstream
      body: JSON.stringify(nuevoProyecto)
=======
      body: JSON.stringify({ ...nuevoProyecto, managerId: user.id }) 
>>>>>>> Stashed changes
    });
    
    // Diseño: Limpieza de estado incluyendo la fecha
    cargarProyectos();
    setNuevoProyecto({ name: '', status: 'En Progreso', date: '' }); 
    setMostrarForm(false);
    setEditandoId(null);
  };

  const handleEliminar = async (id: string) => {
    if (confirm("¿Eliminar este proyecto?")) {
<<<<<<< Updated upstream
      await fetch(`http://localhost:3001/projects/${id}`, { method: 'DELETE' });
=======
      await fetch(`http://localhost:3001/api/projects/${id}`, { method: 'DELETE' });
>>>>>>> Stashed changes
      cargarProyectos();
    }
  };

  if (!user) return <div className="p-10 text-center">Cargando sesión...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado Estilizado */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Gestión de Proyectos</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Hola, <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span> • {user.role}
            </p>
          </div>
          {esJefe && (
            <button 
              onClick={() => { setMostrarForm(!mostrarForm); setEditandoId(null); }}
              className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 ${
                mostrarForm ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {mostrarForm ? 'Cerrar' : '+ Nuevo Proyecto'}
            </button>
          )}
<<<<<<< Updated upstream
=======
          <div>
          <button
            onClick={logout}
            className="px-6 py-2.5 rounded-full font-bold shadow-lg bg-rose-500 text-white hover:bg-rose-600 transition-all">
            Cerrar Sesión
          </button>
          </div>
>>>>>>> Stashed changes
        </header>

        {/* Diseño: Bloque de estadísticas ajustado a 4 columnas para incluir Pendientes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">Total Proyectos</p>
            <p className="text-2xl font-black">{proyectos.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">En Progreso</p>
            <p className="text-2xl font-black text-blue-500">{proyectos.filter((p:any) => p.status === 'En Progreso').length}</p>
          </div>
          {/* Diseño: Nuevo cuadro para proyectos Pendientes */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">Pendientes</p>
            <p className="text-2xl font-black text-amber-500">{proyectos.filter((p:any) => p.status === 'Pendiente').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase">Finalizados</p>
            <p className="text-2xl font-black text-emerald-500">{proyectos.filter((p:any) => p.status === 'Finalizado').length}</p>
          </div>
        </div>

        {/* Formulario con selector de Estado */}
        {esJefe && mostrarForm && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4">{editandoId ? 'Editar Proyecto' : 'Datos del Proyecto'}</h2>
            <form onSubmit={handleGuardar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"> 
              <div className="md:col-span-1">
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevoProyecto.name}
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Estado</label>
                <select 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={nuevoProyecto.status}
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, status: e.target.value})}
                >
<<<<<<< Updated upstream
                  <option value="En Progreso">En Progreso</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Finalizado">Finalizado</option>
=======
                  <option value="Activo">Activo</option>
                  <option value="Pendientes">Pendientes</option>
                  <option value="Finalizados">Finalizado</option>
>>>>>>> Stashed changes
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Fecha de Entrega</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-100 dark:bg-slate-700 p-3 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  value={nuevoProyecto.date}
                  onChange={(e) => setNuevoProyecto({...nuevoProyecto, date: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl font-bold transition-colors">
                {editandoId ? 'Guardar Cambios' : 'Registrar Ahora'}
              </button>
            </form>
          </div>
        )}

        {/* Tabla Minimalista */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto"> 
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700/50">
              <tr>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Proyecto</th>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Estado</th>
                <th className="p-4 text-left text-xs uppercase font-bold text-slate-500">Entrega</th> 
                {esJefe && <th className="p-4 text-right text-xs uppercase font-bold text-slate-500">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {proyectos.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-semibold max-w-[200px] md:max-w-md">
                    <p className="truncate" title={p.name}>{p.name}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      p.status === 'Finalizado' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      p.status === 'En Progreso' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {p.date ? new Date(p.date).toLocaleDateString('es-ES') : 'Sin fecha'}
                  </td>
                  {esJefe && (
                    <td className="p-4 text-right space-x-3">
                      <button onClick={() => { setNuevoProyecto(p); setEditandoId(p.id); setMostrarForm(true); }} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">Editar</button>
<<<<<<< Updated upstream
                      <button onClick={() => handleEliminar(p.id)} className="text-rose-500 font-bold text-sm hover:underline">Eliminar</button>
=======
                      <button onClick={() => { setModalEliminar(p.id); }} className="text-rose-500 font-bold text-sm hover:underline">Eliminar</button>
>>>>>>> Stashed changes
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<<<<<<< Updated upstream
=======
        {modalEliminar && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center">
              <p className="font-bold mb-4 text-blue-700">¿Seguro que quieres eliminar este proyecto?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setModalEliminar(null)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancelar</button>
                <button onClick={async () => { await fetch(`http://localhost:3001/api/projects/${modalEliminar}`, { method: 'DELETE' }); setModalEliminar(null); cargarProyectos(); }} className="px-4 py-2 bg-rose-500 text-white rounded-lg">Eliminar</button>
              </div>
            </div>
          </div>
        )}

>>>>>>> Stashed changes
      </div>
    </div>
  );
}