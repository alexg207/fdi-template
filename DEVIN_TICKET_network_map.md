# Devin ticket — FDI dashboard: visual Network Map tab

## What you're building
Replace the FDI dashboard's existing **Network** tab (a plain two-pane list, currently fed by fabricated data) with a **visual, interactive network map** — modeled on the Lyric Network Map — powered by REAL Affinity relationship data that the build pipeline now provides in `window.NETWORK_DATA`.

The dashboard shows a VC (Primary) which ICP companies to pursue. This tab answers: **"who at Primary can open the door to each company, and how warm is that path."** Every ICP company has its own set of warm paths (Primary person → contact at/near the company, strength-scored).

## Scope + guardrails (read first)
- Repo: **fdi-template**, branch **`network-map`** (already checked out). Open your PR **against `network-map`**, NOT `main`. Never push to main.
- Do NOT touch the engine, workflows, or any other repo. This is a single-file front-end task in `index.html` (+ its inline CSS/JS) plus loading `network-data.js`.
- This is a **single-file vanilla-JS app** (`index.html` + `data.js` + now `network-data.js`), no framework, no build step, served static. WARNING: a duplicate top-level `const`/`var`/`function` declaration silently kills the ENTIRE inline script (blank page, no console error). Keep new top-level names unique; prefer wrapping your code in a function/IIFE.

## The data you consume: `window.NETWORK_DATA`
`network-data.js` is already in the repo (a committed SAMPLE; the engine overwrites it per-build with real data). Load it with `<script src="network-data.js"></script>` alongside `data.js`. Shape:

```js
window.NETWORK_DATA = {
  schema_version: 1,
  generated_at: "2026-07-15T00:00:00.000Z",
  hub: "Primary",
  build_status: "ok",              // "ok" | "partial" | "unavailable"
  summary: {
    companies_total: 4,
    companies_with_path: 2,
    coverage_pct: 50,
    total_relationships: 181,
    primary_connectors: ["Brian Schechter","Cassie Young","Doug Kessler","Nick Daley","Tobias Citron"]
  },
  companies: [
    {
      company: "Datadog",          // matches a company name in data.js SEGMENTS (join key)
      domain: "datadoghq.com",
      affinity_id: 224026487,
      affinity_name: "Datadog",
      status: "resolved",          // "resolved" | "no_relationships" | "not_found" | "error"
      total_paths: 134,            // real total in Affinity
      shown_paths: 4,              // number in paths[] (capped at 25)
      best_score: 97,
      paths: [
        {
          connector: "Tobias Citron",        // Primary person (the warm path)
          connector_id: 22505167,
          connector_email: "tobias@primary.vc",
          contact_name: "Emilio Escobar",    // person at/near the target company
          contact_id: 151248152,
          contact_email: "emilio.escobar@datadoghq.com",
          contact_title: "Chief Information Security Officer",
          contact_affiliation: "Datadog",    // their CURRENT org (may differ from target)
          at_target_company: true,           // affiliation === target company? (false = investor/alum/other)
          seniority: "C-Level",
          linkedin_url: "https://www.linkedin.com/in/emilioesc/",
          type: "interaction",               // "interaction" | "linkedin"
          has_interaction_data: true,
          score: 97,                          // 0-100 warmth; NULL for type "linkedin"
          linkedin_connected: false,
          last_contact: "2026-07-09",         // person-level recency (may be null)
          enrichment_status: "ok"             // "ok" | "failed" | "skipped"
        }
        // ...up to 25, sorted strongest-first
      ]
    }
    // companies with status "no_relationships"/"not_found"/"error" have paths: []
  ]
};
```

