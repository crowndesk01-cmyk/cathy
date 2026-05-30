/* ============================================================
   CATHY 💖 — script.js  (multi-page edition)
   ============================================================ */

/* ---- State ---- */
let lang = localStorage.getItem('cathyLang') || 'en';
let noCount = 0;
let loveFillValue = 0;
const chapterAnswers = {};

/* ============================================================
   INTERACTIVE ANSWERS — each chapter asks, then unlocks next
   ============================================================ */
const responseMsgs = {
  1: {
    yes:   { en: "Yay! Okay hold my hand, here we go 🥰", hk: "耶！好啦拖住我隻手，出發喇 🥰" },
    maybe: { en: "Aww don't be scared cutie, I'll be gentle 🥺", hk: "Aww 唔好驚啦靚女，我會好溫柔㗎 🥺" }
  },
  2: {
    yes: { en: "PHEW. Okay good. My heart can resume beating now 💓", hk: "鬆一口氣。好。我個心可以繼續跳喇 💓" }
  },
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
  /* record her choice */
  const block = btn.closest('.q-block');
  const picks = block.querySelectorAll('.q-pick, .btn-no');
  picks.forEach(b => {
    b.disabled = true;
    if (b !== btn) b.classList.add('faded');
  });
  btn.classList.add('selected');
  chapterAnswers[ch] = btn.textContent.trim();

  /* show response */
  const resp = document.getElementById('resp' + ch);
  if (resp && responseMsgs[ch] && responseMsgs[ch][key]) {
    resp.textContent = responseMsgs[ch][key][lang];
    resp.classList.add('show');
  }

  if (ch === 2) animateLoveMeter(100);

  /* unlock next chapter */
  unlockChapter(ch + 1);
}

function unlockChapter(n) {
  const next = document.getElementById('ch' + n);
  if (!next || !next.classList.contains('locked')) return;
  setTimeout(() => {
    next.classList.remove('locked');
    next.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const d = parseInt(e.target.dataset.delay || 0);
            setTimeout(() => e.target.classList.add('visible'), d);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      obs.observe(el);
    });
    next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 900);
}

/* ============================================================
   SCROLL-SPY — highlight active chapter dot
   ============================================================ */
function initScrollSpy() {
  const dots = document.querySelectorAll('.cdot');
  const info = document.getElementById('chapterInfo');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const n = parseInt(e.target.dataset.chapter);
        dots.forEach((d, i) => d.classList.toggle('active', i === n - 1));
        if (info) info.textContent = String(n).padStart(2, '0') + ' / 09';
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.chapter').forEach(c => obs.observe(c));
}

/* ============================================================
   RECAP — replay her answers in the final chapter
   ============================================================ */
const recapLabels = {
  1: { en: "You bravely pressed Begin",        hk: "你勇敢咁撳咗開始" },
  2: { en: "Do you love me?",                  hk: "你愛唔愛我？" },
  3: { en: "The verdict",                      hk: "裁決" },
  4: { en: "The contract",                     hk: "合約" },
  5: { en: "The poem",                         hk: "首詩" },
  7: { en: "Boyfriend material?",              hk: "好男友料子？" },
  8: { en: "Will you be mine?",                hk: "你願意做我嘅人嗎？" }
};

function buildRecap() {
  const box = document.getElementById('recap');
  if (!box) return;
  box.innerHTML = '';
  const title = document.createElement('p');
  title.className = 'recap-title';
  title.textContent = lang === 'en' ? 'Everything you said along the way 💌' : '你一路講過嘅嘢 💌';
  box.appendChild(title);
  Object.keys(recapLabels).forEach(ch => {
    if (!chapterAnswers[ch]) return;
    const row = document.createElement('div');
    row.className = 'recap-row';
    row.innerHTML = `<span class="recap-q">${recapLabels[ch][lang]}</span><span class="recap-a">${chapterAnswers[ch]}</span>`;
    box.appendChild(row);
  });
}

/* ============================================================
   STAR CANVAS
   ============================================================ */
function initStars() {
  const canvas = document.getElementById('starsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildStars(); });

  function buildStars() {
    stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.3 + Math.random() * 1.2,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.008,
      speed: 0.1 + Math.random() * 0.15
    }));
  }
  buildStars();

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a = Math.max(0.05, Math.min(1, s.a + s.da));
      if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(237,232,224,${s.a * 0.75})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
function navigateTo(url) {
  document.body.classList.add('page-out');
  setTimeout(() => { window.location.href = url; }, 280);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a.page-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.href);
    });
  });
});

