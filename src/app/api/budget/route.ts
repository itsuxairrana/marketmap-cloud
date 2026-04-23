import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse, validateCategory, validateBudget } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, budget } = body;

    // Validate inputs
    if (!validateCategory(category)) {
      return NextResponse.json(
        errorResponse('Invalid category'),
        { status: 400 }
      );
    }

    if (!validateBudget(budget)) {
      return NextResponse.json(
        errorResponse('Invalid budget'),
        { status: 400 }
      );
    }

    // Load data
    const dataResponse = await fetch(new URL('../../public/data.json', import.meta.url));
    const data = await dataResponse.json();

    // Find archetype
    const archetype = data.archetypes.find((a: any) => a.id === category);
    if (!archetype) {
      return NextResponse.json(
        errorResponse('Archetype not found'),
        { status: 404 }
      );
    }

    // Calculate budget breakdown
    const budgetBreakdown = {
      hero: Math.round(budget * 0.5),
      support: Math.round(budget * 0.3),
      experiments: Math.round(budget * 0.2),
    };

    // Return data
    return NextResponse.json(
      successResponse({
        category,
        budget,
        archetype: archetype.name,
        hero_channel: archetype.hero_channels?.[0] || null,
        support_channels: archetype.paid_channels?.slice(0, 2) || [],
        hidden_goldmines: archetype.hidden_goldmines?.slice(0, 5) || [],
        budget_breakdown: budgetBreakdown,
      })
    );
  } catch (error) {
    console.error('Budget API error:', error);
    return NextResponse.json(
      errorResponse('Internal server error'),
      { status: 500 }
    );
  }
}
