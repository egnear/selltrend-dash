# 🚀 SellTrend Dash

Dashboard de inteligência de mercado para quem vende no **TikTok Shop**, **Shopee** e
**Mercado Livre**: cruza volume de vendas por categoria com volume de conteúdo
pesquisado/tendências, e gera recomendações automáticas de **o que vender** e
**o que produzir de conteúdo agora**, filtrando por hora, dia, semana ou mês.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Recharts (gráficos)
- API Routes internas (`/api/summary`) fazendo a agregação server-side

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Como funciona o motor de dados

Cada fonte de dado é isolada em um **conector** com contrato único:

- `src/lib/connectors/marketplaces.ts` → um conector por plataforma
  (`tiktokShopConnector`, `shopeeConnector`, `mercadoLivreConnector`)
- `src/lib/connectors/trends.ts` → combina o Google Trends real com a estimativa por categoria
- `src/lib/connectors/googleTrendsRss.ts` → conector **real** (feed RSS oficial do Google, sem chave)

Cada conector de marketplace expõe `isLive()` (true se houver credenciais no
`.env.local`) e `fetchVolume()`. **Sem credenciais**, o dashboard usa uma
**estimativa determinística** (mesma fórmula sempre: índice de popularidade fixo da
categoria × padrão sazonal de hora/dia — nada de `Math.random`). O Google Trends,
por outro lado, já funciona 100% ao vivo sem nenhuma configuração. A seção
"Conexões com APIs externas" no topo do dashboard mostra o status real de cada
fonte (🟢 ao vivo / 🟡 aguardando credenciais / 🔴 indisponível).

📄 Veja [`PROJETO-EXPLICADO.txt`](./PROJETO-EXPLICADO.txt) para o guia completo em
linguagem simples (o que é real, o que é estimativa, como conectar cada API passo a
passo).

## Ativando dados reais das lojas (opcional)

Copie `.env.example` para `.env.local` e preencha as credenciais da(s) plataforma(s)
que você já tem acesso:

| Fonte | Status | Onde conseguir credenciais | O que preencher |
|---|---|---|---|
| Google Trends | 🟢 Já ativo, sem chave | feed público `trends.google.com/trending/rss` | nada a fazer |
| TikTok Shop | 🟡 Precisa de OAuth | [partner.tiktokshop.com](https://partner.tiktokshop.com) (cadastro de app + aprovação do vendedor) | `TIKTOK_SHOP_ACCESS_TOKEN` |
| Shopee | 🟡 Precisa de OAuth | [open.shopee.com](https://open.shopee.com) (Open Platform, precisa de loja parceira) | `SHOPEE_PARTNER_KEY`, `SHOPEE_SHOP_ID` |
| Mercado Livre | 🟡 Precisa de OAuth | [developers.mercadolivre.com.br](https://developers.mercadolivre.com.br) (OAuth da sua conta de vendedor) | `MERCADO_LIVRE_ACCESS_TOKEN` |

Depois de configurar, implemente a chamada real dentro do `TODO` de cada conector em
`src/lib/connectors/marketplaces.ts` — a estrutura de retorno (`RawCategorySample`)
já está pronta, então o resto do dashboard (gráficos, heatmap, recomendações) não
precisa mudar nada.

> ⚠️ Nenhuma dessas 3 plataformas oferece uma API pública "de vendas de terceiros"
> sem autenticação — testamos e o próprio endpoint público de busca do Mercado Livre
> retorna `403 Forbidden` hoje em dia. Cada vendedor só acessa os próprios dados via
> OAuth. Respeite sempre os Termos de Uso de cada API — não tentamos contornar
> bloqueios ou fazer scraping não autorizado.

## Estrutura principal

```
src/
  lib/
    types.ts              tipos compartilhados do dashboard
    constants.ts           categorias, plataformas, curvas de hora/dia, índice de popularidade
    aggregate.ts            monta o DashboardSummary (KPIs, timeline, heatmap, recomendações)
    connectors/
      marketplaces.ts       TikTok Shop / Shopee / Mercado Livre (estimativa até conectar OAuth)
      googleTrendsRss.ts     Google Trends real (RSS oficial, ao vivo, sem chave)
      trends.ts              junta Google Trends real + estimativa por categoria
  app/
    api/summary/route.ts    endpoint único consumido pelo front (?platform&period&category)
    page.tsx                 client component do dashboard
  components/
    FiltersBar, ConnectionsPanel, RealTrendsWidget, KpiCard, VolumeChart,
    CategoryBarChart, PlatformShareChart, HourHeatmap, TrendingKeywordsTable,
    ProductRecommendations, ContentPlan
```

## Motor de recomendação

Para cada categoria: `score = 0.5 * vendas_normalizadas + 0.3 * conteúdo_normalizado + 0.2 * crescimento`.
As categorias com maior score alimentam os painéis **"O que vender agora"** e
**"O que produzir agora"**, cruzando com as palavras-chave de maior volume de busca
no período filtrado (hora/dia/semana/mês), com boost real quando uma tendência do
Google Trends bate com a categoria.

