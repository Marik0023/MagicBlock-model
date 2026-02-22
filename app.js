const STEPS = [
  { key: 'base', label: '1. Фігурка', hint: 'Вибери базову фігурку' },
  { key: 'hair', label: '2. Волосся', hint: 'Додай зачіску' },
  { key: 'top', label: '3. Верх', hint: 'Оберіть верхній одяг' },
  { key: 'bottom', label: '4. Низ', hint: 'Оберіть нижній одяг' },
  { key: 'extras', label: '5. Аксесуари', hint: 'Окуляри / кепка / шия' },
  { key: 'finish', label: '6. Скачати', hint: 'Готово — скачай картинку' },
];

const CATALOG = {
  base: [
    { id: 'base_round', name: 'Round Hero', shape: 'round', skin: '#f2c49a' },
    { id: 'base_square', name: 'Square Scout', shape: 'square', skin: '#deb08b' },
    { id: 'base_slim', name: 'Slim Runner', shape: 'slim', skin: '#f0bd95' },
  ],
  hair: [
    { id: 'hair_none', name: 'Без волосся', type: 'none', color: '#2b2b33' },
    { id: 'hair_short', name: 'Short', type: 'short', color: '#2f2e36' },
    { id: 'hair_side', name: 'Side Part', type: 'side', color: '#1f1f27' },
    { id: 'hair_curl', name: 'Curly', type: 'curly', color: '#2e241f' },
    { id: 'hair_long', name: 'Long', type: 'long', color: '#2b2327' },
    { id: 'hair_spike', name: 'Spiky', type: 'spike', color: '#1e2029' },
  ],
  top: [
    { id: 'top_tee', name: 'T-Shirt', type: 'tee', color: '#7f8cff' },
    { id: 'top_hoodie', name: 'Hoodie', type: 'hoodie', color: '#4f66ff' },
    { id: 'top_jacket', name: 'Jacket', type: 'jacket', color: '#2f3345' },
    { id: 'top_shirt', name: 'Shirt', type: 'shirt', color: '#cfd8ff' },
    { id: 'top_sweater', name: 'Sweater', type: 'sweater', color: '#7b6de3' },
    { id: 'top_vest', name: 'Vest', type: 'vest', color: '#233142' },
  ],
  bottom: [
    { id: 'bottom_jeans', name: 'Jeans', type: 'jeans', color: '#2f5ea8' },
    { id: 'bottom_black', name: 'Black Pants', type: 'pants', color: '#242733' },
    { id: 'bottom_shorts', name: 'Shorts', type: 'shorts', color: '#3b4257' },
    { id: 'bottom_joggers', name: 'Joggers', type: 'joggers', color: '#4b4f63' },
    { id: 'bottom_beige', name: 'Beige Pants', type: 'pants', color: '#c3ab8c' },
    { id: 'bottom_skirt', name: 'Skirt', type: 'skirt', color: '#8b5cf6' },
  ],
  extras: {
    hat: [
      { id: 'hat_none', name: 'Без кепки', type: 'none', color: '#000000' },
      { id: 'hat_cap', name: 'Cap', type: 'cap', color: '#262d40' },
      { id: 'hat_beanie', name: 'Beanie', type: 'beanie', color: '#5d3fd3' },
      { id: 'hat_bucket', name: 'Bucket', type: 'bucket', color: '#4d5bd9' },
    ],
    glasses: [
      { id: 'glasses_none', name: 'Без окулярів', type: 'none', color: '#000000' },
      { id: 'glasses_round', name: 'Round Glasses', type: 'round', color: '#1c2234' },
      { id: 'glasses_square', name: 'Square Glasses', type: 'square', color: '#1a1f2f' },
      { id: 'glasses_sun', name: 'Sunglasses', type: 'sun', color: '#111318' },
    ],
    neck: [
      { id: 'neck_none', name: 'Без аксесуару', type: 'none', color: '#000' },
      { id: 'neck_chain', name: 'Chain', type: 'chain', color: '#cfd4e8' },
      { id: 'neck_scarf', name: 'Scarf', type: 'scarf', color: '#ff7aa2' },
      { id: 'neck_tie', name: 'Tie', type: 'tie', color: '#6ea8ff' },
    ]
  }
};

