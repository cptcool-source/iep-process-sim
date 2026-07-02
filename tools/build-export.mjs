#!/usr/bin/env node
// AI-consumable dataset export generator.
//
// Reads the canonical datasets (data.js, simulated-data.js) exactly as the
// site itself does — no parallel copy of the data exists anywhere — and
// emits documented JSON to export/. See export/README.md for the schema.
//
// Zero dependencies (Node built-ins only), matching the rest of the project.
//
// Usage:
//   node tools/build-export.mjs           # (re)generate export/*.json
//   node tools/build-export.mjs --check   # exit 1 if export/ is stale vs. the datasets
//
// Run this after every approved merge into data.js or simulated-data.js
// (both ingestion runbooks reference this step). Output is deterministic —
// no timestamps — so an unchanged dataset produces a byte-identical export;
// the manifest's source-file content hashes are the machine-readable
// freshness signal.
//
// The export is allowlist-based at every level: a field ships only if it's
// named here. Unknown fields in the datasets trigger a warning (so schema
// growth is never silently dropped), and an individual (de-identified)
// source carrying attribution fields is a hard error (so a de-identification
// slip in the dataset can never ship in the export).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXPORT_DIR = join(ROOT, "export");
const SCHEMA_VERSION = "1.0.0";
const REPO_URL = "https://github.com/cptcool-source/iep-process-sim";
const RAW_BASE = "https://raw.githubusercontent.com/cptcool-source/iep-process-sim/main/export";

// One place to change when the maintainer finalizes a license.
const LICENSE_NOTE =
  "License not yet finalized — contact the repository maintainer before redistributing. " +
  "Underlying court decisions are public record; editorial summaries, takeaways, and " +
  "dramatizations are original to this project; verbatim quotes remain the work of their " +
  "original authors.";

const SHARED_DISCLAIMERS = [
  "This dataset is educational reference material, not legal advice. Consult a qualified special-education attorney or advocate for any specific situation.",
  "All 'dramatization' dialogue is invented composite illustration written for readability. Speaker names are fictional. Facts, citations, legal holdings, and verbatim quotes are real; the dialogue is not.",
];

const DE_IDENTIFICATION_NOTICE =
  "Individual bloggers/essayists behind these quotes are de-identified by default (generic source_desc, no names or links) pending direct outreach for permission. Aggregate sources (publications, academic research) carry full attribution. Do not attempt to re-identify de-identified sources.";

let problems = 0;
function warn(msg) {
  problems++;
  console.error(`WARN: ${msg}`);
}
function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

// The datasets are plain browser scripts declaring consts, not modules.
// Evaluate each in an isolated VM context and capture the named bindings
// via the script's completion value. The leading newline matters: without
// it, a trailing `//` comment in the data file would swallow the capture.
function loadDataFile(filename, bindings) {
  const src = readFileSync(join(ROOT, filename), "utf8");
  const capture = `\n;({ ${bindings.join(", ")} })`;
  let result;
  try {
    result = vm.runInNewContext(src + capture, {}, { filename });
  } catch (err) {
    fail(`${filename} failed to evaluate — fix the dataset before exporting.\n  ${err.message}`);
  }
  if (!result || typeof result !== "object") {
    fail(`${filename}: could not capture expected bindings (${bindings.join(", ")}).`);
  }
  return result;
}

