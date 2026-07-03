from typing import Dict, Any, List
from datetime import datetime

class EngagementAgent:
    def get_engagement_triggers(
        self,
        profile: Dict[str, Any],
        transactions: List[Dict[str, Any]],
        notifications: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        triggers = []
        
        # 1. Check for salary credit event
        salary_tx = next((t for t in transactions if t["category"] == "salary"), None)
        if salary_tx:
            # Check if SIP is already active
            if not profile.get("has_sip", False):
                triggers.append({
                    "id": "trigger_salary_sip",
                    "title": "Build Wealth on Salary Day",
                    "message": f"Your salary of ₹{salary_tx['amount']:,.0f} was credited recently. Consider setting up an SBI Mutual Fund SIP to invest ₹5,000 automatically every month.",
                    "type": "opportunity",
                    "action_text": "Setup SIP Now",
                    "action_type": "sip_open"
                })
            elif not profile.get("has_autopay", False):
                triggers.append({
                    "id": "trigger_salary_autopay",
                    "title": "Automate Your SIP Payments",
                    "message": "We detected you have active investments but haven't enabled AutoPay. Enable Standing Instructions to auto-invest on salary credit.",
                    "type": "utility",
                    "action_text": "Enable AutoPay",
                    "action_type": "autopay_setup"
                })
                
        # 2. Check for missing YONO app
        if not profile.get("has_yono", False):
            triggers.append({
                "id": "trigger_yono_promo",
                "title": "Earn 500 YONO Reward Points",
                "message": "Activate SBI YONO digital banking today and receive 500 reward points redeemable for shopping and travel vouchers.",
                "type": "reward",
                "action_text": "Activate YONO",
                "action_type": "yono_activation"
            })
            
        # 3. Check for Suspicious activity
        flagged_tx = [t for t in transactions if t["status"] == "flagged"]
        if flagged_tx:
            triggers.append({
                "id": "trigger_fraud_alert",
                "title": "Security Check Needed",
                "message": f"We blocked a suspicious payment attempt of ₹{flagged_tx[0]['amount']:,.0f}. Review your security settings and reset your internet banking password.",
                "type": "security",
                "action_text": "Review Threats",
                "action_type": "security_center"
            })
            
        # 4. Proactive FD Credit Card offer (if savings balance is high)
        if profile.get("savings_balance", 0) > 100000.0 and not profile.get("has_fd", False):
            triggers.append({
                "id": "trigger_mods_suggest",
                "title": "Convert Idle Savings to MODS FD",
                "message": f"You have ₹{profile['savings_balance']:,.0f} in savings earning 3%. Move it to SBI MODS to earn up to 7% with 100% instant liquidity.",
                "type": "investment",
                "action_text": "Open MODS FD",
                "action_type": "fd_open"
            })
            
        return triggers

engagement_agent = EngagementAgent()
