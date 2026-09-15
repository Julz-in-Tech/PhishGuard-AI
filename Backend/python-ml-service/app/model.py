import re
from typing import List, Dict, Any

class PhishingDetector:
    def __init__(self):
        # High-risk urgency and pressure keywords
        self.urgency_keywords = [
            r"urgent", r"immediately", r"suspended", r"action required",
            r"unauthorized", r"verify your account", r"locked", r"security alert",
            r"24 hours", r"terminate", r"failure to respond"
        ]
        
        # Commonly spoofed brands
        self.brand_keywords = [
            "paypal", "bankofamerica", "wellsfargo", "chase", "apple", 
            "microsoft", "netflix", "amazon", "google"
        ]

    def extract_features(self, sender: str, subject: str, body: str) -> Dict[str, Any]:
        text_content = f"{subject} {body}".lower()
        sender_content = sender.lower()
        
        flags: List[str] = []
        risk_score = 10  # Baseline safe score

        # 1. Check for Urgency Language
        urgency_hits = [kw for kw in self.urgency_keywords if re.search(kw, text_content)]
        if urgency_hits:
            risk_score += min(len(urgency_hits) * 15, 45)
            flags.append(f"High-urgency language detected ({len(urgency_hits)} pressure terms found)")

        # 2. Check for Brand Impersonation / Typosquatting
        for brand in self.brand_keywords:
            # Check if brand appears in sender or body with common typos (e.g., paypa1, micros0ft)
            typo_pattern = brand.replace('a', '[a1@]').replace('o', '[o0]').replace('l', '[l1|]')
            if re.search(typo_pattern, sender_content + " " + text_content) and brand not in sender_content:
                risk_score += 30
                flags.append(f"Potential brand typosquatting or spoofing targeting '{brand.capitalize()}'")
                break

        # 3. Check for Suspicious Link Indicators
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', text_content)
        if urls:
            for url in urls:
                # Flag IP addresses used as domains
                if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
                    risk_score += 25
                    flags.append("Raw IP address used in link instead of a domain name")
                # Flag suspicious subdomains or top-level domains
                if any(tld in url for tld in ['.xyz', '.top', '.work', '.click', '-security', '-update']):
                    risk_score += 20
                    flags.append("Link contains a high-risk TLD or suspicious domain keyword")

        # Cap score between 0 and 99
        risk_score = min(max(risk_score, 5), 99)

        # Determine Verdict & Badge Color
        if risk_score >= 70:
            verdict = "HIGH RISK"
            color = "var(--danger-red)"
        elif risk_score >= 40:
            verdict = "SUSPICIOUS"
            color = "var(--warning-orange)"
        else:
            verdict = "LOW RISK"
            color = "var(--safe-green)"
            if not flags:
                flags.append("No aggressive urgency or domain spoofing indicators found")

        return {
            "score": risk_score,
            "verdict": verdict,
            "badgeColor": color,
            "flags": flags
        }

detector = PhishingDetector()