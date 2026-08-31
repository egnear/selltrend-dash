import { CATEGORIES, PLATFORMS, dayOfWeekMultiplier, hourMultiplier } from "./constants";
import { fetchRealGoogleNewsBR } from "./connectors/googleNewsRss";
import { marketplaceConnectors } from "./connectors/marketplaces";
import { fetchTrendsData } from "./connectors/trends";
import type {
  CategoryStat,
  ContentSuggestion,
  DashboardSummary,
  DataSourceInfo,
  HeatmapCell,
  Period,
  Platform,
  PlatformShare,
  ProductRecommendation,
  TimePoint,
} from "./types";

const DAY_NAMES = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/** Nenhuma função de tempo abaixo usa números aleatórios: tudo é curva sazonal fixa (hora x dia da semana). */
function buildTimeline(period: Period): TimePoint[] {
  const points: TimePoint[] = [];
  const now = new Date();

  if (period === "hour" || period === "day") {
    for (let i = 23; i >= 0; i--) {
      const t = new Date(now);
      t.setMinutes(0, 0, 0);
      t.setHours(t.getHours() - i);
      const mult = hourMultiplier(t.getHours()) * dayOfWeekMultiplier(t.getDay());
      points.push({
        timestamp: t.toISOString(),
        label: `${String(t.getHours()).padStart(2, "0")}h`,
        salesVolume: Math.round(mult * 900),
        contentVolume: Math.round(mult * 700),
      });
    }
  } else if (period === "week") {
    for (let i = 6; i >= 0; i--) {
      const t = new Date(now);
      t.setDate(t.getDate() - i);
      const mult = dayOfWeekMultiplier(t.getDay());
      points.push({
        timestamp: t.toISOString(),
        label: DAY_NAMES[t.getDay()],
        salesVolume: Math.round(mult * 7200),
        contentVolume: Math.round(mult * 5600),
      });
    }
  } else {
    for (let i = 29; i >= 0; i--) {
      const t = new Date(now);
      t.setDate(t.getDate() - i);
      const mult = dayOfWeekMultiplier(t.getDay());
      points.push({
        timestamp: t.toISOString(),
        label: `${t.getDate()}/${t.getMonth() + 1}`,
        salesVolume: Math.round(mult * 6800),
        contentVolume: Math.round(mult * 5400),
      });
    }
  }

  return points;
}

function buildHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const intensity = Math.min(100, Math.round(hourMultiplier(hour) * dayOfWeekMultiplier(day) * 68));
      cells.push({ dayOfWeek: day, hour, intensity });
    }
  }
  return cells;
}

