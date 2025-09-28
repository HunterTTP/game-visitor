import { loadLevel, getCurrentLevel } from "./viewer-pannellum.js";
import { getLevel, getLevelIndex } from "./data/data-levels.js";

const q = (s, d = document) => d.querySelector(s);

function getLevelAt(i) {
  const len = (window.__LEVELS_LEN__ ?? 0) || 6;
  const at = (i + len) % len;
  const ids = window.__LEVEL_IDS__ || [];
  if (ids.length === len) return getLevel(ids[at]);
  const order = ["wow-pano", "wow-pano-2", "wow-pano-3", "wow-pano-4", "wow-pano-5", "wow-pano-6"];
  return getLevel(order[at]);
}

function createVrScene(panoSrc) {
  const scene = document.createElement("a-scene");
  scene.setAttribute("renderer", "antialias: true");
  scene.setAttribute("background", "color: #000");
  scene.setAttribute("vr-mode-ui", "enabled: true");

  const cam = document.createElement("a-entity");
  cam.setAttribute("camera", "");
  cam.setAttribute("look-controls", "");
  cam.setAttribute("wasd-controls", "enabled:false");
  cam.setAttribute("position", "0 1.6 0");

  const sky = document.createElement("a-sky");
  sky.setAttribute("id", "vrSky");
  sky.setAttribute("rotation", "0 -90 0");
  sky.setAttribute("src", panoSrc);

  const left = document.createElement("a-entity");
  left.setAttribute("laser-controls", "hand: left");
  left.setAttribute("vr-nav-controls", "hand: left");

  const right = document.createElement("a-entity");
  right.setAttribute("laser-controls", "hand: right");
  right.setAttribute("vr-nav-controls", "hand: right");

  scene.appendChild(cam);
  scene.appendChild(sky);
  scene.appendChild(left);
  scene.appendChild(right);
  return scene;
}

function advance(dir) {
  const curr = getCurrentLevel();
  if (!curr) return;
  const idx = getLevelIndex(curr.id);
  const target = getLevelAt(idx + dir);
  const sky = document.getElementById("vrSky");
  if (sky) sky.setAttribute("src", target.pano);
  loadLevel(target);
}

AFRAME.registerComponent("vr-nav-controls", {
  schema: { hand: { type: "string", default: "right" } },
  init() {
    this.onTrigger = () => {
      if (this.data.hand === "left") advance(-1);
      else advance(1);
    };
    this.el.addEventListener("triggerdown", this.onTrigger);
  },
  remove() {
    this.el.removeEventListener("triggerdown", this.onTrigger);
  },
});

export function initVrOverlay() {
  const overlay = q("#vrOverlay");
  const btn = q("#btnVR");
  btn.addEventListener("click", () => {
    const level = getCurrentLevel();
    if (!level) return;
    overlay.style.display = "block";
    overlay.innerHTML = "";
    const scene = createVrScene(level.pano);
    overlay.appendChild(scene);
    requestAnimationFrame(() => {
      if (scene.enterVR) scene.enterVR();
    });
    scene.addEventListener("exit-vr", () => {
      overlay.style.display = "none";
      overlay.innerHTML = "";
    });
  });
}
