import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

const PRIVATE_COMPANIES = [
  { name: "Anthropic", slug: "anthropic", lastValuation: 61.5, keywords: ["anthropic", "claude"] },
  { name: "Stripe", slug: "stripe", lastValuation: 70, keywords: ["stripe"] },
  { name: "SpaceX", slug: "spacex", lastValuation: 350, keywords: ["spacex", "starlink"] },
  { name: "OpenAI", slug: "openai", lastValuation: 300, keywords: ["openai"] },
  { name: "Databricks", slug: "databricks", lastValuation: 62, keywords: ["databricks"] },
];

interface PolymarketMarket {
  id: string;
  question: string;
  outcomePrices?: string;
  outcomes?: string;
  volume?: number;
  endDate?: string;
  active?: boolean;
}

async function fetchMarketsForCompany(
  company: (typeof PRIVATE_COMPANIES)[0],
): Promise<PolymarketMarket[]> {
  const markets: PolymarketMarket[] = [];
  for (const keyword of company.keywords) {
    try {
      const res = await fetch(
        `https://gamma-api.polymarket.com/markets?active=true&q=${encodeURIComponent(keyword)}&limit=10`,
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (Array.isArray(data)) markets.push(...data);
    } catch {
      // silently skip
    }
  }
  const seen = new Set<string>();
  return markets.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function GET(_req: NextRequest) {
  try {
    const allMarkets: Array<PolymarketMarket & { company: string }> = [];
    for (const company of PRIVATE_COMPANIES) {
      const markets = await fetchMarketsForCompany(company);
      for (const m of markets) allMarkets.push({ ...m, company: company.name });
    }

    const marketSummary = allMarkets
      .slice(0, 20)
      .map((m) => {
        let priceStr = "";
        try {
          const prices = m.outcomePrices ? JSON.parse(m.outcomePrices) : [];
          const outcomes = m.outcomes ? JSON.parse(m.outcomes) : [];
          if (prices.length > 0 && outcomes.length > 0) {
            priceStr = `${outcomes[0]}: ${(parseFloat(prices[0]) * 100).toFixed(1)}%`;
          }
        } catch {
          // ignore
        }
        return `[${m.company}] ${m.question}${priceStr ? ` | ${priceStr}` : ""}`;
      })
      .join("\n");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `以下はPolymarketで取引されている未上場企業（Anthropic、Stripe、SpaceX、OpenAI、Databricks）の予測市場データです。投資家向けに日本語で分析してください。

マーケットデータ:
${marketSummary || "現在取得できるマーケットデータがありません。一般的な未上場企業バリュエーション動向を分析してください。"}

以下のJSON形式で回答してください（コードブロック不要）:
{
  "highlights": ["注目点1（日本語50字以内）", "注目点2", "注目点3"],
  "topSignal": {
    "company": "企業名",
    "signal": "シグナル説明",
    "probability": 0.67,
    "implication": "投資家への示唆（日本語100字以内）"
  },
  "apacImpact": "APAC市場・日本の投資家への影響（日本語150字以内）",
  "confidence": 0.75
}`,
        },
      ],
    });

    let analysis = {
      highlights: ["データ取得中...", "分析をお待ちください"],
      topSignal: {
        company: "Anthropic",
        signal: "分析データなし",
        probability: 0.5,
        implication: "現在分析中です",
      },
      apacImpact: "分析中です",
      confidence: 0.5,
    };

    try {
      const text = msg.content[0].type === "text" ? msg.content[0].text : "";
      analysis = JSON.parse(text);
    } catch {
      // use default
    }

    const parsedMarkets = allMarkets.slice(0, 15).map((m) => {
      let outcomePrices: string[] | undefined;
      let outcomes: string[] | undefined;
      try {
        outcomePrices = m.outcomePrices ? JSON.parse(m.outcomePrices) : undefined;
        outcomes = m.outcomes ? JSON.parse(m.outcomes) : undefined;
      } catch {
        // ignore
      }
      return {
        id: m.id,
        question: m.question,
        company: m.company,
        outcomePrices,
        outcomes,
        volume: m.volume,
        endDate: m.endDate,
      };
    });

    return NextResponse.json({ scannedAt: new Date().toISOString(), markets: parsedMarkets, analysis });
  } catch (error) {
    console.error("[scan] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
