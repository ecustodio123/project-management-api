# Project Management API

Backend API for a fullstack **Project Management / Client Portal** application.

This project was built to learn and practice **Backend Engineering**, **Database Design**, **Authentication**, **Cloud Storage**, and **AWS services** using a real-world architecture.

---

## Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Current Authenticated User (`/auth/me`)

### Projects

- Create Projects
- Update Projects
- Delete Projects
- Get Project Details
- List User Projects

### Project Members

- Add Members to Projects
- Update Member Roles
- Remove Members
- Get Project Members

### Tasks

- Create Tasks
- Update Tasks
- Delete Tasks
- Get Task Details
- Get Project Tasks
- Pagination & Filtering

### Comments

- Add Comments to Tasks
- Get Task Comments
- Delete Comments

### File Uploads

- Upload Files to AWS S3
- Secure Private Storage
- Presigned Download URLs
- Delete Files

### Activity Logs

- Project Activity Timeline
- Task Creation Logs
- Task Updates
- Comments Logs
- File Upload Logs

### API Documentation

- Swagger / OpenAPI Documentation

---

## Tech Stack

### Backend

- Node.js
- NestJS
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT Authentication
- bcrypt password hashing

### Cloud / Infrastructure

- AWS S3
- Railway (Deployment)

### Documentation

- Swagger / OpenAPI

---

## Architecture

```txt
Frontend (React + Cloudflare Pages)
            ↓
Backend API (NestJS + Railway)
            ↓
PostgreSQL Database (Railway)
            ↓
AWS S3 (Private File Storage)
```

---

## API Documentation

Swagger UI:

```txt
https://project-management-api-production-c67f.up.railway.app/api/docs
```


---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=1d

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
```

---

## Running Locally

### Install dependencies

```bash
npm install
```

### Run migrations

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Start development server

```bash
npm run start:dev
```

API will run on:

```txt
http://localhost:3000
```

Swagger:

```txt
http://localhost:3000/api/docs
```

---

## Deployment

### Backend

Deployed using:

```txt
Railway
```

### Database

Hosted on:

```txt
Railway PostgreSQL
```

### File Storage

Hosted on:

```txt
AWS S3
```

---

## Security Considerations

- JWT Protected Endpoints
- Password Hashing with bcrypt
- Private AWS S3 Bucket
- Presigned URLs for File Access
- Route Authorization
- Project Membership Validation

---

## Future Improvements

- Role Permissions Expansion
- Realtime Updates
- WebSockets
- Unit / Integration Testing
- CI/CD Pipeline
- AWS Cognito Authentication
- Dockerized Production Environment

---

## Learning Goals

This project was built to strengthen knowledge in:

- Backend Engineering
- Database Relationships
- Authentication & Authorization
- Cloud Storage
- API Architecture
- Fullstack Development
- AWS Services
- Real-world System Design