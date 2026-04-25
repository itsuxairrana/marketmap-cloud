import businessStrategies from '@/data/business_strategies.json';

export interface BusinessSearchResult {
  id: string;
  name: string;
  category: string;
  relevance: 'exact' | 'high' | 'medium';
  match_type: 'name' | 'keyword' | 'category';
  suggested_category?: string;
}

// Category mappings for smart suggestions
const CATEGORY_MAP: Record<string, string> = {
  'shoe': 'Retail & Consumer Goods > Footwear',
  'restaurant': 'Food & Beverage > Restaurants',
  'salon': 'Health & Wellness > Beauty Services',
  'gym': 'Health & Wellness > Fitness',
  'agency': 'Professional Services > Marketing',
  'saas': 'SaaS & Technology > Software',
  'store': 'Retail & Consumer Goods',
  'shop': 'Retail & Consumer Goods',
  'online': 'E-commerce',
  'freelancer': 'Professional Services & Freelance',
  'consultant': 'Professional Services',
  'blog': 'Entertainment & Media',
  'youtube': 'Entertainment & Media > Content Creation',
  'podcast': 'Entertainment & Media > Content Creation',
  'real estate': 'Real Estate',
  'hotel': 'Travel & Hospitality',
  'cafe': 'Food & Beverage > Cafes',
  'coffee': 'Food & Beverage > Cafes',
  'bar': 'Food & Beverage > Beverages',
};

export const smartSearch = (userInput: string): BusinessSearchResult[] => {
  const query = userInput.toLowerCase().trim();
  const allBusinesses = (businessStrategies as any).businesses;

  const results = allBusinesses
    .map((business: any) => {
      let score = 0;
      let match_type: 'name' | 'keyword' | 'category' = 'name';

      // EXACT NAME MATCH (highest)
      if (business.name.toLowerCase() === query) {
        score = 100;
      }

      // NAME CONTAINS (high)
      if (business.name.toLowerCase().includes(query)) {
        score = 80;
      }

      // KEYWORD MATCH (medium-high)
      if (business.keywords?.some((k: string) => k.includes(query))) {
        score = 70;
        match_type = 'keyword';
      }

      // CATEGORY MATCH (medium)
      if (business.category.toLowerCase().includes(query)) {
        score = 50;
        match_type = 'category';
      }

      // WORD BOUNDARY MATCH (medium)
      const nameWords = business.name.toLowerCase().split(/\s+/);
      if (nameWords.some((w: string) => w.startsWith(query))) {
        score = Math.max(score, 65);
      }

      return {
        business,
        score,
        match_type
      };
    })
    .filter((r: any) => r.score > 40)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 8)
    .map((r: any) => ({
      id: r.business.id,
      name: r.business.name,
      category: r.business.category,
      relevance: r.score > 80 ? 'exact' : r.score > 60 ? 'high' : 'medium',
      match_type: r.match_type,
      suggested_category: CATEGORY_MAP[query]
    }));

  return results;
};

// Get suggestions while typing
export const getSearchSuggestions = (userInput: string): string[] => {
  const query = userInput.toLowerCase();
  const allBusinesses = (businessStrategies as any).businesses;

  const suggestions = [
    ...allBusinesses
      .filter((b: any) => b.name.toLowerCase().startsWith(query) ||
                   b.keywords?.some((k: string) => k.startsWith(query)))
      .slice(0, 5)
      .map((b: any) => b.name),

    ...Object.keys(CATEGORY_MAP)
      .filter(k => k.startsWith(query))
      .map(k => `Search: "${k}" (${CATEGORY_MAP[k]})`)
      .slice(0, 3)
  ];

  return Array.from(new Set(suggestions));
};

// Get popular searches
export const getPopularSearches = (): string[] => {
  return [
    'Shoe Shop',
    'Restaurant',
    'Gym',
    'Salon',
    'B2B SaaS',
    'Coffee Shop',
    'E-commerce Store',
    'Marketing Agency',
    'Real Estate Agent',
    'Freelancer'
  ];
};
