export type Platform = "tiktok_shop" | "shopee" | "mercado_livre";

export type Period = "hour" | "day" | "week" | "month";

export interface CategoryDefinition {
  id: string;
  name: string;
  emoji: string;
}

export interface TimePoint {
  /** ISO timestamp for the bucket start */
  timestamp: string;
  label: string;
  salesVolume: number;
  contentVolume: number;
}

export interface CategoryStat {
  category: CategoryDefinition;
  salesVolume: number;
  contentVolume: number;
  growthPct: number;
  score: number;
}

export interface PlatformShare {
  platform: Platform;
  label: string;
  salesVolume: number;
  sharePct: number;
}

export interface HeatmapCell {
  dayOfWeek: number; // 0 = domingo
  hour: number;
  intensity: number; // 0-100
}

export interface TrendingKeyword {
  keyword: string;
  category: CategoryDefinition;
  searchVolume: number;
  growthPct: number;
  suggestedFormat: "Vídeo curto (Reels/TikTok)" | "Live shopping" | "Carrossel/Post" | "Unboxing" | "Review comparativo";
  source: "Google Trends (estimativa)" | "Google Trends (ao vivo)";
  isRealSignal: boolean;
}

export interface RealTrendItem {
  title: string;
  approxTraffic: string;
  newsTitle: string | null;
  newsSource: string | null;
  newsUrl: string | null;
  matchedCategory: CategoryDefinition | null;
}

export type DataSourceStatus = "ao_vivo" | "aguardando_credenciais" | "indisponivel";

export interface DataSourceInfo {
  id: string;
  label: string;
  status: DataSourceStatus;
  description: string;
  setupUrl: string;
  envVar: string;
}

export interface ProductRecommendation {
  product: string;
  category: CategoryDefinition;
  platform: Platform;
  demandScore: number;
  priceBand: string;
  bestWindow: string;
  reason: string;
}

export interface ContentSuggestion {
  timeframe: string;
  title: string;
  format: string;
  category: CategoryDefinition;
  expectedReach: "Alto" | "Médio" | "Muito alto";
}

export interface DashboardSummary {
  generatedAt: string;
  filters: {
    platform: Platform | "all";
    period: Period;
    category: string | "all";
  };
  kpis: {
    totalSalesVolume: number;
    totalContentVolume: number;
    avgGrowthPct: number;
    bestCategoryNow: string;
    bestHourLabel: string;
  };
  dataSources: DataSourceInfo[];
  realTrendsNow: RealTrendItem[];
  timeline: TimePoint[];
  categoryStats: CategoryStat[];
  platformShares: PlatformShare[];
  heatmap: HeatmapCell[];
  trendingKeywords: TrendingKeyword[];
  productRecommendations: ProductRecommendation[];
  contentPlan: ContentSuggestion[];
}
