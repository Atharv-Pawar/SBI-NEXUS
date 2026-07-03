from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

# Data Models
class UserProfile(BaseModel):
    name: str = "Atharv Pawar"
    age: int = 26
    monthly_income: float = 75000.0  # INR
    savings_balance: float = 150000.0  # INR
    discretionary_spending: float = 25000.0  # INR
    fixed_expenses: float = 35000.0  # Rent, Bills, Food (75000 - 150000 savings increment)
    
    # SBI Products status
    has_savings_account: bool = True
    has_yono: bool = False
    has_upi: bool = False
    has_sip: bool = False
    has_fd: bool = False
    has_insurance: bool = False
    has_credit_card: bool = False
    has_home_loan: bool = False
    has_autopay: bool = False

class FinancialGoal(BaseModel):
    id: str
    title: str
    target_amount: float
    target_years: float
    current_savings: float
    monthly_contribution: float
    category: str  # house, retirement, child_education, emergency, investment

class Transaction(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    type: str  # credit, debit
    category: str  # salary, food, rent, shopping, utility, investment, transfer
    status: str  # cleared, pending, flagged

class Notification(BaseModel):
    id: str
    title: str
    message: str
    type: str  # alert, info, recommendation, fraud
    timestamp: str
    read: bool = False
    action_type: Optional[str] = None  # yono_activation, upi_setup, fd_open, sip_open, autopay_setup
    action_data: Optional[Dict[str, Any]] = None

# Mock Database State
class MockDatabase:
    def __init__(self):
        self.profile = UserProfile()
        
        # Initial goals
        self.goals = {
            "emergency": FinancialGoal(
                id="emergency",
                title="Emergency Fund (6 Months)",
                target_amount=300000.0,
                target_years=1.0,
                current_savings=100000.0,
                monthly_contribution=10000.0,
                category="emergency"
            ),
            "house": FinancialGoal(
                id="house",
                title="Buy a House Down Payment",
                target_amount=1500000.0,
                target_years=5.0,
                current_savings=50000.0,
                monthly_contribution=15000.0,
                category="house"
            ),
            "retirement": FinancialGoal(
                id="retirement",
                title="Retirement Corpus",
                target_amount=20000000.0,
                target_years=30.0,
                current_savings=0.0,
                monthly_contribution=5000.0,
                category="retirement"
            )
        }
        
        # Recent transaction history
        now = datetime.now()
        self.transactions = [
            Transaction(
                id="tx_001",
                date=(now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M"),
                description="Salary Credited - State Bank of India",
                amount=75000.0,
                type="credit",
                category="salary",
                status="cleared"
            ),
            Transaction(
                id="tx_002",
                date=(now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M"),
                description="Auto-Debit: House Rent",
                amount=18000.0,
                type="debit",
                category="rent",
                status="cleared"
            ),
            Transaction(
                id="tx_003",
                date=(now - timedelta(days=5)).strftime("%Y-%m-%d %H:%M"),
                description="Swiggy Food Delivery",
                amount=850.0,
                type="debit",
                category="food",
                status="cleared"
            ),
            Transaction(
                id="tx_004",
                date=(now - timedelta(days=7)).strftime("%Y-%m-%d %H:%M"),
                description="Amazon.in Online Shopping",
                amount=3200.0,
                type="debit",
                category="shopping",
                status="cleared"
            ),
            Transaction(
                id="tx_005",
                date=(now - timedelta(days=10)).strftime("%Y-%m-%d %H:%M"),
                description="Electric Bill Payment",
                amount=2450.0,
                type="debit",
                category="utility",
                status="cleared"
            ),
            Transaction(
                id="tx_006",
                date=(now - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M"),
                description="Suspicious OTP Attempt - Russia POS",
                amount=45000.0,
                type="debit",
                category="transfer",
                status="flagged"
            )
        ]
        
        # Initial notifications
        self.notifications = [
            Notification(
                id="notif_001",
                title="YONO App Activation Recommended",
                message="Unlock 250+ digital services, instant paperless FD/RD, and pre-approved loans by activating SBI YONO.",
                type="recommendation",
                timestamp=(now - timedelta(hours=1)).strftime("%Y-%m-%d %H:%M"),
                action_type="yono_activation"
            ),
            Notification(
                id="notif_002",
                title="Suspicious Transaction Prevented",
                message="SBI NEXUS Fraud Guard blocked a suspicious transaction attempt of ₹45,000 originating from a foreign POS. Your card remains secure.",
                type="fraud",
                timestamp=(now - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M")
            ),
            Notification(
                id="notif_003",
                title="Salary Credited: Automate Savings",
                message="Your monthly salary of ₹75,000 has been credited. Setting up an SBI Mutual Fund SIP and AutoPay will build wealth automatically.",
                type="alert",
                timestamp=(now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M"),
                action_type="autopay_setup"
            )
        ]
    
    def get_profile(self) -> Dict[str, Any]:
        return self.profile.model_dump()
        
    def update_profile(self, updates: Dict[str, Any]):
        for key, val in updates.items():
            if hasattr(self.profile, key):
                setattr(self.profile, key, val)
        return self.get_profile()
        
    def get_goals(self) -> List[Dict[str, Any]]:
        return [g.model_dump() for g in self.goals.values()]
        
    def add_or_update_goal(self, goal: Dict[str, Any]) -> Dict[str, Any]:
        g_id = goal.get("id")
        if not g_id:
            g_id = goal["title"].lower().replace(" ", "_")
            goal["id"] = g_id
        
        self.goals[g_id] = FinancialGoal(**goal)
        return self.goals[g_id].model_dump()

    def delete_goal(self, goal_id: str) -> bool:
        if goal_id in self.goals:
            del self.goals[goal_id]
            return True
        return False

    def get_transactions(self) -> List[Dict[str, Any]]:
        return [t.model_dump() for t in self.transactions]
        
    def add_transaction(self, tx: Dict[str, Any]) -> Dict[str, Any]:
        new_tx = Transaction(**tx)
        self.transactions.insert(0, new_tx)  # Newest first
        
        # If transaction is credit, increase balance. If debit (and cleared), decrease.
        if new_tx.status == "cleared":
            if new_tx.type == "credit":
                self.profile.savings_balance += new_tx.amount
            else:
                self.profile.savings_balance -= new_tx.amount
                
        return new_tx.model_dump()

    def get_notifications(self) -> List[Dict[str, Any]]:
        return [n.model_dump() for n in self.notifications]
        
    def add_notification(self, notif: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in notif:
            notif["id"] = f"notif_{len(self.notifications) + 1:03d}"
        if "timestamp" not in notif:
            notif["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        new_notif = Notification(**notif)
        self.notifications.insert(0, new_notif)
        return new_notif.model_dump()
        
    def mark_notification_read(self, notif_id: str) -> bool:
        for notif in self.notifications:
            if notif.id == notif_id:
                notif.read = True
                return True
        return False

db = MockDatabase()
