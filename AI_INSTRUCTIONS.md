# AI_INSTRUCTIONS.md — How Claude Should Use This Template

**Audience:** Claude (running the `fdi-build` skill).
**Goal:** Produce a 90% solution dashboard for a specific founder's FDI motion by combining their `CONTEXT.md`, enriched company data, and this template.

Read this file in full before generating output. The TEMPLATE_GUIDE.md contains structural decision logic; this file is your operating manual.

---

## What you're producing

Three files, customized for the founder:

1. **`CONTEXT.md`** — Their research dump (already exists from kickoff, you may extend it).
2. **`data.js`** — A populated version of the schema in this repo's `data.js`.
3. **`index.html`** — The template HTML with branding swapped, signal labels updated for the founder's vertical, and the JS hiring-keyword regex tuned.

These three files together render an interactive dashboard. The user previews locally (open `index.html` in a browser) and iterates with you on copy/structure/data.

---

## Inputs you have

- **`CONTEXT.md`** from the kickoff skill — founder background, ICP, signals, voice quotes, named lookalikes, sources.
- **Enriched company data** from Exa — company profiles, contacts, news, hiring, etc.
- **This template repo** — `index.html`, `data.js`, `CONTEXT_TEMPLATE.md`, `CLAUDE_DESIGN_PLAN_TEMPLATE.md`, `TEMPLATE_GUIDE.md`, `AI_INSTRUCTIONS.md` (this file).
- **The reference example** — `github.com/alexg207/valar-fdi` — the gold-standard finished project. Study it for tone, density, and how a fully populated dashboard reads.

---

## You are encouraged to deviate

This is the most important rule in this file. **The template is a strong default, not a prescription.** The reason templates degrade quality is that LLMs over-anchor on examples. You have explicit permission — and a responsibility — to deviate when the founder's vertical demands it.

Specifically, you SHOULD:

- **Rename signal axes** to fit the vertical. "Inference Pain" and "Data Residency" are Valar-specific. For a healthcare workflow company, axis 1 might be "Workflow Pain" and axis 2 might be "Compliance Burden." For a B2B SaaS replacement, axis 1 might be "Incumbent Pain" and axis 2 might be "Switching Cost." See TEMPLATE_GUIDE.md → "Adapting Signal Categories."
- **Add or remove segments.** Default is Pipeline + Mid-Market + Enterprise. If the founder is pre-pipeline, drop the Pipeline segment. If they have only one ICP, collapse to a single segment. If they have geographic segmentation, add it.
- **Add or remove sections within a company card.** Default is "Company Profile / Opportunity / GTM Strategy." A marketplace founder might need a "Transaction Volume" section. A consumer founder might need "Audience Demographics." Add sections that serve the thesis; remove sections that read as filler.
- **Skip features that don't apply.** The Network view (warm-intro mapping) only matters if the founder cares about warm intros. The Hiring sub-score only matters if job postings are a leading indicator in this vertical. If they're not, drop them.

You should NOT deviate on:

- The 4-axis signal scoring math (pain + residency + trigger + hiring, each 0–5, summed × 5 = 0–100). The arithmetic is generic. Only the labels change.
- The data shape of `SEGMENTS[].companies[]`. Renaming or restructuring fields will break the HTML.
- The CSS design system. The visual language is intentional and tuned. Modify copy and structure, not type/color/spacing.

---

## Process

Run these phases in order. Do not skip ahead.

### Phase 1 — Read everything

Before you write anything:

1. Read `CONTEXT.md` end-to-end. Extract: founder voice (verbatim quotes), ICP definition, named lookalikes, the "wow" signal, exclusions.
2. Read this file (`AI_INSTRUCTIONS.md`) and `TEMPLATE_GUIDE.md` in full.
3. Read this template's `index.html` and `data.js` to understand the structure you're filling.
4. Skim the Valar reference repo if you have access, especially its `data.js` SEGMENTS structure and its CONTEXT.md tone.
5. Review the Exa enrichment output. Identify what data is strong, what's thin, what's missing.

### Phase 2 — Make structural decisions

Before writing data, decide and write down (in scratch or in `CLAUDE_DESIGN_PLAN.md`):