function buildDataSources(googleTrendsLive: boolean, googleNewsLive: boolean): DataSourceInfo[] {
  return [
    {
      id: "google-trends",
      label: "Google Trends (RSS oficial)",
      status: googleTrendsLive ? "ao_vivo" : "indisponivel",
      description: "Tendências de busca reais no Brasil agora, direto do feed público do Google. Não precisa de chave.",
      setupUrl: "https://trends.google.com/trending?geo=BR",
      envVar: "— (sem configuração necessária)",
    },
    {
      id: "google-news",
      label: "Google News (RSS oficial)",
      status: googleNewsLive ? "ao_vivo" : "indisponivel",
      description: "Manchetes e assuntos em circulação no Brasil, úteis para encontrar ganchos de conteúdo no momento certo.",
      setupUrl: "https://news.google.com/home?hl=pt-BR&gl=BR&ceid=BR:pt-419",
      envVar: "— (sem configuração necessária)",
    },
    {
      id: "x-twitter",
      label: "X / Twitter API v2",
      status: process.env.X_BEARER_TOKEN ? "ao_vivo" : "aguardando_credenciais",
      description: "Posts, hashtags e tópicos públicos em alta pelo acesso oficial da API do X. Exige plano e token do X Developer.",
      setupUrl: "https://developer.x.com/en/portal/dashboard",
      envVar: "X_BEARER_TOKEN",
    },
    {
      id: "youtube",
      label: "YouTube Data API",
      status: process.env.YOUTUBE_API_KEY ? "ao_vivo" : "aguardando_credenciais",
      description: "Vídeos populares, palavras-chave e sinais de conteúdo com alta audiência no YouTube Brasil.",
      setupUrl: "https://console.cloud.google.com/apis/library/youtube.googleapis.com",
      envVar: "YOUTUBE_API_KEY",
    },
    {
      id: "pinterest",
      label: "Pinterest API",
      status: process.env.PINTEREST_ACCESS_TOKEN ? "ao_vivo" : "aguardando_credenciais",
      description: "Tendências visuais, Pins e desempenho da sua conta no Pinterest. Ótimo para moda, decoração e beleza.",
      setupUrl: "https://developers.pinterest.com",
      envVar: "PINTEREST_ACCESS_TOKEN",
    },
    {
      id: "google-analytics",
      label: "Google Analytics 4",
      status: process.env.GOOGLE_ANALYTICS_PROPERTY_ID ? "ao_vivo" : "aguardando_credenciais",
      description: "Páginas vistas, origem do tráfego e conversões do seu próprio site ou loja, via GA4 Data API.",
      setupUrl: "https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com",
      envVar: "GOOGLE_ANALYTICS_PROPERTY_ID",
    },
    {
      id: "search-console",
      label: "Google Search Console API",
      status: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ? "ao_vivo" : "aguardando_credenciais",
      description: "Consultas reais que levam pessoas ao seu site, impressões e cliques no Google Search.",
      setupUrl: "https://search.google.com/search-console",
      envVar: "GOOGLE_SEARCH_CONSOLE_SITE_URL",
    },
    {
      id: "tiktok-shop",
      label: "TikTok Shop Partner API",
      status: process.env.TIKTOK_SHOP_ACCESS_TOKEN ? "ao_vivo" : "aguardando_credenciais",
      description: "Vendas reais da sua loja no TikTok Shop. Exige app aprovado pelo TikTok (não existe endpoint público).",
      setupUrl: "https://partner.tiktokshop.com",
      envVar: "TIKTOK_SHOP_ACCESS_TOKEN",
    },
    {
      id: "shopee",
      label: "Shopee Open Platform",
      status: process.env.SHOPEE_PARTNER_KEY ? "ao_vivo" : "aguardando_credenciais",
      description: "Vendas reais da sua loja na Shopee. Exige cadastro de app na Shopee Open Platform.",
      setupUrl: "https://open.shopee.com",
      envVar: "SHOPEE_PARTNER_KEY",
    },
    {
      id: "mercado-livre",
      label: "Mercado Livre API",
      status: process.env.MERCADO_LIVRE_ACCESS_TOKEN ? "ao_vivo" : "aguardando_credenciais",
      description: "Vendas reais da sua conta vendedora no Mercado Livre via OAuth (a busca pública foi bloqueada pelo ML).",
      setupUrl: "https://developers.mercadolivre.com.br",
      envVar: "MERCADO_LIVRE_ACCESS_TOKEN",
    },
  ];
}

