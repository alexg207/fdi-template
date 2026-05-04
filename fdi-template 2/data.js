// ══════════════════════════════════════════════════════════════════════════
// FDI Intelligence Map — data.js TEMPLATE
// ══════════════════════════════════════════════════════════════════════════
// This is the data layer for the FDI dashboard. It exports 7 collections
// that index.html consumes. Replace placeholder data with real research
// for your founder, but keep the structure intact.
//
// READ FIRST: AI_INSTRUCTIONS.md and TEMPLATE_GUIDE.md
// REFERENCE EXAMPLE: github.com/alexg207/valar-fdi (private — request access)
//
// COLLECTIONS:
//   ROW_SOURCES       Citations for individual data rows ("Co|Section|Label" → source)
//   SEGMENTS          Main companies array, organized into tabs
//   CONTACT_MAP       Per-company contact list with warm-intro mapping
//   COMPANY_SOURCES   Hyperlinked references per company (footer of detail view)
//   JOB_LISTINGS      Active job postings per company (drives Hiring sub-score)
//   RESIDENCY_MAP     Vertical-specific axis-2 scoring (rename per project)
//   PRIMARY_TEAM      List of Primary team members for warm-intro attribution
//
// PLACEHOLDER STRATEGY:
//   - 5 fake companies organized into 2 segments (Pipeline, Mid-Market)
//   - Add a third segment (Enterprise) following the same shape when needed
//   - Names like "Acme Corp" deliberately signal "this is a placeholder, replace me"
// ══════════════════════════════════════════════════════════════════════════


/* ────────────────────────────────────────────────────────────────────────
   ROW_SOURCES — citation strings for individual data rows
   ────────────────────────────────────────────────────────────────────────
   Schema:    "<Company>|<Section title>|<Row label>": "<citation string>"
   Used by:   index.html — appears as a tooltip on hoverable cells
   Required:  No, but every claim in SEGMENTS[].sections[].rows benefits from one
   ──────────────────────────────────────────────────────────────────────── */
const ROW_SOURCES = {
  // Example pattern — replicate per company × per section × per row
  "Acme Corp|Company Profile|Industry": "Acme 2025 10-K, SEC EDGAR",
  "Acme Corp|Company Profile|Revenue": "Acme FY2025 Annual Report",
  "Acme Corp|Workflow Opportunity|Use Cases": "Acme engineering blog, 'Scaling X', 2025",
  // ...
};


/* ────────────────────────────────────────────────────────────────────────
   SEGMENTS — the spine of the dashboard
   ────────────────────────────────────────────────────────────────────────
   This is an array of segment objects, each rendered as a top-level tab.
   Common segments: "Active Pipeline" (signed/in-flight) → "Mid-Market"
   (near-term ICP) → "Enterprise" (stretch ICP). See TEMPLATE_GUIDE.md.

   Segment object:
     id            string — slug used in URL/tab state, must match tab data
     label         string — short label shown on tab
     icon          string — emoji or unicode glyph (legacy, can be empty)
     icon_svg      string — inline SVG used in section header (optional)
     eyebrow       string — small uppercase label above title
     title         string — H1 heading for the segment landing
     desc          string — 1–2 sentence description shown under title
     companies     array  — Company objects (see schema below)

   Company object:
     name                       string  — REQUIRED. Display name.
     domain                     string  — REQUIRED. Used for favicon (no protocol).
     subtitle                   string  — One-line description shown under name.
     tier                       string  — 'high' | 'med' | 'low'. Drives sort + filter.
     tags                       array   — UI tags. Each: { t, c, tip? }
                                          c = 'neutral' | 'stack' | 'brand'
                                          ('brand' tag uses founder's accent color — reserve for relationship tags
                                          like "Design Partner", "In Pipeline", "Prospect")
     overview                   string  — Paragraph shown in detail view header.
     sections                   array   — { title, rows: [[label, value], ...] }
                                          The 3-section default: Company Profile,
                                          {Workflow|Domain} Opportunity, GTM Strategy.
                                          Vary section names by vertical.
     contacts                   array   — Inline contacts (also see CONTACT_MAP merge).
     signal_score               number  — 0–5. Axis 3: Buying Trigger.
     signals                    array   — Bullet strings supporting signal_score.
     signal_types               array   — 'positive' | 'negative' per signals[i].
     opp_reason                 string  — Tooltip on Buying Trigger axis.
     competitive_distress       number  — 0–5. Axis 1: rename per vertical.
                                          (Valar default label: "Inference Pain")
     distress_reason            string  — Tooltip on axis 1.
     distress_signals           array   — Supporting bullets for axis 1.
     distress_signal_types      array   — 'positive' | 'negative' per item.
     data_residency             number  — 0–5. Axis 2: rename per vertical.
                                          (Valar default label: "Data Residency")
     residency_reason           string  — Tooltip on axis 2.
     residency_signals          array   — Supporting bullets for axis 2.
     residency_signal_types     array   — 'positive' | 'negative' per item.
     gtm_thesis                 string  — One-paragraph buy-side narrative.
                                          Embedded HTML allowed (e.g., <strong>).
   ──────────────────────────────────────────────────────────────────────── */
