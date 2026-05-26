import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SOLANA_USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_NETWORK = "eip155:8453";
const SOLANA_NETWORK = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  const discovery = {
    x402Version: 2,
    endpoints: [
      {
        path: "/api/private-market/scan",
        method: "GET",
        description: "Private Market Valuation Scan (Base)",
        accepts: [
          {
            scheme: "exact",
            network: BASE_NETWORK,
            maxAmountRequired: "300000",
            resource: `${appUrl}/api/private-market/scan`,
            payTo: process.env.WALLET_ADDRESS ?? "",
            asset: BASE_USDC,
          },
        ],
      },
      {
        path: "/api/private-market/scan/solana",
        method: "GET",
        description: "Private Market Valuation Scan (Solana)",
        accepts: [
          {
            scheme: "exact",
            network: SOLANA_NETWORK,
            maxAmountRequired: "300000",
            resource: `${appUrl}/api/private-market/scan/solana`,
            payTo: process.env.SOLANA_WALLET_ADDRESS ?? "",
            asset: SOLANA_USDC,
          },
        ],
      },
      {
        path: "/api/private-market/company",
        method: "POST",
        description: "Private Company Detailed Analysis (Base)",
        accepts: [
          {
            scheme: "exact",
            network: BASE_NETWORK,
            maxAmountRequired: "500000",
            resource: `${appUrl}/api/private-market/company`,
            payTo: process.env.WALLET_ADDRESS ?? "",
            asset: BASE_USDC,
          },
        ],
      },
      {
        path: "/api/private-market/company/solana",
        method: "POST",
        description: "Private Company Detailed Analysis (Solana)",
        accepts: [
          {
            scheme: "exact",
            network: SOLANA_NETWORK,
            maxAmountRequired: "500000",
            resource: `${appUrl}/api/private-market/company/solana`,
            payTo: process.env.SOLANA_WALLET_ADDRESS ?? "",
            asset: SOLANA_USDC,
          },
        ],
      },
      {
        path: "/api/private-market/weekly",
        method: "GET",
        description: "Weekly Private Market Valuation Report (Base)",
        accepts: [
          {
            scheme: "exact",
            network: BASE_NETWORK,
            maxAmountRequired: "2000000",
            resource: `${appUrl}/api/private-market/weekly`,
            payTo: process.env.WALLET_ADDRESS ?? "",
            asset: BASE_USDC,
          },
        ],
      },
      {
        path: "/api/private-market/weekly/solana",
        method: "GET",
        description: "Weekly Private Market Valuation Report (Solana)",
        accepts: [
          {
            scheme: "exact",
            network: SOLANA_NETWORK,
            maxAmountRequired: "2000000",
            resource: `${appUrl}/api/private-market/weekly/solana`,
            payTo: process.env.SOLANA_WALLET_ADDRESS ?? "",
            asset: SOLANA_USDC,
          },
        ],
      },
    ],
  };

  return NextResponse.json(discovery, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
