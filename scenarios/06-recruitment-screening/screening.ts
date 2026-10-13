import jobData from './job.json';

export interface ScreeningAnswers {
  years_experience?: number;
  skills?: string[];
  availability?: string;
  interest?: string;
}

export interface ScreeningResult {
  candidate_id: string;
  job_id: string;
  answers: ScreeningAnswers;
  matched_requirements: string[];
  missing_requirements: string[];
  review_status: 'human_review';
  created_at: string;
}

export function evaluateJobFacts(answers: ScreeningAnswers): Pick<
  ScreeningResult,
  'matched_requirements' | 'missing_requirements'
> {
  const matched: string[] = [];
  const missing: string[] = [];
  const requirements = jobData.requirements;
  if ((answers.years_experience ?? 0) >= requirements.minimumYearsExperience) {
    matched.push('minimum experience');
  } else {
    missing.push('minimum experience');
  }
  const skills = new Set((answers.skills ?? []).map((skill) => skill.toLowerCase()));
  for (const requiredSkill of requirements.requiredSkills) {
    (skills.has(requiredSkill) ? matched : missing).push(requiredSkill);
  }
  if (answers.availability?.toLowerCase() === requirements.availability) {
    matched.push('availability');
  } else {
    missing.push('availability');
  }
  return { matched_requirements: matched, missing_requirements: missing };
}

export const RECRUITMENT_JOB = jobData;
