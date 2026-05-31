/* CATHY 💖 — script.js v7 (multi-page, all bugs fixed) */

/* ---- Chapter order ---- */
const CHAPTERS = [
  'index.html','evidence.html','contract.html','poem.html',
  'quiz.html','husband.html','proposal.html','love.html','yes.html'
];
const PAGE = (location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '');
const PAGE_IDX = Math.max(0, CHAPTERS.indexOf(PAGE));

/* ---- Progress (localStorage) ---- */
function getProgress() { return parseInt(localStorage.getItem('cathyProgress') || '0'); }
function setProgress(i) { if (i > getProgress()) localStorage.setItem('cathyProgress', i); }
setProgress(PAGE_IDX);

/* ---- State ---- */
let lang = localStorage.getItem('cathyLang') || 'en';
let noCount = 0;

/* ============================================================
   ESCAPE MESSAGES — runaway No button taunts
   ============================================================ */
const escapeMsgs = {
  en: [
    "lmao nope 😂",
    "it LITERALLY just ghosted you",
    "the button entered witness protection 🕵️",
    "it changed its name and moved countries",
    "the button is doing great without you, actually",
    "scientists can't explain this button's reflexes",
    "it filed for emotional independence",
    "it joined a monastery. it found peace.",
    "the button is on sabbatical in Switzerland 🇨🇭",
    "it applied for a restraining order 📄",
    "it blocked you. the button blocked you.",
    "this button has more self-respect than I do",
    "it asked me to tell you: 'it's not you, it's you'",
    "ok but seriously just click Yes 💖",
    "the button retired. only one option remains."
  ],
  hk: [
    "lmao 唔係 😂",
    "個掣真係已讀不回咗你",
    "個掣入咗證人保護計劃 🕵️",
    "佢改名搬走咗",
    "老實講，個掣冇咗你過得好好",
    "科學家都解釋唔到呢個掣嘅反射",
    "佢申請咗情感獨立",
    "佢入咗修道院。佢找到平靜了。",
    "個掣去咗瑞士度假 🇨🇭",
    "佢申請咗禁制令 📄",
    "個掣封鎖咗你。個掣封鎖咗你。",
    "呢個掣嘅自尊心比我更高",
    "佢叫我轉告你：「唔係你嘅問題，係你嘅問題」",
    "好啦認真啦直接撳「係」啦 💖",
    "個掣退休咗。得返一個選擇。"
  ]
};

/* ============================================================
   NO BUTTON — runs away FOREVER (never lets her catch it)
   ============================================================ */
function runAway(btn) {
  /* tiny cooldown so it doesn't teleport 60x/second */
  const now = Date.now();
  if (now - (parseInt(btn.dataset.lastFlee) || 0) < 140) return;
  btn.dataset.lastFlee = now;
  noCount++;

  /* escalating taunt */
  const msgs = escapeMsgs[lang];
  const msgEl = document.getElementById('escapeMsg') || document.getElementById('escapeMsg8');
  if (msgEl) msgEl.textContent = msgs[Math.min(noCount - 1, msgs.length - 1)];

  const bw = btn.offsetWidth || 90, bh = btn.offsetHeight || 44;
  const pad = 16;
  const r = btn.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

  /* pick a new spot, biased AWAY from where the cursor just was */
  let x, y, tries = 0;
  do {
    x = Math.random() * (window.innerWidth  - bw - pad * 2) + pad;
    y = Math.random() * (window.innerHeight - bh - pad * 2) + pad;
    tries++;
  } while (Math.hypot((x + bw / 2) - cx, (y + bh / 2) - cy) < 180 && tries < 12);

  /* shrink a little each dodge, but never fully vanish — it keeps running */
  const scale = Math.max(0.55, 1 - noCount * 0.045);
  const rot   = (Math.random() - 0.5) * 50;

  btn.style.position   = 'fixed';
  btn.style.zIndex     = '7000';
  btn.style.margin     = '0';
  btn.style.transition = 'left .18s cubic-bezier(.34,1.56,.64,1), top .18s cubic-bezier(.34,1.56,.64,1), transform .18s ease';
  btn.style.left = x + 'px';
  btn.style.top  = y + 'px';
  btn.style.transform = `scale(${scale}) rotate(${rot}deg)`;

  animateLoveMeter(Math.min(70 + noCount * 3, 96));
}

