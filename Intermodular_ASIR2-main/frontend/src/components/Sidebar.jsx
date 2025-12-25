<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASIR Project Manager - Vista Esperada</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Iconos -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-gray-100 font-sans text-gray-800 h-screen flex overflow-hidden">

    <!-- SIDEBAR (Componente Sidebar.jsx) -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-2xl flex-shrink-0">
        <div class="p-6 border-b border-slate-800">
            <h2 class="text-2xl font-bold tracking-wider text-blue-500">ASIR<span class="text-white text-base">Manager</span></h2>
        </div>

        <nav class="flex-1 p-4 space-y-2">
            <!-- Botón Activo (Dashboard) -->
            <div class="w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors bg-blue-600 text-white shadow-lg cursor-pointer">
                <i data-lucide="layout-dashboard" class="w-5 h-5 mr-3"></i> Dashboard
            </div>
            <!-- Botón Inactivo -->
            <div class="w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 cursor-pointer">
                <i data-lucide="folder-open" class="w-5 h-5 mr-3"></i> Proyectos
            </div>
        </nav>

        <div class="p-4 border-t border-slate-800 bg-slate-800/50">
            <div class="flex items-center text-xs text-slate-400">
                <i data-lucide="server" class="w-3 h-3 mr-2"></i>
                Backend: <span class="ml-1 text-green-400 font-mono">backend_nodo_a</span>
            </div>
        </div>
    </aside>

    <!-- CONTENIDO PRINCIPAL (Componente App.jsx + Dashboard.jsx) -->
    <main class="flex-1 overflow-y-auto p-8">
        <header class="mb-8 flex justify-between items-center">
            <h1 class="text-3xl font-bold text-slate-800">Dashboard General</h1>
            <div class="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-slate-600">
                Usuario: <span class="text-blue-600">Admin</span>
            </div>
        </header>

        <!-- KPIs / Tarjetas -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div class="text-gray-500 text-sm uppercase font-bold">Total Proyectos</div>
                <div class="text-3xl font-bold">3</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div class="text-gray-500 text-sm uppercase font-bold">Clientes Activos</div>
                <div class="text-3xl font-bold">3</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <div class="text-gray-500 text-sm uppercase font-bold">Estado Sistema</div>
                <div class="text-3xl font-bold text-green-600">Online</div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Gráfica (Simulada) -->
            <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <h3 class="font-bold text-lg mb-4">Distribución por Cliente</h3>
                <div class="h-64 flex justify-center items-center relative">
                    <canvas id="myChart"></canvas>
                </div>
            </div>

            <!-- Lista Reciente -->
            <div class="bg-white p-6 rounded-xl shadow-sm">
                <h3 class="font-bold text-lg mb-4">Últimos Proyectos</h3>
                <div class="space-y-4">
                    <div class="border-b pb-2">
                        <div class="font-medium">Migración Cloud</div>
                        <div class="text-xs text-gray-500">TechSolutions</div>
                    </div>
                    <div class="border-b pb-2">
                        <div class="font-medium">App Banca</div>
                        <div class="text-xs text-gray-500">Banco Futuro</div>
                    </div>
                    <div class="border-b pb-2">
                        <div class="font-medium">Web Corporativa</div>
                        <div class="text-xs text-gray-500">StartUp Innova</div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        lucide.createIcons();
        
        // Renderizar gráfica de ejemplo
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['TechSolutions', 'Banco Futuro', 'StartUp Innova'],
                datasets: [{
                    data: [1, 1, 1],
                    backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    </script>
</body>
</html>