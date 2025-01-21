# Project Overview
## Main Function
- Users write diary about their study progress, the app will generate insights including:
  -   Progress Summary
  -   Review Mechanism (pop-up quiz / flash cards)
  -   Future Study Plan Suggestion (Next Topic Suggestion)
## Workflow Overview
  - **Input**: A app takes free-text as input;
  - **Data Storage**: Input triggers the first AWS Lambda (1) to transform it to structure data, store in AWS S3 (As of 2025.1.20).
  - **LLM Trigger Threshold**: On-demand or on schedule (X logs detected, or X days passed), trigger second Lambda (2).
  - **LLM**: Use API call in Lambda (2), with dynamic prompt.


# Diary Loggin Feature
## Front End
- Create a simple form for users to log their diary entries with fields like:
  - Free text input for the diary.
  - Optional fields for metadata (e.g., time spent studying, subject, tags).
- Use a lightweight frontend library [PlaceHolder] to start.
- Ensure proper input validation.
## Back End
- Lambda (1)
  - Input Submission Handling, store structure data with pre-defined schema.

| User_id | Project_id | Log_Time | Dropdown1 | Dropdown2  | Diary_Content |
| ----------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| user_01 | project_01 | 2025-01-19 13:21:00 | [PlaceHolder] | [PlaceHolder] | Today, I learned about XGBoost on Datacamp, including the basic concepts, its comparison with Random Forest... |
| user_01 | project_02 | 2025-01-19 13:21:00 | [PlaceHolder] | [PlaceHolder] | I started a project to create a LLM-based study log appilcation, here is my plan... |


# Diary Retrieval Mechanism

# Integrate LLM for Simple Analysis


