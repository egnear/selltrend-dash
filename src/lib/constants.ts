import type { CategoryDefinition, Platform } from "./types";

export const CATEGORIES: CategoryDefinition[] = [
  { id: "moda-feminina", name: "Moda Feminina", emoji: "👗" },
  { id: "beleza-skincare", name: "Beleza & Skincare", emoji: "💄" },
  { id: "eletronicos", name: "Eletrônicos & Gadgets", emoji: "🎧" },
  { id: "casa-cozinha", name: "Casa & Cozinha", emoji: "🍳" },
  { id: "pet", name: "Pet Shop", emoji: "🐾" },
  { id: "fitness", name: "Fitness & Suplementos", emoji: "🏋️" },
  { id: "infantil", name: "Infantil & Brinquedos", emoji: "🧸" },
  { id: "acessorios-tech", name: "Acessórios para Celular", emoji: "📱" },
  { id: "papelaria", name: "Papelaria & Organização", emoji: "🖊️" },
  { id: "moda-masculina", name: "Moda Masculina", emoji: "🧥" },
];

export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "tiktok_shop", label: "TikTok Shop" },
  { id: "shopee", label: "Shopee" },
  { id: "mercado_livre", label: "Mercado Livre" },
];

/**
 * Índice de popularidade de cada categoria no comércio social brasileiro (0-100).
 * É um valor FIXO e explicável (não aleatório), baseado em relatórios públicos de
 * mercado (ex.: TikTok Shop Insights, Nielsen/Sebrae) sobre as categorias mais
 * vendidas em live commerce e marketplaces no Brasil. Serve de base para a
 * ESTIMATIVA de demanda enquanto você não conecta as credenciais reais de cada
 * plataforma (veja README.md).
 */
export const CATEGORY_POPULARITY_INDEX: Record<string, number> = {
  "beleza-skincare": 92,
  "moda-feminina": 88,
  "acessorios-tech": 80,
  eletronicos: 78,
  "casa-cozinha": 74,
  infantil: 62,
  fitness: 68,
  pet: 64,
  "moda-masculina": 60,
  papelaria: 58,
};

/** Daypart multipliers para comportamento de compra/consumo de conteúdo no Brasil (pico almoço e noite). */
export function hourMultiplier(hour: number): number {
  const curve = [
    0.3, 0.2, 0.15, 0.12, 0.15, 0.25, 0.4, 0.55, 0.7, 0.8, 0.85, 0.95, 1.1, 1.05, 0.9, 0.85, 0.9, 1.0, 1.2, 1.35, 1.4,
    1.25, 0.9, 0.55,
  ];
  return curve[((hour % 24) + 24) % 24];
}

export function dayOfWeekMultiplier(day: number): number {
  // 0 = domingo ... 6 = sábado
  const curve = [1.15, 0.85, 0.9, 0.95, 1.0, 1.1, 1.3];
  return curve[((day % 7) + 7) % 7];
}

export const CATEGORY_PLATFORM_AFFINITY: Record<string, Partial<Record<Platform, number>>> = {
  "moda-feminina": { tiktok_shop: 1.3, shopee: 1.1, mercado_livre: 0.7 },
  "beleza-skincare": { tiktok_shop: 1.4, shopee: 1.15, mercado_livre: 0.6 },
  eletronicos: { tiktok_shop: 0.9, shopee: 1.1, mercado_livre: 1.3 },
  "casa-cozinha": { tiktok_shop: 0.8, shopee: 1.2, mercado_livre: 1.2 },
  pet: { tiktok_shop: 0.9, shopee: 1.1, mercado_livre: 1.0 },
  fitness: { tiktok_shop: 1.1, shopee: 1.0, mercado_livre: 1.0 },
  infantil: { tiktok_shop: 0.85, shopee: 1.15, mercado_livre: 1.1 },
  "acessorios-tech": { tiktok_shop: 1.2, shopee: 1.2, mercado_livre: 0.9 },
  papelaria: { tiktok_shop: 1.0, shopee: 1.05, mercado_livre: 0.9 },
  "moda-masculina": { tiktok_shop: 1.05, shopee: 1.0, mercado_livre: 0.85 },
};
