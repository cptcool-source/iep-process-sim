# Simulated-track ingestion runbook

How to run a scan for new real Simulated pain points. As of Phase 1h, this
runs on a schedule alongside the Cited-track scan (see
`CITED-INGESTION-RUNBOOK.md` and README.md for the trigger setup) — this
file is what the scheduled agent actually follows each time it fires. Can
still be run manually anytime by asking Claude Code to "run the Simulated
ingestion scan" and pointing it at this file.

## What a scan does

1. **Search** a defined set of source types (see below) for new real, public
   accounts of IEP-meeting friction not already covered in `simulated-data.js`.
2. **Validate** each candidate by fetching the full source (not just a search
   snippet) and confirming it's genuinely about the claimed pattern — same bar
   as the original Phase 1c research.
3. **Extract** into the existing schema: category (an existing `SIM_CATEGORIES`
   id, or propose a new one if it's a genuinely distinct pattern), a de-identified
   `source_desc` (never a name or direct link — outreach comes before
   re-identification, see `OUTREACH-NOTES.md`), the verbatim quote,
   `pattern_summary`, `takeaway`, and a draft set of 3 condition runs
   (`unfamiliar` / `experienced` / `under-resourced`) with dramatization lines,
   composited from the same character set (Renee Ortiz, Maya, Ms. Bell, Mr.
   Doyle, Dr. Pham) used elsewhere in Simulated.
4. **Write candidates to `pending-review.md`** — never directly to
   `simulated-data.js`. Nothing merges without explicit approval. Insert new
   candidates directly below the `<!-- New candidates... -->` placement
   comment near the top of the file (above all existing history) —
   newest scan's candidates always go at the top of the active queue, not
   appended after old history. Then update the queue status banner
   (`> **Queue status: ...`) at the very top of the file: state how many
   entries now need review (or "Queue is empty" if none), and update the
   "Last updated" date.
5. **Stop and wait.** The human reviewer (Charles) reads `pending-review.md`,
   and replies per-candidate: approve, approve-with-edits, or reject. Only
   approved candidates get merged into `simulated-data.js`, by a separate
   explicit step.

## Source types to search (roughly in priority order)

1. Named parent/self-advocate blogs and essays (Substack, personal sites,
   platforms like The Mighty) — same tier as the original three sources.
2. Aggregate/anonymized community pieces from credible publications
   (Understood.org-style "community weighs in" articles) — attributed at
   the publication level, no de-identification needed since no individual
   is named.
3. Published qualitative research on IEP-meeting experience (academic,
   already anonymized by the researchers) — the most "authoritative
   curated source" tier per the medical-RAG research (closest analogue to
   grounding on PubMed/UpToDate instead of open blogs).
4. Reddit — attempted, not currently reachable by the search tooling used
   here. Revisit if that changes.

## Relevance bar (don't lower this for volume)

- Fetch and read the full source. A search-snippet match is not enough.
- The account must describe a specific, concrete incident or pattern — not
  generic advice-giving content ("here's how to prepare for an IEP meeting").
- Prefer accounts that add a genuinely new angle over near-duplicates of an
  existing pain point, unless the new account meaningfully corroborates an
  existing one (note it as corroboration, not a new pain point, in that case).
- When in doubt, flag it as a lower-confidence candidate in `pending-review.md`
  rather than silently dropping it or silently including it at full confidence.

## pending-review.md format

Each candidate gets a block:

```
## CANDIDATE: {proposed title}
- Proposed category: {existing SIM_CATEGORIES id, or "NEW: {proposed name}"}
- Confidence: high / medium / low (and why, in one line)
- Source type: individual blog/essay | aggregate publication | academic research
- Source (internal tracking only, goes in OUTREACH-NOTES.md if approved, never in simulated-data.js): {name/site/URL}
- Quote (verbatim): "..."
- Draft source_desc (de-identified, for the public product): "..."
- Draft pattern_summary: "..."
- Draft takeaway: "..."
- Draft runs: {3 conditions, brief}
```

## After approval

1. Move the approved source's real identity from the candidate block into
   `OUTREACH-NOTES.md` (so it's tracked for the outreach step, never lost).
2. Add the approved entry to `simulated-data.js` in the existing schema.
3. Move the resolved candidate (approved or rejected, with a one-line reason)
   out of the active queue and into a new dated entry at the **end** of the
   file's history section — after all existing history, continuing the
   file's chronological (oldest-first) record. Do not delete resolved
   entries; archive them, matching how every prior resolved batch in this
   file is recorded. Then update the queue status banner at the top of the
   file: recompute how many entries still need review (or set it to "Queue
   is empty"), and update the "Last updated" date.
