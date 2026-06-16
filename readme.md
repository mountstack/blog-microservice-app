# Blog App — Microservices

A blogging platform built with a microservices architecture. <br> 
Each service is independently deployable, communicates asynchronously via a message bus, and owns its own database.

---

## Services

| Service | Port | Responsibility |
|---|---|---|
| `api-gateway` | 8000 | Single entry point — routes requests to services |
| `post` | 8001 | Post Service |
| `comment` | 8002 | Comment Service |
| `user` | 8003 | User Service - Registration, login, JWT auth, token refresh |
| `query-service` | 8010 | Serves all GET requests |

---

## Architecture

```
Client
  │
  ▼
API Gateway (8000)
  │
  ├──▶ User Service    (write)
  ├──▶ Post Service    (write)
  ├──▶ Comment Service (write)
  └──▶ Query Service   (read)

Write Services ──▶ RabbitMQ (blog_bus) ──▶ Query Service
```

All write operations go to the respective service. <br> 
All read operations go to the Query Service, which maintains its own synced database.

---

## CQRS Pattern

This project applies **Command Query Responsibility Segregation (CQRS)**:

- **Commands** (writes) are handled by `user`, `post`, and `comment` services. Each has its own PostgreSQL database and is the source of truth for its domain.
- **Queries** (reads) are handled exclusively by the `query-service`, which listens to events from the message bus. <br> 
All HTTP `GET` Request is handled by query-service. 

This separation means reads and writes can scale independently, and the query service can shape its data however best suits the client — without coupling to the write models.

---

## Event Bus — RabbitMQ

Services communicate via **RabbitMQ** using a fanout exchange (`blog_bus`).

When a write service performs an action, it publishes an event:

| Event | Published by |
|---|---|
| `UserCreated` | user service |
| `PostCreated` | post service |
| `CommentCreated` | comment service |

The query service subscribes to all events and updates its own database accordingly. <br>
Services are fully decoupled — publishers don't know who's listening.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Auth | JWT (access token + refresh token rotation) |
| ORM | TypeORM |
| Database | PostgreSQL (one per service) |
| Message Bus | RabbitMQ (amqplib v2) |
| API Gateway | Express reverse proxy |

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- RabbitMQ
- Docker

### Start RabbitMQ before any service:

```bash
# Docker (quickest)
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

### Run each service

```bash
# From each service directory
npm install
npm run start:dev
``` 


### Environment variables

Each service has its own `.env`. See the `.env.example` inside each service directory for the required variables.

---

## Folder Structure

```
blog/
├── api-gateway/
├── user/
├── post/
├── comment/
├── query/
└── README.md 
```

Each service folder contains its own `README.md` with setup, env vars.