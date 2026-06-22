# 🛡️ AI-Powered Subsidy Fraud Detection System

An intelligent web-based platform designed to identify and prevent fraudulent subsidy claims across multiple government welfare schemes using Machine Learning, Aadhaar verification, and risk-based analysis.

---

## 📌 Overview

Government subsidy programs often face challenges such as duplicate applications, fake identities, income misreporting, and misuse of benefits.

This project leverages Machine Learning and rule-based validation to automatically detect suspicious applications and assist authorities in making informed decisions.

---

## ✨ Key Features

### 👤 Citizen Portal
- Aadhaar-based Login & Verification
- OTP Authentication
- Apply for Government Schemes
- Track Application Status
- View Approved/Rejected Applications

### 🛡️ Admin Dashboard
- View All Applications
- Fraud Risk Monitoring
- Flagged Application Detection
- Approve / Reject / Manual Verification
- Real-Time Statistics Dashboard

### 🤖 AI Fraud Detection
- Detects suspicious subsidy claims
- Duplicate Aadhaar detection
- Income inconsistency checks
- Previous application analysis
- Fraud risk scoring

### 📊 Analytics Dashboard
- Total Applications
- Approved Applications
- Rejected Applications
- Fraudulent Applications
- Scheme-wise Insights
- Interactive Charts & Reports

---

## 🧠 Machine Learning Model

The fraud detection engine analyzes applicant data and predicts whether an application is potentially fraudulent.

### Features Used

- Applicant Age
- Annual Income
- Subsidy Amount
- Previous Applications
- Duplicate Aadhaar Indicator
- Scheme Type

### Output

- Fraud Probability
- Risk Category
  - Low Risk
  - Medium Risk
  - High Risk

---

## 🏗️ System Architecture

```text
Citizen Portal
       │
       ▼
Application Submission
       │
       ▼
Backend Validation
       │
       ▼
ML Fraud Detection Engine
       │
       ▼
Risk Analysis
       │
       ▼
Admin Dashboard
```

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Machine Learning
- Python
- Scikit-Learn
- Pandas
- NumPy
- Joblib

### Authentication
- JWT
- OTP Verification

---

## 📂 Project Structure

```text
subsidy-fraud-detection/
│
├── frontend/
│   ├── src/
│   └── public/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
│
├── ml-service/
│   ├── app.py
│   ├── model.pkl
│   └── dataset.csv
│
├── database/
│
└── README.md
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone <repository-url>
cd subsidy-fraud-detection
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install ML Dependencies

```bash
pip install -r requirements.txt
```

---

## ▶️ Run Application

### Backend

```bash
npm start
```

### Frontend

```bash
npm run dev
```

### ML Service

```bash
python app.py
```

---

## 📈 Future Enhancements

- Real Aadhaar XML Verification
- Explainable AI for Fraud Reasoning
- Blockchain-Based Record Validation
- Geo-Location Fraud Analysis
- Multi-Scheme Fraud Correlation
- Automated Investigation Reports

---

## 🎯 Impact

The system helps government agencies:

- Reduce subsidy leakage
- Detect fraudulent beneficiaries
- Improve transparency
- Speed up verification processes
- Ensure subsidies reach deserving citizens

---

## 👩‍💻 Author

**Charul Thakur**

B.Tech CSE | AI & Full Stack Development