const escapeMsgs = {
  en: [
    "nice try 😂",
    "it ran away AGAIN 💀",
    "the button is faster than you. embarrassing.",
    "have you considered just clicking Yes? 👀",
    "the No button has retained legal counsel",
    "this button has Olympic-level reflexes 🥇",
    "it literally trains every day to escape you",
    "scientists are now studying this button",
    "the button filed a restraining order 📄",
    "that button has left the building 🚪",
    "it's in witness protection now",
    "the button called the police on you",
    "it applied for a visa. it is leaving the country.",
    "give up. click Yes. your life will improve immediately. 💖",
    "the button is on a beach somewhere. without you."
  ],
  hk: [
    "想都唔好想 😂",
    "佢又跑走咗 💀",
    "個掣比你快好多。尷尬。",
    "不如直接撳「係」呀？👀",
    "「唔係」掣已聘請律師",
    "呢個掣有奧運級反應 🥇",
    "佢每日都訓練緊點逃走",
    "科學家正在研究呢個掣",
    "個掣申請咗禁制令 📄",
    "個掣已經離開大廈 🚪",
    "佢依家係證人保護計劃入面",
    "個掣已經報警告你",
    "佢申請簽證。佢要離開呢個國家。",
    "放棄啦。撳「係」。你嘅生活會立即改善。💖",
    "個掣依家喺某個海灘。冇你。"
  ]
};

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
    const val = el.getAttribute('data-' + lang);
    if (val) el.innerHTML = val;
  });
}

/* ============================================================
   FLOATING PARTICLES
   ============================================================ */
const EMOJIS = ['💖','🌸','✨','💕','🌷','💗','⭐','🫧','🌺'];

function spawnParticle() {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
  const dur = 7 + Math.random() * 10;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = (Math.random() * 4) + 's';
  document.getElementById('particles').appendChild(el);
  setTimeout(() => el.remove(), (dur + 4) * 1000);
}

function startParticles() {
  for (let i = 0; i < 12; i++) setTimeout(spawnParticle, i * 400);
  setInterval(spawnParticle, 1800);
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ============================================================
   CONTRACT — stagger + stamp
   ============================================================ */
function initContract() {
  const stampObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => document.getElementById('stamp').classList.add('visible'), 600);
        stampObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  const contractCard = document.querySelector('.parchment');
  if (contractCard) stampObs.observe(contractCard);

  const itemObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.ct-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 120);
        });
        itemObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  if (contractCard) itemObs.observe(contractCard);
}

/* ============================================================
   LOVE METER — animates as user scrolls to #love
   ============================================================ */
function initLoveMeter() {
  const loveSection = document.getElementById('ch2');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateLoveMeter(78);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  if (loveSection) obs.observe(loveSection);
}

