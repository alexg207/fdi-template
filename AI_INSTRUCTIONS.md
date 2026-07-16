# AI_INSTRUCTIONS.md — Pointer to SKILL.md

**This file is intentionally short.** The authoritative operating manual is SKILL.md in the [generate-fdi-draft skill repo](https://github.com/alexg207/fdi-draft-skill), not this file. Earlier versions of `AI_INSTRUCTIONS.md` carried full process and style rules; that content has all moved to SKILL.md and is maintained there.

If you're reading this from a per-build clone of `fdi-template/`, your skill source of truth is the SKILL.md you invoked the skill from. Trust SKILL.md over any guidance in this file.

---

## What this file is for

Pointers from the template repo back to the canonical sources of truth.

## Sources of truth

- **The 11-phase process (Phase 0 through 10):** SKILL.md
- **The 14 Output Style Rules** (em dashes, placeholders, banned tags, locked field sets, source quality hierarchy, gtm_thesis durability, reference-build-as-scaffolding, etc.): SKILL.md
- **The Interaction Model** (one question at a time, auto-proceed on minor decisions, hard STOP at Phase 0a-b / 6f / 6i): SKILL.md
- **The 15 Phase 7 self-check items:** SKILL.md
- **The Reference Build appendix (V2 May 5 failure modes F1-F10):** SKILL.md
- **Field-by-field craft patterns** (subtitle shape, gtm_thesis shape, axis trios, etc.): TEMPLATE_GUIDE.md Section 9 in this repo
- **Schema structure** (SEGMENTS / CONTACT_MAP / RESIDENCY_MAP / JOB_LISTINGS / COMPANY_SOURCES / ROW_SOURCES / PRIMARY_TEAM): see `data.js` in this repo for the placeholder skeleton

## What's IN this template repo

- `data.js` — schema-commented placeholder. The placeholder companies demonstrate the data shape, NOT the writing patterns. Apply the writing patterns from TEMPLATE_GUIDE Section 9, not the placeholder companies' content.
- `index.html` — dashboard renderer. Hardcoded inference-vertical strings exist; SKILL.md Phase 8 enumerates what to find/replace.
- `landing.html` — OPTIONAL extra cover page, off by default (the walkthrough is the entry page).
- `build.html` — the scroll walkthrough, shipped as the build's `index.html` (the entry page). 100% generic; driven entirely by `build-data.js`. Copy VERBATIM — never edit its HTML/CSS/JS per founder.
- `build-data-template.js` — schema-commented shell for `build-data.js`, the cinematic's only founder-specific input. SKILL.md Phase 8c generates it.
- `assets/` — copy the WHOLE tree into the build repo (`cp -R template/assets/. assets/`): `logos/` (tool logos for the process act) AND `primary-lockup.svg` (used by the **walkthrough** `build.html` topbar/intro/network act — broken images there if missed; it has been missed on real builds). NOTE: the dashboard topbar no longer uses `primary-lockup.svg` — its partner mark is an inline Primary icon SVG + "Primary" text.
- `middleware.js` — edge Basic-Auth gate (fail-closed) so the deployed dashboard isn't public; the engine sets `FDI_DASHBOARD_PASSWORD` at deploy. Ships with every build; do not remove.
- `vercel.json` — `{"framework": null}` (static serving).
- `network-data.js` — FICTIONAL dev fixture ONLY. The engine OVERWRITES it per-build with real Affinity data (`fetch-affinity-network.mjs`, a workflow step after Phase 10). The skill never creates/copies/edits it; the Network + Contacts tabs degrade to designed empty states when it's absent.
- `TEMPLATE_GUIDE.md` — craft patterns extracted from the V1 Valar build. Section 9 is the field-by-field reference.
- `CONTEXT_TEMPLATE.md` — fillable shell for Phase 4 CONTEXT.md.
- `BUILD_NOTES_TEMPLATE.md` — fillable shell for Phase 9 BUILD_NOTES.md.
- `CLAUDE_DESIGN_PLAN_TEMPLATE.md` — older artifact; SKILL.md Phase 9 superseded its role.

## v3 defaults (required — baked into the template, do NOT regress)

The dashboard (`index.html`) ships these defaults. They already live in the template — the Phase-8 job is to NOT regress them, and fixes go upstream to `fdi-template`, never per build:

- **Dark default + light toggle.** `data-theme` dark tokens are the default; light is opt-in via the `toggleTheme()` button, persisted to the `{{PRODUCT_SLUG}}-theme` localStorage key.
- **Green / amber score color-coding — NO red.** Tier is two-tone: `co.tier = co._signal>=75?'high':'med'` (`--q-high` green / `--q-med` amber). Do not introduce a red/low tier in tier coloring.
- **"All" tab is the default view.** `state.tab` defaults to `'all'`; the `data-tab="all"` button is `active` on load.
- **Typography — DASHBOARD (index.html/dashboard.html):** **Space Grotesk** `--font-display` (product name + `.context-h1` headings), **Inter** for UI/body (`--font-mono` is intentionally repointed to Inter), **Newsreader** serif `--font-num` for prominent figures only (signal numbers, warmth scores, summary stats). **NO actual monospace anywhere** — never re-add JetBrains Mono to the dashboard font `<link>` or any `font-family`. (Lyric Network Map match, 2026-07-16.) The old Ember mono-for-data rule now applies ONLY to `build.html` (walkthrough) + `landing.html`.
- **Ember color system.** Cool ink canvas + single accent ramp. Per-founder accent overrides go through `BUILD_DATA.founder.themeAccent` (cinematic) and the token block in the dashboard; never fork the palette ad hoc.
- **Network + Contacts tabs (data-driven, engine-owned).** Two extra tabs beyond the 3 segment tabs + All, driven solely by `window.NETWORK_DATA` (`network-data.js`, engine-generated post-build). Never edit their markup/JS per founder; never remove `<script src="network-data.js">`. They show designed empty states when the data file is absent.
- **Balanced headers.** `text-wrap:balance` on `.context-h1`/`.context-sub` (no orphaned single-word last line).
- **Uniform card heights.** `.card-grid` `align-items:stretch` + `grid-auto-rows:1fr`, `.card{height:100%}`.
- **Tab bar.** 17px/600 near-white; count pills are hidden by CSS (`display:none`) — do not "fix" them back on.
- **Partner mark.** Inline Primary icon SVG + "Primary" text sized to the product name — no `<img src="assets/primary-lockup.svg">` in the dashboard topbar.
- **Deploy gate.** `middleware.js` Basic-Auth + `{"framework":null}` `vercel.json` ship with the build; the engine deploys only the dashboard files (allowlist) and sets `FDI_DASHBOARD_PASSWORD`.

## The two standard pages

Every build ships: **index.html (the scroll walkthrough, two-beat founder opener) → dashboard.html.** File wiring:

1. Rename `index.html` (dashboard template) → `dashboard.html`
2. Copy `build.html` verbatim → the build's `index.html` + generate `build-data.js` (SKILL.md Phase 8c)

Walkthrough finale CTA + skip link → `./dashboard.html`. `landing.html` only on explicit request.

The landing's CTAs link to `./dashboard.html`, so the rename makes the links resolve. The landing introduces its own placeholders (in addition to the dashboard's):