// Copy exactly the allowlisted fields. Warns on unknown fields (schema grew
// — extend the export deliberately, don't drop data silently) and on missing
// required ones (dataset entry is malformed — would export a broken record).
function pick(obj, where, { required = [], optional = [] }) {
  const out = {};
  const known = new Set([...required, ...optional]);
  for (const key of Object.keys(obj)) {
    if (!known.has(key)) warn(`${where}: unknown field "${key}" is NOT exported — update tools/build-export.mjs if it should be.`);
  }
  for (const key of required) {
    if (obj[key] === undefined) warn(`${where}: required field "${key}" is missing.`);
    else out[key] = obj[key];
  }
  for (const key of optional) {
    if (obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
}

function expectOneOf(value, allowed, where) {
  if (!allowed.includes(value)) {
    warn(`${where}: "${value}" is not one of the documented values (${allowed.join(", ")}).`);
  }
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) counts[item[key]] = (counts[item[key]] || 0) + 1;
  return counts;
}

function sha256(filename) {
  return createHash("sha256").update(readFileSync(join(ROOT, filename))).digest("hex");
}

const cited = loadDataFile("data.js", [
  "CATEGORIES",
  "CATEGORY_DESCRIPTIONS",
  "EPISODES",
]);

const sim = loadDataFile("simulated-data.js", [
  "SIM_CATEGORIES",
  "SIM_CATEGORY_DESCRIPTIONS",
  "SHARED_WITH_CITED",
  "CONDITIONS",
  "OUTCOME_LABEL",
  "TRACKING_SINCE",
  "PAIN_POINTS",
]);

// ---- cited.json -----------------------------------------------------------

function mapDramatization(lines, where) {
  return lines.map((l, i) => {
    const out = pick(l, `${where}.dramatization[${i}]`, {
      required: ["speaker", "role", "line"],
      optional: ["tag"],
    });
    if (out.tag) {
      out.tag = pick(out.tag, `${where}.dramatization[${i}].tag`, { required: ["id", "status"] });
      expectOneOf(out.tag.status, ["violated", "honored"], `${where}.dramatization[${i}].tag.status`);
    }
    return out;
  });
}

const citedEpisodeCounts = countBy(cited.EPISODES, "category");

const citedExport = {
  dataset: "cited",
  schema_version: SCHEMA_VERSION,
  source_repository: REPO_URL,
  license: LICENSE_NOTE,
  evidence_tier: {
    name: "Cited",
    description:
      "Real, adjudicated IDEA case law. Every episode is grounded in an actual court or administrative decision, with citation and source URL. Facts, rules, and holdings are real; dramatization dialogue is invented composite illustration of those real facts.",
  },
  disclaimers: SHARED_DISCLAIMERS,
  stats: {
    episodes: cited.EPISODES.length,
    categories: Object.keys(cited.CATEGORIES).length,
  },
  categories: Object.keys(cited.CATEGORIES).map((id) => ({
    id,
    name: cited.CATEGORIES[id],
    description: cited.CATEGORY_DESCRIPTIONS[id],
    episode_count: citedEpisodeCounts[id] || 0,
  })),
  episodes: cited.EPISODES.map((ep) => {
    const where = `data.js episode "${ep.id}"`;
    const out = pick(ep, where, {
      required: ["id", "category", "severity", "source", "facts", "rule", "takeaway", "dramatization"],
    });
    expectOneOf(out.severity, ["high", "medium", "low"], `${where}.severity`);
    if (!cited.CATEGORIES[out.category]) warn(`${where}: category "${out.category}" is not in CATEGORIES.`);
    out.source = pick(out.source, `${where}.source`, { required: ["case", "citation", "url"] });
    out.dramatization = mapDramatization(out.dramatization, where);
    return out;
  }),
};

// ---- simulated.json -------------------------------------------------------

const simPainPointCounts = countBy(sim.PAIN_POINTS, "category");
const conditionIds = sim.CONDITIONS.map((c) => c.id);
const outcomeIds = Object.keys(sim.OUTCOME_LABEL);

function mapRealSource(src, where) {
  expectOneOf(src.type, ["individual", "aggregate"], `${where}.type`);
  if (src.type === "individual") {
    // De-identification tripwire: an individual source must never ship with
    // attribution. If the dataset ever carries these (e.g. staged for
    // outreach), the export refuses to build rather than leaking them.
    for (const field of ["author", "publication", "url"]) {
      if (src[field] !== undefined) {
        fail(`${where}: individual (de-identified) source carries "${field}" — refusing to export it. Individual sources must stay de-identified (see OUTREACH-NOTES.md).`);
      }
    }
    return pick(src, where, { required: ["type", "date_added", "source_desc", "quote"] });
  }
  return pick(src, where, {
    required: ["type", "date_added", "author", "publication", "quote"],
    optional: ["url"],
  });
}

const simulatedExport = {
  dataset: "simulated",
  schema_version: SCHEMA_VERSION,
  source_repository: REPO_URL,
  license: LICENSE_NOTE,
  evidence_tier: {
    name: "Simulated",
    description:
      "Real parent/student/community accounts (verbatim quotes) that were never litigated, paired with simulated extrapolations ('runs') of each pattern under three standard conditions. The quotes are real evidence; the runs are illustrative simulation, not evidence.",
  },
  de_identification_notice: DE_IDENTIFICATION_NOTICE,
  disclaimers: SHARED_DISCLAIMERS,
  tracking_since: sim.TRACKING_SINCE,
  stats: {
    pain_points: sim.PAIN_POINTS.length,
    categories: Object.keys(sim.SIM_CATEGORIES).length,
    real_sources: sim.PAIN_POINTS.reduce((n, p) => n + p.real_sources.length, 0),
  },
  conditions: sim.CONDITIONS.map((c, i) =>
    pick(c, `simulated-data.js CONDITIONS[${i}]`, { required: ["id", "label", "desc"] })
  ),
  outcome_labels: sim.OUTCOME_LABEL,
  categories: Object.keys(sim.SIM_CATEGORIES).map((id) => ({
    id,
    name: sim.SIM_CATEGORIES[id],
    description: sim.SIM_CATEGORY_DESCRIPTIONS[id],
    // Cross-tier link: the Cited episode covering the same underlying legal
    // issue, or null if no Cited counterpart exists yet.
    shared_with_cited_episode: sim.SHARED_WITH_CITED[id] ?? null,
    pain_point_count: simPainPointCounts[id] || 0,
  })),
  pain_points: sim.PAIN_POINTS.map((p) => {
    const where = `simulated-data.js pain point "${p.id}"`;
    const out = pick(p, where, {
      required: ["id", "category", "date_added", "real_sources", "pattern_summary", "takeaway", "runs"],
    });
    if (!sim.SIM_CATEGORIES[out.category]) warn(`${where}: category "${out.category}" is not in SIM_CATEGORIES.`);
    out.real_sources = out.real_sources.map((s, i) => mapRealSource(s, `${where}.real_sources[${i}]`));
    out.runs = out.runs.map((r, i) => {
      const run = pick(r, `${where}.runs[${i}]`, { required: ["condition", "outcome", "dramatization"] });
      expectOneOf(run.condition, conditionIds, `${where}.runs[${i}].condition`);
      expectOneOf(run.outcome, outcomeIds, `${where}.runs[${i}].outcome`);
      run.dramatization = mapDramatization(run.dramatization, `${where}.runs[${i}]`);
      return run;
    });
    return out;
  }),
};

// ---- manifest.json --------------------------------------------------------

const manifest = {
  name: "IEP Process Simulator — dataset export",
  schema_version: SCHEMA_VERSION,
  source_repository: REPO_URL,
  documentation: `${REPO_URL}/blob/main/export/README.md`,
  license: LICENSE_NOTE,
  evidence_tiers_note:
    "Cited and Simulated are deliberately separate files and separate evidence tiers. A consumer should never blend them without preserving which tier a claim came from. In both tiers, 'dramatization' dialogue is invented composite illustration, not quoted testimony; in Simulated, the 'runs' are simulated extrapolation, not evidence.",
  // Machine-readable freshness: these change if and only if the underlying
  // datasets change. Compare against a previously fetched manifest to detect
  // updates without needing git history.
  source_data_sha256: {
    "data.js": sha256("data.js"),
    "simulated-data.js": sha256("simulated-data.js"),
  },
  files: {
    "cited.json": {
      url: `${RAW_BASE}/cited.json`,
      tier: "cited",
      tier_description: citedExport.evidence_tier.description,
      records: citedExport.stats.episodes,
      categories: citedExport.stats.categories,
    },
    "simulated.json": {
      url: `${RAW_BASE}/simulated.json`,
      tier: "simulated",
      tier_description: simulatedExport.evidence_tier.description,
      records: simulatedExport.stats.pain_points,
      categories: simulatedExport.stats.categories,
    },
  },
};

// ---- write / check --------------------------------------------------------

const outputs = {
  "cited.json": citedExport,
  "simulated.json": simulatedExport,
  "manifest.json": manifest,
};

if (problems > 0) {
  console.error(`${problems} problem(s) above — export not written. Fix the dataset (or extend this script) first.`);
  process.exit(1);
}

const checkMode = process.argv.includes("--check");
let stale = false;

if (!checkMode) mkdirSync(EXPORT_DIR, { recursive: true });

for (const [name, obj] of Object.entries(outputs)) {
  const path = join(EXPORT_DIR, name);
  const next = JSON.stringify(obj, null, 2) + "\n";
  if (checkMode) {
    // Normalize line endings so a CRLF checkout doesn't masquerade as drift.
    const current = existsSync(path)
      ? readFileSync(path, "utf8").replaceAll("\r\n", "\n")
      : null;
    if (current !== next) {
      console.error(`STALE: export/${name} does not match the current datasets.`);
      stale = true;
    }
  } else {
    writeFileSync(path, next);
    console.log(`wrote export/${name}`);
  }
}

if (checkMode) {
  if (stale) {
    console.error("Run `node tools/build-export.mjs` and commit the result.");
    process.exit(1);
  }
  console.log("export/ is up to date with the datasets.");
}
