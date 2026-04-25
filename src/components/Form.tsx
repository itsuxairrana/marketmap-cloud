'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCategoriesWithData,
  getSubcategoriesWithData,
  getBusinessTypesWithData,
  getAvailableVariants,
  getBusinessData,
  searchBusinessTypeAdvanced,
  getPopularSearches,
  getAllBusinessData,
} from '@/lib/dataLoader';
import { trackFormSubmit } from '@/lib/analytics';

export default function Form() {
  const router = useRouter();

  // Search mode (primary)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Selected business
  const [selectedBusinessId, setSelectedBusinessId] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('online');
  const [budget, setBudget] = useState(''); // EMPTY by default (optional)
  const [showBudgetSuggestion, setShowBudgetSuggestion] = useState(false);

  // Dropdown mode (fallback)
  const [showDropdowns, setShowDropdowns] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // Error state
  const [variantError, setVariantError] = useState('');
  const [searchError, setSearchError] = useState('');

  const categories = getCategoriesWithData();
  const subcategories = selectedCategory ? getSubcategoriesWithData(selectedCategory) : [];
  const businessTypes = selectedCategory ? getBusinessTypesWithData(selectedCategory, selectedSubcategory) : [];
  const popularSearches = getPopularSearches();

  // SEARCH HANDLER
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setVariantError('');
    setSearchError('');

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = searchBusinessTypeAdvanced(query);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // HANDLE SEARCH RESULT CLICK
  const handleSearchResultClick = (businessId: string) => {
    const business = getBusinessData(businessId);

    if (!business) {
      setSearchError('Business not found');
      return;
    }

    setSelectedBusinessId(businessId);
    setSearchQuery('');
    setShowSearchResults(false);

    // Get available variants - FIX: Only show available variants
    const availableVariants = getAvailableVariants(businessId);

    if (availableVariants.length === 0) {
      setVariantError('No variants available for this business');
      return;
    }

    // Set to first available variant (FIX: don't default to 'online' if it doesn't exist)
    const firstVariant = availableVariants[0];
    setSelectedVariant(firstVariant);
    setVariantError('');

    // Reset budget suggestion
    setShowBudgetSuggestion(true);
  };

  // HANDLE POPULAR SEARCH CLICK
  const handlePopularSearchClick = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  // HANDLE CATEGORY CHANGE
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
    setSelectedBusinessId('');
    setVariantError('');
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
    setSelectedBusinessId('');
    setVariantError('');
  };

  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const businessId = e.target.value;
    handleSearchResultClick(businessId);
  };

  // GET SELECTED BUSINESS INFO
  const selectedBusiness = selectedBusinessId ? getBusinessData(selectedBusinessId) : null;
  const availableVariants = selectedBusinessId ? getAvailableVariants(selectedBusinessId) : [];

  // VALIDATE BEFORE SUBMIT
  // Budget is now OPTIONAL
  const canSubmit = selectedBusinessId && availableVariants.length > 0;

  // HANDLE SUBMIT
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      setVariantError('Please select a valid business');
      return;
    }

    // Use budget or default to empty string (will show organic-first in results)
    const budgetToUse = budget || '0';

    trackFormSubmit(selectedBusinessId, Number(budgetToUse));
    router.push(
      `/result?businessId=${selectedBusinessId}&variant=${selectedVariant}&budget=${budgetToUse}`
    );
  };

  // Clear search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-5xl font-bold mb-3">MarketMap</h1>
          <p className="text-xl text-slate-300">Find your perfect marketing channels in seconds</p>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SEARCH BOX (PRIMARY INTERFACE) */}
          {!selectedBusinessId && (
            <>
              <div className="search-container relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="What's your business? (e.g., 'shoe shop', 'salon', 'SaaS')"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                    className="w-full px-6 py-5 text-lg border-2 border-blue-500 rounded-xl focus:outline-none focus:border-blue-600 bg-white shadow-lg"
                    autoFocus
                  />

                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl">
                    🔍
                  </div>
                </div>

                {/* SEARCH RESULTS DROPDOWN */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-500 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((result) => (
                      <button
                        key={result.microcategory || result.id}
                        type="button"
                        onClick={() => handleSearchResultClick(result.microcategory || result.id)}
                        className="w-full text-left px-6 py-4 hover:bg-blue-50 border-b border-slate-200 last:border-b-0 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{result.name}</h3>
                            <p className="text-sm text-slate-600">
                              {result.category}
                              {result.subcategory && ` • ${result.subcategory}`}
                            </p>
                          </div>
                          <span className="text-blue-600 font-bold">→</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* NO RESULTS MESSAGE */}
                {showSearchResults && searchResults.length === 0 && searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-300 rounded-xl shadow-lg p-6 z-50">
                    <p className="text-slate-600 text-center mb-4">Hmm, we don't have "{searchQuery}" yet</p>
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-slate-700">Try searching for similar businesses:</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        <li>• If you have a "nail salon" → search "salon" or "beauty"</li>
                        <li>• If you have a "clothing brand" → search "clothing" or "fashion"</li>
                        <li>• If you have a "consulting" → search "agency" or "b2b"</li>
                      </ul>
                      <button
                        type="button"
                        onClick={() => setShowDropdowns(true)}
                        className="w-full mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                      >
                        Browse all categories instead →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* POPULAR SEARCHES */}
              {!searchQuery && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-sm font-semibold text-slate-700 mb-4">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.slice(0, 8).map((search) => (
                      <button
                        key={search}
                        type="button"
                        onClick={() => handlePopularSearchClick(search)}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-full transition text-sm"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ERROR MESSAGE */}
              {searchError && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded text-red-700">
                  {searchError}
                </div>
              )}

              {/* ALTERNATE: BROWSE CATEGORIES */}
              {!showDropdowns && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowDropdowns(true)}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-sm"
                  >
                    Or browse by category →
                  </button>
                </div>
              )}
            </>
          )}

          {/* DROPDOWN FALLBACK (if enabled) */}
          {showDropdowns && !selectedBusinessId && (
            <div className="bg-white rounded-xl p-6 shadow-lg space-y-4 border-2 border-slate-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Browse by Category</h3>
                <button
                  type="button"
                  onClick={() => setShowDropdowns(false)}
                  className="text-slate-500 hover:text-slate-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                  <select
                    value={selectedSubcategory}
                    onChange={handleSubcategoryChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select type...</option>
                    {subcategories.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedCategory && businessTypes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Specific Business</label>
                  <select
                    value={selectedBusinessId}
                    onChange={handleBusinessTypeChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select business...</option>
                    {businessTypes.map(bt => (
                      <option key={bt.id} value={bt.id}>
                        {bt.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowDropdowns(false)}
                className="w-full text-center text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                ← Back to search
              </button>
            </div>
          )}

          {/* SELECTED BUSINESS SUMMARY */}
          {selectedBusinessId && selectedBusiness && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg border-2 border-blue-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedBusiness.name}</h2>
                  <p className="text-slate-600">
                    {selectedBusiness.category}
                    {selectedBusiness.subcategory && ` • ${selectedBusiness.subcategory}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBusinessId('');
                    setSearchQuery('');
                    setVariantError('');
                    setShowBudgetSuggestion(false);
                  }}
                  className="text-slate-500 hover:text-slate-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* VARIANT SELECTOR - FIX: Only show if multiple variants available */}
              {availableVariants.length > 1 && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">Business Model</label>
                  <div className="flex gap-3">
                    {availableVariants.map((variant) => (
                      <label key={variant} className="flex items-center">
                        <input
                          type="radio"
                          name="variant"
                          value={variant}
                          checked={selectedVariant === variant}
                          onChange={(e) => setSelectedVariant(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {variant === 'online' ? '🌐 Online' : variant === 'physical' ? '🏪 Physical' : '🤝 B2B'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ERROR: Missing variant */}
              {variantError && (
                <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm">
                  ⚠️ {variantError}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBusinessId('');
                      setVariantError('');
                    }}
                    className="ml-2 font-bold text-red-800 hover:text-red-900 underline"
                  >
                    Pick a different business
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============================================ */}
          {/* BUDGET INPUT - NOW OPTIONAL */}
          {/* ============================================ */}
          {selectedBusinessId && !variantError && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">
                  💰 Monthly Marketing Budget
                </label>
                <span className="text-xs text-slate-500">(optional)</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-slate-700">$</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    setShowBudgetSuggestion(false);
                  }}
                  placeholder="Leave empty for free-first strategy"
                  min="0"
                  step="100"
                  className="flex-1 px-4 py-3 text-lg border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none placeholder-slate-400"
                />
                <span className="text-slate-600">/month</span>
              </div>

              {/* BUDGET SUGGESTIONS */}
              {showBudgetSuggestion && !budget && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="text-sm font-semibold text-yellow-900 mb-3">
                    💡 Budget Recommendation
                  </p>
                  <div className="space-y-2 text-sm text-yellow-800">
                    <div className="flex justify-between items-center pb-2 border-b border-yellow-200">
                      <span>🆓 <strong>$0/month</strong> (Free first)</span>
                      <span className="text-xs">Organic only</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-yellow-200">
                      <span>✅ <strong>$500-1,000/month</strong> (Recommended)</span>
                      <span className="text-xs">Organic + Paid mix</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>🚀 <strong>$2,000+/month</strong> (Aggressive)</span>
                      <span className="text-xs">Multi-channel</span>
                    </div>
                  </div>
                </div>
              )}

              {/* NO BUDGET MESSAGE */}
              {!budget && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                  ✅ No budget needed! We'll show you free channels first. Add budget later for paid channels.
                </div>
              )}

              {/* BUDGET INFO */}
              {budget && parseInt(budget) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                  ℹ️ We'll split your ${parseInt(budget)} into: 50% Hero • 30% Support • 20% Goldmines
                </div>
              )}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          {selectedBusinessId && !variantError && (
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Get My Marketing Plan →
            </button>
          )}

          {/* Info Footer */}
          <p className="text-center text-slate-400 text-sm">
            ✅ {getAllBusinessData().length} businesses • Verified data • Works with any budget
          </p>
        </form>
      </div>
    </div>
  );
}
