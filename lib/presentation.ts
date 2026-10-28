import type { ScenarioPresentation } from '@/types/presentation';
export type { ScenarioPresentation } from '@/types/presentation';

export const presentation: ScenarioPresentation = {
  "id": "08-recruitment-screening",
  "name": "Recruitment Screening Assistant",
  "purpose": "Practical Support Engineer interview",
  "headline": [
    "An interview with depth."
  ],
  "summary": "Discuss your experience and practical support situations, one question at a time.",
  "featuresHeading": "Beyond starter",
  "features": [
    {
      "emoji": "💬",
      "title": "Six interview topics"
    },
    {
      "emoji": "🔎",
      "title": "Relevant follow-up questions"
    },
    {
      "emoji": "📋",
      "title": "Summary for human review"
    }
  ],
  "builtWith": [
    "Agora Conversational AI",
    "Agents SDK",
    "Next.js"
  ],
  "startLabel": "Start screening interview",
  "boundaryShort": "Candidate statements for human review. No automated hiring decision or stored interview record.",
  "outcomes": [
    {
      "id": "completed",
      "label": "I completed the interview"
    },
    {
      "id": "incomplete",
      "label": "I stopped before finishing"
    }
  ],
  "developer": {
    "sourceUrl": "https://github.com/AgoraIO-Conversational-AI/agent-quickstart-nextjs",
    "runCommand": "pnpm install\nagora login\nagora project use <your-project>\nagora project env write .env.local\npnpm dev",
    "skillsCommand": "npx skills add github:AgoraIO/skills",
    "assistantPrompt": "Use Agora Skills to work in the existing 08-recruitment-screening scenario checkout. Preserve the working Agora session lifecycle and business contracts. Help me adapt its business data and assistant instructions for my workflow.",
    "docsUrl": "https://docs.agora.io/en/ai/build/build-server-client",
    "sdkUrl": "https://www.npmjs.com/package/agora-agents",
    "consoleUrl": "https://console.agora.io/",
    "cliUrl": "https://github.com/AgoraIO/cli",
    "skillsUrl": "https://github.com/AgoraIO/skills",
    "extensionPoints": [
      {
        "title": "Change assistant instructions",
        "path": "lib/agent-config.ts"
      },
      {
        "title": "Adapt screening.ts",
        "path": "lib/recruitment-screening/screening.ts"
      },
      {
        "title": "Choose models and voice",
        "path": "app/api/invite-agent/route.ts"
      },
      {
        "title": "Adapt scenario UI content",
        "path": "lib/presentation.ts"
      }
    ]
  }
};

export function getScenarioPresentation(): ScenarioPresentation {
  return presentation;
}
