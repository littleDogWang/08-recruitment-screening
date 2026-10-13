import { NextResponse } from 'next/server';
import {
  evaluateJobFacts,
  RECRUITMENT_JOB,
  type ScreeningAnswers,
} from '@/scenarios/06-recruitment-screening/screening';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      candidate_id?: unknown;
      answers?: unknown;
    };
    if (
      typeof body.candidate_id !== 'string' ||
      !body.candidate_id.trim() ||
      typeof body.answers !== 'object' ||
      body.answers === null ||
      Array.isArray(body.answers)
    ) {
      return NextResponse.json(
        { error: 'candidate_id and answers are required' },
        { status: 400 },
      );
    }
    const answers = body.answers as ScreeningAnswers;
    return NextResponse.json({
      candidate_id: body.candidate_id.trim(),
      job_id: RECRUITMENT_JOB.jobId,
      answers,
      ...evaluateJobFacts(answers),
      review_status: 'human_review',
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'invalid request' },
      { status: 400 },
    );
  }
}