const SEGMENTS = [

  /* ====================================================================
     SEGMENT 0 — Active Pipeline
     Signed design partners + active conversations. Use this when the
     founder already has named accounts moving. Skip if pre-pipeline.
     ==================================================================== */
  {
    id: 'pipeline',
    label: 'Active Pipeline',
    icon: '🎯',
    eyebrow: 'DESIGN PARTNERS + NAMED PIPELINE',
    title: 'Active Accounts',
    desc: 'Companies already signed as design partners or in active pipeline conversations. Use this view to track current motion and reference-account positioning.',
    icon_svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    companies: [

      // ── 1. Placeholder design partner ──
      // Replace with real signed design partner. Keep tier='high' for partners.
      {
        name: 'Acme Corp',
        domain: 'acme.example',
        subtitle: 'Industry leader — signed design partner. [REPLACE: one-line specific use case].',
        tier: 'high',
        tags: [
          { t: 'Design Partner', c: 'brand', tip: 'Signed design partner' },
          { t: 'Industry Tag 1', c: 'neutral' },
          { t: 'Constraint Tag', c: 'stack', tip: 'Reason this company cannot use the default vendor' }
        ],
        overview: '[REPLACE: one paragraph explaining who this company is, why they\'re a fit, and what makes them a strong reference account for the rest of the vertical. Reference the founder\'s thesis explicitly.]',
        sections: [
          {
            title: 'Company Profile',
            rows: [
              ['Industry', '[Industry segment]'],
              ['Founded', '[Year]'],
              ['Headquarters', '[City, State/Country]'],
              ['Cloud Provider', '[AWS / GCP / Azure / multi-cloud]'],
              ['AI Maturity', '[High / Med / Low — supporting evidence in 1 sentence]'],
              ['{{PRODUCT_NAME}} Status', 'Signed Design Partner']
            ]
          },
          {
            title: '{{OPPORTUNITY_SECTION_TITLE}}',  // e.g., "Inference Opportunity", "Workflow Opportunity"
            rows: [
              ['Use Cases', '[Specific use cases this company will run on the founder\'s product]'],
              ['Current Stack', '[What they use today + active development with the founder]'],
              ['Pain Points', '[Concrete pain — make this specific, not generic]'],
              ['Estimated Spend', '[$ or volume estimate that justifies the ACV]']
            ]
          },
          {
            title: 'GTM Strategy',
            rows: [
              ['Approach', '[Already-executed: focus is reference development. Or: planned land/expand sequence.]'],
              ['Key Evidence', '[Public signals supporting the thesis]'],
              ['Urgency Level', 'EXECUTE — already a customer; priority is reference-account development.'],
              ['Target Buyer', 'Buyer: [title]. Champion: [title].'],
              ['Messaging Angle', '[1–2 sentence positioning specific to this company]']
            ]
          }
        ],
        contacts: [],
        signal_score: 5,
        signals: ['Already signed as design partner', '[Second supporting signal]', '[Third supporting signal]'],
        signal_types: ['positive', 'positive', 'positive'],
        opp_reason: 'Signed design partner — top priority for engineering investment, reference development, and category proof-out.',
        competitive_distress: 4,
        distress_reason: '[Vertical-specific axis-1 reason: e.g., why default solutions fail this company]',
        distress_signals: ['[Supporting bullet 1]', '[Supporting bullet 2]'],
        distress_signal_types: ['negative', 'negative'],
        data_residency: 4,
        residency_reason: '[Vertical-specific axis-2 reason: e.g., compliance, switching cost, trust gap]',
        residency_signals: ['[Supporting bullet 1]', '[Supporting bullet 2]'],
        residency_signal_types: ['negative', 'negative'],
        gtm_thesis: '[REPLACE: 2–3 sentence narrative. Why this company is the canonical reference for the thesis. What it unlocks (peer accounts in same vertical). Buyer/champion call-out at end.] <strong>Buyer:</strong> [title].'
      },

      // ── 2. Placeholder pipeline account ──
      // Replace with real named-pipeline account. tier='high' if hot, 'med' if warming.
      {
        name: 'Beta Industries',
        domain: 'beta.example',
        subtitle: '[REPLACE: one-line description of who they are and why they\'re in pipeline].',
        tier: 'med',
        tags: [
          { t: 'In Pipeline', c: 'brand', tip: 'Active pipeline conversation' },
          { t: 'Industry Tag', c: 'neutral' }
        ],
        overview: '[REPLACE: one paragraph on the company and why the founder is talking to them.]',
        sections: [
          { title: 'Company Profile', rows: [['Industry', '[X]'], ['Revenue', '[$X]'], ['Cloud Provider', '[X]']] },
          { title: '{{OPPORTUNITY_SECTION_TITLE}}', rows: [['Use Cases', '[X]'], ['Pain Points', '[X]']] },
          { title: 'GTM Strategy', rows: [['Approach', '[X]'], ['Target Buyer', '[X]']] }
        ],
        contacts: [],
        signal_score: 4,
        signals: ['[Signal 1]', '[Signal 2]'],
        signal_types: ['positive', 'positive'],
        opp_reason: '[Why this is a real opportunity]',
        competitive_distress: 3,
        distress_reason: '[Axis 1 explanation]',
        data_residency: 3,
        residency_reason: '[Axis 2 explanation]',
        gtm_thesis: '[REPLACE: 2–3 sentence narrative.]'
      }

    ]
  },

  /* ====================================================================
     SEGMENT 1 — Mid-Market (Stage 1 ICP, near-term)
     Companies that match the founder's primary near-term ICP. These are
     accounts that should convert in 6–12 months. Mid-market is the
     default "now" segment for most FDI projects.
     ==================================================================== */
  {
    id: 'midmarket',
    label: 'Mid-Market',
    icon: '🚀',
    eyebrow: 'STAGE 1 ICP — NEAR-TERM',
    title: 'Mid-Market Targets',
    desc: 'Companies in the founder\'s near-term ideal customer profile. Lower friction to convert, faster sales cycles.',
    companies: [

      // ── 3. Placeholder mid-market account ──
      {
        name: 'Gamma Health',
        domain: 'gammahealth.example',
        subtitle: '[REPLACE: company description tied to vertical].',
        tier: 'high',
        tags: [
          { t: '[Sector]', c: 'neutral' },
          { t: '[Constraint]', c: 'stack' }
        ],
        overview: '[REPLACE: paragraph on company and fit.]',
        sections: [
          { title: 'Company Profile', rows: [['Industry', '[X]'], ['Revenue', '[X]'], ['Cloud Provider', '[X]'], ['AI Maturity', '[X]']] },
          { title: '{{OPPORTUNITY_SECTION_TITLE}}', rows: [['Use Cases', '[X]'], ['Current Stack', '[X]'], ['Pain Points', '[X]']] },
          { title: 'GTM Strategy', rows: [['Approach', '[X]'], ['Key Evidence', '[X]'], ['Target Buyer', '[X]']] }
        ],
        contacts: [],
        signal_score: 4,
        signals: ['[Signal 1]', '[Signal 2]'],
        signal_types: ['positive', 'positive'],
        opp_reason: '[Reason]',
        competitive_distress: 4,
        distress_reason: '[Reason]',
        data_residency: 4,
        residency_reason: '[Reason]',
        gtm_thesis: '[REPLACE: narrative]'
      },

      // ── 4. Placeholder mid-market account ──
      {
        name: 'Delta Finance',
        domain: 'deltafin.example',
        subtitle: '[REPLACE: description].',
        tier: 'med',
        tags: [
          { t: '[Sector]', c: 'neutral' }
        ],
        overview: '[REPLACE: paragraph]',
        sections: [
          { title: 'Company Profile', rows: [['Industry', '[X]'], ['Revenue', '[X]']] },
          { title: '{{OPPORTUNITY_SECTION_TITLE}}', rows: [['Use Cases', '[X]'], ['Pain Points', '[X]']] },
          { title: 'GTM Strategy', rows: [['Approach', '[X]'], ['Target Buyer', '[X]']] }
        ],
        contacts: [],
        signal_score: 3,
        signals: ['[Signal]'],
        signal_types: ['positive'],
        opp_reason: '[Reason]',
        competitive_distress: 3,
        distress_reason: '[Reason]',
        data_residency: 3,
        residency_reason: '[Reason]',
        gtm_thesis: '[REPLACE: narrative]'
      },

      // ── 5. Placeholder mid-market account ──
      {
        name: 'Epsilon Logistics',
        domain: 'epsilonlogistics.example',
        subtitle: '[REPLACE: description].',
        tier: 'low',
        tags: [
          { t: '[Sector]', c: 'neutral' }
        ],
        overview: '[REPLACE: paragraph]',
        sections: [
          { title: 'Company Profile', rows: [['Industry', '[X]'], ['Revenue', '[X]']] },
          { title: '{{OPPORTUNITY_SECTION_TITLE}}', rows: [['Use Cases', '[X]']] },
          { title: 'GTM Strategy', rows: [['Approach', '[X]']] }
        ],
        contacts: [],
        signal_score: 2,
        signals: ['[Signal]'],
        signal_types: ['positive'],
        opp_reason: '[Reason]',
        competitive_distress: 2,
        distress_reason: '[Reason]',
        data_residency: 2,
        residency_reason: '[Reason]',
        gtm_thesis: '[REPLACE: narrative]'
      }

    ]
  }

  // To add an Enterprise segment (Stage 2 ICP, stretch), copy the Mid-Market
  // block, change id to 'enterprise', label to 'Enterprise', and populate
  // with stretch ICP companies. See TEMPLATE_GUIDE.md → "Segment Strategy".

];


