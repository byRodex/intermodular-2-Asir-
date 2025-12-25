# ASIRManager - Gestión de Proyectos con Alta Disponibilidad 🚀

Este proyecto es una solución tecnológica integral para la gestión de proyectos en un entorno empresarial, diseñada bajo una arquitectura de microservicios y desplegada en la nube de Amazon Web Services (AWS).

---

## 🏗️ Arquitectura de Infraestructura (Docker)
La solución utiliza **Docker Compose** para orquestar 4 contenedores interconectados en una red interna aislada (`red_proyectos`):

* **Frontend + Proxy (Nginx):** Actúa como balanceador de carga y sirve la interfaz de usuario en el puerto 80.
* **Backend (Nodos A y B):** Dos instancias de la API en Node.js + Express para asegurar la tolerancia a fallos.
* **Base de Datos:** MariaDB 10.6 para la persistencia de datos.

---

## 🛡️ Características Técnicas Destacadas

### 1. Alta Disponibilidad (HA)
* **Balanceo de Carga:** Se utiliza Nginx como Proxy Inverso para distribuir peticiones entre los nodos del backend mediante Round Robin.
* **Live Resilience Dashboard:** Módulo de Ingeniería del Caos integrado para monitorizar y testear la caída de nodos en tiempo real sin interrumpir el servicio.

### 2. Optimización para AWS
* **Eficiencia de Recursos:** Migración de MySQL a MariaDB 10.6, reduciendo el consumo de RAM en un 40%.
* **Memoria Virtual:** Configuración de un fichero SWAP de 4GB para garantizar estabilidad en instancias t3.micro.
* **Contención:** Aplicación de límites estrictos de CPU y Memoria por contenedor para evitar el acaparamiento de recursos.

### 3. Administración y Seguridad
* **Backups Automáticos:** Scripts en PowerShell (`backup.ps1`) que automatizan las copias de seguridad de la base de datos.
* **Seguridad Perimetral:** Configuración de AWS Security Groups con política de denegación por defecto y acceso SSH mediante claves PEM.
* **Lógica en BD:** Implementación de Triggers de auditoría, funciones para cálculo de progreso y eventos para cierre de tareas vencidas.

---

## 🚀 Despliegue en AWS

El sistema es accesible de forma global a través de la infraestructura de AWS:
* **IP Pública:** 56.228.22.131
* **Panel de Gestión:** Portainer (Puerto 9000) para administración visual de contenedores.

---

## 👥 Autores
* Álvaro Sánchez de la Vaquera Mercant
* Alberto Rodero Herrera
* Nadir El Yemlahi

**Curso:** 2024/2025 - 2º ASIR
