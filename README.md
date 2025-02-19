# Project Description
Web App: https://diary-log.s3.us-east-2.amazonaws.com/index.html

This web app is designed to serve as a study buddy. It's designed for users to keep track of the progress for their school work, projects, self-study journey...
In the form of diary, users can log their study plan, achievements at each stage, obstacles they ran into and so on. The app will provide feedback aim to help users track their progress systematically, provide recap, and suggestion for next step.

So far the insights including:
  -   Progress Summary
  -   Review Mechanism (maybe pop-up quiz / flash cards in the future?)
  -   Future Study Plan Suggestion (Next Topic Suggestion)
---
    
# Workflow Overview
  - **Background** All components are hosted on AWS.
  - **Sign up / Log in** This part is done via Firebase in JavaScript. After sign in, users will have access to their own data.
  - **Input**: A web-app hosted in S3 takes free-text as input;
  - **Data Storage**: Input send a POST request to API Gateway and triggers an AWS Lambda Function to store JSONs in the user's own file path in AWS S3.
  - **Data Extraction**: By clicking 'View Past Entries', user will send a GET request to API Gateway with their unique user_id, trigger a Lambda Function to get object from S3 and returned to the web.
  - **LLM Calling**: By clicking 'LLM Analysis', a GET request is sent to API Gateway, triggering a Lambda Function that get all previous entries from S3 and invoke Claude model thru AWS Bedrock. A prompt is designed to ask LLM to provide insights based on past entries and output in JSON format.

---
# Active Action Items
| Area | Priority | Status | Item |
| ----------- | ----------- | ----------- | ----------- |
| All | 1 | X | Include 'Theme' in QueryParameters when sending GET request to call LLM to support to support filtering on entries by project. |
| All | 1 | X | Include 'Date Range' in QueryParameters when sending GET request to call LLM to support filtering on entries by entry time. |
| All | 1 | X | Support deleting previous entries. |
| LLM | 2 | X | Explore Bedrock Prompt Mamangement, to manage prompt and model selection. |
| Backend | 2 | X | Explore RAG and DynamoDB. |
| All | 3 | X | Chatbot Interface. |
