# Fraud Email Scanner Platform

## Overview
The Fraud Email Scanner Platform is a cybersecurity and machine learning project designed to detect and analyze fraudulent or suspicious emails. It combines backend services, a frontend interface, and an ML microservice to provide real-time scanning and reporting.

## Features
- **[Email scanning](ca://s?q=Explain_email_scanning_feature)**: Detects phishing, spam, and fraud attempts.
- **[Machine learning service](ca://s?q=Detail_ml_service_in_project)**: Classifies emails using trained models.
- **[Elasticsearch integration](ca://s?q=Explain_Elasticsearch_integration)**: Stores and indexes scanned results for fast search.
- **[Kibana dashboards](ca://s?q=Describe_Kibana_dashboards)**: Visualizes fraud detection statistics and trends.
- **[Frontend UI](ca://s?q=Detail_frontend_UI_features)**: User-friendly interface for uploading and reviewing emails.
- **[Backup system](ca://s?q=Explain_backup_system_for_scans)**: Automatically saves scanned emails and results.

## Project Structure
- `backend/` – Core API and services
- `frontend/` – Web interface built with React
- `ml-service/` – Machine learning microservice
- `src/` – Shared utilities and configs
- `uploads/` – Temporary storage for email files
- `backup-*` – Backup folders for scans and results

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/vigilante171/fraud-email-scanner-platform.git
