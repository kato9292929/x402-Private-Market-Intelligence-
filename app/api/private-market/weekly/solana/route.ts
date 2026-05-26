import { NextRequest, NextResponse } from "next/server";
import { withX402 } from "@x402/next";
import { x402Server } from "@/lib/x402";
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
}

async function fetchCompanyMarkets(company: (typeof PRIVATE_COMPANIES)[0]): Promise<string> {
  const lines: string[] = [];
  for (const keyword of company.keywords) {
    try {
      const res = await fetch(
        `https://gamma-api.polymarket.com/markets?active=true&q=${encodeURIComponent(keyword)}&limit=5`,
      );
      if (!res.ok) continue;
      const data: PolymarketMarket[] = await res.json();
      if (!Array.isArray(data)) continue;
      for (const m of data) {
        let priceStr = "";
        try {
          const prices = m.outcomePrices ? JSON.parse(m.outcomePrices) : [];
          const outcomes = m.outcomes ? JSON.parse(m.outcomes) : [];
          if (prices.length > 0 && outcomes.length > 0) {
            priceStr = ` (${outcomes[0]}: ${(parseFloat(prices[0]) * 100).toFixed(1)}%)`;
          }
        } catch {
          // ignore
        }
        lines.push(`  - ${m.question}${priceStr}`);
      }
    } catch {
      // silently skip
    }
  }
  return lines.join("\n") || "  - マーケットデータなし";
}

async function handler(_req: NextRequest): Promise<NextResponse> {
  try {
    const sections: string[] = [];
    for (const company of PRIVATE_COMPANIES) {
      const marketLines = await fetchCompanyMarkets(company);
      sections.push(`${company.name}（$${company.lastValuation}B）:\n${marketLines}`);
    }
    const allData = sections.join("\n\n");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `以下のPolymarket未上場企業バリュエーション市場データをもとに、日本の機関投資家・VC向け週次レポートを日本語で作成してください。約2000字、markdown形式で。

市場データ（${new Date().toLocaleDateString("ja-JP")}時点）:
${allData}

レポート構成:
# 週次未上場企業バリュエーション動向レポート

## エグゼクティブサマリー
（主要トレンドを3-4行で）

## 注目企業別分析

### Anthropic
### Stripe
### SpaceX
### OpenAI
### Databricks

## 市場センチメント総合評価

## 来週の注目イベント

## 投資家への示唆（APAC・日本市場観点）

---
※本レポートはPolymarket公開データに基づく情報提供です。投資判断はご自身でお願いします。`,
        },
      ],
    });

    const report =
      msg.content[0].type === "text" ? msg.content[0].text : "レポート生成に失敗しました";

    return NextResponse.json({ report });
  } catch (error) {
    console.error("[weekly/solana] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withX402(
  handler,
  {
    accepts: [
      {
        scheme: "exact",
        price: "$2.00",
        network: "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        payTo: process.env.SOLANA_WALLET_ADDRESS ?? "",
      },
    ],
    description: "Weekly Private Market Valuation Report (Solana)",
    mimeType: "application/json",
  },
  x402Server,
);