/* ────────────────────────────────────────────────────────────────────────
   CONTACT_MAP — per-company warm-intro mapping
   ────────────────────────────────────────────────────────────────────────
   Schema:
     "<Company name>": [
       {
         name: "Person name",
         title: "Job title",
         type: "technical" | "business",
         linkedin: "https://linkedin.com/in/...",
         connections: [
           { person: "<Primary team member>", strength: "warm" | "possible" }
         ]
       }
     ]
   Empty array means no contacts mapped yet — UI handles gracefully.
   The keys here MUST exactly match a SEGMENTS[].companies[].name.
   ──────────────────────────────────────────────────────────────────────── */
const CONTACT_MAP = {
  "Acme Corp": [
    { name: "Jane Doe", title: "VP of Engineering", type: "technical", linkedin: "https://linkedin.com/in/example", connections: [{ person: "Alex Giles", strength: "warm" }] }
  ],
  "Beta Industries": [],
  "Gamma Health": [
    { name: "John Smith", title: "Director of AI", type: "business", linkedin: "https://linkedin.com/in/example2", connections: [] }
  ],
  "Delta Finance": [],
  "Epsilon Logistics": []
};


/* ────────────────────────────────────────────────────────────────────────
   COMPANY_SOURCES — primary references per company
   ────────────────────────────────────────────────────────────────────────
   Schema:
     "<Company name>": [
       { name: "Source description", url: "https://..." }
     ]
   Verify URLs are live. These render as clickable list at the bottom of
   each company's detail view, so credibility matters.
   ──────────────────────────────────────────────────────────────────────── */
