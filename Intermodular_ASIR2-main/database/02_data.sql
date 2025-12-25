USE GESTION_PROYECTOS;

-- 1. Insertar Clientes [cite: 65]
INSERT INTO Cliente (nombre, contacto, email) VALUES 
('TechSolutions S.L.', 'Ana Martínez', 'ana.martinez@techsolutions.com'),
('Banco Futuro', 'Carlos Ruiz', 'carlos.ruiz@bancofuturo.es'),
('StartUp Innova', 'Lucía Gómez', 'lucia.gomez@innova.io');

-- 2. Insertar Roles [cite: 68]
INSERT INTO Rol (nombre_rol) VALUES 
('Project Manager'),
('Backend Developer'),
('Frontend Developer'),
('DevOps Engineer'),
('QA Tester');

-- 3. Insertar Proyectos [cite: 66]
INSERT INTO Proyecto (nombre, descripcion, fecha_inicio, fecha_fin, id_cliente) VALUES 
('Migración Cloud', 'Migración de infraestructura a AWS', '2025-01-10', '2025-06-20', 1),
('App Banca Móvil', 'Nueva app con autenticación biométrica', '2024-11-01', '2025-12-01', 2),
('Web Corporativa', 'Rediseño completo del portal', '2025-02-01', '2025-04-01', 3);

-- 4. Insertar Personal y Asignación a Equipos [cite: 70]
-- Nota: Asignamos roles específicos para enriquecer las vistas
INSERT INTO Personal_equipo (nombre, email, id_proyecto, id_rol) VALUES 
('Juan Pérez', 'juan.dev@consultora.com', 1, 2), -- Backend en Cloud
('María López', 'maria.ops@consultora.com', 1, 4), -- DevOps en Cloud
('Roberto Díaz', 'roberto.pm@consultora.com', 2, 1), -- PM en Banca
('Elena Nito', 'elena.front@consultora.com', 3, 3), -- Front en Web
('Sofía Test', 'sofia.qa@consultora.com', 2, 5); -- QA en Banca

-- 5. Insertar Tareas (Casos de Prueba para la Lógica) [cite: 71]

-- Tarea 1: Normal pendiente
INSERT INTO Tarea (titulo, descripcion, prioridad, estado, fecha_vencimiento, id_proyecto, id_responsable) 
VALUES ('Configurar VPC', 'Crear subredes pública y privada', 5, 'pendiente', '2025-03-01', 1, 2);

-- Tarea 2: Para probar fn_porcentaje_tareas_hechas (ESTADO: HECHA)
INSERT INTO Tarea (titulo, descripcion, prioridad, estado, fecha_vencimiento, id_proyecto, id_responsable) 
VALUES ('Instalar Docker', 'Instalación en servidores base', 4, 'hecha', '2025-01-15', 1, 2);

-- Tarea 3: Para probar evento ev_cerrar_vencidas_diario (FECHA PASADA + NO HECHA)
-- Al activarse el evento, esta tarea debería cerrarse sola.
INSERT INTO Tarea (titulo, descripcion, prioridad, estado, fecha_vencimiento, id_proyecto, id_responsable) 
VALUES ('Revisión de seguridad', 'Auditoría inicial', 5, 'en_progreso', '2024-12-01', 2, 3);

-- Tarea 4: Para probar evento ev_bajar_prioridad_inactivas (FECHA ANTIGUA)
-- Simulamos una tarea olvidada hace 2 meses. El evento bajará su prioridad.
INSERT INTO Tarea (titulo, descripcion, prioridad, estado, fecha_vencimiento, fecha_actualizacion, id_proyecto) 
VALUES ('Documentar API', 'Escribir Swagger', 5, 'pendiente', '2025-05-01', '2024-10-01 10:00:00', 2);

-- Tarea 5: Tarea bloqueada
INSERT INTO Tarea (titulo, descripcion, prioridad, estado, fecha_vencimiento, id_proyecto) 
VALUES ('Diseño Logo', 'Esperando feedback cliente', 2, 'bloqueada', '2025-02-20', 3);

-- 6. Prueba del Trigger de Logs
-- Actualizamos una tarea inmediatamente para generar un registro en Tarea_Log
UPDATE Tarea SET estado = 'en_progreso' WHERE titulo = 'Configurar VPC';
-- Ahora la tabla Tarea_Log debería tener 1 registro automáticamente.