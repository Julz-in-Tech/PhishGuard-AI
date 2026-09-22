# PhishGuard-

WTC-37R65HKM
WTC-JQK9THV9

# PhishGuard AI 🛡️

> **Multi-Language AI Phishing Detection System & Threat Analysis Dashboard**

PhishGuard AI is an end-to-end security analysis system that combines **Java**, **Python ML models**, and a clean **HTML/CSS** dashboard to detect email and URL phishing attempts in real time.

The application utilizes Java for high-speed feature parsing and web orchestration, Python (`scikit-learn` / `FastAPI`) for machine learning inference and text classification, and an intuitive HTML/CSS interface for threat visualization.

---

## Technical Stack & Architecture

```
  ┌─────────────────────────────────────────────────────────┐
  │                    Frontend Layer                       │
  │                  (HTML5 / CSS3 / JS)                    │
  │     • Interactive Dashboard & Real-Time Alert Cards     │
  └────────────────────────────┬────────────────────────────┘
                               │ HTTP / JSON
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                   Java Backend Engine                   │
  │              (Spring Boot / Java 17 Service)            │
  │     • Payload Parsing & Validation                      │
  │     • URL Lexical & Header Feature Extraction           │
  └────────────────────────────┬────────────────────────────┘
                               │ REST / Microservice Call
                               ▼
  ┌─────────────────────────────────────────────────────────┐
  │                 Python AI/ML Pipeline                   │
  │                 (FastAPI + scikit-learn)                │
  │     • NLP Urgency Classifier (TF-IDF / Logistic Reg.)   │
  │     • Hybrid Risk Scoring & Explainability Engine       │
  └─────────────────────────────────────────────────────────┘

```

| Component | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | **HTML5 & CSS3** | Custom responsive dashboard to paste suspicious emails/URLs and view color-coded risk reports. |
| **Core Service** | **Java (Spring Boot / 17+)** | Handles web routing, URL parsing, network WHOIS lookups, and orchestration. |
| **AI / ML Service** | **Python 3.10+** | Runs feature vector calculations, NLP text classification, and risk scoring logic via FastAPI. |
| **Machine Learning** | `scikit-learn`, `pandas` | TF-IDF text vectorization, Random Forest / Logistic Regression classifiers. |

---

## Key Features

* **Dual-Language Microservice Architecture:** Leverages Java for scalable backend logic and Python for ML model execution.
* **Lexical & Metadata Analysis:** Extracts domain entropy, suspicious TLDs, IP substitutions, and WHOIS registration age.
* **Linguistic Urgency Detection:** Uses Python NLP models to score coercion and high-stress wording in email text.
* **Visual Threat Dashboard:** Pure HTML5/CSS3 frontend displaying real-time risk progress bars, flag triggers, and alert cards.

---

## Datasets Used

1. **PhishTank API & OpenPhish:** Malicious URL feeds for feature extraction training.
2. **Nazario Phishing Email Corpus:** Phishing email text and raw header samples.
3. **Enron Email Dataset:** Legitimate corporate email baseline samples (Ham).

---

## Quick Start

### 1. Prerequisites

* **Java Development Kit (JDK 17+)**
* **Python 3.10+**
* **Maven** (for Java building)

### 2. Clone Repository & Setup Python ML Service

```bash
git clone https://github.com/your-username/PhishGuard-AI.git
cd PhishGuard-AI/python-ml-service

# Setup Python Virtual Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run Python ML API Endpoint
uvicorn main:app --port 8000 --reload

```

### 3. Build & Run Java Backend Service

Open a new terminal window:

```bash
cd PhishGuard-AI/java-backend

# Build & Run Spring Boot App
mvn clean install
mvn spring-boot:run

```

### 4. Access Frontend Interface

Navigate to `http://localhost:8080` in your web browser to open the **HTML5/CSS3 PhishGuard Dashboard**.

---

## Example API Request & Response

**Endpoint:** `POST /api/v1/detect`

**Request Body (Sent to Java Controller):**

```json
{
  "sender": "service@paypa1-security.com",
  "subject": "Action Required: Account Suspended",
  "body": "Your account has been locked. Click http://paypa1-security.com/login to restore access."
}

```

**Response Output (Rendered on HTML Interface):**

```json
{
  "status": "SUCCESS",
  "risk_score": 92.5,
  "threat_level": "HIGH_RISK",
  "detected_flags": [
    "Domain mismatch detected ('paypa1' target brand 'PayPal')",
    "Suspicious link domain registration age < 14 days",
    "High linguistic urgency metric (88%)"
  ]
}

```

---

## Project Structure

```
PhishGuard-AI/
├── java-backend/              # Java Core Engine
│   ├── src/main/java/com/phishguard/
│   │   ├── controllers/       # REST Endpoints
│   │   ├── services/          # Feature Extractor & ML Bridge
│   │   └── models/            # Request/Response POJOs
│   └── pom.xml
├── python-ml-service/         # Python AI Inference Engine
│   ├── models/                # Trained .pkl models
│   ├── main.py                # FastAPI Service Entry
│   └── requirements.txt
├── web-frontend/              # HTML & CSS Dashboard
│   ├── index.html             # Dashboard View
│   ├── css/
│   │   └── styles.css         # Custom Dashboard Styling
│   └── js/
│       └── app.js             # API Fetch Logic
└── README.md

```


## License

Distributed under the MIT License. See `LICENSE` for details.


