import { NextRequest } from 'next/server';
import { ok, Errors } from '@/src/lib/api/utils';
import { getExperienceById, deleteExperience } from '@/src/lib/api/experienceStore';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolved = await params;
    const id = resolved?.id ? decodeURIComponent(resolved.id) : '';
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> | { id: string } }) {
  try {
    const resolved = await params;
    const id = resolved?.id ? decodeURIComponent(resolved.id) : '';
    const success = deleteExperience(id);

    if (!success) {
      return Errors.notFound('Experience not found');
    }

    return ok({ message: 'Experience deleted successfully', id });
  } catch (err) {
    console.error('[DELETE /api/v1/experience/[id]]', err);
    return Errors.internalError();
  }
}
