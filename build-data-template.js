/* ============================================================================
   build-data-template.js — schema for the FDI scroll cinematic (build.html)
   ----------------------------------------------------------------------------
   build.html is 100% generic; this file is the ONLY founder-specific input.
   Copy to the build repo as `build-data.js` and fill every key from the
   build's own REAL artifacts — never invent numbers, quotes, or sources.

   Generation sources per key:
     - config.json          -> founder block, geo, excluded competitors
     - CONTEXT.md           -> narration voice, market stats, wow reasoning
     - webset-spec.json     -> process stages, axes, scan query, enrichments
     - scored companies     -> companies[], evidenceFeed, partners
       (webset-response.json / data.js / phase7-scored equivalents)

   COPY RULES for every narration string (validated in Phase 10):
     - Voice: confident analyst briefing the founder. No vendor pitch.
     - Hyphens only. NEVER em dashes.
     - Hero frames account QUALITY, not count ("... in. The readiest buyers out.")
     - Honest hedges stay ("illustrative", "where we have one").
     - Apostrophes inside JS strings must be curly (’), never straight quotes
       that terminate the string.
   ============================================================================ */
window.BUILD_DATA = {
  founder: {
    name: "{{PRODUCT_NAME}}",            // from config.json
    cobrand: "Primary",
    fileNo: "",                          // optional "FDI-###" badge; "" hides it
    hero3d: "",                          // optional named 3D object for the opener ("lantern" available); omit = neon-tube render of logoSvg
    tagline: "{{PRODUCT_TAGLINE}}",
    oneLine: "{{PRODUCT_ONELINE}}",
    logoSvg: '{{PRODUCT_LOGO_SVG}}'      // inline SVG, stroke-based, 24x24 viewBox
    // themeAccent (optional): per-founder override of the Ember default.
    // Omit entirely to keep Ember. Values are raw HSL triples (no hsl() wrapper).
    // themeAccent: { acc: "26 96% 58%", accSoft: "33 100% 68%", accDeep: "20 88% 46%",
    //                acc2: "262 80% 60%", bgh: "240 14% 5%", nh: "240 8%" }
  },

  // ---- per-founder copy for every act (all REQUIRED; generic fallbacks exist
  //      in build.html but shipping fallbacks fails the Phase 10 check) -------
  narration: {
    introHeadline: "",                   // beat 1 product headline (accent spans allowed: <span class="accent">...</span>); falls back to founder.oneLine
    heroTitle: ["", ""],                 // 2 lines. Line 1 = scale in; line 2 = quality out
    heroSub: "",                         // may contain <b>...</b>; ends "Scroll to watch it run."
    heroStats: [                         // exactly 4; all values REAL
      { n: 0, label: "" },               // e.g. universe scanned
      { n: 0, label: "custom signals" },
      { n: 0, label: "accounts curated" },
      { n: 0, label: "named buyers" }
    ],
    icp: "",                             // act 02 narration, <=2 sentences
    signals: "",                         // act 03
    evidence: "",                        // act 05 — name the actual enrichment fields
    score: "",                           // act 06 — mention founder weights; score orders, not qualifies
    shortlist: "",                       // act 07 — quality framing
    network: "",                         // act 08 — Primary's network, real relationships
    finaleSub: "",                       // finale — universe -> shortlist -> warm path
    scanCollapsedLabel: "high-fit matches we research in depth",
    excludeLabel: ""                     // "Excluded up front: ..." one line
  },

  // ---- act 02: derive the ICP ----------------------------------------------
  icp: {
    read: [ { label: "", meta: "" } ],   // 4 items: memo, calls, diligence, own research
    qualifier: [ "" ],                   // 5 plain checkable criteria
    buyer: "",                           // exact buyer title
    geo: ""
  },

  // ---- act 01: the process (stages + REAL tools; logos in assets/logos) ----
  process: {
    lead: "",                            // one-line hands-on framing
    foot: "",                            // mono footer line
    stages: [                            // exactly 5: Discover / Design the signals /
      { stage: "", tools: [""], bullets: ["", "", ""] }  // Enrich & verify / Score / Map the way in
    ]
  },

  // ---- act 03: the signals ---------------------------------------------------
  // 4 axes. Weights sum to 100. Exactly ONE axis carries wowNote (the
  // founder-specific WOW signal) — that card gets the big treatment.
  axes: [
    { key: "", name: "", weight: 0, kind: "Founder-specific|Standard",
      short: "",                         // optional 1-word formula label if name's first word reads wrong
      measures: "", five: "",
      wowNote: { eyebrow: "Why X is the sharpest signal", body: "" }  // on ONE axis only; <b> allowed
    }
  ],

  // ---- act 04: scan the market ----------------------------------------------
  scan: {
    universeLabel: "",                   // plural noun phrase, e.g. "franchised dealership rooftops"
    universe: 0, groups: 0, matched: 0, curated: 10, partners: 0,
    query: "",                           // the Webset search query, human-readable
    funnel: { universe: "", groups: "", matched: "high-fit matches" },  // 3 short stat labels
    excludes: [ "" ]                     // competitor/vendor names struck out on screen
  },

  // ---- act 05: pull the evidence --------------------------------------------
  enrichments: [ { field: "", src: "" } ],  // ~8 columns actually enriched

  // terminal feed: 8-9 REAL citations from the scored companies' sources.
  // [tier ("1"|"2"), source name, one-line claim]. Never fabricated.
  evidenceFeed: [ ["1", "", ""] ],

  // ---- acts 06/07: the scored companies (top of list = hero account) --------
  companies: [
    { name: "", seg: "", tier: "high|med|low", score: 0,
      s: { /* one 0-5 value per axes[].key */ },
      // display fields shown in tooltips / dashboard parity:
      hq: "", ownership: "", wow: "",
      contact: { name: "", title: "" },
      sources: [ { t: "Source — claim", tier: 1 } ], srcCount: 0 }
  ],

  partners: [ { name: "", status: "", note: "" } ],  // signed / onboarding / pipeline

  // ---- act 08: the warm-path network ----------------------------------------
  // Connectors are ROLE-BASED and illustrative unless real Affinity data is
  // supplied. Each account appears under exactly ONE connector (a partition);
  // secondary paths go in alsoReaches (rendered as a ring, not an edge).
  network: {
    hub: "Primary",
    illustrative: true,
    shortNames: {},                      // display-name overrides where suffix-strip heuristic reads wrong
    connectors: [ { key: "pp", role: "Primary Partner", accounts: [""] } ],
    alsoReaches: { }                     // { "Company Name": ["connectorKey"] }
  }
};
