# Support Engineer Screening Interview Architecture

## System Overview

A structured Support Engineer screening interviewer covers six practical topics: incident ownership, API troubleshooting, network diagnosis, production incident response, customer communication, and resolution/prevention. It asks one question at a time and follows up when evidence is missing.

One Next.js process owns the browser application and its HTTP routes. Agora cloud owns the managed STT → LLM → TTS pipeline; the browser is not a local speech/model runtime. The default provider configuration is recorded in the invite route and `lib/runtime-profile.ts`.

## Component Topology

```text
Browser microphone <-> Agora RTC <-> managed Agent
Browser transcript <- Agora RTM <- managed Agent
Browser -- HTTPS --> Next.js token / invite / stop routes
Agent -- optional public HTTPS --> same Next.js scenario routes
Scenario routes -> read-only local fixtures
```

## Request And Event Flow

1. The user's start action bootstraps scenario state when needed, then fetches a combined RTC/RTM token.
2. The browser logs into/subscribes to RTM and invites the managed Agent. The invite body contains `requester_id` and `channel_name`. The invite route configures the longer silence window and LLM history for new sessions.
3. RTC hooks join and publish the microphone after the StrictMode guard; the toolkit binds both transports.
4. Audio travels over RTC. Transcript, Agent state, errors and reported latency travel over RTM.
5. `save_screening_result` sends `candidate_id` and `answers` to `POST /api/scenarios/08-recruitment-screening/results`. `screening.ts` compares the modeled experience, skills, availability and interest fields against job requirements. Detailed incident examples can be discussed but are not fully represented in this result schema.
6. Renewal keeps the joined RTC UID, RTM login UID and channel consistent.
7. Ending stops the Agent, logs out RTM and unmounts hook-owned RTC/microphone resources. Retained evidence is not itself a saved business result.

## Ownership Boundaries

- `components/LandingPage.tsx`: browser startup, RTM bootstrap, renewal and end orchestration.
- `components/ConversationComponent.tsx`: RTC/microphone hooks, toolkit events and transcript snapshots.
- `app/api/generate-agora-token/route.ts`: RTM-capable token creation.
- `app/api/invite-agent/route.ts`: privileged Agent configuration and startup.
- `lib/recruitment-screening/`: source of truth for scenario-specific rules and data.
- `lib/agent-tools.ts`: available tools, parameter schemas and server-bound call scope.
- `lib/conversation.ts`: transcript UID/text normalization.

## Authentication And Secrets

The App Certificate stays in the Next.js server environment. Tokens are scoped/expiring; the browser receives tokens rather than the certificate. The public App ID is embedded into the client build and must match the server's project. Sample endpoints do not implement production user authentication. Business capabilities/session IDs limit example scope where implemented; they are not real customer/patient identity verification.

## Runtime Modes

Local development runs one Next.js process at http://localhost:3000 using `.env.local`. Native production uses `pnpm run build` then `pnpm run start`. Docker runs the same app as non-root UID 1001 on port 3000, without a reverse proxy inside the image. A Next.js deployment can serve the voice app and stateless result endpoint. No database is included. Add your own durable, authorized ATS integration before claiming saved interview results.

```bash
docker build --build-arg NEXT_PUBLIC_AGORA_APP_ID=YOUR_AGORA_APP_ID -t 08-recruitment-screening:local .
docker run --rm -p 3000:3000 --env-file .env.local 08-recruitment-screening:local
```

Replace `YOUR_AGORA_APP_ID` with the public App ID used in `.env.local`. Next.js embeds that identifier in the browser bundle, so changing projects requires rebuilding the image. The App Certificate is supplied only at container runtime. A container restart does not preserve process memory. This image does not add a shared state service.

`pnpm run verify:docker` independently builds the image with synthetic credentials, starts an isolated localhost-bound container, checks the home page and a scenario route, then removes only that container. It does not contact Agora or prove a live voice session.

## API And External Contracts

The invite body contains `requester_id` and `channel_name`. The invite route configures the longer silence window and LLM history for new sessions.

The token route returns `{ token, uid, channel }`; stop accepts `{ agent_id }` and handles an already-stopping session idempotently. Job requirements and interview topics are in the prompt. Candidate answers are summarized verbally; no candidate record is saved. The `save_screening_result` tool returns structured JSON with `review_status: human_review`. Despite its name, the endpoint does not persist results.

See [Interfaces](docs/ai/L1/06_interfaces.md), [internal recipe](docs/ai/RECIPE.md) and [scenario guide](docs/scenario/README.md) for contracts. Static checks, native startup, Docker startup and complete live speech/tool outcomes are separate evidence.
