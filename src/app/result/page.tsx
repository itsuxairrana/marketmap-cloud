'use client';

export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BusinessType, BusinessVariant } from '@/types/business';
import { trackResultsView } from '@/lib/analytics';
import { generatePDF, downloadPDF } from '@/utils/pdf-generator';
import { getBusinessData } from '@/lib/dataLoader';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const variantParam = searchParams.get('variant') as 'online' | 'physical' | 'b2b' | null;
  const budgetParam = searchParams.get('budget');

  const [business, setBusiness] = useState<BusinessType | null>(null);
  const [marketingPlan, setMarketingPlan] = useState<BusinessVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!businessId) {
        throw new Error('Missing business ID');
      }

      // Find business by ID using dataLoader
      const foundBusiness = getBusinessData(businessId);

      if (!foundBusiness) {
        throw new Error('Business type not found');
      }

      // Get the specific variant (default to 'online' if not specified)
      const selectedVariant = variantParam || 'online';
      const planData = foundBusiness.variants?.[selectedVariant];

      if (!planData) {
        throw new Error(`${selectedVariant} variant not available for this business type`);
      }

      setBusiness(foundBusiness as BusinessType);
      setMarketingPlan(planData as BusinessVariant);

      const budgetNum = Number(budgetParam) || 10000;

      // Track results view
      trackResultsView(businessId, budgetNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [businessId, variantParam, budgetParam]);

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

  if (error || !business || !marketingPlan) {
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

  const budgetNum = Number(budgetParam) || 10000;
  const heroAllocation = Math.round(budgetNum * (marketingPlan.budget_allocation.hero_channel_pct / 100));
  const supportAllocation = Math.round(budgetNum * (marketingPlan.budget_allocation.support_channels_pct / 100));
  const goldminesAllocation = Math.round(budgetNum * (marketingPlan.budget_allocation.goldmines_pct / 100));

  const handleDownloadPDF = () => {
    try {
      const doc = generatePDF(business, marketingPlan, budgetNum, (variantParam || 'online') as 'online' | 'physical' | 'b2b');
      downloadPDF(doc, business.name);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 py-6">
        <div className="container">
          <a href="/" className="text-primary hover:underline text-sm mb-3 inline-block">
            ← Back to MarketMap
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {business.name} Marketing Platform Map
          </h1>
          <p className="text-gray-600 mt-2">
            Monthly budget: <strong>${budgetNum.toLocaleString()}</strong> • Business model: <strong className="capitalize">{variantParam}</strong>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Hero Channel Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white mb-6">
            <h2 className="text-2xl font-bold mb-2">🎯 Your Primary Channel</h2>
            <h3 className="text-3xl font-bold mb-6">{marketingPlan.hero_channel.platform}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-blue-100 text-sm">Cost per Acquisition</p>
                <p className="text-2xl font-bold">{marketingPlan.hero_channel.cac_range}</p>
                {marketingPlan.hero_channel.cac_source && (
                  <p className="text-xs text-blue-200 mt-1">Source: {marketingPlan.hero_channel.cac_source}</p>
                )}
              </div>
              <div>
                <p className="text-blue-100 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold">{marketingPlan.hero_channel.conversion_rate}</p>
                {marketingPlan.hero_channel.conversion_source && (
                  <p className="text-xs text-blue-200 mt-1">Source: {marketingPlan.hero_channel.conversion_source}</p>
                )}
              </div>
              <div>
                <p className="text-blue-100 text-sm">Budget Allocation</p>
                <p className="text-2xl font-bold">${heroAllocation.toLocaleString()}</p>
                <p className="text-xs text-blue-200 mt-1">{marketingPlan.budget_allocation.hero_channel_pct}% of budget</p>
              </div>
            </div>

            <div className="bg-blue-600 rounded p-4">
              <p className="font-semibold mb-2">Why this channel works:</p>
              <p className="text-blue-50">{marketingPlan.hero_channel.why_it_works}</p>
            </div>

            {(marketingPlan.hero_channel.time_to_lead || marketingPlan.hero_channel.effort_level) && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {marketingPlan.hero_channel.time_to_lead && (
                  <div className="bg-blue-600 rounded p-3">
                    <p className="text-blue-100 text-sm">Time to Lead</p>
                    <p className="font-semibold">{marketingPlan.hero_channel.time_to_lead}</p>
                  </div>
                )}
                {marketingPlan.hero_channel.effort_level && (
                  <div className="bg-blue-600 rounded p-3">
                    <p className="text-blue-100 text-sm">Effort Level</p>
                    <p className="font-semibold">{marketingPlan.hero_channel.effort_level}</p>
                  </div>
                )}
              </div>
            )}

            {marketingPlan.hero_channel.example_companies && marketingPlan.hero_channel.example_companies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-500">
                <p className="text-sm text-blue-100 mb-2">Companies using this:</p>
                <p className="text-sm">{marketingPlan.hero_channel.example_companies.join(', ')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Support Channels Section */}
        {marketingPlan.support_channels && marketingPlan.support_channels.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">📱 Support Channels</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {marketingPlan.support_channels.map((channel, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-bold mb-4">{channel.platform}</h3>

                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">Cost per Acquisition</p>
                      <p className="font-semibold">{channel.cac_range}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Conversion Rate</p>
                      <p className="font-semibold">{channel.conversion_rate}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm"><strong>Why it works:</strong> {channel.why_it_works}</p>
                  </div>

                  {channel.usage_pattern && (
                    <p className="text-sm text-gray-600"><strong>Usage:</strong> {channel.usage_pattern}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded">
              <strong>Budget allocation:</strong> ${supportAllocation.toLocaleString()} ({marketingPlan.budget_allocation.support_channels_pct}% of budget) — {marketingPlan.budget_allocation.support_channels_detail}
            </p>
          </section>
        )}

        {/* Hidden Goldmines Section */}
        {marketingPlan.hidden_goldmines && marketingPlan.hidden_goldmines.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">💎 Hidden Goldmines</h2>
            <p className="text-gray-600 mb-6">Under-utilized channels with high potential ROI</p>
            <div className="space-y-6">
              {marketingPlan.hidden_goldmines.slice(0, 5).map((goldmine, idx) => (
                <div key={idx} className="border border-yellow-200 bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-yellow-900 mb-3">{goldmine.platform}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-yellow-800 text-sm font-semibold">Cost per Acquisition</p>
                      <p className="text-lg font-bold text-yellow-900">{goldmine.cac_range}</p>
                    </div>
                    <div>
                      <p className="text-yellow-800 text-sm font-semibold">Time to Results</p>
                      <p className="text-lg font-bold text-yellow-900">{goldmine.estimated_time_to_results || 'Varies'}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div>
                      <p className="font-semibold text-yellow-900">Why it's hidden:</p>
                      <p className="text-yellow-800">{goldmine.why_hidden}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-900">Why it's valuable:</p>
                      <p className="text-yellow-800">{goldmine.why_valuable}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-900">How to use it:</p>
                      <p className="text-yellow-800">{goldmine.how_to_use}</p>
                    </div>
                  </div>

                  {goldmine.success_example && (
                    <div className="bg-white rounded p-3 border border-yellow-200">
                      <p className="text-sm"><strong>Example:</strong> {goldmine.success_example}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded mt-6">
              <strong>Budget allocation:</strong> ${goldminesAllocation.toLocaleString()} ({marketingPlan.budget_allocation.goldmines_pct}% of budget) — {marketingPlan.budget_allocation.goldmines_detail}
            </p>
          </section>
        )}

        {/* Audience Locations Section */}
        {marketingPlan.audience_locations && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">🎯 Where Your Audience Hangs Out</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketingPlan.audience_locations.online_communities && marketingPlan.audience_locations.online_communities.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Online Communities</h3>
                  <ul className="space-y-2">
                    {marketingPlan.audience_locations.online_communities.map((community, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {community}</li>
                    ))}
                  </ul>
                </div>
              )}

              {marketingPlan.audience_locations.offline_locations && marketingPlan.audience_locations.offline_locations.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Offline Locations</h3>
                  <ul className="space-y-2">
                    {marketingPlan.audience_locations.offline_locations.map((location, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {location}</li>
                    ))}
                  </ul>
                </div>
              )}

              {marketingPlan.audience_locations.content_consumed && marketingPlan.audience_locations.content_consumed.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Content They Consume</h3>
                  <ul className="space-y-2">
                    {marketingPlan.audience_locations.content_consumed.map((content, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {content}</li>
                    ))}
                  </ul>
                </div>
              )}

              {marketingPlan.audience_locations.search_behavior && marketingPlan.audience_locations.search_behavior.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold mb-3">Search Behavior</h3>
                  <ul className="space-y-2">
                    {marketingPlan.audience_locations.search_behavior.map((behavior, idx) => (
                      <li key={idx} className="text-sm text-gray-700">• {behavior}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Budget Breakdown Summary */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">💰 Budget Breakdown</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">Hero Channel</span>
                  <span className="font-bold text-blue-600">${heroAllocation.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{width: `${marketingPlan.budget_allocation.hero_channel_pct}%`}}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{marketingPlan.budget_allocation.hero_channel_pct}% of budget</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">Support Channels</span>
                  <span className="font-bold text-green-600">${supportAllocation.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{width: `${marketingPlan.budget_allocation.support_channels_pct}%`}}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{marketingPlan.budget_allocation.support_channels_pct}% of budget</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900">Hidden Goldmines</span>
                  <span className="font-bold text-yellow-600">${goldminesAllocation.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{width: `${marketingPlan.budget_allocation.goldmines_pct}%`}}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{marketingPlan.budget_allocation.goldmines_pct}% of budget</p>
              </div>

              <div className="pt-4 border-t border-gray-300 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Monthly Budget</span>
                  <span className="text-3xl font-bold text-gray-900">${budgetNum.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Download your detailed marketing plan as a PDF or start implementing today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              📄 Download PDF Plan
            </button>
            <a href="/" className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold inline-block transition-colors">
              ← Explore Other Businesses
            </a>
          </div>
        </section>
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
