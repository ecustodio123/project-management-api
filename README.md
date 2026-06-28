<div align="center">

# ⚙️ FlowPilot API

### Backend powering the FlowPilot Collaborative Project Management Platform

Secure, scalable, and cloud-ready REST API built with NestJS, Prisma, PostgreSQL, and AWS Cognito.

<p align="center">

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AWS Cognito](https://img.shields.io/badge/AWS-Cognito-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/cognito/)
[![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)

</p>

</div>

---

# 🚀 API Documentation

Swagger Documentation

https://project-management-api-production-c67f.up.railway.app/api/docs

---

# 🌐 Frontend Application

https://project-management-web.pages.dev/

---

# 📖 Overview

FlowPilot API is the backend service responsible for powering the FlowPilot collaborative project management platform.

The API provides secure authentication, project collaboration, role-based authorization, task management, comments, file uploads, and user synchronization using AWS Cognito.

Designed following modern backend architecture principles, the project emphasizes scalability, maintainability, and clean separation of responsibilities.

---

# ✨ Features

## 🔐 Authentication

- AWS Cognito Authentication
- JWT Validation
- Access Token Verification
- ID Token Verification
- User Synchronization
- Secure Authentication Guards

---

## 👥 User Management

- User Registration
- Cognito User Sync
- Profile Management

---

## 📁 Project Management

- Create Projects
- Update Projects
- Delete Projects
- Project Dashboard

---

## 👥 Members

- Invite Members
- Assign Roles
- Remove Members
- Role Management

---

## ✅ Tasks

- CRUD Operations
- Status Updates
- Task Assignment
- Due Dates

---

## 💬 Comments

- Create Comments
- Delete Comments
- Project Collaboration

---

## 📎 Files

- Upload Files
- Download Files
- Delete Files

---

## 🛡️ Authorization

Role-Based Access Control (RBAC)

- OWNER
- ADMIN
- MEMBER
- VIEWER

---

# 🏗️ Architecture

```text
                   React Frontend
                          │
                     AWS Cognito
                          │
             Access Token / ID Token
                          │
                          ▼
                NestJS Authentication Guard
                          │
                          ▼
                     Controllers
                          │
                          ▼
                      Services
                          │
                          ▼
                      Prisma ORM
                          │
                          ▼
                     PostgreSQL
```

---

# 🔒 Authentication Flow

```text
User

 │

 ▼

AWS Cognito

 │

 ▼

ID Token

 │

 ▼

sync-user endpoint

 │

 ▼

PostgreSQL User

 │

 ▼

Access Token

 │

 ▼

Protected APIs

 │

 ▼

RBAC Validation
```

---

# 👥 Role-Based Access Control

| Role | Permissions |
|------|-------------|
| OWNER | Full project administration |
| ADMIN | Manage project content and members |
| MEMBER | Create and update tasks, comments and files |
| VIEWER | Read-only access |

---

# 📦 API Modules

```text
Auth

Projects

Members

Tasks

Comments

Files

Users
```

---

# 🛠 Tech Stack

| Layer | Technology |
|---------|------------|
| Framework | NestJS |
| Language | TypeScript |
| ORM | Prisma ORM |
| Database | PostgreSQL |
| Authentication | AWS Cognito |
| Authorization | RBAC |
| API Docs | Swagger |
| Cloud | Railway |
| Validation | class-validator |
| File Uploads | Multer |

---

# 📂 Project Structure

```text
src
│
├── auth
├── users
├── projects
├── members
├── tasks
├── comments
├── files
├── prisma
├── common
└── config
```

---

# 🚀 Running Locally

## Clone repository

```bash
git clone https://github.com/ecustodio123/project-management-api.git
```

---

## Install dependencies

```bash
npm install
```

---

## Configure environment variables

```env
DATABASE_URL=

COGNITO_USER_POOL_ID=

COGNITO_CLIENT_ID=

AWS_REGION=

JWT_SECRET=
```

---

## Run migrations

```bash
npx prisma migrate deploy
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Start server

```bash
npm run start:dev
```

---

# 📚 API Documentation

Swagger

https://project-management-api-production-c67f.up.railway.app/api/docs

---

# 🧠 What I Learned

During the development of FlowPilot API I gained hands-on experience with:

- NestJS Architecture
- Prisma ORM
- PostgreSQL
- AWS Cognito
- Authentication Flows
- Authorization (RBAC)
- REST API Design
- Authentication Guards
- JWT Validation
- Cloud Deployments
- Secure Backend Architecture
- Clean Service Layer Design

---

# 🚀 Future Improvements

- Refresh Token Rotation
- Audit Logs
- Email Notifications
- WebSockets
- Background Jobs
- Redis Caching
- Docker
- Kubernetes
- Monitoring & Observability

---

# 🔗 Related Projects

Frontend Repository

https://github.com/ecustodio123/project-management-web

Frontend Demo

https://project-management-web.pages.dev/

---

# 👨‍💻 Author

**Enrique Custodio**

React Native & Frontend Engineer

Expanding into Full Stack & Cloud Engineering.

---

## ⭐ If you found this project interesting, consider giving it a star!