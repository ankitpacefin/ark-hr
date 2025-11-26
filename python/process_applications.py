import json
import requests
import os
import io
from pypdf import PdfReader
import time
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock

# Configuration
INPUT_FILE = 'fetched_applications.json'
OUTPUT_FILE = 'processed_applications.json'
API_URL = 'https://n8n.ankitdalal.com/webhook/fbd26858-3fc7-4a73-9130-29baf371f39b'

def load_json(filepath):
    if not os.path.exists(filepath):
        return []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def extract_text_from_pdf(pdf_url):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(pdf_url, headers=headers, timeout=30)
            response.raise_for_status()
            
            with io.BytesIO(response.content) as f:
                reader = PdfReader(f)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                return text
        except Exception as e:
            print(f"  Error extracting PDF text from {pdf_url} (Attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2)
    return None

def clean_json_string(json_str):
    # Remove markdown code blocks
    cleaned = re.sub(r'^```json\s*', '', json_str, flags=re.MULTILINE)
    cleaned = re.sub(r'^```\s*', '', cleaned, flags=re.MULTILINE)
    cleaned = re.sub(r'```$', '', cleaned, flags=re.MULTILINE)
    return cleaned.strip()

def analyze_resume(text, applicant_info):
    # Construct the input string as requested
    # "Name \n Email | LinkedIn | Mobile \n\n Text"
    header = f"{applicant_info.get('name', '')}\n{applicant_info.get('email', '')} | {applicant_info.get('linkedin', '') or ''} | {applicant_info.get('mobile_number', '')}\n\n"
    full_input = header + text
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, data={'input': full_input}, timeout=120)
            response.raise_for_status()
            
            result = response.json()
            
            # Handle case where result is a list
            if isinstance(result, list):
                if len(result) > 0:
                    result = result[0]
                else:
                    print("  API returned empty list")
                    return None
                    
            output_str = result.get('output', '')
            
            # Parse the inner JSON
            cleaned_output = clean_json_string(output_str)
            return json.loads(cleaned_output)
            
        except Exception as e:
            print(f"  Error calling analysis API (Attempt {attempt+1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                try:
                    print(f"  Raw response: {response.text[:200]}...")
                except:
                    pass
            else:
                time.sleep(2)
                
    return None

def process_single_application(app, index, total, processed_ids, save_lock):
    """Process a single application with PDF extraction and API analysis."""
    if app['id'] in processed_ids:
        return None
        
    print(f"Processing {index+1}/{total}: ID {app['id']} - {app['name']}")
    
    resume_url = app.get('resume_id')
    if not resume_url:
        print("  No resume URL found. Skipping analysis.")
        app['analysis'] = None
        return app
        
    # 1. Extract Text
    print("  Downloading and extracting PDF text...")
    pdf_text = extract_text_from_pdf(resume_url)
    
    if not pdf_text:
        print("  Failed to extract text.")
        app['analysis_error'] = "Failed to extract PDF text"
        return app
        
    # 2. Analyze
    print("  Analyzing with API...")
    analysis_result = analyze_resume(pdf_text, app)
    
    if analysis_result:
        print("  Analysis successful.")
        # Merge analysis result into the app object or as a sub-object
        # The user asked to "add to th repetive array", implying merging or adding fields.
        # I'll add it as a 'parsed_data' field to keep it clean, or merge it.
        # Looking at the requested output structure, it has fields like 'skills', 'projects' etc.
        # It's safer to add it as a nested object 'ai_analysis' to avoid overwriting original fields like 'id' or 'name' if the AI hallucinates them differently.
        # BUT user said "store in anew json file old and this new".
        # I will merge it at top level but be careful, OR just put it in 'ai_enriched_data'.
        # Let's put it in 'ai_data' key.
        app['ai_data'] = analysis_result
    else:
        print("  Analysis failed.")
        app['analysis_error'] = "API analysis failed"
        
    print("  Processed successfully.")
    return app

def main():
    print("Starting application processing with concurrent workers (max 20)...")
    
    fetched_data = load_json(INPUT_FILE)
    processed_data = load_json(OUTPUT_FILE)
    
    # Create a map of already processed IDs for fast lookup
    processed_ids = {item['id'] for item in processed_data}
    
    print(f"Found {len(fetched_data)} total applications.")
    print(f"Found {len(processed_data)} already processed.")
    
    # Filter out already processed applications
    to_process = [app for app in fetched_data if app['id'] not in processed_ids]
    print(f"Applications to process: {len(to_process)}")
    
    if not to_process:
        print("No new applications to process.")
        return
    
    # Thread-safe lock for saving data
    save_lock = Lock()
    
    # Process applications concurrently with max 20 workers
    with ThreadPoolExecutor(max_workers=20) as executor:
        # Submit all tasks
        future_to_app = {
            executor.submit(
                process_single_application, 
                app, 
                i, 
                len(to_process), 
                processed_ids,
                save_lock
            ): app 
            for i, app in enumerate(to_process)
        }
        
        # Process completed tasks as they finish
        for future in as_completed(future_to_app):
            try:
                result = future.result()
                if result:
                    # Thread-safe save
                    with save_lock:
                        processed_data.append(result)
                        save_json(OUTPUT_FILE, processed_data)
                        processed_ids.add(result['id'])
            except Exception as e:
                app = future_to_app[future]
                print(f"Error processing application {app['id']}: {e}")

    print("Processing complete.")

if __name__ == "__main__":
    main()