const DEFAULT_STATE = {
  base: 'base_round',
  hair: 'hair_short',
  top: 'top_tee',
  bottom: 'bottom_jeans',
  extras: {
    hat: 'hat_none',
    glasses: 'glasses_none',
    neck: 'neck_none'
  }
};

const STORAGE_KEY = 'figure_dresser_simple_v1';

let state = loadState();
let currentStep = 0;
let saveTimer = null;

const refs = {
  canvas: document.getElementById('figureCanvas'),
  steps: document.getElementById('steps'),
  optionsGrid: document.getElementById('optionsGrid'),
  stepTitle: document.getElementById('stepTitle'),
  stepHint: document.getElementById('stepHint'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  resetBtn: document.getElementById('resetBtn'),
  randomBtn: document.getElementById('randomBtn'),
  downloadBtn: document.getElementById('downloadBtn'),
  downloadTransparentBtn: document.getElementById('downloadTransparentBtn'),
  saveStatus: document.getElementById('saveStatus')
};
const ctx = refs.canvas.getContext('2d');

init();

function init() {
  renderStepChips();
  renderCurrentStep();
  renderFigure();
  bindEvents();
}

function bindEvents() {
  refs.prevBtn.addEventListener('click', () => {
    currentStep = Math.max(0, currentStep - 1);
    renderCurrentStep();
  });
  refs.nextBtn.addEventListener('click', () => {
    currentStep = Math.min(STEPS.length - 1, currentStep + 1);
    renderCurrentStep();
  });
  refs.resetBtn.addEventListener('click', () => {
    state = structuredClone(DEFAULT_STATE);
    currentStep = 0;
    persistSoon();
    rerenderAll();
  });
  refs.randomBtn.addEventListener('click', () => {
    randomizeAll();
    persistSoon();
    rerenderAll();
  });
  refs.downloadBtn.addEventListener('click', () => downloadPng(false));
  refs.downloadTransparentBtn.addEventListener('click', () => downloadPng(true));
}

function rerenderAll() {
  renderStepChips();
  renderCurrentStep();
  renderFigure();
}

function renderStepChips() {
  refs.steps.innerHTML = '';
  STEPS.forEach((step, index) => {
    const el = document.createElement('button');
    el.className = 'step-chip';
    if (index === currentStep) el.classList.add('active');
    if (index < currentStep) el.classList.add('done');
    el.textContent = step.label;
    el.type = 'button';
    el.addEventListener('click', () => {
      currentStep = index;
      renderCurrentStep();
      renderStepChips();
    });
    refs.steps.appendChild(el);
  });
}

function renderCurrentStep() {
  renderStepChips();
  const step = STEPS[currentStep];
  refs.stepTitle.textContent = step.label;
  refs.stepHint.textContent = step.hint;
  refs.optionsGrid.innerHTML = '';

  refs.prevBtn.disabled = currentStep === 0;
  refs.nextBtn.disabled = currentStep === STEPS.length - 1;
  refs.nextBtn.textContent = currentStep === STEPS.length - 2 ? 'До скачування →' : (currentStep === STEPS.length - 1 ? 'Готово' : 'Далі →');

  if (step.key === 'finish') {
    renderFinishCards();
    return;
  }

  if (step.key === 'extras') {
    renderExtrasGroups();
    return;
  }

  const options = CATALOG[step.key];
  const selectedId = state[step.key];
  options.forEach((opt) => {
    const card = makeOptionCard(opt, selectedId === opt.id, step.key, () => {
      state[step.key] = opt.id;
      persistSoon();
      renderCurrentStep();
      renderFigure();
    });
    refs.optionsGrid.appendChild(card);
  });
}

function renderFinishCards() {
  const items = [
    { title: 'Скачати PNG', sub: 'Фон + фігурка', onClick: () => downloadPng(false) },
    { title: 'Прозорий PNG', sub: 'Тільки фігурка', onClick: () => downloadPng(true) },
    { title: 'Randomize', sub: 'Швидкий варіант', onClick: () => { randomizeAll(); persistSoon(); rerenderAll(); } },
    { title: 'Reset', sub: 'Почати заново', onClick: () => { state = structuredClone(DEFAULT_STATE); currentStep = 0; persistSoon(); rerenderAll(); } },
  ];
  items.forEach((item) => {
    const btn = document.createElement('button');
    btn.className = 'option-card';
    btn.type = 'button';
    btn.innerHTML = `
      <div class="option-swatch" style="display:grid;place-items:center;font-size:20px;">⬇️</div>
      <div class="option-title">${escapeHtml(item.title)}</div>
      <div class="option-sub">${escapeHtml(item.sub)}</div>
    `;
    btn.addEventListener('click', item.onClick);
    refs.optionsGrid.appendChild(btn);
  });
}

function renderExtrasGroups() {
  refs.optionsGrid.style.gridTemplateColumns = '1fr';
  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gap = '10px';

  ['hat', 'glasses', 'neck'].forEach((groupKey) => {
    const section = document.createElement('div');
    section.style.border = '1px solid var(--stroke)';
    section.style.borderRadius = '12px';
    section.style.padding = '10px';
    section.style.background = 'rgba(255,255,255,0.01)';

    const title = document.createElement('div');
    title.textContent = groupLabel(groupKey);
    title.style.fontWeight = '700';
    title.style.fontSize = '13px';
    title.style.marginBottom = '8px';
    section.appendChild(title);

    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
    row.style.gap = '8px';

    CATALOG.extras[groupKey].forEach((opt) => {
      const card = makeOptionCard(opt, state.extras[groupKey] === opt.id, `extras:${groupKey}`, () => {
        state.extras[groupKey] = opt.id;
        persistSoon();
        renderCurrentStep();
        renderFigure();
      });
      card.style.minHeight = '100px';
      row.appendChild(card);
    });

    section.appendChild(row);
    wrapper.appendChild(section);
  });

  refs.optionsGrid.appendChild(wrapper);
}

function groupLabel(key) {
  return key === 'hat' ? 'Кепка / головний убір' : key === 'glasses' ? 'Окуляри' : 'Шия';
}

function makeOptionCard(opt, active, categoryKey, onClick) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'option-card' + (active ? ' active' : '');

  const mini = document.createElement('canvas');
  mini.width = 180;
  mini.height = 90;
  mini.className = 'option-mini-canvas';
  drawMiniPreview(mini, categoryKey, opt);

  const title = document.createElement('div');
  title.className = 'option-title';
  title.textContent = opt.name;

  const sub = document.createElement('div');
  sub.className = 'option-sub';
  sub.textContent = opt.id.replace(/_/g, ' ');

  card.appendChild(mini);
  card.appendChild(title);
  card.appendChild(sub);
  card.addEventListener('click', onClick);

  return card;
}

