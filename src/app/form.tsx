'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  smartSearch,
  getSearchSuggestions,
  getPopularSearches,
} from '@/lib/smartSearch';
import businessStrategies from '@/data/business_strategies.json';

export default function Form() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('online');

  // MINDSET SELECTION (KEY CHANGE)
  const [mindset, setMindset] = useState('');
  const [showMindsetSelection, setShowMindsetSelection] = useState(false);

  // MARKET/CURRENCY
  const [market, setMarket] = useState('us');

  const mindsets = [
    {
      id: 'bootstrapper',
      label: '🆓 Bootstrapper',
      description: 'No budget, doing it myself',
      icon: '🚀',
      subtitle: '$0/month • High effort • 8-12 weeks'
    },
    {
      id: 'founder',
      label: '💡 Founder',
      description: 'Some budget, want to grow',
      icon: '📈',
      subtitle: '$500-2,000/month • Balanced • 2-4 weeks'
    },
    {
      id: 'growth',
      label: '🚀 Growth Mode',
      description: 'Well-funded, fast growth',
      icon: '💎',
      subtitle: '$2,000+/month • Aggressive • 1-2 weeks'
    }
  ];

  const markets = [
    { id: 'us', label: '🇺🇸 USA', currency: 'USD' },
    { id: 'india', label: '🇮🇳 India', currency: 'INR' },
    { id: 'europe', label: '🇪🇺 Europe', currency: 'EUR' }
  ];

  // SEARCH HANDLER
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const results = smartSearch(query);
    setSearchResults(results);
    setShowSuggestions(true);
  };

  // SEARCH RESULT SELECTION
  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessId(businessId);
    setSearchQuery('');
    setShowSuggestions(false);
    setShowMindsetSelection(true);
  };

  // MINDSET SELECTION
  const handleMindsetSelect = (mindsetId: string) => {
    setMindset(mindsetId);
  };

  // SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBusinessId || !mindset) {
      alert('Please select a business and strategy type');
      return;
    }

    router.push(
      `/result?businessId=${selectedBusinessId}&variant=${selectedVariant}&mindset=${mindset}&market=${market}`
    );
  };

  const selectedBusiness = selectedBusinessId
    ? (businessStrategies as any).businesses.find((b: any) => b.id === selectedBusinessId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-5xl font-bold mb-3">MarketMap</h1>
          <p className="text-xl text-slate-300">Find YOUR perfect marketing strategy in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ============================================ */}
          {/* STEP 1: SEARCH FOR BUSINESS */}
          {/* ============================================ */}
          {!selectedBusinessId && (
            <>
              <div className="relative">
                <h2 className="text-white font-bold mb-3">Step 1: What's your business?</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="E.g., 'shoe shop', 'restaurant', 'saas product'"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSuggestions(true)}
                    className="w-full px-6 py-5 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:border-blue-600 bg-white shadow-lg"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
                </div>

                {/* SEARCH RESULTS */}
                {showSuggestions && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-500 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onClick={() => handleSelectBusiness(result.id)}
                        className="w-full text-left px-6 py-4 hover:bg-blue-50 border-b border-slate-200 last:border-b-0 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900">{result.name}</h3>
                            <p className="text-sm text-slate-600">{result.category}</p>
                            {result.suggested_category && (
                              <p className="text-xs text-blue-600 mt-1">💡 {result.suggested_category}</p>
                            )}
                          </div>
                          <span className="text-xl">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* POPULAR SEARCHES */}
                {!searchQuery && (
                  <div className="mt-4 bg-white rounded-xl p-6 shadow-lg">
                    <p className="text-sm font-bold text-slate-700 mb-3">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                      {getPopularSearches().map((search) => (
                        <button
                          key={search}
                          type="button"
                          onClick={() => handleSearch(search)}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-full transition text-sm"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ============================================ */}
          {/* STEP 2: SELECT STRATEGY TYPE (MINDSET) */}
          {/* ============================================ */}
          {selectedBusinessId && !mindset && (
            <>
              <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                <p className="text-green-800 font-semibold">✅ {selectedBusiness?.name} selected</p>
              </div>

              <div>
                <h2 className="text-white font-bold mb-4">Step 2: What's your situation?</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {mindsets.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMindsetSelect(m.id)}
                      className="p-6 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition text-left"
                    >
                      <div className="text-3xl mb-2">{m.icon}</div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1">{m.label}</h3>
                      <p className="text-slate-600 text-sm mb-3">{m.description}</p>
                      <p className="text-xs text-slate-500">{m.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ============================================ */}
          {/* STEP 3: SELECT MARKET/CURRENCY */}
          {/* ============================================ */}
          {mindset && (
            <>
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                <p className="text-blue-800 font-semibold">
                  ✅ Strategy: {mindsets.find(m => m.id === mindset)?.label}
                </p>
              </div>

              <div>
                <h2 className="text-white font-bold mb-4">Step 3: Where are you located?</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {markets.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMarket(m.id)}
                      className={`p-4 rounded-xl border-2 transition font-bold ${
                        market === m.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-white text-slate-900 hover:border-blue-300'
                      }`}
                    >
                      {m.label}
                      <p className="text-sm font-normal text-slate-600 mt-1">{m.currency}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Get My Customized Strategy →
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
