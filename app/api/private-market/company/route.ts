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
}

export async function POST(req: NextRequest) {
  try {
    let body: { company?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const slug = body.company?.toLowerCase();
    const companyInfo = PRIVATE_COMPANIES.find(
      (c) => c.slug === slug || c.name.toLowerCase() === slug,
    );

    if (!companyInfo) {
      return NextResponse.json({ error: "Unknown company" }, { status: 400 });
    }

    const markets: PolymarketMarket[] = [];
    for (const keyword of companyInfo.keywords) {
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
    const uniqueMarkets = markets.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    const marketSummary = uniqueMarkets
      .map((m) => {
        let priceStr = "";
        try {
          const prices = m.outcomePrices ? JSON.parse(m.outcomePrices) : [];
          const outcomes = m.outcomes ? JSON.parse(m.outcomes) : [];
          if (prices.length > 0 && outcomes.length > 0) {
            priceStr = ` | ${outcomes[0]}: ${(parseFloat(prices[0]) * 100).toFixed(1)}%`;
          }
        } catch {
          // ignore
        }
        return `- ${m.question}${priceStr}`;
      })
      .join("\n");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `${companyInfo.name}（最終評価額: $${companyInfo.lastValuation}B）のPolymarket予測市場データを詳細分析してください。

マーケットデータ:
${marketSummary || "現在アクティブなマーケットが見つかりませんでした。企業の一般的な状況を分析してください。"}

以下の観点で日本語800字程度で分析してください:
1. IPO・上場の可能性と時期予測
2. バリュエーション動向（上昇/下落シナリオ）
3. 市場参加者のセンチメント
4. 日本・APAC投資家への示唆
5. リスク要因

分析結果のみ記述し、JSONや特別なフォーマットは不要です。`,
        },
      ],
    });

    const analysis = msg.content[0].type === "text" ? msg.content[0].text : "分析できませんでした";

    const parsedMarkets = uniqueMarkets.map((m) => {
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
        outcomePrices,
        outcomes,
        volume: m.volume,
        endDate: m.endDate,
      };
    });

    return NextResponse.json({ company: companyInfo.name, markets: parsedMarkets, analysis });
  } catch (error) {
    console.error("[company] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
