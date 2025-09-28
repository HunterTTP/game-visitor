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

AFRAME.registerComponent("vr-nav-controls", {
  schema: { hand: { type: "string", default: "right" } },
  init() {
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const btnReset = document.getElementById("btnReset");
    const click = (el) => el && el.click();
    this.el.addEventListener("triggerdown", () => {
      if (this.data.hand === "left") click(btnPrev);
      else click(btnNext);
    });
    this.el.addEventListener("thumbstickmoved", (e) => {
      const x = e.detail.x || 0;
      if (x <= -0.6) click(btnPrev);
      if (x >= 0.6) click(btnNext);
    });
    this.el.addEventListener("gripdown", () => click(btnReset));
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
