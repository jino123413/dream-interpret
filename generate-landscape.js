/**
 * Custom landscape screenshot generator for dream-interpret (간밤의 꿈)
 * Concept: "성운 파노라마" — Purple nebula background, 3 tilted phones
 * showing Input→Reveal→Result flow, nebula particles connecting phones
 * Output: 1504×741 PNG
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, 'raw');
const OUT = path.join(__dirname, 'submission', 'screenshot-landscape.png');

// Read raw screenshots as base64
const screen1 = fs.readFileSync(path.join(RAW_DIR, 'screen-1.png')).toString('base64');
const screen2 = fs.readFileSync(path.join(RAW_DIR, 'screen-2.png')).toString('base64');
const screen3 = fs.readFileSync(path.join(RAW_DIR, 'screen-3.png')).toString('base64');

// Read logo
const logoPath = path.join(__dirname, '..', 'app-logos', 'dream-interpret.png');
const logoB64 = fs.existsSync(logoPath) ? fs.readFileSync(logoPath).toString('base64') : '';

const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link href="https://cdn.jsdelivr.net/gh/webfontworld/gmarket/GmarketSans.css" rel="stylesheet">
<style>
@keyframes float1 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.1)} }
@keyframes float2 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(6px) scale(0.9)} }
@keyframes float3 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
@keyframes twinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
@keyframes drift { 0%{transform:translateX(0) translateY(0)} 100%{transform:translateX(20px) translateY(-10px)} }
@keyframes pulseGlow { 0%,100%{opacity:0.4; transform:scale(1)} 50%{opacity:0.7; transform:scale(1.15)} }

* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:1504px; height:741px; overflow:hidden;
  background: radial-gradient(ellipse at 30% 40%, #2D1B69 0%, #1A1B4B 40%, #0D0D1A 100%);
  font-family: 'GmarketSans', sans-serif;
  position:relative;
}

/* Nebula layers */
.nebula {
  position:absolute; border-radius:50%; filter:blur(60px); opacity:0.25; pointer-events:none;
}
.n1 { width:600px; height:400px; top:-80px; left:-100px; background:radial-gradient(ellipse, #7C3AED, transparent 70%); }
.n2 { width:500px; height:350px; bottom:-60px; right:50px; background:radial-gradient(ellipse, #6D28D9, transparent 70%); }
.n3 { width:400px; height:300px; top:100px; right:300px; background:radial-gradient(ellipse, #8B5CF6, transparent 70%); opacity:0.15; }
.n4 { width:350px; height:250px; top:200px; left:200px; background:radial-gradient(ellipse, #C4B5FD, transparent 70%); opacity:0.12; }

/* Stars */
.star {
  position:absolute; border-radius:50%; background:#fff; pointer-events:none;
}

/* Flow connection line */
.flow-line {
  position:absolute;
  top:50%; left:50%; transform:translate(-50%, -50%);
  width:900px; height:4px;
  z-index:1;
}
.flow-line svg { width:100%; height:60px; position:relative; top:-28px; }

/* Phones container */
.phones {
  position:absolute;
  top:50%; left:50%;
  transform:translate(-50%, -50%);
  display:flex; align-items:center; gap:60px;
  z-index:10;
}

/* Phone frame */
.phone {
  width:195px; height:422px;
  border-radius:24px;
  background:#000;
  padding:4px;
  box-shadow:
    0 0 30px rgba(139,92,246,0.3),
    0 0 60px rgba(139,92,246,0.15),
    0 20px 60px rgba(0,0,0,0.5);
  position:relative;
  transition: transform 0.3s;
}
.phone:nth-child(1) { transform: rotate(-5deg) translateY(8px); }
.phone:nth-child(2) { transform: scale(1.08) translateY(-12px); z-index:11; }
.phone:nth-child(3) { transform: rotate(5deg) translateY(8px); }

.phone .screen {
  width:100%; height:100%;
  border-radius:20px;
  overflow:hidden;
  background:#0D0D1A;
}
.phone .screen img {
  width:100%; height:100%;
  object-fit:cover;
  object-position:top;
}

/* Phone glow ring */
.phone::before {
  content:'';
  position:absolute;
  top:-2px; left:-2px; right:-2px; bottom:-2px;
  border-radius:26px;
  background: linear-gradient(135deg, rgba(196,181,253,0.4), rgba(139,92,246,0.2), rgba(196,181,253,0.4));
  z-index:-1;
}

/* Flow arrows between phones */
.flow-arrow {
  position:absolute;
  top:50%; transform:translateY(-50%);
  z-index:12;
  display:flex; flex-direction:column; align-items:center; gap:4px;
}
.flow-arrow .arrow {
  width:36px; height:36px; border-radius:50%;
  background: rgba(196,181,253,0.15);
  backdrop-filter: blur(8px);
  display:flex; align-items:center; justify-content:center;
  color: #C4B5FD; font-size:18px;
}
.flow-arrow .label {
  color:rgba(196,181,253,0.7); font-size:10px; font-weight:500;
}

/* Brand */
.brand {
  position:absolute; top:28px; left:50%; transform:translateX(-50%);
  display:flex; align-items:center; gap:14px;
  z-index:20;
}
.brand img { width:42px; height:42px; border-radius:10px; box-shadow:0 4px 16px rgba(0,0,0,0.3); }
.brand span { color:#fff; font-size:22px; font-weight:700; text-shadow:0 2px 8px rgba(0,0,0,0.3); letter-spacing:-0.5px; }

/* Bottom tagline */
.tagline {
  position:absolute; bottom:26px; left:50%; transform:translateX(-50%);
  color:rgba(196,181,253,0.7); font-size:15px; font-weight:500;
  text-shadow:0 1px 4px rgba(0,0,0,0.2);
  letter-spacing:0.5px;
  z-index:20;
}

/* Phase labels under phones */
.phase-labels {
  position:absolute;
  top:50%; left:50%;
  transform:translate(-50%, -50%);
  display:flex; align-items:flex-end; gap:60px;
  z-index:15;
  margin-top:240px;
}
.phase {
  width:195px; text-align:center;
}
.phase:nth-child(1) { transform:translateX(0); }
.phase:nth-child(2) { transform:translateX(0); }
.phase:nth-child(3) { transform:translateX(0); }
.phase .num {
  display:inline-block; width:22px; height:22px; line-height:22px;
  border-radius:50%; background:rgba(196,181,253,0.2);
  color:#C4B5FD; font-size:11px; font-weight:700;
  margin-bottom:4px;
}
.phase .text { color:rgba(255,255,255,0.6); font-size:12px; font-weight:500; }

/* Floating particles between phones */
.particle {
  position:absolute; border-radius:50%; pointer-events:none; z-index:5;
}
.p-nebula {
  background: radial-gradient(circle, rgba(196,181,253,0.6), transparent 70%);
  filter:blur(3px);
}
</style></head><body>

<!-- Nebula background layers -->
<div class="nebula n1"></div>
<div class="nebula n2"></div>
<div class="nebula n3"></div>
<div class="nebula n4"></div>

<!-- Stars scattered -->
${Array.from({length:40}).map((_,i) => {
  const x = Math.floor((i*37+13)%1504);
  const y = Math.floor((i*53+7)%741);
  const s = 1 + (i%3);
  const o = 0.3 + (i%5)*0.12;
  const d = 2 + (i%4);
  return `<div class="star" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:${o};animation:twinkle ${d}s ${i*0.3}s infinite"></div>`;
}).join('')}

<!-- Floating nebula particles between phones -->
${Array.from({length:12}).map((_,i) => {
  const x = 350 + (i*80)%800;
  const y = 200 + (i*60)%300;
  const s = 8 + (i%4)*6;
  const o = 0.2 + (i%3)*0.1;
  return `<div class="particle p-nebula" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:${o};animation:pulseGlow ${3+i%3}s ${i*0.5}s infinite"></div>`;
}).join('')}

<!-- Brand header -->
<div class="brand">
  ${logoB64 ? `<img src="data:image/png;base64,${logoB64}">` : ''}
  <span>간밤의 꿈</span>
</div>

<!-- 3 Phone frames -->
<div class="phones">
  <div class="phone">
    <div class="screen"><img src="data:image/png;base64,${screen1}"></div>
  </div>
  <div class="phone">
    <div class="screen"><img src="data:image/png;base64,${screen2}"></div>
  </div>
  <div class="phone">
    <div class="screen"><img src="data:image/png;base64,${screen3}"></div>
  </div>
</div>

<!-- Phase labels -->
<div class="phase-labels">
  <div class="phase"><div class="num">1</div><div class="text">꿈 입력</div></div>
  <div class="phase"><div class="num">2</div><div class="text">수정구슬 해석</div></div>
  <div class="phase"><div class="num">3</div><div class="text">성운 맵 결과</div></div>
</div>

<!-- Bottom tagline -->
<div class="tagline">간밤에 꾼 꿈, 수정구슬이 읽어줄게</div>

</body></html>`;

(async () => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1504, height: 741 } });
  await page.setContent(html);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: OUT });
  console.log(`Saved: ${OUT}`);
  await browser.close();
})();
