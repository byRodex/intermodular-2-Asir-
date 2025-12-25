const express = require('express');
const mysql = require('mysql2/promise'); // Usamos promesas para código más limpio
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para entender los JSON que nos envíe el frontend

// Configuración de la Base de Datos
const dbConfig = {
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'admin_proyectos',
    password: process.env.DB_PASSWORD || 'SQLpasswd123',
    database: process.env.DB_NAME || 'GESTION_PROYECTOS',
    port: 3306
};

// Función para conectar (con reintentos por si la BD tarda en arrancar)
async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error("Error conectando a BD:", error.message);
        throw error;
    }
}

// --- RUTAS DE LA API (CRUD) ---

// 1. TEST: Para ver qué servidor responde (Balanceo)
app.get('/api/status', (req, res) => {
    res.json({
        estado: "Online",
        servidor: process.env.SERVER_ID || "Desconocido",
        db_host: dbConfig.host
    });
});

// 2. READ: Obtener todos los proyectos (con nombre del cliente)
app.get('/api/proyectos', async (req, res) => {
    try {
        const conn = await getConnection();
        // Hacemos JOIN para traer el nombre del cliente, no solo su ID
        const [rows] = await conn.execute(`
            SELECT p.id_proyecto, p.nombre, p.descripcion, p.id_cliente, p.fecha_inicio, c.nombre as cliente_nombre 
            FROM Proyecto p
            JOIN Cliente c ON p.id_cliente = c.id_cliente
        `);
        await conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2.1 READ: Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const conn = await getConnection();
        const [rows] = await conn.execute('SELECT * FROM Cliente');
        await conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. CREATE: Crear un nuevo proyecto
app.post('/api/proyectos', async (req, res) => {
    const { nombre, descripcion, id_cliente, fecha_inicio } = req.body;

    if (!nombre || !id_cliente) {
        return res.status(400).json({ error: "Nombre y Cliente son obligatorios" });
    }

    try {
        const conn = await getConnection();
        const [result] = await conn.execute(
            'INSERT INTO Proyecto (nombre, descripcion, id_cliente, fecha_inicio) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, id_cliente, fecha_inicio || new Date()]
        );
        await conn.end();
        res.json({ id: result.insertId, mensaje: "Proyecto creado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. UPDATE: Actualizar un proyecto existente
app.put('/api/proyectos/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, id_cliente } = req.body;

    if (!nombre || !id_cliente) {
        return res.status(400).json({ error: "Nombre y Cliente son obligatorios" });
    }

    try {
        const conn = await getConnection();
        // Verificar si el proyecto existe
        const [check] = await conn.execute('SELECT id_proyecto FROM Proyecto WHERE id_proyecto = ?', [id]);
        if (check.length === 0) {
            await conn.end();
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        // Actualizar el proyecto
        await conn.execute(
            'UPDATE Proyecto SET nombre = ?, descripcion = ?, id_cliente = ? WHERE id_proyecto = ?',
            [nombre, descripcion, id_cliente, id]
        );
        await conn.end();
        res.json({ mensaje: "Proyecto actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. DELETE: Eliminar un proyecto
app.delete('/api/proyectos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await getConnection();
        // Primero verificamos si existe
        const [check] = await conn.execute('SELECT id_proyecto FROM Proyecto WHERE id_proyecto = ?', [id]);
        if (check.length === 0) {
            await conn.end();
            return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        // Eliminamos
        await conn.execute('DELETE FROM Proyecto WHERE id_proyecto = ?', [id]);
        await conn.end();
        res.json({ mensaje: "Proyecto eliminado correctamente" });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(400).json({ error: "No se puede eliminar: El proyecto tiene tareas o personal asignado." });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
});

// Arranque del servidor
app.listen(port, () => {
    console.log(`Backend escuchando en puerto ${port} - ID: ${process.env.SERVER_ID}`);
});