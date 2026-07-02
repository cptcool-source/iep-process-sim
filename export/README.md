# AI-consumable dataset export

Machine-readable JSON export of the two canonical datasets (`data.js`,
`simulated-data.js`). This is the intended entry point for any program — an
AI system, the planned personalized prep-sheet, a researcher's script —
that wants this project's evidence base without scraping the site or
parsing browser JS.

**Do not edit these files by hand.** They are generated:

```
node tools/build-export.mjs           # regenerate after any dataset change
node tools/build-export.mjs --check   # verify export is in sync (exits 1 if stale)
```

Regeneration is a step in both ingestion runbooks — it runs after approved
candidates are merged into the datasets, never before. Output is
deterministic (no timestamps), so an unchanged dataset produces a
byte-identical export.

**Freshness (for consumers fetching over HTTP):** `manifest.json` carries
`source_data_sha256` — content hashes of the two dataset files. The hashes
change if and only if the data changed, so compare against your previously
fetched manifest to detect updates; no git access needed.

**The schema below is enforced, not aspirational:** the generator is
allowlist-based at every level and validates required fields and every
documented enum on each run. An unknown field, a missing required field, or
an out-of-enum value fails the build rather than shipping silently. In
particular, an `"individual"` (de-identified) source carrying any
attribution field (`author`/`publication`/`url`) is a hard error — the
export cannot leak a de-identification slip. Optional fields are **absent**
when not applicable, never `null`; the only nullable field is
`shared_with_cited_episode`.

## Files

| File | Contents |
|---|---|
| `manifest.json` | Entry point: schema version, per-file record counts, tier notes |
| `cited.json` | **Cited tier** — real adjudicated IDEA case law |
| `simulated.json` | **Simulated tier** — real de-identified accounts + simulated condition runs |

## Evidence tiers — read this before consuming

The two tiers are separate files **on purpose**, mirroring the site's
structure. They carry different levels of evidence:

- **Cited**: every episode is a real court or administrative decision, with
  citation and source URL. The `facts`, `rule`, and `takeaway` fields
  describe real holdings.
- **Simulated**: the `real_sources[].quote` values are real and verbatim,
  but the patterns were never litigated, and the `runs` are **simulated
  extrapolations**, not evidence.

A consumer must preserve which tier a claim came from. Every record's file
(and the top-level `dataset` field) tells you the tier; don't merge the two
into one undifferentiated pool.

In both tiers, `dramatization` dialogue is invented composite illustration
— fictional speakers voicing real fact patterns. Treat it as illustrative
text, never as quoted testimony.

## Schema — `cited.json`

```
dataset, schema_version, source_repository, license,
evidence_tier { name, description },
disclaimers [ ],
stats { episodes, categories },
categories [ { id, name, description, episode_count } ],
episodes [
  {
    id            unique slug, stable across export versions
    category      -> categories[].id
    severity      "high" | "medium"
    source        { case, citation, url }   real case name/citation/source link
    facts         what actually happened (real)
    rule          the legal holding (real)
    takeaway      plain-language lesson for families
    dramatization [ { speaker, role, line, tag? { id, status } } ]
                  tag.status: "violated" | "honored" — which safeguard the
                  moment illustrates
  }
]
```

## Schema — `simulated.json`

```
dataset, schema_version, source_repository, license,
evidence_tier { name, description },
de_identification_notice,
disclaimers [ ],
tracking_since        date the ingestion pipeline started tracking growth
stats { pain_points, categories, real_sources },
conditions [ { id, label, desc } ]        the 3 standard run conditions
outcome_labels { breakdown, partial, resolved }
categories [
  { id, name, description,
    shared_with_cited_episode,   cited.json episodes[].id covering the same
                                 underlying legal issue, or null
    pain_point_count }
]
pain_points [
  {
    id, category, date_added
    real_sources [
      { type          "individual" (de-identified) | "aggregate" (attributed)
        date_added
        source_desc?  de-identified description (individual sources)
        author?, publication?, url?   full attribution (aggregate sources)
        quote         real, verbatim }
    ]
    pattern_summary   the recurring failure pattern, in plain language
    takeaway          plain-language lesson for families
    runs [ { condition -> conditions[].id,
             outcome   -> outcome_labels key,
             dramatization [ { speaker, role, line } ] } ]
  }
]
```

## De-identification (Simulated tier)

Individual sources are de-identified by default (`source_desc` only — no
names, no links) pending direct outreach to the original authors. This is
an ethics decision, not missing data. **Do not attempt to re-identify
de-identified sources.** Aggregate sources (publications, academic
research) carry full attribution.

## License

Not yet finalized — contact the repository maintainer before
redistributing. Underlying court decisions are public record; editorial
summaries, takeaways, and dramatizations are original to this project;
verbatim quotes remain the work of their original authors.

## Versioning

`schema_version` follows semver: patch = data-only changes, minor =
backward-compatible schema additions, major = breaking schema changes.
Record `id` values are stable — safe to use as foreign keys.
