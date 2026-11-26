// =====================================================
// HATSUNE MIKU 18TH BIRTHDAY WEBSITE
// =====================================================

// =============== MUSIC SETTINGS ======================

// Put your Vocaloid audio file in the same folder as your HTML/CSS/JS files
// and make sure AUDIO_SRC matches its exact filename.
const AUDIO_SRC = "【MMD】Hatsune Miku Sings Happy Birthday.mp3";

// Optional: Add your own lyric captions and their timestamps.
// Leave this empty if you don't want lyric captions.
// Times are in milliseconds.
const LYRIC_CUES = [
  // { time: 0, text: "Happy birthday to you..." },
];

// =============== GET HTML ELEMENTS ===================

const introScreen = document.getElementById("introScreen");
const celebrationScreen = document.getElementById("celebrationScreen");
const openCakeBtn = document.getElementById("openCakeBtn");
const songBtn = document.getElementById("songBtn");
const blowBtn = document.getElementById("blowBtn");
const relightBtn = document.getElementById("relightBtn");
const lyricBox = document.getElementById("lyricBox");

const mikuCanvas = document.getElementById("mikuPixelCanvas");
const mikuCtx = mikuCanvas ? mikuCanvas.getContext("2d") : null;

const applePieCanvas = document.getElementById("applePieCanvas");
const pieCtx = applePieCanvas ? applePieCanvas.getContext("2d") : null;

const fireworksCanvas = document.getElementById("fireworksCanvas");
const fwCtx = fireworksCanvas.getContext("2d");

const openNoteBtn = document.getElementById("openNoteBtn");
const noteModalBackdrop = document.getElementById("noteModalBackdrop");
const noteModalCard = document.getElementById("noteModalCard");

const bgAudio = new Audio(AUDIO_SRC);
bgAudio.loop = true;

bgAudio.addEventListener("error", () => {
  if (lyricBox) {
    lyricBox.textContent = `Could not load "${AUDIO_SRC}". Check the file name & folder.`;
  }
});

let isSinging = false;
let lyricTimers = [];
let candlesLit = true;
let flamePhase = 0;

// =============== AUDIO PLAYBACK ======================

function playBirthdayAudio() {
  bgAudio.play().catch(() => {
    if (lyricBox) {
      lyricBox.textContent = "Tap Sing Song to start music ♪";
    }
  });
}

function stopBirthdayAudio() {
  bgAudio.pause();
  bgAudio.currentTime = 0;
}

function startLyrics() {
  if (!lyricBox) return;

  lyricBox.textContent = "Now playing your birthday song! ♪";

  LYRIC_CUES.forEach((cue) => {
    const timer = setTimeout(() => {
      if (isSinging) {
        lyricBox.textContent = cue.text;
      }
    }, cue.time);

    lyricTimers.push(timer);
  });
}

function clearLyrics() {
  lyricTimers.forEach(clearTimeout);
  lyricTimers = [];

  if (lyricBox) {
    lyricBox.textContent = "";
  }
}

function startSinging() {
  if (isSinging) return;

  isSinging = true;

  if (songBtn) {
    songBtn.textContent = "Stop Song";
  }

  playBirthdayAudio();
  startLyrics();
}

function stopSinging() {
  isSinging = false;

  if (songBtn) {
    songBtn.textContent = "Sing Song";
  }

  stopBirthdayAudio();
  clearLyrics();
}

// =============== 18 PIXEL CANDLES ON PIE =============
// Symmetrical around the pie's apple & bottom center (col 34).

const CANDLE_POSITIONS = [
  // Back / upper arc left (4 candles)
  { col: 19, row: 17 },
  { col: 22, row: 16 },
  { col: 25, row: 15 },
  { col: 28, row: 15 },

  // Back / upper arc right (4 candles)
  { col: 40, row: 15 },
  { col: 43, row: 15 },
  { col: 46, row: 16 },
  { col: 49, row: 17 },

  // Front curve (10 candles, mirrored around col 34)
  { col: 15, row: 20 },
  { col: 18, row: 22 },
  { col: 22, row: 23 },
  { col: 26, row: 24 },
  { col: 31, row: 25 },
  { col: 37, row: 25 },
  { col: 42, row: 24 },
  { col: 46, row: 23 },
  { col: 50, row: 22 },
  { col: 53, row: 20 }
];

function blowAllCandles() {
  candlesLit = false;
  drawPixelApplePie();
  launchBurst(window.innerWidth * 0.5, window.innerHeight * 0.55, 65);
}

function relightAllCandles() {
  candlesLit = true;
  drawPixelApplePie();
}

