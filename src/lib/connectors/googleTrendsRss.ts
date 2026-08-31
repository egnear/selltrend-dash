import { XMLParser } from "fast-xml-parser";

export interface RealTrendItem {
  title: string;
  approxTraffic: string;
  approxTrafficValue: number;
  newsTitle: string | null;
  newsSource: string | null;
  newsUrl: string | null;
}

interface CacheEntry {
  data: RealTrendItem[];
  fetchedAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos: suficiente pra ser "ao vivo" sem martelar o Google

function parseTraffic(raw: string | undefined): number {
  if (!raw) return 0;
  const match = raw.replace(/\./g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Google Trends — RSS público oficial de tendências de busca por país.
 * https://trends.google.com/trending/rss?geo=BR
 * Não precisa de chave/API key: é um feed público mantido pelo próprio Google.
 * Pode falhar ocasionalmente (rate limit / manutenção) — nesse caso devolvemos
 * a última leitura em cache (ou lista vazia) em vez de inventar números.
 */
export async function fetchRealGoogleTrendsBR(): Promise<{ items: RealTrendItem[]; live: boolean; error?: string }> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { items: cache.data, live: true };
  }

  try {
    const res = await fetch("https://trends.google.com/trending/rss?geo=BR", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SellTrendDash/1.0" },
      next: { revalidate: 0 },
    });

    if (!res.ok) throw new Error(`Google Trends respondeu ${res.status}`);

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: true });
    const parsed = parser.parse(xml);
    const rawItems = parsed?.rss?.channel?.item;
    const list = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    const items: RealTrendItem[] = list.map((item: Record<string, unknown>) => {
      const newsItemRaw = item["ht:news_item"];
      const newsItem = Array.isArray(newsItemRaw) ? newsItemRaw[0] : newsItemRaw;
      const traffic = String(item["ht:approx_traffic"] ?? "");
      return {
        title: String(item.title ?? "").trim(),
        approxTraffic: traffic,
        approxTrafficValue: parseTraffic(traffic),
        newsTitle: newsItem?.["ht:news_item_title"] ? String(newsItem["ht:news_item_title"]) : null,
        newsSource: newsItem?.["ht:news_item_source"] ? String(newsItem["ht:news_item_source"]) : null,
        newsUrl: newsItem?.["ht:news_item_url"] ? String(newsItem["ht:news_item_url"]) : null,
      };
    });

    cache = { data: items, fetchedAt: Date.now() };
    return { items, live: true };
  } catch (error) {
    // Se já tivemos uma leitura boa antes, é melhor mostrar dado antigo do que travar o dashboard.
    if (cache) return { items: cache.data, live: true };
    return { items: [], live: false, error: error instanceof Error ? error.message : "Erro desconhecido" };
  }
}
