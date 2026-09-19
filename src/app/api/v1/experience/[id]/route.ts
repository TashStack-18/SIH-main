import { NextRequest } from 'next/server';
import { ok, Errors } from '@/src/lib/api/utils';
import { getExperienceById } from '@/src/lib/api/experienceStore';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const experience = getExperienceById(id);

    if (!experience) {
      return Errors.notFound('Experience not found');
    }

    return ok({ experience });
  } catch (err) {
    console.error('[GET /api/v1/experience/[id]]', err);
    return Errors.internalError();
  }
}
