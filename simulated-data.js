// IEP Process Simulator — Simulated track (Phase 1c/1d)
//
// Different evidence tier than Cited: these are real parent/community pain
// points pulled from blogs, essays, academic research, and one aggregated/
// anonymized community piece — NOT adjudicated case law. Each pain point's
// quotes are real and verbatim. The "runs" are simulated extrapolations
// seeded from that real pattern, run under three standard conditions, to
// look for which conditions most often produce a breakdown vs. a resolution.
//
// DE-IDENTIFIED BY DESIGN (as of the current pass): individual bloggers/
// essayists behind these quotes shared real, sometimes painful, personal
// accounts on their own sites without knowing they'd be repurposed as seed
// data for a product. Quotes are kept verbatim (that's the real grounding)
// but names, direct links, and identifying publication details have been
// removed pending direct outreach for permission/involvement. Aggregate
// sources (Understood.org's community piece, academic research studies) are
// publications, not individuals, and are shown with full attribution.
// See README.md for the outreach plan and full original sourcing notes.
//
// Names in the dramatizations (Renee, Maya, Ms. Bell, Mr. Doyle, Dr. Pham)
// are invented composites, distinct from Cited's cast.
//
// GROWTH TRACKING (added this pass): every pain point and every individual
// source carries a `date_added`. This powers the "Recently added" feed, NEW
// badges, and the site-wide growth counter on the page — the visible signal
// that this dataset is actually being maintained by the ingestion pipeline
// (see INGESTION-RUNBOOK.md), not a frozen one-time snapshot.

const SIM_CATEGORIES = {
  "participation":        "Parent Participation Dismissed",
  "predetermination":     "Predetermination",
  "language":             "Jargon / Acronym Overload",
  "records":              "Refusing to Correct Records",
  "cost-barrier":         "Financial Barrier to Advocacy",
  "ableist-goals":        "Ableist Goals & Practices",
  "student-dignity":      "Student Dignity & Voice",
  "unpaid-labor":         "Uncompensated Parental Labor",
  "resource-excuse":      "\"No Staff/Resources\" as a Denial Excuse",
  "interpreter-access":   "Interpreter Access / Language Barrier",
};

const SIM_CATEGORY_DESCRIPTIONS = {
  "participation":        "Parent input treated as secondary, not decision-making.",
  "predetermination":     "Outside evidence dismissed; the outcome was already set.",
  "language":             "Meetings move faster than parents or students can follow.",
  "records":              "School won't correct or remove inaccurate record language.",
  "cost-barrier":         "Rights that functionally require a paid attorney to use.",
  "ableist-goals":        "Goals target masking traits, not the child's real needs.",
  "student-dignity":      "Student talked about, not to — or treated with disrespect.",
  "unpaid-labor":         "Parents doing unpaid coordination work for the district.",
  "resource-excuse":      "A needed service denied by citing staffing, not law.",
  "interpreter-access":   "A right that depends on the parent knowing to request it.",
};

// Shared with a Cited episode's underlying legal issue, even though this
// pattern itself was never litigated. Null = no Cited counterpart (yet).
const SHARED_WITH_CITED = {
  "participation": "participation-dougc",
  "predetermination": "predetermination-deal",
  "language": null,
  "records": null,
  "cost-barrier": null,
  "ableist-goals": null,
  "student-dignity": null,
  "unpaid-labor": null,
  "resource-excuse": null,
  "interpreter-access": null,
};

const CONDITIONS = [
  { id: "unfamiliar", label: "Unfamiliar, no advocate", desc: "Parent/student is new to this process and has no advocate or attorney present." },
  { id: "experienced", label: "Experienced, supported", desc: "Parent/student knows their rights and/or has an advocate present." },
  { id: "under-resourced", label: "Under-resourced / defensive", desc: "District response leans on time, staffing, or policy pressure rather than engaging directly." },
];

const OUTCOME_LABEL = { breakdown: "Breaks down", partial: "Partial", resolved: "Resolves well" };

// First site-wide ingestion pass landed on this date — used as the
// "tracked since" anchor if no pain point predates it.
const TRACKING_SINCE = "2026-06-30";

