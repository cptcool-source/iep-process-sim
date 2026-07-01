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
        └─► Playbook (hand-synced callouts, not yet live — known gap)
        │
        ▼
(not yet built) AI-consumable export → personalized family tool
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
| **Cited** (`cited.html`) — secondary evidence tier | 8 real adjudicated cases, 8 categories | Scheduled ingestion (monthly) — growth-tracking UI not built yet |
| **Playbook** (`playbook.html`) | 16 sourced callouts across 4 phases (Before/During/After/If You Disagree), benchmarked against real existing IEP guides | Hand-authored, not yet synced live to the two datasets |

Full build-by-build detail, every source, and every design decision behind each phase is in "Build history" below — this table is just the current snapshot.

## Roadmap toward the mission

Organized against the mission's three clauses, not just a flat backlog.

### Toward a coherent, end-to-end pipeline

- **Cited-side growth tracking** — Phase 1e's growth counter, recent feed, and NEW badges only exist on Simulated. Cited has its own ingestion pipeline now (Phase 1h), so this is just unbuilt UI, not blocked on anything structural.
- **Keep the Playbook's callouts in sync with the datasets** — the 16 callouts are hand-authored HTML, not pulled live from `data.js`/`simulated-data.js`. Both ingestion runbooks now include a Playbook-sync check as their last step (Phase 1h), which surfaces *candidates* for new callouts — but adding them is still a manual step after that.
- **Cross-link Cited and Simulated** — link a Simulated pain point to its Cited counterpart when it's clearly a lower-stakes version of the same underlying issue. Deferred until both tracks have enough content that the connections are genuine, not reached-for.
- **AI-consumable dataset export** *(next priority)* — a clean, documented, properly-licensed JSON/CSV export of Cited + Simulated. Also the natural data source for the personalized prep-sheet below, so it's sequenced before that, not after.

### Toward continuously, systematically improving the IEP process

- **Fill the known case-law gap** — five original safeguard categories never got real case-law backing: Records Access, Confidentiality, Informed Consent, Understandable Language, Independent Educational Evaluation. Every scheduled scan actively checks for these, not just waits for them to turn up.
- **Plan / document quality track (Phase 2)** — a second dimension entirely: is the *written IEP* any good (measurable goals, present-levels-to-goals alignment, services matched to needs), not just whether the *meeting* was run fairly. Needs different sources than case law — published IEP-quality rubrics and real weak-goal/strong-goal pairs from teacher-training material.
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
- Wrightslaw, [Special Education Caselaw](https://www.wrightslaw.com/caselaw.htm) (case index used to find the above)
- Texas ILC, [Examples of Common Due Process Issues](https://txilc.org/wp-content/uploads/2025/02/2.-Examples-of-Due-Process-Issues-1-of-2-1.pdf)
- IDEA team-role requirements: 20 U.S.C. section 1414(d)(1)(B) / 34 CFR 300.321

**Simulated real accounts (current):** three individual blogs/essays plus academic/aggregate sources, de-identified pending outreach — see `OUTREACH-NOTES.md` (internal only) for actual names, links, and the outreach plan. Quotes shown on the page are verbatim; the individuals are not currently named or linked in the public product.
- Understood.org, [Our community weighs in: Crying at IEP meetings](https://www.understood.org/en/articles/our-community-weighs-in-crying-at-iep-meetings) (aggregate/anonymized)
- Center for Parent Information and Resources, ["Is an Interpreter Needed at the IEP Meeting?"](https://www.parentcenterhub.org/interpreter/) (federally-funded, OSEP)
- Sanderson et al., "Parent Perspectives on Student IEP Involvement," *Journal of Research in Special Educational Needs* (2023)

**Agentic architecture research (informs "The pipeline" above):**
- Anthropic, [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) — orchestrator-worker pattern, evaluation strategy, compound-error warnings
- Babel Street, [Three Guiding Principles for the Development of OSINT Agentic Systems](https://www.babelstreet.com/blog/designing-trustworthy-ai-for-osint) — Understand Intent, Transparency, Human-in-the-Loop

**Playbook backbone research:** COPAA, Wrightslaw, Understood.org, A Day in Our Shoes, The Intentional IEP (see Phase 1f in Build History for links).

## Disclaimer

**Cited** is real, adjudicated case law — see Sources above. Its "Reenactment" view dramatizes those real facts as meeting dialogue with invented names, for readability; it is not a transcript of any real meeting. The "Case File" view is the direct, undramatized read of what happened and what the law requires.

**Simulated** is a different evidence tier by design: real accounts (plus aggregate/academic sources) of everyday IEP-meeting friction, not adjudicated cases. Pattern summaries and takeaways are grounded directly in those real accounts. Individual sources are currently de-identified (see "Roadmap" and `OUTREACH-NOTES.md`); the per-condition dramatizations are simulated extrapolations from real patterns, not documented events, and are labeled as such on the page.

**Playbook** structure is benchmarked against real existing guides; general guidance outside its callout boxes is synthesized best practice, not from this project's own dataset. The callouts themselves are tagged by evidence tier (Real Case / Real Account / Research) so a reader always knows which kind of claim they're reading.

Phase 1a's transcripts (superseded) were fully invented composites with no case-law grounding at all — kept in Build History for continuity, not part of the live product.
