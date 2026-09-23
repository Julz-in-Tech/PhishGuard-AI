import re

class PhishingDetector:
    def extract_features(self, sender: str = "", subject: str = "", body: str = ""):
        score = 0
        flags = []

        text = f"{subject} {body}".lower()
        sender_lower = (sender or "").lower()

        # Rule 1: Urgent or coercive language
        urgent_keywords = [
            "urgent", "immediately", "verify account", "action required",
            "password reset", "account suspended", "unauthorized login", "billing issue"
        ]
        found_urgency = [kw for kw in urgent_keywords if kw in text]
        if found_urgency:
            score += 35
            flags.append(f"Urgent language detected: {', '.join(found_urgency[:2])}")

        # Rule 2: Suspicious or unsecure links
        if "http://" in text or "bit.ly" in text or "tinyurl.com" in text:
            score += 40
            flags.append("Contains unsecure or shortened URLs (HTTP / shortlink)")

        # Rule 3: Suspicious link text vs domain mismatch indicators
        link_suspicious_terms = ["login-verify", "update-security", "secure-bank", "account-update"]
        if any(term in text for term in link_suspicious_terms):
            score += 35
            flags.append("Contains highly suspicious authentication links")

        # Rule 4: Sender domain spoofing checks (e.g., free email domains pretending to be official)
        suspicious_sender_patterns = ["support", "security", "admin", "service", "verify"]
        free_domains = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"]
        if any(pattern in sender_lower for pattern in suspicious_sender_patterns) and any(sender_lower.endswith(domain) for domain in free_domains):
            score += 30
            flags.append("Official-sounding sender address using a free public email provider")

        # Cap score at 100 max
        score = min(score, 100)

        # Determine Verdict, Risk Level, and Badge Color
        if score >= 70:
            verdict = "HIGH RISK - PHISHING DETECTED"
            badge_color = "#d93025"  # Red
            risk_level = "HIGH"
        elif score >= 30:
            verdict = "MEDIUM RISK - SUSPICIOUS EMAIL"
            badge_color = "#f2994a"  # Orange / Yellow
            risk_level = "MEDIUM"
        else:
            verdict = "LOW RISK - SAFE EMAIL"
            badge_color = "#1e8e3e"  # Green
            risk_level = "LOW"

        return {
            "score": score,
            "verdict": verdict,
            "badgeColor": badge_color,
            "riskLevel": risk_level,
            "flags": flags if flags else ["No threat indicators found"]
        }

detector = PhishingDetector()