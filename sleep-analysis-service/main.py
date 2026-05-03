from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI()

class UserInput(BaseModel):
    sleep_time: str
    wake_time: str
    disturbances: int
    stress_level: int
    caffeine_intake: int
    steps: Optional[int]
    heart_rate: Optional[int]
    sleep_cycles: Optional[int]
    screen_time: Optional[int]
    noise: Optional[int]
    light_exposure: Optional[int]
    temperature: Optional[int]

class AnalysisResult(BaseModel):
    sleep_score: int
    issue_detected: List[str]
    severity: str
    root_causes: List[str]
    recommendations: List[dict]
    alerts: List[str]

@app.post("/analyze_sleep", response_model=AnalysisResult)
def analyze_sleep(data: UserInput):
    # Placeholder logic for sleep score calculation
    sleep_score = random.randint(0, 100)
    
    # Detect sleep-related issues
    issues = []
    if data.disturbances > 5 or data.stress_level > 7:
        issues.append("stress/anxiety-induced sleep issues")

    if data.caffeine_intake > 3:
        issues.append("poor sleep hygiene")

    if data.screen_time and data.screen_time > 120:
        issues.append("late-night screen usage")

    if not issues:
        issues.append("no significant issues detected")

    # Severity classification
    severity = "mild"
    if sleep_score < 50:
        severity = "severe"
    elif sleep_score < 70:
        severity = "moderate"

    # Identify root causes
    root_causes = []
    if "late-night screen usage" in issues:
        root_causes.append("High screen time + late sleep → melatonin disruption")
    if "poor sleep hygiene" in issues:
        root_causes.append("High caffeine + fragmented sleep → stimulant effect")

    # Mock recommendations
    recommendations = [{
        "type": "behavioral",
        "action": "Reduce screen time before bed",
        "priority": "high"
    }]

    if "stress/anxiety-induced sleep issues" in issues:
        recommendations.append({
            "type": "environmental",
            "action": "Practice relaxation techniques before bedtime",
            "priority": "medium"
        })

    # Possible alerts
    alerts = []
    if "possible sleep apnea risk" in issues:
        alerts.append("Possible sleep apnea risk detected")

    if severity == "severe":
        alerts.append("Consult a doctor if symptoms persist")

    return AnalysisResult(
        sleep_score=sleep_score,
        issue_detected=issues,
        severity=severity,
        root_causes=root_causes,
        recommendations=recommendations,
        alerts=alerts
    )

@app.get("/")
def read_root():
    return {"message": "Welcome to Sleep Analysis Service"}