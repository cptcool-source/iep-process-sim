// IEP Process Simulator — Simulated track rendering logic
// Aggregate grid (pain point x condition) + pain-point detail with
// real sources, pattern summary, takeaway, and per-condition dramatization.

let activePainPointId = PAIN_POINTS[0].id;
let activeConditionId = CONDITIONS[0].id;

const NEW_BADGE_WINDOW_DAYS = 30;

function getPainPoint(id) {
  return PAIN_POINTS.find(p => p.id === id);
}

function getRun(painPoint, conditionId) {
  return painPoint.runs.find(r => r.condition === conditionId);
}

function daysSince(dateStr) {
  const then = new Date(dateStr + "T00:00:00");
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function isRecent(dateStr) {
  return daysSince(dateStr) <= NEW_BADGE_WINDOW_DAYS;
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// Flat, sorted (most recent first) list of every pain-point-added and
// source-added event, for the growth counter and "Recently added" feed.
function getAllEvents() {
  const events = [];
  PAIN_POINTS.forEach(pp => {
    events.push({ date: pp.date_added, kind: "pain-point", painPointId: pp.id, label: `New pain point: ${SIM_CATEGORIES[pp.category]}` });
    pp.real_sources.forEach(s => {
      if (s.date_added !== pp.date_added) {
        events.push({ date: s.date_added, kind: "source", painPointId: pp.id, label: `New source added to: ${SIM_CATEGORIES[pp.category]}` });
      }
    });
  });
  return events.sort((a, b) => b.date.localeCompare(a.date));
}

function renderGrowthBar() {
  const totalPainPoints = PAIN_POINTS.length;
  const totalSources = PAIN_POINTS.reduce((sum, pp) => sum + pp.real_sources.length, 0);
  const earliest = PAIN_POINTS.reduce((min, pp) => pp.date_added < min ? pp.date_added : min, TRACKING_SINCE);
  document.getElementById("growth-bar").innerHTML = `
    <strong>${totalPainPoints}</strong> pain points &middot;
    <strong>${totalSources}</strong> real sources &middot;
    tracked since <strong>${formatDate(earliest)}</strong>
  `;
}

function renderRecentFeed() {
  const events = getAllEvents().slice(0, 5);
  const feed = document.getElementById("recent-feed");
  feed.innerHTML = events.map(e => `
    <button class="recent-item" data-pain-point="${e.painPointId}">
      <span class="recent-item__date">${formatDate(e.date)}</span>
      <span class="recent-item__label">${e.label}</span>
    </button>
  `).join("");
  feed.querySelectorAll(".recent-item").forEach(btn => {
    btn.addEventListener("click", () => selectPainPoint(btn.dataset.painPoint, activeConditionId));
  });
}

function renderGrid() {
  const grid = document.getElementById("sim-grid");
  grid.innerHTML = "";

  const headerRow = document.createElement("div");
  headerRow.className = "grid-row grid-header";
  headerRow.appendChild(cell("", "grid-corner"));
  CONDITIONS.forEach(c => headerRow.appendChild(cell(c.label, "grid-col-label")));
  grid.appendChild(headerRow);

  PAIN_POINTS.forEach(pp => {
    const row = document.createElement("div");
    row.className = "grid-row";
    const label = cell(SIM_CATEGORIES[pp.category], "grid-row-label");
    row.appendChild(label);

    CONDITIONS.forEach(c => {
      const run = getRun(pp, c.id);
      const el = cell("", "grid-cell");
      el.classList.add("outcome-" + run.outcome);
      el.textContent = OUTCOME_LABEL[run.outcome][0];
      el.title = `${SIM_CATEGORIES[pp.category]} — ${c.label}: ${OUTCOME_LABEL[run.outcome]}`;
      el.tabIndex = 0;
      el.addEventListener("click", () => selectPainPoint(pp.id, c.id));
      el.addEventListener("keypress", e => { if (e.key === "Enter") selectPainPoint(pp.id, c.id); });
      row.appendChild(el);
    });

    grid.appendChild(row);
  });
}

function cell(text, className) {
  const div = document.createElement("div");
  div.className = className;
  div.textContent = text;
  return div;
}

function renderPainPointList() {
  const list = document.getElementById("pain-point-list");
  list.innerHTML = "";
  PAIN_POINTS.forEach(pp => {
    const card = document.createElement("button");
    card.className = "episode-card" + (pp.id === activePainPointId ? " active" : "");
    const sharedNote = SHARED_WITH_CITED[pp.category]
      ? `<span class="shared-note">Shares issue w/ Cited</span>`
      : "";
    const newBadge = isRecent(pp.date_added) ? `<span class="new-badge">NEW</span>` : "";
    card.innerHTML = `
      <span class="episode-category">${SIM_CATEGORIES[pp.category]}${newBadge}</span>
      <span class="episode-desc">${SIM_CATEGORY_DESCRIPTIONS[pp.category]}</span>
      ${sharedNote}
    `;
    card.addEventListener("click", () => selectPainPoint(pp.id, activeConditionId));
    list.appendChild(card);
  });
}

function renderConditionTabs() {
  const tabs = document.getElementById("condition-tabs");
  tabs.innerHTML = "";
  CONDITIONS.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "tab" + (c.id === activeConditionId ? " active" : "");
    btn.textContent = c.label;
    btn.title = c.desc;
    btn.addEventListener("click", () => selectPainPoint(activePainPointId, c.id));
    tabs.appendChild(btn);
  });
}

