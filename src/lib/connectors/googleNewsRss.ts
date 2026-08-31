import { XMLParser } from "fast-xml-parser";

export interface GoogleNewsItem {
  title: string;
  source: string | null;
  url: string | null;
  publishedAt: string | null;
}

interface CacheEntry {
  data: GoogleNewsItem[];
  fetchedAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 15 * 60 * 1000;

/** Google News RSS Brasil: manchetes e temas reais em circulação, sem chave. */
export async function fetchRealGoogleNewsBR(): Promise<{ items: GoogleNewsItem[]; live: boolean }> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return { items: cache.data, live: true };

  try {
    const response = await fetch("https://news.google.com/rss?hl=pt-BR&gl=BR&ceid=BR:pt-419", {
      headers: { "User-Agent": "SellTrendDash/1.0" },
      next: { revalidate: 0 },
    });
    if (!response.ok) throw new Error(`Google News respondeu ${response.status}`);

    const xml = await response.text();
    const parsed = new XMLParser({ ignoreAttributes: true }).parse(xml);
    const rawItems = parsed?.rss?.channel?.item;
    const entries = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
    const items = entries.slice(0, 12).map((item: Record<string, unknown>) => ({
      title: String(item.title ?? "").trim(),
      source: item.source ? String(item.source) : null,
      url: item.link ? String(item.link) : null,
      publishedAt: item.pubDate ? String(item.pubDate) : null,
    }));

    cache = { data: items, fetchedAt: Date.now() };
    return { items, live: true };
  } catch {
    return { items: cache?.data ?? [], live: Boolean(cache) };
  }
}
