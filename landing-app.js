// IEP Process Simulator — landing page logic
// Computes live stats from data.js (Cited) and simulated-data.js (Simulated)
// so the homepage never goes stale relative to the actual datasets, and
// drives the featured-quote widget (a small, honest piece of interactivity:
// no live LLM calls, just a random pick from real, already-vetted quotes).

function renderSimulatedStats() {
  const totalPainPoints = PAIN_POINTS.length;
  const totalSources = PAIN_POINTS.reduce((sum, pp) => sum + pp.real_sources.length, 0);
  const totalCategories = new Set(PAIN_POINTS.map(pp => pp.category)).size;
  document.getElementById("simulated-stats").textContent =
    `${totalPainPoints} pain points across ${totalCategories} categories · ${totalSources} real sources`;
}

function renderCitedStats() {
  const totalEpisodes = EPISODES.length;
  const totalCategories = new Set(EPISODES.map(ep => ep.category)).size;
  document.getElementById("cited-stats").textContent =
    `${totalEpisodes} adjudicated cases across ${totalCategories} categories`;
}

function pickRandomQuote() {
  const allQuotes = [];
  PAIN_POINTS.forEach(pp => {
    pp.real_sources.forEach(s => {
      allQuotes.push({
        quote: s.quote,
        attribution: s.type === "aggregate" ? `${s.author}, ${s.publication}` : s.source_desc,
      });
    });
  });
  return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

function renderRandomQuote() {
  const q = pickRandomQuote();
  document.getElementById("quote-text").textContent = `“${q.quote}”`;
  document.getElementById("quote-source").textContent = `— ${q.attribution}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderSimulatedStats();
  renderCitedStats();
  renderRandomQuote();
  document.getElementById("quote-refresh").addEventListener("click", renderRandomQuote);
});
