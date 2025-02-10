import json
import boto3

s3_client = boto3.client('s3')

def lambda_handler(event, context):
    try:
        # Extract userId from query parameters
        user_id = event.get('queryStringParameters', {}).get('userId', 'unknown')
        print(f"Extracted user_id: {user_id}")

        # Log the S3 path we're trying to access
        bucket_name = 'diary-log'
        object_key = f"user-data/user_id={user_id}.json"
        print(f"Attempting to access: s3://{bucket_name}/{object_key}")

        try:
            # Get entries from S3
            response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
            file_content = response['Body'].read().decode('utf-8')
            print("Successfully read S3 object")
            # Parse each JSON object and collect the entries in a list
            entries = file_content.split('\n')
            diary_entries = [json.loads(entry) for entry in entries if entry.strip()]
        except Exception as s3_error:
            print(f"S3 error: {str(s3_error)}")
            raise s3_error

        return {
            'statusCode': 200,
            'body': json.dumps(diary_entries),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"            
            }
        }

    except Exception as e:
        print(f"Final error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }