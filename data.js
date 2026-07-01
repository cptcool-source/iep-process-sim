// IEP Process Simulator — Phase 1b dataset
//
// One structured array of real, cited episodes. Each episode carries:
//   - the real case facts and legal rule (for the Case File view)
//   - a short dramatization of those facts as meeting dialogue (for the
//     Simulated Meeting view)
// Both views render from the SAME episode object — nothing is duplicated.
//
// Names and dialogue in the "dramatization" field are invented composites
// for readability. The facts, citations, and legal holdings are real.
// See README.md for the full source list and what's still pending
// case-law backing (records access, confidentiality, informed consent,
// understandable language, independent educational evaluation).

const CATEGORIES = {
  predetermination:   "Predetermination",
  "missing-member":   "Missing Required Team Member",
  participation:      "Parent Participation",
  "due-process":      "Right to Challenge (Notice)",
  stayput:            "\"Stay Put\" Rights",
  "child-find":       "Child Find / Duty to Evaluate",
  retaliation:        "Retaliation Against Parents",
  "burden-of-proof":  "Burden of Proof in Disputes",
};

const CATEGORY_DESCRIPTIONS = {
  predetermination:   "The team decides the outcome before the meeting, instead of weighing the child's actual evidence.",
  "missing-member":   "A legally required role is missing from the IEP team, regardless of what the plan itself says.",
  participation:      "The parent isn't meaningfully included in the decisions, only informed of them afterward.",
  "due-process":      "Parents are never told they have the right to formally challenge the plan.",
  stayput:            "What happens to the child's placement while a disagreement is still being resolved.",
  "child-find":       "The school fails to evaluate a suspected disability that's already been directly raised.",
  retaliation:        "The school responds to a parent asserting their rights with punitive action.",
  "burden-of-proof":  "Who has to prove the plan is wrong once a dispute reaches a formal hearing.",
};

