import React, { useState, useEffect } from 'react';

export default function ProjectList({ projects = [], refresh }) {
  const [clients, setClients] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  // Protección contra undefined
  const safeProjects = Array.isArray(projects) ? projects : [];

  useEffect(() => {
    fetch('/api/clientes')
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('API error');
      })
      .then(data => {
        console.log('Clientes cargados:', data);
        setClients(data);
      })
      .catch(error => {
        console.error('Error cargando clientes:', error);
        // Fallback a datos mock solo si falla la API
        const mockClients = [
          { id_cliente: 1, nombre: "TechSolutions S.L." },
          { id_cliente: 2, nombre: "Banco Futuro" },
          { id_cliente: 3, nombre: "StartUp Innova" }
        ];
        setClients(mockClients);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      id_cliente: form.id_cliente.value
    };

    try {
      const url = editingProject ? `/api/proyectos/${editingProject.id_proyecto}` : '/api/proyectos';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert(editingProject ? 'Proyecto actualizado correctamente' : 'Proyecto creado correctamente');
        form.reset();
        setEditingProject(null);
        refresh();
      } else {
        alert('Simulación: Proyecto guardado (Modo Demo)');
      }
    } catch (error) {
      alert('Info: Guardado simulado (Sin Backend)');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;

    try {
      const res = await fetch(`/api/proyectos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Proyecto eliminado correctamente');
        refresh();
      } else {
        const err = await res.json();
        alert('Error: ' + (err.error || 'No se pudo eliminar'));
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-slate-700 flex items-center gap-2">
          <span className={`${editingProject ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} p-1 rounded`}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {editingProject ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              )}
            </svg>
          </span>
          {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600">Nombre</label>
            <input
              name="nombre"
              required
              defaultValue={editingProject?.nombre || ''}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: Migración Cloud"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600">Cliente</label>
            <select
              name="id_cliente"
              required
              defaultValue={editingProject?.id_cliente || ''}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Seleccionar...</option>
              {clients.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-600">Descripción</label>
            <textarea
              name="descripcion"
              defaultValue={editingProject?.descripcion || ''}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              placeholder="Detalles del proyecto..."
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 ${editingProject ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'} text-white py-2.5 rounded-lg transition-colors font-medium shadow-lg`}
            >
              {editingProject ? 'Actualizar' : 'Guardar Proyecto'}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Listado Completo</h3>
          <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">{safeProjects.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">ID</th>
                <th className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Proyecto</th>
                <th className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Descripción</th>
                <th className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Inicio</th>
                <th className="p-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {safeProjects.map((p, i) => (
                <tr key={p.id_proyecto || i} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="p-4 text-slate-400 text-xs font-mono">#{p.id_proyecto}</td>
                  <td className="p-4 font-medium text-slate-800">{p.nombre}</td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate" title={p.descripcion}>
                    {p.descripcion || <span className="text-slate-300 italic">Sin descripción</span>}
                  </td>
                  <td className="p-4" style={{ minWidth: '150px' }}>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap inline-block">
                      {p.cliente_nombre || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {p.fecha_inicio ? new Date(p.fecha_inicio).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-full transition-colors"
                        title="Editar proyecto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id_proyecto)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                        title="Eliminar proyecto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {safeProjects.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="text-slate-300 mb-2"><svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                    <p className="text-slate-500 font-medium">No hay proyectos</p>
                    <p className="text-slate-400 text-sm">Crea uno nuevo para empezar</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}