import type { LlmTool } from 'agora-agents';
type Property = Record<string, unknown>;
function tool(baseUrl: string, name: string, description: string, method: 'GET' | 'POST', path: string, properties: Property, required: string[], body?: Record<string, unknown>): LlmTool {
  return { type: 'function', function: { name, description, parameters: { type: 'object', properties, required } }, server: { method, url: `${baseUrl.replace(/\/$/, '')}${path}`, ...(body ? { body } : {}) } };
}
export function getScenarioTools(_scenarioId: string, baseUrl = process.env.TOP_TEN_SCENARIO_TOOL_BASE_URL): LlmTool[] {
  if (!baseUrl) return [];
  const stringProperty = { type: 'string' };
  const integerProperty = { type: 'integer' };
  return [
        tool(baseUrl, 'save_screening_result', 'Create a factual screening result for human review.', 'POST', '/api/scenarios/06-recruitment-screening/results', { candidate_id: stringProperty, answers: { type: 'object' } }, ['candidate_id', 'answers'], { candidate_id: '{{args.candidate_id}}', answers: '{{args.answers}}' }),
      ];
}
