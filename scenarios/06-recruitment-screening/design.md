# Recruitment screening design

## Positioning

Priority P6. Validate structured questions and human review without automated hiring decisions.

## Target flow

Using fixed job requirements, the Agent asks about basic qualifications, experience, start date and interest, then produces a structured screening record for human review.

Cover six practical Support Engineer topics: incident ownership, API troubleshooting,
network diagnosis, production incident response, customer communication, and
resolution/prevention. Ask one question per turn, follow up on missing evidence or
personal actions, and avoid repeating facts already provided. Separate hypothetical
reasoning from past experience.

End-of-speech detection waits for 1,500 ms of silence, preserving candidate barge-in.
Both the agent and LLM retain 50 history messages for the longer interview. Changes
apply to new sessions and require live microphone acceptance.

## First release scope

- Input: job requirements and basic candidate information.
- Output: answers, missing fields, rule matches and human review status.
- Channel: simulated Web/RTC calls.
- Excluded: real outbound calls, ATS writes, automated rejection and decisions based on sensitive personal information.

The results endpoint returns JSON without persistence. Technical examples and
start date remain in the conversation summary, outside the existing typed result
fields. Do not claim they were saved externally.

## Safety boundaries

Record only job-related facts and candidate statements. Do not make screening decisions based on age, gender, health, ethnicity or other sensitive information.
