import { HTTPFacilitatorClient, x402ResourceServer } from "@x402/core/server";
import { registerExactEvmScheme } from "@x402/evm/exact/server";
import { registerExactSvmScheme } from "@x402/svm/exact/server";
import { createFacilitatorConfig } from "@coinbase/x402";

function createFacilitatorClient(): HTTPFacilitatorClient {
  const cdpKeyId = process.env.CDP_API_KEY_ID;
  const cdpKeySecret = process.env.CDP_API_KEY_SECRET;
  const facilitatorUrl = process.env.FACILITATOR_URL;

  if (cdpKeyId && cdpKeySecret) {
    return new HTTPFacilitatorClient(createFacilitatorConfig(cdpKeyId, cdpKeySecret));
  }

  if (facilitatorUrl) {
    return new HTTPFacilitatorClient({ url: facilitatorUrl });
  }

  return new HTTPFacilitatorClient();
}

const server = new x402ResourceServer(createFacilitatorClient());
registerExactEvmScheme(server);
registerExactSvmScheme(server);

export const x402Server = server;
