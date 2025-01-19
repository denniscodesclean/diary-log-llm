# Project Overview
- **Main Function**: Users write diary about their study progress, the app will generate insights including:
  -   Progress Summary
  -   Review Mechanism (pop-up quiz / flash cards)
  -   Future Study Plan Suggestion (Next Topic Suggestion)
- **Workflow Overview**:
  - Input: A app takes free-text as input;
  - Data Storage: Input triggers the first AWS Lambda (1) to transform it to structure data, store in [placeholder].
  - LLM Trigger Threshold: On-demand or on schedule (X logs detected, or X days passed), trigger second Lambda (2).
  - LLM: Use API call in Lambda (2), with dynamic prompt.
---

