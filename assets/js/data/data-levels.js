export const LEVELS = [
  { id: "wow-pano", title: "Goldshire - Inside", pano: "panos/wow-pano.webp", thumb: "panos/wow-pano-thumb.webp" },
  { id: "wow-pano-2", title: "Goldshire - Woods", pano: "panos/wow-pano-2.webp", thumb: "panos/wow-pano-2-thumb.webp" },
  { id: "wow-pano-3", title: "Ironforge - Great Forge", pano: "panos/wow-pano-3.webp", thumb: "panos/wow-pano-3-thumb.webp" },
  { id: "wow-pano-4", title: "Ironforge - Gates", pano: "panos/wow-pano-4.webp", thumb: "panos/wow-pano-4-thumb.webp" },
  { id: "wow-pano-5", title: "Northshire", pano: "panos/wow-pano-5.webp", thumb: "panos/wow-pano-5-thumb.webp" },
  { id: "wow-pano-6", title: "Teldrassil", pano: "panos/wow-pano-6.webp", thumb: "panos/wow-pano-6-thumb.webp" },
];

export const getLevel = (id) => LEVELS.find((l) => l.id === id) || LEVELS[0];
export const getLevelIndex = (id) => LEVELS.findIndex((l) => l.id === id);
