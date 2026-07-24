// SCHEMA DOC for the competitors module (window.COMPETITORS_DATA). This is the
// contract Phase 8d (skill) generates against - it is NOT shipped to the build.
// competitors.html reads window.COMPETITORS_DATA and degrades to an empty state
// when it is absent or build_status !== "ok" (same pattern as network-data.js).
//
// Rules enforced by the Phase 8d self-check:
//   - 5-8 competitors, each with >= 2 https:// sources
//   - why_founder_wins is POSITIONING (why the founder is different/better for
//     the buyer), never disparagement - this page can ship world-readable on a
//     public build, so every competitor claim must be sourced and fair
//   - market_map.placements: EXACTLY ONE is_founder:true (the founder), one per
//     competitor; x and y are integers 0-100; each name matches founder.name or a
//     competitors[].name
//   - hyphens only, never em dashes; apostrophes inside strings are curly (’)
//
// ---- OK shape (research succeeded) -----------------------------------------
window.COMPETITORS_DATA = {
  schema_version: 1,                       // always 1 for this contract
  generated_at: "<ISO 8601 timestamp>",
  build_status: "ok",                      // "ok" renders the page; anything else = empty state
  founder: {
    name: "<founder / product name>",      // must equal the is_founder placement name
    positioning: "<one sentence: how the founder frames itself>"  // renders as the page lede
  },
  market_map: {
    // the two dimensions that actually separate this market. Pick axes a buyer
    // would recognize (e.g. "Point tool ↔ Platform", "SMB ↔ Enterprise").
    axis_x: { label: "<x axis name>", low: "<left end>", high: "<right end>" },
    axis_y: { label: "<y axis name>", low: "<bottom end>", high: "<top end>" },
    placements: [
      { name: "<founder name>", x: 0, y: 0, is_founder: true },   // EXACTLY ONE is_founder:true
      { name: "<competitor name>", x: 0, y: 0, is_founder: false }
      // ...one placement per competitor, x/y in 0-100
    ]
  },
  competitors: [
    {
      name: "<competitor>",
      domain: "<primary domain, no scheme>",
      category: "<short category label>",
      one_liner: "<what they are, one sentence>",
      positioning: "<how THEY frame themselves / who they target, 1-2 sentences>",
      strengths: ["<genuine strength>", "<genuine strength>"],       // real, not strawmen
      weaknesses: ["<structural gap the founder exploits>"],         // sourced, fair
      why_founder_wins: "<positioning: why the founder is the better fit for the buyer - NOT disparagement>",
      funding_stage: "<e.g. Series B, bootstrapped, public>",
      pricing_model: "<e.g. usage-based, per-seat, tiered>",
      notable_customers: ["<logo>", "<logo>"],                       // may be [] if none are public
      sources: [                                                     // >= 2, all https
        { title: "<source title>", url: "https://..." },
        { title: "<source title>", url: "https://..." }
      ]
    }
    // ...5-8 competitors total
  ],
  summary: "<2-3 sentences: the shape of the field + the founder's wedge>"
};

// ---- DEGRADE shape (selected but research could not complete) ---------------
// Ship BOTH files anyway - competitors.html renders its designed empty state and
// the build records modules.competitors:"failed". Never block the build.
//   window.COMPETITORS_DATA = {
//     schema_version: 1,
//     generated_at: "<ISO>",
//     build_status: "unavailable",
//     founder: { name: "<founder>", positioning: "" },
//     market_map: { axis_x: {label:"",low:"",high:""}, axis_y: {label:"",low:"",high:""}, placements: [] },
//     competitors: [],
//     summary: ""
//   };
