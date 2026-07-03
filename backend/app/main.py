from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional

from app.database import db
from app.agents.orchestrator import orchestrator
from app.agents.customer_agent import customer_agent
from app.agents.planning_agent import planning_agent
from app.agents.recommend_agent import recommend_agent
from app.agents.engagement_agent import engagement_agent
from app.agents.digital_twin import digital_twin_agent
from app.api.sbi_mock_api import router as sbi_router

app = FastAPI(
    title="SBI NEXUS - Backend Service",
    description="Multi-Agent AI Companion Backend for SBI Hackathon @ GFF 2026",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local prototyping
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register mock banking routes
app.include_router(sbi_router)

# Request Models
class ChatRequest(BaseModel):
    message: str

class SimulateRequest(BaseModel):
    sip_increase: float = 0.0
    spending_cut_percent: float = 0.0
    home_loan_target_year: int = 5

class GoalRequest(BaseModel):
    id: Optional[str] = None
    title: str
    target_amount: float
    target_years: float
    current_savings: float
    monthly_contribution: float
    category: str

# Endpoints
@app.get("/")
def read_root():
    return {"status": "online", "project": "SBI NEXUS", "theme": "Agentic AI Digital Onboarding"}

@app.get("/api/user/profile")
def get_profile():
    profile = db.get_profile()
    transactions = db.get_transactions()
    analysis = customer_agent.analyze_profile(profile, transactions)
    return {
        "profile": profile,
        "analysis": analysis
    }

@app.post("/api/user/profile")
def update_profile(updates: Dict[str, Any]):
    return db.update_profile(updates)

@app.get("/api/user/goals")
def get_goals():
    profile = db.get_profile()
    goals = db.get_goals()
    roadmaps = planning_agent.create_roadmap(profile, goals)
    return {
        "goals": goals,
        "roadmaps": roadmaps
    }

@app.post("/api/user/goals")
def add_goal(goal: GoalRequest):
    return db.add_or_update_goal(goal.model_dump())

@app.delete("/api/user/goals/{goal_id}")
def delete_goal(goal_id: str):
    success = db.delete_goal(goal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    return {"status": "success", "message": "Goal deleted"}

@app.get("/api/user/transactions")
def get_transactions():
    return db.get_transactions()

@app.get("/api/user/notifications")
def get_notifications():
    return db.get_notifications()

@app.post("/api/user/notifications/{notif_id}/read")
def read_notification(notif_id: str):
    success = db.mark_notification_read(notif_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"status": "success"}

@app.get("/api/user/recommendations")
def get_recommendations():
    profile = db.get_profile()
    return recommend_agent.get_recommendations(profile)

@app.get("/api/user/triggers")
def get_triggers():
    profile = db.get_profile()
    transactions = db.get_transactions()
    notifications = db.get_notifications()
    return engagement_agent.get_engagement_triggers(profile, transactions, notifications)

@app.post("/api/chat")
def chat(req: ChatRequest):
    """
    Pass the user query to the AI Orchestrator.
    """
    try:
        result = orchestrator.process_message(req.message)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/simulate")
def simulate_twin(req: SimulateRequest):
    """
    Run Digital Twin projection calculations.
    """
    profile = db.get_profile()
    goals = db.get_goals()
    result = digital_twin_agent.simulate(
        profile=profile,
        goals=goals,
        sip_increase=req.sip_increase,
        spending_cut_percent=req.spending_cut_percent,
        home_loan_target_year=req.home_loan_target_year
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
