from typing import Dict, Any, List

class FraudAwarenessAgent:
    def check_threats(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Scan transactions for flagged entries and return warning metrics
        """
        flagged_tx = [t for t in transactions if t["status"] == "flagged"]
        
        has_active_threat = len(flagged_tx) > 0
        threat_level = "High" if has_active_threat else "Low"
        
        alerts = []
        for tx in flagged_tx:
            alerts.append({
                "tx_id": tx["id"],
                "description": tx["description"],
                "amount": tx["amount"],
                "date": tx["date"],
                "threat_type": "Unauthorized POS Attempt",
                "recommended_action": "Freeze Credit Card / Block Internet Banking immediately."
            })
            
        return {
            "threat_level": threat_level,
            "has_active_threat": has_active_threat,
            "fraud_alerts": alerts,
            "security_score_percent": 90 if not has_active_threat else 65,
            "tips": [
                "SBI will never call to ask for your MPIN, UPI PIN, Card Expiry, or OTP.",
                "Review active third-party UPI mandates regularly inside the UPI settings.",
                "Always check for the green padlock icon on Netbanking URL (onlinesbi.sbi)."
            ]
        }
        
    def get_security_guidelines(self) -> List[Dict[str, str]]:
        return [
            {
                "title": "Phishing & Fake SMS Alerts",
                "description": "Watch out for text messages promising rewards, loan approvals, or pan-card updates via external links. Do not click links ending in random domains."
            },
            {
                "title": "UPI Collect Request Fraud",
                "description": "Beware! Receiving money never requires entering your UPI PIN. If someone asks you to type your PIN, you are SENDING money, not receiving it."
            },
            {
                "title": "Screen Sharing Scam",
                "description": "Never download screen-sharing applications (like AnyDesk, TeamViewer) on calls from individuals claiming to be SBI Support."
            }
        ]

fraud_agent = FraudAwarenessAgent()