function animateLoveMeter(target) {
  const fill = document.getElementById('loveFill');
  if (!fill) return;
  let current = 0;
  const step = () => {
    current = Math.min(current + 1.5, target);
    fill.style.width = current + '%';
    if (current < target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ============================================================
   NO BUTTON — runs away
   ============================================================ */
function runAway(btn) {
  noCount++;
  const parent = btn.parentElement;
  const pRect  = parent.getBoundingClientRect();
  const bRect  = btn.getBoundingClientRect();

  const maxX = pRect.width  - bRect.width  - 8;
  const maxY = pRect.height - bRect.height - 8;

  const rx = Math.max(8, Math.random() * maxX);
  const ry = Math.max(8, Math.random() * maxY);

  btn.style.position = 'absolute';
  btn.style.left = rx + 'px';
  btn.style.top  = ry + 'px';
  btn.style.transition = 'left 0.18s ease, top 0.18s ease';

  const msgs = escapeMsgs[lang];
  const chapter = btn.closest('.chapter') || document;
  const msgEl = chapter.querySelector('.escape-msg');
  if (msgEl) msgEl.textContent = msgs[Math.min(noCount - 1, msgs.length - 1)];

  animateLoveMeter(Math.min(78 + noCount * 3, 96));
}

/* ============================================================
   YES HANDLER
   ============================================================ */
function handleYes() {
  animateLoveMeter(100);
  launchConfetti();
  chapterAnswers[8] = lang === 'en' ? 'Yes, always 💍' : '係，永遠 💍';
  const block = document.querySelector('#ch8 .q-block');
  if (block) block.querySelectorAll('button').forEach(b => b.disabled = true);
  buildRecap();
  unlockChapter(9);
  /* cycle celebration emoji */
  const emojis = ['🎉','💍','💖','🎊','✨','🥂','💝','🌸'];
  let i = 0;
  setInterval(() => {
    const el = document.getElementById('celebEmoji');
    if (el) { el.textContent = emojis[i % emojis.length]; i++; }
  }, 700);
}

/* ============================================================
   QUIZ
   ============================================================ */
function nextStep(currentId, nextId, progress) {
  const current = document.getElementById(currentId);
  const next    = document.getElementById(nextId);
  const bar     = document.getElementById('qProgress');

  current.style.animation = 'none';
  current.style.opacity = '0';
  current.style.transform = 'translateX(-30px)';
  current.style.transition = 'all 0.3s ease';

  setTimeout(() => {
    current.classList.remove('active');
    current.style.cssText = '';
    next.classList.add('active');
    if (bar) bar.style.width = progress + '%';
  }, 300);
}

function showQuizResult() {
  const qs3    = document.getElementById('qs3');
  const result = document.getElementById('qResult');
  const bar    = document.getElementById('qProgress');

  qs3.style.opacity = '0';
  qs3.style.transform = 'translateX(-30px)';
  qs3.style.transition = 'all 0.3s ease';

  setTimeout(() => {
    qs3.classList.remove('active');
    result.classList.remove('hidden');
    result.classList.add('active');
    if (bar) bar.style.width = '100%';
    animateScore();
    chapterAnswers[6] = lang === 'en' ? '100% compatible 🧪' : '100% 相容 🧪';
    unlockChapter(7);
  }, 300);
}

function animateScore() {
  const numEl  = document.getElementById('scoreNum');
  const ring   = document.getElementById('ringFill');
  const circum = 327;
  let current  = 0;
  const target = 100;

  const tick = () => {
    current = Math.min(current + 1.4, target);
    if (numEl) numEl.textContent = Math.round(current) + '%';
    if (ring)  ring.style.strokeDashoffset = circum - (circum * current / 100);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ============================================================
   CONFETTI
   ============================================================ */
const CONF_COLORS = ['#e91e8c','#ff6bac','#c260d4','#ffd700','#ff4d88','#fff','#f9a8d4','#a78bfa'];

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  canvas.style.display = 'block';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const pieces = Array.from({ length: 180 }, () => ({
    x:     Math.random() * canvas.width,
    y:     Math.random() * canvas.height - canvas.height,
    w:     6 + Math.random() * 10,
    h:     4 + Math.random() * 6,
    color: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
    vx:    (Math.random() - 0.5) * 4,
    vy:    2 + Math.random() * 4,
    rot:   Math.random() * 360,
    vr:    (Math.random() - 0.5) * 8,
    alpha: 1,
    shape: Math.random() > 0.5 ? 'rect' : 'circle'
  }));

  let alive = true;
  const draw = () => {
    if (!alive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let any = false;
    pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vr;
      p.vy  += 0.08;
      if (p.y < canvas.height + 40) any = true;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    if (any) requestAnimationFrame(draw);
    else {
      alive = false;
      canvas.style.display = 'none';
    }
  };
  requestAnimationFrame(draw);

  setTimeout(() => {
    alive = false;
    canvas.style.display = 'none';
  }, 6000);
}

/* ============================================================
   CURSOR HEART TRAIL
   ============================================================ */
function initCursorTrail() {
  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.35) return;
    const h = document.createElement('div');
    h.textContent = Math.random() > 0.5 ? '💖' : '✨';
    h.style.cssText = `
      position:fixed;
      left:${e.clientX - 10}px;
      top:${e.clientY - 10}px;
      font-size:${0.7 + Math.random() * 0.7}rem;
      pointer-events:none;
      z-index:8000;
      opacity:1;
      transition:opacity 0.8s ease, transform 0.8s ease;
      user-select:none;
    `;
    document.body.appendChild(h);
    requestAnimationFrame(() => {
      h.style.opacity = '0';
      h.style.transform = `translateY(-${20 + Math.random() * 30}px) scale(0.4)`;
    });
    setTimeout(() => h.remove(), 900);
  });
}

/* ============================================================
   POEM LINE REVEAL
   ============================================================ */
function initPoem() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const lines = e.target.querySelectorAll('.poem-line');
        lines.forEach((line, i) => {
          setTimeout(() => line.classList.add('visible'), i * 180);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  const poemBox = document.querySelector('.poem-box');
  if (poemBox) obs.observe(poemBox);
}

/* ============================================================
   HUSBAND MATERIAL STAGGER
   ============================================================ */
function initHusbandMaterial() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.hm-item').forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  const hmList = document.querySelector('.hm-list');
  if (hmList) obs.observe(hmList);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* apply saved lang */
  const lbl = document.getElementById('langLabel');
  if (lbl) lbl.textContent = lang === 'en' ? '廣東話 🇭🇰' : 'English 🇬🇧';
  if (lang !== 'en') applyLang();

  initStars();
  initReveal();
  initContract();
  initLoveMeter();
  initCursorTrail();
  initPoem();
  initHusbandMaterial();
  initScrollSpy();
});
