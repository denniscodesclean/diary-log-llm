"""
Callout: Now call LLM separately for diff user. Would be good use case for on-demand require from individual users.
If want to do for batch users (say provide summary to all users once a week)
    1. include system prompt to avoid repeat tokens
    2. do batch call
    3. save all user insights
    4. send individual results to individual users.
"""
import boto3
import json
from botocore.exceptions import ClientError

# Create AWS Clients
s3_client = boto3.client("s3")
bedrock_client = boto3.client("bedrock-runtime", region_name="us-east-2")

#S3 Bucket
bucket_name = 'diary-log'

# Inference Profile ARN - Haiku 3 is the fastest
model_id = "arn:aws:bedrock:us-east-2:324037274971:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0"
#model_id = "arn:aws:sagemaker:us-east-2:aws:hub-content/SageMakerPublicHub/Model/deepseek-llm-r1/2.0.1"
#model_id = "arn:aws:bedrock:us-east-2:324037274971:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0"
#model_id = "arn:aws:bedrock:us-east-2:324037274971:inference-profile/us.anthropic.claude-3-5-sonnet-20240620-v1:0"

def lambda_handler(event, context):
    try:
        # read body from event
        user_id = event.get('queryStringParameters', {}).get('userId', 'unknown')
        print(f"Extracted user_id: {user_id}")

        # read from s3
        object_key = f"user-data/user_id={user_id}.json"
        response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
        file_content = response['Body'].read().decode('utf-8')  # Decode the file content
        
        # parse several json objects separated by new line to a list
        entries = file_content.split('\n')
        # Parse each JSON object and collect the entries in a list
        diary_entries = [json.loads(entry) for entry in entries if entry.strip()]

        # System and User Prompts
        system_prompt = """
            You are a helpful and friendly study tutor. 
            Your role is to analyze study diaries and provide actionable feedback to improve users' study efficiency. 
            Always speak in an encouraging and exciting tone, acknowledge user's achivement and efforts, motivate users to keep studying. 
            Always ensure the analysis is user-specific and does not mix data between users.
            IMPORTANT: Respond in the same language as the main langauge used in input diary.
            If the diary is in Chinese, respond in Chinese. If in Spanish, respond in Spanish. Do NOT respond in English if the diary is not in English.


            """

        user_prompt = f"""
         <instructions>
        Process the diary provided below and provide an analysis directly using the following JSON structure.
        Ensure the JSON output strictly adheres to the structure provided, do not include any openning text outside of JSON.
        </instructions>       

        <JSON Structure>
        {{
            "user_id": user id,
            "field_of_study": "Summarize the field of study in 10 words",
            "progress_summary": {{
                "total_hours_studied": "Sum of studyTime",
                "total_sessions": "Count of entries",
                "summary": "Provide a summary of progress for all entries. Use direct, conversational language, starting with 'You'."
            }},
            "review_suggestions": {{
                "key_concepts": "Provide key concepts for review with brief definitions",
                "questions": "Provide 2 questions for review."
            }},
            "next_study_topic_suggestion": "Suggest the next topic to study and briefly explain how it relates to the user's progress. Use direct, conversational language, starting with 'You'."
        }}
        </JSON Structure>

        Below is user's diary:
        <diary>
        {json.dumps(diary_entries)}
        </diary>
        """

        # Construct the request payload
        model_input = {
            "anthropic_version": "bedrock-2023-05-31",
            "system": system_prompt,
            "messages": [
                #{"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "max_tokens": 2000,
            "temperature": 0.8,
        }

        # Invoke the model
        response = bedrock_client.invoke_model(
            modelId=model_id,
            body=json.dumps(model_input),
            accept="application/json",
            contentType="application/json"
        )

        # Parse the model's response
        response_body = response["body"].read().decode("utf-8")  # Read and decode the StreamingBody
        model_response = json.loads(response_body)  # Parse JSON content
        output_text = model_response["content"][0]["text"]
        

        return {
            'statusCode': 200,
            "headers": {"Content-Type": "application/json"},
            'body': output_text,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"            
            }
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error processing request: {str(e)}")
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error processing request: {str(e)}")
        }




"""
TEST CASE:
{
  "resource": "/{proxy+}",
  "path": "/path/to/resource",
  "httpMethod": "POST",
  "headers": {
    "Accept": "*/*",
    "Content-Type": "application/json",
    "x-amzn-trace-id": "Root=1-xx-xx",
    "User-Agent": "Amazon APIGateway aws-sdk-java/1.11.940 Linux/4.9.0-15-amd64 OpenJDK_64-Bit_Server_VM/25.212-b12"
  },
  "queryStringParameters": null,
  "pathParameters": null,
  "stageVariables": null,
  "requestContext": {
    "resourceId": "xx",
    "resourcePath": "/{proxy+}",
    "httpMethod": "POST",
    "requestId": "xx",
    "requestTime": "xx",
    "path": "/path/to/resource",
    "accountId": "xx",
    "apiId": "xx",
    "identity": {
      "sourceIp": "xx"
    }
  },
  "body": "{\"userId\":\"jaja\"}",
  "isBase64Encoded": false
}
"""