/* Proximity flee — it bolts before the cursor even reaches it */
function initRunaway() {
  const noBtns = Array.from(document.querySelectorAll('.btn-no'));
  if (!noBtns.length) return;
  document.addEventListener('mousemove', (e) => {
    noBtns.forEach(btn => {
      if (btn.style.display === 'none') return;
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (Math.hypot(e.clientX - cx, e.clientY - cy) < 110) runAway(btn);
    });
  });
}

/* ============================================================
   YES HANDLER — launches confetti then goes to yes.html
   ============================================================ */
function handleYes() {
  const yesBtn = document.querySelector('.btn-yes');
  if (yesBtn) { yesBtn.textContent = '💖 YES!! 💖'; yesBtn.disabled = true; }
  animateLoveMeter(100);
  launchConfetti();
  setTimeout(() => navigateTo('yes.html'), 2000);
}

/* ============================================================
   LANGUAGE TOGGLE
   ============================================================ */
function toggleLang() {
  lang = lang === 'en' ? 'hk' : 'en';
  localStorage.setItem('cathyLang', lang);
  const lbl = document.getElementById('langLabel');
  if (lbl) lbl.textContent = lang === 'en' ? '廣東話 🇭🇰' : 'English 🇬🇧';
  applyLang();
}

function applyLang() {
  document.querySelectorAll('[data-en]').forEach(el => {
    const v = el.getAttribute('data-' + lang);
    if (v) el.innerHTML = v;
  });
}

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
function navigateTo(url) {
  document.body.classList.add('page-out');
  setTimeout(() => { window.location.href = url; }, 280);
}

/* ============================================================
   NEXT CHAPTER BUTTON
   ============================================================ */
function goNext() {
  const next = CHAPTERS[PAGE_IDX + 1];
  if (next) { setProgress(PAGE_IDX + 1); navigateTo(next); }
}

/* ============================================================
   NAV DOTS — mark done/locked
   ============================================================ */
function initDots() {
  const progress = getProgress();
  document.querySelectorAll('a.cdot').forEach(a => {
    const href = a.getAttribute('href');
    const idx  = CHAPTERS.indexOf(href);
    if (idx < 0) return;

    if (a.classList.contains('active')) return;

    if (idx <= progress) {
      if (idx < PAGE_IDX) a.classList.add('done');
      a.classList.add('page-link');
      a.addEventListener('click', e => { e.preventDefault(); navigateTo(a.href); });
    } else {
      a.classList.add('locked');
      a.removeAttribute('href');
    }
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), d);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   STARS CANVAS
   ============================================================ */
function initStars() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', () => { resize(); build(); });

  function build() {
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: .2 + Math.random() * 1.1,
      a: Math.random(), da: (Math.random() - .5) * .007,
      speed: .08 + Math.random() * .12
    }));
  }
  build();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a = Math.max(.04, Math.min(1, s.a + s.da));
      if (s.a <= .04 || s.a >= 1) s.da *= -1;
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,255,${s.a * .65})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ============================================================
   FLOATING PARTICLES
   ============================================================ */
const EMOJIS = ['💖','🌸','✨','💕','🌷','💗','⭐','🫧','🌺','🦋'];

function spawnParticle() {
  const c = document.getElementById('particles');
  if (!c) return;
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (.8 + Math.random() * 1.2) + 'rem';
  const dur = 8 + Math.random() * 10;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = (Math.random() * 3) + 's';
  c.appendChild(el);
  setTimeout(() => el.remove(), (dur + 3) * 1000);
}

function startParticles() {
  for (let i = 0; i < 10; i++) setTimeout(spawnParticle, i * 500);
  setInterval(spawnParticle, 2000);
}

