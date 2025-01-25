import boto3
import json
from botocore.exceptions import ClientError

# Create a Bedrock Runtime client in the AWS Region of your choice.
client = boto3.client("bedrock-runtime", region_name="us-east-2")

# Inference Profile ARN - Replace with the ARN of your inference profile for Claude 3 Haiku.
model_id = "arn:aws:bedrock:us-east-2:324037274971:inference-profile/us.anthropic.claude-3-haiku-20240307-v1:0"

def lambda_handler(event, context):
    try:
        # Extract diary entries from the event
        diary_entries = event.get("diary_entries", [])
        if not diary_entries:
            return {
                'statusCode': 400,
                'body': json.dumps('No diary entries provided')
            }

        # System and User Prompts
        system_prompt = """
            You are a helpful and friendly study tutor. 
            Your role is to analyze study diaries and provide actionable feedback to improve users' study efficiency. 
            Speak in an encouraging and exciting tone to motivate users to keep studying. 
            Always ensure the analysis is user-specific and does not mix data between users.
            Respond in the same language as the input diary.
            """
        user_prompt = """
            Below are users study diary.
            Process the diary independently and provide an analysis based on the following JSON structure. 

            **JSON Structure**:
            {
                "user_id": user id,
                "field_of_study": summary the field of study in 10 words,
                "progress_summary": {
                    "total_hours_studied": Sum of studyTime,
                    "total_sessions": Count of entries,
                    "summary": Provide a summary of progress for all entries. Use direct, conversational language, starting with 'You'.
                },
                "review_suggestions": {
                    "key_concepts": Provide key concepts for review with brief definition,
                    "questions": Provide 2 questions for review.
                },
                "next_study_topic_suggestion": Suggest the next topic to study and briefly explain how it relates to the user's progress. Use direct, conversational language, starting with 'You'.
            }

            **Instructions**:
            - Ensure the JSON output strictly adheres to the structure provided.
            - Do not let data from one user influence another.
            - Provide one JSON object per user.

            **Diary**:
            """ 

        final_user_prompt = user_prompt + json.dumps(diary_entries)

        # Construct the request payload
        model_input = {
            "anthropic_version": "bedrock-2023-05-31",
            "system": system_prompt,
            "messages": [
                #{"role": "system", "content": system_prompt},
                {"role": "user", "content": final_user_prompt},
            ],
            "max_tokens": 512,
            "temperature": 0.7,
        }

        # Invoke the model
        response = client.invoke_model(
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
            'body': output_text
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps(f"Error processing request: {str(e)}")
        }