function drawMiniPreview(canvas, categoryKey, opt) {
  const c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = 'rgba(255,255,255,0.02)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  // Tiny figure silhouette base
  c.fillStyle = '#d3b093';
  c.beginPath();
  c.arc(45, 34, 18, 0, Math.PI * 2);
  c.fill();
  c.fillRect(35, 52, 20, 16);
  c.fillRect(32, 67, 8, 14);
  c.fillRect(50, 67, 8, 14);

  // Draw option swatch/shape
  c.fillStyle = opt.color || '#7f8cff';
  c.strokeStyle = 'rgba(255,255,255,0.12)';
  c.lineWidth = 2;

  const key = categoryKey.startsWith('extras:') ? categoryKey.split(':')[1] : categoryKey;
  switch (key) {
    case 'base':
      c.fillStyle = opt.skin || '#d3b093';
      if (opt.shape === 'round') {
        c.beginPath(); c.arc(135, 40, 22, 0, Math.PI * 2); c.fill();
      } else if (opt.shape === 'square') {
        c.fillRect(113, 18, 44, 44);
      } else {
        roundRect(c, 116, 16, 38, 48, 14, true, false);
      }
      break;
    case 'hair':
      c.fillRect(110, 20, 50, 16);
      c.fillRect(116, 16, 38, 12);
      if (opt.type === 'curly') {
        for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(115 + i * 10, 38, 6, 0, Math.PI * 2); c.fill(); }
      }
      if (opt.type === 'long') c.fillRect(112, 30, 46, 26);
      if (opt.type === 'none') { c.clearRect(108, 12, 58, 52); c.strokeRect(112, 20, 50, 30); }
      break;
    case 'top':
      roundRect(c, 108, 22, 56, 44, 12, true, false);
      if (opt.type === 'jacket' || opt.type === 'vest') {
        c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(134, 24, 4, 40);
      }
      if (opt.type === 'hoodie') {
        c.strokeStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.arc(136, 33, 12, 0, Math.PI); c.stroke();
      }
      break;
    case 'bottom':
      c.fillRect(116, 20, 40, 18);
      c.fillRect(118, 38, 14, 28);
      c.fillRect(140, 38, 14, 28);
      if (opt.type === 'skirt') {
        c.beginPath(); c.moveTo(116, 36); c.lineTo(156, 36); c.lineTo(164, 62); c.lineTo(108, 62); c.closePath(); c.fill();
      }
      if (opt.type === 'shorts') {
        c.clearRect(118, 52, 14, 14); c.clearRect(140, 52, 14, 14);
      }
      break;
    case 'hat':
      if (opt.type !== 'none') {
        if (opt.type === 'cap') { c.fillRect(112, 28, 46, 12); c.fillRect(150, 36, 14, 4); }
        if (opt.type === 'beanie') { c.beginPath(); c.arc(136, 42, 22, Math.PI, 0); c.fill(); c.fillRect(114, 42, 44, 8); }
        if (opt.type === 'bucket') { c.fillRect(118, 26, 36, 20); c.beginPath(); c.moveTo(112, 46); c.lineTo(160, 46); c.lineTo(154, 54); c.lineTo(118, 54); c.closePath(); c.fill(); }
      }
      break;
    case 'glasses':
      if (opt.type !== 'none') {
        c.strokeStyle = opt.color || '#1f2434'; c.lineWidth = 3;
        if (opt.type === 'round') {
          c.beginPath(); c.arc(124, 42, 10, 0, Math.PI * 2); c.stroke();
          c.beginPath(); c.arc(148, 42, 10, 0, Math.PI * 2); c.stroke();
        } else {
          c.strokeRect(114, 32, 20, 18); c.strokeRect(138, 32, 20, 18);
        }
        c.beginPath(); c.moveTo(134, 40); c.lineTo(138, 40); c.stroke();
      }
      break;
    case 'neck':
      if (opt.type === 'chain') { c.strokeStyle = opt.color; c.lineWidth = 3; c.beginPath(); c.arc(136, 36, 18, 0.15*Math.PI, 0.85*Math.PI); c.stroke(); }
      if (opt.type === 'scarf') { c.fillRect(126, 20, 20, 38); c.fillRect(120, 20, 32, 10); }
      if (opt.type === 'tie') { c.beginPath(); c.moveTo(136, 20); c.lineTo(146, 34); c.lineTo(136, 68); c.lineTo(126, 34); c.closePath(); c.fill(); }
      if (opt.type === 'none') { c.strokeStyle = 'rgba(255,255,255,.2)'; c.strokeRect(114, 20, 44, 46); }
      break;
    default:
      c.fillRect(110, 20, 50, 40);
  }
}

