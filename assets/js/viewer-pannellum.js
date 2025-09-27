import { getLevel, getLevelIndex } from "./data/data-levels.js";

const q = (s, d = document) => d.querySelector(s);

const breakpoints = {
  phone: matchMedia("(max-width: 576px)"),
  tablet: matchMedia("(min-width: 577px) and (max-width: 992px)"),
};
const hfovFor = () => (breakpoints.phone.matches ? 55 : breakpoints.tablet.matches ? 70 : 85);

let viewer = null;
let current = null;

export const getCurrentLevel = () => current;
export const setCurrentLevel = (lvl) => (current = lvl);

export function loadLevel(level, updateUrl = true) {
  current = level;
  if (viewer) viewer.destroy();
  viewer = pannellum.viewer("pano", {
    type: "equirectangular",
    panorama: level.pano,
    autoLoad: true,
    autoRotate: -2,
    hfov: hfovFor(),
    minHfov: 20,
    maxHfov: 95,
  });
  q("#levelTitle").textContent = level.title;
  if (updateUrl) {
    const u = new URL(location.href);
    u.searchParams.set("id", level.id);
    history.replaceState(null, "", u);
  }
}

export function initResponsiveHfov() {
  const apply = () => viewer && viewer.setHfov(hfovFor(), false);
  [breakpoints.phone, breakpoints.tablet].forEach((mq) => mq.addEventListener("change", apply));
  addEventListener("orientationchange", apply);
  addEventListener("resize", apply);
}

export function resetView() {
  if (!viewer) return;
  viewer.lookAt(0, 0, hfovFor(), false);
  viewer.startAutoRotate(-2);
}

export function nextLevel() {
  const idx = getLevelIndex(current.id);
  const next = getLevelAt(idx + 1);
  loadLevel(next);
}

export function prevLevel() {
  const idx = getLevelIndex(current.id);
  const prev = getLevelAt(idx - 1);
  loadLevel(prev);
}

function getLevelAt(i) {
  const len = (window.__LEVELS_LEN__ ?? 0) || 6;
  const at = (i + len) % len;
  const ids = window.__LEVEL_IDS__ || [];
  if (ids.length === len) return getLevel(ids[at]);
  const order = ["wow-pano", "wow-pano-2", "wow-pano-3", "wow-pano-4", "wow-pano-5", "wow-pano-6"];
  return getLevel(order[at]);
}