function toggleCandles() {
  candlesLit = !candlesLit;
  drawPixelApplePie();
  if (!candlesLit) {
    launchBurst(window.innerWidth * 0.5, window.innerHeight * 0.55, 50);
  }
}

// =============== EXACT PIXEL MIKU ====================

const MIKU_PIXEL_GRID = [
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "............CCC.........CCC.............",
  "...........CCC.P.CCCCC.P.CCC............",
  "..........CCC.P.CCCCCCC.P.CCC...........",
  "..........CC.P.CCCCCCCCC.P.CC............",
  "..........C..CCCCCCCCCCCCC..C............",
  "..........C.CCCCCCCCCCCCCCC.C............",
  ".........CCCCCCCCSCCCSCCCCCCCC...........",
  ".........CCCCCCCSSCCCSSCCCCCCC...........",
  "........CCCC.CCC.SSCCS.CC..CCCC...........",
  "........CCCC.CCC.SSSCS.CCC.CCCC...........",
  "........CCCC..CCCSSSSSCCC..CCCC...........",
  ".......CCCC....CpSSSSSpC....CCCC..........",
  ".......CCCC.......S.S.......CCCC..........",
  ".......CCCC........C........CCCC..........",
  ".......CCCC.......GCG.......CCCC..........",
  ".......CCCC......WGCGW......CCCC..........",
  ".......CCCCC......C.C......CCCCC..........",
  "........CCCCC.............CCCCC...........",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................",
  "........................................"
];

const COLOR_MAP = {
  C: "#00BCD4",
  S: "#FFDCCF",
  P: "#F50057",
  p: "#FFADB5",
  G: "#9E9E9E",
  W: "#FFFFFF"
};

function drawPixelMiku() {
  if (!mikuCanvas || !mikuCtx) return;

  const rows = MIKU_PIXEL_GRID.length;
  const columns = MIKU_PIXEL_GRID[0].length;

  mikuCtx.clearRect(0, 0, mikuCanvas.width, mikuCanvas.height);
  mikuCtx.imageSmoothingEnabled = false;

  const pixelSize = Math.min(
    mikuCanvas.width / columns,
    mikuCanvas.height / rows
  );

  const offsetX = (mikuCanvas.width - columns * pixelSize) / 2;
  const offsetY = (mikuCanvas.height - rows * pixelSize) / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const pixel = MIKU_PIXEL_GRID[y][x];
      if (pixel === ".") continue;

      mikuCtx.fillStyle = COLOR_MAP[pixel];
      mikuCtx.fillRect(
        offsetX + x * pixelSize,
        offsetY + y * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }
}

// =============== PIXEL APPLE PIE + 18 CANDLES ========
// Centered horizontally so the apple on top and bottom crust sit dead-center.

const APPLE_PIE_GRID = [
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "............................................................",
  "..................................KK........................",
  "..................................KB........................",
  ".................................KKB........................",
  "..............................KKKKKK........................",
  ".............................KRRRRRKK.......................",
  "............................KRWWRRRRRK......................",
  "............................KRWRRRRDRKK.....................",
  ".....................KKKKKKKRRRRDDRRRKK.....................",
  "...................KKTTTTTTKKKKKRDRRRRTTTKK.................",
  "..................KTTLLTTLLTTLLKKKDRRTTTLLTTTB..............",
  ".................KTTLLTTLLTTLLTTKKKKTTTLLTTLLTTB............",
  "................KTTLTTLLRRLTTLLTTLLTTTLLRRLTTLLTB...........",
  "...............KKTLTTLLLRRLTTLLTTLLTTTLLRRLTLLLTBB..........",
  "..............KKTTTLLTTLLTTLLRRLTTLLTTLLTTLLTTLLTTBB........",
  "..............KTTTTTLLTTLLTTLRRLTTLLTTLLTTLLTTLLTTTB........",
  "..............KTTTTTTTTTTTLLTTLLTTLLTTLLTTTTTTTTTTTB........",
  "..............KKTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTBB........",
  "...............KKBBBBKBBBBKBBBBKBBBBKBBBBKBBBBKBBBBKK.......",
  "................KKBBBBKBBBBKBBBBKBBBBKBBBBKBBBBKBBKK........",
  ".................KKBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBKK.........",
  "..................KKBBBBBBBBBBBBBBBBBBBBBBBBBBBBKK..........",
  "...................KKBBBBBBBBBBBBBBBBBBBBBBBBBBKK...........",
  "....................KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK............",
  "............................................................",
  "............................................................"
];

const PIE_COLOR_MAP = {
  K: "#4a1f08",
  B: "#8f4312",
  M: "#b55d1c",
  T: "#dc8c3b",
  L: "#f7c574",
  R: "#df2434",
  D: "#991020",
  W: "#ffd9df"
};

