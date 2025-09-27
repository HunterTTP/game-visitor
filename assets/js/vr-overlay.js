import { getCurrentLevel } from "./viewer-pannellum.js";

const q = (s, d = document) => d.querySelector(s);

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

  scene.appendChild(cam);
  scene.appendChild(sky);
  return scene;
}

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
