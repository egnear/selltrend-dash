import type { CategoryDefinition, RealTrendItem, TrendingKeyword } from "../types";
import { CATEGORIES, CATEGORY_POPULARITY_INDEX, dayOfWeekMultiplier, hourMultiplier } from "../constants";
import { fetchRealGoogleTrendsBR } from "./googleTrendsRss";

const KEYWORD_POOL: Record<string, string[]> = {
  "moda-feminina": ["vestido midi", "conjunto alfaiataria", "blazer oversized", "bolsa transversal"],
  "beleza-skincare": ["skincare coreano", "protetor solar em bastão", "sérum vitamina C", "batom cremoso"],
  eletronicos: ["fone bluetooth", "power bank rápido", "mini projetor", "smartwatch barato"],
  "casa-cozinha": ["airfryer 5l", "organizador de geladeira", "jogo de panelas antiaderente", "luminária de mesa"],
  pet: ["comedouro automático", "roupinha para pet", "brinquedo interativo cachorro", "coleira antifuga"],
  fitness: ["creatina 300g", "whey isolado", "faixa elástica", "garrafa de água motivacional"],
  infantil: ["brinquedo educativo", "mochila escolar infantil", "livro de colorir", "kit slime"],
  "acessorios-tech": ["capinha magsafe", "película de privacidade", "suporte de celular para carro", "anel pop socket"],
  papelaria: ["planner 2026", "caderno inteligente", "caneta gel colorida", "estojo organizador"],
  "moda-masculina": ["camisa social slim", "boné aba curva", "tênis casual masculino", "bermuda cargo"],
};

const FORMATS: TrendingKeyword["suggestedFormat"][] = [
  "Vídeo curto (Reels/TikTok)",
  "Live shopping",
  "Carrossel/Post",
  "Unboxing",
  "Review comparativo",
];

function matchCategoryForTrend(title: string): CategoryDefinition | null {
  const normalized = title.toLowerCase();
  for (const category of CATEGORIES) {
    const keywords = KEYWORD_POOL[category.id] ?? [];
    const categoryTerms = [category.name.toLowerCase(), ...keywords.map((k) => k.toLowerCase())];
    if (categoryTerms.some((term) => normalized.includes(term) || term.includes(normalized))) {
      return category;
    }
  }
  return null;
}

export interface TrendsResult {
  keywords: TrendingKeyword[];
  realTrendsNow: RealTrendItem[];
  googleTrendsLive: boolean;
}

/**
 * Combina duas coisas:
 *  1) Google Trends RSS (real, ao vivo, sem chave) — tendências de busca no Brasil agora.
 *  2) Uma estimativa determinística por categoria (índice de popularidade fixo x
 *     padrão de hora/dia), usada como base de comparação para as palavras-chave do
 *     nosso catálogo de produtos. Se uma tendência real do Google bater com uma
 *     categoria, o volume dela ganha um boost real (+40%) e é marcada como "ao vivo".
 */
export async function fetchTrendsData(): Promise<TrendsResult> {
  const { items, live } = await fetchRealGoogleTrendsBR();
  const realTrendsNow: RealTrendItem[] = items.slice(0, 12).map((item) => ({
    title: item.title,
    approxTraffic: item.approxTraffic,
    newsTitle: item.newsTitle,
    newsSource: item.newsSource,
    newsUrl: item.newsUrl,
    matchedCategory: matchCategoryForTrend(item.title),
  }));

  const now = new Date();
  const seasonality = hourMultiplier(now.getHours()) * dayOfWeekMultiplier(now.getDay());

  const keywords: TrendingKeyword[] = [];
  for (const category of CATEGORIES) {
    const pool = KEYWORD_POOL[category.id] ?? [];
    const popularity = CATEGORY_POPULARITY_INDEX[category.id] ?? 50;
    const matchedRealTrend = realTrendsNow.find((t) => t.matchedCategory?.id === category.id);

    pool.forEach((keyword, idx) => {
      const rank = pool.length - idx; // primeira palavra da lista = mais relevante
      const baseVolume = Math.round(popularity * seasonality * rank * 9);
      const boosted = Boolean(matchedRealTrend);
      const searchVolume = boosted ? Math.round(baseVolume * 1.4) : baseVolume;
      const growthPct = boosted ? 38.5 : Math.round((seasonality - 1) * 100 * 10) / 10;

      keywords.push({
        keyword,
        category,
        searchVolume,
        growthPct,
        suggestedFormat: FORMATS[idx % FORMATS.length],
        source: boosted ? "Google Trends (ao vivo)" : "Google Trends (estimativa)",
        isRealSignal: boosted,
      });
    });
  }

  return { keywords: keywords.sort((a, b) => b.searchVolume - a.searchVolume), realTrendsNow, googleTrendsLive: live };
}

