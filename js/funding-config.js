/**
 * VERDICT — Public Funding & Research Configuration
 * 
 * Central configuration for independent public-interest research funding.
 * Reconciles EVM wallet addresses, supported networks, accepted assets,
 * and editorial independence policies.
 * 
 * SITE OWNER: Replace the default public wallet address below with your MetaMask public address.
 */

export const VERDICT_FUNDING_CONFIG = {
  // Public MetaMask / EVM receiving address
  // NOTE: This is a public wallet address for incoming research contributions.
  // Never expose private keys or seed phrases.
  publicWalletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Configurable public address

  // Supported EVM networks
  supportedNetworks: [
    {
      id: "base",
      name: "Base",
      type: "Layer 2",
      chainId: 8453,
      recommended: true,
      blockExplorer: "https://basescan.org/tx/",
      addressExplorer: "https://basescan.org/address/",
      gasNote: "Ultra-low gas fees (~$0.01)"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      type: "Mainnet",
      chainId: 1,
      recommended: false,
      blockExplorer: "https://etherscan.io/tx/",
      addressExplorer: "https://etherscan.io/address/",
      gasNote: "Standard Ethereum network"
    },
    {
      id: "polygon",
      name: "Polygon PoS",
      type: "Sidechain",
      chainId: 137,
      recommended: false,
      blockExplorer: "https://polygonscan.com/tx/",
      addressExplorer: "https://polygonscan.com/address/",
      gasNote: "Low gas fees (~$0.02)"
    },
    {
      id: "arbitrum",
      name: "Arbitrum One",
      type: "Layer 2",
      chainId: 42161,
      recommended: false,
      blockExplorer: "https://arbiscan.io/tx/",
      addressExplorer: "https://arbiscan.io/address/",
      gasNote: "Low rollup gas fees"
    },
    {
      id: "bnb",
      name: "BNB Smart Chain",
      type: "EVM Chain",
      chainId: 56,
      recommended: false,
      blockExplorer: "https://bscscan.com/tx/",
      addressExplorer: "https://bscscan.com/address/",
      gasNote: "Low network fees"
    }
  ],

  // Accepted cryptographic assets
  acceptedAssets: [
    {
      symbol: "USDC",
      name: "USD Coin",
      type: "Stablecoin (Recommended)",
      description: "Direct dollar-pegged stablecoin. Preferred for predictable research budgeting."
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      type: "Stablecoin",
      description: "Widely accepted stablecoin across all supported EVM networks."
    },
    {
      symbol: "ETH",
      name: "Ethereum (Native / WETH)",
      type: "Native Asset",
      description: "Native gas token or wrapped Ether on Layer 2 networks."
    }
  ],

  // Suggested research funding tiers (research hours & statutory fee benchmarks)
  researchTiers: [
    {
      tier: "Statutory Record Retrieval",
      benchmarkUsd: "$25 – $50",
      scope: "Covers official MCA corporate filings, certified court registry lookups, and gazette order retrieval."
    },
    {
      tier: "Target Entity Dossier",
      benchmarkUsd: "$150 – $300",
      scope: "Funds end-to-end structured investigation: identity confirmation, statutory filings, timeline reconstruction, and cross-source consistency review."
    },
    {
      tier: "Deep Network & Financial Trail",
      benchmarkUsd: "$500+",
      scope: "Multi-entity network mapping, complex corporate holding structures, electoral trust cross-checks, and public money trail forensics."
    }
  ],

  // Inviolable Editorial Independence Policy
  editorialIndependence: {
    fundingDoesNotBuyCoverage: true,
    guaranteedPublication: false,
    favorableCoverageBought: false,
    contentRemovalPurchasable: false,
    predeterminedConclusions: false,
    disclosureRequired: true,
    disclosureNotice: "Research request funded by a third party. Funding does not determine Verdict's findings, editorial treatment, publication decision, or conclusion."
  }
};

/**
 * Returns active wallet address, allowing override from window or environment
 */
export function getActiveWalletAddress() {
  if (typeof window !== "undefined" && window.VERDICT_PUBLIC_WALLET) {
    return window.VERDICT_PUBLIC_WALLET;
  }
  return VERDICT_FUNDING_CONFIG.publicWalletAddress;
}

/**
 * Formats a transaction hash with link to the appropriate block explorer
 */
export function getExplorerTxUrl(networkId, txHash) {
  const net = VERDICT_FUNDING_CONFIG.supportedNetworks.find(n => n.id === networkId) || VERDICT_FUNDING_CONFIG.supportedNetworks[0];
  const cleanHash = String(txHash || "").trim();
  return `${net.blockExplorer}${cleanHash}`;
}
