# TEMPLATE_GUIDE.md, Structural Decisions for FDI Dashboards

**Audience:** Claude (running the build skill) and humans reviewing the template.
**Purpose:** For each structural element of the dashboard, this doc tells you **what it does, when to use it, when to skip it, and what data it requires.**

If `AI_INSTRUCTIONS.md` is the operating manual, this is the reference encyclopedia. Consult it whenever you're making a "should this section be here?" decision.

---

## 1. Segments (top-level tabs)

### What it does
Each segment becomes a top-level tab on the dashboard (Active Pipeline, Mid-Market, Enterprise, etc.). Companies belong to exactly one segment.

### Default segments (Valar pattern)
- **Active Pipeline**, Signed design partners + named pipeline accounts.
- **Mid-Market**, Stage 1 ICP, near-term targets.
- **Enterprise**, Stage 2 ICP, stretch targets.

### When to use the default
- Founder has signed design partners or named pipeline accounts AND a clear two-stage ICP (now / later).
- The "Stage 1 vs Stage 2" framing maps cleanly onto company size.

### When to deviate
- **Pre-pipeline founder**, Drop the Pipeline segment entirely. Two-segment dashboard (Mid-Market + Enterprise) is fine.
- **Single ICP founder**, Collapse to one segment. The tabs become irrelevant; show a single landing.
- **Geographic segmentation matters**, Replace size-based segments with geo (NAM / EMEA / APAC).
- **Vertical segmentation matters**, Replace with vertical buckets (Healthcare / Fintech / Retail). Especially common when the founder's wedge cuts across company sizes within each vertical.

### What data it requires
- Each segment object needs: `id`, `label`, `eyebrow`, `title`, `desc`, `companies[]`, plus the icon SVG.
- Companies in a segment all share the schema (so they render in the same card grid).

---

## 2. Sections within a company card

### What they do
The detail view of each company is divided into sections. Default 3:

1. **Company Profile**, Industry, revenue, HQ, cloud provider, AI maturity. Static facts.
2. **{Opportunity} section** (default name: "Inference Opportunity"), Use cases, current stack, pain points, estimated spend. The "why this account fits the thesis" content.
3. **GTM Strategy**, Approach, key evidence, urgency, target buyer, messaging angle. The "how to actually go win this account" content.

### When to keep all three
- The founder is selling into infrastructure, platform, or technical buyers.
- You have enough research depth to populate all three meaningfully.

### When to deviate
- **Add a "Competitive Landscape" section**, When the company is currently using a specific competitor and the wedge is replacement.
- **Add a "Workflow Map" section**, For workflow-automation founders, walking through the current process.
- **Add a "Decision Unit" section**, For enterprise sales motions where 5+ stakeholders are involved.
- **Drop the Opportunity section**, If the value prop is so obvious it doesn't need a section (rare).
- **Rename the Opportunity section**, Almost always do this. "Inference Opportunity" is Valar-specific. Try: "Workflow Opportunity," "Replacement Opportunity," "Automation Opportunity," "[Founder Product] Opportunity."

### What data it requires
- `sections[]` array of `{ title: string, rows: [[label, value], ...] }`
- Rows render as 2-column key/value pairs. The label column is monospace, value column has paragraph text.

---

## 3. Adapting Signal Categories (THE MOST IMPORTANT SECTION)

The dashboard scores each company across 4 axes that combine into a 0–100 signal score. The math is generic; the labels are vertical-specific.

### The 4 axes and how to relabel them

| Data field | Default label (Valar) | What it actually measures | Suggested labels by vertical |
|------------|----------------------|---------------------------|------------------------------|
| `competitive_distress` | Inference Pain | Workload-specific operational pain that the founder's product solves | "Workflow Pain" (workflow), "Compliance Burden" (regulated), "Incumbent Pain" (replacement), "Scaling Pain" (infra), "Data Pain" (data tooling) |
| `data_residency` | Data Residency | Structural reason a default solution fails this account | "Switching Cost" (B2B SaaS replacement), "Trust Gap" (consumer health/fintech), "Data Sovereignty" (regulated), "Workflow Lock-in" (enterprise tools), "Custom Need" (verticalized) |
| `signal_score` | Buying Trigger | Time-bound reason this account is winnable NOW (earnings comments, hiring spikes, partnerships, RFPs) | Usually keep "Buying Trigger", it's generic enough. Optionally: "Timing Signal," "Window Now." |
| `hiring` (computed) | Hiring | Validation that this company is staffing up against the problem | Usually keep "Hiring." Optionally: "Investment Signal" or rename to whatever the leading-indicator job category is for this vertical. |

