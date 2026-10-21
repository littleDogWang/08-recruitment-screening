# 06 Recruitment screening

`job.json` defines job-related requirements. `screening.ts` maps candidate
facts to matched and missing fields, and the results API always returns
`human_review`. Sensitive personal information is excluded from scoring.

The interviewer covers incident ownership, API troubleshooting, network diagnosis,
production incident response, customer communication, and resolution/prevention.
Each topic has a practical main question and up to two follow-ups, asked one at a
time when evidence is missing. `config.ts` includes the `job.json` questions in
the agent prompt. End-of-speech detection allows 1,500 ms thinking pauses.

The results endpoint returns JSON without storing it. Technical examples and
earliest start date can be discussed and summarized in the conversation; the
results schema only models experience, skills, availability, and interest.

## Reference cases

The local research catalogue groups these references under recruitment screening:

- [Build an AI Recruiter Voice Agent | Vapi + n8n Tutorial](https://vapi.ai/library/build-an-ai-recruiter-voice-agent-vapi-n8n-tutorial)
- [Automated HR Screening with VAPI AI Calls, Gemini Analysis & Google Sheets](https://n8n.io/workflows/5790-automated-hr-screening-with-vapi-ai-calls-gemini-analysis-and-google-sheets/)
- [Automated Phone Interview Evaluation with Vapi, GPT-4o & Google Sheets](https://n8n.io/workflows/7401-automated-phone-interview-evaluation-with-vapi-gpt-4o-and-google-sheets/)

The catalogue describes candidate outreach, transcription, structured feedback,
and Google Sheets integration. It does not identify a single template as the exact
source of this implementation. The Support Engineer requirements and questions
are local fixtures. These references do not establish a live external integration.


## Local conversation and optional tools

Default conversations retain the job.json requirements and six interview topics already embedded in the prompt. The assistant gathers candidate statements and verbally summarizes facts for human review; it does not save records or make hiring decisions. The optional tool returns a structured result only, without durable persistence.

TOP_TEN_SCENARIO_TOOL_BASE_URL is optional. Only an explicitly configured public HTTPS endpoint enables tools; malformed, HTTP, localhost and local/private origins leave tools disabled. URL validation does not prove network reachability. No tunnel, knowledge base or database is needed for the default conversation. Local checks do not establish live speech or cloud callback acceptance.
