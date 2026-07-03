from typing import Dict, Any, List
import re
from app.database import db
from app.agents.customer_agent import customer_agent
from app.agents.planning_agent import planning_agent
from app.agents.recommend_agent import recommend_agent
from app.agents.adoption_agent import adoption_agent
from app.agents.fraud_agent import fraud_agent
from app.agents.digital_twin import digital_twin_agent

class AIOrchestrator:
    def process_message(self, message: str) -> Dict[str, Any]:
        """
        Main entry point for AI Chat. Routes queries, logs agent collaboration logs,
        and generates responses.
        """
        msg_lower = message.lower()
        
        # Load latest data from db
        profile = db.get_profile()
        transactions = db.get_transactions()
        goals = db.get_goals()
        
        agent_logs = []
        response_text = ""
        suggested_actions = []
        action_route = None
        
        # Step 1: Customer Understanding Agent always does a baseline check
        agent_logs.append({
            "agent": "Customer Understanding Agent",
            "action": "Analyzing customer profile & transaction patterns",
            "result": f"Profile evaluated for {profile['name']}. Savings balance ₹{profile['savings_balance']:,.2f}."
        })
        profile_analysis = customer_agent.analyze_profile(profile, transactions)
        
        # Intent Routing
        # 1. Onboarding & Digital Adoption Route
        if any(keyword in msg_lower for keyword in ["yono", "upi", "autopay", "onboard", "activate", "setup", "register"]):
            agent_logs.append({
                "agent": "Digital Adoption Agent",
                "action": "Retrieving digital onboarding instructions",
                "result": "Matched interactive wizard flow"
            })
            
            product_type = "yono_activation"
            if "upi" in msg_lower:
                product_type = "upi_setup"
            elif "autopay" in msg_lower:
                product_type = "autopay_setup"
                
            guide = adoption_agent.get_onboarding_guide(product_type)
            response_text = f"I see you want to activate digital services! I have loaded our interactive **{guide['title']}** in your digital companion portal. Follow the steps on your screen to complete activation. \n\nHere is Step 1: *{guide['steps'][0]['instruction']}*"
            action_route = {
                "route": "onboarding",
                "product_type": product_type
            }
            suggested_actions = [{"text": f"Start {guide['product']} Guide", "type": "onboard", "value": product_type}]
            
        # 2. Digital Twin Simulator Route
        elif any(keyword in msg_lower for keyword in ["simulate", "twin", "what if", "spending", "savings grow", "discretionary"]):
            agent_logs.append({
                "agent": "Financial Digital Twin Agent",
                "action": "Initiating financial modeling scenario",
                "result": "Rendering 10-year cash flow projections"
            })
            
            # Simple extraction of numbers from message (e.g. "what if I increase SIP by 5000")
            sip_val = 0.0
            spend_cut = 10.0  # default 10% cut
            
            sip_match = re.search(r'(?:sip|invest|increase|add)\s*(?:by|of)?\s*(?:rs\.?|₹)?\s*(\d+)', msg_lower)
            if sip_match:
                sip_val = float(sip_match.group(1))
                
            cut_match = re.search(r'(?:cut|reduce|reduce spending|spending cut)\s*(?:by)?\s*(\d+)\s*%', msg_lower)
            if cut_match:
                spend_cut = float(cut_match.group(1))
                
            simulation = digital_twin_agent.simulate(
                profile=profile,
                goals=goals,
                sip_increase=sip_val,
                spending_cut_percent=spend_cut
            )
            
            summary = simulation["summary"]
            response_text = (
                f"**Financial Digital Twin Simulation Results:**\n\n"
                f"- **Monthly savings baseline:** ₹{summary['monthly_savings_baseline']:,.0f}\n"
                f"- **Monthly savings simulated:** ₹{summary['monthly_savings_simulated']:,.0f}\n"
                f"- **Monthly SIP simulated:** ₹{summary['monthly_sip_simulated']:,.0f} (increased by ₹{sip_val:,.0f})\n\n"
                f"**10-Year Projections:**\n"
                f"- **Baseline Wealth:** ₹{summary['baseline_wealth_10yr']:,.0f}\n"
                f"- **Simulated Wealth:** ₹{summary['simulated_wealth_10yr']:,.0f}\n"
                f"- **Net Wealth Gain:** 🎉 **₹{summary['wealth_difference_10yr']:,.0f} extra** over 10 years by reducing discretionary spending by {spend_cut}%!\n\n"
                f"Your target down payment is achieved in **{summary['simulated_house_met_years']} years** instead of {summary['baseline_house_met_years']} years."
            )
            action_route = {
                "route": "digital_twin",
                "params": {"sip_increase": sip_val, "spending_cut": spend_cut}
            }
            suggested_actions = [
                {"text": "Apply Twin Settings", "type": "apply_twin", "value": {"sip_increase": sip_val, "spending_cut": spend_cut}},
                {"text": "Open Mutual Fund SIP", "type": "onboard", "value": "sip_open"}
            ]

        # 3. Fraud and Security alerts Route
        elif any(keyword in msg_lower for keyword in ["fraud", "scam", "suspicious", "hack", "safe", "threat", "card blocked"]):
            agent_logs.append({
                "agent": "Risk & Fraud Awareness Agent",
                "action": "Scanning recent transaction security flags",
                "result": "Flagged unauthorized transaction found"
            })
            
            threats = fraud_agent.check_threats(transactions)
            if threats["has_active_threat"]:
                response_text = (
                    f"⚠️ **URGENT SECURITY ALERT:**\n\n"
                    f"Our Fraud Agent detected a suspicious overseas POS transaction attempt of **₹{threats['fraud_alerts'][0]['amount']:,.0f}**. "
                    f"We have blocked the transaction to secure your account.\n\n"
                    f"**Recommended Action:** {threats['fraud_alerts'][0]['recommended_action']}\n\n"
                    f"Please review the security panel on your dashboard to lock/unlock your card instantly."
                )
            else:
                response_text = "Your account transactions are secure. No unauthorized or flagged attempts detected. Ensure you keep your internet banking password updated."
                
            action_route = {
                "route": "security"
            }
            suggested_actions = [
                {"text": "Go to Security Guard", "type": "navigate", "value": "security_center"},
                {"text": "Block Credit Card", "type": "onboard", "value": "block_card"}
            ]

        # 4. Goals & Financial Planning Route
        elif any(keyword in msg_lower for keyword in ["goal", "plan", "retirement", "house", "save for", "emergency"]):
            agent_logs.append({
                "agent": "Financial Planning Agent",
                "action": "Calculating goal attainment roadmaps",
                "result": f"Generated roadmaps for {len(goals)} active goals"
            })
            
            roadmaps = planning_agent.create_roadmap(profile, goals)
            response_text = "Here is your customized **SBI Goal Roadmap**:\n\n"
            
            for rm in roadmaps:
                response_text += (
                    f"🎯 **{rm['title']}**\n"
                    f"  - Target: ₹{rm['target_amount']:,.0f} | Current Savings: ₹{rm['current_savings']:,.0f}\n"
                    f"  - Est. Timeline: **{rm['timeline_str']}** (at ₹{rm['monthly_contribution']:,.0f}/mo)\n"
                    f"  - Recommendation: Use **{rm['suggested_sbi_products'][0]['name']}** ({rm['suggested_sbi_products'][0]['description']})\n\n"
                )
            suggested_actions = [{"text": "Adjust Goals", "type": "navigate", "value": "goals_panel"}]

        # 5. Generic Recommendations & Greetings
        else:
            agent_logs.append({
                "agent": "Banking Recommendation Agent",
                "action": "Mapping profile gaps to SBI digital services",
                "result": "Identified pending YONO and UPI setups"
            })
            
            recs = recommend_agent.get_recommendations(profile)
            
            if recs:
                top_rec = recs[0]
                response_text = (
                    f"Hello {profile['name']}! I'm SBI NEXUS, your Agentic AI Financial Companion. \n\n"
                    f"Looking at your profile, your financial health is rated **{profile_analysis['health_rating']}** with a monthly surplus of ₹{profile_analysis['monthly_surplus']:,.0f}.\n\n"
                    f"To accelerate your digital adoption and simplify your life, I highly recommend activating **{top_rec['product_name']}** ({top_rec['description']}). "
                    f"It takes under {top_rec['difficulty']} to set up."
                )
                suggested_actions = [
                    {"text": f"Activate {top_rec['product_name']}", "type": "onboard", "value": top_rec["action_type"]},
                    {"text": "Explore All Recommendations", "type": "navigate", "value": "recs_panel"}
                ]
            else:
                response_text = f"Hello {profile['name']}! Your digital SBI portfolio is fully set up. You can ask me to run what-if simulations on your savings, create new goals, or scan transactions for security alerts."
                suggested_actions = [{"text": "Simulate Digital Twin", "type": "navigate", "value": "digital_twin"}]
                
        return {
            "response": response_text,
            "agent_logs": agent_logs,
            "suggested_actions": suggested_actions,
            "action_route": action_route
        }

orchestrator = AIOrchestrator()
