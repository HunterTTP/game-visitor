import { LEVELS, getLevel } from "./data/data-levels.js";
import { loadLevel } from "./viewer-pannellum.js";

const q = (s, d = document) => d.querySelector(s);

export function buildLevelGrid() {
  const grid = q("#levelGrid");
  grid.innerHTML = LEVELS.map(
    (l) => `
      <div class="col tile">
        <a href="?id=${l.id}" data-level="${l.id}" class="level-container">
          <img loading="lazy" src="${l.thumb}" alt="${l.title}" class="level-image"/>
          <div class="overlay">
            <div class="overlay-text">${l.title}</div>
          </div>
        </a>
      </div>`
  ).join("");
  window.__LEVELS_LEN__ = LEVELS.length;
  window.__LEVEL_IDS__ = LEVELS.map((l) => l.id);
  grid.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-level]");
    if (!a) return;
    e.preventDefault();
    loadLevel(getLevel(a.dataset.level));
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(q("#mainMenu"));
    offcanvas.hide();
  });
}
