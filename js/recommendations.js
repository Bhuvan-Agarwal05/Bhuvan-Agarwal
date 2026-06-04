(function () {
  const timeline = document.getElementById("reco-timeline");
  const statusEl = document.getElementById("reco-status");

  if (!timeline) return;

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function formatQuote(text) {
    const paragraphs = String(text)
      .split(/\n\n+/)
      .map((p) => p.trim().replace(/\n/g, " "))
      .filter(Boolean);

    if (paragraphs.length <= 1) {
      return `<p class="reco-card__quote">${escapeHtml(paragraphs[0] || text)}</p>`;
    }

    return paragraphs
      .map((p) => `<p class="reco-card__quote">${escapeHtml(p)}</p>`)
      .join("");
  }

  function renderCard(item) {
    const authorLink = item.authorUrl
      ? `<a href="${escapeHtml(item.authorUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.author)}</a>`
      : escapeHtml(item.author);

    const role = item.role
      ? `<span class="reco-card__role">${escapeHtml(item.role)}</span>`
      : "";

    const card = document.createElement("blockquote");
    card.className = "reco-card reveal";
    card.innerHTML = `
      <div class="reco-card__body">${formatQuote(item.quote)}</div>
      <footer class="reco-card__footer">
        <cite class="reco-card__author">${authorLink}${role}</cite>
        <span class="reco-card__source">LinkedIn</span>
      </footer>
    `;
    return card;
  }

  function renderPeriod(period) {
    const items = period.items || [];
    if (items.length === 0) return null;

    const section = document.createElement("section");
    section.className = "reco-period reveal";
    section.id = `reco-${period.id}`;

    const head = document.createElement("header");
    head.className = "reco-period__head";
    head.innerHTML = `
      <div class="reco-period__title">
        <h3 class="reco-period__role">${escapeHtml(period.role)}</h3>
        <p class="reco-period__company">${escapeHtml(period.company)}</p>
      </div>
      <time class="reco-period__dates">${escapeHtml(period.dates)}</time>
    `;

    const grid = document.createElement("div");
    grid.className = "reco-grid";
    items.forEach((item) => grid.appendChild(renderCard(item)));

    section.appendChild(head);
    section.appendChild(grid);
    return section;
  }

  function observeReveal() {
    const els = timeline.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
  }

  function showStatus(message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.classList.toggle("reco-status--error", Boolean(isError));
  }

  function renderAll(data) {
    const periods = data?.periods;
    if (!Array.isArray(periods)) {
      showStatus("Invalid recommendations data.", true);
      return;
    }

    timeline.replaceChildren();
    let rendered = 0;

    periods.forEach((period) => {
      const block = renderPeriod(period);
      if (block) {
        timeline.appendChild(block);
        rendered += 1;
      }
    });

    if (rendered === 0) {
      showStatus("No recommendations loaded yet.", true);
      return;
    }

    observeReveal();
    if (statusEl) statusEl.hidden = true;
  }

  fetch("data/recommendations.json")
    .then((res) => {
      if (!res.ok) throw new Error("Could not load recommendations.");
      return res.json();
    })
    .then(renderAll)
    .catch(() => {
      showStatus(
        "Could not load recommendations. Use a local server (npx serve .) or check data/recommendations.json.",
        true
      );
    });
})();