### How to make the swap

For each project, you (Claude) need to:

1. **Decide the labels** based on the vertical and the founder's language.
2. **Update `index.html`**, search for the label strings in `buildScoreTips()` and section headers (see the giant comment block at the top of `<script>`).
3. **Update the hiring keyword regex** in `computeJobSignal()` to match your vertical. Valar's regex catches inference-related keywords; yours should catch your vertical's leading-indicator job titles/skills.
4. **Document the choice** in `BUILD_NOTES.md` so the user understands why these labels.

### Worked example: rebranding for a healthcare workflow founder

Imagine the founder is automating prior authorization workflows for hospitals.

- Axis 1 ("Inference Pain") → **"Workflow Pain"** (manual prior-auth backlog, denial rates, AR days).
- Axis 2 ("Data Residency") → **"Compliance Burden"** (HIPAA, state-specific regulations, payer contracts).
- Axis 3 ("Buying Trigger") → keep, generic.
- Axis 4 ("Hiring") → keep, but update regex to match: `prior auth|denial mgmt|RCM|revenue cycle|coding`.

The dashboard now reads like it was built for a healthcare founder, not for Valar.

---

## 4. The Network view

### What it does
A separate tab showing companies + warm-intro contacts overlaid with which Primary team members can make introductions. Drives the "request warm intro" workflow.

### When to keep
- Founder cares about warm intros (most do, if they're going outbound).
- Primary team has meaningful connections into the target accounts (CONTACT_MAP has data).

### When to drop
- Pre-revenue founder where outbound isn't running yet.
- Self-serve / PLG product where the buyer journey doesn't involve human intros.
- Network mapping is sparse, fewer than 5 mapped contacts across all companies makes the view feel empty.

### What data it requires
- `CONTACT_MAP[]` populated with at least some contacts having `connections[].strength === "warm"`.
- `PRIMARY_TEAM[]` list current.

---

## 5. The Hiring sub-score

### What it does
Computes a 0–5 score per company based on count of relevant active job postings + presence of vertical-specific keywords in titles/skills. Rolls into the total signal score.

### When to keep
- Job postings are a leading indicator in the founder's vertical (true for almost all infra, platform, dev tools, and enterprise software founders).
- You have job-listing data populated for at least 50% of companies.

### When to drop
- Job postings aren't a meaningful signal (some niche verticals where the buyer doesn't broadcast hiring).
- You have very thin job data (UI shows zeros and feels unimpressive).

If dropping: zero out the `hiring` math contribution by setting `computeJobSignal()` to return `0` always, OR by re-weighting the score formula. Update the score tooltip text to reflect the new weighting.

---

## 6. Tier ('high' / 'med' / 'low')

### What it does
Filter chip + sort key on the home view. Shapes which accounts surface first.

### How to assign tiers
- **'high'**, All 4 axes scored 4+. Or signed design partner. These are the founder's hottest opportunities.
- **'med'**, Mixed scores, generally 3+ on most axes. Real opportunity, needs more diligence.
- **'low'**, Speculative, weak signal, or stretch. Worth tracking, not pursuing.

Distribution sanity check: in a healthy 20-company dashboard, expect roughly 5–8 high, 8–10 med, 4–7 low. If everything is 'high', tiers are meaningless. If everything is 'low', the founder doesn't have an actionable list.

---

## 7. Tags

