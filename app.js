// IEP Process Simulator — Phase 1b rendering logic
// Two views render from the SAME episode data: Case File and Simulated Meeting.
// Switching the view keeps you on the same episode.

let activeEpisodeId = EPISODES[0].id;
let activeView = "case-file"; // "case-file" | "simulated-meeting"

const SEVERITY_LABEL = { high: "High severity", medium: "Medium severity", low: "Low severity" };
const STATUS_LABEL = { honored: "Correctly handled", partial: "Partial / mixed", violated: "Violated" };

function getEpisode(id) {
  return EPISODES.find(e => e.id === id);
}

function renderEpisodeList() {
  const list = document.getElementById("episode-list");
  list.innerHTML = "";
  EPISODES.forEach(ep => {
    const card = document.createElement("button");
    card.className = "episode-card" + (ep.id === activeEpisodeId ? " active" : "");
    card.innerHTML = `
      <span class="episode-category">${CATEGORIES[ep.category]}</span>
      <span class="episode-desc">${CATEGORY_DESCRIPTIONS[ep.category]}</span>
      <span class="episode-severity severity-${ep.severity}">${SEVERITY_LABEL[ep.severity]}</span>
    `;
    card.addEventListener("click", () => selectEpisode(ep.id));
    list.appendChild(card);
  });
}

function renderViewToggle() {
  document.getElementById("view-case-file").classList.toggle("active", activeView === "case-file");
  document.getElementById("view-simulated-meeting").classList.toggle("active", activeView === "simulated-meeting");
}

function renderCaseFile(ep) {
  return `
    <article class="case-file">
      <header class="case-file__header">
        <span class="episode-category">${CATEGORIES[ep.category]}</span>
        <h3>${ep.source.case}</h3>
        <p class="case-file__citation">
          <a href="${ep.source.url}" target="_blank" rel="noopener">${ep.source.citation}</a>
          &nbsp;&middot;&nbsp; <span class="severity-${ep.severity}">${SEVERITY_LABEL[ep.severity]}</span>
        </p>
      </header>
      <section>
        <h4>What happened</h4>
        <p>${ep.facts}</p>
      </section>
      <section>
        <h4>What the law requires</h4>
        <p>${ep.rule}</p>
      </section>
      <section class="takeaway">
        <h4>Takeaway</h4>
        <p>${ep.takeaway}</p>
      </section>
    </article>
  `;
}

function renderSimulatedMeeting(ep) {
  const lines = ep.dramatization.map(line => {
    const tagHtml = line.tag
      ? `<div class="tag-badge status-${line.tag.status}">${CATEGORIES[line.tag.id]} &mdash; ${STATUS_LABEL[line.tag.status]}</div>`
      : "";
    return `
      <div class="line">
        <div class="speaker"><strong>${line.speaker}</strong><span class="role-badge">${line.role}</span></div>
        <div class="text">${line.line}</div>
        ${tagHtml}
      </div>
    `;
  }).join("");

  return `
    <article class="simulated-meeting">
      <div class="dramatization-notice">Dramatized dialogue illustrating the real facts of <strong>${ep.source.case}</strong> (${ep.source.citation}). Names and exact wording are invented; the underlying facts and legal outcome are real &mdash; see the Case File view.</div>
      <div class="transcript">${lines}</div>
      <div class="takeaway takeaway--inline"><h4>Takeaway</h4><p>${ep.takeaway}</p></div>
    </article>
  `;
}

function renderMain() {
  const ep = getEpisode(activeEpisodeId);
  const main = document.getElementById("episode-detail");
  main.innerHTML = activeView === "case-file" ? renderCaseFile(ep) : renderSimulatedMeeting(ep);
}

function selectEpisode(id) {
  activeEpisodeId = id;
  renderEpisodeList();
  renderMain();
}

function selectView(view) {
  activeView = view;
  renderViewToggle();
  renderMain();
}

document.addEventListener("DOMContentLoaded", () => {
  renderEpisodeList();
  renderViewToggle();
  renderMain();

  document.getElementById("view-case-file").addEventListener("click", () => selectView("case-file"));
  document.getElementById("view-simulated-meeting").addEventListener("click", () => selectView("simulated-meeting"));
});