- **Signal axis labels.** Axis 1 (replaces "Inference Pain") = ?. Axis 2 (replaces "Data Residency") = ?. Justify each in 1 sentence based on the founder's vertical.
- **Segments.** How many? Which? Why?
- **Sections per company.** Default is 3. Are you keeping all 3? Renaming? Adding any?
- **Features to skip.** Network view: keep or drop? Hiring sub-score: keep or drop?
- **Hiring keyword regex update.** What technologies/keywords define "this is a real signal" for this vertical? (For Valar: `inference|llm|triton|tensorrt|sglang|vllm`. For your founder: ?)

If you're unsure on any of these, ASK THE USER. Better to clarify than to invent.

### Phase 3 — Populate data.js

For each company from the Exa enrichment:

1. Pick the right segment (Pipeline / Mid-Market / Enterprise / your custom segments).
2. Set `tier` based on signal strength: 'high' if all 4 axes are 4+, 'med' if mixed, 'low' if speculative.
3. Fill the 3 sections (Company Profile / Opportunity / GTM Strategy or your renamed equivalents). Be SPECIFIC. Generic placeholders read as filler. Use exact numbers, exact technologies, exact quotes from the source.
4. Score the 4 axes 0–5 with a one-paragraph reason for each. The reason is how the user evaluates whether the score is calibrated.
5. Write `gtm_thesis` in the founder's voice, using their language from CONTEXT.md. This is the most important field — it's what differentiates the demo.
6. Populate CONTACT_MAP, COMPANY_SOURCES, JOB_LISTINGS, RESIDENCY_MAP with real data from Exa or your research.

### Phase 4 — Customize index.html

1. Replace `{{PRODUCT_NAME}}` with the founder's product name throughout.
2. Replace `{{PRODUCT_SLUG}}` with a lowercase-dash slug (e.g., "valar" → "valar-intros" Slack channel).
3. Replace `{{OPPORTUNITY_SECTION_TITLE}}` (in `data.js`) and the matching tooltip strings in `index.html` with vertical-appropriate labels.
4. Update signal axis labels (search for "Inference Pain", "Data Residency" in the script section — see the comment block at the top of `<script>`).
5. Update the hiring keyword regex in `computeJobSignal()` to match your vertical's signal keywords.
6. Update the tab labels if your segment IDs/labels changed in `data.js`.

### Phase 5 — Write the design plan

Fill in `CLAUDE_DESIGN_PLAN.md` from the template. This documents WHY you made the decisions you made — invaluable for the user reviewing your output and for future iterations.

### Phase 6 — Self-check before delivery

Run through this checklist:

- [ ] Every company has a real `gtm_thesis`, not a placeholder
- [ ] Every section has specific numbers/quotes/sources, not "[X]"
- [ ] Signal axis labels are vertical-appropriate, not "Inference Pain"
- [ ] All `{{PLACEHOLDER}}` strings are replaced
- [ ] At least one `tags` chip per company has `c: 'brand'` for relationship tags (drives the accent color)
- [ ] CONTACT_MAP keys exactly match `SEGMENTS[].companies[].name` (mismatch = silent UI bug)
- [ ] The dashboard's tab labels match the founder's natural language (not "Pipeline / Mid-Market / Enterprise" if their world has different segments)
- [ ] Hiring keyword regex reflects this vertical's tech stack
- [ ] The `gtm_thesis` paragraphs sound like the founder, not like Claude

If any check fails, fix it before delivering.

---

## Style rules for output copy

- **Specificity beats fluency.** "$2–5M annual inference spend" > "significant inference spend." Use numbers from CONTEXT.md and Exa whenever possible.
- **Founder voice in `gtm_thesis` and `overview`.** Splice verbatim quotes from CONTEXT.md transcripts. The dashboard should sound like the founder, not like Claude.
- **Avoid filler hedges.** No "may," "could," "potentially," "possibly" unless you genuinely don't know. If you don't know, say "needs verification" — that's more useful.
- **No marketing language.** No "innovative," "cutting-edge," "transformative," "synergies." This is an investment-quality intelligence dashboard, not a sales deck.
- **Cite sources inline** in `ROW_SOURCES`. Every numeric claim should have a source string.

---

## When in doubt

Look at how Valar's repo handled the same situation. If your output doesn't match Valar's tone/density/specificity, you've under-delivered. If your output is more generic than Valar's, you've under-delivered. If your output diverges from Valar's structure for a good vertical-specific reason, you've nailed it.

The goal is 90%. The user's job is the last 10% — picking the cleanest 5 companies to feature first, fine-tuning the narrative, hand-correcting any data errors, polishing the visual. Your job is to make that last 10% feasible in 30 minutes instead of 30 hours.
