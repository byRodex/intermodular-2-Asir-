# Memoria Técnica del Proyecto: Gestión de Proyectos ASIR

## 1. Descripción General
Este proyecto consiste en una aplicación web completa para la gestión de proyectos y clientes. La arquitectura está diseñada siguiendo el modelo de **microservicios** contenerizados, lo que garantiza escalabilidad, modularidad y facilidad de despliegue.

## 2. Arquitectura del Sistema
El sistema se compone de 4 contenedores Docker orquestados mediante Docker Compose:

1.  **Frontend (Nginx + React)**:
    *   Servidor web Nginx que sirve la aplicación React (SPA).
    *   Actúa también como **Balanceador de Carga** (Load Balancer), distribuyendo las peticiones API entre las dos instancias del backend.
2.  **Backend Nodo A (Node.js)**: Primera instancia del servidor API.
3.  **Backend Nodo B (Node.js)**: Segunda instancia del servidor API (para alta disponibilidad).
4.  **Base de Datos (MySQL)**: Persistencia de datos relacional.

## 3. Tecnologías Utilizadas

### Frontend (Interfaz de Usuario)
*   **React**: Librería de JavaScript para construir la interfaz de usuario basada en componentes.
*   **Vite**: Herramienta de construcción (build tool) rápida para desarrollo moderno.
*   **TailwindCSS**: Framework de CSS "utility-first" para un diseño rápido y responsivo.
*   **Fetch API**: Para la comunicación asíncrona con el backend.

### Backend (Lógica de Negocio)
*   **Node.js**: Entorno de ejecución de JavaScript en el servidor.
*   **Express.js**: Framework web minimalista para crear la API REST.
*   **MySQL2**: Cliente de base de datos optimizado con soporte para Promesas.
*   **CORS**: Middleware para permitir peticiones desde el frontend.

### Base de Datos
*   **MySQL 8.0**: Sistema de gestión de bases de datos relacional.
*   **Scripts de Inicialización**:
    *   `01_schema.sql`: Define la estructura (tablas, triggers, procedimientos).
    *   `02_data.sql`: Carga datos de prueba iniciales.

### Infraestructura y DevOps
*   **Docker**: Para la contenerización de aplicaciones.
*   **Docker Compose**: Para definir y ejecutar la aplicación multi-contenedor.
*   **Nginx**: Servidor web y Proxy Inverso.

## 4. Funcionalidades Implementadas

### Gestión de Proyectos
*   **Listado**: Visualización de todos los proyectos con detalles (ID, Nombre, Cliente, Fecha).
*   **Creación**: Formulario para añadir nuevos proyectos asignados a un cliente existente.
*   **Eliminación**: Capacidad de borrar proyectos (con confirmación de seguridad).

### Gestión de Clientes
*   **Integración**: Los clientes se cargan dinámicamente desde la base de datos para ser seleccionados al crear un proyecto.

## 5. Cómo Ejecutar el Proyecto

El despliegue se realiza con un solo comando gracias a Docker Compose:

```bash
docker-compose up -d --build
```

Esto levantará todos los servicios:
*   **Frontend**: Accesible en `http://localhost`
*   **Base de Datos**: Puerto 3309 (mapeado desde el 3306 interno)

## 6. Estructura de Archivos Clave

*   `docker-compose.yml`: Orquestación de todos los servicios.
*   `frontend/src/components/ProjectList.jsx`: Componente principal de la UI.
*   `backend/server.js`: Punto de entrada de la API y lógica del servidor.
*   `database/`: Scripts SQL para la creación y poblado de la BD.
