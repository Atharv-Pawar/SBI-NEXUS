from typing import Dict, Any, List

class CustomerUnderstandingAgent:
    def analyze_profile(self, profile: Dict[str, Any], transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        income = profile.get("monthly_income", 75000.0)
        savings = profile.get("savings_balance", 150000.0)
        discretionary = profile.get("discretionary_spending", 25000.0)
        fixed_expenses = profile.get("fixed_expenses", 35000.0)
        
        # Calculate monthly savings capacity
        savings_capacity = income - fixed_expenses - discretionary
        savings_ratio = (savings_capacity / income) if income > 0 else 0
        
        # Determine spending health rating
        if savings_ratio >= 0.25:
            health_rating = "Excellent"
            health_color = "emerald"
            insight = "You are saving more than 25% of your income. This is a very healthy financial habit."
        elif savings_ratio >= 0.15:
            health_rating = "Good"
            health_color = "cyan"
            insight = "Your savings rate is between 15% and 25%. You can optimize this further by automating savings."
        elif savings_ratio > 0:
            health_rating = "Needs Attention"
            health_color = "amber"
            insight = "Your savings rate is low. You could save significantly more by curbing discretionary expenses by 10-15%."
        else:
            health_rating = "Critical"
            health_color = "rose"
            insight = "Your monthly expenses match or exceed your income. Immediate budgeting or debt management is recommended."
            
        # Analyze transaction categories to identify high discretionary sources
        category_sums = {}
        for tx in transactions:
            if tx["type"] == "debit" and tx["status"] == "cleared":
                cat = tx["category"]
                category_sums[cat] = category_sums.get(cat, 0.0) + tx["amount"]
                
        # Find top spending category excluding rent
        top_discretionary_cat = "None"
        top_discretionary_amount = 0.0
        for cat, amt in category_sums.items():
            if cat not in ["rent", "investment"] and amt > top_discretionary_amount:
                top_discretionary_cat = cat
                top_discretionary_amount = amt
                
        warnings = []
        if top_discretionary_cat == "food" and top_discretionary_amount > (income * 0.10):
            warnings.append(f"Food delivery spending is high (₹{top_discretionary_amount:,.0f}). Consider cooking more to boost savings.")
        elif top_discretionary_cat == "shopping" and top_discretionary_amount > (income * 0.15):
            warnings.append(f"Shopping expenses are elevated (₹{top_discretionary_amount:,.0f}). Set a monthly budget on YONO.")
            
        return {
            "health_rating": health_rating,
            "health_color": health_color,
            "savings_ratio_percent": round(savings_ratio * 100, 1),
            "monthly_surplus": savings_capacity,
            "top_spending_category": top_discretionary_cat.capitalize(),
            "top_spending_amount": top_discretionary_amount,
            "primary_behavioral_insight": insight,
            "warnings": warnings,
            "recommendations": [
                "Activate SBI YONO to categorize all monthly expenditures automatically.",
                "Create a dedicated Emergency goal with automated monthly contributions."
            ]
        }

customer_agent = CustomerUnderstandingAgent()
