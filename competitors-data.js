// FICTIONAL fixture for the competitors module (like network-data.js's fixture).
// Real builds overwrite this at Phase 8d. Every field below is invented - it only
// exercises the competitors.html renderer + the market map. Schema + rules live in
// competitors-data-template.js.
window.COMPETITORS_DATA = {
  schema_version: 1,
  generated_at: "2026-01-01T00:00:00Z",
  build_status: "ok",
  founder: {
    name: "Meridian",
    positioning: "Meridian is the usage-based billing layer built for infrastructure companies, metering raw events instead of forcing everything through a subscription model."
  },
  market_map: {
    axis_x: { label: "Billing model", low: "Subscription-first", high: "Usage-native" },
    axis_y: { label: "Buyer", low: "SMB / self-serve", high: "Enterprise / platform" },
    placements: [
      { name: "Meridian", x: 88, y: 74, is_founder: true },
      { name: "Recurly", x: 22, y: 40, is_founder: false },
      { name: "Chargebee", x: 30, y: 55, is_founder: false },
      { name: "Metronome", x: 80, y: 82, is_founder: false },
      { name: "Orb", x: 74, y: 58, is_founder: false },
      { name: "Lago", x: 68, y: 30, is_founder: false },
      { name: "Stripe Billing", x: 52, y: 66, is_founder: false }
    ]
  },
  competitors: [
    {
      name: "Metronome", domain: "metronome.com", category: "Usage-based billing",
      one_liner: "Enterprise-grade usage metering for large infrastructure and AI platforms.",
      positioning: "Positions as the billing system of record for the biggest consumption businesses, competing on scale and reliability of the metering pipeline.",
      strengths: ["Proven at very high event volumes", "Strong logo list of large platforms", "Mature invoicing and revenue recognition"],
      weaknesses: ["Heavy implementation lift for mid-market", "Pricing opaque below enterprise", "Slower to support novel metering shapes"],
      why_founder_wins: "Meridian ships a same-day metering integration for mid-market infra teams that Metronome only serves through a multi-quarter enterprise rollout.",
      funding_stage: "Series B", pricing_model: "Platform fee + volume",
      notable_customers: ["OpenAI", "Confluent", "NVIDIA"],
      sources: [
        { title: "Metronome - Series B announcement", url: "https://example.com/metronome-series-b" },
        { title: "Case study: metering at scale", url: "https://example.com/metronome-scale" }
      ]
    },
    {
      name: "Orb", domain: "withorb.com", category: "Usage-based billing",
      one_liner: "Developer-friendly usage billing with a flexible pricing engine.",
      positioning: "Wins on pricing-model flexibility and a clean API, targeting product-led infra companies.",
      strengths: ["Very flexible pricing primitives", "Good developer experience", "Fast to a first invoice"],
      weaknesses: ["Thinner enterprise controls", "Smaller reference base", "Metering pipeline less battle-tested at extreme scale"],
      why_founder_wins: "Meridian pairs Orb-level pricing flexibility with an enterprise audit + reconciliation layer Orb has not built yet.",
      funding_stage: "Series B", pricing_model: "Percentage of billed revenue",
      notable_customers: ["Vercel", "Replicate"],
      sources: [
        { title: "Orb product overview", url: "https://example.com/orb-product" },
        { title: "Orb pricing model deep dive", url: "https://example.com/orb-pricing" }
      ]
    },
    {
      name: "Lago", domain: "getlago.com", category: "Open-source billing",
      one_liner: "Open-source metering and billing, self-hostable.",
      positioning: "Competes on openness and control, appealing to engineering teams wary of vendor lock-in.",
      strengths: ["Open-source and self-hostable", "Transparent roadmap", "Strong community adoption"],
      weaknesses: ["Self-hosting operational burden", "Enterprise support still maturing", "Fewer turnkey integrations"],
      why_founder_wins: "Meridian offers the control open-source buyers want without the operational cost of running the metering infrastructure themselves.",
      funding_stage: "Series A", pricing_model: "Open-source core + paid cloud",
      notable_customers: ["Together AI"],
      sources: [
        { title: "Lago open-source repository", url: "https://example.com/lago-oss" },
        { title: "Lago cloud pricing", url: "https://example.com/lago-cloud" }
      ]
    },
    {
      name: "Chargebee", domain: "chargebee.com", category: "Subscription management",
      one_liner: "Established subscription billing and revenue management suite.",
      positioning: "Broad subscription-management incumbent extending into usage, strong in SaaS finance workflows.",
      strengths: ["Deep subscription feature set", "Large partner ecosystem", "Strong finance and dunning tooling"],
      weaknesses: ["Usage metering bolted on, not native", "Heavier for infra event volumes", "Slower innovation on consumption pricing"],
      why_founder_wins: "For infra companies whose revenue is events-not-seats, Meridian is usage-native where Chargebee retrofits usage onto a subscription core.",
      funding_stage: "Late stage / private", pricing_model: "Tiered subscription",
      notable_customers: ["Freshworks", "Study.com"],
      sources: [
        { title: "Chargebee usage-based billing page", url: "https://example.com/chargebee-usage" },
        { title: "Chargebee company profile", url: "https://example.com/chargebee-profile" }
      ]
    },
    {
      name: "Recurly", domain: "recurly.com", category: "Subscription management",
      one_liner: "Subscription billing platform focused on recurring revenue optimization.",
      positioning: "Recurring-revenue optimizer for subscription businesses, strong on churn and retention tooling.",
      strengths: ["Churn and retention tooling", "Reliable recurring billing", "Established mid-market presence"],
      weaknesses: ["Limited usage/event metering", "Not aimed at infrastructure buyers", "Consumption pricing is an afterthought"],
      why_founder_wins: "Meridian targets the infrastructure buyer Recurly was never built for, metering raw usage events natively.",
      funding_stage: "Private equity owned", pricing_model: "Tiered subscription",
      notable_customers: ["Twitch", "Sling"],
      sources: [
        { title: "Recurly platform overview", url: "https://example.com/recurly-platform" },
        { title: "Recurly market positioning", url: "https://example.com/recurly-position" }
      ]
    },
    {
      name: "Stripe Billing", domain: "stripe.com", category: "Payments + billing",
      one_liner: "Billing built on top of the Stripe payments platform.",
      positioning: "The default for teams already on Stripe payments, competing on bundling and reach.",
      strengths: ["Huge existing Stripe footprint", "Bundled with payments", "Trusted brand"],
      weaknesses: ["Usage metering less flexible for complex infra pricing", "Harder to model multi-dimensional usage", "Less specialized support for metering edge cases"],
      why_founder_wins: "Meridian handles the multi-dimensional, high-cardinality metering that Stripe Billing struggles to model for infrastructure pricing.",
      funding_stage: "Public-adjacent / private", pricing_model: "Percentage of volume",
      notable_customers: ["Notion", "Slack"],
      sources: [
        { title: "Stripe Billing documentation", url: "https://example.com/stripe-billing" },
        { title: "Stripe usage-based billing limits", url: "https://example.com/stripe-usage-limits" }
      ]
    }
  ],
  summary: "The field splits along one axis that matters most for infrastructure companies: whether usage metering is native or retrofitted. Meridian and Metronome anchor the usage-native, enterprise corner; the subscription incumbents (Chargebee, Recurly) and the payments-bundled option (Stripe Billing) retrofit usage onto a recurring core. Meridian's wedge is enterprise-grade metering at mid-market speed."
};
