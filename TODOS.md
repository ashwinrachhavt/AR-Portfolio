# TODOS

## Design System

### Create DESIGN.md

**What:** Pin the de facto token system (colors, type scale, spacing, pills) into a DESIGN.md at the repo root.

**Why:** `home.module.css` carries an unpinned vocabulary — `#0a0a0b` ground, `#f5f5f7` ink, `#b9b9bf` body, pill radius 999px, 44px section titles with -2px tracking, 80-88px section padding. Nothing enforces them; the next section built by hand drifts exactly like the old Tailwind/Tiplewind split did.

**Context:** Surfaced by plan-design-review Pass 5 (2026-10-13, profile-revamp-2). The About section already reuses the shared `.sectionHeader h2, .writing h2, .aboutTitle` type group across 3 breakpoints — that's the pattern to codify. Run /design-consultation for the full consultation flow. Logged in gstack tasks artifact under T1.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Testing

### UI component test coverage

**What:** Add tests for homepage behavior — section render order, Footer's "Back to top" anchor target existing on every page that renders `<Footer />`, and the About section's key number claims (churn 30%→5%, MRR $600K→$1.2M, $15M+, ~$8K cost-to-originate) as a content-contract check.

**Why:** The `npm test` lane covers only `src/lib` (89 tests). The homepage restructure (profile-revamp-2) shipped behavior-bearing changes — footer anchor fix, section reordering — with 0% coverage; a dangling anchor or wrong section order would ship green. The anchor pairing is silently coupled across 7 pages (testing specialist, 4/10 confidence).

**Context:** Two options: (1) a source-contract test in the existing node runner that statically asserts the Footer/`id="main"` pairing and section order; (2) content contract on the bio numbers so they stay sourced from one place (deleted subheadingsData.jsx carried contradicting metrics: $3M+, 50K+, ~80%). Run /test-audit for a repo-wide sweep first.

**Effort:** M
**Priority:** P2
**Depends on:** None

## Completed