function renderSourcesHtml(pp) {
  const count = pp.real_sources.length;
  const strengthLine = count > 1
    ? `<p class="source-strength">Confirmed by ${count} independent sources</p>`
    : "";
  const sources = pp.real_sources.map(s => {
    const attribution = s.type === "aggregate"
      ? `&mdash; <a href="${s.url}" target="_blank" rel="noopener">${s.author}</a>, <em>${s.publication}</em>`
      : `&mdash; <em>${s.source_desc}</em>`;
    const badge = s.type === "aggregate" ? "Aggregate/anonymized source" : "Individual account (de-identified)";
    const newBadge = isRecent(s.date_added) ? `<span class="new-badge">NEW</span>` : "";
    return `
    <div class="real-source">
      <p class="real-source__quote">&ldquo;${s.quote}&rdquo;${newBadge}</p>
      <p class="real-source__attr">
        ${attribution}
        <span class="source-type source-type--${s.type}">${badge}</span>
      </p>
    </div>
  `;
  }).join("");
  return strengthLine + sources;
}

function renderDetail() {
  const pp = getPainPoint(activePainPointId);
  const run = getRun(pp, activeConditionId);
  const condition = CONDITIONS.find(c => c.id === activeConditionId);

  const lines = run.dramatization.map(line => `
    <div class="line">
      <div class="speaker"><strong>${line.speaker}</strong><span class="role-badge">${line.role}</span></div>
      <div class="text">${line.line}</div>
    </div>
  `).join("");

  document.getElementById("pain-point-detail").innerHTML = `
    <header class="case-file__header">
      <span class="episode-category">${SIM_CATEGORIES[pp.category]}</span>
      <h3>Real pattern</h3>
    </header>
    <section>
      <p>${pp.pattern_summary}</p>
    </section>
    <section>
      ${renderSourcesHtml(pp)}
    </section>
    <section class="takeaway">
      <h4>Takeaway</h4>
      <p>${pp.takeaway}</p>
    </section>

    <div class="dramatization-notice">
      Simulated extrapolation seeded from the real pattern above &mdash; condition: <strong>${condition.label}</strong> (${condition.desc}). Names and dialogue are invented.
    </div>
    <div class="transcript">${lines}</div>
    <div class="outcome-badge outcome-${run.outcome}">${OUTCOME_LABEL[run.outcome]}</div>
  `;
}

function selectPainPoint(painPointId, conditionId) {
  activePainPointId = painPointId;
  activeConditionId = conditionId;
  renderPainPointList();
  renderConditionTabs();
  renderDetail();
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrowthBar();
  renderRecentFeed();
  renderGrid();
  renderPainPointList();
  renderConditionTabs();
  renderDetail();
});