function renderFigure(transparent = false, customCtx = ctx, customCanvas = refs.canvas) {
  const c = customCtx;
  const canvas = customCanvas;
  c.clearRect(0, 0, canvas.width, canvas.height);

  if (!transparent) {
    drawSceneBackground(c, canvas);
    drawFloorShadow(c, canvas);
  }

  const base = findById(CATALOG.base, state.base);
  const hair = findById(CATALOG.hair, state.hair);
  const top = findById(CATALOG.top, state.top);
  const bottom = findById(CATALOG.bottom, state.bottom);
  const hat = findById(CATALOG.extras.hat, state.extras.hat);
  const glasses = findById(CATALOG.extras.glasses, state.extras.glasses);
  const neck = findById(CATALOG.extras.neck, state.extras.neck);

  const centerX = canvas.width / 2;
  const baseY = canvas.height * 0.58;
  const scale = 1.35;

  c.save();
  c.translate(centerX, baseY);
  c.scale(scale, scale);

  // Legs + shoes (base skin first)
  drawLegs(c, base, bottom);
  drawBody(c, base, top, neck);
  drawArms(c, base, top);
  drawHead(c, base);
  drawHair(c, hair, base);
  drawHat(c, hat);
  drawFace(c, base);
  drawGlasses(c, glasses);

  c.restore();

  if (!transparent) drawCaption(c, canvas);
}