### What they do
Small chips below the company name. Three styling variants:
- `c: 'neutral'`, Gray. Industry/sector facts.
- `c: 'stack'`, Subtle highlight. Constraint or technology tag (the "why default solutions fail this company" tag).
- `c: 'brand'`, Founder's accent color. Reserved for tags that mark a relationship to the founder ("Design Partner," "In Pipeline," etc.).

### Pattern
- Always include 1 sector/industry tag.
- Include 1 stack tag if there's a specific compliance/data/technology constraint that explains why the founder wins.
- Include 1 founder-color tag if the company has a relationship to the founder (signed, in pipeline, prospect).

### Anti-pattern
- More than 5 tags makes the card noisy.
- Generic tags like "AI" or "Tech", be specific. "AIOps" is a tag, "AI" is not.

---

## 8. The `gtm_thesis` field

### What it does
The single most important piece of copy on the dashboard. Renders as a paragraph at the top of each company card and again in detail view.

### What it should contain
- A 2–3 sentence narrative answering: "Why this company, why now, what's the wedge?"
- Founder voice, splice verbatim quotes from CONTEXT.md if possible.
- Buyer/champion call-out at the end ("**Buyer:** Director of Engineering, **Champion:** AI Platform Lead").
- Specific named accounts as references ("BigPanda is the canonical AIOps reference for the BYOC thesis. Land already executed, focus is on co-developing case study evidence...").

### What it should NOT contain
- Generic startup language ("disrupting the market," "category-defining").
- Hedges ("could potentially," "may benefit from").
- Marketing taglines.
- Anything that could be said about any company in this segment.

### Test
Strip the company name from the gtm_thesis. Could you swap any other company's name in and have it still make sense? If yes, it's not specific enough.

---

## 9. Field-by-field craft patterns (extracted from the V1 Valar dashboard)

The V1 Valar dashboard is the gold-standard reference. The patterns below are extracted from it directly, every example is real V1 copy. Apply these patterns to your own founder's data when populating data.js.

### 9.1 `subtitle`, one line, dense, signal-rich

Subtitle is the sentence under the company name. The V1 pattern is consistent across all 30 entries: **[what the company is], [why-they-fit-Valar phrase], [Valar relationship status]**.

V1 examples:
- BigPanda: *"AIOps + incident management, signed design partner. Inference for autonomous incident triage on production telemetry data."*
- Qualcomm: *"Mobile silicon + on-device AI leader, IP-sensitive R&D inference workloads, named in Valar pipeline."*
- Mastercard: *"Payments network giant, 150B+ transactions/year, real-time inference for fraud + risk, PCI DSS-bound."*

The pattern works because every subtitle does three jobs in one sentence:
1. Names the business
2. Identifies the structural reason this company fits the founder's wedge
3. Marks the relationship status to the founder

