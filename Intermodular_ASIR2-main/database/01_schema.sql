-- 1. Creación de la Base de Datos y Usuario Seguro
-- Requisito: Base de Datos "GESTION_PROYECTOS" [cite: 55]
CREATE DATABASE IF NOT EXISTS GESTION_PROYECTOS;
USE GESTION_PROYECTOS;

-- Requisito: No usar ROOT y contraseña robusta [cite: 16, 18]
-- Contraseña configurada para coincidir con docker-compose.yml
CREATE USER IF NOT EXISTS 'admin_proyectos'@'%' IDENTIFIED BY 'SQLpasswd123';
GRANT ALL PRIVILEGES ON GESTION_PROYECTOS.* TO 'admin_proyectos'@'%';
FLUSH PRIVILEGES;

-- 2. Definición de Tablas [cite: 63-71]

-- Tabla Cliente [cite: 65]
CREATE TABLE IF NOT EXISTS Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

-- Tabla Proyecto [cite: 66]
CREATE TABLE IF NOT EXISTS Proyecto (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

-- Tabla Rol [cite: 68]
CREATE TABLE IF NOT EXISTS Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE -- Ej: Gestor, Desarrollador, QA [cite: 59]
);

-- Tabla Personal_equipo [cite: 70]
-- Vincula miembros a proyectos indicando rol.
CREATE TABLE IF NOT EXISTS Personal_equipo (
    id_personal INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    id_proyecto INT NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_proyecto) REFERENCES Proyecto(id_proyecto),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- Tabla Tarea [cite: 71]
CREATE TABLE IF NOT EXISTS Tarea (
    id_tarea INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    prioridad INT DEFAULT 3, -- 1 (Baja) a 5 (Alta)
    estado ENUM('pendiente', 'en_progreso', 'bloqueada', 'hecha') DEFAULT 'pendiente',
    fecha_vencimiento DATE,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_proyecto INT NOT NULL,
    id_responsable INT NULL, -- Referencia a Personal_equipo
    FOREIGN KEY (id_proyecto) REFERENCES Proyecto(id_proyecto),
    FOREIGN KEY (id_responsable) REFERENCES Personal_equipo(id_personal)
);

-- Tabla Tarea_Log (Requerida implícitamente por el Trigger) [cite: 98]
CREATE TABLE IF NOT EXISTS Tarea_Log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_tarea INT,
    campo_modificado VARCHAR(50),
    valor_anterior VARCHAR(255),
    valor_nuevo VARCHAR(255),
    fecha_cambio DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Funciones Determinísticas [cite: 74-76]

DELIMITER //

-- fn_total_tareas_proyecto: Devuelve total tareas [cite: 75]
CREATE FUNCTION fn_total_tareas_proyecto(p_id_proyecto INT) 
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total FROM Tarea WHERE id_proyecto = p_id_proyecto;
    RETURN total;
END //

-- fn_porcentaje_tareas_hechas: (hechas/total * 100) [cite: 76]
CREATE FUNCTION fn_porcentaje_tareas_hechas(p_id_proyecto INT) 
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;
    DECLARE hechas INT;
    DECLARE porcentaje DECIMAL(5,2);

    SELECT COUNT(*) INTO total FROM Tarea WHERE id_proyecto = p_id_proyecto;
    SELECT COUNT(*) INTO hechas FROM Tarea WHERE id_proyecto = p_id_proyecto AND estado = 'hecha';

    IF total = 0 THEN
        RETURN 0.00;
    ELSE
        SET porcentaje = (hechas / total) * 100;
        RETURN porcentaje;
    END IF;
END //

-- 4. Procedimientos Almacenados [cite: 78-85]

-- pr_crear_tarea: Inserta tarea y devuelve ID [cite: 80]
CREATE PROCEDURE pr_crear_tarea(
    IN p_id_proyecto INT, 
    IN p_titulo VARCHAR(150), 
    IN p_desc TEXT, 
    IN p_prioridad INT, 
    IN p_id_responsable INT
)
BEGIN
    INSERT INTO Tarea (id_proyecto, titulo, descripcion, prioridad, estado, id_responsable)
    VALUES (p_id_proyecto, p_titulo, p_desc, p_prioridad, 'pendiente', p_id_responsable);
    
    SELECT LAST_INSERT_ID() as id_nueva_tarea;
