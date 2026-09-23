🛡️ PhishGuard AI - Real-Time Security SentinelAn enterprise-grade, multi-tier phishing detection engine powered by Java Spring Boot, FastAPI, and a seamless Chrome Extension DOM integration for Gmail.🏗️ System Topology & Data Flow┌─────────────────────────────────────────────────────────────┐
│ 📩 Gmail DOM (Active Browser Tab)                           │
│ Extension Content Script observes & extracts email metadata  │
└──────────────────────────────┬──────────────────────────────┘
│ ⚡ Chrome Extension Messaging
▼
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ Background Service Worker (background.js)               │
│ Dispatches cross-origin requests to local gateway API       │
└──────────────────────────────┬──────────────────────────────┘
│ 🚀 HTTP POST /api/v1/detect (Port 8080)
▼
┌─────────────────────────────────────────────────────────────┐
│ ☕ Java Spring Boot API Gateway (phishguard-java-gateway)    │
│ - Orchestrates network traffic & DTO transformations        │
│ - Exposes REST endpoints on port 8080                       │
└──────────────────────────────┬──────────────────────────────┘
│ 🐍 Internal REST Call (Port 8000)
▼
┌─────────────────────────────────────────────────────────────┐
│ 🤖 Python ML Microservice (phishguard-python-ml)             │
│ - Runs FastAPI & natural language evaluation logic          │
│ - Computes risk scores & generates threat indicator flags   │
└─────────────────────────────────────────────────────────────┘
✨ Features⚡ Live DOM Inspection: Dynamically captures email content, sender details, and subject lines in real time inside Gmail.🛡️ Threat Overlay Badge: Injects custom risk assessment banners directly over email headers.🧩 Decoupled Architecture: Asynchronous orchestration via Java Spring Boot gateway connected to a Python microservice.🐳 Containerized Setup: Fully configured multi-container execution using docker-compose.🚀 Tech StackTierTechnologyPurposeML EnginePython 3.10, FastAPI, Scikit-LearnNatural language processing & threat scoringAPI GatewayJava 17, Spring Boot 3, LombokMicroservice orchestration & REST routingClient InterfaceJavaScript ES6+, Manifest V3Gmail DOM mutation observer & UI injectionDevOps & MeshDocker, Docker ComposeIsolated container runtime & local networking📂 Repository StructurePhishGuard-AI/
├── 📁 Backend/
│   ├── 📁 java-service/         # Spring Boot Gateway (Port 8080)
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   └── 📁 python-ml-service/    # FastAPI ML Engine (Port 8000)
│       ├── app/
│       ├── requirements.txt
│       └── Dockerfile
├── 📁 Extension/                 # Chrome Manifest V3 Extension
│   ├── manifest.json
│   ├── background.js
│   └── content.js
├── 📁 Frontend/                  # Dashboard Interface
│   └── index.html
└── 📄 docker-compose.yml
🛠️ Local Quickstart GuidePrerequisites🐳 Docker Desktop installed and running🌐 Google Chrome browser1️⃣ Launch Backend MicroservicesRun docker-compose from the project root directory:docker-compose up --build
Service Health Targets:☕ Java API Gateway: http://localhost:8080/api/v1/detect🐍 Python ML Service: http://localhost:8000/api/v1/analyze2️⃣ Load the Chrome ExtensionOpen Chrome and navigate to chrome://extensions/.Toggle on Developer mode in the top-right corner.Click Load unpacked in the top-left menu.Select the Extension/ directory from this repository.Open Gmail and click any email to trigger automatic threat analysis!🔌 API Endpoint SpecificationPOST /api/v1/detect📥 Request Payload:{
"sender": "security@account-verify-update.com",
"subject": "Urgent Action Required: Account Suspended",
"body": "Your account has been restricted. Click here immediately to update your password."
}
📤 Response Payload:{
"score": 85,
"verdict": "POSSIBLE_PHISHING",
"badgeColor": "#ff0055",
"flags": [
"High-risk subject keywords detected",
"Suspicious link patterns in body"
]
}


WTC-37R65HKM
WTC-JQK9THV9

