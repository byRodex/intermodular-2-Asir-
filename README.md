# ASIRManager - Gestión de Proyectos con Alta Disponibilidad 🚀

[cite_start]Este proyecto es una solución tecnológica integral para la gestión de proyectos en un entorno empresarial, diseñada bajo una arquitectura de microservicios y desplegada en la nube de Amazon Web Services (AWS)[cite: 58, 446].

---

## 🏗️ Arquitectura de Infraestructura (Docker)
[cite_start]La solución utiliza **Docker Compose** para orquestar 4 contenedores interconectados en una red interna aislada (`red_proyectos`)[cite: 71, 72]:

* [cite_start]**Frontend + Proxy (Nginx):** Actúa como balanceador de carga y sirve la interfaz de usuario en el puerto 80[cite: 121, 196].
* [cite_start]**Backend (Nodos A y B):** Dos instancias de la API en Node.js + Express para asegurar la tolerancia a fallos[cite: 121, 122].
* [cite_start]**Base de Datos:** MariaDB 10.6 para la persistencia de datos[cite: 196].

---

## 🛡️ Características Técnicas Destacadas

### 1. Alta Disponibilidad (HA)
* [cite_start]**Balanceo de Carga:** Se utiliza Nginx como Proxy Inverso para distribuir peticiones entre los nodos del backend mediante Round Robin[cite: 119, 121].
* [cite_start]**Live Resilience Dashboard:** Módulo de Ingeniería del Caos integrado para monitorizar y testear la caída de nodos en tiempo real sin interrumpir el servicio[cite: 298, 302].

### 2. Optimización para AWS
* [cite_start]**Eficiencia de Recursos:** Migración de MySQL a MariaDB 10.6, reduciendo el consumo de RAM en un 40%[cite: 477].
* [cite_start]**Memoria Virtual:** Configuración de un fichero SWAP de 4GB para garantizar estabilidad en instancias t3.micro[cite: 475, 476].
* [cite_start]**Contención:** Aplicación de límites estrictos de CPU y Memoria por contenedor para evitar el acaparamiento de recursos[cite: 124, 125].

### 3. Administración y Seguridad
* [cite_start]**Backups Automáticos:** Scripts en PowerShell (`backup.ps1`) que automatizan las copias de seguridad de la base de datos[cite: 331, 441].
* [cite_start]**Seguridad Perimetral:** Configuración de AWS Security Groups con política de denegación por defecto y acceso SSH mediante claves PEM[cite: 484, 487].
* [cite_start]**Lógica en BD:** Implementación de Triggers de auditoría, funciones para cálculo de progreso y eventos para cierre de tareas vencidas[cite: 179, 181, 193].

---

## 🚀 Despliegue en AWS

[cite_start]El sistema es accesible de forma global a través de la infraestructura de AWS[cite: 510]:
* [cite_start]**IP Pública:** `56.228.22.131` [cite: 520]
* [cite_start]**Panel de Gestión:** Portainer (Puerto 9000) para administración visual de contenedores[cite: 342, 554].

---

## 👥 Autores
* [cite_start]**Álvaro Sánchez de la Vaquera Mercant** [cite: 19]
* [cite_start]**Alberto Rodero Herrera** [cite: 19]
* [cite_start]**Nadir El Yemlahi** [cite: 19]

[cite_start]**Curso:** 2024/2025 - 2º ASIR [cite: 19]
