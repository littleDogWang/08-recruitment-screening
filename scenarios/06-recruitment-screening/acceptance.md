# Recruitment screening acceptance criteria

## Required checks

- Question order matches the job requirements.
- Answers map to explicit fields; missing information stays missing.
- Output includes human review status without making hiring or rejection decisions.
- Sensitive information is not used for automated scoring.
- Confirmed facts remain in the conversation summary when the user declines to answer or ends early; do not claim persistence.
- The outgoing agent configuration uses 1,500 ms of end-of-speech silence and preserves candidate barge-in.
- In a microphone test, 500-1,000 ms pauses within an answer do not trigger the next question.
- Cover all six practical topics unless already answered, skipped, or ended by the candidate.
- Ask one question per turn; follow up on vague answers with requests for evidence, personal actions, or verification.
- Do not reveal model answers before the candidate responds; distinguish experience from hypothetical reasoning.

## Suggested cases

1. Answer all job requirement questions.
2. Omit the start date.
3. Decline an unnecessary question.
4. Volunteer sensitive information.
5. End early and proceed to human review.
6. Describe an incident with several 500-1,000 ms pauses; confirm the interviewer waits until the answer finishes.
7. Give a vague API troubleshooting answer; confirm a follow-up asks for diagnostic evidence.
8. Include escalation in an earlier incident answer; confirm the interviewer avoids repeating answered questions.
9. Complete all six topics with follow-ups; confirm earlier facts remain accurate in the closing summary.

Live microphone checks remain required; passing API or build checks alone does not establish conversational behavior.

## Evidence

- Structured screening JSON.
- Scoring/rule input and output comparison.
- Test records showing sensitive information did not influence conclusions.