END //

-- pr_cambiar_estado_tarea: Valida transición y actualiza [cite: 81-83]
CREATE PROCEDURE pr_cambiar_estado_tarea(
    IN p_id_tarea INT, 
    IN p_nuevo_estado VARCHAR(20)
)
BEGIN
    DECLARE estado_actual VARCHAR(20);
    
    SELECT estado INTO estado_actual FROM Tarea WHERE id_tarea = p_id_tarea;
    
    -- Validación simple: No se puede pasar de 'hecha' a 'pendiente' (ejemplo de lógica)
    -- O usar el Trigger para validación estricta. Aquí hacemos el update.
    -- Manejo de error básico [cite: 85]
    IF estado_actual IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: La tarea no existe.';
    ELSE
        UPDATE Tarea SET estado = p_nuevo_estado WHERE id_tarea = p_id_tarea;
    END IF;
END //

-- 5. Triggers [cite: 91-98]

-- trg_tarea_estado_valido: Veto a estados no válidos [cite: 97]
CREATE TRIGGER trg_tarea_estado_valido
BEFORE UPDATE ON Tarea
FOR EACH ROW
BEGIN
    -- Ejemplo: Impedir pasar de 'hecha' a cualquier otro estado
    IF OLD.estado = 'hecha' AND NEW.estado != 'hecha' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede modificar una tarea ya hecha.';
    END IF;
END //

-- trg_log_cambios_tarea: Registra cambios en Log [cite: 98]
CREATE TRIGGER trg_log_cambios_tarea
AFTER UPDATE ON Tarea
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO Tarea_Log (id_tarea, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id_tarea, 'estado', OLD.estado, NEW.estado);
    END IF;
    
    IF OLD.prioridad != NEW.prioridad THEN
        INSERT INTO Tarea_Log (id_tarea, campo_modificado, valor_anterior, valor_nuevo)
        VALUES (NEW.id_tarea, 'prioridad', OLD.prioridad, NEW.prioridad);
    END IF;
END //

DELIMITER ;

-- 6. Vistas [cite: 88-89]

-- v_tareas_proyecto: Listado enriquecido
CREATE OR REPLACE VIEW v_tareas_proyecto AS
SELECT 
    t.id_tarea, 
    p.nombre as proyecto, 
    c.nombre as cliente, 
    t.titulo, 
    t.estado, 
    t.prioridad, 
    pe.nombre as responsable, 
    t.fecha_vencimiento
FROM Tarea t
JOIN Proyecto p ON t.id_proyecto = p.id_proyecto
JOIN Cliente c ON p.id_cliente = c.id_cliente
LEFT JOIN Personal_equipo pe ON t.id_responsable = pe.id_personal;

-- v_resumen_proyecto: Resumen estadístico
CREATE OR REPLACE VIEW v_resumen_proyecto AS
SELECT 
    p.id_proyecto,
    p.nombre,
    fn_total_tareas_proyecto(p.id_proyecto) as total_tareas,
    (SELECT COUNT(*) FROM Tarea t2 WHERE t2.id_proyecto = p.id_proyecto AND t2.estado='hecha') as tareas_hechas,
    fn_porcentaje_tareas_hechas(p.id_proyecto) as porcentaje_avance
FROM Proyecto p;

-- 7. Eventos [cite: 92-93]
-- Nota: Asegurarse de activar el scheduler en el my.cnf o al arrancar
SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS ev_cerrar_vencidas_diario
ON SCHEDULE EVERY 1 DAY
DO
    UPDATE Tarea 
    SET estado = 'hecha' -- O lógica definida por el usuario
    WHERE fecha_vencimiento < CURDATE() AND estado = 'en_progreso';

CREATE EVENT IF NOT EXISTS ev_bajar_prioridad_inactivas_semanal
ON SCHEDULE EVERY 1 WEEK
DO
    UPDATE Tarea
    SET prioridad = GREATEST(prioridad - 1, 1)
    WHERE fecha_actualizacion < DATE_SUB(NOW(), INTERVAL 30 DAY) AND estado != 'hecha';