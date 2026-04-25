'use client';

import { useSearchParams } from 'next/navigation';
import businessStrategies from '@/data/business_strategies.json';

export default function ResultsContent() {
  const searchParams = useSearchParams();

  if (!searchParams) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  const businessId = searchParams.get('businessId');
  const variant = searchParams.get('variant') || 'online';
  const mindset = searchParams.get('mindset') || 'founder';
  const market = searchParams.get('market') || 'us';

  // Get business from new data structure
  const business = (businessStrategies as any).businesses.find(
    (b: any) => b.id === businessId
  );
  const strategy = business?.variants[variant]?.mindsets[mindset];
  const marketData = business?.market_variants[market];

  if (!business || !strategy || !marketData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">Data not found</h1>
          <a href="/" className="text-blue-400 hover:text-blue-300">
            ← Start over
          </a>
        </div>
      </div>
    );
  }

  // Get currency symbol
  const currencySymbols: Record<string, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€'
  };
  const currency = marketData.currency;
  const currencySymbol = currencySymbols[currency] || currency;

  // Calculate CAC in local currency
  const adjustCAC = (cac_range: string | null) => {
    if (!cac_range) return null;
    // Parse range like "$25-50" and adjust
    const cleaned = cac_range.replace(/[^0-9-]/g, '');
    const [min, max] = cleaned.split('-').map(Number);
    const adjustedMin = Math.round(min * marketData.cac_multiplier);
    const adjustedMax = Math.round(max * marketData.cac_multiplier);
    return `${currencySymbol}${adjustedMin}-${adjustedMax}`;
  };

  const mindsetLabel: Record<string, string> = {
    bootstrapper: '🆓 Bootstrapper Strategy',
    founder: '💡 Growth Strategy',
    growth: '🚀 Aggressive Growth'
  };

  const mindsetColor: Record<string, string> = {
    bootstrapper: 'bg-green-50 border-green-300',
    founder: 'bg-blue-50 border-blue-300',
    growth: 'bg-purple-50 border-purple-300'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-white mb-8">
          <a href="/" className="text-blue-400 hover:text-blue-300 text-sm mb-4 block">
            ← Change strategy
          </a>
          <h1 className="text-4xl font-bold">{business.name}</h1>
          <p className="text-slate-400">{business.category}</p>
        </div>

        {/* STRATEGY BADGE */}
        <div className={`border-2 rounded-xl p-6 mb-6 ${mindsetColor[mindset]}`}>
          <h2 className="text-2xl font-bold text-slate-900">
            {mindsetLabel[mindset]}
          </h2>
          <p className="text-slate-700 mt-2">{strategy.description}</p>
          <p className="text-sm text-slate-600 mt-3">
            📍 Market: {market.toUpperCase()} ({currency})
          </p>
        </div>

        {/* HERO CHANNEL */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            🎯 Your Hero Channel
          </h2>
          <h3 className="text-xl font-bold text-blue-600 mb-3">
            {strategy.hero_channel.primary || strategy.hero_channel.platform}
          </h3>

          <p className="text-slate-700 mb-4">{strategy.hero_channel.why}</p>

          {/* METRICS */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-slate-600">Customer Acquisition Cost</p>
              <p className="text-2xl font-bold text-blue-600">
                {strategy.hero_channel.cac ? adjustCAC(strategy.hero_channel.cac) : '🆓 Free'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-slate-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {strategy.hero_channel.conversion}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded">
              <p className="text-sm text-slate-600">Time to First Results</p>
              <p className="text-2xl font-bold text-orange-600">
                {strategy.hero_channel.timeline}
              </p>
            </div>
          </div>

          {/* EFFORT LEVEL */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <p className="text-sm font-bold text-yellow-900">Effort Level: {strategy.hero_channel.effort}</p>
          </div>

          {/* ACTION STEPS */}
          <div className="mt-4">
            <p className="font-bold text-slate-900 mb-3">How to implement:</p>
            <ol className="space-y-2 text-sm text-slate-700">
              {strategy.hero_channel.action_steps.map((step: string, idx: number) => (
                <li key={idx} className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* SUPPORT CHANNELS */}
        {strategy.support_channels && strategy.support_channels.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              📱 Support Channels
            </h2>
            <div className="space-y-4">
              {strategy.support_channels.map((channel: any, idx: number) => (
                <div key={idx} className="border-l-4 border-orange-500 pl-4 pb-4">
                  <h3 className="font-bold text-slate-900 text-lg">{channel.platform}</h3>
                  <p className="text-slate-600 text-sm mb-2">{channel.why}</p>

                  <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <p className="text-slate-600">CAC</p>
                      <p className="font-bold text-orange-600">
                        {channel.cac ? adjustCAC(channel.cac) : '🆓 Free'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Conversion</p>
                      <p className="font-bold text-orange-600">{channel.conversion}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Timeline</p>
                      <p className="font-bold text-orange-600">{channel.timeline}</p>
                    </div>
                  </div>

                  {channel.budget && (
                    <p className="text-sm bg-orange-50 p-2 rounded">
                      💰 Budget: {currencySymbol}{Math.round(channel.budget * marketData.cac_multiplier)}/month
                    </p>
                  )}

                  {channel.actions && (
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-2">Quick actions:</p>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {channel.actions.slice(0, 3).map((action: string, i: number) => (
                          <li key={i}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GOLDMINES */}
        {strategy.hidden_goldmines && strategy.hidden_goldmines.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              ✨ Hidden Goldmines
            </h2>
            <div className="space-y-4">
              {strategy.hidden_goldmines.map((goldmine: any, idx: number) => (
                <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <h3 className="font-bold text-slate-900">{goldmine.platform}</h3>
                  <p className="text-sm text-slate-700 mt-2">💡 {goldmine.why}</p>

                  <div className="grid md:grid-cols-2 gap-3 text-sm my-3">
                    <div>
                      <p className="text-slate-600">CAC</p>
                      <p className="font-bold text-yellow-700">
                        {goldmine.cac ? adjustCAC(goldmine.cac) : '🆓 Free'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">Timeline</p>
                      <p className="font-bold text-yellow-700">{goldmine.timeline}</p>
                    </div>
                  </div>

                  {goldmine.actions && (
                    <div className="text-sm text-slate-600 bg-white p-2 rounded">
                      <p className="font-bold mb-1">How to use:</p>
                      <ul className="space-y-1">
                        {goldmine.actions.map((action: string, i: number) => (
                          <li key={i}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUDGET ALLOCATION (if applicable) */}
        {strategy.budget_allocation && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              💰 Budget Allocation
            </h2>
            <p className="text-slate-600 mb-4">{strategy.budget_allocation.rationale}</p>
            <div className="space-y-3">
              {Object.entries(strategy.budget_allocation).map(([key, value]: any) => {
                if (key === 'rationale') return null;
                return (
                  <div key={key} className="bg-slate-50 p-3 rounded">
                    <p className="text-sm font-bold text-slate-900">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXPECTED RESULTS */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-300 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Expected Results</h3>
          <p className="text-slate-700 mb-2">⏱️ Timeline: {strategy.timeline}</p>
          <p className="text-slate-700">📊 Expected: {strategy.expected_results}</p>
        </div>

        {/* BACK BUTTON */}
        <a
          href="/"
          className="block text-center text-blue-400 hover:text-blue-300 font-semibold"
        >
          ← Get plan for different business
        </a>
      </div>
    </div>
  );
}
