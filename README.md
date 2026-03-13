<h1 align="center">
Trasteando
</h1>

<p align="center">
Gestión inteligente de trasteros y espacios de almacenamiento
</p>

<p align="center">
Alquila · Gestiona · Paga · Todo online
</p>

---

<p align="center">
  <img src="docs/banner_1600.png">
</p>

---

# 🚀 Demo

https://trasteando.onrender.com

---

# ⚙️ Tech Stack

<p align="center">

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>

<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"/>

<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/>

<img src="https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socket.io&logoColor=white"/>

<img src="https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white"/>

</p>

---

# 🧠 ¿Qué es Trasteando?

**Trasteando** es una plataforma web que permite gestionar **trasteros y espacios de almacenamiento** de forma sencilla y digital.

Permite:

- alquilar unidades de almacenamiento
- gestionar contratos
- controlar ubicaciones
- gestionar pagos
- comunicación en tiempo real

Todo desde un **dashboard web centralizado**.

---

# 🏗 Arquitectura


Frontend
React
│
│ REST API
▼
Backend
Flask API
│
│ ORM
▼
Database
PostgreSQL


Servicios integrados


-  Stripe → pagos
-  Socket.IO → mensajería en tiempo real
-  JWT → autenticación segura
-  Google Mpas → Geolocalización
-  AI Inteligence → Inventario inteligente


---

# 📦 Instalación local

Para ejecutar Trasteando en entorno local necesitas tener instalado:

Python 3.10+

Node.js 20+

PostgreSQL

Pipenv


Backend setup

1️⃣ Instalar dependencias

  - pipenv install
  
2️⃣ Crear variables de entorno

  - cp .env.example .env

Ejemplo de configuración:

DATABASE_URL=postgres://username:password@localhost:5432/trasteando
SECRET_KEY=your_secret_key

3️⃣ Ejecutar migraciones de base de datos

 -  pipenv run migrate
 -  pipenv run upgrade

4️⃣ Iniciar servidor backend

 -  pipenv run start_socket

El backend se ejecutará en:

http://localhost:3001

Frontend setup

1️⃣ Instalar dependencias

 - npm install

2️⃣ Iniciar entorno de desarrollo

 - npm run start

La aplicación estará disponible en:

http://localhost:3000
🔑 Funcionalidades principales

Trasteando incluye:

📦 Gestión de trasteros

📑 Gestión de contratos

👤 Dashboard de usuario

💳 Sistema de pagos con Stripe

💬 Mensajería en tiempo real (Socket.IO)

🔐 Autenticación segura con JWT

🗄 Persistencia de datos con PostgreSQL



<h1 align="center">Proyecto desarrollado durante el Full Stack Developer Bootcamp de 4Geeks Academy.</h1>

<img src="https://ishan-rest.vercel.app/svg/banner/dev/Irene-Sergio-David" alt="banner" width="100%"/>


---
