"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/proyectos';

export default function GestionProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', progreso: 0 });
  const [editandoId, setEditandoId] = useState(null);

  const cargarProyectos = async () => {
    try {
      const res = await axios.get(API_URL);
      setProyectos(res.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { cargarProyectos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await axios.put(`${API_URL}/${editandoId}`, form);
      setEditandoId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ nombre: '', descripcion: '', progreso: 0 });
    cargarProyectos();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen font-sans text-slate-900">
      <header className="flex justify-between items-center mb-10 border-b pb-5">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Gestión de Proyectos</h1>
          <p className="text-slate-500">Panel de administración para Gerentes</p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase">
          Modo Edición
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO LATERAL */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-5">
            <h2 className="text-xl font-bold mb-6 text-slate-700">
              {editandoId ? '📝 Editar Proyecto' : ' Nuevo Proyecto'}
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Nombre del Proyecto</label>
                <input 
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none transition"
                  value={form.nombre} 
                  onChange={e => setForm({...form, nombre: e.target.value})} 
                  placeholder="Ej: App Móvil"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Progreso ({form.progreso}%)</label>
                <input 
                  type="range"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  min="0" max="100"
                  value={form.progreso} 
                  onChange={e => setForm({...form, progreso: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Descripción</label>
                <textarea 
                  className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none transition h-32"
                  value={form.descripcion} 
                  onChange={e => setForm({...form, descripcion: e.target.value})} 
                  placeholder="¿De qué trata este proyecto?"
                />
              </div>

              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                {editandoId ? 'Guardar Cambios' : 'Crear Proyecto'}
              </button>
            </div>
          </form>
        </div>

        {/* LISTADO DE TARJETAS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Proyectos Activos</h2>
          {proyectos.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{p.nombre}</h3>
                  <p className="text-slate-500 text-sm mt-1">{p.descripcion}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => {setEditandoId(p.id); setForm(p)}} className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600 transition">Editar</button>
                  <button onClick={async () => { if(confirm('¿Borrar?')) { await axios.delete(`${API_URL}/${p.id}`); cargarProyectos(); } }} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition">Eliminar</button>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>PROGRESO</span>
                  <span>{p.progreso}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${p.progreso > 70 ? 'bg-green-500' : p.progreso > 30 ? 'bg-blue-500' : 'bg-amber-500'}`}
                    style={{width: `${p.progreso}%`}}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          {proyectos.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No hay proyectos para mostrar aún.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}