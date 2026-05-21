"use client";

import { useState } from "react";

const PRIVATE_COMPANIES = [
  { name: "Anthropic", slug: "anthropic", lastValuation: 61.5, keywords: ["anthropic", "claude"] },
  { name: "Stripe", slug: "stripe", lastValuation: 70, keywords: ["stripe"] },
  { name: "SpaceX", slug: "spacex", lastValuation: 350, keywords: ["spacex", "starlink"] },
  { name: "OpenAI", slug: "openai", lastValuation: 300, keywords: ["openai"] },
  { name: "Databricks", slug: "databricks", lastValuation: 62, keywords: ["databricks"] },
];

interface Market {
  id: string;
  question: string;
  outcomePrices?: string[];
  outcomes?: string[];
  volume?: number;
  endDate?: string;
}

interface ScanResult {
  scannedAt: string;
  markets: Market[];
  analysis: {
    highlights: string[];
    topSignal: {
      company: string;
      signal: string;
      probability: number;
      implication: string;
    };
    apacImpact: string;
    confidence: number;
  };
}

interface CompanyResult {
  company: string;
  markets: Market[];
  analysis: string;
}

interface WeeklyResult {
  report: string;
}

function LiveBadge() {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "rgba(200,169,110,0.12)",
      border: "1px solid rgba(200,169,110,0.3)",
      borderRadius: "999px",
      padding: "4px 12px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.1em",
      color: "#c8a96e",
      textTransform: "uppercase",
    }}>
      <span style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#c8a96e",
        animation: "pulse-dot 1.5s ease-in-out infinite",
      }} />
      LIVE DATA
    </span>
  );
}

function CompanyCard({
  company,
  onDetailClick,
}: {
  company: typeof PRIVATE_COMPANIES[0];
  onDetailClick: (slug: string) => void;
}) {
  const initials = company.name.slice(0, 2).toUpperCase();
  return (
    <div style={{
      background: "#141414",
      border: "1px solid #2a2a2a",
      borderRadius: "12px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#c8a96e")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#2a2a2a")}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          background: "rgba(200,169,110,0.15)",
          border: "1px solid rgba(200,169,110,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "14px",
          color: "#c8a96e",
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>{company.name}</div>
          <div style={{ color: "#888", fontSize: "13px" }}>直近バリュエーション</div>
        </div>
      </div>

      <div style={{
        background: "#0a0a0a",
        borderRadius: "8px",
        padding: "12px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ color: "#888", fontSize: "13px" }}>評価額</span>
        <span style={{ color: "#c8a96e", fontWeight: 700, fontSize: "20px" }}>
          ${company.lastValuation}B
        </span>
      </div>

      <button
        onClick={() => onDetailClick(company.slug)}
        style={{
          background: "rgba(200,169,110,0.1)",
          border: "1px solid rgba(200,169,110,0.4)",
          color: "#c8a96e",
          borderRadius: "8px",
          padding: "10px 0",
          fontWeight: 600,
          fontSize: "14px",
          width: "100%",
          transition: "background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,169,110,0.2)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(200,169,110,0.1)")}
      >
        詳細分析 — $0.50
      </button>
    </div>
  );
}

function ResultPanel({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#141414",
      border: "1px solid #2a2a2a",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "32px",
      animation: "fade-in 0.4s ease forwards",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ color: "#c8a96e", fontWeight: 600, fontSize: "16px" }}>{title}</h3>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "1px solid #2a2a2a",
            color: "#888",
            borderRadius: "6px",
            padding: "4px 12px",
            fontSize: "13px",
          }}
        >
          閉じる
        </button>
      </div>
      {children}
    </div>
  );
}

