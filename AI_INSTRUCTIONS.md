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
- `index.html` — renderer. Hardcoded inference-vertical strings exist; SKILL.md Phase 8 enumerates what to find/replace.
- `TEMPLATE_GUIDE.md` — craft patterns extracted from the V1 Valar build. Section 9 is the field-by-field reference.
- `CONTEXT_TEMPLATE.md` — fillable shell for Phase 4 CONTEXT.md.
- `BUILD_NOTES_TEMPLATE.md` — fillable shell for Phase 9 BUILD_NOTES.md.
- `CLAUDE_DESIGN_PLAN_TEMPLATE.md` — older artifact; SKILL.md Phase 9 superseded its role.

## When this file gets out of date

If SKILL.md has a rule that contradicts this file, SKILL.md wins. This file is best-effort; SKILL.md is the spec.

If you're updating SKILL.md and changing process flow, you don't need to update this file unless the *file inventory above* changes (e.g., adding a new template file or removing one).
