from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.database import db

router = APIRouter(prefix="/api/mock-sbi", tags=["SBI Mock Banking Gateway"])

class ActivationRequest(BaseModel):
    account_number: Optional[str] = None
    phone_number: Optional[str] = None
    pin: Optional[str] = None
    amount: Optional[float] = None
    frequency: Optional[str] = None

@router.post("/activate-yono")
def activate_yono(req: ActivationRequest):
    """
    Mock SBI YONO registration activation.
    Updates the database profile state to has_yono = True.
    """
    db.update_profile({"has_yono": True})
    
    # Add transaction log representing a signup reward
    db.add_transaction({
        "id": f"tx_reward_{db.profile.savings_balance:.0f}",
        "date": "Just Now",
        "description": "YONO Signup Reward - Cashback",
        "amount": 250.0,
        "type": "credit",
        "category": "salary",
        "status": "cleared"
    })
    
    # Add congratulatory notification
    db.add_notification({
        "title": "SBI YONO Activated!",
        "message": "Welcome to YONO! You have received ₹250 signup bonus in your savings account.",
        "type": "info",
        "action_type": None
    })
    
    return {"status": "success", "message": "YONO Activation successful", "profile": db.get_profile()}

@router.post("/activate-upi")
def activate_upi(req: ActivationRequest):
    """
    Mock SBI UPI bindings.
    """
    if not db.profile.has_yono:
        # User should ideally have YONO or register UPI
        pass
    db.update_profile({"has_upi": True})
    
    db.add_notification({
        "title": "UPI Enabled Successfully",
        "message": "Your SBI account is now linked to UPI. You can scan codes to pay instantly.",
        "type": "info"
    })
    return {"status": "success", "message": "UPI registered successfully", "profile": db.get_profile()}

@router.post("/activate-autopay")
def activate_autopay(req: ActivationRequest):
    """
    Mock setting up AutoPay.
    """
    db.update_profile({"has_autopay": True})
    
    db.add_notification({
        "title": "AutoPay Mandate Setup Complete",
        "message": f"Standing instruction active for regular monthly savings. Frequency: {req.frequency or 'Monthly'}.",
        "type": "info"
    })
    return {"status": "success", "message": "AutoPay mandate configured", "profile": db.get_profile()}

@router.post("/open-sip")
def open_sip(req: ActivationRequest):
    """
    Mock opening a Mutual Fund SIP account.
    """
    db.update_profile({"has_sip": True})
    amount = req.amount or 5000.0
    
    # Add new goal or update contribution
    house_goal = db.goals.get("house")
    if house_goal:
        house_goal.monthly_contribution += amount
        db.add_or_update_goal(house_goal.model_dump())
        
    db.add_notification({
        "title": "SBI Mutual Fund SIP Started",
        "message": f"Your SIP of ₹{amount:,.0f}/month is active. Your wealth roadmap has been accelerated.",
        "type": "info"
    })
    return {"status": "success", "message": "Mutual Fund SIP opened", "profile": db.get_profile(), "goals": db.get_goals()}

@router.post("/open-fd")
def open_fd(req: ActivationRequest):
    """
    Mock opening a Fixed Deposit (MODS).
    """
    db.update_profile({"has_fd": True})
    amount = req.amount or 50000.0
    
    if db.profile.savings_balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance in savings account.")
        
    # Debit savings, move to FD
    db.profile.savings_balance -= amount
    
    # Create goal for emergency
    emergency_goal = db.goals.get("emergency")
    if emergency_goal:
        emergency_goal.current_savings += amount
        db.add_or_update_goal(emergency_goal.model_dump())
        
    db.add_notification({
        "title": "SBI MODS FD Created",
        "message": f"₹{amount:,.0f} has been transferred to a Multi Option Fixed Deposit at 7.1% interest.",
        "type": "info"
    })
    
    return {"status": "success", "message": "Fixed Deposit created", "profile": db.get_profile()}

@router.post("/lock-card")
def lock_card():
    """
    Mock locking card due to fraud risks.
    """
    # Remove the active fraud transaction to show resolved
    db.transactions = [t for t in db.transactions if t.status != "flagged"]
    # Change notification
    db.add_notification({
        "title": "Card Blocked Successfully",
        "message": "Your card has been locked. A replacement card is on its way to your KYC address.",
        "type": "alert"
    })
    return {"status": "success", "message": "Card secured successfully", "transactions": db.get_transactions()}
