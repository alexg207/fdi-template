# TEMPLATE_GUIDE.md — Structural Decisions for FDI Dashboards

**Audience:** Claude (running the build skill) and humans reviewing the template.
**Purpose:** For each structural element of the dashboard, this doc tells you **what it does, when to use it, when to skip it, and what data it requires.**

If `AI_INSTRUCTIONS.md` is the operating manual, this is the reference encyclopedia. Consult it whenever you're making a "should this section be here?" decision.

---

## 1. Segments (top-level tabs)

### What it does
Each segment becomes a top-level tab on the dashboard (Active Pipeline, Mid-Market, Enterprise, etc.). Companies belong to exactly one segment.

### Default segments (Valar pattern)
- **Active Pipeline** — Signed design partners + named pipeline accounts.
- **Mid-Market** — Stage 1 ICP, near-term targets.
- **Enterprise** — Stage 2 ICP, stretch targets.

### When to use the default
- Founder has signed design partners or named pipeline accounts AND a clear two-stage ICP (now / later).
- The "Stage 1 vs Stage 2" framing maps cleanly onto company size.

### When to deviate
- **Pre-pipeline founder** — Drop the Pipeline segment entirely. Two-segment dashboard (Mid-Market + Enterprise) is fine.
- **Single ICP founder** — Collapse to one segment. The tabs become irrelevant; show a single landing.
- **Geographic segmentation matters** — Replace size-based segments with geo (NAM / EMEA / APAC).
- **Vertical segmentation matters** — Replace with vertical buckets (Healthcare / Fintech / Retail). Especially common when the founder's wedge cuts across company sizes within each vertical.

### What data it requires
- Each segment object needs: `id`, `label`, `eyebrow`, `title`, `desc`, `companies[]`, plus the icon SVG.
- Companies in a segment all share the schema (so they render in the same card grid).

---

## 2. Sections within a company card

### What they do
The detail view of each company is divided into sections. Default 3:

1. **Company Profile** — Industry, revenue, HQ, cloud provider, AI maturity. Static facts.
2. **{Opportunity} section** (default name: "Inference Opportunity") — Use cases, current stack, pain points, estimated spend. The "why this account fits the thesis" content.
3. **GTM Strategy** — Approach, key evidence, urgency, target buyer, messaging angle. The "how to actually go win this account" content.

### When to keep all three
- The founder is selling into infrastructure, platform, or technical buyers.
- You have enough research depth to populate all three meaningfully.

### When to deviate
- **Add a "Competitive Landscape" section** — When the company is currently using a specific competitor and the wedge is replacement.
- **Add a "Workflow Map" section** — For workflow-automation founders, walking through the current process.
- **Add a "Decision Unit" section** — For enterprise sales motions where 5+ stakeholders are involved.
- **Drop the Opportunity section** — If the value prop is so obvious it doesn't need a section (rare).
- **Rename the Opportunity section** — Almost always do this. "Inference Opportunity" is Valar-specific. Try: "Workflow Opportunity," "Replacement Opportunity," "Automation Opportunity," "[Founder Product] Opportunity."

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
| `signal_score` | Buying Trigger | Time-bound reason this account is winnable NOW (earnings comments, hiring spikes, partnerships, RFPs) | Usually keep "Buying Trigger" — it's generic enough. Optionally: "Timing Signal," "Window Now." |
| `hiring` (computed) | Hiring | Validation that this company is staffing up against the problem | Usually keep "Hiring." Optionally: "Investment Signal" or rename to whatever the leading-indicator job category is for this vertical. |

### How to make the swap

For each project, you (Claude) need to:

1. **Decide the labels** based on the vertical and the founder's language.
2. **Update `index.html`** — search for the label strings in `buildScoreTips()` and section headers (see the giant comment block at the top of `<script>`).
3. **Update the hiring keyword regex** in `computeJobSignal()` to match your vertical. Valar's regex catches inference-related keywords; yours should catch your vertical's leading-indicator job titles/skills.
4. **Document the choice** in `CLAUDE_DESIGN_PLAN.md` so the user understands why these labels.

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
- Network mapping is sparse — fewer than 5 mapped contacts across all companies makes the view feel empty.

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
- **'high'** — All 4 axes scored 4+. Or signed design partner. These are the founder's hottest opportunities.
- **'med'** — Mixed scores, generally 3+ on most axes. Real opportunity, needs more diligence.
- **'low'** — Speculative, weak signal, or stretch. Worth tracking, not pursuing.