function drawSceneBackground(c, canvas) {
  const g = c.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#0b0f1d');
  g.addColorStop(1, '#090b13');
  c.fillStyle = g;
  c.fillRect(0, 0, canvas.width, canvas.height);

  const glow1 = c.createRadialGradient(canvas.width * 0.35, canvas.height * 0.25, 10, canvas.width * 0.35, canvas.height * 0.25, 280);
  glow1.addColorStop(0, 'rgba(127,140,255,0.20)');
  glow1.addColorStop(1, 'rgba(127,140,255,0)');
  c.fillStyle = glow1;
  c.fillRect(0, 0, canvas.width, canvas.height);

  const glow2 = c.createRadialGradient(canvas.width * 0.72, canvas.height * 0.18, 10, canvas.width * 0.72, canvas.height * 0.18, 240);
  glow2.addColorStop(0, 'rgba(85,210,255,0.14)');
  glow2.addColorStop(1, 'rgba(85,210,255,0)');
  c.fillStyle = glow2;
  c.fillRect(0, 0, canvas.width, canvas.height);

  // subtle grid
  c.strokeStyle = 'rgba(255,255,255,0.03)';
  c.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 40) {
    c.beginPath(); c.moveTo(x + 0.5, 0); c.lineTo(x + 0.5, canvas.height); c.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    c.beginPath(); c.moveTo(0, y + 0.5); c.lineTo(canvas.width, y + 0.5); c.stroke();
  }
}

