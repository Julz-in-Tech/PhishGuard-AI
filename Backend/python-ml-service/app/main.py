from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.model import detector

app = FastAPI(
    title="PhishGuard AI Inference API",
    description="Microservice for AI-assisted phishing threat detection",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    sender: Optional[str] = ""
    subject: Optional[str] = ""
    body: Optional[str] = ""

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "PhishGuard-AI ML Engine"}

@app.post("/api/v1/analyze")
def analyze_threat(payload: AnalyzeRequest):
    result = detector.extract_features(
        sender=payload.sender,
        subject=payload.subject,
        body=payload.body
    )
    return result