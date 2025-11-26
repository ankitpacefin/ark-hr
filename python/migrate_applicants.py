import json
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import pathlib

# Load environment variables from the root .env file
env_path = pathlib.Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

url: str = "https://ponbdoassgzccditvnzm.supabase.co"
key: str = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
service_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    print("Error: Supabase URL or Key not found in .env")
    exit(1)

# Use service key if available for bypassing RLS, otherwise use anon key
supabase: Client = create_client(url, service_key if service_key else key)

def migrate_data():
    print("Starting migration...")
    
    # 1. Fetch a workspace ID
    print("Fetching default workspace...")
    workspace_response = supabase.table("workspaces").select("id").limit(1).execute()
    
    if not workspace_response.data:
        print("Error: No workspace found. Please create a workspace first.")
        return

    workspace_id = workspace_response.data[0]['id']
    print(f"Using Workspace ID: {workspace_id}")

    # 1.1 Fetch valid Job IDs
    print("Fetching valid job IDs...")
    jobs_response = supabase.table("jobs").select("job_id").execute()
    valid_job_ids = {str(j['job_id']).strip() for j in jobs_response.data}
    print(f"Found {len(valid_job_ids)} valid jobs. Sample: {list(valid_job_ids)[:5]}")

    # 2. Read JSON data
    json_path = pathlib.Path(__file__).parent / 'processed_applications.json'
    if not json_path.exists():
        print(f"Error: JSON file not found at {json_path}")
        return

    print(f"Reading data from {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        applicants_data = json.load(f)

    print(f"Found {len(applicants_data)} applicants to migrate.")

    # 3. Transform and Insert Data
    batch_size = 50
    batch = []
    
    for i, app in enumerate(applicants_data):
        ai_data = app.get('ai_data', {})
        
        job_id = str(app.get("job_id"))
        if job_id:
            job_id = job_id.strip()
            
        if job_id == "None" or job_id == "" or job_id == "null":
            job_id = None
            
        if job_id and job_id not in valid_job_ids:
            # print(f"Warning: Job ID '{job_id}' not found in DB. Setting to NULL.")
            job_id = None

        # Map fields
        new_applicant = {
            "id": app.get("id"),
            "applied_at": app.get("date"),
            "name": app.get("name"),
            "email": app.get("email"),
            "mobile_number": app.get("mobile_number"),
            "linkedin": app.get("linkedin"),
            "portfolio_link": app.get("portfolio_link"),
            "current_ctc": app.get("current_ctc"),
            "expected_ctc": app.get("expected_ctc"),
            "notice_period": app.get("notice_period"),
            "resume_link": app.get("resume_id"), # Mapping resume_id to resume_link
            "job_id": job_id, 
            "workspace_id": workspace_id,
            "status": "new",
            
            # Flattened AI Data
            "ats_score": ai_data.get("ats_score"),
            "social_links": ai_data.get("social_links", []),
            "current_job_title": ai_data.get("current_job_title"),
            "gender": ai_data.get("gender"),
            "total_experience_years": ai_data.get("total_experience_years"),
            "highest_qualification": ai_data.get("highest_qualification"),
            "skills": ai_data.get("skills", []),
            "domains_worked": ai_data.get("domains_worked", []),
            "notable_achievement": ai_data.get("notable_achievement"),
            "previous_companies_names": ai_data.get("prevous_companies_names", []), # Note typo in JSON: prevous -> previous
            "projects": ai_data.get("projects", [])
        }
        
        batch.append(new_applicant)
        
        if len(batch) >= batch_size:
            print(f"Inserting batch of {len(batch)} records (Progress: {i+1}/{len(applicants_data)})...")
            try:
                # upsert=True to handle potential duplicates if running multiple times
                supabase.table("applicants").upsert(batch).execute()
            except Exception as e:
                print(f"Error inserting batch: {e}")
            finally:
                batch = []
                
    # Insert remaining
    if batch:
        print(f"Inserting final batch of {len(batch)} records...")
        try:
            supabase.table("applicants").upsert(batch).execute()
        except Exception as e:
            print(f"Error inserting final batch: {e}")

    print("Migration completed.")

if __name__ == "__main__":
    migrate_data()
