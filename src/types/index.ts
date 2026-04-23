// Archetype types
export type ArchetypeId = 'b2b_saas' | 'dtc_ecommerce' | 'indie_hackers' | 'agency_service';

export interface Channel {
  rank: number;
  platform: string;
  category: string;
  audience: string;
  typical_cac: string;
  conversion_rate: string;
  example_companies: string[];
  why_it_works: string;
  effort_level: string;
  time_to_first_lead: string;
  data_source?: string;
}

export interface GoldenMine {
  platform: string;
  category: string;
  audience_size: string;
  cost_model?: string;
  typical_cac?: string;
  example_companies?: string[];
  why_hidden: string;
  why_goldmine: string;
}

export interface AudienceLocation {
  name: string;
  members?: string;
  engagement?: string;
  vibe?: string;
}

export interface Archetype {
  id: ArchetypeId;
  name: string;
  subtitle: string;
  description: string;
  typical_budget_min: number;
  typical_budget_max: number;
  typical_budget_median: number;
  icp: {
    primary: string;
    secondary: string;
  };
  acv_range: string;
  core_challenges: string[];
  hero_channels: Channel[];
  paid_channels: Channel[];
  hidden_goldmines: GoldenMine[];
  audience_hangout_locations: {
    subreddits?: AudienceLocation[];
    slack_communities?: AudienceLocation[];
    podcasts?: string[];
    platforms?: string[];
    communities?: string[];
    newsletters?: string[];
  };
  budget_allocation_recommended?: {
    hero_channel_percent: number;
    support_channels_percent: number;
    experiments_goldmines_percent: number;
  };
}

export interface BudgetData {
  category: ArchetypeId;
  budget: number;
  hero_channel: Channel | null;
  support_channels: Channel[];
  hidden_goldmines: GoldenMine[];
  audience_locations: any;
  budget_breakdown: {
    hero: number;
    support: number;
    experiments: number;
  };
}

export interface AnalyticsEvent {
  event: string;
  category?: ArchetypeId;
  budget?: number;
  session_id?: string;
  timestamp?: string;
}