const COMPANY_SOURCES = {
  "Acme Corp": [
    { name: "Acme 10-K Annual Filings — SEC EDGAR", url: "https://www.sec.gov/" },
    { name: "Acme Engineering Blog — [Topic]", url: "https://example.com/" }
  ],
  "Beta Industries": [],
  "Gamma Health": [],
  "Delta Finance": [],
  "Epsilon Logistics": []
};


/* ────────────────────────────────────────────────────────────────────────
   JOB_LISTINGS — active job postings per company
   ────────────────────────────────────────────────────────────────────────
   Schema:
     "<Company name>": [
       { title: "Job title", techs: "Comma-separated technologies", url: "https://...", date: "Active 2026" }
     ]
   Drives the Hiring sub-score in the dashboard. Specific tech keywords in
   `techs` raise the score (see hiring regex in index.html).
   For new verticals, UPDATE THE REGEX in index.html → computeJobSignal().
   ──────────────────────────────────────────────────────────────────────── */
const JOB_LISTINGS = {
  "Acme Corp": [
    { title: "Senior Engineer — [Domain]", techs: "[Tech 1, Tech 2, Tech 3]", url: "https://example.com/jobs/1", date: "Active 2026" }
  ],
  "Beta Industries": [],
  "Gamma Health": [
    { title: "Director of AI — Open Roles", techs: "[Tech 1, Tech 2]", url: "https://example.com/careers", date: "Active 2026" }
  ],
  "Delta Finance": [],
  "Epsilon Logistics": []
};