const EPISODES = [
  {
    id: "predetermination-deal",
    category: "predetermination",
    severity: "high",
    source: {
      case: "Deal v. Hamilton County Board of Education",
      citation: "392 F.3d 840 (6th Cir. 2004)",
      url: "https://www.wrightslaw.com/law/caselaw/04/6th.deal.hamilton.tn.htm",
    },
    facts: "The school district had an unofficial policy of refusing to consider intensive Lovaas-style ABA therapy for autistic students, regardless of the individual child's needs or the evidence from his private program. The IEP team meeting went forward, but the administrative law judge found 191 facts showing the outcome had already been decided before anyone sat down.",
    rule: "Predetermining an outcome before the IEP meeting - deciding based on a blanket policy instead of the child's individual evidence - is itself a procedural violation of IDEA, independent of whether the outcome would otherwise have been appropriate. It deprives the parents of meaningful participation, which the court found was enough on its own to deny a FAPE.",
    takeaway: "If the team's mind was made up before the meeting started, it doesn't matter how the meeting goes from there - that's already a legal violation.",
    dramatization: [
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "We've reviewed everything, and per our program model, we don't provide intensive one-on-one ABA services in this district. That's just not something we offer." },
      { speaker: "Dana Reyes", role: "Parent", line: "You haven't asked anything about what's actually worked for him. He's been in a home ABA program for over a year with real progress." },
      { speaker: "Mr. Alvarez", role: "Special Ed Teacher", line: "For what it's worth, that reads to me like a policy decision from above us, not something based on his individual file.", tag: { id: "predetermination", status: "violated" } },
    ],
  },
  {
    id: "missing-member-ml",
    category: "missing-member",
    severity: "high",
    source: {
      case: "M.L. v. Federal Way School District",
      citation: "394 F.3d 634 (9th Cir. 2004)",
      url: "https://www.wrightslaw.com/law/caselaw/04/9d.ml.fedway.wa.htm",
    },
    facts: "The IEP team met and developed a plan without a regular education teacher present, even though the student spent part of his day in a general education classroom.",
    rule: "IDEA requires at least one regular education teacher on the IEP team whenever the child is, or may be, participating in the general education environment. The court called the omission a \"structural defect\" serious enough that it precluded even asking whether the resulting IEP was adequate - the team was missing the expertise on general curriculum and environment that role is meant to provide.",
    takeaway: "Who's required to be in the room isn't a formality - a legally required role missing from the table can invalidate the whole plan, independent of what the plan actually says.",
    dramatization: [
      { speaker: "Dana Reyes", role: "Parent", line: "Wait - is anyone here from his regular classroom? He's mainstreamed for half the day." },
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "We didn't think that was necessary for this particular meeting." },
      { speaker: "Mr. Alvarez", role: "Special Ed Teacher", line: "Actually, IDEA requires a regular ed teacher on the team whenever the student may participate in general ed - that's not something we can skip.", tag: { id: "missing-member", status: "violated" } },
    ],
  },
  {
    id: "participation-dougc",
    category: "participation",
    severity: "high",
    source: {
      case: "Doug C. v. Hawaii Department of Education",
      citation: "720 F.3d 1038 (9th Cir. 2013)",
      url: "https://www.wrightslaw.com/nltr/13/nl.0702.htm",
    },
    facts: "The agency had trouble scheduling a meeting with the father and proceeded to finalize the IEP without him. He was informed of the completed plan afterward rather than being part of developing it.",
    rule: "The Ninth Circuit held that scheduling difficulty does not excuse proceeding without a parent who has expressed willingness to participate - an agency \"cannot eschew its affirmative duties under IDEA by blaming the parents.\" Briefing a parent on an IEP after it's already adopted does not satisfy the participation requirement.",
    takeaway: "The parent has to be there before decisions are made, not briefed on them after. 'We tried to find a time' isn't a legal exception if the meeting happens anyway.",
    dramatization: [
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "We had a hard time finding a date that worked with your schedule, so we went ahead and finalized the IEP. I can walk you through it with you now." },
      { speaker: "Dana Reyes", role: "Parent", line: "I told you I was willing to meet - I just needed about a week's notice. Nobody followed up." },
      { speaker: "Mr. Alvarez", role: "Special Ed Teacher", line: "Going over it with you now honestly isn't the same as you being part of deciding it in the first place.", tag: { id: "participation", status: "violated" } },
    ],
  },
  {
    id: "due-process-jaynes",
    category: "due-process",
    severity: "high",
    source: {
      case: "Jaynes v. Newport News Public Schools",
      citation: "4th Cir. (2001)",
      url: "https://www.wrightslaw.com/advoc/articles/anatomy_case_jaynes.htm",
    },
    facts: "A family with an autistic child providing intensive home-based ABA/Lovaas services was never informed of their right to a due process hearing to challenge the school's IEP. The mother had signed a \"consent to testing\" form without being told about her broader parental rights in the process.",
    rule: "The hearing officer found the school's repeated failure to notify the parents of their right to challenge the IEP through due process was itself a procedural violation that denied FAPE - the family had \"seriously infringed\" participation rights. The district was ordered to pay $117,979.78 in legal and educational reimbursement costs.",
    takeaway: "Getting a form to sign isn't the same as being told your rights. If nobody mentions you can formally challenge this, that silence is the violation - and it can get expensive for the district.",
    dramatization: [
      { speaker: "Dr. Novak", role: "Evaluator", line: "Here's the consent form for testing - if you could just sign here, we can get started." },
      { speaker: "Dana Reyes", role: "Parent", line: "Before I sign - what exactly am I agreeing to, and what are my options if I disagree with the results later?" },
      { speaker: "Dr. Novak", role: "Evaluator", line: "Let's just get the testing scheduled first and we can sort out the rest later.", tag: { id: "due-process", status: "violated" } },
    ],
  },
  {
    id: "stayput-burlington",
    category: "stayput",
    severity: "medium",
    source: {
      case: "Burlington School Committee v. Massachusetts Dept. of Education",
      citation: "471 U.S. 359 (1985)",
      url: "https://supreme.justia.com/cases/federal/us/471/359/",
    },
    facts: "Parents disagreed with the school's proposed IEP and unilaterally moved their child to a different placement while the dispute was still pending, ahead of any final ruling.",
    rule: "The Supreme Court held (9-0) that a parent moving a child during a pending dispute does not automatically forfeit reimbursement rights - courts retain authority to order retroactive reimbursement if the private placement is later found appropriate. Reimbursement is only barred for the interim period if the original IEP is ultimately found adequate.",
    takeaway: "Stay-put protects the status quo during a dispute, but acting to protect your kid mid-disagreement doesn't automatically cost you your rights if you're later proven right.",
    dramatization: [
      { speaker: "Dana Reyes", role: "Parent", line: "I don't agree with this placement. I'm moving him to a program I trust while we get this sorted out." },
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "If you do that against our recommendation, you could end up losing any right to be reimbursed for it later." },
      { speaker: "Mr. Alvarez", role: "Special Ed Teacher", line: "That's not quite right, actually - courts have held that doesn't automatically waive reimbursement if the placement is later found appropriate.", tag: { id: "stayput", status: "violated" } },
    ],
  },
  {
    id: "childfind-phyllene",
    category: "child-find",
    severity: "high",
    source: {
      case: "Phyllene W. v. Huntsville City Board of Education",
      citation: "11th Cir. (2015)",
      url: "https://law.justia.com/cases/federal/appellate-courts/ca11/15-10123/15-10123-2015-10-30.html",
    },
    facts: "Both the parent and the child's own classroom teacher told the school the child appeared to be experiencing hearing loss. The school never followed up or evaluated her for it.",
    rule: "The Eleventh Circuit found the district violated IDEA's Child Find duty by failing to evaluate when faced with evidence of a suspected disability from both a parent and staff. Without that evaluation, no meaningful IEP could be built - the court found the resulting IEPs categorically lacked the services she needed.",
    takeaway: "If a parent or teacher directly raises a concern, 'let's keep monitoring' isn't a neutral holding pattern - it's the specific failure IDEA calls Child Find, and it can void the IEPs built without the missing evaluation.",
    dramatization: [
      { speaker: "Dana Reyes", role: "Parent", line: "I've mentioned twice now that I think he's not hearing things clearly in the classroom." },
      { speaker: "Mr. Alvarez", role: "Special Ed Teacher", line: "For what it's worth, I've noticed the same thing - he asks people to repeat themselves a lot." },
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "Let's keep an eye on it and revisit next semester if it's still a concern.", tag: { id: "child-find", status: "violated" } },
    ],
  },
  {
    id: "retaliation-ac",
    category: "retaliation",
    severity: "high",
    source: {
      case: "A.C. v. Shelby County Board of Education",
      citation: "6th Cir. (2013)",
      url: "https://www.wrightslaw.com/law/caselaw/2013/case.6th.cir.504retaliation.original.pdf",
    },
    facts: "After a parent formally asserted their child's Section 504 rights, a school principal responded by filing false child-abuse allegations against the parents.",
    rule: "The Sixth Circuit held that schools cannot take adverse action against parents in retaliation for asserting disability-rights protections. A retaliation claim can proceed independently of whatever the underlying services dispute was about.",
    takeaway: "Asserting your rights is protected activity. If the response to a parent pushing for services is punitive rather than substantive, that's its own separate legal problem - not just an unpleasant meeting.",
    dramatization: [
      { speaker: "Dana Reyes", role: "Parent", line: "I'm formally requesting the accommodations we discussed be added to his file in writing." },
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "Understood. Separately, I do want to mention some concerns have come up about your household that we may need to look into.", tag: { id: "retaliation", status: "violated" } },
      { speaker: "Mr. Alvarez", role: "Special Ed Teacher", line: "...I don't think that's related to what she just asked for." },
    ],
  },
  {
    id: "burden-schaffer",
    category: "burden-of-proof",
    severity: "medium",
    source: {
      case: "Schaffer v. Weast",
      citation: "546 U.S. 49 (2005)",
      url: "https://supreme.justia.com/cases/federal/us/546/49/",
    },
    facts: "Parents disagreed with an IEP and requested a due process hearing, working from the common assumption (accurate in most jurisdictions before this case) that the school district would have to justify its own IEP by default.",
    rule: "The Supreme Court held that the burden of proof at a due process hearing challenging an IEP falls on whichever party brought the challenge - usually the parent - not on the school district by default. This was a significant shift from the prior common practice in most jurisdictions.",
    takeaway: "If you're the one challenging the plan, you're the one who has to prove it's wrong. Walking into a hearing assuming the district has to justify itself first is a real, common misunderstanding worth correcting before you're in the room.",
    dramatization: [
      { speaker: "Dana Reyes", role: "Parent", line: "I disagree with this evaluation, so I want to request a hearing - you'll need to show why your version is correct." },
      { speaker: "Ms. Whitfield", role: "LEA Rep", line: "Actually, once you request the hearing, the legal burden is on you to show the IEP is inappropriate, not on us to defend it by default.", tag: { id: "burden-of-proof", status: "honored" } },
      { speaker: "Dana Reyes", role: "Parent", line: "I didn't realize that. That changes how I need to prepare for this." },
    ],
  },
];
