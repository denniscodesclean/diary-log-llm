"""
This lambda function update/insert data from html post request to S3 bucket.
Store data on user_id level. 
"""

import json
import boto3
from datetime import datetime

# Initialize the S3 client
s3_client = boto3.client('s3')

def lambda_handler(event, context):
    
    # Bucket and File Path in S3
    bucket_name = 'diary-log'
    user_id = event.get('userId', 'unknown')
    object_key = f"user-data/user_id={user_id}.json"
    
    # Data to log
    new_entry = {
        "user_id": event.get('userId', ''),
        "updated_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'), # Actual time when log happens
        "logDate": event.get('logDate', ''), # User select date for the study session
        "themeEntry": event.get('themeEntry', ''),
        "studyTime": event.get('studyTime', 0), # default 0 if studytime is not present
        "diaryEntry": event.get('diaryEntry', '')
    }

    # Try append new entry to S3
    try:
        # Check if the file exists for the user in the bucket
        response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        existing_entries = json.loads(response['Body'].read().decode('utf-8'))
    except s3_client.exceptions.NoSuchKey:
        # If no file exists, create a new list.
        existing_entries = []

    # Append new entry to the existing entries
    existing_entries.append(new_entry)

    # Write the updated entries back to S3
    s3_client.put_object(
        Bucket=bucket_name,
        Key=object_key,
        Body=json.dumps(existing_entries, indent=4),
        ContentType='application/json'
    )
