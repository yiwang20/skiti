// Remove baked-in transparency-preview checker pattern from generated PNGs.
//
// Strategy:
//   1. Sample the edge pixels of the image to find the dominant background colors
//   2. k-means with k=2 on the edge samples to find the two checker colors
//      (or 1 if the background is uniform)
//   3. Flood fill from edges, only clearing pixels close to either background color
//
// This preserves character pixels even if they happen to share the checker
// colors, because only edge-reachable pixels get cleared, AND we only clear
// pixels that specifically match the detected background colors.

const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const DIR = path.join(__dirname, "..", "public", "images", "personalities");
const BACKUP_DIR = path.join(__dirname, "..", "public", "images", "personalities-raw");

const COLOR_TOLERANCE = 12; // max component difference to consider "same color"

function colorDist(a, b) {
  return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
}

// Detect 1 or 2 dominant background colors from edge pixels using a simple
// greedy cluster: collect all edge pixels, group by similarity, return the
// two biggest clusters (if a second one exists).
function detectBackgroundColors(data, w, h) {
  const samples = [];
  const STEP = 2;
  // All edge pixels
  for (let x = 0; x < w; x += STEP) {
    samples.push([data[(0 * w + x) * 4], data[(0 * w + x) * 4 + 1], data[(0 * w + x) * 4 + 2]]);
    samples.push([data[((h - 1) * w + x) * 4], data[((h - 1) * w + x) * 4 + 1], data[((h - 1) * w + x) * 4 + 2]]);
  }
  for (let y = 0; y < h; y += STEP) {
    samples.push([data[(y * w + 0) * 4], data[(y * w + 0) * 4 + 1], data[(y * w + 0) * 4 + 2]]);
    samples.push([data[(y * w + (w - 1)) * 4], data[(y * w + (w - 1)) * 4 + 1], data[(y * w + (w - 1)) * 4 + 2]]);
  }

  // Greedy cluster
  const clusters = [];
  for (const s of samples) {
    let found = false;
    for (const c of clusters) {
      if (colorDist(s, c.center) <= COLOR_TOLERANCE) {
        // Update running average
        c.count++;
        c.center[0] = (c.center[0] * (c.count - 1) + s[0]) / c.count;
        c.center[1] = (c.center[1] * (c.count - 1) + s[1]) / c.count;
        c.center[2] = (c.center[2] * (c.count - 1) + s[2]) / c.count;
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({ center: [...s], count: 1 });
    }
  }

  clusters.sort((a, b) => b.count - a.count);
  // Round the center colors for clean output
  const top = clusters.slice(0, 2).map((c) => [
    Math.round(c.center[0]),
    Math.round(c.center[1]),
    Math.round(c.center[2]),
    c.count,
  ]);
  return top;
}

function processImage(filename) {
  const inPath = path.join(DIR, filename);
  const backupPath = path.join(BACKUP_DIR, filename);
  const buf = fs.readFileSync(fs.existsSync(backupPath) ? backupPath : inPath);
  const png = PNG.sync.read(buf);
  const { width: w, height: h, data } = png;

  // Detect background colors
  const bgColors = detectBackgroundColors(data, w, h);
  const bgTotal = bgColors.reduce((s, c) => s + c[3], 0);
  // Only accept a color as background if it represents > 5% of edge samples
  const activeBg = bgColors.filter((c) => c[3] / bgTotal > 0.05);

  const isBackgroundPixel = (r, g, b) => {
    for (const [br, bg, bb] of activeBg) {
      if (colorDist([r, g, b], [br, bg, bb]) <= COLOR_TOLERANCE) return true;
    }
    return false;
  };

  const visited = new Uint8Array(w * h);
  const stack = [];

  for (let x = 0; x < w; x++) {
    stack.push(x, 0);
    stack.push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    stack.push(0, y);
    stack.push(w - 1, y);
  }

  let cleared = 0;
  while (stack.length) {
    const y = stack.pop();
    const x = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const idx = y * w + x;
    if (visited[idx]) continue;
    const off = idx * 4;
    if (!isBackgroundPixel(data[off], data[off + 1], data[off + 2])) continue;
    visited[idx] = 1;
    data[off + 3] = 0;
    cleared++;
    stack.push(x + 1, y);
    stack.push(x - 1, y);
    stack.push(x, y + 1);
    stack.push(x, y - 1);
  }

  // Edge softening: pixels adjacent to transparent ones that are "partway"
  // toward a background color get partial alpha reduction
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (visited[idx]) continue;
      const off = idx * 4;
      let hasTransparentNeighbor = false;
      const neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      for (const [dx, dy] of neighbors) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (visited[ny * w + nx]) {
          hasTransparentNeighbor = true;
          break;
        }
      }
      if (!hasTransparentNeighbor) continue;
      const r = data[off], g = data[off + 1], b = data[off + 2];
      // Find closest background color and check distance
      let minDist = Infinity;
      for (const [br, bg, bb] of activeBg) {
        const d = colorDist([r, g, b], [br, bg, bb]);
        if (d < minDist) minDist = d;
      }
      // If within 24 of background, fade alpha proportionally
      if (minDist < 24) {
        const fade = 1 - minDist / 24;
        data[off + 3] = Math.round(data[off + 3] * (1 - fade * 0.5));
      }
    }
  }

  fs.writeFileSync(inPath, PNG.sync.write(png));
  return {
    filename,
    cleared,
    total: w * h,
    pct: ((cleared / (w * h)) * 100).toFixed(1),
    bgColors: activeBg.map((c) => `(${c[0]},${c[1]},${c[2]})`).join(" + "),
  };
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  for (const f of fs.readdirSync(DIR)) {
    if (f.endsWith(".png")) {
      fs.copyFileSync(path.join(DIR, f), path.join(BACKUP_DIR, f));
    }
  }
  console.log(`Backed up raw images to ${BACKUP_DIR}`);
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".png"));
console.log(`Processing ${files.length} images...`);
for (const f of files) {
  const result = processImage(f);
  console.log(
    `${result.filename.padEnd(15)} cleared ${result.pct.padStart(5)}%  bg=${result.bgColors}`
  );
}
