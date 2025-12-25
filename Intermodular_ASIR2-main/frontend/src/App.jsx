import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import ProjectList from './components/ProjectList';

// --- REGISTRO DE LIBRERÍAS GRÁFICAS ---
ChartJS.register(ArcElement, Tooltip, Legend);

// --- 1. ICONOS SVG INTEGRADOS (Para evitar errores de dependencias) ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Folder: () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  Server: () => <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 01-2 2v4a2 2 0 012 2h14a2 2 0 01-2-2m-2-4h.01M17 16h.01" /></svg>,
  User: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
};

// --- 2. COMPONENTE: BARRA LATERAL (SIDEBAR) ---
const Sidebar = ({ currentView, setView, serverInfo }) => {
  const btnClass = (view) => `w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all font-medium cursor-pointer ${currentView === view ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`;

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl flex-shrink-0 z-20 h-screen">
      <div className="p-6 border-b border-slate-800 flex items-center justify-center">
        <h2 className="text-2xl font-bold tracking-wider text-white">ASIR<span className="text-blue-500">Manager</span></h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button onClick={() => setView('dashboard')} className={btnClass('dashboard')}><Icons.Dashboard /> Dashboard</button>
        <button onClick={() => setView('projects')} className={btnClass('projects')}><Icons.Folder /> Proyectos</button>
      </nav>
      <div className="p-4 border-t border-slate-800 bg-slate-800/30">
        <div className="flex items-center text-xs text-slate-400 font-mono">
          <Icons.Server /> Backend: <span className={`ml-auto px-2 py-0.5 rounded ${serverInfo === 'Offline' ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>{serverInfo}</span>
        </div>
      </div>
    </aside>
  );
};

// --- 3. COMPONENTE: DASHBOARD ---
const DashboardView = ({ projects }) => {
  const safeProjects = Array.isArray(projects) ? projects : [];
  const total = safeProjects.length;
  const clientCounts = {};

  safeProjects.forEach(p => {
    const name = p.cliente_nombre || 'Sin Asignar';
    clientCounts[name] = (clientCounts[name] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(clientCounts),
    datasets: [{ data: Object.values(clientCounts), backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'], borderWidth: 0 }],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* KPIs */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm uppercase font-bold">Total Proyectos</div>
          <div className="text-3xl font-bold text-slate-800">{total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="text-gray-500 text-sm uppercase font-bold">Clientes Activos</div>
          <div className="text-3xl font-bold text-slate-800">{Object.keys(clientCounts).length}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="text-gray-500 text-sm uppercase font-bold">Estado Sistema</div>
          <div className="text-3xl font-bold text-green-600 flex items-center gap-2">Online</div>
        </div>
      </div>

      {/* Gráfica */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="font-bold text-lg mb-4 w-full text-left">Distribución por Cliente</h3>
        {total > 0 ?
          <div className="h-64 w-full flex justify-center"><Doughnut data={chartData} options={{ maintainAspectRatio: false }} /></div>
          :
          <div className="text-center py-10 text-slate-400 flex flex-col items-center">
            <p>No hay datos para la gráfica</p>
            <p className="text-sm text-blue-500 mt-2">Crea un proyecto para comenzar</p>
          </div>
        }
      </div>

      {/* Feed de Últimos Proyectos */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-bold text-lg mb-4">Últimos Proyectos</h3>
        <div className="space-y-4">
          {safeProjects.length > 0 ? safeProjects.slice(0, 5).map((p, i) => (
            <div key={i} className="border-b pb-2 last:border-0">
              <div className="font-medium text-slate-800">{p.nombre}</div>
              {p.descripcion && (
                <div className="text-xs text-slate-400 mt-0.5 mb-1 truncate max-w-[250px]" title={p.descripcion}>
                  {p.descripcion}
                </div>
              )}
              <div className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded">{p.cliente_nombre || 'Sin Cliente'}</div>
            </div>
          )) : <p className="text-gray-400 text-sm italic text-center py-4">No hay actividad reciente</p>}
        </div>
      </div>
    </div>
  );
};

// --- 4. COMPONENTE: LISTA DE PROYECTOS (FORMULARIO + TABLA) ---
// Ahora usamos el componente ProjectList importado que incluye botones de editar y eliminar

// --- 5. APP PRINCIPAL (LÓGICA MAESTRA) ---
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  // Corregido: El estado inicial se muestra como "Conectando..."
  const [serverInfo, setServerInfo] = useState('Conectando...');
  // Definimos el usuario estático
  const userName = 'Admin Álvaro';
  const userRole = 'Líder DevOps';

  const fetchData = async () => {
    try {
      const projRes = await fetch('/api/proyectos');
      const infoRes = await fetch('/api/status');

      if (projRes.ok) setProjects(await projRes.json());
      if (infoRes.ok) {
        const info = await infoRes.json();
        // Actualizamos el backend_nodo_a o b
        setServerInfo(info.servidor || 'Backend Node');
      }
    } catch (error) {
      // Si hay error de conexión, se muestra Offline
      setServerInfo('Offline');
    }
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar currentView={currentView} setView={setCurrentView} serverInfo={serverInfo} />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* HEADER CON INFORMACIÓN DE USUARIO */}
        <header className="bg-white h-16 flex items-center justify-between px-8 border-b border-gray-200 z-10 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">{currentView === 'dashboard' ? 'Dashboard General' : 'Gestión de Proyectos'}</h2>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-600"><Icons.User /></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentView === 'dashboard' ? <DashboardView projects={projects} /> : <ProjectList projects={projects} refresh={fetchData} />}
        </div>
      </main>
    </div>
  );
}