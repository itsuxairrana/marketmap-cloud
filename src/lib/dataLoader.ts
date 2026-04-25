import businessDataFile from '@/data/business_marketing_data.json';
import businessTaxonomy from '@/data/business_taxonomy.json';

export interface BusinessTypeData {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  microcategory?: string;
  variants?: {
    online?: any;
    physical?: any;
    b2b?: any;
  };
}

// Load all available business data
export const getAllBusinessData = (): BusinessTypeData[] => {
  return (businessDataFile as any).business_types || [];
};

// Get list of available business IDs
export const getAvailableBusinessIds = (): string[] => {
  return getAllBusinessData().map(b => b.microcategory || b.id);
};

// Get categories that have data
export const getCategoriesWithData = (): string[] => {
  const allData = getAllBusinessData();
  return Array.from(new Set(allData.map(b => b.category).filter(Boolean)));
};

// Get subcategories for a category (only if they have data)
export const getSubcategoriesWithData = (category: string): string[] => {
  const allData = getAllBusinessData();
  return Array.from(
    new Set(
      allData
        .filter(b => b.category === category)
        .map(b => b.subcategory)
        .filter((sub): sub is string => Boolean(sub))
    )
  );
};

// Get business types for category + subcategory
export const getBusinessTypesWithData = (
  category: string,
  subcategory?: string
): BusinessTypeData[] => {
  const allData = getAllBusinessData();
  return allData.filter(b => {
    if (b.category !== category) return false;
    if (subcategory && b.subcategory !== subcategory) return false;
    return true;
  });
};

// Get specific business data by ID
export const getBusinessData = (businessId: string): BusinessTypeData | null => {
  return getAllBusinessData().find(b => b.microcategory === businessId || b.id === businessId) || null;
};

// FALLBACK OPTION A: Fuzzy search for user input
export const searchBusinessType = (userInput: string): BusinessTypeData[] => {
  const allData = getAllBusinessData();
  const query = userInput.toLowerCase();

  return allData
    .map(b => ({
      business: b,
      score: calculateMatchScore(query, b),
    }))
    .filter(m => m.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .map(m => m.business);
};

// Calculate relevance score between search query and business type
const calculateMatchScore = (query: string, business: BusinessTypeData): number => {
  const name = business.name.toLowerCase();
  const category = business.category.toLowerCase();
  const subcategory = (business.subcategory || '').toLowerCase();

  let score = 0;

  // Exact match
  if (name === query) score += 1.0;

  // Name contains query
  if (name.includes(query)) score += 0.8;

  // Category or subcategory contains query
  if (category.includes(query) || subcategory.includes(query)) score += 0.5;

  // Partial match (word boundaries)
  if (matchPartialWords(query, name)) score += 0.6;
  if (matchPartialWords(query, category)) score += 0.4;

  return score;
};

// Match individual words
const matchPartialWords = (query: string, text: string): boolean => {
  const words = text.split(' ');
  const queryWords = query.split(' ');
  return queryWords.some(qw => words.some(w => w.includes(qw)));
};

// FALLBACK OPTION B: Get closest match by category/subcategory
export const getClosestMatches = (
  category?: string,
  subcategory?: string
): BusinessTypeData[] => {
  const allData = getAllBusinessData();

  let candidates = allData;
  if (category) {
    candidates = candidates.filter(b =>
      b.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (subcategory) {
    candidates = candidates.filter(b =>
      b.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  }

  return candidates.slice(0, 3);
};

// FALLBACK OPTION C: Check if data exists before showing
export const hasDataForBusiness = (businessId: string): boolean => {
  return getAvailableBusinessIds().includes(businessId);
};

// Get list of available variants for a business
export const getAvailableVariants = (businessId: string): string[] => {
  const business = getBusinessData(businessId);
  if (!business?.variants) return [];
  return Object.keys(business.variants).filter(
    (k) => business.variants![k as keyof typeof business.variants]
  );
};
