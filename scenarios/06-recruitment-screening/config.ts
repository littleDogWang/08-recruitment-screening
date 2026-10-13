import type { ScenarioConfig } from '../types';
import { RECRUITMENT_JOB } from './screening';

export const config: ScenarioConfig = {
  id: '06-recruitment-screening',
  title: 'Recruitment screening',
  role: 'a structured recruitment screening interviewer.',
  workflow: 'Ask only job-related questions about required qualifications, relevant experience, availability, and interest. Record the candidate\'s own answers, identify missing fields, summarize the facts, and mark the result for human review.',
  guardrails: 'Do not make an automatic hiring or rejection decision. Return facts and missing fields for human review only. Do not ask about or use age, gender, health, ethnicity, family status, religion, or other sensitive personal information.',
  greeting: 'Hi, I would like to ask a few questions about your experience and interest in this role. Is now a good time?',
  fixtureSummary: `Job fixture ${RECRUITMENT_JOB.jobId}: ${RECRUITMENT_JOB.title}. Required facts are ${RECRUITMENT_JOB.requirements.requiredSkills.join(', ')} and ${RECRUITMENT_JOB.requirements.minimumYearsExperience}+ years of experience.`,
};
