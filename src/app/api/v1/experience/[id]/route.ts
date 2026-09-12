import { NextRequest } from 'next/server';
import { ok, Errors } from '@/src/lib/api/utils';
import { getExperienceById } from '@/src/lib/api/experienceStore';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const experience = getExperienceById(params.id);

    if (!experience) {
      return Errors.notFound('Experience not found');
    }

    return ok({ experience });
  } catch (err) {
    console.error('[GET /api/v1/experience/[id]]', err);
    return Errors.internalError();
  }
}