function ScanResultView({ data }: { data: ScanResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ color: "#888", fontSize: "13px" }}>
        スキャン時刻: {new Date(data.scannedAt).toLocaleString("ja-JP")}
      </div>

      {data.analysis && (
        <>
          <div>
            <div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "10px", fontSize: "14px" }}>
              注目ポイント
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.analysis.highlights.map((h, i) => (
                <li key={i} style={{
                  background: "#0a0a0a",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "14px",
                  color: "#e0e0e0",
                  borderLeft: "3px solid #c8a96e",
                }}>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {data.analysis.topSignal && (
            <div style={{
              background: "rgba(200,169,110,0.08)",
              border: "1px solid rgba(200,169,110,0.25)",
              borderRadius: "10px",
              padding: "16px",
            }}>
              <div style={{ color: "#c8a96e", fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>
                トップシグナル: {data.analysis.topSignal.company}
              </div>
              <div style={{ color: "#f0f0f0", fontSize: "14px", marginBottom: "6px" }}>
                {data.analysis.topSignal.signal}
              </div>
              <div style={{ color: "#888", fontSize: "13px", marginBottom: "8px" }}>
                確率: {(data.analysis.topSignal.probability * 100).toFixed(1)}%
              </div>
              <div style={{ color: "#ccc", fontSize: "13px" }}>
                {data.analysis.topSignal.implication}
              </div>
            </div>
          )}

          {data.analysis.apacImpact && (
            <div>
              <div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}>
                APAC市場への影響
              </div>
              <div style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.7 }}>
                {data.analysis.apacImpact}
              </div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#888", fontSize: "13px" }}>信頼度スコア:</span>
            <div style={{
              background: "#1e1e1e",
              borderRadius: "999px",
              height: "6px",
              flex: 1,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${data.analysis.confidence * 100}%`,
                background: "linear-gradient(90deg, #c8a96e, #e8c98e)",
                borderRadius: "999px",
              }} />
            </div>
            <span style={{ color: "#c8a96e", fontSize: "13px", fontWeight: 600 }}>
              {(data.analysis.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </>
      )}

      <div>
        <div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "10px", fontSize: "14px" }}>
          検出マーケット ({data.markets?.length ?? 0}件)
        </div>
        {data.markets?.slice(0, 5).map((m, i) => (
          <div key={m.id ?? i} style={{
            background: "#0a0a0a",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "8px",
            fontSize: "13px",
          }}>
            <div style={{ color: "#e0e0e0", marginBottom: "4px" }}>{m.question}</div>
            {m.outcomePrices && m.outcomes && (
              <div style={{ color: "#888", fontSize: "12px" }}>
                {m.outcomes[0]}: {(parseFloat(m.outcomePrices[0]) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CompanyResultView({ data }: { data: CompanyResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
        {data.analysis}
      </div>
      <div>
        <div style={{ color: "#c8a96e", fontWeight: 600, marginBottom: "10px", fontSize: "14px" }}>
          関連マーケット ({data.markets?.length ?? 0}件)
        </div>
        {data.markets?.map((m, i) => (
          <div key={m.id ?? i} style={{
            background: "#0a0a0a",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "8px",
            fontSize: "13px",
          }}>
            <div style={{ color: "#e0e0e0", marginBottom: "4px" }}>{m.question}</div>
            {m.outcomePrices && m.outcomes && (
              <div style={{ color: "#888", fontSize: "12px" }}>
                {m.outcomes[0]}: {(parseFloat(m.outcomePrices[0]) * 100).toFixed(1)}%
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyResultView({ data }: { data: WeeklyResult }) {
  const lines = data.report.split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return <h3 key={i} style={{ color: "#c8a96e", fontWeight: 700, fontSize: "16px", marginTop: "16px" }}>{line.slice(3)}</h3>;
        }
        if (line.startsWith("# ")) {
          return <h2 key={i} style={{ color: "#c8a96e", fontWeight: 700, fontSize: "18px", marginTop: "20px" }}>{line.slice(2)}</h2>;
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return <div key={i} style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.7, paddingLeft: "16px", borderLeft: "2px solid #2a2a2a" }}>{line.slice(2)}</div>;
        }
        if (line.trim() === "") return <div key={i} style={{ height: "8px" }} />;
        return <p key={i} style={{ color: "#ccc", fontSize: "14px", lineHeight: 1.8 }}>{line}</p>;
      })}
    </div>
  );
}

type ResultData =
  | { type: "scan"; data: ScanResult }
  | { type: "company"; data: CompanyResult }
  | { type: "weekly"; data: WeeklyResult };

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [chain, setChain] = useState<"base" | "solana">("base");
  const [token, setToken] = useState<"usdc" | "jpyc">("usdc");

  const safeJson = async <T,>(res: Response): Promise<T> => {
    const text = await res.text();
    if (!text) throw new Error("サーバーからの応答が空です");
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new Error("レスポンスの解析に失敗しました（非JSONレスポンス）");
    }
  };

  const fetchWithX402 = async (url: string, options?: RequestInit): Promise<Response> => {
    const res = await fetch(url, options);
    if (res.status === 402) {
      const text = await res.text().catch(() => "");
      const networkLabel = chain === "solana" ? "Solana USDC" : "Base USDC";
      let detail = `x402対応ウォレットによる${networkLabel}決済が必要です`;
      try {
        const body = JSON.parse(text);
        if (body?.error && body.error !== "X-PAYMENT header is required") detail = body.error;
      } catch {}
      throw new Error(`Payment Required (402): ${detail}`);
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let detail = `サーバーエラー (${res.status})`;
      try {
        const body = JSON.parse(text);
        if (body?.error || body?.message) detail = body.error ?? body.message;
      } catch {}
      throw new Error(detail);
    }
    return res;
  };

  const scanUrl = () =>
    chain === "solana" ? "/api/private-market/scan/solana" : "/api/private-market/scan";
  const companyUrl = () =>
    chain === "solana" ? "/api/private-market/company/solana" : "/api/private-market/company";
  const weeklyUrl = () =>
    chain === "solana" ? "/api/private-market/weekly/solana" : "/api/private-market/weekly";

  const handleScan = async () => {
    setLoading("scan");
    setError(null);
    setResult(null);
    try {
      const res = await fetchWithX402(scanUrl());
      const data = await safeJson<ScanResult>(res);
      setResult({ type: "scan", data });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(null);
    }
  };

  const handleCompany = async (slug: string) => {
    setLoading(slug);
    setError(null);
    setResult(null);
    try {
      const res = await fetchWithX402(companyUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: slug }),
      });
      const data = await safeJson<CompanyResult>(res);
      setResult({ type: "company", data });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(null);
    }
  };

  const handleWeekly = async () => {
    setLoading("weekly");
    setError(null);
    setResult(null);
    try {
      const res = await fetchWithX402(weeklyUrl());
      const data = await safeJson<WeeklyResult>(res);
      setResult({ type: "weekly", data });
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main style={{ minHeight: "100vh", background: "#0a0a0a" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid #1e1e1e",
        padding: "20px 0",
        position: "sticky",
        top: 0,
        background: "rgba(10,10,10,0.95)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#c8a96e", fontWeight: 800, fontSize: "15px", letterSpacing: "0.05em" }}>x402</span>
            <span style={{ color: "#2a2a2a" }}>|</span>
            <span style={{ color: "#f0f0f0", fontWeight: 600, fontSize: "14px" }}>Private Market Intelligence</span>
          </div>
          <LiveBadge />
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "80px 24px 60px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          marginBottom: "20px",
          background: "linear-gradient(135deg, #f0f0f0 0%, #c8a96e 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          PRIVATE MARKET<br />INTELLIGENCE
        </h1>
        <p style={{
          color: "#888",
          fontSize: "clamp(14px, 2vw, 17px)",
          maxWidth: "600px",
          margin: "0 auto 40px",
          lineHeight: 1.7,
        }}>
          Polymarket × Nasdaq Private Marketで取引される<br />
          未上場企業バリュエーションをリアルタイム追跡
        </p>
        <p style={{ color: "#666", fontSize: "13px" }}>
          未上場企業のバリュエーション予測市場をリアルタイムで追跡する
        </p>
      </section>

      {/* Company Cards */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {PRIVATE_COMPANIES.map(company => (
            <CompanyCard
              key={company.slug}
              company={company}
              onDetailClick={handleCompany}
            />
          ))}
        </div>
      </section>

      {/* Chain & Token Selector */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
          {/* Chain tabs */}
          <div style={{ display: "flex", gap: "8px", background: "#141414", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "4px" }}>
            {(["base", "solana"] as const).map((c) => (
              <button
                key={c}
                onClick={() => {
                  setChain(c);
                  if (c === "solana") setToken("usdc");
                }}
                style={{
                  padding: "8px 24px",
                  borderRadius: "7px",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: chain === c ? "rgba(200,169,110,0.18)" : "transparent",
                  color: chain === c ? "#c8a96e" : "#666",
                  outline: chain === c ? "1px solid rgba(200,169,110,0.35)" : "none",
                }}
              >
                {c === "base" ? "⬡ Base" : "◎ Solana"}
              </button>
            ))}
          </div>

          {/* Token tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            {(["usdc", "jpyc"] as const).map((t) => {
              const disabled = t === "jpyc" && chain === "solana";
              return (
                <button
                  key={t}
                  onClick={() => !disabled && setToken(t)}
                  disabled={disabled}
                  title={disabled ? "SolanaではJPYCは使用できません" : undefined}
                  style={{
                    padding: "6px 18px",
                    borderRadius: "6px",
                    border: `1px solid ${token === t && !disabled ? "rgba(200,169,110,0.5)" : "#2a2a2a"}`,
                    fontWeight: 600,
                    fontSize: "12px",
                    cursor: disabled ? "not-allowed" : "pointer",
                    background: token === t && !disabled ? "rgba(200,169,110,0.1)" : "transparent",
                    color: disabled ? "#333" : token === t ? "#c8a96e" : "#666",
                    opacity: disabled ? 0.45 : 1,
                    transition: "all 0.15s",
                    textDecoration: disabled ? "line-through" : "none",
                  }}
                >
                  {t.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Solana USDC-only banner */}
          {chain === "solana" && (
            <div style={{
              background: "rgba(153,69,255,0.08)",
              border: "1px solid rgba(153,69,255,0.25)",
              borderRadius: "8px",
              padding: "10px 18px",
              fontSize: "12px",
              color: "#9945ff",
              fontWeight: 500,
            }}>
              SolanaネットワークではUSDC決済のみご利用いただけます
            </div>
          )}
        </div>
      </section>

      {/* Pricing & Actions */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" }}>
        <h2 style={{ color: "#c8a96e", fontWeight: 700, fontSize: "20px", marginBottom: "24px", textAlign: "center" }}>
          プランと料金
          <span style={{ marginLeft: "10px", fontSize: "12px", fontWeight: 400, color: chain === "solana" ? "#9945ff" : "#c8a96e", opacity: 0.8 }}>
            {chain === "solana" ? "Solana" : "Base"} · {token.toUpperCase()}
          </span>
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}>
          {[
            {
              name: "マーケットスキャン",
              price: "$0.30",
              desc: "全企業のPolymarketマーケットをスキャンし、Claudeが投資シグナルを分析",
              action: handleScan,
              key: "scan",
            },
            {
              name: "週次レポート",
              price: "$2.00",
              desc: "未上場企業バリュエーション週次動向レポート（約2000字・markdown）",
              action: handleWeekly,
              key: "weekly",
            },
          ].map(plan => (
            <div
              key={plan.key}
              style={{
                background: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "16px" }}>{plan.name}</div>
              <div style={{ color: "#c8a96e", fontWeight: 800, fontSize: "28px" }}>{plan.price}</div>
              <div style={{ color: "#888", fontSize: "13px", lineHeight: 1.6 }}>{plan.desc}</div>
              <button
                onClick={plan.action}
                disabled={loading !== null}
                style={{
                  background: "rgba(200,169,110,0.12)",
                  border: "1px solid rgba(200,169,110,0.4)",
                  color: loading === plan.key ? "#888" : "#c8a96e",
                  borderRadius: "8px",
                  padding: "12px 0",
                  fontWeight: 600,
                  fontSize: "14px",
                  marginTop: "4px",
                  transition: "background 0.2s",
                  opacity: loading !== null ? 0.6 : 1,
                }}
                onMouseEnter={e => loading === null && (e.currentTarget.style.background = "rgba(200,169,110,0.2)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(200,169,110,0.12)")}
              >
                {loading === plan.key ? "処理中..." : `実行 — ${plan.price}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Error */}
      {error && (
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto 32px",
          padding: "0 24px",
        }}>
          <div style={{
            background: error.startsWith("Payment Required") ? "rgba(200,169,110,0.08)" : "rgba(220,60,60,0.1)",
            border: `1px solid ${error.startsWith("Payment Required") ? "rgba(200,169,110,0.3)" : "rgba(220,60,60,0.3)"}`,
            borderRadius: "10px",
            padding: "16px 20px",
            fontSize: "14px",
          }}>
            {error.startsWith("Payment Required") ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ color: "#c8a96e", fontWeight: 600 }}>x402 決済が必要です</div>
                <div style={{ color: "#a08550", fontSize: "13px" }}>
                  {chain === "solana"
                    ? "このAPIはSolana上のUSDCマイクロペイメントで保護されています。x402対応SolanaウォレットまたはHTTPクライアントから呼び出してください。"
                    : "このAPIはBase上のUSDCマイクロペイメントで保護されています。x402対応HTTPクライアントまたはウォレットから呼び出してください。"}
                </div>
              </div>
            ) : (
              <span style={{ color: "#ff7070" }}>{error}</span>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" }}>
          <ResultPanel
            title={
              result.type === "scan"
                ? "マーケットスキャン結果"
                : result.type === "company"
                ? `${result.data.company} 詳細分析`
                : "週次レポート"
            }
            onClose={() => setResult(null)}
          >
            {result.type === "scan" && <ScanResultView data={result.data} />}
            {result.type === "company" && <CompanyResultView data={result.data} />}
            {result.type === "weekly" && <WeeklyResultView data={result.data} />}
          </ResultPanel>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1e1e1e",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ color: "#555", fontSize: "12px", lineHeight: 1.8 }}>
            本ツールはPolymarketの公開マーケットデータを参照した情報提供サービスです。
            投資判断はご自身でお願いします。日本ではPolymarketへの直接参加はできません。
          </p>
          <p style={{ color: "#333", fontSize: "11px", marginTop: "12px" }}>
            Powered by x402 · Polymarket · Anthropic Claude
          </p>
        </div>
      </footer>
    </main>
  );
}
