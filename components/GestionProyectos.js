"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/proyectos';

export default function GestionProyectos() {
  const [rolUsuario, setRolUsuario] = useState('usuario'); 
  const [proyectos, setProyectos] = useState([]);
  const [form, setForm] = useState({ nombre: '', descripcion: '', progreso: 0 });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const authRole = localStorage.getItem('role') || localStorage.getItem('userRole');
    if (authRole) {
      setRolUsuario(authRole.toLowerCase());
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setProyectos(res.data);
    } catch (err) {
      console.error("Error de conexión");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rolUsuario !== 'gerente') return;

    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, form);
        setEditandoId(null);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ nombre: '', descripcion: '', progreso: 0 });
      fetchData();
    } catch (err) {
      console.error("Error al procesar solicitud");
    }
  };

  const onDelete = async (id) => {
    if (window.confirm('¿Confirmar eliminación?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error al eliminar");
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen font-sans text-black">
      <header className="mb-12 border-b-2 border-black pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Gestión de Proyectos</h1>
        <p className="text-gray-500 text-sm mt-2 font-medium">Sistema Interno / Acceso: {rolUsuario}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {rolUsuario === 'gerente' && (
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xs font-black uppercase mb-6 tracking-widest">Control de Registros</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input 
                    className="w-full bg-transparent border-b border-gray-300 p-2 focus:border-black outline-none transition text-sm"
                    value={form.nombre} 
                    onChange={e => setForm({...form, nombre: e.target.value})} 
                    placeholder="NOMBRE DEL PROYECTO" required 
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>PROGRESO</span>
                    <span>{form.progreso}%</span>
                  </div>
                  <input 
                    type="range" className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-black"
                    min="0" max="100" value={form.progreso} 
                    onChange={e => setForm({...form, progreso: e.target.value})} 
                  />
                </div>
                <textarea 
                  className="w-full bg-transparent border border-gray-300 p-3 rounded-md focus:border-black outline-none h-28 text-sm"
                  value={form.descripcion} 
                  onChange={e => setForm({...form, descripcion: e.target.value})}
                  placeholder="DESCRIPCIÓN TÉCNICA..."
                />
                <button type="submit" className="w-full bg-black text-white text-xs font-black py-4 rounded-md hover:bg-gray-800 transition">
                  {editandoId ? 'ACTUALIZAR DATOS' : 'CREAR REGISTRO'}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className={`${rolUsuario === 'gerente' ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proyectos.map(p => (
              <div key={p.id} className="border border-gray-200 p-6 rounded-lg hover:border-black transition-colors bg-white">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-tight">{p.nombre}</h3>
                    <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">{p.descripcion}</p>
                  </div>
                  {rolUsuario === 'gerente' && (
                    <div className="flex gap-4">
                      <button onClick={() => {setEditandoId(p.id); setForm(p)}} className="text-[10px] font-black border-b border-black">EDITAR</button>
                      <button onClick={() => onDelete(p.id)} className="text-[10px] font-black text-gray-400 hover:text-black transition">BORRAR</button>
                    </div>
                  )}
                </div>
                <div className="w-full bg-gray-100 h-[2px] mt-8">
                  <div className="h-full bg-black transition-all duration-1000" style={{width: `${p.progreso}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}