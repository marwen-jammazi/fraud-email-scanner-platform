# Fraud Email Scanner Platform

A cybersecurity and machine learning platform that detects and analyzes fraudulent, phishing and suspicious emails. It combines a Spring Boot microservices backend, a React frontend and a Python ML microservice to provide scanning, risk scoring, user feedback and reporting.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Services](#services)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)

## Features

- **Email scanning**: detects phishing, spam and fraud attempts.
- **Hybrid detection**: rule-based detection in the scanner service, combined with an ML classifier.
- **Risk levels**: every scan produces a risk level and a detailed result per email.
- **Authentication and roles**: user registration and login with JWT-based security and role-based access.
- **User feedback loop**: users can label scan results so detection quality can be reviewed and improved.
- **Statistics**: summary figures, risk distribution and top senders.
- **Audit trail**: security-relevant events are recorded by a dedicated audit service.
- **Elasticsearch and Kibana**: indexing of scan results and dashboards for fraud trends.
- **Web interface**: upload and review emails, including user profile pictures.

## Architecture

The backend is split into independent Spring Boot microservices behind an API gateway, with a separate FastAPI service for machine learning.

```
                    ┌──────────────┐
                    │   Frontend   │  React
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐        ┌───────────────────┐
                    │ API Gateway  │◄──────►│ Discovery Service │
                    └──────┬───────┘        └───────────────────┘
        ┌──────────────────┼───────────────────┐
        │                  │                   │
┌───────▼───────┐  ┌───────▼────────┐  ┌───────▼───────┐
│ Auth Service  │  │ Scanner Service│─►│ Audit Service │
│ (users, JWT)  │  │ (scan, stats,  │  │ (audit logs)  │
└───────────────┘  │  feedback)     │  └───────────────┘
                   └───────┬────────┘
                           │
                   ┌───────▼────────┐
                   │   ML Service   │  FastAPI
                   └────────────────┘
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend services | Java, Spring Boot, Maven (with Maven Wrapper) |
| Security | Spring Security, JWT |
| ML service | Python, FastAPI, Uvicorn |
| Frontend | React |
| Search and analytics | Elasticsearch, Kibana |

## Project Structure

```
fraud-email-scanner-platform/
├── backend/
│   ├── api-gateway/        # Single entry point, request routing
│   ├── discovery-service/  # Service discovery / registry
│   ├── auth-service/       # Registration, login, JWT, roles
│   ├── scanner-service/    # Email scanning, rules, feedback, statistics
│   └── audit-service/      # Audit log storage and retrieval
├── frontend/               # React web interface
├── ml-service/             # FastAPI machine learning microservice
│   └── app/
│       ├── schema/         # Request / response models
│       └── services/       # Classification logic
├── uploads/
│   └── profile-pictures/   # User profile pictures
├── project-structure.txt
└── README.md
```

### Scanner service internals

| Package | Contents |
| --- | --- |
| `controller` | `EmailController`, `FeedbackController`, `StatisticsController` |
| `service` | `EmailScanService`, `EmailQueryService`, `RuleDetectionService`, `FeedbackService`, `StatisticsService` |
| `entity` | `EmailMessage`, `ScanResult`, `UserFeedback` |
| `enums` | `EmailStatus`, `RiskLevel`, `FeedbackLabel`, `AuditEventType` |
| `client` | `AuditServiceClient` (reports events to the audit service) |

## Prerequisites

- Java 17 or newer (check each service's `pom.xml` for the exact version)
- Maven (or use the bundled `mvnw` / `mvnw.cmd`)
- Python 3.9 or newer
- Node.js 18 or newer and npm
- A running database for the Spring services (see each service's `application.properties`)
- Elasticsearch and Kibana (optional, for indexing and dashboards)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/marwen-jammazi/fraud-email-scanner-platform.git
cd fraud-email-scanner-platform
```

### 2. Start the ML service

```bash
cd ml-service
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt   # if a requirements file is present
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The ML service is then available at `http://127.0.0.1:8000`. FastAPI also serves interactive docs at `http://127.0.0.1:8000/docs`.

### 3. Start the backend services

Start the services in this order, each in its own terminal:

```bash
# 1. Discovery service
cd backend/discovery-service
./mvnw spring-boot:run

# 2. Auth service
cd backend/auth-service
./mvnw spring-boot:run

# 3. Audit service
cd backend/audit-service
./mvnw spring-boot:run

# 4. Scanner service
cd backend/scanner-service
./mvnw spring-boot:run

# 5. API gateway
cd backend/api-gateway
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run`.

### 4. Start the frontend

```bash
cd frontend
npm install
npm start
```

## Services

| Service | Responsibility |
| --- | --- |
| **api-gateway** | Single entry point that routes client requests to the right service. |
| **discovery-service** | Lets services find each other without hard-coded addresses. |
| **auth-service** | Handles user registration, login, password hashing and JWT issuing, with user roles. |
| **scanner-service** | Core of the platform: accepts emails, applies rule-based detection, calls the ML service, stores scan results, collects feedback and produces statistics. |
| **audit-service** | Stores and serves audit logs for important events. |
| **ml-service** | Classifies emails with trained machine learning models. |

## Configuration

Each Spring Boot service is configured through its own `src/main/resources/application.properties`. Review these files before running to set:

- the service port
- database connection details
- the JWT secret and expiry (auth-service)
- the ML service URL (scanner-service)
- the audit service URL (scanner-service)
- the discovery service address (all services)

> **Security note:** never commit real secrets such as database passwords or JWT keys. Use environment variables or a local, git-ignored override file instead.

## Roadmap

- Docker Compose setup for one-command startup
- API documentation (OpenAPI / Swagger) for each service
- Automated tests and CI pipeline
- Expanded ML models and retraining from user feedback

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

## Author

**Marwen Jammazi**: [github.com/marwen-jammazi](https://github.com/marwen-jammazi)
