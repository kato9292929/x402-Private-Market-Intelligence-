# x402 Private Market Intelligence

> Real-time prediction market tracking for private company valuations via Polymarket × Nasdaq Private Market.

---

## Overview

x402 Private Market Intelligence is a Next.js 15 application that surfaces Polymarket prediction market data for late-stage private companies — Anthropic, Stripe, SpaceX, OpenAI, and Databricks. Each API endpoint is monetized with [x402](https://x402.org) micropayments on Base, so you pay per query in USDC with no subscription required.

Claude (Anthropic) analyzes the raw market data and returns investment signals in Japanese, tailored for APAC institutional investors and VCs.

---

## Features

- **Market Scan** — scans all five companies in one call; Claude highlights top signals and APAC implications
- **Company Detail** — deep-dive analysis for a single company: IPO probability, valuation trajectory, sentiment
- **Weekly Report** — ~2,000-character markdown report covering all companies, suitable for distribution

All three endpoints are protected by x402 (`withX402`). Callers must attach a valid USDC payment header on Base mainnet — no API keys, no accounts.

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 15.5.9 |
| UI | React 19.0.0 |
| Payments | x402-next 1.2.0 |
| AI | @anthropic-ai/sdk 0.39.0 |
| Chain | viem 2.21.54, wagmi 2.14.16 |
| Wallet UI | @rainbow-me/rainbowkit 2.2.4 |
| Data fetching | @tanstack/react-query 5.62.7 |

---

## API Routes

### `GET /api/private-market/scan` — $0.30

Scans Polymarket for all five companies and returns Claude's analysis.

```json
{
  "scannedAt": "2026-05-20T00:00:00Z",
  "markets": [...],
  "analysis": {
    "highlights": ["...", "..."],
    "topSignal": {
      "company": "Anthropic",
      "signal": "IPO probability rose to 67%",
      "probability": 0.67,
      "implication": "..."
    },
    "apacImpact": "...",
    "confidence": 0.78
  }
}
```

### `POST /api/private-market/company` — $0.50

Deep analysis for one company.

**Request body:**
```json
{ "company": "anthropic" }
```

Valid slugs: `anthropic`, `stripe`, `spacex`, `openai`, `databricks`

### `GET /api/private-market/weekly` — $2.00

Full weekly valuation trend report in markdown (~2,000 Japanese characters).

---

## Getting Started

### Prerequisites

- Node.js 20+
- An Anthropic API key
- An EVM wallet address on Base to receive payments

### Installation

```bash
git clone https://github.com/kato9292929/x402-Private-Market-Intelligence-
cd x402-Private-Market-Intelligence-
npm install
```

### Environment Variables

Copy `.env.local` and fill in your values:

```env
ANTHROPIC_API_KEY=sk-ant-...
WALLET_ADDRESS=0xYourWalletAddress
FACILITATOR_URL=https://api.developer.coinbase.com/rpc/v1/base/facilitator
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Deploying to Vercel

1. Push this branch to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Add the four environment variables in **Project Settings → Environment Variables**
4. Deploy — the three API routes are automatically served as serverless functions

---

## x402 Payment Flow

```
Client                    API Route                   Facilitator (Base)
  │                           │                              │
  │── GET /api/.../scan ──────►│                              │
  │                           │◄─ 402 Payment Required ──────│
  │◄── 402 + payment details ─│                              │
  │                           │                              │
  │  [user signs USDC transfer on Base]                      │
  │                           │                              │
  │── GET /api/.../scan ──────►│                              │
  │   X-PAYMENT: <header>     │── verify + settle ──────────►│
  │                           │◄── confirmed ────────────────│
  │◄── 200 JSON response ─────│                              │
```

No subscription. No account. Pay exactly what you use.

---

## Disclaimer

This tool references publicly available market data from Polymarket for informational purposes only. It does not constitute investment advice. Please make investment decisions at your own discretion. Direct participation in Polymarket is not available in Japan.

---

---

# x402 プライベートマーケット・インテリジェンス

> Polymarket × Nasdaq Private Market を通じた未上場企業バリュエーションのリアルタイム予測市場追跡

---

## 概要

x402 Private Market Intelligence は、Anthropic・Stripe・SpaceX・OpenAI・Databricks といった大型未上場企業に関する Polymarket 予測市場データをリアルタイムで取得・分析する Next.js 15 アプリケーションです。

各 API エンドポイントは [x402](https://x402.org) マイクロペイメント（Base ネットワーク上の USDC）で保護されており、サブスクリプション不要でクエリごとに支払いが発生します。Claude（Anthropic）が生データを分析し、APAC の機関投資家・VC 向けに日本語で投資シグナルを提供します。

---

## 機能

- **マーケットスキャン** — 5 社を一括スキャン。Claude がトップシグナルと APAC 市場への示唆をまとめます
- **企業詳細分析** — 1 社に絞った深掘り分析：IPO 確率・バリュエーション推移・市場センチメント
- **週次レポート** — 全社をカバーする約 2000 字の markdown レポート。社内配布にも対応

3 エンドポイントすべてを `withX402` で保護。呼び出し側は Base メインネット上の有効な USDC 支払いヘッダーを付与するだけで、APIキーもアカウント登録も不要です。

---

## 技術スタック

| レイヤー | ライブラリ / バージョン |
|---|---|
| フレームワーク | Next.js 15.5.9 |
| UI | React 19.0.0 |
| 決済 | x402-next 1.2.0 |
| AI | @anthropic-ai/sdk 0.39.0 |
| チェーン | viem 2.21.54, wagmi 2.14.16 |
| ウォレット UI | @rainbow-me/rainbowkit 2.2.4 |
| データ取得 | @tanstack/react-query 5.62.7 |

---

## API ルート

### `GET /api/private-market/scan` — $0.30

5 社の Polymarket マーケットを一括スキャンし、Claude の分析結果を返します。

```json
{
  "scannedAt": "2026-05-20T00:00:00Z",
  "markets": [...],
  "analysis": {
    "highlights": ["注目点1", "注目点2"],
    "topSignal": {
      "company": "Anthropic",
      "signal": "IPO確率が67%に上昇",
      "probability": 0.67,
      "implication": "..."
    },
    "apacImpact": "...",
    "confidence": 0.78
  }
}
```

### `POST /api/private-market/company` — $0.50

1 社に特化した詳細分析を返します。

**リクエストボディ:**
```json
{ "company": "anthropic" }
```

有効なスラッグ: `anthropic` / `stripe` / `spacex` / `openai` / `databricks`

### `GET /api/private-market/weekly` — $2.00

全社を網羅した週次バリュエーション動向レポート（markdown 形式、約 2000 字）。

---

## セットアップ

### 前提条件

- Node.js 20 以上
- Anthropic API キー
- 受け取り用 EVM ウォレットアドレス（Base）

### インストール

```bash
git clone https://github.com/kato9292929/x402-Private-Market-Intelligence-
cd x402-Private-Market-Intelligence-
npm install
```

### 環境変数

`.env.local` に以下を設定してください：

```env
ANTHROPIC_API_KEY=sk-ant-...
WALLET_ADDRESS=0xあなたのウォレットアドレス
FACILITATOR_URL=https://api.developer.coinbase.com/rpc/v1/base/facilitator
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) をブラウザで開いてください。

