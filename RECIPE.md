# Support Engineer Screening Interview

Collect practical candidate evidence for human review.

[Try locally](#2-try-the-demo) · [Source on GitHub](https://github.com/littleDogWang/06-recruitment-screening) · [Build with AI](#build-with-ai)

TypeScript · Web · Next.js 16 / React 19 · Agora Conversational AI

## 1. Overview

A structured Support Engineer screening interviewer covers six practical topics: incident ownership, API troubleshooting, network diagnosis, production incident response, customer communication, and resolution/prevention. It asks one question at a time and follows up when evidence is missing.

- Six job-related main questions with up to two targeted follow-ups per topic.
- A 1,500 ms end-of-speech pause and 50-message LLM history for longer interview answers.
- A factual summary and optional structured human-review response, without automatic hiring decisions.

**Default conversation:** Job requirements and interview topics are in the prompt. Candidate answers are summarized verbally; no candidate record is saved.

**With business tools enabled:** The `save_screening_result` tool returns structured JSON with `review_status: human_review`. Despite its name, the endpoint does not persist results.

**Scope:** There is no applicant-tracking integration, durable interview record, hiring score, automatic rejection or offer. Candidate statements are not independently verified facts. Sensitive personal characteristics are not interview criteria.

## 2. Try the Demo

Run [Quick Start](#5-quick-start), open [http://localhost:3000](http://localhost:3000), allow microphone access and choose **Start screening interview**. A voice session starts only after your action. The Agora project must be configured even in default conversation mode; “local data” does not mean offline speech or a local LLM.

| Try | Say | Expected behavior |
| --- | --- | --- |
| Discuss experience | I handled a production API outage in my previous support role. | It asks for specific actions, evidence and outcomes, one question at a time. |
| Use a hypothetical | I have not handled that incident personally, but here is how I would investigate it. | It accepts hypothetical reasoning and does not present it as past experience. |
| Pause or skip | Give me a moment to think. Then I would like to skip this question. | It respects the pause and skip, and marks the unanswered area for human review. |

Rows that describe tool actions require the optional public HTTPS tool configuration. In default mode, expect the limitations described above. These are acceptance cases to try, not a claim that a live voice run has passed. For the full scenario matrix, see [acceptance.md](scenarios/06-recruitment-screening/acceptance.md).

## 3. Architecture & Tech Stack

```mermaid
flowchart LR
  User["Browser: microphone, transcript and controls"]
  Server["Next.js API: tokens, invite and stop"]
  RTC["Agora RTC: voice audio"]
  RTM["Agora Signaling: transcript and Agent events"]
  Agent["Agora Conversational AI: STT → LLM → TTS"]
  Context["Scenario instructions and local data"]
  User -->|HTTPS| Server
  Server -->|start / stop| Agent
  Context --> Server
  User <-->|audio| RTC
  RTC <-->|audio| Agent
  Agent --> RTM
  RTM --> User
  Agent -. optional HTTPS tool calls .-> Business["This app's scenario API"]
  Business --> Data["Read-only fixture data"]
```

| Component | Role |
| --- | --- |
| Agora RTC | Carries user microphone audio and synthesized Agent speech. |
| Agora Signaling (RTM) | Delivers transcript, Agent state, metrics and error events to the browser. |
| Agora Conversational AI | Runs the managed voice pipeline and configured business tools. |
| Next.js route handlers | Keep the App Certificate server-side, issue combined RTC/RTM tokens and manage Agent sessions. |
| Scenario modules | Supply instructions, demo data and the optional business API/tool contracts. |

The client uses `agora-rtc-react`, `agora-rtc-sdk-ng`, `agora-rtm` and `agora-agent-client-toolkit`; the server uses `agora-agents`. The configured pipeline is Deepgram nova-3 → OpenAI gpt-4o-mini → MiniMax speech_2_6_turbo with English speech. See [the invite route](app/api/invite-agent/route.ts) and [runtime profile](scenarios/runtime-profile.ts) when changing providers. No separate vendor API key is required for the default Agora-managed configuration.

## 4. Prerequisites & Configuration

- Node.js 22 or newer and pnpm 9.15.9.
- An Agora project with its App Certificate enabled, and access to RTC, Signaling and Conversational AI.
- Access to this repository. Cloning or sharing the source requires appropriate repository permissions.
- A browser with microphone access; use HTTPS for a hosted app.

| Variable | Required? | Where / purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_AGORA_APP_ID` | Required | App ID from your Agora Console project. |
| `NEXT_AGORA_APP_CERTIFICATE` | Required | App Certificate from the same project; server-side only. |
| `TOP_TEN_SCENARIO_TOOL_BASE_URL` | Optional | Public HTTPS origin of this same app, reachable by Agora cloud; enables the business tools described below. |

Create or select your project in [Agora Console](https://console.agora.io/), copy the App ID and enable/copy its App Certificate. Put them in `.env.local` using [env.local.example](env.local.example). Never prefix the certificate with `NEXT_PUBLIC_`, put it in client code or commit it.

Leave `TOP_TEN_SCENARIO_TOOL_BASE_URL` unset for the default conversation. To enable tools, deploy the same app at a reachable public HTTPS origin, set that variable on the server, restart/redeploy and start a fresh conversation. HTTP, localhost/private origins, malformed URLs and URLs with credentials, query or fragment are rejected. URL validation does not establish actual cloud reachability. In tool mode, a failed call must not be disguised as a successful fixture-based action.

## 5. Quick Start

From a terminal, clone this scenario rather than the generic starter:

```bash
git clone https://github.com/littleDogWang/06-recruitment-screening.git
cd 06-recruitment-screening
pnpm install --frozen-lockfile
cp env.local.example .env.local
```

Edit `.env.local` and fill the two required Agora values from section 4. Then run these commands from the cloned repository root:

```bash
pnpm run doctor
pnpm run dev
```

Alternatively, if the [Agora CLI](https://github.com/AgoraIO/cli) is already installed, bind your project with `agora login`, `agora quickstart env write . --template nextjs --project <your-project> --json` instead of manually copying credentials. Use your actual project identifier in place of `<your-project>`.

Open [http://localhost:3000](http://localhost:3000), choose **Start screening interview**, allow the microphone and try the first conversation above. Check that you can hear the assistant and see both speakers in the transcript. Then verify the scenario result under the configured mode; a transcript alone does not establish that a business action occurred.

## 6. How It Works

| User step | Assistant / application behavior | Result |
| --- | --- | --- |
| Agree to the interview | Establish role interest and relevant experience. | A consented screening conversation. |
| Answer practical topics | Ask one main question and only relevant follow-ups; acknowledge already supplied evidence. | Six-topic coverage or explicit skipped areas. |
| Discuss availability and review | Summarize confirmed facts and gaps, then request correction. | A human-review summary; a configured tool can return structured facts without storing them. |

### Tools and result semantics

`save_screening_result` sends `candidate_id` and `answers` to `POST /api/scenarios/06-recruitment-screening/results`. `screening.ts` compares the modeled experience, skills, availability and interest fields against job requirements. Detailed incident examples can be discussed but are not fully represented in this result schema.

The invite body contains `requester_id` and `channel_name`. The invite route configures the longer silence window and LLM history for new sessions. The supplied browser already handles this startup sequence. See [the scenario guide](scenarios/06-recruitment-screening/README.md) for additional behavior and contracts.

## 7. Customize for Your Business

| Change | Source | How |
| --- | --- | --- |
| Role requirements and questions | [job.json](scenarios/06-recruitment-screening/job.json) | Replace the Support Engineer requirements, six topics and follow-up options. |
| Interview behavior | [config.ts](scenarios/06-recruitment-screening/config.ts) | Adapt question order, skip behavior, evidence requests and review language. |
| Structured result | [screening.ts](scenarios/06-recruitment-screening/screening.ts) | Keep factual matches and missing fields separate; synchronize the result route and tool schema when adding fields. |

To screen another technical role, replace job.json and try one detailed answer, one vague answer and one skipped topic. If your ATS needs detailed incident evidence, extend the typed schema and add authenticated persistence; renaming the tool does not save a candidate record.

Shared integration points:

- [scenarios/index.ts](scenarios/index.ts) assembles the selected scenario prompt.
- [scenarios/tool-contracts.ts](scenarios/tool-contracts.ts) defines business tool schemas and server-bound routes.
- [app/api/invite-agent/route.ts](app/api/invite-agent/route.ts) selects the prompt, providers, turn detection and session settings.
- [scenarios/presentation.ts](scenarios/presentation.ts) selects the scenario presentation; edit its scenario module for visible content.
- [docs/ai/RECIPE.md](docs/ai/RECIPE.md) retains the machine-readable integration profile and lifecycle contracts.

Keep combined RTC/RTM token generation, the StrictMode initialization guard, toolkit local-user UID remapping and interrupted transcript turns intact. Let the Agora React hooks own microphone and RTC teardown. Preserve server-bound business session scope when extending tools.

### Build with AI

After cloning this repository, paste the following into your coding agent from your own application workspace, providing the path to the clone:

```text
Implement the Support Engineer Screening Interview recipe in my application.

Read RECIPE.md in the cloned 06-recruitment-screening repository first, then inspect
its scenario modules, tool contracts and invite route. Read docs/ai/RECIPE.md
and AGENTS.md in that repository for integration constraints.

Inspect my application's existing stack and instructions before editing.
Reuse the source's RTC/RTM token, session and transcript patterns.
Implement the scenario's default conversation first, then connect only the
business tools I request. Keep demo data and real service results distinct.
Explain the credentials and configuration I need to supply.
Ask before adding dependencies. Follow my rules for local edits, verification,
commits and remote writes. Verify the result without claiming unrun live tests.
```

This prompt is a source-guided integration entry point, not a published scaffolding package or an automatic Console import.

## 8. Deployment & Validation

### Deploy

A Next.js deployment can serve the voice app and stateless result endpoint. No database is included. Add your own durable, authorized ATS integration before claiming saved interview results.

Install dependencies and set the same required environment variables in your deployment platform's secret store. Build with `pnpm run build` and, on a Node host, start with `pnpm run start`. Keep the public app on HTTPS. For voice tools, set `TOP_TEN_SCENARIO_TOOL_BASE_URL` to the deployed app's reachable HTTPS origin and verify cloud callbacks against that same running instance.

These commands describe the repository's supported scripts; they do not attest to an existing deployment. Before opening sample endpoints to real users, add application authentication, authorization and appropriate request limits.

### Docker deployment

```bash
docker build --build-arg NEXT_PUBLIC_AGORA_APP_ID=YOUR_AGORA_APP_ID -t 06-recruitment-screening:local .
docker run --rm -p 3000:3000 --env-file .env.local 06-recruitment-screening:local
```

Replace `YOUR_AGORA_APP_ID` with the public App ID used in `.env.local`. Next.js embeds that identifier in the browser bundle, so changing projects requires rebuilding the image. The App Certificate is supplied only at container runtime. A container restart does not preserve process memory. This image does not add a shared state service.

`pnpm run verify:docker` independently builds the image with synthetic credentials, starts an isolated localhost-bound container, checks the home page and a scenario route, then removes only that container. It does not contact Agora or prove a live voice session.

### Check locally

From this repository root:

```bash
pnpm run verify:template
pnpm run lint
pnpm run typecheck
pnpm run verify:api
pnpm run verify:scenario
pnpm run build
```

With the local prerequisites and credentials configured, also run `pnpm run verify`. The canonical verify script includes all of the local scenario checks above; Docker is deliberately verified separately. Local checks do not require a real microphone call and do not prove cloud tool execution.

### Verify a real conversation

1. Start a fresh voice session; check two-way audio and both transcript speakers.
2. Try the normal, correction and unsupported/failure paths in section 2.
3. Check follow-up depth, a thinking pause, a skip and an early end with real speech. Inspect a structured response for human_review and missing fields. API checks alone cannot establish interview pacing or candidate experience.
4. End the call and confirm that microphone publication and the Agent session stop. Keep evidence of the actual result separately from the transcript.

### Troubleshooting

| Symptom | Check |
| --- | --- |
| Agent does not join | Check the token/invite response and run pnpm run doctor. If using the Agora CLI, run agora project doctor --deep. |
| Audio works but transcript is missing | Check RTM login/subscription and keep RtcTokenBuilder.buildTokenWithRtm in the token route. |
| Browser has no microphone | Grant permission, select an input device and use localhost or a secure HTTPS page. |
| The assistant discusses the task but does not save or change it | Check whether the optional public tool origin is enabled. The default conversation has the limits in section 1. |
| A tool fails or a result disappears | Inspect the actual API error, callback reachability and this scenario's storage/lifetime limits; do not claim success from speech alone. |

See [the contributor guide](AGENTS.md), [scenario guide](scenarios/06-recruitment-screening/README.md) and [MIT License](LICENSE) for further details.