/* ============================================================
   LOVE METER
   ============================================================ */
function animateLoveMeter(target) {
  const fill = document.getElementById('loveFill');
  if (!fill) return;
  let cur = parseFloat(fill.style.width) || 0;
  const step = () => { cur = Math.min(cur + 1.5, target); fill.style.width = cur + '%'; if (cur < target) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ============================================================
   CONTRACT — stagger items + stamp
   ============================================================ */
function initContract() {
  const parchment = document.querySelector('.parchment');
  if (!parchment) return;

  const stampObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { const s = document.getElementById('stamp'); if (s) s.classList.add('visible'); }, 700);
        stampObs.unobserve(e.target);
      }
    });
  }, { threshold: .35 });
  stampObs.observe(parchment);

  const itemObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.ct-item').forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 130));
        itemObs.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  itemObs.observe(parchment);
}

/* ============================================================
   POEM LINE REVEAL
   ============================================================ */
function initPoem() {
  const box = document.querySelector('.poem-box');
  if (!box) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const lines = e.target.querySelectorAll('.poem-line');
        lines.forEach((l, i) => setTimeout(() => l.classList.add('visible'), i * 200));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  obs.observe(box);
}

/* ============================================================
   HUSBAND MATERIAL — stagger items
   ============================================================ */
function initHusbandMaterial() {
  const list = document.querySelector('.hm-list');
  if (!list) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.hm-item').forEach((item, i) => setTimeout(() => item.classList.add('visible'), i * 100));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  obs.observe(list);
}

/* ============================================================
   INTERACTIVE ANSWERS (single-page index.html only)
   ============================================================ */
const responseMsgs = {
  1: {
    yes:   { en: "Yay! Okay hold my hand, here we go 🥰", hk: "耶！好啦拖住我隻手，出發喇 🥰" },
    maybe: { en: "Aww don't be scared cutie, I'll be gentle 🥺", hk: "Aww 唔好驚啦靚女，我會好溫柔㗎 🥺" }
  },
  2: { yes: { en: "PHEW. Okay good. My heart can resume beating now 💓", hk: "鬆一口氣。好。我個心可以繼續跳喇 💓" } },
  3: {
    guilty:    { en: "Guilty as charged. I'll serve a life sentence with you 😤💖", hk: "認晒罪。我願意同你一齊服無期徒刑 😤💖" },
    convinced: { en: "The court is pleased. Case closed with a kiss 💋", hk: "法庭好滿意。以一個吻結案 💋" }
  },
  4: {
    agree:  { en: "Signed, sealed, yours. No takebacks ✍️💖", hk: "簽咗、封咗、係你嘅喇。冇得反悔 ✍️💖" },
    lawyer: { en: "Your lawyer called. They also said yes 📞😏", hk: "你律師打嚟。佢都話yes 📞😏" }
  },
  5: {
    cried:  { en: "Don't cry! Okay cry a little. I'm crying too 😭💕", hk: "唔好喊！好啦喊少少。我都喊緊 😭💕" },
    awww:   { en: "YOUR dummy. Specifically. Forever 🥺", hk: "係你嘅蠢蛋。特登咁。永遠 🥺" },
    cringe: { en: "Cringe is just love with confidence 😆💖", hk: "核突即係有自信嘅愛 😆💖" }
  },
  7: {
    keep:      { en: "Best hire of your life. I start immediately 💼💕", hk: "你一生最正嘅聘請。我即刻上工 💼💕" },
    probation: { en: "I'll pass probation in record time. Watch me 😏", hk: "我會破紀錄咁通過試用期。睇住 😏" }
  }
};

function answer(ch, key, btn) {
  const block = btn.closest('.q-block');
  block.querySelectorAll('.q-pick, .btn-no').forEach(b => {
    b.disabled = true;
    if (b !== btn) b.classList.add('faded');
  });
  btn.classList.add('selected');

  const resp = document.getElementById('resp' + ch);
  if (resp && responseMsgs[ch] && responseMsgs[ch][key]) {
    resp.textContent = responseMsgs[ch][key][lang];
    resp.classList.add('show');
  }

  if (ch === 2) animateLoveMeter(100);
  unlockChapter(ch + 1);
}