**Anti-patterns** (don't):
- Generic descriptors: "Leading provider of X" → no signal
- Marketing language: "Industry-defining innovator" → no signal
- Vague relationship: "Potential customer" → useless; if it's a candidate, say what made it candidate-worthy

### 9.2 `overview`, 3-5 sentences, named-account positioning

The overview paragraph that opens the company card. V1 pattern: **state the company's position in the founder's market story, then connect to the Valar thesis with named adjacencies**.

V1 BigPanda example, in full:
> *"BigPanda is one of Valar's two named design partners (alongside Varonis). They run AI-driven incident management for enterprise IT teams, where customer telemetry data flowing through their AI pipelines is highly sensitive, it includes infrastructure topology, alert content, and incident context. Multi-tenant inference clouds are a non-starter. BigPanda's validation as a design partner anchors the BYOC inference thesis for AIOps and observability vendors broadly."*

Notice what this does:
- Names the relationship explicitly ("one of Valar's two named design partners (alongside Varonis)")
- Specifies the data sensitivity in concrete terms ("infrastructure topology, alert content, and incident context"), not abstract "their data is sensitive"
- Connects this single company to a category-level reference ("anchors the BYOC inference thesis for AIOps and observability vendors broadly")

The category connection is critical, it tells the founder why this company matters beyond itself.

### 9.3 `gtm_thesis`, 2-3 sentences ending with a named buyer

This is the single highest-leverage paragraph. Already covered in Section 8. The V1 patterns to internalize:

**Land status + reference value + buyer call-out**

V1 BigPanda: *"BigPanda is the canonical AIOps reference for the BYOC thesis. Land already executed, focus is on co-developing case study evidence (cost reduction %, SLO improvement, deployment friction) that Valar uses to land peer accounts (Datadog, Splunk-adjacents, Sumo Logic). **Buyer:** Platform Engineering / Site Reliability lead."*

V1 Varonis: *"Varonis anchors the cyber/DSPM reference. Joint go-to-market motion to land CrowdStrike, SentinelOne, Wiz, Rubrik. **Buyer:** Security/Compliance leadership + Platform Engineering."*

V1 ABInBev: *"ABInBev advances the Fortune 500 multi-region BYOC narrative. Land via supply chain AI pilot, expand into marketing + CX. **Buyer:** Platform Engineering or Chief Data/AI Officer (NOT marketing AI team)."*

Three patterns to extract:
1. **First sentence** anchors the company in the founder's story ("X is the canonical Y reference for Z thesis"). Be specific about the role this company plays.
2. **Middle sentence(s)** describe the next-step motion, what concrete action does this account enable? "Land here = open peer accounts X, Y, Z" is a powerful pattern when applicable.
3. **Buyer call-out** uses bold. **NOT** is critical, explicit "NOT [persona]" guidance reflects founder antagonist warnings (V1 used "NOT marketing AI team," "NOT research-floor AI team," "NOT ML eng", all from Tom's interview).

### 9.4 `tags`, 3-5 chips, mixed colors

Tag color vocabulary observed in V1: `Valar` (founder accent, relationship status), `stack` (subtle highlight, technical/constraint), `hw` (harder constraint), `hiring` (hiring signal), `oss` (open-source), `neutral` (gray, factual).

V1 GM (Cruise) tag set:
```javascript
[
  { t: 'Automotive', c: 'neutral', tip: 'Major automaker, formerly operated Cruise autonomous division' },
  { t: 'GCP + AWS', c: 'stack', tip: 'GCP primary, some AWS workloads' },
  { t: 'ADAS / Autonomy', c: 'stack', tip: 'Advanced driver assistance and autonomous vehicle AI' },
  { t: 'Cost Restructuring', c: 'hw', tip: '$2B Cruise spend being restructured for efficiency' },
  { t: 'Hiring: ML Platform', c: 'hiring', tip: 'Rebuilding ML platform team post-Cruise restructuring' }
]
```

Patterns:
- **Tooltips are required if the tag is non-obvious.** "AIOps" is self-explanatory; "Data-Sensitive" needs a tip explaining why ("Customer telemetry data cannot be exposed to multi-tenant inference").
- **Hiring tags are prefixed**: `'Hiring: ML Platform'` not just `'ML Platform'`.
- **Color reflects role, not aesthetic.** Don't pick `c:` based on what looks nice, pick based on what the tag means.

When the founder has an explicit "ML eng = antagonists" guidance, do NOT tag those teams as positive. The color discipline reinforces the founder's actual GTM strategy.

### 9.5 `signals[]`, `signal_types[]`, `opp_reason`, axis 3 evidence trio

The Opportunity axis (axis 3) renders three things together: the score (0-5), the bullet signals, and the reasoning paragraph. V1 pattern: **3-4 short signal bullets + 1-2 sentence reasoning that ties them together**.

V1 Mastercard:
- `signal_score: 3`
- `signals: ['Extreme-scale real-time inference workload (150B+ transactions)', 'Expanding into generative AI features', 'PCI DSS creates data sovereignty requirement']`
- `signal_types: ['positive', 'positive', 'neutral']`
- `opp_reason: "One of the world's most demanding inference workloads. PCI compliance creates a natural fit for Valar's in-cloud model. Challenge is that Mastercard has deep in-house expertise, so Valar needs to demonstrate clear value beyond what their team has built."`

Notice the honesty, `opp_reason` flags the *challenge* (Mastercard's in-house expertise) alongside the opportunity. V1 didn't paint everything as a slam dunk. That credibility carries through to the founder's reading of the dashboard.

`signal_types` values: `'positive'` (green tone), `'negative'` (red, used for distress signals or buying pain), `'neutral'` (gray, factual but not necessarily positive).

### 9.6 `competitive_distress`, `distress_reason`, `distress_signals[]`, axis 1 (or your renamed axis 1)

The Inference Pain axis. Same trio pattern as 9.5. V1 BigPanda:
- `competitive_distress: 4`
- `distress_reason: "BigPanda has the inference workload + data sensitivity that makes managed APIs non-viable. Hyperscaler defaults aren't optimized for AIOps cost profile."`
- `distress_signals: ['Customer telemetry cannot use multi-tenant inference', 'AIOps margins compress with rising AI compute']`
- `distress_signal_types: ['negative', 'negative']`

Note: distress signals are usually marked `'negative'` because they're describing a pain that the buyer is experiencing, "negative" in this context means "buyer feels this as bad."

### 9.7 `data_residency`, `residency_reason`, `residency_signals[]`, axis 2 (or your renamed axis 2)

Same pattern. V1 Capital One residency_reason:
> *"Federal banking regulations on AI model governance, OCC supervisory expectations on AI risk management, customer financial data sovereignty requirements. PCI DSS Level 1 + SOX + state banking regulations = inference cannot route through multi-tenant clouds."*

Notice the **specificity of the regulatory citation**, OCC, PCI DSS Level 1, SOX, state banking. This is what separates a credible residency claim from hand-waving. When the Webset returns a residency enrichment, parse out the specific regulations and compliance framework names, those are what go into `residency_reason`.

### 9.8 `sections`, 3 sub-tables of fact rows

Each company card has 3 sections (default: Profile / Inference Opportunity / GTM Strategy). Each section is a list of `[label, value]` row pairs. V1 pattern: **6 rows in Profile, 4 rows in Opportunity, 5 rows in GTM Strategy**.

V1 BigPanda Profile section:
```javascript
[
  ['Industry', 'AIOps / IT Operations Management'],
  ['Founded', '2012'],
  ['Headquarters', 'Mountain View, CA'],
  ['Cloud Provider', 'AWS primary; multi-region for enterprise customers'],
  ['AI Maturity', 'High, generative AI for RCA, agentic incident automation, ML-based event correlation. "Pragmatic AI" branding emphasizes transparent + testable models.'],
  ['Valar Status', 'Signed Design Partner (per PVP V Memo)']
]
```

Patterns:
- **Values are sentences when the field needs nuance**, not always single-word answers. "AI Maturity" is `'High, generative AI for RCA, agentic incident automation...'` not just `'High'`. The sentence is the evidence for the rating.
- **The last row is always the founder-relationship status** ("Valar Status: Signed Design Partner" or "Valar Status: Named Pipeline" or "Valar Status: Stretch ICP, not yet contacted"). This anchors every card in its position relative to the founder's GTM.
- **Cite source materials inline** when the claim is non-obvious. V1 cites "(per PVP V Memo)" or "(estimated from technology investment and transaction volume)", the parenthetical citation lets the user trust the claim.

V1 BigPanda Opportunity section:
```javascript
[
  ['Use Cases', 'Autonomous incident correlation (80%+ alert noise reduction claim), generative RCA + dynamic incident titles, agentic remediation suggestions, AI Incident Prevention for change management'],
  ['Current Stack', 'Cleans/normalizes/correlates events → applies ML/LLM. Active development with Valar on BYOC inference layer for production workloads.'],
  ['Pain Points', 'Customer infrastructure data is restricted contractually, multi-tenant inference clouds disqualified. AIOps margins compress as AI compute grows.'],
  ['Estimated Spend', '$1.5–3M annual inference (mid-market wedge profile)']
]
```

Patterns:
- **Estimated Spend always has a range, never a point estimate.** "$1.5–3M annual inference" is honest about uncertainty; "$2.3M" pretends to precision the data doesn't support.
- **Estimated Spend always tags the segment context**, "(mid-market wedge profile)" or "(enterprise scale profile)" tells the user how the estimate was derived.
- **Pain Points uses contractual/business language**, not technical jargon. "Multi-tenant inference clouds disqualified" is the buyer's framing. "Lacks fine-grained scheduling primitives" is the founder's framing, wrong for this field.

V1 BigPanda GTM Strategy section:
```javascript
[
  ['Approach', 'Already executed land. Focus = co-develop joint case study (cost reduction %, SLO improvement, deployment friction) for use in landing peer AIOps/observability accounts.'],
  ['Key Evidence', 'Signed design partner status. Public AI/agentic AIOps positioning at scale. Reference customer commitments under SOC 2 + ISO 27001.'],
  ['Urgency Level', 'EXECUTE, already a customer; priority is reference-account development.'],
  ['Target Buyer', 'Buyer: Platform Engineering / Site Reliability leadership. Champion: Product/Eng leaders shipping the agentic AIOps capabilities.'],
  ['Messaging Angle', 'Reliability + cost. Lead with: "Production-grade BYOC inference proven by AIOps customer cohort", establishes the category proof point.']
]
```

Patterns:
- **Urgency Level uses uppercase action verbs**: EXECUTE / HIGH / WARM / MED / COLD / DEFER. The verb is the priority.
- **Target Buyer always splits Buyer + Champion** when both are knowable. Buyer = decision-maker. Champion = internal advocate.
- **Messaging Angle includes a quoted opening line**, "Lead with: '[exact line]'", gives the user something usable for outbound.

### 9.9 `ROW_SOURCES`, every numeric or specific claim cites

The `ROW_SOURCES` dictionary is keyed by `'CompanyName|SectionTitle|RowLabel'`. Every fact in the sections table that has a specific number, named source, or claim that could be challenged should have a corresponding ROW_SOURCES entry. V1 example:

```javascript
"Walmart|Company Profile|Industry": "Walmart 2025 10-K Filing, SEC EDGAR",
"Walmart|Company Profile|Revenue": "Walmart FY2025 Annual Report, $648B revenue",
"Walmart|Company Profile|Cloud Provider": "Walmart Global Tech blog, 'Our Hybrid Cloud Journey', Nov 2024",
"Walmart|Company Profile|AI Maturity": "Walmart Global Tech keynote, CES 2025, generative AI across supply chain",
```

Patterns:
- **Source citation includes the publication and approximate date.** "Walmart 2025 10-K Filing, SEC EDGAR" is good. "Walmart website" is bad, too vague to verify.
- **Webset returns sources inline within text fields** (pattern: `fact text | URL / fact text | URL`). Parse these out and convert each `(fact, URL)` pair into a `ROW_SOURCES` entry keyed appropriately.
- **It's better to have empty ROW_SOURCES than wrong ones.** If you couldn't trace a claim's source, leave the entry blank or out, never invent a citation.

### 9.10 `CONTACT_MAP`, keyed exactly to company name

```javascript
const CONTACT_MAP = {
  'BigPanda': [
    { name: 'Jane Doe', title: 'VP Platform Engineering', linkedin: 'https://linkedin.com/in/...', primary_connection: 'Alex' }
  ],
  ...
}
```

Patterns:
- **Key string MUST match `SEGMENTS[].companies[].name` character-for-character**, including parentheses, capitalization, and any qualifiers. If the segment company is `'General Motors (Cruise)'`, the CONTACT_MAP key is `'General Motors (Cruise)'`, not `'GM'`, not `'General Motors'`.
- **`primary_connection` is the Primary teammate who has the warm intro** if any. Pull from CONTEXT.md's "Primary Network Connections" table. Empty string `''` if no warm path exists.
- **Persona discipline**: V1 contacts skewed heavily to platform/infrastructure leadership. Almost no ML eng leaders, no security/governance unless they were the platform owner, reflecting Tom's antagonist warning.

### 9.11 The "tier" decision

`tier` is `'high'`, `'med'`, or `'low'`. The visual implication: high = bold border, med = standard, low = muted/dashed. The data implication: how confident the user should be that this is a great prospect.

V1 distribution across 30 companies: roughly 10 high, 12 med, 8 low. The mix matters, if everything is `'high'`, tiers carry no information.

V1 logic:
- **`'high'`**, Either (a) signed/in-pipeline AND all 4 axes ≥4, or (b) named-pipeline with strong-signal warm intro available
- **`'med'`**, Strong ICP fit but at least one axis is moderate, or warm intro is shallow
- **`'low'`**, Speculative; pattern matches the ICP but no direct evidence + no warm path

When in doubt, err toward `'med'`. `'high'` is a promise, if a `'high'` company doesn't bear out under scrutiny, the dashboard's credibility erodes.

---

## 10. The "wow" signal

### What it does
Not a section in the dashboard, it's a guiding principle. The kickoff captures "what would make this founder light up?" and the build skill should *foreground that data* throughout the dashboard.

### Example
For Valar, the "wow" was: showing companies that have explicitly tried inference clouds and been blocked by security/residency. So the dashboard surfaces those quotes prominently in `RESIDENCY_MAP[].reason` and in `gtm_thesis` paragraphs.

For a different founder, the wow might be: "show me companies where the CFO has called out our problem on an earnings call." Then earnings call quotes should be plastered through `signals[]` and `opp_reason`.

### Where to surface it
- `gtm_thesis` paragraph (highest visibility)
- `signals[]` bullets (axis 3 supporting evidence)
- `opp_reason` (axis 3 tooltip)
- `overview` paragraph
- A dedicated tag if it's binary ("CFO Mentioned It," "Quoted in Press")

If the wow signal is real and well-sourced, it should be visible from any angle the user looks at the dashboard.

---

## 11. The Build Notes output

### What it is
A short markdown file (`BUILD_NOTES.md`) that documents the structural decisions you made for this project. Generated by the build skill alongside the dashboard.

### Why it matters
- Lets the user audit your decisions in one place ("oh, you renamed axis 2 to 'Compliance Burden' because of HIPAA, that's right").
- Makes future iterations easier (when the user comes back and asks "why is the dashboard structured this way?", the answer is in this file).
- Lets the user delegate the project to a teammate who didn't run the build.

### What to include
- Signal axis labels chosen + 1-sentence justification for each.
- Segments chosen + why (kept default? deviated? for what reason?).
- Sections per company + why.
- Features dropped (Network view? Hiring sub-score?) + why.
- Notable creative decisions on copy (e.g., "leaned on Tom's quote about BYOC being 'inevitable' three times across the dashboard because that's the strongest piece of voice in CONTEXT.md").

See `BUILD_NOTES_TEMPLATE.md` for the fillable shell.

---

## 12. Designing Webset enrichments for this template

The Build skill creates an Exa Webset to populate the dashboard. Each enrichment description you submit to the Webset becomes a column of data that maps to one or more data.js fields. Get this design right and population is mechanical; get it wrong and you'll have blank columns or garbage data.

### Field-by-field guidance

**Company Profile rows**, short, factual. Use `format: "text"` for most; `format: "options"` for cloud provider (controlled vocabulary).
- "Industry classification" → free text
- "Most recent annual revenue in USD" → text (e.g., "$648B (FY2025)")
- "Headquarters city and state/country" → text
- "Primary cloud provider" → options: AWS / GCP / Azure / Multi-cloud / On-premise / Other
- "AI maturity level (high/medium/low) with one-sentence supporting evidence" → text

**Opportunity rows**, vertical-specific. THIS IS WHERE TAILORING MATTERS MOST. Phrasing the enrichment description in the founder's domain language gets dramatically better data.
- Bad: "Use cases at this company" → returns generic "uses AI for things"
- Good (Valar): "Specific inference workloads at this company that involve heterogeneous accelerator routing or sub-50ms latency requirements" → returns concrete production AI workloads
- Good (healthcare workflow): "Documented manual prior authorization, denial management, or RCM workflow bottlenecks at this company"

**Signal scoring inputs**
- "Top 3 buying signals from earnings/blog/press in last 12 months" → maps to `signals[]`
- "Regulatory or contractual constraints affecting deployment choices" → maps to `residency_signals[]` + drives axis-2 score
- "Recent funding events, leadership changes, or strategic announcements (last 6 months)" → drives axis-3 score (Buying Trigger)

**Job postings**
- "Up to 5 active job postings relevant to [vertical] with title, key technologies, and URL" → maps to `JOB_LISTINGS[<company>]`
- The `[vertical]` part is critical. For Valar it's "inference, MLOps, or AI platform engineering." For a healthcare workflow founder it's "RCM, prior auth, healthcare engineering." Generic "AI/ML jobs" is wrong.

**Contacts**, optional via Webset; can also be done via Lovelace post-Webset.
- If using Webset: "Top 2 likely buyers/champions at this company with role and LinkedIn URL"
- The persona phrasing matters. "Buyers/champions" returns leadership; "decision makers" returns C-suite; "platform owners" returns specific functional leads. Tune to who actually buys for this founder.

**Sources**
- "5 high-quality verifiable URLs supporting the above (SEC filings, engineering blogs, press)" → maps to `COMPANY_SOURCES[<company>]`
- Specifying source types (SEC, engineering blogs, press) raises quality vs. just "URLs."

### Best practices for enrichment design

1. **Tailor every enrichment description to the founder's vertical.** Don't reuse Valar's enrichment descriptions for a healthcare or fintech founder. Re-write each one in the founder's domain language.
2. **Specify the format you want.** "Annual revenue" returns formatted strings; "annual revenue in USD as a number" returns numbers (use `format: "number"` for these).
3. **Name expected source types.** "Per the company's SEC filings or engineering blog" raises quality vs. unspecified.
4. **Limit enrichments to 8–12 per Webset.** More enrichments = longer processing time. If you have more fields you want, run a follow-up `createEnrichment` on the existing Webset rather than overloading the initial submission.
5. **Use `options` format for controlled-vocabulary fields.** Cloud provider, funding stage, AI maturity level, anything where you want one of N values.
6. **Avoid subjective enrichments.** "Is this company a strong fit" returns garbage. "What are the documented use cases that match the founder's product" returns specifics.

### Adapting the Valar enrichment list to a new vertical

Take Valar's enrichment list (from the build skill prompt) as a starting point. For each line item:

- Is it generic (revenue, HQ, cloud)? **Keep as-is.**
- Is it vertical-specific (use cases, pain points, current stack)? **Rewrite using the new vertical's language.**
- Is it tied to Valar's specific axes ("inference cost," "data residency")? **Rewrite to match the new axes** you chose in the signal-axis decisions.

Document your enrichment list in `BUILD_NOTES.md` so the user can audit and the Webset can be re-run later for refresh.

---

## 13. Things you can change but probably shouldn't

These are technically configurable but the defaults are tuned. Don't touch unless you have a specific reason.

- **The 0–5 axis scale.** Tested for legibility (5 dots feels right; 7 feels cluttered, 3 feels coarse).
- **The 0–100 total score formula.** (sum of 4 axes × 5). Linear and explainable. Don't introduce weights without documenting them.
- **The CSS color palette.** Tuned for the editorial-industrial aesthetic. If the founder has a brand, swap the accent variable (`--purple` family) but don't touch the structural colors.
- **The card grid layout.** Responsive breakpoints are tuned for 13" / 15" / 27" displays.

---

## 14. Things you should always change

- The product name (`{{PRODUCT_NAME}}`).
- The signal axis labels (almost always, see Section 3).
- The opportunity section title (`{{OPPORTUNITY_SECTION_TITLE}}`).
- The hiring keyword regex.
- The tab labels (if your segment IDs differ from default).
- The placeholder companies (Acme, Beta, Gamma, Delta, Epsilon).
- All `[REPLACE]` and `{{PLACEHOLDER}}` strings.
- **The Webset enrichment descriptions**, generic descriptions get generic data. Tailor every one to the founder's vertical and language. See Section 12.