function drawFloorShadow(c, canvas) {
  c.save();
  c.translate(canvas.width / 2, canvas.height * 0.76);
  c.scale(1, 0.35);
  const g = c.createRadialGradient(0, 0, 10, 0, 0, 170);
  g.addColorStop(0, 'rgba(0,0,0,0.5)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g;
  c.beginPath();
  c.arc(0, 0, 170, 0, Math.PI * 2);
  c.fill();
  c.restore();
}

function drawCaption(c, canvas) {
  c.fillStyle = 'rgba(255,255,255,0.8)';
  c.font = '600 26px Inter, system-ui';
  c.textAlign = 'center';
  c.fillText('CUSTOM FIGURE', canvas.width / 2, canvas.height - 44);
  c.fillStyle = 'rgba(255,255,255,0.45)';
  c.font = '500 14px Inter, system-ui';
  c.fillText('Figure Dresser MVP · frontend-only', canvas.width / 2, canvas.height - 20);
}

function drawHead(c, base) {
  c.save();
  c.fillStyle = base.skin;
  c.strokeStyle = 'rgba(0,0,0,0.16)';
  c.lineWidth = 2;

  if (base.shape === 'round') {
    c.beginPath(); c.arc(0, -120, 62, 0, Math.PI * 2); c.fill(); c.stroke();
  } else if (base.shape === 'square') {
    roundRect(c, -58, -180, 116, 120, 18, true, true);
  } else {
    roundRect(c, -52, -184, 104, 128, 30, true, true);
  }
  c.restore();
}

function drawHair(c, hair, base) {
  if (!hair || hair.type === 'none') return;
  c.save();
  c.fillStyle = hair.color;
  c.strokeStyle = 'rgba(0,0,0,0.15)';
  c.lineWidth = 1.5;
  const topY = base.shape === 'round' ? -176 : -188;

  switch (hair.type) {
    case 'short':
      roundRect(c, -52, topY, 104, 34, 18, true, true);
      break;
    case 'side':
      roundRect(c, -54, topY + 4, 108, 30, 16, true, true);
      c.beginPath(); c.moveTo(-10, topY + 4); c.lineTo(50, topY + 10); c.lineTo(50, topY + 30); c.lineTo(-4, topY + 22); c.closePath(); c.fill();
      break;
    case 'curly':
      for (let i = -4; i <= 4; i++) {
        c.beginPath(); c.arc(i * 12, topY + 18 + (Math.abs(i)%2?4:0), 14, 0, Math.PI * 2); c.fill();
      }
      c.fillRect(-56, topY + 18, 112, 18);
      break;
    case 'long':
      roundRect(c, -50, topY, 100, 30, 16, true, true);
      c.fillRect(-52, topY + 16, 18, 78);
      c.fillRect(34, topY + 16, 18, 78);
      break;
    case 'spike':
      c.beginPath();
      c.moveTo(-56, topY + 30);
      for (let i = 0; i < 8; i++) {
        c.lineTo(-56 + i * 14 + 7, topY - (i % 2 === 0 ? 8 : 22));
        c.lineTo(-56 + (i + 1) * 14, topY + 30);
      }
      c.closePath();
      c.fill();
      break;
  }
  c.restore();
}

function drawHat(c, hat) {
  if (!hat || hat.type === 'none') return;
  c.save();
  c.fillStyle = hat.color;
  c.strokeStyle = 'rgba(0,0,0,0.18)';
  c.lineWidth = 1.5;

  if (hat.type === 'cap') {
    roundRect(c, -44, -182, 88, 20, 10, true, true);
    roundRect(c, 26, -172, 34, 10, 6, true, true);
  } else if (hat.type === 'beanie') {
    c.beginPath(); c.arc(0, -156, 48, Math.PI, 0); c.fill(); c.stroke();
    roundRect(c, -46, -156, 92, 16, 8, true, true);
    c.beginPath(); c.arc(0, -205, 8, 0, Math.PI * 2); c.fill();
  } else if (hat.type === 'bucket') {
    roundRect(c, -34, -184, 68, 26, 8, true, true);
    c.beginPath(); c.moveTo(-52, -158); c.lineTo(52, -158); c.lineTo(42, -142); c.lineTo(-42, -142); c.closePath(); c.fill(); c.stroke();
  }
  c.restore();
}

function drawFace(c, base) {
  c.save();
  // eyes
  c.fillStyle = '#1a1d28';
  const eyeY = base.shape === 'round' ? -125 : -118;
  c.beginPath(); c.ellipse(-22, eyeY, 8, 9, 0, 0, Math.PI * 2); c.fill();
  c.beginPath(); c.ellipse(22, eyeY, 8, 9, 0, 0, Math.PI * 2); c.fill();

  // brows
  c.strokeStyle = 'rgba(30,20,18,0.55)';
  c.lineWidth = 3;
  c.beginPath(); c.moveTo(-31, eyeY - 17); c.lineTo(-12, eyeY - 20); c.stroke();
  c.beginPath(); c.moveTo(12, eyeY - 20); c.lineTo(31, eyeY - 17); c.stroke();

  // mouth
  c.strokeStyle = 'rgba(77,44,40,0.6)';
  c.lineWidth = 2.5;
  c.beginPath(); c.arc(0, eyeY + 28, 12, 0.1 * Math.PI, 0.9 * Math.PI); c.stroke();
  c.restore();
}

function drawGlasses(c, glasses) {
  if (!glasses || glasses.type === 'none') return;
  c.save();
  c.strokeStyle = glasses.color || '#171c2a';
  c.fillStyle = 'rgba(255,255,255,0.06)';
  c.lineWidth = glasses.type === 'sun' ? 5 : 3;
  const y = -126;

  if (glasses.type === 'round') {
    c.beginPath(); c.arc(-22, y, 16, 0, Math.PI * 2); c.stroke(); c.fill();
    c.beginPath(); c.arc(22, y, 16, 0, Math.PI * 2); c.stroke(); c.fill();
  } else {
    roundRect(c, -40, y - 14, 30, 24, 7, true, true);
    roundRect(c, 10, y - 14, 30, 24, 7, true, true);
    if (glasses.type === 'sun') {
      c.fillStyle = 'rgba(10,10,14,0.35)';
      c.fillRect(-37, y - 11, 24, 18);
      c.fillRect(13, y - 11, 24, 18);
    }
  }
  c.beginPath(); c.moveTo(-6, y - 2); c.lineTo(6, y - 2); c.stroke();
  c.restore();
}

function drawBody(c, base, top, neck) {
  c.save();
  // torso base skin peeks
  c.fillStyle = base.skin;
  roundRect(c, -34, -72, 68, 34, 12, true, false);

  // top clothing
  c.fillStyle = top.color;
  c.strokeStyle = 'rgba(0,0,0,0.18)';
  c.lineWidth = 2;
  if (top.type === 'tee') {
    roundRect(c, -62, -66, 124, 92, 18, true, true);
  } else if (top.type === 'hoodie') {
    roundRect(c, -64, -70, 128, 98, 20, true, true);
    c.strokeStyle = 'rgba(255,255,255,0.18)';
    c.beginPath(); c.arc(0, -48, 20, Math.PI, 0); c.stroke();
    c.beginPath(); c.moveTo(-8, -28); c.lineTo(-10, -4); c.moveTo(8, -28); c.lineTo(10, -4); c.stroke();
  } else if (top.type === 'jacket') {
    roundRect(c, -66, -70, 132, 100, 20, true, true);
    c.fillStyle = 'rgba(255,255,255,0.12)';
    c.fillRect(-4, -66, 8, 92);
  } else if (top.type === 'shirt') {
    roundRect(c, -60, -68, 120, 96, 18, true, true);
    c.fillStyle = 'rgba(0,0,0,0.08)';
    c.fillRect(-2, -64, 4, 88);
    c.beginPath(); c.moveTo(-14, -68); c.lineTo(0, -48); c.lineTo(14, -68); c.closePath(); c.fill();
  } else if (top.type === 'sweater') {
    roundRect(c, -62, -68, 124, 96, 20, true, true);
    c.strokeStyle = 'rgba(255,255,255,0.18)';
    c.beginPath(); c.moveTo(-52, -28); c.lineTo(52, -28); c.stroke();
  } else if (top.type === 'vest') {
    c.fillStyle = '#d8dee9';
    roundRect(c, -56, -66, 112, 92, 16, true, true);
    c.fillStyle = top.color;
    roundRect(c, -60, -68, 44, 96, 18, true, true);
    roundRect(c, 16, -68, 44, 96, 18, true, true);
  }

  // neck accessory overlays
  if (neck && neck.type !== 'none') {
    if (neck.type === 'chain') {
      c.strokeStyle = neck.color;
      c.lineWidth = 4;
      c.beginPath(); c.arc(0, -52, 26, 0.18 * Math.PI, 0.82 * Math.PI); c.stroke();
      c.beginPath(); c.arc(0, -52, 14, 0, Math.PI * 2); c.stroke();
    } else if (neck.type === 'scarf') {
      c.fillStyle = neck.color;
      c.fillRect(-18, -62, 36, 78);
      c.fillRect(-28, -66, 56, 16);
      c.fillRect(10, -6, 14, 34);
    } else if (neck.type === 'tie') {
      c.fillStyle = neck.color;
      c.beginPath(); c.moveTo(0, -64); c.lineTo(14, -42); c.lineTo(0, 28); c.lineTo(-14, -42); c.closePath(); c.fill();
    }
  }
  c.restore();
}

function drawArms(c, base, top) {
  c.save();
  c.strokeStyle = 'rgba(0,0,0,0.16)';
  c.lineWidth = 2;
  // sleeves
  c.fillStyle = top.color;
  roundRect(c, -94, -62, 34, 72, 14, true, true);
  roundRect(c, 60, -62, 34, 72, 14, true, true);
  // hands
  c.fillStyle = base.skin;
  c.beginPath(); c.arc(-77, 20, 13, 0, Math.PI * 2); c.fill(); c.stroke();
  c.beginPath(); c.arc(77, 20, 13, 0, Math.PI * 2); c.fill(); c.stroke();
  c.restore();
}

function drawLegs(c, base, bottom) {
  c.save();
  c.fillStyle = bottom.color;
  c.strokeStyle = 'rgba(0,0,0,0.18)';
  c.lineWidth = 2;

  if (bottom.type === 'skirt') {
    c.beginPath();
    c.moveTo(-52, 18);
    c.lineTo(52, 18);
    c.lineTo(68, 88);
    c.lineTo(-68, 88);
    c.closePath();
    c.fill();
    c.stroke();
    // legs
    c.fillStyle = base.skin;
    roundRect(c, -28, 88, 18, 58, 8, true, true);
    roundRect(c, 10, 88, 18, 58, 8, true, true);
  } else {
    // waist block
    roundRect(c, -60, 16, 120, 34, 10, true, true);
    const legLen = bottom.type === 'shorts' ? 52 : 96;
    const leftY = 50;
    roundRect(c, -48, leftY, 36, legLen, 12, true, true);
    roundRect(c, 12, leftY, 36, legLen, 12, true, true);
    if (bottom.type === 'joggers') {
      c.fillStyle = 'rgba(0,0,0,0.10)';
      c.fillRect(-48, leftY + legLen - 14, 36, 8);
      c.fillRect(12, leftY + legLen - 14, 36, 8);
    }
    // calves/skin if shorts
    if (bottom.type === 'shorts') {
      c.fillStyle = base.skin;
      roundRect(c, -44, leftY + legLen, 28, 42, 10, true, true);
      roundRect(c, 16, leftY + legLen, 28, 42, 10, true, true);
    }
  }

  // shoes
  c.fillStyle = '#202536';
  roundRect(c, -56, 148, 52, 18, 9, true, false);
  roundRect(c, 4, 148, 52, 18, 9, true, false);
  c.restore();
}

function randomizeAll() {
  state.base = randomItem(CATALOG.base).id;
  state.hair = randomItem(CATALOG.hair).id;
  state.top = randomItem(CATALOG.top).id;
  state.bottom = randomItem(CATALOG.bottom).id;
  state.extras.hat = randomItem(CATALOG.extras.hat).id;
  state.extras.glasses = randomItem(CATALOG.extras.glasses).id;
  state.extras.neck = randomItem(CATALOG.extras.neck).id;
}

function downloadPng(transparent) {
  const temp = document.createElement('canvas');
  temp.width = refs.canvas.width;
  temp.height = refs.canvas.height;
  const tctx = temp.getContext('2d');
  renderFigure(transparent, tctx, temp);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
  link.download = `figure-${transparent ? 'transparent' : 'scene'}-${stamp}.png`;
  link.href = temp.toDataURL('image/png');
  link.click();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return mergeState(structuredClone(DEFAULT_STATE), parsed);
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

function mergeState(baseState, incoming) {
  if (!incoming || typeof incoming !== 'object') return baseState;
  const out = baseState;
  ['base', 'hair', 'top', 'bottom'].forEach((k) => {
    if (typeof incoming[k] === 'string') out[k] = incoming[k];
  });
  if (incoming.extras && typeof incoming.extras === 'object') {
    ['hat', 'glasses', 'neck'].forEach((k) => {
      if (typeof incoming.extras[k] === 'string') out.extras[k] = incoming.extras[k];
    });
  }
  return out;
}

function persistSoon() {
  refs.saveStatus.textContent = 'Saving…';
  refs.saveStatus.classList.add('pending');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      refs.saveStatus.textContent = 'Saved';
      refs.saveStatus.classList.remove('pending');
    } catch {
      refs.saveStatus.textContent = 'Save error';
      refs.saveStatus.classList.add('pending');
    }
  }, 180);
}

function findById(arr, id) {
  return arr.find((x) => x.id === id) || arr[0];
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function roundRect(c, x, y, w, h, r, fill = true, stroke = false) {
  const rr = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + rr, y);
  c.arcTo(x + w, y, x + w, y + h, rr);
  c.arcTo(x + w, y + h, x, y + h, rr);
  c.arcTo(x, y + h, x, y, rr);
  c.arcTo(x, y, x + w, y, rr);
  c.closePath();
  if (fill) c.fill();
  if (stroke) c.stroke();
}
