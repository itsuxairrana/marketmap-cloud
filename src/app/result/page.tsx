'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Results from '@/components/Results';
import { BudgetData, ArchetypeId } from '@/types';
import { trackResultsView } from '@/lib/analytics';
import { ARCHETYPES } from '@/lib/constants';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') as ArchetypeId;
  const budget = searchParams.get('budget');
  const [data, setData] = useState<BudgetData | null>(null);
  const [archetype, setArchetype] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data.json
        const response = await fetch('/data.json');
        if (!response.ok) throw new Error('Failed to load data');
        
        const jsonData = await response.json();
        const archetypeData = jsonData.archetypes.find((a: any) => a.id === category);
        
        if (!archetypeData) {
          throw new Error('Archetype not found');
        }

        const budgetNum = Number(budget) || 10000;

        // Calculate budget breakdown
        const budgetBreakdown = {
          hero: Math.round(budgetNum * 0.5),
          support: Math.round(budgetNum * 0.3),
          experiments: Math.round(budgetNum * 0.2),
        };

        // Get first 2 support channels
        const supportChannels = archetypeData.paid_channels?.slice(0, 2) || [];

        // Create budget data
        const resultData: BudgetData = {
          category,
          budget: budgetNum,
          hero_channel: archetypeData.hero_channels?.[0] || null,
          support_channels: supportChannels,
          hidden_goldmines: archetypeData.hidden_goldmines?.slice(0, 5) || [],
          audience_locations: archetypeData.audience_hangout_locations || {},
          budget_breakdown: budgetBreakdown,
        };

        setData(resultData);
        setArchetype(archetypeData);

        // Track event
        trackResultsView(category, budgetNum);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (category && budget) {
      loadData();
    } else {
      setError('Missing category or budget');
      setLoading(false);
    }
  }, [category, budget]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading your platform map...</p>
        </div>
      </div>
    );
  }

  if (error || !data || !archetype) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200 py-6">
          <div className="container">
            <a href="/" className="text-primary hover:underline">
              ← Back to MarketMap
            </a>
          </div>
        </header>
        <main className="container py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Something went wrong</h2>
            <p className="text-red-700 mb-4">{error || 'Unable to load your results'}</p>
            <a href="/" className="btn-primary inline-block">
              Start Over
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 py-6">
        <div className="container">
          <a href="/" className="text-primary hover:underline text-sm mb-3 inline-block">
            ← Back to MarketMap
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your {archetype.name} Platform Map
          </h1>
          <p className="text-gray-600 mt-2">
            Monthly budget: <strong>${data.budget.toLocaleString()}</strong>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <Results data={data} archetype={archetype} />
      </main>
    </div>
  );
}

function ResultPageLoading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">Loading your platform map...</p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultPageLoading />}>
      <ResultPageContent />
    </Suspense>
  );
}
