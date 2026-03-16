'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Plus, LogOut, CheckCircle2, Clock, PlayCircle, Trash2, Edit2, X, Save, Users } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  sector: string | null;
  assignedToId: string | null;
  assignedTo: { id: string; name: string | null; email: string } | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

const STATUS_OPTIONS = [
  { value: 'por_comenzar', label: 'Por Comenzar', icon: PlayCircle, color: 'text-gray-500' },
  { value: 'pendiente_finalizacion', label: 'Pendiente Finalización', icon: Clock, color: 'text-yellow-500' },
  { value: 'completa', label: 'Completa', icon: CheckCircle2, color: 'text-green-500' },
];

export default function DashboardClient() {
  const { data: session } = useSession() || {};
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', sector: '', assignedToId: '', status: 'por_comenzar' });

  const isManager = session?.user?.role === 'manager';

  // Fetch de tareas
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch de usuarios (para asignación)
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (isManager) fetchUsers();
  }, [isManager]);

  // Crear tarea
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', sector: '', assignedToId: '', status: 'por_comenzar' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  // Actualizar tarea
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setEditingTask(null);
        setFormData({ title: '', description: '', sector: '', assignedToId: '', status: 'por_comenzar' });
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Cambiar estado (para usuarios)
  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Eliminar tarea
  const handleDelete = async (taskId: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      sector: task.sector || '',
      assignedToId: task.assignedToId || '',
      status: task.status,
    });
  };

  const getStatusInfo = (status: string) => STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-sky-900 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-sky-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Gestor de Tareas</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {session?.user?.name} • <span className="capitalize font-medium">{isManager ? 'Gerente' : 'Usuario'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header con botón crear */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{isManager ? 'Todas las Tareas' : 'Mis Tareas'}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {tasks?.length ?? 0} {(tasks?.length ?? 0) === 1 ? 'tarea' : 'tareas'} {isManager ? 'en el sistema' : 'asignadas'}
            </p>
          </div>
          {isManager && (
            <button
              onClick={() => { setShowForm(true); setEditingTask(null); setFormData({ title: '', description: '', sector: '', assignedToId: '', status: 'por_comenzar' }); }}
              className="flex items-center gap-2 px-4 py-2.5 btn-primary text-white font-medium rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Nueva Tarea
            </button>
          )}
        </div>

        {/* Lista de tareas */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Cargando tareas...</div>
        ) : (tasks?.length ?? 0) === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <CheckCircle2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No hay tareas {isManager ? 'creadas' : 'asignadas'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {tasks?.map((task) => {
                const statusInfo = getStatusInfo(task?.status ?? 'por_comenzar');
                const StatusIcon = statusInfo?.icon ?? PlayCircle;
                return (
                  <motion.div
                    key={task?.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className={`w-5 h-5 ${statusInfo?.color ?? ''}`} />
                          <h3 className="font-semibold text-lg">{task?.title ?? 'Sin título'}</h3>
                        </div>
                        {task?.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{task?.description}</p>
                        )}
                        <div className="flex flex-wrap gap-3 text-sm">
                          {task?.sector && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                              Sector: {task?.sector}
                            </span>
                          )}
                          {task?.assignedTo && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {task?.assignedTo?.name ?? task?.assignedTo?.email ?? 'Usuario'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Selector de estado para usuarios */}
                        {!isManager && (
                          <select
                            value={task?.status ?? 'por_comenzar'}
                            onChange={(e) => handleStatusChange(task?.id ?? '', e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
                            ))}
                          </select>
                        )}
                        {/* Acciones para gerente */}
                        {isManager && (
                          <>
                            <button
                              onClick={() => openEditForm(task)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                              title="Editar"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(task?.id ?? '')}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {(showForm || editingTask) && isManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => { setShowForm(false); setEditingTask(null); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
                <button
                  onClick={() => { setShowForm(false); setEditingTask(null); }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={editingTask ? handleUpdate : handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título *</label>
                  <input
                    type="text"
                    value={formData?.title ?? ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={formData?.description ?? ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sector</label>
                  <input
                    type="text"
                    value={formData?.sector ?? ''}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="Ej: Ventas, Marketing, IT..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={formData?.status ?? 'por_comenzar'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt?.value} value={opt?.value}>{opt?.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Asignar a</label>
                  <select
                    value={formData?.assignedToId ?? ''}
                    onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  >
                    <option value="">Sin asignar</option>
                    {users?.map(user => (
                      <option key={user?.id} value={user?.id}>
                        {user?.name ?? user?.email} ({user?.role === 'manager' ? 'Gerente' : 'Usuario'})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 btn-primary text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingTask ? 'Guardar Cambios' : 'Crear Tarea'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
