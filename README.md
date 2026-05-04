# fdi-template

A reusable template for Primary's FDI (Founder-Driven Intelligence) motion. Activates as the structural starting point for every new FDI dashboard project.

## What this is

The FDI motion has three steps:

1. **Research** — Capture the founder's vertical, ICP, signals, and voice (handled by the `kickoff-fdi` skill).
2. **Enrichment** — Find and enrich relevant company data (handled by Claude calling Exa).
3. **Build** — Combine research + enriched data + this template into an interactive HTML dashboard (handled by the `fdi-build` skill).

This repo is the starting point for step 3. It contains:

- A working template HTML dashboard with placeholder data that renders (open `index.html` in a browser to see).
- A schema-commented `data.js` that documents what data Claude needs to fill in.
- Two markdown guide docs that tell Claude (and you) how to use the template.
- Fillable shells for the two outputs: `CONTEXT.md` and `CLAUDE_DESIGN_PLAN.md`.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The dashboard template. CSS + JS intact from Valar; brand strings + signal labels are placeholders. |
| `data.js` | Schema-commented data layer. 5 placeholder companies in 2 segments to demonstrate shape. |
| `AI_INSTRUCTIONS.md` | **Read first.** The operating manual for Claude when running the build skill. |
| `TEMPLATE_GUIDE.md` | Reference encyclopedia. For each structural element: what it does, when to use, when to skip. |
| `CONTEXT_TEMPLATE.md` | Fillable shell for the founder research dump. Output of `kickoff-fdi`, input to build. |
| `CLAUDE_DESIGN_PLAN_TEMPLATE.md` | Fillable shell documenting the structural choices the build skill made for this project. |
| `README.md` | This file. |

## Reference example

The gold standard finished project is `github.com/alexg207/valar-fdi` (private — request access). When in doubt about tone, density, or how a populated dashboard should feel, study Valar.

## Usage

### From Claude (the build skill)
Claude reads `AI_INSTRUCTIONS.md` first, then this repo's other files, then produces a customized version of `index.html`, `data.js`, `CONTEXT.md`, and `CLAUDE_DESIGN_PLAN.md` for the specific founder.

### From a human
1. Run the `kickoff-fdi` skill to produce a `CONTEXT.md` for your founder.
2. Run the `fdi-build` skill, pointing at this template repo + the kickoff output.
3. Review the generated dashboard. Iterate on copy/structure as needed.
4. Deploy to Vercel (or wherever) and share with the founder.

## Local preview

```bash
git clone https://github.com/alexg207/fdi-template.git
cd fdi-template
python3 -m http.server 8080
# open http://localhost:8080
```

The placeholder data renders. You'll see "{{PRODUCT_NAME}}" and "Acme Corp" everywhere — that's expected. The build skill replaces these.

## Maintenance

This template should evolve with the FDI motion:

- **After each new FDI project**, ask: did this project's good parts diverge from the template? If yes, was the divergence vertical-specific (leave it) or generally better (fold it back in)?
- **Don't make the template perfect on day one.** It's meant to grow from real project usage.
- **Rev the version when the schema changes** (touching `data.js` field names breaks all downstream projects). For copy/structural updates, just commit.

## Contributors

- **Alex Giles** — Template owner, primary maintainer.
- **Charles Holley** — Original Valar dashboard architect (the reference example).
- **Logan** — Primary GitLab/CI infrastructure.