### 本番ビルド

```bash
npm run build
npm start
```

---

## Vercel へのデプロイ

1. このブランチを GitHub にプッシュ
2. [vercel.com](https://vercel.com) でリポジトリをインポート
3. **Project Settings → Environment Variables** に 4 つの環境変数を追加
4. デプロイ実行 — 3 つの API ルートが自動でサーバーレス関数として配信されます

---

## x402 決済フロー

```
クライアント               API ルート                ファシリテーター（Base）
    │                          │                              │
    │── GET /api/.../scan ────►│                              │
    │                          │◄─ 402 Payment Required ──────│
    │◄── 402 + 支払い情報 ──────│                              │
    │                          │                              │
    │  [ユーザーが Base 上で USDC 送金に署名]                  │
    │                          │                              │
    │── GET /api/.../scan ────►│                              │
    │   X-PAYMENT: <header>    │── 検証・決済 ───────────────►│
    │                          │◄── 確認済み ─────────────────│
    │◄── 200 JSON レスポンス ──│                              │
```

サブスクリプション不要。アカウント登録不要。使った分だけ支払います。

---

## 免責事項

本ツールは Polymarket の公開マーケットデータを参照した情報提供サービスです。投資判断はご自身でお願いします。日本では Polymarket への直接参加はできません。
