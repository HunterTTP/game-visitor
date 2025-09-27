import { SONGS } from "./data/data-songs.js";

const q = (s, d = document) => d.querySelector(s);

let bgm, sel, btn, vol;

export function toggleMusic() {
  if (!bgm || !btn || !sel) return;
  bgm.muted = !bgm.muted;
  btn.innerHTML = bgm.muted ? '<i class="bi bi-play-fill"></i>' : '<i class="bi bi-stop-fill"></i>';
  const navBtn = q("#btnPlayMusicNav");
  if (navBtn) navBtn.innerHTML = btn.innerHTML;
  if (!bgm.muted) {
    if (!bgm.src) setTrack(sel.value || SONGS[0].id, false);
    bgm.play().catch(() => {});
  } else {
    bgm.pause();
  }
}

function setTrack(id, play) {
  const t = SONGS.find((s) => s.id === id) || SONGS[0];
  if (!bgm.src.endsWith(t.src)) bgm.src = t.src;
  if (play && !bgm.muted) bgm.play().catch(() => {});
}

export function initAudioControls() {
  sel = q("#musicSelect");
  btn = q("#btnMuteMusic");
  bgm = q("#bgm");
  vol = q("#vol");

  sel.innerHTML = SONGS.map((s) => `<option value="${s.id}">${s.title}</option>`).join("");
  bgm.muted = true;

  if (vol) {
    bgm.volume = parseInt(vol.value || "60", 10) / 100;
    vol.addEventListener("input", () => {
      bgm.volume = parseInt(vol.value, 10) / 100;
    });
  }

  sel.onchange = () => setTrack(sel.value, true);

  btn.onclick = toggleMusic;

  const navBtn = q("#btnPlayMusicNav");
  if (navBtn) navBtn.onclick = toggleMusic;

  setTrack(SONGS[0].id, false);
}