export async function buildDashboardSummary(filters: {
  platform: Platform | "all";
  period: Period;
  category: string | "all";
}): Promise<DashboardSummary> {
  const connectors =
    filters.platform === "all"
      ? marketplaceConnectors
      : marketplaceConnectors.filter((c) => c.platform === filters.platform);

  const [samplesByConnector, trendsResult, googleNews] = await Promise.all([
    Promise.all(connectors.map((c) => c.fetchVolume())),
    fetchTrendsData(),
    fetchRealGoogleNewsBR(),
  ]);

  const samples = samplesByConnector.flat();
  const { keywords, realTrendsNow, googleTrendsLive } = trendsResult;

  // Agrega por categoria
  const categoryStats: CategoryStat[] = CATEGORIES.filter(
    (c) => filters.category === "all" || c.id === filters.category
  ).map((category) => {
    const relevantSamples = samples.filter((s) => s.categoryId === category.id);
    const salesVolume = relevantSamples.reduce((sum, s) => sum + s.salesVolume, 0);
    const growthPct =
      relevantSamples.length > 0
        ? Math.round((relevantSamples.reduce((sum, s) => sum + s.growthPct, 0) / relevantSamples.length) * 10) / 10
        : 0;
    const relatedKeywords = keywords.filter((k) => k.category.id === category.id);
    const contentVolume = relatedKeywords.reduce((sum, k) => sum + k.searchVolume, 0);
    return { category, salesVolume, contentVolume, growthPct, score: 0 };
  });

  const maxSales = Math.max(1, ...categoryStats.map((c) => c.salesVolume));
  const maxContent = Math.max(1, ...categoryStats.map((c) => c.contentVolume));
  categoryStats.forEach((c) => {
    c.score =
      Math.round(
        (0.5 * (c.salesVolume / maxSales) + 0.3 * (c.contentVolume / maxContent) + 0.2 * Math.max(0, c.growthPct / 40)) *
          1000
      ) / 10;
  });
  categoryStats.sort((a, b) => b.score - a.score);

  // Marketplace share
  const platformShares: PlatformShare[] = PLATFORMS.map((p) => {
    const total = samples.filter((s) => s.platform === p.id).reduce((sum, s) => sum + s.salesVolume, 0);
    return { platform: p.id, label: p.label, salesVolume: total, sharePct: 0 };
  });
  const grandTotal = Math.max(1, platformShares.reduce((sum, p) => sum + p.salesVolume, 0));
  platformShares.forEach((p) => {
    p.sharePct = Math.round((p.salesVolume / grandTotal) * 1000) / 10;
  });

  const timeline = buildTimeline(filters.period);
  const heatmap = buildHeatmap();

  const filteredKeywords = keywords.filter((k) => filters.category === "all" || k.category.id === filters.category);

  const topCategories = categoryStats.slice(0, 5);
  const productRecommendations: ProductRecommendation[] = topCategories.flatMap((stat, idx) => {
    const platformPick = platformShares.slice().sort((a, b) => b.salesVolume - a.salesVolume)[idx % platformShares.length];
    const relatedKeyword = filteredKeywords.find((k) => k.category.id === stat.category.id);
    return [
      {
        product: relatedKeyword ? `Kit / linha de "${relatedKeyword.keyword}"` : `Itens em alta de ${stat.category.name}`,
        category: stat.category,
        platform: platformPick.platform,
        demandScore: stat.score,
        priceBand: stat.score > 70 ? "R$ 39 - R$ 129" : stat.score > 40 ? "R$ 25 - R$ 79" : "R$ 15 - R$ 49",
        bestWindow: stat.score > 60 ? "Hoje, próximas 3h" : "Esta semana",
        reason: `Volume de vendas ${stat.salesVolume.toLocaleString("pt-BR")} + busca ${stat.contentVolume.toLocaleString(
          "pt-BR"
        )} e crescimento de ${stat.growthPct}% no período.`,
      },
    ];
  });

  const now = new Date();
  const bestHourIdx = Array.from({ length: 24 }, (_, h) => h).sort(
    (a, b) => hourMultiplier(b) - hourMultiplier(a)
  )[0];

  const contentPlan: ContentSuggestion[] = topCategories.slice(0, 4).map((stat, idx) => {
    const kw = filteredKeywords.find((k) => k.category.id === stat.category.id);
    const timeframes = ["Agora (próxima hora)", "Hoje à noite", "Amanhã de manhã", "Esta semana"];
    const reach: ContentSuggestion["expectedReach"] = stat.score > 70 ? "Muito alto" : stat.score > 40 ? "Alto" : "Médio";
    return {
      timeframe: timeframes[idx % timeframes.length],
      title: kw ? `${kw.suggestedFormat}: "${kw.keyword}"` : `Conteúdo sobre ${stat.category.name}`,
      format: kw?.suggestedFormat ?? "Vídeo curto (Reels/TikTok)",
      category: stat.category,
      expectedReach: reach,
    };
  });

  const totalSalesVolume = categoryStats.reduce((sum, c) => sum + c.salesVolume, 0);
  const totalContentVolume = categoryStats.reduce((sum, c) => sum + c.contentVolume, 0);
  const avgGrowthPct =
    categoryStats.length > 0
      ? Math.round((categoryStats.reduce((sum, c) => sum + c.growthPct, 0) / categoryStats.length) * 10) / 10
      : 0;

  return {
    generatedAt: now.toISOString(),
    filters,
    kpis: {
      totalSalesVolume,
      totalContentVolume,
      avgGrowthPct,
      bestCategoryNow: categoryStats[0]?.category.name ?? "-",
      bestHourLabel: `${String(bestHourIdx).padStart(2, "0")}h - ${String((bestHourIdx + 1) % 24).padStart(2, "0")}h`,
    },
    dataSources: buildDataSources(googleTrendsLive, googleNews.live),
    realTrendsNow,
    newsNow: googleNews.items,
    timeline,
    categoryStats,
    platformShares,
    heatmap,
    trendingKeywords: filteredKeywords.slice(0, 20),
    productRecommendations,
    contentPlan,
  };
}
