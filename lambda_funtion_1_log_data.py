import json
import boto3
from datetime import datetime

# Initialize the S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):

    print("Received event:", json.dumps(event))  # Debug log
    
    try:
        # Parse the body from API Gateway event
        if isinstance(event.get('body'), str):
            body = json.loads(event.get('body', '{}'))
        else:
            body = event.get('body', {})

        # Bucket and File Path in S3
        bucket_name = 'diary-log'
        user_id = body.get('userId', 'unknown')  # Changed to get data from body
        object_key = f"user-data/user_id={user_id}.json"
    
        # Data to log
        new_entry = {
            "user_id": body.get('userId', ''),
            "updated_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'), # Actual time when log happens
            "logDate": body.get('logDate', ''), # User select date for the study session
            "themeEntry": body.get('themeEntry', ''),
            "studyTime": body.get('studyTime', 0), # default 0 if studytime is not present
            "diaryEntry": body.get('diaryEntry', '')
        }

        try:
            # Check if the file exists for the user in the bucket
            response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
            existing_entries = response['Body'].read().decode('utf-8').strip().split('\n')
            
            # Append the new entry as a new line in the NDJSON format
            s3_client.put_object(
                Bucket=bucket_name,
                Key=object_key,
                Body='\n'.join(existing_entries + [json.dumps(new_entry)]),  # Append new record on a new line
                ContentType='application/json'
            )

        except s3_client.exceptions.NoSuchKey:
            # If the file doesn't exist, create a new file with the first entry (no array brackets)
            s3_client.put_object(
                Bucket=bucket_name,
                Key=object_key,
                Body=json.dumps(new_entry) + '\n',  # if does not exist, create a single dictionary
                ContentType='application/json'
            )

        print("new_entry content:", json.dumps(new_entry))
    
    except Exception as e:
        # Catch all exceptions
        print(f"Error processing the request: {str(e)}")
        raise e  