function drawSinglePixelCandle(col, row, px, offsetX, offsetY, lit, index) {
  const x0 = offsetX + col * px;
  const y0 = offsetY + row * px;
  const w = px * 0.72;
  const h = px * 0.72;

  for (let dy = 0; dy < 3; dy++) {
    for (let dx = 0; dx < 2; dx++) {
      const isWhiteStripe = (dy + dx + index) % 2 === 1;
      pieCtx.fillStyle = isWhiteStripe ? "#e6f8ff" : "#228be6";
      pieCtx.fillRect(x0 + dx * w, y0 - (dy + 1) * h, w, h);
    }
  }

  pieCtx.fillStyle = "#10243e";
  pieCtx.fillRect(x0 - w * 0.5, y0 - 3 * h, w * 0.5, 3 * h);
  pieCtx.fillRect(x0 + 2 * w, y0 - 3 * h, w * 0.5, 3 * h);
  pieCtx.fillRect(x0 - w * 0.5, y0 - 3.5 * h, 3 * w, h * 0.5);
  pieCtx.fillRect(x0 - w * 0.5, y0, 3 * w, h * 0.5);

  pieCtx.fillStyle = "#2b2b2b";
  pieCtx.fillRect(x0 + w * 0.7, y0 - 4.3 * h, w * 0.5, h * 0.7);

  if (!lit) return;

  const sway = Math.sin(flamePhase + index * 0.8) * (w * 0.25);
  const fx = x0 + w * 0.45 + sway;

  pieCtx.fillStyle = "#ff5a1f";
  pieCtx.fillRect(fx, y0 - 5.6 * h, w * 1.1, h * 1.1);

  pieCtx.fillStyle = "#ffbe2e";
  pieCtx.fillRect(fx + w * 0.15, y0 - 5.4 * h, w * 0.8, h * 0.85);

  pieCtx.fillStyle = "#fff7b2";
  pieCtx.fillRect(fx + w * 0.3, y0 - 5.2 * h, w * 0.5, h * 0.5);
}

// Align the pie canvas horizontally so the apple (col ~33) and pie bottom (row 29)
// sit directly under Miku's center axis.
function getPieCenterColOffset(cols) {
  let minX = cols;
  let maxX = -1;
  for (let y = 0; y < APPLE_PIE_GRID.length; y++) {
    for (let x = 0; x < cols; x++) {
      if (APPLE_PIE_GRID[y][x] !== ".") {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
  }
  const visualCenterCol = (minX + maxX + 1) / 2;
  const gridCenterCol = cols / 2;
  return gridCenterCol - visualCenterCol;
}

function drawPixelApplePie() {
  if (!applePieCanvas || !pieCtx) return;

  const rows = APPLE_PIE_GRID.length;
  const cols = APPLE_PIE_GRID[0].length;

  pieCtx.clearRect(0, 0, applePieCanvas.width, applePieCanvas.height);
  pieCtx.imageSmoothingEnabled = false;

  const pixelSize = Math.min(
    applePieCanvas.width / cols,
    applePieCanvas.height / rows
  );

  const colShift = getPieCenterColOffset(cols);
  const offsetX = (applePieCanvas.width - cols * pixelSize) / 2 + colShift * pixelSize;
  const offsetY = (applePieCanvas.height - rows * pixelSize) / 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = APPLE_PIE_GRID[y][x];
      if (!ch || ch === ".") continue;

      pieCtx.fillStyle = PIE_COLOR_MAP[ch] || "#dc8c3b";
      pieCtx.fillRect(
        offsetX + x * pixelSize,
        offsetY + y * pixelSize,
        pixelSize,
        pixelSize
      );
    }
  }

  CANDLE_POSITIONS.forEach((pos, index) => {
    drawSinglePixelCandle(
      pos.col,
      pos.row,
      pixelSize,
      offsetX,
      offsetY,
      candlesLit,
      index
    );
  });
}

setInterval(() => {
  if (candlesLit && applePieCanvas) {
    flamePhase += 0.65;
    drawPixelApplePie();
  }
}, 220);

// =============== BLUE FIREWORKS =====================

const BLUE_PALETTE = [
  "#7be7ff",
  "#38bdf8",
  "#93c5fd",
  "#bae6fd",
  "#60a5fa",
  "#e0f7ff"
];

const sparks = [];
const stars = [];

function resizeCanvas() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;

  stars.length = 0;

  const starCount = Math.floor(
    (window.innerWidth * window.innerHeight) / 9500
  );

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * fireworksCanvas.width,
      y: Math.random() * fireworksCanvas.height,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.008
    });
  }
}