- `{{POSITIONING_EYEBROW}}` — the one-line positioning eyebrow above the headline
- `{{PRODUCT_HEADLINE}}` — the hero headline describing what the founder's product does (may contain `<span class="accent">…</span>`)
- `{{STAT_1_VALUE}}`..`{{STAT_4_VALUE}}` and `{{STAT_1_LABEL}}`..`{{STAT_4_LABEL}}` — the four hero proof-stat cards
- `{{PRODUCT_TRANSITION_LEAD}}` — the lead-in sentence that pivots to the dashboard deliverable (the "Primary built {{PRODUCT_NAME}} a custom sales-intelligence dashboard" sentence stays intact)
- `{{ICP_DESCRIPTION}}` — the target-account noun phrase (e.g. "multi-rooftop dealer group")
- `{{MARKET_SIZE_PHRASE}}` — the full-universe size phrase (e.g. "18,000 cold names")
- `{{BUYER_ROLE}}` — the named buyer role per account (e.g. "fixed-ops buyer")
- plus the shared `{{PRODUCT_NAME}}`, `{{PRODUCT_LOGO_SVG}}`, `{{AXIS1_LABEL}}`, `{{AXIS2_LABEL}}` (the `Buying Trigger` and `Hiring` axis names are generic, not placeholders).

## When this file gets out of date

If SKILL.md has a rule that contradicts this file, SKILL.md wins. This file is best-effort; SKILL.md is the spec.

If you're updating SKILL.md and changing process flow, you don't need to update this file unless the *file inventory above* changes (e.g., adding a new template file or removing one).
