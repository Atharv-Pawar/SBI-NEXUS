from typing import Dict, Any, List

class BankingRecommendationAgent:
    def get_recommendations(self, profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        recommendations = []
        
        # Priority 1: YONO App Activation
        if not profile.get("has_yono", False):
            recommendations.append({
                "id": "rec_yono",
                "product_name": "SBI YONO App",
                "tagline": "Accelerate Digital Banking",
                "description": "Unlock 250+ instant digital banking services, open paperless Fixed Deposits, check balances, and transfer funds without visiting a branch.",
                "benefit": "Branchless banking & exclusive lifestyle discounts.",
                "difficulty": "Easy (5 mins)",
                "action_type": "yono_activation",
                "category": "core"
            })
            
        # Priority 2: UPI Activation
        if not profile.get("has_upi", False):
            recommendations.append({
                "id": "rec_upi",
                "product_name": "SBI Pay (UPI Payments)",
                "tagline": "Instant QR Payments",
                "description": "Send money instantly to anyone, pay at shops using QR codes, and settle utility bills directly from your savings account.",
                "benefit": "Zero-fee instant peer-to-peer and merchant payments.",
                "difficulty": "Simple (2 mins)",
                "action_type": "upi_setup",
                "category": "core"
            })
            
        # Priority 3: AutoPay (Standing Instructions)
        if not profile.get("has_autopay", False):
            recommendations.append({
                "id": "rec_autopay",
                "product_name": "SBI AutoPay Mandate",
                "tagline": "Disciplined Automated Savings",
                "description": "Set up Standing Instructions to automate recurring payments like monthly SIPs, insurance premiums, or utility bills on salary day.",
                "benefit": "Avoid late fees and maintain strict investment discipline.",
                "difficulty": "Moderate (3 mins)",
                "action_type": "autopay_setup",
                "category": "automation"
            })
            
        # Priority 4: Mutual Fund SIP
        if not profile.get("has_sip", False):
            recommendations.append({
                "id": "rec_sip",
                "product_name": "SBI Mutual Fund SIP",
                "tagline": "Wealth Creation Engine",
                "description": "Invest small amounts monthly (starting ₹500) into mutual funds to counter inflation and achieve long-term financial milestones.",
                "benefit": "Compounding growth with rupee cost averaging.",
                "difficulty": "Easy with YONO (4 mins)",
                "action_type": "sip_open",
                "category": "investment"
            })
            
        # Priority 5: SBI Credit Card (SBI Card Elite/SimplyCLICK)
        if not profile.get("has_credit_card", False):
            recommendations.append({
                "id": "rec_card",
                "product_name": "SBI SimplyCLICK Credit Card",
                "tagline": "Reward Point Booster",
                "description": "Earn 10X reward points on online partners like Amazon, Flipkart, Cleartrip, and BookMyShow. Perfect for online spenders.",
                "benefit": "₹500 welcome voucher and 1.25% savings back on all online shopping.",
                "difficulty": "Instant Approval in YONO (5 mins)",
                "action_type": "card_apply",
                "category": "spending"
            })
            
        # Priority 6: Fixed Deposit (FD) / MODS
        if not profile.get("has_fd", False):
            recommendations.append({
                "id": "rec_fd",
                "product_name": "SBI Fixed Deposit (MODS)",
                "tagline": "High Returns with Liquidity",
                "description": "Park surplus funds in a Multi Option Deposit to earn up to 7% interest while keeping funds fully withdrawable in emergencies.",
                "benefit": "Higher interest than standard savings accounts.",
                "difficulty": "Instant (1 min)",
                "action_type": "fd_open",
                "category": "saving"
            })
            
        return recommendations

recommend_agent = BankingRecommendationAgent()
