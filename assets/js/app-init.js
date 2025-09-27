import { getLevel } from "./data/data-levels.js";
import { buildLevelGrid } from "./level-grid.js";
import { initAudioControls } from "./audio-controls.js";
import { initVrOverlay } from "./vr-overlay.js";
import { loadLevel, initResponsiveHfov, resetView, prevLevel, nextLevel, setCurrentLevel } from "./viewer-pannellum.js";

const q = (s, d = document) => d.querySelector(s);

addEventListener("load", async () => {
  buildLevelGrid();
  const params = new URLSearchParams(location.search);
  const initial = getLevel(params.get("id"));
  setCurrentLevel(initial);
  loadLevel(initial, false);
  initResponsiveHfov();
  q("#btnReset").onclick = () => resetView();
  q("#btnPrev").onclick = () => prevLevel();
  q("#btnNext").onclick = () => nextLevel();
  initVrOverlay();
  initAudioControls();
});