const PAIN_POINTS = [
  {
    id: "participation-real",
    category: "participation",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Autism-parenting blog (individual account, name withheld pending outreach)", quote: "An IEP meeting has terrain. It has momentum. It has default settings." },
      { type: "individual", date_added: "2026-06-30", source_desc: "Neurodiversity-affirming clinician's blog (individual account, name withheld pending outreach)", quote: "It was the child's meeting, not mine as the parent." },
      { type: "aggregate", date_added: "2026-07-01", author: "Sanderson et al.", publication: "Journal of Research in Special Educational Needs (2023)", url: "https://nasenjournals.onlinelibrary.wiley.com/doi/abs/10.1111/1471-3802.12582", quote: "Power dynamics that impede equal, meaningful participation and partnerships." },
    ],
    pattern_summary: "Parents describe a structural home-field disadvantage: school staff run these meetings routinely, while parents attend rarely, and that imbalance shows up as parent input being treated as secondary or procedural rather than substantive.",
    takeaway: "The legal right to participate doesn't automatically produce meaningful participation in practice. This is the everyday version of the same problem that, at its worst and once litigated, became Doug C. v. Hawaii. A 2023 peer-reviewed study of 614 parents independently confirms the same pattern.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We've already discussed this as a team, so let's move to signatures." },
        { speaker: "Renee Ortiz", role: "Parent", line: "Wait — I wasn't part of that discussion." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "It's mostly a formality at this point." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I'd like that noted as discussed only among staff, not the full team, before we go further." },
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Fair — let's back up and actually walk through it together." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "Honestly we have six of these today, can we move quickly?" },
        { speaker: "Renee Ortiz", role: "Parent", line: "I only have this one. I need us to slow down." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "Okay — five minutes." },
      ]},
    ],
  },
  {
    id: "predetermination-real",
    category: "predetermination",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Neurodiversity-affirming clinician's blog (individual account, name withheld pending outreach)", quote: "Accused of being condescending for citing peer-reviewed studies." },
      { type: "individual", date_added: "2026-06-30", source_desc: "Autism-parenting blog (individual account, name withheld pending outreach)", quote: "Default settings." },
    ],
    pattern_summary: "Parents bring outside evidence — research, private provider input — and describe it being waved off or met with defensiveness rather than genuine consideration.",
    takeaway: "This is the same underlying problem as Deal v. Hamilton County, just caught earlier and never litigated. When a team is defensive about outside evidence instead of curious, predetermination is often happening in real time.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "Here's a study supporting a different approach for him." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We've already decided our approach is working." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Let's actually look at that together before we finalize anything." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "With respect, that's not really relevant to what we do here." },
        { speaker: "Renee Ortiz", role: "Parent", line: "It's directly about what we're discussing." },
      ]},
    ],
  },
  {
    id: "language-real",
    category: "language",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Autism-parenting blog (individual account, name withheld pending outreach)", quote: "Acronyms move faster than grief." },
      { type: "individual", date_added: "2026-06-30", source_desc: "First-person essay by a nonspeaking autistic self-advocate (name withheld pending outreach)", quote: "You all talk really fast, so it makes it sort of hard sometimes." },
    ],
    pattern_summary: "Both parents and students report meetings moving at a pace and register — acronyms, clinical language — that outpaces genuine understanding in the room, even when notice and consent were technically given.",
    takeaway: "Consent and notice being given isn't the same as being understood. One student's own account of a meeting about her makes this concrete: fast, jargon-heavy speech she said outright was hard to follow.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Dr. Pham", role: "Evaluator", line: "The FBA indicated escalating antecedent triggers correlated with sensory dysregulation, so we're proposing a BIP with a token economy." },
        { speaker: "Maya", role: "Student", line: "...I don't know what most of that means." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "Can we pause and go plain-language on that last part?" },
        { speaker: "Dr. Pham", role: "Evaluator", line: "Of course — sorry, let me back up." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Dr. Pham", role: "Evaluator", line: "We're on a tight schedule — I'll send a written summary after." },
        { speaker: "Renee Ortiz", role: "Parent", line: "I'd rather understand it now, while I can still ask questions." },
      ]},
    ],
  },
  {
    id: "records-real",
    category: "records",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Neurodiversity-affirming clinician's blog (individual account, name withheld pending outreach)", quote: "School declined to remove trauma-related language from official records, claiming they 'could not' alter teacher feedback." },
    ],
    pattern_summary: "A parent requests a correction or removal of specific language from official records or notes and is told the school \"can't\" change it, without a clear legal reason given.",
    takeaway: "Parents have a real right to request corrections to education records. If a school says \"we can't\" without explaining why, that's worth pushing on, not accepting at face value.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I want that phrase removed — it mischaracterizes what happened." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We can't alter staff notes." },
      ]},
      { condition: "experienced", outcome: "partial", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I'm formally requesting this correction in writing, per my right to request record amendments." },
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Let me actually look into what we can do here." },
      ]},
      { condition: "under-resourced", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "It's just how it was written up — that's final." },
      ]},
    ],
  },
  {
    id: "cost-barrier-real",
    category: "cost-barrier",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Autism-parenting blog (individual account, name withheld pending outreach)", quote: "Parents are retaining lawyers for $7,000–$10,000. Because the price point represents the level of fear." },
    ],
    pattern_summary: "Parents describe feeling they need to hire an attorney or paid advocate just to be taken seriously or to enforce rights they already have on paper — at a cost many families can't absorb.",
    takeaway: "A right that effectively requires a $7,000+ attorney to exercise isn't equally available to every family. That gap is itself part of the pattern, even when no single meeting technically breaks a rule.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I have a concern about the placement, but I'm not sure how to push further." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We hear you, we'll keep it in mind." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Advocate", role: "Parent Advocate (low/no cost)", line: "I'm here to support Renee today, not to represent against you — just to help make sure everything's covered." },
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Welcome, glad to have you at the table." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "Should I be bringing a lawyer to these?" },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "That's your choice, but most parents don't." },
      ]},
    ],
  },
  {
    id: "ableist-goals-real",
    category: "ableist-goals",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Neurodiversity-affirming clinician's blog (individual account, name withheld pending outreach)", quote: "Goals targeting 'volume of voice' and 'appropriate word choice' — goals the parent identified as promoting masking." },
    ],
    pattern_summary: "IEP goals or in-classroom demands target surface behaviors (eye contact, \"appropriate\" volume or word choice) rather than the child's actual needs, which can push a child toward masking instead of genuine support.",
    takeaway: "A goal like \"maintain eye contact\" or \"appropriate volume\" should be questioned: is this serving the student's actual needs, or training them to perform comfort for the adults in the room?",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Dr. Pham", role: "Evaluator", line: "We'll add a goal for maintaining eye contact during instruction." },
        { speaker: "Renee Ortiz", role: "Parent", line: "That's genuinely distressing for him — can we focus on something else?" },
        { speaker: "Dr. Pham", role: "Evaluator", line: "It's a standard goal we use." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I'd like the goal reframed around comprehension, not eye contact specifically." },
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "That's a reasonable ask — let's adjust it." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Dr. Pham", role: "Evaluator", line: "We can note your concern, but the goal stays as written for now." },
      ]},
    ],
  },
  {
    id: "student-dignity-real",
    category: "student-dignity",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "First-person essay by a nonspeaking autistic self-advocate (name withheld pending outreach)", quote: "I get my presence at this school is barely tolerated. ...I'm not OK with being talked about right in front of me or even worse, being the root of some adult's joke." },
    ],
    pattern_summary: "Students — especially nonspeaking or minimally-speaking students, or those using AAC — describe being talked about in the third person during their own meetings, or treated with open disrespect by staff. One account includes a specific incident: an intervention specialist took the student's AAC device, typed a mocking phrase, and played it aloud for other students.",
    takeaway: "This is the most serious real pattern found and it's about basic dignity, not procedure. A meeting can be legally compliant on paper and still fail a student completely on this front.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "She tends to struggle with transitions, and..." },
        { speaker: "Maya", role: "Student (via AAC)", line: "I am right here. Please talk to me." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "Right, sorry — continuing..." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Maya, we want to hear this from you directly if you're comfortable." },
        { speaker: "Maya", role: "Student (via AAC)", line: "Yes. I want to talk about what I'm good at first." },
      ]},
      { condition: "under-resourced", outcome: "breakdown", dramatization: [
        { speaker: "Dr. Pham", role: "Evaluator", line: "(makes a quiet joke to another staffer about Maya's AAC device voice)" },
        { speaker: "Renee Ortiz", role: "Parent", line: "That's not okay." },
        { speaker: "Dr. Pham", role: "Evaluator", line: "It was just a joke." },
      ]},
    ],
  },
  {
    id: "unpaid-labor-real",
    category: "unpaid-labor",
    date_added: "2026-06-30",
    real_sources: [
      { type: "individual", date_added: "2026-06-30", source_desc: "Autism-parenting blog (individual account, name withheld pending outreach)", quote: "The mistake our culture makes is assuming that a mother's role in therapy, regulation, and advocacy can be outsourced, as if she is merely the driver, the scheduler, the form-filler, the emotional witness sitting outside the real work." },
    ],
    pattern_summary: "Parents describe being treated as unpaid logistics coordinators for their child's services — scheduling, paperwork, being the \"backup regulator\" — rather than being recognized and supported as part of the actual intervention.",
    takeaway: "If a family is quietly doing coordination work that should be the district's responsibility, that's worth naming directly, even though it rarely shows up as a formal violation.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "You'll just need to coordinate with the outside providers and get us their notes." },
        { speaker: "Renee Ortiz", role: "Parent", line: "That's a lot of unpaid coordination on my end." },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "It's usually just how it works." },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Let's actually build provider coordination into our responsibilities, not just yours." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We can only do so much given our caseloads." },
      ]},
    ],
  },
  {
    id: "resource-excuse-real",
    category: "resource-excuse",
    date_added: "2026-06-30",
    real_sources: [
      { type: "aggregate", date_added: "2026-06-30", author: "Understood.org community (anonymized, aggregated by the publication)", publication: "Understood.org, \"Our community weighs in: Crying at IEP meetings\"", url: "https://www.understood.org/en/articles/our-community-weighs-in-crying-at-iep-meetings", quote: "It can be frustrating to hear someone at your child's school tell you it doesn't provide a certain service or doesn't have the staff to implement it." },
    ],
    pattern_summary: "A needed and already-identified service gets declined specifically by citing staffing or resource limits, rather than being formally addressed through the proper process.",
    takeaway: "\"We don't have the staff for that\" is an operational excuse, not a legal answer. This echoes the Child Find pattern from Cited, but here the need was already identified — the failure is in follow-through, not evaluation.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We agree he'd benefit from more frequent OT — we just don't have the staff for it right now." },
        { speaker: "Renee Ortiz", role: "Parent", line: "So what happens?" },
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We'll revisit it later in the year." },
      ]},
      { condition: "experienced", outcome: "partial", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I'd like that documented as an identified need with a specific plan and date to revisit — not left open-ended." },
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "That's fair, let's put a date on it." },
      ]},
      { condition: "under-resourced", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "It's a district-wide staffing shortage. It's out of our hands here." },
      ]},
    ],
  },
  {
    id: "interpreter-access-real",
    category: "interpreter-access",
    date_added: "2026-07-01",
    real_sources: [
      { type: "aggregate", date_added: "2026-07-01", author: "Center for Parent Information and Resources", publication: "\"Is an Interpreter Needed at the IEP Meeting?\" (federally-funded parent center, OSEP)", url: "https://www.parentcenterhub.org/interpreter/", quote: "Parents must proactively inform schools beforehand about interpreter needs, as this allows time for districts to arrange appropriate services before the meeting occurs." },
    ],
    pattern_summary: "Federal law (IDEA §300.322(e)) requires schools to arrange interpreters for parents who are deaf or whose native language isn't English, but the obligation is parent-initiated in practice — if a parent doesn't know to request one in advance, or the district treats it as optional, the meeting proceeds without meaningful comprehension. Over 350,000 special-ed students nationally have a parent with limited English proficiency (77% Spanish-speaking, followed by Vietnamese, Hmong, Korean, and Arabic).",
    takeaway: "This right depends on the parent already knowing to ask for it. A requirement that only works if you know to invoke it isn't equally available to everyone it's supposed to protect.",
    runs: [
      { condition: "unfamiliar", outcome: "breakdown", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "Our front-office aide speaks some Spanish, she can help translate today." },
        { speaker: "Renee Ortiz", role: "Parent", line: "(nods, unsure exactly what was just proposed)" },
      ]},
      { condition: "experienced", outcome: "resolved", dramatization: [
        { speaker: "Renee Ortiz", role: "Parent", line: "I requested a qualified interpreter a week ago for today's meeting." },
        { speaker: "Mr. Doyle", role: "LEA Rep", line: "Yes, she's on the call with us now — thanks for the advance notice." },
      ]},
      { condition: "under-resourced", outcome: "partial", dramatization: [
        { speaker: "Ms. Bell", role: "Special Ed Teacher", line: "We couldn't arrange an interpreter on this short notice, but we can go slowly and use simple terms." },
        { speaker: "Renee Ortiz", role: "Parent", line: "I'd still rather reschedule until a real interpreter is available." },
      ]},
    ],
  },
];
