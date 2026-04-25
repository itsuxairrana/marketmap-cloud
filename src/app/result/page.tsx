'use client';

import { useSearchParams } from 'next/navigation';
import { getBusinessData, getAvailableVariants } from '@/lib/dataLoader';
import { generatePDF } from '@/utils/pdf-generator';

export default function Results() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const variant = searchParams.get('variant') || 'online';
  const budgetParam = searchParams.get('budget') || '0';
  const budget = parseInt(budgetParam);

  const business = businessId ? getBusinessData(businessId) : null;
  const marketingData = business?.variants?.[variant];

  if (!business || !marketingData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Business not found</h1>
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to MarketMap
          </a>
        </div>
      </div>
    );
  }

  // Calculate budget allocation
  const heroBudget = Math.round(budget * 0.5);
  const supportBudget = Math.round(budget * 0.3);
  const goldmineBudget = Math.round(budget * 0.2);

  // ORGANIC vs PAID CLASSIFICATION
  const classifyChannel = (platform) => {
    const organic = ['reddit', 'linkedin organic', 'twitter/x', 'facebook groups', 'communities', 'slack', 'forums'];
    const paid = ['meta ads', 'google', 'facebook ads', 'linkedin ads', 'tiktok ads', 'instagram ads'];

    const lower = platform.toLowerCase();
    if (organic.some(o => lower.includes(o))) return 'organic';
    if (paid.some(p => lower.includes(p))) return 'paid';
    return 'hybrid';
  };

  const heroPlatformType = classifyChannel(marketingData.hero_channel.platform);
  const supportsOrganic = [
    ...marketingData.support_channels.filter(c => classifyChannel(c.platform) !== 'paid'),
    ...marketingData.hidden_goldmines.filter(g => classifyChannel(g.platform) !== 'paid')
  ];

  const handleDownloadPDF = () => {
    generatePDF(business, variant, budget);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-white mb-8">
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-4 block">
            ← Back to MarketMap
          </a>
          <h1 className="text-4xl font-bold">{business.name}</h1>
          <p className="text-slate-400">{business.category}</p>
        </div>

        {/* BUDGET STATUS CARD */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {budget === 0 ? '🆓 Free-First Strategy' : `💰 Budget: $${budget}/month`}
              </h2>
              <p className="text-slate-600 mt-2">
                {budget === 0
                  ? 'We\'re optimizing for organic channels and zero-cost tactics'
                  : `We'll split your budget into 50% hero • 30% support • 20% goldmines`}
              </p>
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
            >
              ✎ Adjust Budget
            </button>
          </div>
        </div>

        {/* ORGANIC CHANNELS (Always show, especially if $0) */}
        {(budget === 0 || supportsOrganic.length > 0) && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              🆓 Organic Channels (FREE)
            </h2>
            <p className="text-slate-600 mb-4">
              These channels don't require paid budget but do require time/effort:
            </p>

            {/* ORGANIC HERO */}
            {heroPlatformType !== 'paid' && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                <h3 className="font-bold text-slate-900 mb-2">
                  ⭐ Hero Channel: {marketingData.hero_channel.platform}
                </h3>
                <p className="text-sm text-slate-700 mb-2">
                  {marketingData.hero_channel.why_it_works}
                </p>
                <div className="text-sm space-y-1">
                  <p><strong>Effort Level:</strong> {marketingData.hero_channel.effort_level}</p>
                  <p><strong>Time to Results:</strong> {marketingData.hero_channel.time_to_lead}</p>
                  {heroPlatformType === 'organic' && (
                    <p className="text-green-700 font-bold">✅ 100% Free (requires consistent effort)</p>
                  )}
                </div>
              </div>
            )}

            {/* ORGANIC SUPPORT */}
            {supportsOrganic.length > 0 && (
              <div>
                <p className="font-bold text-slate-900 mb-3">Additional Free Channels:</p>
                <div className="space-y-3">
                  {supportsOrganic.map((channel, idx) => (
                    <div key={idx} className="bg-green-50 border border-green-200 p-3 rounded">
                      <h4 className="font-bold text-slate-900">{channel.platform || channel.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {channel.why_it_works || channel.why_valuable}
                      </p>
                      {classifyChannel(channel.platform || channel.name) === 'organic' && (
                        <p className="text-xs text-green-700 font-bold mt-2">✅ Free (time-based)</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* HERO CHANNEL */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border-2 border-blue-300">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            🎯 Your Hero Channel: {marketingData.hero_channel.platform}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-600">Customer Acquisition Cost</p>
              <p className="text-3xl font-bold text-blue-600">{marketingData.hero_channel.cac_range}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-green-600">{marketingData.hero_channel.conversion_rate}</p>
            </div>
          </div>
          <p className="text-slate-700 mb-4">{marketingData.hero_channel.why_it_works}</p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-slate-600">First results in: <span className="font-bold">{marketingData.hero_channel.time_to_lead}</span></p>
            <p className="text-sm text-slate-600">Effort level: <span className="font-bold">{marketingData.hero_channel.effort_level}</span></p>
          </div>

          {/* Budget allocation for hero */}
          {budget > 0 && (
            <div className="mt-4 bg-green-50 p-4 rounded">
              <p className="font-bold text-slate-900">📊 Budget allocation for hero channel:</p>
              <p className="text-2xl font-bold text-green-600">${heroBudget}</p>
            </div>
          )}
        </div>

        {/* SUPPORT CHANNELS */}
        {marketingData.support_channels && marketingData.support_channels.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              📱 Support Channels
              {budget > 0 && <span className="text-sm font-normal text-slate-600"> (Strategy + ${supportBudget})</span>}
            </h2>
            <div className="space-y-4">
              {marketingData.support_channels.map((channel, idx) => (
                <div key={idx} className="border-l-4 border-orange-500 pl-4 pb-4">
                  <h3 className="font-bold text-slate-900">{channel.platform}</h3>
                  <p className="text-sm text-slate-600 mb-2">{channel.why_it_works}</p>
                  <div className="text-sm">
                    <span className="font-bold text-orange-600">CAC: {channel.cac_range}</span>
                    <span className="text-slate-600"> • Conv: {channel.conversion_rate}</span>
                    {budget === 0 && classifyChannel(channel.platform) !== 'paid' && (
                      <span className="text-green-600 ml-2">• 🆓 Free option</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HIDDEN GOLDMINES */}
        {marketingData.hidden_goldmines && marketingData.hidden_goldmines.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ✨ Hidden Goldmines
              {budget > 0 && <span className="text-sm font-normal text-slate-600"> (Strategy + ${goldmineBudget})</span>}
            </h2>
            <div className="space-y-4">
              {marketingData.hidden_goldmines.map((goldmine, idx) => (
                <div key={idx} className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                  <h3 className="font-bold text-slate-900">{goldmine.platform}</h3>
                  <p className="text-sm text-slate-700 mt-2">
                    <span className="font-bold">Why hidden:</span> {goldmine.why_hidden}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-bold">Why valuable:</span> {goldmine.why_valuable}
                  </p>
                  <p className="text-sm text-yellow-700 font-bold mt-2">
                    💰 CAC: {goldmine.cac_range}
                    {budget === 0 && classifyChannel(goldmine.platform) !== 'paid' && (
                      <span className="text-green-600 ml-2">• 🆓 Free</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET BREAKDOWN (if budget > 0) */}
        {budget > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">💰 Your ${budget}/month Budget</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Hero Channel (50%)</span>
                <span className="font-bold text-lg text-blue-600">${heroBudget}</span>
              </div>
              <div className="h-2 bg-blue-200 rounded-full w-full"></div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-slate-700">Support Channels (30%)</span>
                <span className="font-bold text-lg text-orange-600">${supportBudget}</span>
              </div>
              <div className="h-2 bg-orange-200 rounded-full w-full"></div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-slate-700">Goldmines (20%)</span>
                <span className="font-bold text-lg text-yellow-600">${goldmineBudget}</span>
              </div>
              <div className="h-2 bg-yellow-200 rounded-full w-full"></div>
            </div>
          </div>
        )}

        {/* BUDGET UPGRADE SUGGESTIONS (if no budget or low budget) */}
        {budget < 500 && (
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">💡 Next Steps</h3>
            {budget === 0 ? (
              <div className="text-slate-700 space-y-2">
                <p>✅ <strong>Month 1:</strong> Focus on organic channels (free)</p>
                <p>→ <strong>Month 2:</strong> Once you see traction, consider $500-$1,000/month budget to accelerate</p>
                <p>→ <strong>Month 3+:</strong> Scale to $2,000+/month if ROI is positive</p>
                <button
                  onClick={() => window.location.href = '/?budget=500'}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  See what $500/month looks like →
                </button>
              </div>
            ) : (
              <div className="text-slate-700 space-y-2">
                <p>💡 Try increasing your budget to see the impact:</p>
                <button
                  onClick={() => window.location.href = `/?businessId=${businessId}&budget=${budget + 500}`}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  See ${budget + 500}/month plan →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Download PDF */}
        <button
          onClick={handleDownloadPDF}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg mb-6 transition"
        >
          📥 Download Full Marketing Plan (PDF)
        </button>

        {/* Back Button */}
        <a
          href="/"
          className="block text-center text-blue-400 hover:text-blue-300 font-semibold"
        >
          ← Get plan for another business
        </a>
      </div>
    </div>
  );
}
