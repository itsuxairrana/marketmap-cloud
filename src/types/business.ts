export interface HeroChannel {
  platform: string;
  platform_icon?: string;
  cac_range: string;
  cac_source?: string;
  conversion_rate: string;
  conversion_source?: string;
  roas?: string;
  why_it_works: string;
  time_to_lead?: string;
  effort_level?: string;
  example_companies?: string[];
  example_evidence?: string;
  usage_pattern?: string;
  source?: string;
}

export interface SupportChannel {
  platform: string;
  platform_icon?: string;
  cac_range: string;
  cac_source?: string;
  conversion_rate: string;
  conversion_source?: string;
  why_it_works: string;
  usage_pattern?: string;
  source?: string;
}

export interface HiddenGoldmine {
  platform: string;
  platform_url?: string;
  platform_icon?: string;
  cac_range: string;
  cac_source?: string;
  why_hidden: string;
  why_valuable: string;
  how_to_use: string;
  success_example?: string;
  evidence_source?: string;
  estimated_time_to_results?: string;
}

export interface BusinessVariant {
  hero_channel: HeroChannel;
  support_channels: SupportChannel[];
  hidden_goldmines: HiddenGoldmine[];
  audience_locations: {
    online_communities: string[];
    offline_locations: string[];
    content_consumed: string[];
    search_behavior: string[];
  };
  budget_allocation: {
    hero_channel_pct: number;
    hero_channel_detail: string;
    support_channels_pct: number;
    support_channels_detail: string;
    goldmines_pct: number;
    goldmines_detail: string;
  };
}

export interface BusinessType {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  microcategory?: string;
  variant_type: string;
  variants: {
    online?: BusinessVariant;
    physical?: BusinessVariant;
    b2b?: BusinessVariant;
  };
  monthly_budget_recommendation?: {
    min: number;
    recommended: number;
    max: number;
  };
  growth_potential?: string;
  competitive_landscape?: string;
  success_factors?: string[];
}

export interface TaxonomyMicroCategory {
  id: string;
  name: string;
  variants: Array<{
    type: 'online' | 'physical' | 'b2b';
    name: string;
  }>;
}

export interface TaxonomySubcategory {
  id: string;
  name: string;
  microcategories: TaxonomyMicroCategory[];
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  description?: string;
  subcategories: TaxonomySubcategory[];
}

export interface BusinessTaxonomy {
  taxonomy_version: string;
  total_business_types: number;
  structure: string;
  last_updated: string;
  note: string;
  categories: TaxonomyCategory[];
}

export interface FormState {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedBusinessType: string | null;
  selectedVariant: 'online' | 'physical' | 'b2b';
  selectedBudget: number;
}
