# Cited-track ingestion runbook

How to run a scan for new real Cited episodes (adjudicated IDEA case law).
As of Phase 1h, this runs on a schedule (see README for the trigger setup) —
this file is what the scheduled agent actually follows each time it fires.

## What a scan does

1. **Search** for new IDEA due-process hearing decisions and court rulings
   (Wrightslaw's case archive/newsletter, Texas ILC-style due-process issue
   summaries, and general legal-research search for recent IDEA appellate/
   district court decisions) not already covered in `data.js`.
2. **Validate** each candidate by fetching the full case summary or opinion
   (not just a search snippet) and confirming the holding is genuinely about
   IEP meeting-conduct/procedural-safeguards issues — the same scope Cited
   has always used (see "In scope" / "Out of scope" below). A case about
   FAPE substance, LRE/methodology, related services, restraint/seclusion,
   Section 504/ADA, or attorneys' fees is real but out of scope for this
   track — flag it for the Phase 2 (plan/document quality) or "down the
   road" tracks instead, the same way the original Phase 1b research did.

   **Verification discipline — never skip this, it has caught real problems.**
   A web-search tool's own synthesized summary will sometimes confidently
   describe a case — with a specific citation, court, and date — that does
   not actually exist, or garbles a real case's name (e.g. into a
   near-duplicate of one already in `data.js`). This has happened three times
   across the first two research passes on this project (see
   `cited-pending-review.md`'s "Hallucinated citations caught this session"
   note for the specifics) — a real, recurring rate, not a one-off. Before
   treating any case as real: either fetch the primary opinion/decision text
   directly, or confirm it independently against a primary index (e.g.
   CourtListener's REST API, an official court/agency site) — not just a
   second search-tool summary, since those can echo the same hallucination.
   If a case can't be verified this way, it does not go in
   `cited-pending-review.md` as a candidate — write it up under a "not found"
   / "could not verify" note instead, the same way every past instance of
   this has been handled.
3. **Extract** into the existing schema: category (an existing `CATEGORIES`
   id, or propose a new one — with a matching `CATEGORY_DESCRIPTIONS` entry —
   if it's a genuinely distinct procedural issue no current category covers),
   `source` (real case name, citation, and a real URL — Cited episodes are
   NEVER de-identified, unlike Simulated; adjudicated cases are public record
   with named parties by nature), `facts` (what happened, in plain language),
   `rule` (what the court held/what the law requires), `takeaway` (the
   plain-English lesson), `severity`, and a `dramatization` (3-6 lines using
   Cited's existing composite cast — Dana Reyes, Priya Shah, Mr. Alvarez,
   Dr. Novak, Ms. Whitfield — tagged to the relevant category).
4. **Write candidates to `cited-pending-review.md`** — never directly to
   `data.js`. Nothing merges without explicit approval. (Simulated's queue
   is `pending-review.md` — kept as a separate file so the two tracks' scans
   never collide or get merged into the wrong dataset by mistake.) Insert new
   candidates directly below the `<!-- New candidates... -->` placement
   comment near the top of the file (above all existing history) —
   newest scan's candidates always go at the top of the active queue, not
   appended after old history. Then update the queue status banner
   (`> **Queue status: ...`) at the very top of the file: state how many
   entries now need review (or "Queue is empty" if none), and update the
   "Last updated" date.
5. **Stop and wait.** The human reviewer (Charles) reads
   `cited-pending-review.md` and replies per-candidate: approve,
   approve-with-edits, or reject. Only approved candidates get merged into
   `data.js`, by a separate explicit step.

## Source-type scope: due-process hearings and courts by default

Every existing Cited episode is sourced from a due-process hearing officer
decision or a court ruling. That's the default and preferred source type —
it's what "adjudicated" means for this track.

If a scan turns up a strong candidate from a **different track** — a state
formal-complaint investigation finding (SEA-level, not a due-process hearing),
an OCR complaint resolution, or anything else that isn't a hearing officer or
court decision — **do not treat it as a normal candidate.** Write it to
`cited-pending-review.md` with an explicit `**Scope flag**` callout (see the
Colorado State-Level Complaint 2024:515 candidate, reviewed 2026-07-01, for
the format) explaining what track it's from and why it might still be a fit
(e.g., confidentiality violations are often resolved via state complaint
rather than due process, since there's frequently no live dispute to
litigate — just a factual violation to find). This is not a blanket ban on
non-hearing/non-court sources — it's a standing requirement that they always
get flagged for a deliberate human decision, never silently merged like a
normal candidate. The Colorado complaint above was reviewed under this
process and rejected; that outcome doesn't retroactively ban the source type,
but every future instance still needs its own explicit flag and decision.

## In scope / out of scope (unchanged from Phase 1b)

**In scope** (meeting conduct / procedural safeguards): predetermination,
missing required team members, parent participation, notice/right to
challenge, stay-put, child find/duty to evaluate, retaliation, burden of
proof, and any newly-surfaced procedural category in that same family.

**Out of scope** (real, but a different track): FAPE substantive standard,
LRE/methodology disputes, related services, restraint/seclusion/abuse,
Section 504/ADA overlap, attorneys' fees. If a scan turns up a strong case
in one of these areas, note it in `cited-pending-review.md` under a
"flagged, not a candidate" section (same pattern Simulated's runbook uses
for out-of-scope finds) rather than silently dropping it.

## Known gap to actively check for

Five categories from the original Phase 1a safeguards list never got
case-law backing. As of 2026-07-01, three are filled: Understandable Language
(`understandable-language-bellflower`, `understandable-language-chicago`),
Independent Educational Evaluation (`iee-ycq`, `iee-altaloma`), and Records
Access (`records-access-amandaj` — found as an unprompted cross-referral
while searching for a second `participation` case, not from a dedicated
Records Access search; worth remembering that these categories aren't always
found by searching for them directly). Two remain zero-coverage and are top
priority — before growing categories that already have a case:

- **Confidentiality** — one real candidate was found (Colorado State-Level
  Complaint 2024:515) but rejected on review because it was state-complaint-
  sourced, not a due-process hearing or court ruling (see "Source-type scope"
  above). Still open for a hearing/court-sourced candidate.
- **Informed Consent** (standalone) — the Understandable Language episodes
  above substantively cover informed consent too (the Bellflower ALJ's
  holding turns on consent not being informed), but if a fully separate case
  is wanted — one where consent is the central issue independent of a
  language barrier — none has been found yet.

A predetermination lead (*H.B. v. Las Virgenes Unified School District*, 9th
Cir. 2007) was found and its legal holding verified, but couldn't be merged
as a second case for that category because the underlying facts couldn't be
retrieved — see `cited-pending-review.md`'s "Found but not merge-ready"
section. Worth revisiting if the full opinion turns up.

## Multiple real cases per category (Phase 1i)

As of Phase 1i, a category is not "done" once it has one case. The site
supports multiple real cases per category with a case-switcher UI ("try
another real case" for readers whose situation doesn't match the first one
shown) — every category should keep growing toward several real cases over
time, not just the single founding one. When proposing a candidate for
`cited-pending-review.md`, it's fine (expected, even) for the proposed
category to already exist in `data.js` with a case in it — that's not a
duplicate, that's the target. Target roughly 2-3 real cases per category
long-term; there's no need to hit that in one scan.

Priority order for a given scan: (1) any of the five zero-coverage gap
categories, (2) any existing category with only one case, (3) genuinely new
categories if a scan turns up a real procedural issue none of the current
categories cover.

**Source leads for state-level due-process hearing decisions** (higher volume
of procedural/meeting-conduct rulings than federal circuit opinions, since
procedural-only disputes are decided at the hearing-officer level far more
often than they reach a court): Pennsylvania ODR
(https://odr-pa.org/due-process/hearing-officer-decisions/), New York SRO
(https://www.sro.nysed.gov/decision-search), California OAH
(https://www.dgs.ca.gov/OAH/Case-Types/Special-Education/Services/Page-Content/Special-Education-Services-List-Folder/Search-Special-Education-Decisions-and-Orders),
Massachusetts BSEA (https://www.mass.gov/bsea-decisions-and-rulings). CADRE
(https://cadreworks.org/) indexes other states' dispute-resolution systems
for expanding beyond these four. For federal circuit-level cases (the same
tier as the current 8 episodes), CourtListener
(https://www.courtlistener.com/) has a real search API and bulk data
downloads, not just a search page.

## cited-pending-review.md format

```
## CANDIDATE: {case name}
- Proposed category: {existing CATEGORIES id, or "NEW: {proposed name + one-line description}"}
- Citation: {real citation}, {real URL}
- Confidence: high / medium / low (and why, in one line)
- Facts (verbatim/paraphrased from the real opinion): "..."
- Rule/holding: "..."
- Draft takeaway: "..."
- Draft dramatization: {3-6 lines, tagged to category + severity}
- Severity: high / medium / low
```

## After approval

1. Add the approved entry to `data.js` in the existing schema (`CATEGORIES`/
   `CATEGORY_DESCRIPTIONS` if it's a new category, then the episode itself
   in `EPISODES`).
2. Move the resolved candidate (approved or rejected, with a one-line reason)
   out of the active queue and into a new dated entry at the **end** of the
   file's history section — after all existing history, continuing the
   file's chronological (oldest-first) record. Do not delete resolved
   entries; archive them, matching how every prior resolved batch in this
   file is recorded. Then update the queue status banner at the top of the
   file: recompute how many entries still need review (or set it to "Queue
   is empty"), and update the "Last updated" date.
3. If Cited's growth-tracking fields (Phase 1e-equivalent, once built for
   Cited) exist by the time this runs, set the new episode's `date_added`.

## Also check each scan: Playbook sync

After resolving Cited and Simulated candidates, check whether any newly
approved category (in either track) is missing a corresponding callout in
`playbook.html`. If so, draft one (matching the existing callout format —
see `playbook.html`'s existing callouts and Phase 1f's build prompt in
README.md for the format) and add it to whichever pending-review file makes
more sense, clearly marked as a Playbook candidate, not a Cited/Simulated
one.
