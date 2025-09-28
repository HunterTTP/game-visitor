import { getCurrentLevel, loadLevel } from "./viewer-pannellum.js";
import { LEVELS, getLevelIndex } from "./data/data-levels.js";

const q = (s, d = document) => d.querySelector(s);

function at(i) {
  const len = LEVELS.length;
  return LEVELS[((i % len) + len) % len];
}

function createScene(panoSrc) {
  const scene = document.createElement("a-scene");
  scene.setAttribute("renderer", "antialias: true");
  scene.setAttribute("background", "color: #000");
  scene.setAttribute("vr-mode-ui", "enabled: true; enterVRButton: #btnVR");

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
  const target = at(idx + dir);
  const sky = document.getElementById("vrSky");
  if (sky) sky.setAttribute("src", target.pano);
  loadLevel(target, true);
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

  const level = getCurrentLevel();
  if (!level) return;

  overlay.style.display = "none";
  overlay.innerHTML = "";
  const scene = createScene(level.pano);
  overlay.appendChild(scene);

  scene.addEventListener("enter-vr", () => {
    overlay.style.display = "block";
  });

  scene.addEventListener("exit-vr", () => {
    overlay.style.display = "none";
  });
}
