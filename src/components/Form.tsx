'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCategoriesWithData,
  getSubcategoriesWithData,
  getBusinessTypesWithData,
  getAvailableVariants,
  searchBusinessType,
  getClosestMatches,
  hasDataForBusiness,
  getAllBusinessData,
} from '@/lib/dataLoader';
import { trackFormSubmit } from '@/lib/analytics';

export default function Form() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('online');
  const [budget, setBudget] = useState('10000');
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackSuggestions, setFallbackSuggestions] = useState<any[]>([]);

  // Get available categories (only those with data)
  const categories = getCategoriesWithData();

  // Get subcategories when category selected
  const subcategories = selectedCategory
    ? getSubcategoriesWithData(selectedCategory)
    : [];

  // Get business types when category/subcategory selected
  const businessTypes = selectedCategory
    ? getBusinessTypesWithData(selectedCategory, selectedSubcategory)
    : [];

  // Get available variants for selected business
  const availableVariants = selectedBusinessType
    ? getAvailableVariants(selectedBusinessType)
    : [];

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
    setSelectedBusinessType('');
    setShowFallback(false);
    setSearchMode(false);
  };

  // Handle subcategory change
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubcategory(e.target.value);
    setSelectedBusinessType('');
    setShowFallback(false);
    setSearchMode(false);
  };

  // Handle business type change
  const handleBusinessTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const businessId = e.target.value;
    setSelectedBusinessType(businessId);

    // Auto-select first available variant
    const variants = getAvailableVariants(businessId);
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
    setShowFallback(false);
    setSearchMode(false);
  };

  // FALLBACK OPTION A: Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = searchBusinessType(query);
    setSearchResults(results);
  };

  // Handle search result selection
  const handleSearchResultClick = (businessId: string) => {
    setSelectedBusinessType(businessId);
    setSearchQuery('');
    setSearchResults([]);
    setSearchMode(false);

    // Auto-select variant
    const variants = getAvailableVariants(businessId);
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  };

  // Handle "Can't find?" button - FALLBACK OPTIONS B + C
  const handleCantFind = () => {
    setShowFallback(true);

    // Get suggestions based on current selection
    const suggestions = getClosestMatches(selectedCategory, selectedSubcategory);
    setFallbackSuggestions(suggestions);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBusinessType) {
      alert('Please select a business type');
      return;
    }

    if (!hasDataForBusiness(selectedBusinessType)) {
      alert('This business type does not have data yet');
      return;
    }

    // Track form submission
    trackFormSubmit(selectedBusinessType, Number(budget));

    router.push(
      `/result?businessId=${selectedBusinessType}&variant=${selectedVariant}&budget=${budget}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CATEGORIES WITH DATA ONLY */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          1. Your Business Category
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select category...</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          Only showing {categories.length} categories with verified data
        </p>
      </div>

      {/* SUBCATEGORIES (if applicable) */}
      {selectedCategory && subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            2. Business Type
          </label>
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

      {/* BUSINESS TYPES */}
      {selectedCategory && businessTypes.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            3. Your Specific Business
          </label>
          <select
            value={selectedBusinessType}
            onChange={handleBusinessTypeChange}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select business...</option>
            {businessTypes.map(bt => (
              <option key={bt.microcategory || bt.id} value={bt.microcategory || bt.id}>
                {bt.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* FALLBACK OPTION A: SEARCH FOR BUSINESS */}
      {selectedCategory && businessTypes.length === 0 && !showFallback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <button
            type="button"
            onClick={() => setSearchMode(!searchMode)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            {searchMode ? '✕ Close search' : '🔍 Search for your business'}
          </button>

          {searchMode && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Type your business (e.g., 'shoe shop', 'salon')"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                autoFocus
              />

              {searchResults.length > 0 && (
                <div className="mt-2 space-y-1">
                  {searchResults.map(result => (
                    <button
                      key={result.microcategory || result.id}
                      type="button"
                      onClick={() => handleSearchResultClick(result.microcategory || result.id)}
                      className="block w-full text-left px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 rounded text-blue-900"
                    >
                      {result.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* FALLBACK OPTIONS B + C: CAN'T FIND */}
      {selectedCategory && businessTypes.length === 0 && !searchMode && !showFallback && (
        <button
          type="button"
          onClick={handleCantFind}
          className="w-full px-4 py-2 text-sm bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg hover:bg-yellow-200 font-semibold"
        >
          Can't find your business?
        </button>
      )}

      {/* FALLBACK SUGGESTIONS */}
      {showFallback && fallbackSuggestions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-900 mb-3">
            We don't have your exact business yet, but try these closest matches:
          </p>
          <div className="space-y-2">
            {fallbackSuggestions.map(suggestion => (
              <button
                key={suggestion.microcategory || suggestion.id}
                type="button"
                onClick={() => handleSearchResultClick(suggestion.microcategory || suggestion.id)}
                className="block w-full text-left px-3 py-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded text-yellow-900"
              >
                {suggestion.name}
              </button>
            ))}
          </div>

          <a
            href="mailto:request@marketmap.cloud?subject=Add%20my%20business%20type"
            className="text-xs text-yellow-700 hover:text-yellow-900 mt-3 block font-semibold"
          >
            📧 Or email us to request your business type
          </a>
        </div>
      )}

      {/* VARIANTS (show only if available) */}
      {selectedBusinessType && availableVariants.length > 1 && (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Business Model
          </label>
          <div className="space-y-2">
            {availableVariants.map(variant => (
              <label key={variant} className="flex items-center">
                <input
                  type="radio"
                  name="variant"
                  value={variant}
                  checked={selectedVariant === variant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="mr-3"
                />
                <span className="text-sm text-slate-700 capitalize">
                  {variant === 'online' ? '🌐 Online/DTC' :
                   variant === 'physical' ? '🏪 Physical Store' :
                   '🤝 B2B'}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* BUDGET */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Monthly Marketing Budget
        </label>
        <div className="flex items-center">
          <span className="text-lg font-bold text-slate-700 mr-2">$</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            min="100"
            step="1000"
            className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <span className="text-sm text-slate-600 ml-2">/month</span>
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={!selectedBusinessType}
        className={`w-full py-3 rounded-lg font-bold text-white transition ${
          selectedBusinessType
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-slate-300 cursor-not-allowed'
        }`}
      >
        Get My Marketing Plan →
      </button>
    </form>
  );
}
