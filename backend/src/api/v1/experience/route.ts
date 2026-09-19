import { NextRequest } from 'next/server';
import { ok, Errors } from '@/src/lib/api/utils';
import {
  createExperience,
  getAllExperiences,
  getExperiencesByDestination,
} from '@/src/lib/api/experienceStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get('destinationId');

    if (destinationId) {
      const experiences = getExperiencesByDestination(destinationId);
      return ok({ experiences });
    }

    const experiences = getAllExperiences();
    return ok({ experiences });
  } catch (err) {
    console.error('[GET /api/v1/experience]', err);
    return Errors.internalError();
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return Errors.badRequest('Invalid JSON body');
    }

    const { destinationId, rating, text, photos, userId } = body;

    if (!destinationId || !rating || !text) {
      return Errors.badRequest('destinationId, rating, and text are required');
    }

    // Usually we would extract userId from the auth token, but we'll accept it from the body for the mock
    const finalUserId = userId || 'anonymous_traveler';

    const experience = createExperience({
      destinationId,
      rating: Number(rating),
      text,
      photos: Array.isArray(photos) ? photos : [],
      userId: finalUserId,
    });

    return ok({ experience });
  } catch (err) {
    console.error('[POST /api/v1/experience]', err);
    return Errors.internalError();
  }
}
