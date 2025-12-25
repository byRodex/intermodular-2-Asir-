import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ projects = [] }) {
  // Protección contra undefined
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Calcular estadísticas
  const total = safeProjects.length;
  const clients = [...new Set(safeProjects.map(p => p.cliente_nombre))].length;

  // Datos para gráfica
  const clientCounts = {};
  safeProjects.forEach(p => {
    const name = p.cliente_nombre || 'Sin Asignar';
    clientCounts[name] = (clientCounts[name] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(clientCounts),
    datasets: [{
      data: Object.values(clientCounts),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* KPIs */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-sm uppercase font-bold">Total Proyectos</div>
          <div className="text-3xl font-bold text-slate-800">{total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-sm uppercase font-bold">Clientes Activos</div>
          <div className="text-3xl font-bold text-slate-800">{clients}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 hover:shadow-md transition-shadow">
          <div className="text-gray-500 text-sm uppercase font-bold">Estado Sistema</div>
          <div className="text-3xl font-bold text-green-600 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Online
          </div>
        </div>
      </div>

      {/* Gráfica */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-700">Distribución por Cliente</h3>
        <div className="h-64 flex justify-center relative">
          {total > 0 ? <Doughnut data={chartData} options={{ maintainAspectRatio: false }} /> : <div className="flex items-center text-gray-400">Sin datos suficientes</div>}
        </div>
      </div>

      {/* Feed */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-700">Últimos Proyectos</h3>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {safeProjects.length > 0 ? (
            safeProjects.slice(0, 5).map((p, i) => (
              <div key={p.id_proyecto || i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="font-medium text-slate-800">{p.nombre}</div>
                <div className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded mt-1">{p.cliente_nombre || 'Sin Cliente'}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic">No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}