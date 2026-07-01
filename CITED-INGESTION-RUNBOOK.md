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
   never collide or get merged into the wrong dataset by mistake.)
5. **Stop and wait.** The human reviewer (Charles) reads
   `cited-pending-review.md` and replies per-candidate: approve,
   approve-with-edits, or reject. Only approved candidates get merged into
   `data.js`, by a separate explicit step.

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
case-law backing: Records Access, Confidentiality, Informed Consent,
Understandable Language, Independent Educational Evaluation. Every scan
should explicitly search for rulings on these five, not just wait for them
to turn up incidentally.

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
2. Delete the approved block from `cited-pending-review.md`, leaving only
   still-pending or flagged-out-of-scope entries for the record.
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
