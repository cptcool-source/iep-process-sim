# IEP Process Simulator

## Mission

**Develop a cool use of agentic AI architecture to build a coherent, end-to-end intelligence pipeline that continuously improves the IEP process systematically and helps families during it.**

Three distinct clauses, each with its own bar to clear:
- **A coherent, end-to-end pipeline** — real sources flow through scanning, validation, human review, and publication, without a person having to manually rebuild anything at each stage.
- **Continuously improves the IEP process systematically** — the evidence base keeps growing on a real schedule, and patterns get surfaced (which conditions produce breakdowns, which categories corroborate each other), not just accumulated.
- **Helps families during it** — the part that doesn't exist yet. Everything built so far is browsable reference material. Nothing yet takes a specific family's actual situation and does something with it. See "Roadmap toward the mission" below.

## What this is

Take real seed material — IDEA case law, real parent/community accounts — and simulate the IEP process the way [MiroFish](https://geoseeer.com/blog/emerging-osint-tools-ai-agent-era) simulates a world from a seed document: run variations under different conditions, and see where the process reliably breaks. Not a novelty demo — the goal is to surface real, recurring failure points in a form families, school staff, and eventually other systems can actually learn from.

This started as a spinoff of a broader OSINT/open-data research session, pointed specifically at the autism/special-education community. An early direction (a static "resource landscape" knowledge graph of orgs and services) was explored and shelved in favor of this — simulating the *process* itself, because that's where the "run it many ways and look for patterns" mechanic actually pays off.

## The pipeline

This is the part that makes "agentic AI architecture" a real claim rather than a label. The flow, end to end:

```
Real sources (case law, blogs/essays, academic research)
        │
        ▼
Scheduled orchestrator (monthly trigger, fresh session per fire)
        │
        ├─► Cited-track scan  ──► cited-pending-review.md
        └─► Simulated-track scan ──► pending-review.md
        │
        ▼
Human review (approve / edit / reject — nothing merges automatically)
        │
        ▼
data.js / simulated-data.js  (the canonical datasets)
        │
        ├─► Cited page, Simulated page (live stats, growth tracking*)
        ├─► Landing page (live stats + random real-quote widget)
        └─► Playbook: Meeting Resource callouts (hand-synced, not yet live —
            known gap) + "The IEP Document" (independently-researched guide
            content, not pulled from the pipeline at all — see Phase 1l)
        │
        ▼
AI-consumable export (`export/*.json`, regenerated after each approved
merge — see `export/README.md`)
        │
        ▼
(not yet built) personalized family tool
```
*Growth tracking currently exists on Simulated only — see "Roadmap."

**The agentic design decisions, and why:**
- **Orchestrator-worker, not one long-running process** — a scheduled trigger fires a *fresh* session each month with no memory of prior runs, following two written runbooks (`INGESTION-RUNBOOK.md`, `CITED-INGESTION-RUNBOOK.md`). This mirrors Anthropic's published multi-agent research system pattern: stateless, resumable, bounded per task, rather than one conversation slowly accumulating years of scan output in its context.
- **Human-in-the-loop is non-negotiable, not a fallback** — every candidate from every scan goes to a pending-review file and waits for explicit approval. This directly follows Babel Street's three OSINT-agent principles found during the roadmap research: Understand Intent, Transparency (full provenance, every claim traceable to a real source), and Human-in-the-Loop (preview and approve before anything executes). A 95%-accurate automated filter still eventually injects a wrong claim at scale — the review gate is what makes the automation trustworthy enough to run unattended.
- **Evidence-tier transparency is structural, not cosmetic** — Cited (real case law, never de-identified) and Simulated (real accounts, de-identified by default until outreach happens) are kept as separate datasets and separate pages on purpose. A reader — or a future AI system consuming this data — should never have to guess which evidence tier a claim came from.

## Current state (snapshot)

| Page | What it is | Live stats/pipeline |
|---|---|---|
| **Home** (`index.html`) | Landing page: a real quote pulled live from Simulated ("Show another" cycles all of them), then three cards into the tracks below | Card stats computed live from `data.js`/`simulated-data.js` |
| **Simulated** (`simulated.html`) — primary evidence tier | 10 real pain points, 15 real sources, 10 categories | Scheduled ingestion (monthly) + growth counter, recent-added feed, NEW badges |
| **Cited** (`cited.html`) — secondary evidence tier | 15 real adjudicated cases, 11 categories (4 categories now have 2 real cases each, live via the case-switcher UI); full-dataset accuracy audit completed Phase 1p — 6 of 15 had citation/fact errors, all corrected, none were outright fabrications | Scheduled ingestion (monthly) — growth-tracking UI not built yet |
| **Playbook** (`playbook.html`) | Primary content: "The IEP Document" — 9 modules (eligibility through transition/age of majority) on building a good IEP, with real breakpoint flags on present levels (2: records access, IEE), goals, and services, checked against current federal regs and a third-party comparison packet (Phase 1m). Demoted: "Meeting Resource" — 17 sourced callouts across 4 phases (added Understandable Language, Phase 1o) | Hand-authored, synced against both datasets as of Phase 1o |

Full build-by-build detail, every source, and every design decision behind each phase is in "Build history" below — this table is just the current snapshot.

## Roadmap toward the mission

Organized against the mission's three clauses, not just a flat backlog.

### Toward a coherent, end-to-end pipeline

- **Cited-side growth tracking** — Phase 1e's growth counter, recent feed, and NEW badges only exist on Simulated. Cited has its own ingestion pipeline now (Phase 1h), so this is just unbuilt UI, not blocked on anything structural.
- **Keep the Meeting Resource's callouts in sync with the datasets** — its 16 callouts are hand-authored HTML, not pulled live from `data.js`/`simulated-data.js`. Both ingestion runbooks now include a Playbook-sync check as their last step (Phase 1h), which surfaces *candidates* for new callouts — but adding them is still a manual step after that. (This doesn't apply to "The IEP Document" primary content added in Phase 1l — that's independently-researched guide content, not dataset-sourced callouts, so there's nothing to sync there; its 3 breakpoint flags are hand-tied to specific dataset entries and would need manual review if those entries ever changed.)
- **Cross-link Cited and Simulated** — link a Simulated pain point to its Cited counterpart when it's clearly a lower-stakes version of the same underlying issue. Deferred until both tracks have enough content that the connections are genuine, not reached-for.
- **AI-consumable dataset export** — a clean, documented, properly-licensed JSON/CSV export of Cited + Simulated. Also the natural data source for the personalized prep-sheet below, so it's sequenced before that, not after. *(Status: the JSON export now exists — `export/*.json`, generated from the canonical datasets by `tools/build-export.mjs`, schema documented in `export/README.md`, regenerate step added to both ingestion runbooks. The "properly-licensed" part and CSV remain open.)*

### Toward continuously, systematically improving the IEP process

- **Fill the known case-law gap, then keep growing every category** — five original safeguard categories never got real case-law backing. As of Phase 1k, three are filled (Understandable Language, Independent Educational Evaluation, Records Access); Confidentiality and standalone Informed Consent remain open (see `CITED-INGESTION-RUNBOOK.md`'s "Known gap" section for what's been tried and ruled out). Every scheduled scan actively checks for these first. Beyond that, the goal isn't "one case per category and done" — as of Phase 1i the site supports multiple real cases per category with a case-switcher UI, and four categories (stayput, child-find, understandable-language, iee) now actually have a second real case live. Target is roughly 2-3 real cases per category over time, gaps prioritized first.
- **Plan / document quality track (Phase 2)** — a second dimension entirely: is the *written IEP* any good (measurable goals, present-levels-to-goals alignment, services matched to needs), not just whether the *meeting* was run fairly. Phase 1l took the first real step — Playbook's primary content is now a full guide to the IEP document itself, with 3 of 9 modules carrying real breakpoint flags (Goals, Present Levels, Services & Supports). Still needs different sources than case law to fill the rest: published IEP-quality rubrics and real weak-goal/strong-goal pairs from teacher-training material, specifically for Accommodations, Assessments, Transition, and Age of Majority. Placement/LRE is intentionally excluded (see Phase 1l), not a gap to fill.
- **Legal domains deliberately excluded from the process track, kept for later (possibly their own tracks):** FAPE standard (*Endrew F. v. Douglas County*, *Rowley*), LRE/methodology disputes (*M.C. v. Antelope Valley*, *G. v. Fort Bragg*), related services (*Irving ISD v. Tatro*, *Cedar Rapids v. Garret F.*), restraint/seclusion/abuse (*HH v. Moffett*, *Connecticut OPA v. Hartford*), Section 504/ADA overlap (*Fry v. Napoleon*, *KM v. Tustin*), attorneys' fees (*Arlington Central SD v. Murphy*).
- **Regenerating / multi-tone simulations** — not just 2-3 alternate scripted dramatizations per condition, but a real spread of different tones/communication styles (blunt/direct vs. diplomatic vs. clinical/formal vs. plain conversational), so a reader who doesn't connect with the first dramatization might connect with a differently-toned one. Wanted for all pain points eventually. Blocked on: live in-browser regeneration needs either an exposed API key (real abuse/cost risk on a public site) or a backend proxy — the realistic path is pre-authoring multiple tone variants during ingestion/review, same human-gated process as everything else, built for new pain points going forward and backfilled later rather than all at once.

### Toward helping families during it (the real gap)

- **Personalized static prep-sheet** *(scoped, not started)* — a short client-side quiz (first meeting or not? what's it about? do you have an advocate?) generating a tailored one-page prep sheet from the dataset. Deliberately no backend, no live LLM calls, nothing saved between visits — fully computed in the browser. Sequenced after the AI-consumable export above, so it queries a clean data source instead of hand-wiring against the raw dataset files.
- **School-staff-facing Playbook companion** — the current Playbook is parents/families only. A staff/case-manager-facing version (running the meeting well, avoiding these same failure patterns from the other side of the table) is the natural next audience, matching the project's dual-credibility goal (parents *and* school psychologists/staff), not attempted yet.

### Integrity / ethics (ongoing, not scoped to "done")

- **Outreach for named attribution** — contact the individuals behind Simulated's de-identified quotes (tracked in `OUTREACH-NOTES.md`, internal only, never in the public product) to make them aware their work was used, ask permission to restore name/link attribution, and see if any want further involvement. Names stay withheld by default unless/until this happens — that's the default, not a stopgap.

## Build history (detailed, chronological)

<details>
<summary>Phase 1a — superseded (proof of concept)</summary>

The original working version: a 10-safeguard x 4-scenario grid, click a cell to jump to the transcript moment where that safeguard was honored, partially honored, or violated. Seeded from two solid sources (Understood.org's 10 IDEA procedural safeguards, Pizer Law's documented violation patterns), but the scenarios and dialogue were **invented composite illustration**, not real case material. Kept for history; replaced by Phase 1b.
</details>

<details>
<summary>Phase 1b — built (Cited track's real evidence base)</summary>

Rebuilt the process/meeting-conduct dataset on a real evidence base, and restructured the app around one dataset with two renderings instead of one fixed format.

**Real evidence base:** 8 episodes, each grounded in an actual adjudicated IDEA case (Wrightslaw case archive, Texas ILC due-process issue examples):
- **Predetermination** — *Deal v. Hamilton County Board of Education*, 392 F.3d 840 (6th Cir. 2004)
- **Missing required team member** — *M.L. v. Federal Way School District*, 394 F.3d 634 (9th Cir. 2004)
- **Parent participation** — *Doug C. v. Hawaii Department of Education*, 720 F.3d 1038 (9th Cir. 2013)
- **Right to challenge (notice)** — *Jaynes v. Newport News Public Schools*, 4th Cir. (2001) — autism/ABA case
- **"Stay put" rights** — *Burlington School Committee v. Massachusetts Dept. of Education*, 471 U.S. 359 (1985)
- **Child Find / duty to evaluate** — *Phyllene W. v. Huntsville City Board of Education*, 11th Cir. (2015)
- **Retaliation against parents** — *A.C. v. Shelby County Board of Education*, 6th Cir. (2013)
- **Burden of proof in disputes** — *Schaffer v. Weast*, 546 U.S. 49 (2005)

**Two views, one dataset:** each episode carries both the real case facts/rule/takeaway (the "Case File" view) and a short dramatization as meeting dialogue (originally "Simulated Meeting," **renamed "Reenactment" in Phase 1g** once a separate Simulated track existed and the shared name became confusing).

**Known gap:** five original safeguards never got strong case-law backing — Records Access, Confidentiality, Informed Consent, Understandable Language, Independent Educational Evaluation. Parked until a real case is found for each.

Files (as of Phase 1g): `cited.html` (originally `index.html`), `style.css`, `data.js`, `app.js`.
</details>

<details>
<summary>Phase 1c — built (Simulated track)</summary>

Second page, `simulated.html`. Real evidence base: 9 pain points (later 10), each grounded in a real personal account — a deliberately different, more common but less legally-tested evidence tier than Cited:
- **Parent Participation Dismissed** *(shared w/ Cited: Doug C. v. Hawaii)*
- **Predetermination** *(shared w/ Cited: Deal v. Hamilton County)*
- **Jargon / Acronym Overload** *(fills a Cited known gap)*
- **Refusing to Correct Records** *(fills a Cited known gap)*
- **Financial Barrier to Advocacy**
- **Ableist Goals & Practices**
- **Student Dignity & Voice** *(the strongest material found)* — a nonspeaking autistic self-advocate's own account of her IEP meetings
- **Uncompensated Parental Labor**
- **"No Staff/Resources" as a Denial Excuse** *(the one aggregate/anonymized source — Understood.org's community piece, attributed at publication level)*

**De-identified by design:** the individual blogs/essays behind these quotes belong to real people who shared personal, sometimes painful accounts without knowing they'd become seed data here. Quotes are verbatim (that's the real grounding), but names/links/identifying details are withheld pending outreach — see `OUTREACH-NOTES.md` (internal only). Aggregate sources (organizations, not individuals) get full attribution.

**Multi-run pattern extrapolation:** each pain point simulated under three conditions — *Unfamiliar, no advocate* / *Experienced, supported* / *Under-resourced/defensive* — producing an aggregate grid. Real pattern found: "Unfamiliar, no advocate" breaks down in every pain point tested; "Experienced, supported" resolves well in most; "Under-resourced/defensive" is mixed.

**Validation approach:** every source fetched and read in full, not search-snippet-matched. Reddit attempted, not crawlable by the search tooling used here — the evidence base ended up entirely blogs/essays plus one aggregated piece.
</details>

<details>
<summary>Phase 1d — built (manual ingestion pipeline, Simulated)</summary>

A repeatable process for finding new Simulated candidates without a full rebuild each time — `INGESTION-RUNBOOK.md`. Originally manual (search → validate → `pending-review.md` → human approval → merge, with real identities moved to `OUTREACH-NOTES.md`). First run found one new pain point (Interpreter Access / Language Barrier) and one corroborating academic source; both reviewed and merged the same pass.
</details>

<details>
<summary>Phase 1e — built (visible growth/evolution tracking, Simulated)</summary>

Problem: once ingestion started adding real content, there was no visual way to tell the page was actually growing. Four zero-backend mechanisms:
1. **Growth counter** — "N pain points · M real sources · tracked since {date}," computed live from `date_added` fields, never hand-maintained.
2. **"Recently added" feed** — clickable date-tagged pills, newest first.
3. **NEW badges** — anything (pain point or individual source) added in the last 30 days, computed client-side against the browser's date.
4. **"Confirmed by N independent sources"** — once a pain point has 2+ sources, states the corroboration explicitly.

Deferred from this brainstorm: regenerating/multi-tone simulations (see Roadmap) and Cited-side parity (built later in Phase 1h/still pending UI).
</details>

<details>
<summary>Phase 1f — built (IEP Playbook)</summary>

Third page, `playbook.html`, parents/families only. Structure benchmarked against real existing guides (not assumed) rather than organized around this project's own categories, with Cited's and Simulated's findings woven in as sourced callouts at the relevant points.

**The build prompt used** (self-contained, written for a fresh session with no prior context):

```
Build a new "IEP Playbook" page for the IEP Process Simulator project at
C:\Users\SHYNTECHPC\clauded\iep-process-sim\. This is a static HTML/CSS/JS
site, no build step, no backend — two existing pages: index.html ("Cited",
real adjudicated IDEA case law) and simulated.html ("Simulated", real
parent/community accounts of everyday IEP-meeting friction, used as seeds
for simulated dramatizations). Read README.md first for full project
context, evidence-tier conventions, and the de-identification policy before
doing anything else.

GOAL: a parent/family-facing IEP playbook — practical, prepare-for-the-
meeting guidance — that (a) follows the structure and tone families are
already likely to have seen in existing well-known IEP guides, so it feels
familiar rather than alien, and (b) weaves in our own research findings as
callout boxes at the relevant points, citing real cases and real accounts,
not generic advice.

## Phase 1 — Research current best practice + benchmark existing guides

Do NOT skip this or treat it as a formality — it determines the whole
document's backbone structure.

1. Research current best-practice guidance for parents preparing for and
   navigating an IEP meeting. Look for authoritative sources: Wrightslaw,
   Understood.org, COPAA, CARD/university-based autism centers, state
   Departments of Education (Florida's fldoe.org has parent-facing IEP
   meeting prep material already found earlier in this project — check if
   it's still current, and look at other states too).
2. Research highly-rated or commonly-used "IEP companion guide" tools and
   resources currently available — both free/nonprofit guides and paid
   apps/platforms (e.g. advocacy platforms, IEP-tracking apps). The goal is
   NOT to copy content, it's to identify: what's the conventional structure
   (chronological phases? before/during/after? checklist-driven?), what
   sections/headers recur across multiple sources, what tone is standard.
   Fetch full pages, don't rely on search snippets — same rigor as the rest
   of this project.
3. Synthesize a backbone structure from what you find (most likely
   something like: before the meeting / during the meeting / after the
   meeting / if you disagree — but let the research actually decide this,
   don't assume it).

## Phase 2 — Pull in this project's own dataset

1. Read `data.js` (Cited) and `simulated-data.js` (Simulated) directly —
   don't rely on any category list from outside this file, since the
   ingestion pipeline (see INGESTION-RUNBOOK.md) may have added new
   categories since this prompt was written.
2. For every category in both CATEGORIES/SIM_CATEGORIES, and every episode/
   pain point, identify which phase of the Phase-1 backbone structure it's
   most relevant to (e.g. Predetermination and Parent Participation are
   relevant to "during the meeting"; Interpreter Access and Financial
   Barrier to Advocacy are relevant to "before the meeting"; Burden of
   Proof and Stay Put are relevant to "if you disagree").
3. Draft one callout box per relevant episode/pain point, to be inserted at
   that point in the playbook. Each callout must:
   - State the pattern in plain language (reuse the existing
     `pattern_summary`/`facts`/`takeaway` fields, don't reinvent them)
   - Cite its real source and be honest about which evidence tier it's
     from — a Cited callout says "a court found..." with the real case
     name/citation linked; a Simulated callout says "parents/families have
     reported..." and respects the existing de-identification (no names/
     links for individual sources — check the `type` field: "individual"
     stays de-identified, "aggregate" gets full attribution, matching how
     the existing pages already render this)
   - Give one concrete, actionable thing the parent can do or ask, derived
     from the episode's `takeaway`

## Phase 3 — Build the actual page

1. Create `playbook.html` in the same directory, following the exact
   conventions of the other two pages: same `<nav class="site-nav">`
   pattern (add a third link — update index.html's and simulated.html's
   nav too, so all three pages link to all three), same `style.css` (add
   new rules additively at the end, the way every prior phase of this
   project has — never edit existing rules for the other two pages),
   same disclaimer-block pattern at the top explaining what this page is
   and how the callouts are sourced.
2. The playbook itself: the Phase-1 backbone structure as the main content,
   written in plain, warm, practical language (this project's established
   voice — see how takeaways are phrased in data.js/simulated-data.js for
   the tone to match), with the Phase-2 callout boxes inserted inline at
   the relevant points, visually distinct (bordered callout box, not just
   another paragraph) and color-coded by evidence tier the same way the
   rest of the site already does (reuse `.source-type--individual` /
   `.source-type--aggregate` style conventions, or a new equivalent for
   Cited-sourced callouts).
3. Add a simple table of contents at the top (anchor links to each phase
   section) since this will be a longer scrolling document than the other
   two pages.
4. This is explicitly a living document — say so in the intro, and leave
   it in a state that's easy to keep editing (clean semantic HTML sections,
   not a wall of unstructured text).

## Constraints (carried over from the rest of this project — do not relax these)

- No fabricated statistics, no invented case citations, no invented
  "companion guide" sources — if you can't verify something is real, don't
  include it as fact.
- If Phase 1 research surfaces NEW real individual accounts (a blog, an
  essay) beyond what's already in simulated-data.js, apply this project's
  existing de-identification-by-default policy: quote verbatim, but do not
  name or link the individual; add the real identity to OUTREACH-NOTES.md
  (internal only) for the outreach step, the same way every existing
  Simulated source was handled.
- Keep the evidence-tier transparency absolute: a reader must always be
  able to tell whether a claim is from real case law, a real personal
  account, or general best-practice research — never blend these into one
  undifferentiated voice.
- No backend, no build step, no new dependencies — plain HTML/CSS/JS only,
  consistent with the rest of the project.

## When you're done

Update README.md with a new phase entry describing what was built, the
sources used for the Phase-1 backbone research, and note this in "Down the
road" if there's an obvious next iteration (e.g. a school-staff-facing
companion version, which was explicitly scoped OUT of this pass in favor of
parents/families only).
```

**Result:** backbone confirmed by research (Before/During/After/If You Disagree — COPAA, Wrightslaw, Understood.org, and independent parent-advocate guides converge on almost exactly this). Existing tool landscape surveyed for structural benchmarking (Wrightslaw, Understood.org, A Day in Our Shoes, Ashley Barlow Co., IEP Advocate.ai, AdvocateIQ at $49/review). 16 callouts placed, 2 of them *combined* (pulling from both a Cited case and Simulated accounts in one box for the same underlying issue).
</details>

<details>
<summary>Phase 1g — built (front-page redesign: Simulated promoted to primary)</summary>

**Why:** the site had grown to three tracks plus a Playbook, but `index.html` was still just the original Cited page, worded as the entire product. Cited's internal toggle was also labeled "Simulated Meeting" — a naming collision once "Simulated" became its own separate track.

**What changed:** `index.html` (Cited's old file) renamed to `cited.html`, content unchanged. Its toggle renamed "Simulated Meeting" → "Reenactment." A genuinely new `index.html` built as a landing page: featured-quote widget (random real quote from `simulated-data.js`, "Show another" button), three cards into Simulated (primary, bordered/larger), Cited (secondary), Playbook (tertiary), stats computed live. Nav restructured on all pages: brand link + Simulated/Cited/Playbook order (was Cited/Simulated/Playbook). All cross-references to old `index.html`-as-Cited fixed (Playbook's 8 citation links now point to `cited.html`).
</details>

<details>
<summary>Phase 1h — built (scheduled ingestion for both tracks)</summary>

**Why:** Simulated had a pipeline but Cited didn't, and Simulated's was manual — someone had to remember to ask. With the project open to a minimal backend/scheduled-infra budget, this was the moment to make both tracks' evidence-gathering automatic without weakening the human review gate.

**What was built:**
- `CITED-INGESTION-RUNBOOK.md` — Cited's own scan-and-review process, parity with Simulated's. Cited episodes are never de-identified (adjudicated cases are public record with named parties).
- `cited-pending-review.md` — Cited's review queue, kept separate from Simulated's so a scan never merges into the wrong dataset.
- A real scheduled trigger (monthly, fresh session per fire, no memory of prior runs) that follows both runbooks, checks for Playbook-sync gaps, writes everything to the two pending-review files, and never merges anything itself.
- Both runbooks now include a Playbook-sync check as their last step.

Notification config: email only (`bspivey212@gmail.com`) — push was tried first, then turned off since push delivery depends on device/app setup that couldn't be verified from here; email was confirmed as the reliable channel.
</details>

<details>
<summary>Phase 1i — built (multiple real cases per category, Cited)</summary>

**Why:** the case-law goal had been framed as "one case fills the gap and it's done" — but a single case per category means a reader whose specific situation doesn't match that one case has nothing else to compare against. Reframed the goal: every category should grow toward several real cases over time, with a way to browse between them.

**What was built:** `data.js`'s schema already supported this with zero changes — `EPISODES` never enforced one-episode-per-category, that was just a coincidence of the data so far. The actual work was in `app.js`: the sidebar (`renderEpisodeList`) now lists one row per *category* instead of one row per episode, showing a case-count hint when a category has more than one; picking a category jumps to its first case; a new case-switcher ("Case N of M for this category — Try another real case") appears above the Case File/Reenactment content whenever the active category has more than one real case, cycling through them via the existing `selectEpisode` so both views stay in sync exactly like switching episodes always has. `CITED-INGESTION-RUNBOOK.md` updated to reflect the new priority order (zero-coverage gaps first, then existing single-case categories, then genuinely new categories) and to record source leads for state-level due-process hearing decision databases — a better fit than federal circuit opinions for procedural/meeting-conduct volume, since those disputes are decided at the hearing-officer level far more often than they reach a court.

**Known gap:** the actual case-law content still needs to be found and reviewed — this phase built the mechanism, not new episodes. `cited-pending-review.md` is the next step, following the runbook.
</details>

<details>
<summary>Phase 1j — built (first real gap-category cases merged, source-type scope rule established)</summary>

**Why:** Phase 1i built the mechanism; this phase actually ran a research pass against the source leads it recorded, targeting the five zero-coverage categories first.

**What was found and merged:** two real cases, each fetched and validated against primary or directly-litigating sources (not search snippets) —
- **Understandable Language** — `understandable-language-bellflower`: a California OAH decision (Case No. 2016100887) finding a district's failure to translate IEP documents or provide an adequate interpreter meant a mother's consent "could not reasonably have been interpreted to have been, informed." Also substantively fills Informed Consent, though it's tagged to Understandable Language only for now.
- **Independent Educational Evaluation** — `iee-ycq`: *Y.C.Q. v. Chichester School District*, a Pennsylvania case where a hearing officer ordered the district to fund an IEE and build an IEP after the district was found to have unlawfully denied services; the district's refusal to comply escalated to state enforcement.

**What was caught and rejected:** one lead ("Sandra S. v. Upper Darby School District," surfaced by a web-search tool's own synthesized summary) could not be verified against CourtListener's actual case database and was dropped as a likely hallucination — documented in `cited-pending-review.md`'s "Not found this pass" section as a caution for future scans. One real candidate (Colorado State-Level Complaint 2024:515, for Confidentiality) was reviewed and rejected specifically because it came from a state-complaint investigation rather than a due-process hearing or court ruling — every existing Cited episode is hearing/court-sourced, and this was the first time a different source type came up. That review established a standing rule, now in `CITED-INGESTION-RUNBOOK.md`'s "Source-type scope" section: non-hearing/non-court candidates must always be flagged separately for an explicit human decision, never merged as a normal candidate.

**Still open:** Records Access, Confidentiality (hearing/court-sourced), and a standalone Informed Consent case.
</details>

<details>
<summary>Phase 1k — built (second cases for existing categories, three parallel research forks)</summary>

**Why:** Phase 1j proved the mechanism and content pipeline work end to end. This phase pushed on breadth — giving already-covered categories a genuine second real case, so the case-switcher UI built in Phase 1i actually has something to switch to.

**What was found and merged:** five real cases, split across three parallel research passes (predetermination/missing-member/participation; due-process/stayput/child-find; retaliation/burden-of-proof/understandable-language/iee), each independently verified against a primary source before being trusted —
- **Records Access** (zero-coverage gap, finally filled) — `records-access-amandaj`: *Amanda J. v. Clark County School District*, a district withholding a two-page summary instead of the full evaluation records that would have disclosed its own evaluators' autism findings. Found as an unprompted cross-referral: two of the three research forks, working independently, both flagged this same case as a better fit for Records Access than the category they were actually assigned.
- **Stay-Put** (2nd case) — `stayput-ridley`: *M.R. v. Ridley School District*, holding stay-put funding obligations extend through the full appeals process, not just the first ruling.
- **Child Find** (2nd case) — `childfind-matula`: *W.B. v. Matula*, holding a district can't run out the clock on Child Find by ignoring repeated parent requests.
- **Understandable Language** (2nd case) — `understandable-language-chicago`: *H.P. v. Board of Education of the City of Chicago*, a class action over a district-wide pattern of unverified ad hoc interpreters.
- **Independent Educational Evaluation** (2nd case) — `iee-altaloma`: a California OAH decision showing the flip side of `iee-ycq` — a district that responded to an IEE request correctly.

**What was found but not merged:** a predetermination lead (*H.B. v. Las Virgenes*, 9th Cir. 2007) had its legal holding verified but not its underlying facts, so it wasn't drafted into a full episode — flagged in `cited-pending-review.md` for whoever picks it up next.

**Verification discipline, now codified:** three hallucinated citations were caught and dropped across this phase and Phase 1j combined — all from AI-search-tool synthesized summaries, none from primary-source fetches. `CITED-INGESTION-RUNBOOK.md` now has a standing "Verification discipline" step requiring every candidate be checked against a primary source or independently cross-corroborated before being written up, not trusted from a single search summary.

**Still open:** Confidentiality (hearing/court-sourced), standalone Informed Consent, and second cases for predetermination, missing-member, due-process, retaliation, and burden-of-proof.
</details>

<details>
<summary>Phase 1l — built (Playbook rebuilt around "The IEP Document," first real step toward Phase 2)</summary>

**Why:** the user found `parentcenterhub.org/pa12` ("Developing Your Child's IEP") as the strongest comparable resource anywhere — dense and comprehensive, but a visual-free wall of text with no data behind it. They wanted something at that depth, on this site, checked against current sources, more readable, and threaded through with real evidence where it genuinely applies — while keeping the existing Playbook content intact rather than deleting it.

**Research done before building anything:** fetched pa12 in full, then independently verified its load-bearing claims against eCFR.gov and other current sources rather than assuming a 2023-dated guide was still accurate. Found: all four core federal timelines (30-day IEP meeting, triennial reevaluation, 15-day resolution window, age-16 transition trigger) are still current, no fixes needed. Age of majority and ESY eligibility both genuinely vary by state — kept explicit rather than defaulting to one number. Surfaced one genuinely new post-2023 item worth a small mention: responsible-use norms for AI-assisted goal drafting. Also found the actual redundancy in pa12: roughly half of it re-covers meeting logistics/timeline, which — given the structural decision below — the existing Playbook content already handles.

**What was built:** `playbook.html` restructured into two parts —
- **Primary content, "The IEP Document"** (new): a 10-required-parts overview using a numbered flowchart component (`.process-flow`), then modules on Present Levels, Annual Goals, Measuring Progress, Services & Supports, Placement & LRE, Assessments, and Transition & Age of Majority — deliberately *not* re-covering meeting timeline, since that's the demoted section's job. One running hypothetical example (a 5th grader, "Jordan") threads through Present Levels → Goals → Progress for concreteness, visually distinct from sourced content via a dashed-border `.example-box`, always tagged "Illustrative example" — never mixed with real evidence.
- **Demoted, "Meeting Resource"** (unchanged): the original 16 sourced callouts across the original 4 phases (Before/During/After/If You Disagree), moved verbatim to the bottom of the page under a new intro.

**Breakpoint flags — exactly 3, not decorative:** cross-referenced every new module against `data.js`/`simulated-data.js` and found real evidentiary backing for only 3 of the 8 modules built this phase (corrected count — see Phase 1m; originally miscounted as "9" in this entry and in the disclaimer, since the page only had 8 modules until Phase 1m added a 9th): Annual Goals ↔ Simulated's `ableist-goals` (goals targeting masking, not real needs — the strongest match found), Present Levels ↔ Simulated's `records` + Cited's `records-access-amandaj`, Services & Supports ↔ Simulated's `resource-excuse`. The other modules (accommodations, placement/LRE, assessments, transition, age of majority) get no flag — stated as an honest gap, not hidden, and Placement/LRE explicitly notes it's outside Cited's deliberate scope rather than an oversight. New `.breakpoint-flag` component (a `<details>` disclosure, no new JS) makes this legible without cluttering the page for readers who don't need to expand it.

**This is a first step toward the Roadmap's "Plan/document quality track (Phase 2)," not Phase 2 completed** — see the updated Roadmap bullet below for what's still missing.
</details>

<details>
<summary>Phase 1m — built (9 checked additions from a third-party comparison packet; module miscount corrected)</summary>

**Why:** the user found Undivided's "IEP Prep Packet" (a paid parent-support platform's downloadable PDF) and asked for a full read-through to find genuinely good additions — with an explicit instruction to verify everything against current regulations before publishing it, not just port the packet's claims as-is.

**Verification caught two claims that would have been misleading if copied directly:**
- The packet's "24-hour notice to record the meeting" isn't a federal rule — IDEA doesn't address recording at all; it's state-by-state, and the 24-hour figure is specifically California's rule. Published as an explicit state-variance note with California as one example, not a universal right.
- The packet framed "partial signing" as simply "permitted in California but not all states." The real picture is more specific: federal IDEA itself allows partial consent for a child's *first* IEP nationwide; for an IEP already in place, whether it works the same way depends on whether your state requires a signature for implementation at all — sources indicate only a handful of states (including California and Massachusetts) do. Published with that fuller, more accurate framing.

**Confirmed accurate and made more universal than the source presented them:** the 13 IDEA disability eligibility categories (verified verbatim against 34 CFR §300.8(c)) and the related-services list (verified against 34 CFR §300.34) — the source packet labeled the 13 categories as California-specific, but they're federal and apply nationwide.

**What was built** (all in `playbook.html`, all within "The IEP Document," none touching `data.js`/`simulated-data.js`):
- New module, **"Who Qualifies for an IEP?"** — the 13 federal eligibility categories, placed before the existing "10 Required Parts" overview since eligibility logically precedes the document itself. This brings the module count to 9 (see the Phase 1l correction above).
- **Recording rights** and **partial signing** — added as state-variance-aware notes to Meeting Resource's "Before the Meeting" and "If You Disagree" (not new breakpoint flags — these are general legal facts, not tied to specific Cited/Simulated evidence).
- **Related Services** and **Accommodations & Modifications** cards in Services & Supports — strengthened with the fuller federal service list and a clearer how-vs-what distinction.
- **Post-meeting document-review checklist** and an **expanded post-implementation monitoring paragraph** — added to "After the Meeting," sequenced as before-signing checks vs. ongoing-after-signing checks so they don't overlap.
- **LRE spectrum ladder** — a new `.lre-ladder` visual in Placement & LRE, grounded in IDEA's actual continuum-of-alternative-placements concept (34 CFR §300.115) but written independently rather than reproducing the source packet's chart. Deliberately neutral-toned (no red/green value-coding) since a more restrictive setting isn't inherently "worse," just further from the default presumption.
- **Strength-based framing + vision statement** — added to Present Levels as a reframing technique and a short prompt, distinct from (not duplicating) the module's existing strengths/weaknesses guidance.

**Not added** (considered, judged lower-value or off-scope): the packet's health/emergency-plan (IHP) content, since it's explicitly not a standard IEP component per the source itself; the fillable communication-log and service-delivery-log templates, since they're low-substance compared to the monitoring guidance already added; the inclusion-definition content, since it's mostly redundant with what Placement/LRE already covers.

**Full-page cohesion recheck:** re-read the entire rebuilt page end to end per the user's request — confirmed no duplicate HTML ids, all tags balanced, all 9 `.aside-note` additions correctly left the `.breakpoint-flag` count at exactly 3 (nothing new was misrepresented as dataset-backed evidence), and no contradictions between the new state-variance content and existing content (e.g., the age-of-majority table and the new signature-requirement note cite different states for different reasons, without conflating them).
</details>

<details>
<summary>Phase 1n — built (queue status banner + reordering for both pending-review files)</summary>

**Why:** both `pending-review.md` and `cited-pending-review.md` had grown long enough across several rounds of scans that checking queue status meant scrolling to the bottom — the opposite of what a "can I glance and know what needs my attention" file should do.

**What was built:** a `> **Queue status: ...**` banner directly under each file's title, stating either "Queue is empty" or how many entries need review, plus a "Last updated" date — no scrolling required to check status. A `<!-- New candidates... -->` placement comment marks exactly where the next scan's candidates should be inserted (directly below the banner, above all existing history), so future scans always add new unresolved candidates at the top of the active queue. Historical sections (Resolved, Not Found, hallucination log, etc.) deliberately keep their existing chronological, oldest-first order rather than being reversed — reordering an archive doesn't reduce scrolling, since you only visit it when you actually want the history. Resolved batches continue to be *archived* at the end of the history section (never deleted), matching the pattern already established across every round so far.

Both `INGESTION-RUNBOOK.md` and `CITED-INGESTION-RUNBOOK.md` updated (their "Write candidates" and "After approval" steps) so this structure is self-maintaining on every future scan, not a one-time cleanup that goes stale.
</details>

<details>
<summary>Phase 1o — built (closed the Playbook-sync gap: Understandable Language + IEE)</summary>

**Why:** rounds 1 and 2 of Cited ingestion approved two new categories &mdash; `understandable-language` (Bellflower, Chicago) and `iee` (Y.C.Q., Alta Loma) &mdash; but neither had ever been woven into `playbook.html`. This was the "known gap" the snapshot table had been flagging since Phase 1l: real, verified evidence sitting in `data.js` with no corresponding callout on the page.

**What was built** (both in `playbook.html`, done live in-session rather than routed through `cited-pending-review.md`, since the user was reviewing directly rather than an unattended scan):
- **IEE breakpoint flag**, in "The IEP Document" &rarr; Present Levels, right after the sentence introducing the right to request an IEE. Deliberately cites both the violation (Y.C.Q.) and the honored case (Alta Loma) side by side, rather than only the violation &mdash; consistent with this project's integrity stance of not cherry-picking only bad outcomes when a real contrasting case exists.
- **Understandable Language callout**, in "Meeting Resource" &rarr; Before the Meeting, placed directly after the existing aggregate "Interpreter Access" research callout so the real-case evidence sits next to the general research it substantiates. Cites Bellflower (the single-family, informed-consent-turns-on-language case) rather than Chicago (the systemic class action), matching this project's established one-representative-case-per-callout pattern (see how Child Find and Stay Put each cite only their first case, despite having a second live on the case-switcher).

Snapshot table and Cited/Simulated sync status updated to reflect this; no changes to `data.js` or `simulated-data.js`.
</details>

<details>
<summary>Phase 1p — built (full-dataset accuracy audit of all 15 Cited cases)</summary>

**Why:** the user asked for a full verification pass on every case in `data.js`, checking none had been AI-hallucinated and that all were being presented accurately — the same rigor the ingestion runbooks require for new candidates (see "Verification discipline" in `CITED-INGESTION-RUNBOOK.md`), now applied retroactively to everything already merged.

**Method:** four parallel research passes, one per group of 3-4 cases, each required to confirm every case against a primary source (the actual opinion/decision text, CourtListener, Justia, an official court/agency site) rather than a search-tool summary — never trusting a case as real on a secondary source's word alone.

**Result: no case was fabricated.** All 15 genuinely exist, as cited courts/agencies, roughly the right years. But 6 of 15 had real accuracy problems, ranging from a wrong dollar figure to one case's outcome being described backwards:

- **`due-process-jaynes`** — citation was too vague ("4th Cir. (2001)"); corrected to the actual unpublished-opinion cite, 13 Fed. Appx. 166 (4th Cir. 2001). The $117,979.78 figure was the *original* hearing officer's award, not the final court-ordered amount — the state review process and district court cut it to roughly $103,000 before the Fourth Circuit affirmed that reduced figure. Site was stating the larger, superseded number as if the district was ordered to pay it.
- **`childfind-phyllene`** — facts claimed both the parent *and* the child's classroom teacher reported suspected hearing loss. The actual opinion shows only the parent reported it, twice (end of fifth grade, then again in the tenth-grade IEP meeting) — no teacher corroboration appears anywhere in the record. This was a fabricated detail, now removed from both the facts field and the dramatization.
- **`iee-ycq`** — facts had the appellant backwards: the site said the district appealed to the Third Circuit; the real Third Circuit docket (No. 25-2788) shows the *family* is the appellant, challenging adverse district-court rulings after the district refused to comply with the hearing officer's order. Also corrected from being presented as resolved to noting it's still pending on appeal as of late 2025.
- **`stayput-ridley`** — cited the wrong case entirely. 868 F.3d 218 (3d Cir. 2017) is a real Ridley opinion, but about attorney's fees for a stay-put win, not the stay-put-through-appeals holding described. The facts as written actually match an earlier opinion in the same underlying dispute, M.R. v. Ridley School District, 744 F.3d 112 (3d Cir. 2014) — citation and URL corrected to that case.
- **`childfind-matula`** — facts said the pattern of requests happened "before her son entered first grade"; the opinion shows one pre-enrollment meeting followed by the actual repeated, documented requests spanning his first and second grade years (1991-1993). Corrected the timeline, and added a caveat that the case's Section 1983 damages holding was later abrogated by A.W. v. Jersey City Public Schools (3d Cir. 2007) — Section 504 damages remain available, Section 1983 no longer does in this circuit.
- **`iee-altaloma`** (the serious one) — the site described this as the "flip side" of Y.C.Q.: a district that responded to an IEE request correctly, tagged `status: "honored"`. The actual document at the cited URL — OAH's 2019 decision *after a federal district court partially reversed* the original 2018 ruling — holds the opposite: the district's 84-day delay in disclosing that the evaluator's rate exceeded its cost criteria was itself found to be a substantive FAPE denial. The site had described the superseded, district-favorable 2018 decision while linking to and citing the 2019 reversal-on-remand decision that reached the opposite conclusion. Facts, rule, takeaway, severity (low &rarr; medium), and the dramatization's tag (`honored` &rarr; `violated`) were all rewritten to match what the cited document actually holds.

**Also fixed:** the IEE breakpoint flag added to `playbook.html` in Phase 1o was built on the now-corrected Alta Loma framing (`present-levels` section, presenting Y.C.Q. and Alta Loma as violation-vs-honored contrast) — rewritten to reflect that both are violations, just different mechanisms (outright refusal vs. undisclosed delay).

**Not corrected, left as-is:** `retaliation-ac`'s facts call the principal's DCS reports "false child-abuse allegations" — technically the Sixth Circuit reversed summary judgment (a jury *could* find them false), not a final finding of falsity, but this is a fair plain-language summary of what the trial record showed, not a misstatement worth flagging as an error.

Four Justia.com URLs (Burlington, Phyllene W., Amanda J., Schaffer) returned 403s to automated verification tools but are correctly indexed under their exact titles in live search results — treated as working, not broken; Cornell LII/govinfo.gov equivalents were identified as backups if link rot is ever confirmed.
</details>

## Sources

**Phase 1a (superseded):**
- Understood.org, [10 Key Procedural Safeguards in IDEA](https://www.understood.org/en/articles/10-key-procedural-safeguards-in-idea)
- Pizer Law, [10 (More) Completely Wrong Things Schools Tell Parents in IEP Meetings](https://pizer.law/10-more-completely-wrong-things-schools-tell-parents-in-iep-meetings/)

**Cited case law (current):**
- *Deal v. Hamilton County Board of Education*, [392 F.3d 840 (6th Cir. 2004)](https://www.wrightslaw.com/law/caselaw/04/6th.deal.hamilton.tn.htm)
- *M.L. v. Federal Way School District*, [394 F.3d 634 (9th Cir. 2004)](https://www.wrightslaw.com/law/caselaw/04/9d.ml.fedway.wa.htm)
- *Doug C. v. Hawaii Department of Education*, [720 F.3d 1038 (9th Cir. 2013)](https://www.wrightslaw.com/nltr/13/nl.0702.htm)
- *Jaynes v. Newport News Public Schools*, [4th Cir. (2001)](https://www.wrightslaw.com/advoc/articles/anatomy_case_jaynes.htm)
- *Burlington School Committee v. Massachusetts Dept. of Education*, [471 U.S. 359 (1985)](https://supreme.justia.com/cases/federal/us/471/359/)
- *Phyllene W. v. Huntsville City Board of Education*, [11th Cir. (2015)](https://law.justia.com/cases/federal/appellate-courts/ca11/15-10123/15-10123-2015-10-30.html)
- *A.C. v. Shelby County Board of Education*, [6th Cir. (2013)](https://www.wrightslaw.com/law/caselaw/2013/case.6th.cir.504retaliation.original.pdf)
- *Schaffer v. Weast*, [546 U.S. 49 (2005)](https://supreme.justia.com/cases/federal/us/546/49/)
- *Parent on Behalf of Student v. Bellflower Unified School District*, [Cal. OAH Case No. 2016100887 (2017)](https://www.californiaspecialedlaw.com/hearing-decisions/oah-2016100887/) — Understandable Language / Informed Consent
- *Y.C.Q. v. Chichester School District*, Pennsylvania due-process hearing decisions, [case summary via Education Law Center PA](https://www.elc-pa.org/cases/y-c-q-v-chichester-school-district/) — Independent Educational Evaluation
- *Amanda J. v. Clark County School District*, [267 F.3d 877 (9th Cir. 2001)](https://caselaw.findlaw.com/court/us-9th-circuit/1281824.html) — Records Access
- *M.R. v. Ridley School District*, [868 F.3d 218 (3d Cir. 2017)](https://law.justia.com/cases/federal/appellate-courts/ca3/16-2465/16-2465-2017-08-22.html) — Stay-Put
- *W.B. v. Matula*, [67 F.3d 484 (3d Cir. 1995)](https://law.justia.com/cases/federal/appellate-courts/F3/67/484/587547/) — Child Find
- *H.P. v. Board of Education of the City of Chicago*, [385 F. Supp. 3d 623 (N.D. Ill. 2019)](https://law.justia.com/cases/federal/district-courts/illinois/ilndce/1:2018cv00621/348621/94/) — Understandable Language
- Alta Loma School District IEE dispute, [Cal. OAH Case No. 2017120979 (2019)](https://www.dgs.ca.gov/OAH/Case-Types/Special-Education/Services/-/media/Divisions/OAH/Special-Education/SE-Decisions/2019/2019---November/2017120979AfterPartialRemandAcc.pdf) — Independent Educational Evaluation
- Wrightslaw, [Special Education Caselaw](https://www.wrightslaw.com/caselaw.htm) (case index used to find the above)
- Texas ILC, [Examples of Common Due Process Issues](https://txilc.org/wp-content/uploads/2025/02/2.-Examples-of-Due-Process-Issues-1-of-2-1.pdf)
- IDEA team-role requirements: 20 U.S.C. section 1414(d)(1)(B) / 34 CFR 300.321

**Simulated real accounts (current):** three individual blogs/essays plus academic/aggregate sources, de-identified pending outreach — see `OUTREACH-NOTES.md` (internal only) for actual names, links, and the outreach plan. Quotes shown on the page are verbatim; the individuals are not currently named or linked in the public product.
- Understood.org, [Our community weighs in: Crying at IEP meetings](https://www.understood.org/en/articles/our-community-weighs-in-crying-at-iep-meetings) (aggregate/anonymized)
- Center for Parent Information and Resources, ["Is an Interpreter Needed at the IEP Meeting?"](https://www.parentcenterhub.org/interpreter/) (federally-funded, OSEP)
- Sanderson et al., "Parent Perspectives on Student IEP Involvement," *Journal of Research in Special Educational Needs* (2023)

**Source leads for expanding Cited (identified Phase 1i, not yet used as case sources):**
- Pennsylvania Office for Dispute Resolution, [Hearing Officer Decisions](https://odr-pa.org/due-process/hearing-officer-decisions/) — full-text searchable since 2006
- New York Office of State Review, [Decision Search](https://www.sro.nysed.gov/decision-search)
- California Office of Administrative Hearings, [Search Special Education Decisions and Orders](https://www.dgs.ca.gov/OAH/Case-Types/Special-Education/Services/Page-Content/Special-Education-Services-List-Folder/Search-Special-Education-Decisions-and-Orders) — since 2013
- Massachusetts Bureau of Special Education Appeals, [Decisions and Rulings](https://www.mass.gov/bsea-decisions-and-rulings)
- CADRE (Center for Appropriate Dispute Resolution in Special Education, OSEP-funded), [cadreworks.org](https://cadreworks.org/) — index of other states' dispute-resolution systems
- CourtListener / Free Law Project, [courtlistener.com](https://www.courtlistener.com/) — real search API and bulk data downloads for federal case law

**Agentic architecture research (informs "The pipeline" above):**
- Anthropic, [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) — orchestrator-worker pattern, evaluation strategy, compound-error warnings
- Babel Street, [Three Guiding Principles for the Development of OSINT Agentic Systems](https://www.babelstreet.com/blog/designing-trustworthy-ai-for-osint) — Understand Intent, Transparency, Human-in-the-Loop

**Playbook backbone research (Meeting Resource, Phase 1f):** COPAA, Wrightslaw, Understood.org, A Day in Our Shoes, The Intentional IEP (see Phase 1f in Build History for links).

**"The IEP Document" research (Phase 1l):**
- Center for Parent Information and Resources, [Developing Your Child's IEP (pa12)](https://www.parentcenterhub.org/pa12/) — the structural benchmark; dated "Updated 8/2023," independently re-verified rather than assumed current
- eCFR.gov, current [34 CFR Part 300](https://www.ecfr.gov/current/title-34/subtitle-B/chapter-III/part-300) — used to verify pa12's four load-bearing timelines (§300.323(c)(1), §300.303, §300.510, §300.320) are still accurate
- Age-of-majority and extended-school-year state-variance figures cross-checked against current state Department of Education sources rather than treated as a single national number

## Disclaimer

**Cited** is real, adjudicated case law — see Sources above. Its "Reenactment" view dramatizes those real facts as meeting dialogue with invented names, for readability; it is not a transcript of any real meeting. The "Case File" view is the direct, undramatized read of what happened and what the law requires.

**Simulated** is a different evidence tier by design: real accounts (plus aggregate/academic sources) of everyday IEP-meeting friction, not adjudicated cases. Pattern summaries and takeaways are grounded directly in those real accounts. Individual sources are currently de-identified (see "Roadmap" and `OUTREACH-NOTES.md`); the per-condition dramatizations are simulated extrapolations from real patterns, not documented events, and are labeled as such on the page.

**Playbook** is two parts, as of Phase 1l. **"The IEP Document"** (primary content) is a guide to building a genuinely good IEP document, benchmarked against CPIR's `pa12` guide and independently verified against current federal regulations (34 CFR Part 300, checked July 2026) — general guidance there is synthesized best practice, not from this project's own dataset, except where a **breakpoint flag** (&#9888;) marks a specific step this project has real Cited/Simulated evidence for (3 of 9 modules; the rest are an honest gap, not a claim nothing goes wrong there). Anything tagged **Illustrative example** is hypothetical, invented for clarity, and never sourced fact. **"Meeting Resource"** (demoted, at the bottom of the page) is the original Playbook content: structure benchmarked against real existing guides, with its 16 callouts tagged by evidence tier (Real Case / Real Account / Research) so a reader always knows which kind of claim they're reading.

Phase 1a's transcripts (superseded) were fully invented composites with no case-law grounding at all — kept in Build History for continuity, not part of the live product.
