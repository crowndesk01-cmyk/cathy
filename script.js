/* ============================================================
   CATHY 💖 — script.js
   ============================================================ */

/* ---- State ---- */
let lang = 'en';
let noCount = 0;
let loveFillValue = 0;

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
  document.getElementById('langLabel').textContent =
    lang === 'en' ? '廣東話 🇭🇰' : 'English 🇬🇧';
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
  const loveSection = document.getElementById('love');
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
  const msgEl = document.getElementById('escapeMsg');
  if (msgEl) msgEl.textContent = msgs[Math.min(noCount - 1, msgs.length - 1)];

  animateLoveMeter(Math.min(78 + noCount * 3, 96));
}

/* ============================================================
   YES HANDLER
   ============================================================ */
function handleYes() {
  animateLoveMeter(100);

  const celebration = document.getElementById('celebration');
  celebration.classList.remove('hidden');

  setTimeout(() => {
    celebration.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);

  launchConfetti();

  const celebEmoji = document.getElementById('celebEmoji');
  const emojis = ['🎉','💍','💖','🎊','✨','🥂','💝','🌸'];
  let i = 0;
  setInterval(() => {
    celebEmoji.textContent = emojis[i % emojis.length];
    i++;
  }, 600);
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
    result.classList.add('active');
    if (bar) bar.style.width = '100%';
    animateScore();
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
  document.body.style.paddingBottom = '38px';
  startParticles();
  initReveal();
  initContract();
  initLoveMeter();
  initCursorTrail();
  initPoem();
  initHusbandMaterial();
});
