import { paymentProxy } from "@x402/next";
import { x402Server } from "@/lib/x402";

const WALLET = (process.env.WALLET_ADDRESS ?? "") as `0x${string}`;

export const middleware = paymentProxy(
  {
    "/api/private-market/scan": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.30",
          network: "eip155:8453",
          payTo: WALLET,
        },
      ],
      description: "Private Market Valuation Scan",
      mimeType: "application/json",
    },
    "/api/private-market/company": {
      accepts: [
        {
          scheme: "exact",
          price: "$0.50",
          network: "eip155:8453",
          payTo: WALLET,
        },
      ],
      description: "Private Company Detailed Analysis",
      mimeType: "application/json",
    },
    "/api/private-market/weekly": {
      accepts: [
        {
          scheme: "exact",
          price: "$2.00",
          network: "eip155:8453",
          payTo: WALLET,
        },
      ],
      description: "Weekly Private Market Valuation Report",
      mimeType: "application/json",
    },
  },
  x402Server,
);

export const config = {
  matcher: [
    "/api/private-market/scan",
    "/api/private-market/company",
    "/api/private-market/weekly",
  ],
};
