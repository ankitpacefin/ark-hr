import urllib.request
import json
import time
import os

base_url = "https://manager.pocketful.in/wp-json/wp/v2/application/?_fields=id,name,email,mobile_number,linkedin,portfolio_link,current_ctc,expected_ctc,notice_period,resume_id,job_id,date&per_page=100&page={}"
all_data = []
page = 1
output_file = 'fetched_applications.json'

print("Starting data fetch...")

while True:
    url = base_url.format(page)
    print(f"Fetching page {page}...")
    try:
        # User-Agent is often required by WP security plugins
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
        with urllib.request.urlopen(req) as response:
            if response.status != 200:
                print(f"Failed with status {response.status}")
                break
            
            response_body = response.read().decode('utf-8')
            try:
                data = json.loads(response_body)
            except json.JSONDecodeError:
                print("Failed to decode JSON response")
                break
            
            if not data:
                print("No more data found (empty list).")
                break
            
            if isinstance(data, list):
                all_data.extend(data)
                print(f"Retrieved {len(data)} records. Total so far: {len(all_data)}")
                
                # If we got less than 100 records, this is likely the last page
                if len(data) < 100:
                    print("Received less than 100 records, assuming end of data.")
                    break
            elif isinstance(data, dict) and 'code' in data:
                 # Handle WP API error responses like {'code': 'rest_post_invalid_page_number', ...}
                 print(f"API Error: {data.get('message', 'Unknown error')}")
                 break
            else:
                print("Unexpected data format.")
                break
            
            page += 1
            # Be nice to the server
            time.sleep(0.5)
            
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        # 400 Bad Request is often returned when page number is out of range
        if e.code == 400:
            print("Reached end of pages (400 Bad Request).")
        break
    except Exception as e:
        print(f"Error: {e}")
        break

print(f"Finished fetching. Saving {len(all_data)} records to {output_file}...")

try:
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=4)
    print(f"Successfully saved data to {os.path.abspath(output_file)}")
except Exception as e:
    print(f"Error saving file: {e}")