function launchBurst(x, y, count = 46) {
  const baseColor =
    BLUE_PALETTE[Math.floor(Math.random() * BLUE_PALETTE.length)];

  for (let i = 0; i < count; i++) {
    const angle =
      (Math.PI * 2 * i) / count +
      (Math.random() - 0.5) * 0.25;

    const speed = Math.random() * 3.8 + 1.4;

    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: Math.random() * 0.016 + 0.012,
      size: Math.random() * 2.8 + 1.5,
      color: i % 3 === 0 ? "#e6f9ff" : baseColor
    });
  }
}

function animateSky() {
  fwCtx.fillStyle = "rgba(7, 20, 43, 0.22)";
  fwCtx.fillRect(
    0,
    0,
    fireworksCanvas.width,
    fireworksCanvas.height
  );

  for (const star of stars) {
    star.alpha += star.speed;

    const twinkle =
      0.35 + 0.65 * Math.abs(Math.sin(star.alpha));

    fwCtx.fillStyle = `rgba(215, 246, 255, ${twinkle.toFixed(2)})`;

    fwCtx.beginPath();
    fwCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    fwCtx.fill();
  }

  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i];

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.045;
    p.vx *= 0.985;
    p.alpha -= p.decay;

    if (p.alpha <= 0) {
      sparks.splice(i, 1);
      continue;
    }

    fwCtx.save();

    fwCtx.globalAlpha = Math.max(0, p.alpha);
    fwCtx.fillStyle = p.color;
    fwCtx.shadowBlur = 10;
    fwCtx.shadowColor = p.color;

    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    fwCtx.fill();

    fwCtx.restore();
  }

  requestAnimationFrame(animateSky);
}

// =============== CENTERED POP-UP BIRTHDAY NOTE ========

function openNoteModal() {
  if (!noteModalBackdrop) return;
  noteModalBackdrop.classList.remove("hidden");
  noteModalBackdrop.setAttribute("aria-hidden", "false");
  launchBurst(window.innerWidth * 0.5, window.innerHeight * 0.45, 22);
}

function closeNoteModal() {
  if (!noteModalBackdrop) return;
  noteModalBackdrop.classList.add("hidden");
  noteModalBackdrop.setAttribute("aria-hidden", "true");
}

if (openNoteBtn) {
  openNoteBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    openNoteModal();
  });
}

if (noteModalCard) {
  noteModalCard.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

if (noteModalBackdrop) {
  noteModalBackdrop.addEventListener("click", () => {
    closeNoteModal();
  });
}

// =============== BUTTON EVENTS ======================

if (openCakeBtn) {
  openCakeBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden");
    celebrationScreen.classList.remove("hidden");

    launchBurst(
      window.innerWidth * 0.3,
      window.innerHeight * 0.28,
      45
    );

    launchBurst(
      window.innerWidth * 0.7,
      window.innerHeight * 0.28,
      45
    );

    startSinging();
  });
}

if (songBtn) {
  songBtn.addEventListener("click", () => {
    if (isSinging) {
      stopSinging();
    } else {
      startSinging();
    }
  });
}

if (blowBtn) {
  blowBtn.addEventListener("click", blowAllCandles);
}

if (relightBtn) {
  relightBtn.addEventListener("click", relightAllCandles);
}

// =============== PIE & MIKU CLICK EFFECTS ===========

const pieFloat = document.querySelector(".pie-float");

if (pieFloat) {
  pieFloat.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleCandles();
  });
}

const mikuFloat = document.querySelector(".miku-float");

if (mikuFloat) {
  mikuFloat.addEventListener("click", (event) => {
    launchBurst(event.clientX, event.clientY, 28);
  });
}

// =============== CLICK FIREWORKS ====================

window.addEventListener("click", (event) => {
  if (
    !celebrationScreen ||
    celebrationScreen.classList.contains("hidden")
  ) {
    return;
  }

  if (
    noteModalBackdrop &&
    !noteModalBackdrop.classList.contains("hidden")
  ) {
    return;
  }

  if (
    event.target.closest("button") ||
    event.target.closest(".pie-float")
  ) {
    return;
  }

  launchBurst(event.clientX, event.clientY, 32);
});

// =============== INITIALIZATION =====================

window.addEventListener("resize", () => {
  resizeCanvas();
  drawPixelMiku();
  drawPixelApplePie();
});

drawPixelMiku();
drawPixelApplePie();
resizeCanvas();
animateSky();

setInterval(() => {
  const x =
    Math.random() * window.innerWidth * 0.8 +
    window.innerWidth * 0.1;

  const y =
    Math.random() * window.innerHeight * 0.45 + 40;

  launchBurst(x, y, 36);
}, 1400);