Field notes that MUST drive the UI:
- **score** is 0-100 warmth. `type:"linkedin"` paths have `score:null` (LinkedIn-only, no interaction history) — render them visually distinct (e.g. dashed edge, muted) and NEVER as a high-warmth path.
- **at_target_company:false** means the contact is an investor/alum/other, not an employee — badge their real `contact_affiliation` so it's honest (e.g. "Partner @ Cardumen Capital", not implied to work at the target).
- Handle every company `status`: `resolved` (draw the map), `no_relationships` (resolved but Primary knows no one — show a clean "no warm paths yet" state), `not_found` (couldn't resolve — minor/hidden), `error`.
- Handle `build_status`: `unavailable` (no data — show an explanatory empty state for the whole tab, don't error), `partial` (some companies errored — still render the rest).

## What to build (the visual)
A network map in the spirit of the Lyric Network Map (see reference below): 
1. **Overview**: all ICP companies with warm paths, most-connected first. A visual graph is the centerpiece — e.g. Primary connectors as hub nodes, companies/contacts as spokes, edge thickness/color = warmth score. Pick the layout that reads best (per-company mini-graphs, or one graph with a company selector — your call, make it feel like Lyric).
2. **Per-company detail**: select a company → see its paths as a graph (connector → contact edges) AND a ranked list: contact name, title, affiliation badge, seniority, warmth score (as a %), LinkedIn link, last-contact recency, and which Primary person is the path.
3. **Summary strip**: coverage (`companies_with_path`/`companies_total`), total relationships, the set of Primary connectors in play.
4. Search/filter companies; sort by warmth. Empty/degraded states per above.

## Reference implementation (reuse, don't reinvent)
- **Graph rendering**: `~/network-graph-template/web/index.html` has an SVG network graph (`drawGraph()`, `#svg`/`#zoom`, pan/zoom, warmth-colored nodes/edges, legend). Its data shape (`accounts[].paths[]` with connector/contact/warmth) is deliberately close to ours — adapt its graph code. Its warmth color scale: `--warm-hi hsl(152 60% 50%)` / `--warm-mid hsl(38 95% 58%)` / `--warm-lo hsl(220 10% 52%)`.
- **Design system**: match THIS repo's tokens (light theme, per-build accent), NOT network-graph-template's dark theme. Use the existing `index.html` CSS vars: `--surface`, `--border`, `--text`/`--text-muted`/`--text-faint`, the `--green` accent ramp, `--q-high/med/low` tier colors, `--font`/`--font-mono`. The tab must look native to the dashboard.

## Also do
- Add `<script src="network-data.js"></script>` after `data.js` in `index.html`.
- Remove the fabrication: `index.html` currently assigns a RANDOM `PRIMARY_TEAM` member as a "possible" intro when a contact has no mapped connection (~line 723, `PRIMARY_TEAM[Math.floor(Math.random()*...)]`). Remove that — no invented relationships anywhere. The new tab is driven solely by `window.NETWORK_DATA`.
- Keep the other tabs (All / Pipeline / Mid-Market / Enterprise / detail view) working exactly as before.

## Acceptance criteria (check each before opening the PR)
1. `index.html` loads `network-data.js`; the Network tab renders from `window.NETWORK_DATA` only.
2. With the committed sample: Datadog + Ramp show visual paths; Brex shows a "no warm paths" state; Northwind AI (not_found) is hidden/minimal. Coverage strip reads 50% / 2 of 4.
3. Warmth shown as %; `type:"linkedin"` (null score) paths visually distinct and not ranked as warm.
4. Investor/alum contacts (`at_target_company:false`, e.g. the Cardumen Capital partner under Datadog) are badged with their real affiliation.
5. `build_status:"unavailable"` and `"partial"` render sane states (test by temporarily editing the sample).
6. No fabricated/random intros remain anywhere in the code.
7. Visual quality bar: looks like it belongs next to the Lyric Network Map — polished, on the dashboard's theme. No console errors. Other tabs unaffected.
8. Open the page from `file://` and confirm it renders (static, no server).

## Out of scope
Engine/pipeline, live Affinity calls, any write actions, "request intro" backend. Front-end rendering of the provided data only.
