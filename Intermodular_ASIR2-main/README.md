Sistema de Gestión de Proyectos / Project Management System

🇪🇸 Español

Descripción del Proyecto

Aplicación Web diseñada para la gestión integral de proyectos, clientes y tareas. Este proyecto implementa una arquitectura de microservicios utilizando contenedores Docker para garantizar la portabilidad, escalabilidad y alta disponibilidad.

Tecnologías utilizadas:

Infraestructura: Docker & Docker Compose.

Base de Datos: Mariadb:10.6 (con persistencia de datos).

Backend: Node.js (API REST con balanceo de carga).

Frontend: Interfaz Web (React.js compilado).

Servidor Web: Nginx (como Proxy Inverso y Balanceador de Carga).

Requisitos Previos

Docker Desktop (Windows/Mac) o Docker Engine (Linux).

Git.

Instalación y Despliegue

Clonar el repositorio:

git clone https://github.com/ASanchezVaqueraM/Intermodular_ASIR2.git cd Intermodular_ASIR2

Construir y levantar los contenedores:

docker compose up --build -d

Verificar que los contenedores están funcionando:

docker compose ps

Acceso a la Aplicación

Web Principal: http://localhost

API (Backend): http://localhost/api/info (Balanceada entre dos nodos).

Conexión aws con ssh: ssh -i "claves.pem" ubuntu@56.228.22.131

Web en aws: http://56.228.22.131/

Presentación: http://56.228.22.131/presentacion.html

Portainer: admin -- Sysadmin1234

Credenciales de Base de Datos (MySQL)

El puerto 3309 está expuesto para administración local con MySQL Workbench.

Host: 127.0.0.1 (Local) / database (Docker interno)

Puerto: 3309

Usuario: admin_proyectos

Contraseña: SQLpasswd123

Base de Datos: GESTION_PROYECTOS

🇬🇧 English

Project Description

Web application designed for comprehensive management of projects, clients, and tasks. This project implements a microservices architecture using Docker containers to ensure portability, scalability, and high availability.

Technologies Stack:

Infrastructure: Docker & Docker Compose.

Database: Mariadb:10.6 (with data persistence).

Backend: Node.js (REST API with load balancing).

Frontend: Web Interface (React.js compiled).

Web Server: Nginx (acting as Reverse Proxy and Load Balancer).

Prerequisites

Docker Desktop (Windows/Mac) or Docker Engine (Linux).

Git.

Installation and Deployment

Clone the repository:

git clone https://github.com/ASanchezVaqueraM/Intermodular_ASIR2.git cd Intermodular_ASIR2

Build and start the containers:

docker compose up --build -d

Verify containers are running:

docker compose ps

Access

Main Web App: http://localhost

API (Backend): http://localhost/api/info (Load balanced between two nodes).

AWS SSH connection: ssh -i "claves.pem" ubuntu@56.228.22.131

AWS Website: http://56.228.22.131/

Database Credentials (MySQL)

Port 3309 is exposed for local administration via MySQL Workbench.

Host: 127.0.0.1 (Local) / database (Internal Docker)

Port: 3309

User: admin_proyectos

Password: SQLpasswd123

Database: GESTION_PROYECTOS

Autores / Authors

Álvaro Sánchez de la Vaquera Mercant - Infraestructura, Base de Datos & Seguridad / Infrastructure, Database & Security

Alberto Rodero Herrera - Desarrollo Frontend / Frontend Development

Nadir El Yemlahi Fakini - Desarrollo Backend / Backend Development
