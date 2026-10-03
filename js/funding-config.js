/**
 * VERDICT — Crypto Payment Gateway & Funded Research Configuration
 * 
 * Central configuration for privacy-first, multi-crypto research funding.
 * Operates via dynamic hosted checkout and webhooks (NOWPayments / PayRam).
 * 
 * PRIVACY GUARANTEE:
 * No personal wallet address is published anywhere on the website.
 * Payout addresses and API credentials remain strictly server-side.
 */

export const VERDICT_FUNDING_CONFIG = {
  // Gateway architecture mode
  gatewayMode: "dynamic_checkout",
  provider: "nowpayments", // Supports NOWPayments or self-hosted PayRam

  // Contribution Presets (USD)
  presetAmounts: [
    {
      value: 25,
      label: "$25",
      title: "Statutory Lookup Fee",
      desc: "Covers official MCA corporate filings & court registry lookups."
    },
    {
      value: 50,
      label: "$50",
      title: "Document Retrieval & Archives",
      desc: "Funds archived web forensic recovery & gazette verification."
    },
    {
      value: 100,
      label: "$100",
      title: "Entity Dossier Investigation",
      desc: "Funds structured target profile, role reconciliation, and timeline."
    },
    {
      value: 250,
      label: "$250",
      title: "Deep Financial Trail & Network",
      desc: "Multi-entity corporate holding structures & public money trails."
    }
  ],

  // Supported Cryptocurrencies across all major chains
  supportedCoins: [
    {
      symbol: "USDC",
      name: "USD Coin",
      type: "Stablecoin",
      badge: "RECOMMENDED",
      networks: "Base · Ethereum · Solana · Polygon",
      icon: "💵"
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      type: "Stablecoin",
      badge: "POPULAR",
      networks: "Tron · Ethereum · BSC · Polygon",
      icon: "₮"
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      type: "Native Crypto",
      badge: "SOVEREIGN",
      networks: "Bitcoin Mainnet",
      icon: "₿"
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      type: "Native Crypto",
      badge: "L2 / MAINNET",
      networks: "Base · Arbitrum · Ethereum",
      icon: "Ξ"
    },
    {
      symbol: "SOL",
      name: "Solana",
      type: "Native Crypto",
      badge: "HIGH SPEED",
      networks: "Solana Mainnet",
      icon: "◎"
    }
  ],

  // Inviolable Editorial Independence Policy
  editorialIndependence: {
    fundingDoesNotBuyCoverage: true,
    guaranteedPublication: false,
    favorableCoverageBought: false,
    contentRemovalPurchasable: false,
    predeterminedConclusions: false,
    disclosureNotice: "Research request funded by a third party. Funding does not determine Verdict's findings, editorial treatment, publication decision, or conclusion."
  },

  // Defined Refund & Cancellation Terms
  refundPolicy: {
    scopeRejection: "Full refund or research credit if a request is rejected during initial 48h eligibility review for lacking public-interest merit.",
    insufficientEvidence: "If public records yield inconclusive findings, Verdict documents the negative finding and evidentiary absence. Research retrieval fees are non-refundable once investigative hours are expended.",
    findingsDispute: "No refunds are issued based on disagreement with factual findings. The evidence dictates the finding independently.",
    minimumRefundFee: "Network gas fees deducted for on-chain return transactions."
  }
};

/**
 * Generates an internal Payment ID (VR-FUND-XXXXXX) for linking payments to requests
 */
export function generateClientPaymentId() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let id = "VR-FUND-";
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Creates or simulates a secure dynamic invoice session
 */
export async function createPaymentSession(amountUsd, coin, targetSubject = "") {
  const paymentId = generateClientPaymentId();

  try {
    const res = await fetch("/api/payment/create-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentId,
        amountUsd: Number(amountUsd),
        payCurrency: coin,
        targetSubject
      })
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Worker payment API offline, generating local gateway session:", err);
  }

  // Graceful client gateway session
  return {
    paymentId,
    status: "created",
    amountUsd: Number(amountUsd),
    payCurrency: coin,
    invoiceUrl: null,
    targetSubject,
    createdAt: new Date().toISOString(),
    instructions: `Transfer $${amountUsd} in ${coin} via checkout.`
  };
}

/**
 * Helper to construct block explorer transaction URLs if provided
 */
export function getExplorerTxUrl(network, txHash) {
  if (!txHash) return "#";
  const cleanHash = txHash.trim();
  switch (String(network).toLowerCase()) {
    case "base":
      return `https://basescan.org/tx/${cleanHash}`;
    case "solana":
    case "sol":
      return `https://solscan.io/tx/${cleanHash}`;
    case "bitcoin":
    case "btc":
      return `https://mempool.space/tx/${cleanHash}`;
    case "polygon":
      return `https://polygonscan.com/tx/${cleanHash}`;
    case "arbitrum":
      return `https://arbiscan.io/tx/${cleanHash}`;
    case "tron":
      return `https://tronscan.org/#/transaction/${cleanHash}`;
    case "ethereum":
    default:
      return `https://etherscan.io/tx/${cleanHash}`;
  }
}