Distribution sanity check: in a healthy 20-company dashboard, expect roughly 5–8 high, 8–10 med, 4–7 low. If everything is 'high', tiers are meaningless. If everything is 'low', the founder doesn't have an actionable list.

---

## 7. Tags

### What they do
Small chips below the company name. Three styling variants:
- `c: 'neutral'` — Gray. Industry/sector facts.
- `c: 'stack'` — Subtle highlight. Constraint or technology tag (the "why default solutions fail this company" tag).
- `c: 'brand'` — Founder's accent color. Reserved for tags that mark a relationship to the founder ("Design Partner," "In Pipeline," etc.).

### Pattern
- Always include 1 sector/industry tag.
- Include 1 stack tag if there's a specific compliance/data/technology constraint that explains why the founder wins.
- Include 1 founder-color tag if the company has a relationship to the founder (signed, in pipeline, prospect).

### Anti-pattern
- More than 5 tags makes the card noisy.
- Generic tags like "AI" or "Tech" — be specific. "AIOps" is a tag, "AI" is not.

---

## 8. The `gtm_thesis` field

### What it does
The single most important piece of copy on the dashboard. Renders as a paragraph at the top of each company card and again in detail view.

### What it should contain
- A 2–3 sentence narrative answering: "Why this company, why now, what's the wedge?"
- Founder voice — splice verbatim quotes from CONTEXT.md if possible.
- Buyer/champion call-out at the end ("**Buyer:** Director of Engineering, **Champion:** AI Platform Lead").
- Specific named accounts as references ("BigPanda is the canonical AIOps reference for the BYOC thesis. Land already executed — focus is on co-developing case study evidence...").

### What it should NOT contain
- Generic startup language ("disrupting the market," "category-defining").
- Hedges ("could potentially," "may benefit from").
- Marketing taglines.
- Anything that could be said about any company in this segment.

### Test
Strip the company name from the gtm_thesis. Could you swap any other company's name in and have it still make sense? If yes, it's not specific enough.

---

## 9. The "wow" signal

### What it does
Not a section in the dashboard — it's a guiding principle. The kickoff captures "what would make this founder light up?" and the build skill should *foreground that data* throughout the dashboard.

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

## 10. The Design Plan output

### What it is
A short markdown file (`CLAUDE_DESIGN_PLAN.md`) that documents the structural decisions you made for this project. Generated by the build skill alongside the dashboard.

### Why it matters
- Lets the user audit your decisions in one place ("oh, you renamed axis 2 to 'Compliance Burden' because of HIPAA — that's right").
- Makes future iterations easier (when the user comes back and asks "why is the dashboard structured this way?", the answer is in this file).
- Lets the user delegate the project to a teammate who didn't run the build.

### What to include
- Signal axis labels chosen + 1-sentence justification for each.
- Segments chosen + why (kept default? deviated? for what reason?).
- Sections per company + why.
- Features dropped (Network view? Hiring sub-score?) + why.
- Notable creative decisions on copy (e.g., "leaned on Tom's quote about BYOC being 'inevitable' three times across the dashboard because that's the strongest piece of voice in CONTEXT.md").

See `CLAUDE_DESIGN_PLAN_TEMPLATE.md` for the fillable shell.

---

## 11. Things you can change but probably shouldn't

These are technically configurable but the defaults are tuned. Don't touch unless you have a specific reason.

- **The 0–5 axis scale.** Tested for legibility (5 dots feels right; 7 feels cluttered, 3 feels coarse).
- **The 0–100 total score formula.** (sum of 4 axes × 5). Linear and explainable. Don't introduce weights without documenting them.
- **The CSS color palette.** Tuned for the editorial-industrial aesthetic. If the founder has a brand, swap the accent variable (`--purple` family) but don't touch the structural colors.
- **The card grid layout.** Responsive breakpoints are tuned for 13" / 15" / 27" displays.

---

## 12. Things you should always change

- The product name (`{{PRODUCT_NAME}}`).
- The signal axis labels (almost always — see Section 3).
- The opportunity section title (`{{OPPORTUNITY_SECTION_TITLE}}`).
- The hiring keyword regex.
- The tab labels (if your segment IDs differ from default).
- The placeholder companies (Acme, Beta, Gamma, Delta, Epsilon).
- All `[REPLACE]` and `{{PLACEHOLDER}}` strings.
