<p align="center">
  <img src="docs/logo.png" width="220">
</p>

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
  <img src="docs/banner.png">
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


Stripe → pagos
Socket.IO → mensajería en tiempo real
JWT → autenticación segura


---

# 📦 Instalación local

## Backend

Instalar dependencias
pipenv install

Crear variables de entorno
cp .env.example .env

Ejemplo DATABASE_URL

postgres://username:password@localhost:5432/trasteando

Migraciones
pipenv run migrate
pipenv run upgrade

Arrancar servidor
pipenv run start_socket

Frontend

Instalar dependencias
npm install

Arrancar entorno
npm run start

🔑 Funcionalidades

✔ Gestión de trasteros
✔ Gestión de contratos
✔ Dashboard de usuario
✔ Pagos con Stripe
✔ Mensajería en tiempo real
✔ API segura con JWT

👨‍💻 Equipo

Proyecto desarrollado en 4Geeks Academy Full Stack Bootcamp

Equipo:

Irene Sánchez

Sergio Córdoba

David Álvarez


---
