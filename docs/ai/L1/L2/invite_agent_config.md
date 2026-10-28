# Scenario Agent Configuration

> Read when changing Support Engineer Screening Interview's prompt, tools, provider chain or turn detection.

## Source Files

- `lib/agent-config.ts`: role, workflow, guardrails and greeting.
- `lib/agent-config.ts`: selected prompt and default/tool mode context.
- `lib/agent-tools.ts`: optional tool origin validation, schemas and server-bound scope.
- `app/api/invite-agent/route.ts`: actual SDK builder and session options.
- `lib/runtime-profile.ts`: non-secret configured provider/model display.

There are no generic Ada/ADA_PROMPT constants to edit. Use the scenario config and prompt assembly actually imported by the invite route.

## Request And Startup

The invite body contains `requester_id` and `channel_name`. The invite route configures the longer silence window and LLM history for new sessions.

The server reads the App ID and App Certificate, builds AgoraClient with the selected area, and creates an Agent. The configured pipeline is Deepgram nova-3, OpenAI gpt-4o-mini and MiniMax speech_2_6_turbo. Copy the route's current builder pattern and createSession options; do not add an extra client argument or reproduce older SDK signatures.

The browser and invite route share DEFAULT_AGENT_UID. RTM, transcript/error delivery and metrics remain enabled. Session startup returns the Agent ID, creation timestamp and state; ending uses that same Agent ID.

## Prompt And Tools

Default behavior: Job requirements and interview topics are in the prompt. Candidate answers are summarized verbally; no candidate record is saved.

Tool behavior: The `save_screening_result` tool returns structured JSON with `review_status: human_review`. Despite its name, the endpoint does not persist results.

`save_screening_result` sends `candidate_id` and `answers` to `POST /api/scenarios/08-recruitment-screening/results`. `screening.ts` compares the modeled experience, skills, availability and interest fields against job requirements. Detailed incident examples can be discussed but are not fully represented in this result schema.

There is no applicant-tracking integration, durable interview record, hiring score, automatic rejection or offer. Candidate statements are not independently verified facts. Sensitive personal characteristics are not interview criteria.

## Provider And Turn Detection Changes

Edit the actual constructor blocks and turnDetection.config fields in the invite route. Provider BYOK examples are opt-in; keys stay server-side and are not part of the default two-key environment contract. For recruitment, preserve the configured 1,500 ms end-of-speech pause and 50-message LLM history unless intentionally changing interview pacing.

## Verification

Run `pnpm run verify:api`, `pnpm run verify:scenario` and canonical `pnpm run verify`. Real microphone pacing, interruptions and cloud HTTP execution require separate acceptance; mock Agent startup cannot establish those outcomes.

## See Also

- [Interfaces](../06_interfaces.md)
- [Workflows](../05_workflows.md)
- [Token model](token_model.md)