function unlockChapter(n) {
  const next = document.getElementById('ch' + n);
  if (!next || !next.classList.contains('locked')) return;
  setTimeout(() => {
    next.classList.remove('locked');
    initRevealFor(next);
    next.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 900);
}

function initRevealFor(parent) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), d);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  parent.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   QUIZ — step navigation + result (FIXED)
   ============================================================ */
function nextStep(currentId, nextId, progress) {
  const cur  = document.getElementById(currentId);
  const next = document.getElementById(nextId);
  const bar  = document.getElementById('qProgress');

  cur.style.transition = 'all .3s ease';
  cur.style.opacity    = '0';
  cur.style.transform  = 'translateX(-30px)';

  setTimeout(() => {
    cur.classList.remove('active');
    cur.style.cssText = '';
    next.classList.add('active');
    if (bar) bar.style.width = progress + '%';
  }, 300);
}

function showQuizResult() {
  const active = document.querySelector('.q-step.active');
  const result = document.getElementById('qResult');
  const bar    = document.getElementById('qProgress');

  if (active) {
    active.style.transition = 'all .3s ease';
    active.style.opacity    = '0';
    active.style.transform  = 'translateX(-30px)';
  }
  if (bar) bar.style.width = '100%';

  setTimeout(() => {
    if (active) active.classList.remove('active');
    if (result) {
      result.classList.remove('hidden');
      result.classList.add('active');
    }
    animateScore();
  }, 320);
}

function animateScore() {
  const numEl  = document.getElementById('scoreNum');
  const ring   = document.getElementById('ringFill');
  const circum = 327;
  let   cur    = 0;

  const tick = () => {
    cur = Math.min(cur + 1.4, 100);
    if (numEl) numEl.textContent = Math.round(cur) + '%';
    if (ring)  ring.style.strokeDashoffset = circum - (circum * cur / 100);
    if (cur < 100) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ============================================================
   CONFETTI
   ============================================================ */
const CONF_COLORS = ['#f472b6','#a78bfa','#fbbf24','#34d399','#fb7185','#fff','#c4b5fd','#fde68a'];

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    w: 6 + Math.random() * 10, h: 4 + Math.random() * 6,
    color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
    vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4,
    rot: Math.random() * 360, vr: (Math.random() - .5) * 8,
    alpha: 1, shape: Math.random() > .5 ? 'rect' : 'circle'
  }));

  let alive = true;
  const draw = () => {
    if (!alive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let any = false;
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += .08;
      if (p.y < canvas.height + 40) any = true;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      else { ctx.beginPath(); ctx.arc(0, 0, p.w/2, 0, Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    if (any) requestAnimationFrame(draw);
    else { alive = false; canvas.style.display = 'none'; }
  };
  requestAnimationFrame(draw);
  setTimeout(() => { alive = false; canvas.style.display = 'none'; }, 6000);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const lbl = document.getElementById('langLabel');
  if (lbl) lbl.textContent = lang === 'en' ? '廣東話 🇭🇰' : 'English 🇬🇧';
  if (lang !== 'en') applyLang();

  initDots();
  initStars();
  initReveal();
  initContract();
  initPoem();
  initHusbandMaterial();
  initRunaway();
  startParticles();

  /* love.html: pre-warm meter */
  const fill = document.getElementById('loveFill');
  if (fill) setTimeout(() => animateLoveMeter(72), 600);

  /* yes.html: auto-confetti + emoji loop */
  if (PAGE === 'yes.html') {
    setTimeout(launchConfetti, 400);
    const emojis = ['🎉','💍','💖','🎊','✨','🥂','💝','🌸'];
    let i = 0;
    setInterval(() => {
      const el = document.getElementById('celebEmoji');
      if (el) { el.textContent = emojis[i % emojis.length]; i++; }
    }, 700);
  }
});
