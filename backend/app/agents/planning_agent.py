from typing import Dict, Any, List

class FinancialPlanningAgent:
    def create_roadmap(self, profile: Dict[str, Any], goals: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        income = profile.get("monthly_income", 75000.0)
        savings_balance = profile.get("savings_balance", 150000.0)
        
        roadmaps = []
        
        for goal in goals:
            target = goal.get("target_amount", 100000.0)
            saved = goal.get("current_savings", 0.0)
            contrib = goal.get("monthly_contribution", 5000.0)
            category = goal.get("category", "investment")
            
            shortfall = target - saved
            if shortfall <= 0:
                timeline_months = 0
                timeline_str = "Goal Achieved!"
            elif contrib <= 0:
                timeline_months = -1
                timeline_str = "Indefinite (increase monthly contributions)"
            else:
                # Basic linear projection (no interest for simple roadmap, or basic savings rate)
                timeline_months = int(shortfall / contrib)
                years = timeline_months // 12
                months = timeline_months % 12
                if years > 0:
                    timeline_str = f"{years} years, {months} months"
                else:
                    timeline_str = f"{months} months"
                    
            # Match product recommendations based on category
            sbi_recommendations = []
            if category == "emergency":
                sbi_recommendations = [
                    {
                        "name": "SBI MODS (Multi Option Deposit Scheme)",
                        "description": "Earn Fixed Deposit interest rates on savings while keeping funds 100% liquid. Linked directly to your savings account.",
                        "action": "fd_open"
                    },
                    {
                        "name": "SBI Recurring Deposit (RD)",
                        "description": "Start an automated monthly RD matching your contribution to lock in safe, guaranteed returns.",
                        "action": "fd_open"
                    }
                ]
            elif category == "house":
                sbi_recommendations = [
                    {
                        "name": "SBI Mutual Fund Equity Hybrid Fund SIP",
                        "description": "Accelerate downpayment growth by routing your monthly allocation to mutual funds with historical 11-13% annual returns.",
                        "action": "sip_open"
                    },
                    {
                        "name": "SBI Home Loan Eligibility Check",
                        "description": "Bridge the purchasing shortfall with India's lowest interest home loans, offering zero processing fees for YONO users.",
                        "action": "loan_apply"
                    }
                ]
            elif category == "retirement":
                sbi_recommendations = [
                    {
                        "name": "SBI Pension Funds / NPS (National Pension System)",
                        "description": "Secure retirement with Tier-I NPS. Offers additional tax deduction under Section 80CCD(1B).",
                        "action": "nps_open"
                    },
                    {
                        "name": "SBI Magnum Children's Benefit Fund",
                        "description": "Long-term solution for retirement or legacy planning with diversified equity and debt exposure.",
                        "action": "sip_open"
                    }
                ]
            else:
                sbi_recommendations = [
                    {
                        "name": "SBI Bluechip Mutual Fund SIP",
                        "description": "Consistent wealth builder investing in top Indian companies, ideal for long-term targets.",
                        "action": "sip_open"
                    }
                ]
                
            roadmaps.append({
                "goal_id": goal.get("id"),
                "title": goal.get("title"),
                "target_amount": target,
                "current_savings": saved,
                "monthly_contribution": contrib,
                "shortfall": max(0.0, shortfall),
                "timeline_str": timeline_str,
                "timeline_months": timeline_months,
                "suggested_sbi_products": sbi_recommendations
            })
            
        return roadmaps

planning_agent = FinancialPlanningAgent()
