import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Adyapak Ji Backend Services")

# Initialize Supabase client for admin operations
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    # Fallback for local development
    supabase = None

class PromotionRequest(BaseModel):
    current_class_id: str
    target_class_id: str

@app.get("/")
def read_root():
    return {"message": "Adyapak Ji API is running."}

@app.post("/api/admin/promote-class")
def promote_class(req: PromotionRequest):
    """
    Complex Business Logic: Promotes all 'active' students from one class to the next.
    In real usage, this should run at the end of the academic year.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
        
    try:
        # 1. Fetch all active students in current_class_id
        res = supabase.table("students") \
            .select("id") \
            .eq("class_id", req.current_class_id) \
            .eq("status", "active") \
            .execute()
            
        student_ids = [s["id"] for s in res.data]
        
        if not student_ids:
            return {"message": "No active students found in the current class."}
            
        # 2. Update their class_id to target_class_id
        update_res = supabase.table("students") \
            .update({"class_id": req.target_class_id}) \
            .in_("id", student_ids) \
            .execute()
            
        return {
            "message": f"Successfully promoted {len(student_ids)} students.",
            "data": update_res.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/attendance/csv/{class_id}")
def generate_class_attendance_csv(class_id: str, month: str):
    """
    Stub: Generates a CSV report for attendance in a specific class for a specific month.
    """
    # Logic to fetch from Supabase and assemble pandas DataFrame -> CSV string
    return {"message": f"CSV Generation stub for class {class_id} month {month}", "url": "https://storage.supabase.com/stub.csv"}
