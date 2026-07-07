# AI-Driven Public Grievance and Resolution Time Tracking System

An AI-powered grievance management system that automates complaint classification, priority prediction, and resolution time estimation using Machine Learning. The system enables citizens to submit grievances online while providing administrators with intelligent dashboards for efficient complaint management and SLA tracking.

---

## Project Overview

The AI-Driven Public Grievance and Resolution Time Tracking System is designed to modernize the traditional grievance handling process through Artificial Intelligence and automation.

Users can submit complaints digitally, monitor their status in real time, and receive updates throughout the complaint lifecycle. The system automatically analyzes complaint text using Machine Learning to predict the responsible department, complaint priority, and estimated resolution time, helping organizations respond faster and more efficiently.

The application follows a multi-tier architecture consisting of:

- React.js Frontend
- Spring Boot REST API
- Python AI Microservice
- MySQL Database

---

## Features

### User Features

- User Registration
- Secure Login using JWT Authentication
- Submit Complaints
- View Complaint History
- Track Complaint Status
- View AI Predicted Department
- View AI Predicted Priority
- View Estimated Resolution Time

### Admin Features

- View All Complaints
- Update Complaint Status
- Manage Complaint Priority
- Department-wise Complaint Monitoring
- Dashboard Analytics
- SLA Tracking
- Overdue Complaint Monitoring

### AI Features

- Automatic Complaint Classification
- Department Prediction
- Priority Prediction
- Resolution Time Prediction
- Confidence Score Generation
- NLP-based Complaint Processing

---

## Technology Stack

### Frontend

- React.js
- JavaScript
- Axios
- Bootstrap
- React Router

### Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- REST APIs
- JWT Authentication
- MySQL

### AI Microservice

- Python
- FastAPI
- Scikit-learn
- Pandas
- NumPy
- Logistic Regression
- NLP

### Database

- MySQL

### Tools

- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git
- GitHub

---

## Project Architecture

```
                 +--------------------+
                 |   React Frontend   |
                 +--------------------+
                          |
                          |
                     REST API
                          |
                          |
                 +--------------------+
                 | Spring Boot Backend|
                 +--------------------+
                          |
          -------------------------------
          |                             |
          |                             |
      MySQL Database            AI Microservice
                                      |
                                      |
                             Machine Learning Model
```

---

# Folder Structure

```
AI-Grievance-System
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── application.properties
│
├── ai-service/
│   ├── app.py
│   ├── model.pkl
│   ├── requirements.txt
│   └── training.ipynb
│
└── README.md
```

---

# Prerequisites

Before running the project, install the following software:

- Java 17 or above
- Node.js (v18 or later)
- Python 3.10 or above
- MySQL Server
- Maven
- Git
- Visual Studio Code or IntelliJ IDEA

---

# Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/AI-Driven-Public-Grievance-And-Resolution-Time-Tracking-System.git
```

Move into the project directory:

```bash
cd AI-Driven-Public-Grievance-And-Resolution-Time-Tracking-System
```

---

# Backend Setup (Spring Boot)

### Step 1

Open the backend folder in IntelliJ IDEA or Visual Studio Code.

### Step 2

Configure the MySQL database inside:

```
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/grievance_system
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

### Step 3

Install Maven dependencies

```bash
mvn clean install
```

### Step 4

Run the Spring Boot application

```bash
mvn spring-boot:run
```

or run

```
GrievanceSystemApplication.java
```

from IntelliJ IDEA.

Backend runs on:

```
http://localhost:8082
```

---

# AI Microservice Setup

Navigate to the AI service folder.

```bash
cd ai-service
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run the AI server.

```bash
python app.py
```

AI service runs on

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the React application.

```bash
npm start
```

or (if using Vite)

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

or

```
http://localhost:3000
```

depending on your React configuration.

---

# Running the Complete Project

Start the services in the following order:

1. MySQL Server
2. AI Microservice
3. Spring Boot Backend
4. React Frontend

Open your browser and visit:

```
http://localhost:5173
```

or

```
http://localhost:3000
```

---

# API Endpoints

| Method | Endpoint | Description |
|----------|--------------------------|----------------|
| POST | /auth/register | Register User |
| POST | /auth/login | Login User |
| POST | /complaints | Submit Complaint |
| GET | /complaints | View Complaints |
| GET | /complaints/{id} | Complaint Details |
| GET | /complaints/{id}/history | Complaint History |
| PUT | /complaints/{id}/admin-update | Update Complaint |
| GET | /complaints/admin/dashboard | Dashboard Statistics |

---

# Security

- JWT Authentication
- Role-Based Authorization
- Spring Security
- Password Encryption
- Protected REST APIs

---

# Future Enhancements

- Email Notifications
- SMS Alerts
- Voice Complaint Submission
- File/Image Upload
- AI Chatbot Support
- Mobile Application
- Multi-language Support
- Real-time Notifications
- Cloud Deployment
- Analytics Dashboard

---

# Author

**Induja J**

- GitHub: https://github.com/Induja435
- LinkedIn: https://www.linkedin.com/in/induja-joseph

---

# License

This project is developed for educational and research purposes.
