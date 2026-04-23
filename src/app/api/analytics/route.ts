import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, category, budget, session_id } = body;

    // Validate
    if (!event) {
      return NextResponse.json(
        errorResponse('Event name required'),
        { status: 400 }
      );
    }

    // Log to console for Phase 0 (Supabase in Phase 1+)
    console.log('[ANALYTICS]', {
      event,
      category,
      budget,
      session_id,
      timestamp: new Date().toISOString(),
    });

    // In Phase 1, this will save to Supabase
    // For now, just acknowledge receipt

    return NextResponse.json(
      successResponse({ logged: true, event })
    );
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
