# 02 Architecture

> Topology and state ownership for Support Engineer Screening Interview.

## Components

One Next.js App Router process serves the browser and routes. RTC carries audio; RTM carries transcript, Agent state, metrics and errors. The server SDK manages the cloud STT/LLM/TTS Agent. Scenario files define the business behavior.

## Data And Event Flow

The user start action creates any necessary scenario session, fetches the combined RTC/RTM token and bootstraps RTM plus invite. RTC/microphone hooks wait for the StrictMode guard. Toolkit events feed transcript and Inspector. Renew both token identities consistently; end calls stop, logs out RTM and unmounts hook-owned resources.

The invite body contains `requester_id` and `channel_name`. The invite route configures the longer silence window and LLM history for new sessions.

`save_screening_result` sends `candidate_id` and `answers` to `POST /api/scenarios/06-recruitment-screening/results`. `screening.ts` compares the modeled experience, skills, availability and interest fields against job requirements. Detailed incident examples can be discussed but are not fully represented in this result schema.

## Ownership Boundaries

LandingPage owns pre-call bootstrap/RTM; ConversationComponent owns joined RTC/toolkit subscriptions. Token/invite/stop routes own privileged operations. `scenarios/06-recruitment-screening/` owns business rules/data; tool-contracts owns server-bound tool execution scope. Session evidence and manually selected outcomes are not automatic proof of business completion.

## Runtime Modes

Local development runs one Next.js process at http://localhost:3000 using `.env.local`. Native production uses `pnpm run build` then `pnpm run start`. Docker runs the same app as non-root UID 1001 on port 3000, without a reverse proxy inside the image. A Next.js deployment can serve the voice app and stateless result endpoint. No database is included. Add your own durable, authorized ATS integration before claiming saved interview results.

Docker embeds the public App ID at build and receives the certificate only at runtime. It copies the actual runtime fixtures and supplies a non-root-owned data directory. File-backed scenarios require a retained writable volume; process-local scenarios require a single long-lived process. See [full architecture](../../../ARCHITECTURE.md).

## Related Deep Dives

- [Lifecycle](L2/conversation_lifecycle.md)
- [Tokens](L2/token_model.md)
