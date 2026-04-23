import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, validateEmail } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, category, budget } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        errorResponse('Invalid email address'),
        { status: 400 }
      );
    }

    // Log to console for Phase 0 (Supabase in Phase 1+)
    console.log('[EMAIL_CAPTURE]', {
      email,
      category,
      budget,
      timestamp: new Date().toISOString(),
    });

    // In Phase 1, this will:
    // - Save to Supabase
    // - Send confirmation email via email service
    // For now, just acknowledge receipt

    return NextResponse.json(
      successResponse({ 
        success: true, 
        message: 'Email captured successfully',
        email 
      })
    );
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
