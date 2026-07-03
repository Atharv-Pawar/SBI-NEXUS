from typing import Dict, Any, List

class DigitalTwinAgent:
    def __init__(self):
        self.savings_interest_rate = 0.03  # 3% annual interest (SBI savings)
        self.sip_interest_rate = 0.12     # 12% annual interest (SBI Mutual Fund SIP estimate)
        
    def simulate(
        self,
        profile: Dict[str, Any],
        goals: List[Dict[str, Any]],
        sip_increase: float = 0.0,
        spending_cut_percent: float = 0.0,
        home_loan_target_year: int = 5
    ) -> Dict[str, Any]:
        """
        Simulate 120 months (10 years) of financial growth under:
        - Baseline: Current spending, savings rate, and products.
        - Simulated (Twin): Adjusted spending, increased SIP, and recommended SBI products.
        """
        income = profile.get("monthly_income", 75000.0)
        current_savings = profile.get("savings_balance", 150000.0)
        discretionary = profile.get("discretionary_spending", 25000.0)
        fixed_expenses = profile.get("fixed_expenses", 35000.0)
        
        # Calculate monthly surplus
        baseline_monthly_savings = income - fixed_expenses - discretionary
        if baseline_monthly_savings < 0:
            baseline_monthly_savings = 0.0
            
        # Spending cuts add directly to savings or SIP
        saved_discretionary = discretionary * (spending_cut_percent / 100.0)
        simulated_monthly_surplus = baseline_monthly_savings + saved_discretionary
        
        # Split simulated surplus: SIP vs. Savings
        # We assume baseline SIP is 0. If user adds sip_increase, we allocate that from the simulated surplus.
        # Ensure we don't allocate more than the surplus.
        actual_sip_increase = min(sip_increase, simulated_monthly_surplus)
        simulated_monthly_savings = simulated_monthly_surplus - actual_sip_increase
        
        # Goals tracking
        house_goal = next((g for g in goals if g["category"] == "house"), None)
        house_target = house_goal["target_amount"] if house_goal else 1500000.0
        
        baseline_house_met_month = -1
        simulated_house_met_month = -1
        
        # Projections array
        projections = []
        
        # Net wealth tracks
        baseline_wealth = current_savings
        simulated_wealth = current_savings
        
        baseline_sip_wealth = 0.0
        simulated_sip_wealth = 0.0
        
        # Simulate month by month for 10 years (120 months)
        for month in range(1, 121):
            year = round(month / 12, 1)
            
            # 1. Baseline Calculations
            # Savings compounds monthly (approximate)
            baseline_wealth += baseline_monthly_savings
            baseline_wealth *= (1 + self.savings_interest_rate / 12)
            
            # SIP grows at mutual fund average
            # Assuming baseline SIP was 0 or a nominal 2000 if has_sip is True
            baseline_sip_contrib = 2000.0 if profile.get("has_sip", False) else 0.0
            baseline_sip_wealth += baseline_sip_contrib
            baseline_sip_wealth *= (1 + self.sip_interest_rate / 12)
            
            total_baseline_wealth = baseline_wealth + baseline_sip_wealth
            
            # 2. Simulated (Twin) Calculations
            simulated_wealth += simulated_monthly_savings
            simulated_wealth *= (1 + self.savings_interest_rate / 12)
            
            simulated_sip_contrib = (2000.0 if profile.get("has_sip", False) else 0.0) + actual_sip_increase
            simulated_sip_wealth += simulated_sip_contrib
            simulated_sip_wealth *= (1 + self.sip_interest_rate / 12)
            
            total_simulated_wealth = simulated_wealth + simulated_sip_wealth
            
            # Check if house goal target is reached
            if total_baseline_wealth >= house_target and baseline_house_met_month == -1:
                baseline_house_met_month = month
            if total_simulated_wealth >= house_target and simulated_house_met_month == -1:
                simulated_house_met_month = month
                
            # Keep monthly records (save every 3 months to keep payload clean, or all)
            if month % 3 == 0 or month == 1 or month == 120:
                projections.append({
                    "month": month,
                    "year": year,
                    "baseline_wealth": round(total_baseline_wealth, 2),
                    "simulated_wealth": round(total_simulated_wealth, 2),
                    "baseline_savings": round(baseline_wealth, 2),
                    "simulated_savings": round(simulated_wealth, 2),
                    "baseline_sip": round(baseline_sip_wealth, 2),
                    "simulated_sip": round(simulated_sip_wealth, 2)
                })
                
        # Recommendations generation based on the twin simulation
        recommendations = []
        
        # Recommendation 1: UPI and YONO onboarding (if missing)
        if not profile.get("has_yono"):
            recommendations.append({
                "product": "SBI YONO App",
                "reason": "By activating YONO, you can track this Digital Twin simulation directly inside your bank app, manage your investments paperlessly, and view your net wealth history.",
                "action": "yono_activation"
            })
            
        # Recommendation 2: SIP activation or boost
        if actual_sip_increase > 0:
            recommendations.append({
                "product": "SBI Mutual Fund SIP",
                "reason": f"Allocating ₹{actual_sip_increase:,.0f} of your savings cut to an SBI Mutual Fund SIP projects an estimated wealth of ₹{total_simulated_wealth - total_baseline_wealth:,.0f} higher over 10 years compared to holding cash.",
                "action": "sip_open"
            })
        elif simulated_monthly_surplus > 10000 and not profile.get("has_sip"):
            recommendations.append({
                "product": "SBI Mutual Fund SIP",
                "reason": "You have a strong monthly surplus. Creating an SBI Mutual Fund SIP with ₹5,000/month could yield high long-term returns compared to standard savings accounts.",
                "action": "sip_open"
            })
            
        # Recommendation 3: Home Loan eligibility check
        # Standard home loan eligibility: monthly EMI can be up to 50% of monthly income.
        max_emi_eligible = income * 0.50
        # Average EMI for 10L loan for 20 years at 8.5% interest is approx ₹8,700.
        # Max loan estimate:
        max_loan_estimate = (max_emi_eligible / 8700.0) * 1000000.0
        
        # If simulated wealth is short of house_target at target year, show loan eligibility
        target_months = home_loan_target_year * 12
        simulated_wealth_at_target = current_savings
        # calculate approximate simulated wealth at target year
        for m in range(1, target_months + 1):
            simulated_wealth_at_target += simulated_monthly_savings
            simulated_wealth_at_target *= (1 + self.savings_interest_rate / 12)
            # SIP component
            # simple SIP calculation
            # ...
        # Let's check from projection list
        proj_at_target = next((p for p in projections if abs(p["year"] - home_loan_target_year) < 0.2), projections[-1])
        wealth_at_target = proj_at_target["simulated_wealth"]
        
        if wealth_at_target < house_target:
            shortfall = house_target - wealth_at_target
            if shortfall <= max_loan_estimate:
                recommendations.append({
                    "product": "SBI Home Loan",
                    "reason": f"At Year {home_loan_target_year}, you will have a shortfall of ₹{shortfall:,.0f} for your home purchase. Based on your income of ₹{income:,.0f}/month, you are eligible for an SBI Home Loan up to ₹{max_loan_estimate:,.0f}.",
                    "action": "loan_apply"
                })
        
        # Recommendation 4: AutoPay Setup
        if not profile.get("has_autopay") and (profile.get("has_sip") or actual_sip_increase > 0):
            recommendations.append({
                "product": "SBI AutoPay (SI)",
                "reason": "Enable Standing Instructions (AutoPay) to automate your SIP transfers directly on salary credit day, ensuring disciplined savings.",
                "action": "autopay_setup"
            })

        return {
            "projections": projections,
            "summary": {
                "baseline_wealth_10yr": round(projections[-1]["baseline_wealth"], 2),
                "simulated_wealth_10yr": round(projections[-1]["simulated_wealth"], 2),
                "wealth_difference_10yr": round(projections[-1]["simulated_wealth"] - projections[-1]["baseline_wealth"], 2),
                "baseline_house_met_years": round(baseline_house_met_month / 12, 1) if baseline_house_met_month != -1 else "Not Met",
                "simulated_house_met_years": round(simulated_house_met_month / 12, 1) if simulated_house_met_month != -1 else "Not Met",
                "monthly_savings_baseline": baseline_monthly_savings,
                "monthly_savings_simulated": simulated_monthly_savings,
                "monthly_sip_simulated": (2000.0 if profile.get("has_sip", False) else 0.0) + actual_sip_increase
            },
            "recommendations": recommendations
        }

digital_twin_agent = DigitalTwinAgent()