/* ────────────────────────────────────────────────────────────────────────
   RESIDENCY_MAP — vertical-specific axis-2 scoring
   ────────────────────────────────────────────────────────────────────────
   Schema:
     "<Company name>": { score: 1–5, reason: "Explanation string" }

   IMPORTANT: This collection is named "RESIDENCY_MAP" for legacy reasons
   (Valar's axis 2 was Data Residency). For new projects, the axis may be:
     - Switching Cost (B2B SaaS replacement)
     - Trust Gap (consumer health, fintech)
     - Compliance Burden (regulated verticals)
     - Workflow Lock-in (enterprise tooling)

   The data field name (`data_residency` on Company objects, RESIDENCY_MAP
   here) stays the same — only the LABEL in the UI changes. See the
   comment block at the top of the <script> tag in index.html.
   ──────────────────────────────────────────────────────────────────────── */
const RESIDENCY_MAP = {
  "Acme Corp": { score: 4, reason: "[REPLACE: axis-2 explanation tying score to specific evidence]" },
  "Beta Industries": { score: 3, reason: "[REPLACE]" },
  "Gamma Health": { score: 5, reason: "[REPLACE]" },
  "Delta Finance": { score: 3, reason: "[REPLACE]" },
  "Epsilon Logistics": { score: 2, reason: "[REPLACE]" }
};


/* ────────────────────────────────────────────────────────────────────────
   PRIMARY_TEAM — list used for warm-intro attribution
   ────────────────────────────────────────────────────────────────────────
   When CONTACT_MAP[].connections is empty, the UI synthesizes a possible
   warm intro from this list (see initData() in index.html).
   Keep this list current with the actual Primary team.
   ──────────────────────────────────────────────────────────────────────── */
const PRIMARY_TEAM = ['Alex Giles', 'Charles Holley', 'Gaby Lorenzi', 'Jason Gelman', 'Tobias', 'Ross', 'Cassie', 'Tanmaye', 'Ben', 'Hannah', 'Doug', 'Emily', 'Bridget', 'Shuman'];


/* ────────────────────────────────────────────────────────────────────────
   Exports
   ──────────────────────────────────────────────────────────────────────── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ROW_SOURCES, SEGMENTS, CONTACT_MAP, COMPANY_SOURCES, RESIDENCY_MAP, JOB_LISTINGS, PRIMARY_TEAM };
}
