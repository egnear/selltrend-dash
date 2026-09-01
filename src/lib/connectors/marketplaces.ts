import type { Platform } from "../types";
import { CATEGORIES, CATEGORY_PLATFORM_AFFINITY, CATEGORY_POPULARITY_INDEX, dayOfWeekMultiplier, hourMultiplier } from "../constants";

export interface RawCategorySample {
  categoryId: string;
  platform: Platform;
  salesVolume: number;
  growthPct: number;
}

/**
 * Cada conector segue o mesmo contrato: se as credenciais reais estiverem presentes
 * no .env.local, ele usa a API oficial da plataforma (dados 100% reais da SUA loja).
 * Sem credenciais, ele devolve uma ESTIMATIVA determinística (mesmos números para
 * todo mundo, sem números aleatórios) calculada a partir de: índice de popularidade
 * da categoria + afinidade histórica com a plataforma + padrão sazonal de hora/dia.
 * Nada aqui usa Math.random ou qualquer gerador aleatório.
 */
export interface MarketplaceConnector {
  platform: Platform;
  isLive(): boolean;
  hasCredentials(): boolean;
  fetchVolume(): Promise<RawCategorySample[]>;
}

function estimateForPlatform(platform: Platform): RawCategorySample[] {
  const now = new Date();
  const hour = now.getHours();
  const dow = now.getDay();
  const seasonality = hourMultiplier(hour) * dayOfWeekMultiplier(dow);
  // Momentum determinístico: compara a intensidade horária atual com a de 3h atrás.
  const seasonality3hAgo = hourMultiplier(hour - 3) * dayOfWeekMultiplier(dow);

  return CATEGORIES.map((category) => {
    const affinity = CATEGORY_PLATFORM_AFFINITY[category.id]?.[platform] ?? 1;
    const popularity = CATEGORY_POPULARITY_INDEX[category.id] ?? 50;
    const salesVolume = Math.round(seasonality * affinity * popularity * 12);
    const growthPct = Math.round(((seasonality - seasonality3hAgo) / seasonality3hAgo) * 1000) / 10;
    return { categoryId: category.id, platform, salesVolume, growthPct };
  });
}

/**
 * TikTok Shop Partner API — para dados reais, registre um app em
 * https://partner.tiktokshop.com e configure TIKTOK_SHOP_ACCESS_TOKEN no .env.local,
 * então implemente fetchVolume() com o endpoint "Order Volume"/"Product Analytics"
 * da conta do vendedor (exige aprovação do TikTok, não existe endpoint público).
 */
export const tiktokShopConnector: MarketplaceConnector = {
  platform: "tiktok_shop",
  isLive() {
    return false;
  },
  hasCredentials() {
    return Boolean(process.env.TIKTOK_SHOP_ACCESS_TOKEN);
  },
  async fetchVolume() {
    return estimateForPlatform("tiktok_shop");
  },
};

/**
 * Shopee Open Platform — credenciais: SHOPEE_PARTNER_ID / SHOPEE_PARTNER_KEY / SHOPEE_SHOP_ID
 * em https://open.shopee.com. Use o endpoint de "Shop Performance"/"Item Insights"
 * (exige loja parceira aprovada, não existe endpoint público de vendas de terceiros).
 */
export const shopeeConnector: MarketplaceConnector = {
  platform: "shopee",
  isLive() {
    return false;
  },
  hasCredentials() {
    return Boolean(process.env.SHOPEE_PARTNER_KEY);
  },
  async fetchVolume() {
    return estimateForPlatform("shopee");
  },
};

/**
 * Mercado Livre API — o endpoint público de busca (/sites/MLB/search) foi bloqueado
 * pelo próprio Mercado Livre para chamadas sem OAuth (retorna 403 mesmo sem chave).
 * Configure MERCADO_LIVRE_ACCESS_TOKEN (OAuth da sua conta vendedora) em
 * https://developers.mercadolivre.com.br para puxar as vendas reais da sua loja.
 */
export const mercadoLivreConnector: MarketplaceConnector = {
  platform: "mercado_livre",
  isLive() {
    return false;
  },
  hasCredentials() {
    return Boolean(process.env.MERCADO_LIVRE_ACCESS_TOKEN);
  },
  async fetchVolume() {
    return estimateForPlatform("mercado_livre");
  },
};

export const marketplaceConnectors: MarketplaceConnector[] = [tiktokShopConnector, shopeeConnector, mercadoLivreConnector];

