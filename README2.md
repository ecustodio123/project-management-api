# 🚀 Fullstack Project Roadmap
Project: Project Management / Client Portal

---

## 📌 Fase 0 — Fundamentos del proyecto

**Objetivo:** crear una base sólida.

En esta fase se define:

- Qué módulos tendrá el backend
- Cómo se conectará NestJS con PostgreSQL
- Cómo usar Prisma
- Cómo correr todo localmente con Docker
- Cómo organizar el proyecto como backend real

### Módulos principales

- Auth
- Users
- Projects
- Project Members
- Tasks
- Comments
- Files
- Activity Logs
- Notifications

---

## 🛠️ Fase 1 — Setup Backend + DB local

**Objetivo:** levantar el backend y la base de datos localmente.

### Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker Compose

### Aprendizaje

- Qué es un módulo en NestJS
- Qué es un service
- Qué es un controller
- Qué es Prisma
- Qué es una migration
- Cómo conectar backend con DB

---

## 🧠 Fase 2 — Diseño de base de datos

**Objetivo:** pensar como backend engineer.

### Tablas principales

- User
- Project
- ProjectMember
- Task
- TaskComment
- File
- ActivityLog
- Notification

### Relaciones

- Un **User** puede tener muchos **Projects**
- Un **Project** puede tener muchos **Members**
- Un **Project** puede tener muchas **Tasks**
- Una **Task** puede tener **Comments**
- Una **Task** puede tener **Files**
- **Project** y **Task** generan **Activity Logs**
- Un **User** recibe **Notifications**

---

## 🔐 Fase 3 — Auth con JWT

**Objetivo:** registro, login y protección de rutas.

### Aprendizaje

- Hash de passwords con bcrypt
- Login con email/password
- JWT (access token)
- Guards en NestJS
- Obtener usuario autenticado

### Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

---

## 📁 Fase 4 — Projects

**Objetivo:** que un usuario pueda crear proyectos.

### Endpoints

- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`

### Aprendizaje

- CRUD real
- Validaciones
- Ownership (propiedad de datos)
- Permisos básicos

---

## 👥 Fase 5 — Members & Roles

**Objetivo:** agregar usuarios a proyectos.

### Roles iniciales

- OWNER
- ADMIN
- MEMBER
- VIEWER

### Aprendizaje

- Authorization
- Role-based access control (RBAC)
- Validar pertenencia a un proyecto

---

## ✅ Fase 6 — Tasks

**Objetivo:** crear y asignar tareas.

### Campos

- title
- description
- status
- priority
- assigneeId
- dueDate
- projectId

### Estados

- TODO
- IN_PROGRESS
- REVIEW
- DONE

### Aprendizaje

- Relaciones entre entidades
- Filtros
- Paginación
- Buen diseño de endpoints

---

## 💬 Fase 7 — Comments

**Objetivo:** comentar tareas.

### Endpoints

- `POST /tasks/:taskId/comments`
- `GET /tasks/:taskId/comments`
- `DELETE /comments/:id`

### Aprendizaje

- Recursos anidados
- Validar acceso desde la task
- Activity logs

---

## 📦 Fase 8 — File Uploads (AWS S3)

**Objetivo:** subir archivos.

### Aprendizaje

- Qué es un bucket
- Qué es IAM
- Subir archivos desde backend
- Guardar metadata en PostgreSQL
- Diferencia entre archivo físico vs DB

---

## 📊 Fase 9 — Activity Logs

**Objetivo:** registrar acciones importantes.

### Ejemplos

- Enrique created project
- Enrique assigned task
- Jorge uploaded file

### Aprendizaje

- Auditoría
- Eventos internos
- Trazabilidad

---

## 🔔 Fase 10 — Notifications

**Objetivo:** notificar a usuarios.

### Ejemplos

- Asignación de tareas
- Comentarios
- Menciones

### Evolución futura

- Email
- WebSockets (real-time)

---

## ☁️ Fase 11 — AWS Deployment

**Objetivo:** llevar el proyecto a producción.

### Servicios

- S3 → archivos
- RDS → PostgreSQL
- CloudWatch → logs
- IAM → permisos
- Lambda + API Gateway → serverless
- Cognito → autenticación avanzada

---

## ⚠️ Nota importante

No empezar con AWS desde el inicio.

```txt
Primero backend sólido → luego cloud