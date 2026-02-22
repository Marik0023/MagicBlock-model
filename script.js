(() => {
  const LS_KEY = 'mb_model_builder_mvp_v1';

  const CATEGORIES = [
    { id: 'base', label: 'Base' },
    { id: 'skin', label: 'Skin' },
    { id: 'hair', label: 'Hair' },
    { id: 'eyes', label: 'Eyes' },
    { id: 'brows', label: 'Brows' },
    { id: 'mouth', label: 'Mouth' },
    { id: 'outfit', label: 'Outfit' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'box', label: 'Box' },
    { id: 'stage', label: 'Stage' },
  ];

  const DATA = {
    base: ['hero', 'slim', 'chunky'],
    skinPalette: ['#f4d1b4', '#dba882', '#b97656', '#8a5037', '#5f3727'],
    hairStyles: ['buzz', 'short', 'wavy', 'long', 'afro', 'capHair'],
    hairColors: ['#1b1b1f', '#5b3a29', '#8a5f3d', '#cab08a', '#7f6bff', '#37d2ff'],
    eyeStyles: ['dot', 'almond', 'anime', 'sleepy'],
    eyeColors: ['#111111', '#2e5cff', '#14a44d', '#7b4cff', '#7c4a21'],
    browStyles: ['soft', 'sharp', 'thick', 'none'],
    mouthStyles: ['smile', 'neutral', 'grin', 'smirk'],
    outfits: [
      { id: 'hoodie', label: 'Hoodie' },
      { id: 'jacket', label: 'Jacket' },
      { id: 'tee', label: 'Tee' },
      { id: 'robe', label: 'Robe' },
      { id: 'armor', label: 'Armor' },
      { id: 'suit', label: 'Suit' },
    ],
    outfitColors: ['#8f7bff', '#45d2ff', '#0ecf9a', '#ff6b91', '#ffb648', '#f5f5f7', '#20232c'],
    accessories: [
      { id: 'glasses', label: 'Glasses' },
      { id: 'cap', label: 'Cap' },
      { id: 'chain', label: 'Chain' },
      { id: 'earring', label: 'Earring' },
    ],
    boxThemes: [
      { id: 'neo', colors: ['#8f7bff', '#45d2ff'] },
      { id: 'sunset', colors: ['#ff7a59', '#ff4d97'] },
      { id: 'mint', colors: ['#08d8a1', '#0aa6ff'] },
      { id: 'mono', colors: ['#4f566b', '#cfd6e8'] },
    ],
    stagePresets: [
      { id: 'dark', bg: '#0d1020', glow: '#8f7bff' },
      { id: 'ocean', bg: '#081523', glow: '#45d2ff' },
      { id: 'violet', bg: '#140f23', glow: '#bf84ff' },
      { id: 'ember', bg: '#201109', glow: '#ff8a5f' },
    ]
  };

  const DEFAULT_STATE = {
    category: 'hair',
    showBox: true,
    yaw: 0,
    bgColor: '#0d1020',
    glowColor: '#8f7bff',

    base: 'hero',
    skinColor: '#dba882',
    hairStyle: 'wavy',
    hairColor: '#1b1b1f',
    eyeStyle: 'almond',
    eyeColor: '#111111',
    browStyle: 'sharp',
    mouthStyle: 'smile',
    outfit: 'hoodie',
    outfitColor: '#8f7bff',
    accessory: {
      glasses: true,
      cap: false,
      chain: false,
      earring: false,
    },

    box: {
      theme: 'neo',
      title: 'MARKO',
      subtitle: 'Custom Figure',
      number: '001',
    },

    proportions: {
      headScale: 1.0,
      bodyScale: 1.0,
      eyeSpacing: 0,
    }
  };

  let state = loadState();

  // DOM
  const el = {
    categoryTabs: document.getElementById('categoryTabs'),
    optionsArea: document.getElementById('optionsArea'),
    optionsTitle: document.getElementById('optionsTitle'),
    figureWrap: document.getElementById('figureWrap'),
    boxWrap: document.getElementById('boxWrap'),
    builderScene: document.getElementById('builderScene'),
    captureArea: document.getElementById('captureArea'),
    stageBgGlow: document.getElementById('stageBgGlow'),
    autosaveStatus: document.getElementById('autosaveStatus'),
    bgColorInput: document.getElementById('bgColorInput'),
    glowColorInput: document.getElementById('glowColorInput'),

    randomizeBtn: document.getElementById('randomizeBtn'),
    resetBtn: document.getElementById('resetBtn'),
    toggleBoxBtn: document.getElementById('toggleBoxBtn'),
    toggleFigureOnlyBtn: document.getElementById('toggleFigureOnlyBtn'),
    rotateLeftBtn: document.getElementById('rotateLeftBtn'),
    rotateRightBtn: document.getElementById('rotateRightBtn'),
    downloadPngBtn: document.getElementById('downloadPngBtn'),
    downloadTransparentBtn: document.getElementById('downloadTransparentBtn'),
    savePresetBtn: document.getElementById('savePresetBtn'),
    loadPresetInput: document.getElementById('loadPresetInput'),
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return deepMerge(structuredClone(DEFAULT_STATE), parsed);
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
      pulseAutosave('Saved');
    } catch {
      pulseAutosave('Save failed');
    }
  }

  let autosaveTimer;
  function pulseAutosave(text) {
    el.autosaveStatus.textContent = text;
    el.autosaveStatus.style.color = text === 'Saved' ? 'var(--good)' : 'tomato';
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      el.autosaveStatus.textContent = 'Saved';
      el.autosaveStatus.style.color = 'var(--muted)';
    }, 900);
  }

  function setState(patch) {
    state = deepMerge(state, patch);
    render();
    saveState();
  }

  function deepMerge(target, source) {
    for (const k in source) {
      if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        if (!target[k] || typeof target[k] !== 'object' || Array.isArray(target[k])) target[k] = {};
        deepMerge(target[k], source[k]);
      } else {
        target[k] = source[k];
      }
    }
    return target;
  }

  function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

  function render() {
    renderTabs();
    renderOptions();
    renderFigure();
    renderBox();
    renderStage();
    syncToolbar();
    el.bgColorInput.value = state.bgColor;
    el.glowColorInput.value = state.glowColor;
  }

  function renderTabs() {
    el.categoryTabs.innerHTML = '';
    CATEGORIES.forEach(cat => {
      const b = document.createElement('button');
      b.className = 'category-tab' + (state.category === cat.id ? ' active' : '');
      b.textContent = cat.label;
      b.addEventListener('click', () => {
        state.category = cat.id;
        render();
        saveState();
      });
      el.categoryTabs.appendChild(b);
    });
  }

  function renderOptions() {
    el.optionsArea.innerHTML = '';
    el.optionsTitle.textContent = `Options · ${CATEGORIES.find(c => c.id === state.category)?.label || ''}`;

    switch (state.category) {
      case 'base':
        sectionBase(); break;
      case 'skin':
        sectionSkin(); break;
      case 'hair':
        sectionHair(); break;
      case 'eyes':
        sectionEyes(); break;
      case 'brows':
        sectionBrows(); break;
      case 'mouth':
        sectionMouth(); break;
      case 'outfit':
        sectionOutfit(); break;
      case 'accessories':
        sectionAccessories(); break;
      case 'box':
        sectionBox(); break;
      case 'stage':
        sectionStage(); break;
    }
  }

  function makeOptionGrid(items, current, onPick, makeLabel = x => x, previewFn) {
    const grid = document.createElement('div');
    grid.className = 'option-grid';
    items.forEach(item => {
      const id = typeof item === 'string' ? item : item.id;
      const label = makeLabel(item);
      const btn = document.createElement('button');
      btn.className = 'option-btn' + (current === id ? ' active' : '');
      btn.type = 'button';
      const preview = document.createElement('div');
      preview.className = 'option-preview';
      if (previewFn) previewFn(preview, item);
      const text = document.createElement('div');
      text.className = 'option-text';
      text.textContent = label;
      btn.append(preview, text);
      btn.addEventListener('click', () => onPick(id));
      grid.appendChild(btn);
    });
    return grid;
  }

  function makeColorSwatches(colors, current, onPick) {
    const wrap = document.createElement('div');
    wrap.className = 'option-grid grid-4';
    colors.forEach(c => {
      const sw = document.createElement('button');
      sw.className = 'swatch' + (current === c ? ' active' : '');
      sw.style.background = c;
      sw.type = 'button';
      sw.addEventListener('click', () => onPick(c));
      wrap.appendChild(sw);
    });
    return wrap;
  }

  function addSection(title, children) {
    const sec = document.createElement('div');
    sec.className = 'option-section';
    if (title) {
      const t = document.createElement('div');
      t.className = 'option-label';
      t.textContent = title;
      sec.appendChild(t);
    }
    children.forEach(ch => sec.appendChild(ch));
    el.optionsArea.appendChild(sec);
    const divider = document.createElement('div');
    divider.className = 'section-divider';
    el.optionsArea.appendChild(divider);
  }

  function sectionBase() {
    addSection('Body shape', [
      makeOptionGrid(DATA.base, state.base, (id)=>setState({ base: id }), x=>x, (el,item)=> {
        el.style.borderRadius = item === 'slim' ? '999px' : item === 'chunky' ? '6px' : '12px';
        el.style.transform = item === 'slim' ? 'scaleX(.7)' : item === 'chunky' ? 'scale(1.08)' : 'none';
      })
    ]);

    addSection('Proportions', [
      rangeControl('Head scale', state.proportions.headScale, 0.8, 1.25, 0.01, v=>setState({ proportions: { headScale: Number(v) } })),
      rangeControl('Body scale', state.proportions.bodyScale, 0.85, 1.2, 0.01, v=>setState({ proportions: { bodyScale: Number(v) } })),
      rangeControl('Eye spacing', state.proportions.eyeSpacing, -8, 8, 1, v=>setState({ proportions: { eyeSpacing: Number(v) } })),
    ]);
  }

  function sectionSkin() {
    addSection('Skin color', [
      makeColorSwatches(DATA.skinPalette, state.skinColor, c => setState({ skinColor: c }))
    ]);
  }

  function sectionHair() {
    addSection('Hair style', [
      makeOptionGrid(DATA.hairStyles, state.hairStyle, id=>setState({ hairStyle: id }), x=>titleCase(x), (p,item)=>{
        p.style.background = 'linear-gradient(180deg,#fff2,transparent), #1a1d2b';
        p.innerHTML = hairIcon(item);
      })
    ]);
    addSection('Hair color', [
      makeColorSwatches(DATA.hairColors, state.hairColor, c=>setState({ hairColor: c }))
    ]);
  }

  function sectionEyes() {
    addSection('Eye style', [
      makeOptionGrid(DATA.eyeStyles, state.eyeStyle, id=>setState({ eyeStyle: id }), x=>titleCase(x), (p,item)=>{
        p.innerHTML = eyeIcon(item);
      })
    ]);
    addSection('Eye color', [
      makeColorSwatches(DATA.eyeColors, state.eyeColor, c=>setState({ eyeColor: c }))
    ]);
  }

  function sectionBrows() {
    addSection('Brows style', [
      makeOptionGrid(DATA.browStyles, state.browStyle, id=>setState({ browStyle: id }), x=>titleCase(x), (p,item)=>{
        p.innerHTML = browIcon(item);
      })
    ]);
  }

  function sectionMouth() {
    addSection('Mouth style', [
      makeOptionGrid(DATA.mouthStyles, state.mouthStyle, id=>setState({ mouthStyle: id }), x=>titleCase(x), (p,item)=>{
        p.innerHTML = mouthIcon(item);
      })
    ]);
  }

  function sectionOutfit() {
    addSection('Outfit style', [
      makeOptionGrid(DATA.outfits, state.outfit, id=>setState({ outfit: id }), it=>it.label, (p,it)=>{
        p.style.background = 'linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02))';
        p.style.borderRadius = '10px';
        p.innerHTML = outfitIcon(it.id);
      })
    ]);
    addSection('Outfit color', [
      makeColorSwatches(DATA.outfitColors, state.outfitColor, c=>setState({ outfitColor: c }))
    ]);
  }

  function sectionAccessories() {
    const grid = document.createElement('div');
    grid.className = 'option-grid';
    DATA.accessories.forEach(item => {
      const active = !!state.accessory[item.id];
      const btn = document.createElement('button');
      btn.className = 'option-btn' + (active ? ' active' : '');
      btn.innerHTML = `<div class="option-preview">${accessoryIcon(item.id)}</div><div class="option-text">${item.label}</div>`;
      btn.addEventListener('click', ()=> setState({ accessory: { [item.id]: !active } }));
      grid.appendChild(btn);
    });
    addSection('Toggle accessories', [grid]);
  }

  function sectionBox() {
    addSection('Box theme', [
      makeOptionGrid(DATA.boxThemes, state.box.theme, id=>setState({ box:{theme:id} }), it=>titleCase(it.id), (p,it)=>{
        p.style.background = `linear-gradient(135deg, ${it.colors[0]}, ${it.colors[1]})`;
      })
    ]);

    const titleRow = textInput('Title', state.box.title, 18, (v)=> setState({ box: { title: v.toUpperCase() } }));
    const subRow = textInput('Subtitle', state.box.subtitle, 26, (v)=> setState({ box: { subtitle: v } }));
    const numRow = textInput('Number', state.box.number, 4, (v)=> setState({ box: { number: v.replace(/[^0-9]/g,'').slice(0,4) } }));
    addSection('Box text', [titleRow, subRow, numRow]);
  }

  function sectionStage() {
    addSection('Stage presets', [
      makeOptionGrid(DATA.stagePresets, null, id=>{
        const p = DATA.stagePresets.find(x=>x.id===id);
        if (p) setState({ bgColor: p.bg, glowColor: p.glow });
      }, it=>titleCase(it.id), (preview, it)=>{
        preview.style.background = `linear-gradient(135deg, ${it.bg}, ${it.glow})`;
      })
    ]);
    addSection('Background color', [makeColorSwatches([...new Set(DATA.stagePresets.map(x=>x.bg))], state.bgColor, c=>setState({ bgColor:c }))]);
    addSection('Glow color', [makeColorSwatches([...new Set(DATA.stagePresets.map(x=>x.glow))], state.glowColor, c=>setState({ glowColor:c }))]);
  }

  function textInput(label, value, maxLen, onInput) {
    const wrap = document.createElement('label');
    wrap.className = 'input-row';
    const span = document.createElement('span');
    span.className = 'option-label';
    span.textContent = label;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.maxLength = maxLen;
    input.addEventListener('input', e => onInput(e.target.value));
    const small = document.createElement('small');
    small.textContent = `${value.length}/${maxLen}`;
    input.addEventListener('input', e => small.textContent = `${e.target.value.length}/${maxLen}`);
    wrap.append(span, input, small);
    return wrap;
  }

  function rangeControl(label, value, min, max, step, onChange) {
    const wrap = document.createElement('div');
    wrap.className = 'option-section';
    const row = document.createElement('div');
    row.className = 'range-row';
    const l = document.createElement('div');
    l.className = 'option-label';
    l.textContent = label;
    const rv = document.createElement('div');
    rv.className = 'range-val';
    rv.textContent = String(value);
    const input = document.createElement('input');
    input.type = 'range';
    input.min = min; input.max = max; input.step = step; input.value = value;
    input.addEventListener('input', e => {
      rv.textContent = e.target.value;
      onChange(e.target.value);
    });
    row.append(l, rv);
    wrap.append(row, input);
    return wrap;
  }

  function renderFigure() {
    const yaw = state.yaw;
    const scaleX = Math.cos((yaw * Math.PI) / 180) * 0.14 + 0.86; // fake rotation squash
    const headScale = state.proportions.headScale;
    const bodyScale = state.proportions.bodyScale;
    const eyeSpacing = state.proportions.eyeSpacing;

    el.figureWrap.style.transform = `translateY(0) scaleX(${scaleX.toFixed(3)})`;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" width="100%" height="100%" aria-label="custom figure preview">
      <defs>
        <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,.12)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="rgba(0,0,0,.3)"/>
        </filter>
      </defs>

      <ellipse cx="160" cy="352" rx="84" ry="16" fill="rgba(0,0,0,.22)"/>

      ${renderBodyShape(state.base, state.skinColor, bodyScale)}
      ${renderOutfit(state.outfit, state.outfitColor)}
      ${renderHead(state.skinColor, headScale)}
      ${renderHair(state.hairStyle, state.hairColor)}
      ${renderEyes(state.eyeStyle, state.eyeColor, eyeSpacing)}
      ${renderBrows(state.browStyle)}
      ${renderMouth(state.mouthStyle)}
      ${renderAccessories(state.accessory)}

      <path d="M94 155 Q160 120 226 155" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="8" stroke-linecap="round"/>
      <path d="M96 156 Q160 126 224 156" fill="none" stroke="url(#gBody)" stroke-width="4" stroke-linecap="round"/>
    </svg>`;

    el.figureWrap.innerHTML = svg;
  }

  function renderBox() {
    const show = state.showBox;
    el.boxWrap.style.display = show ? 'block' : 'none';
    const theme = DATA.boxThemes.find(t => t.id === state.box.theme) || DATA.boxThemes[0];
    const [c1, c2] = theme.colors;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 420" width="100%" height="100%" aria-label="custom box preview">
        <defs>
          <linearGradient id="bx" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </linearGradient>
          <filter id="shadowb" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="rgba(0,0,0,.28)"/>
          </filter>
        </defs>
        <g filter="url(#shadowb)">
          <rect x="56" y="44" width="448" height="332" rx="26" fill="rgba(10,12,20,.82)" stroke="rgba(255,255,255,.12)"/>
          <rect x="70" y="58" width="420" height="304" rx="22" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.08)"/>
          <rect x="70" y="58" width="420" height="80" rx="22" fill="url(#bx)" opacity=".95"/>
          <rect x="96" y="152" width="180" height="178" rx="16" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)"/>
          <rect x="286" y="152" width="178" height="178" rx="16" fill="rgba(255,255,255,.02)" stroke="rgba(255,255,255,.08)"/>
          <text x="94" y="106" fill="white" font-family="Inter, Arial" font-weight="800" font-size="36">${escapeXml(state.box.title || 'CUSTOM')}</text>
          <text x="438" y="106" fill="rgba(255,255,255,.9)" font-family="Inter, Arial" text-anchor="end" font-weight="700" font-size="28">#${escapeXml(state.box.number || '001')}</text>
          <text x="94" y="134" fill="rgba(255,255,255,.82)" font-family="Inter, Arial" font-weight="500" font-size="16">${escapeXml(state.box.subtitle || 'Custom Figure')}</text>

          <text x="303" y="190" fill="white" font-family="Inter, Arial" font-weight="700" font-size="15">FEATURES</text>
          <text x="303" y="220" fill="rgba(255,255,255,.84)" font-family="Inter, Arial" font-size="13">• Original stylized figure</text>
          <text x="303" y="244" fill="rgba(255,255,255,.84)" font-family="Inter, Arial" font-size="13">• Editable colors & accessories</text>
          <text x="303" y="268" fill="rgba(255,255,255,.84)" font-family="Inter, Arial" font-size="13">• PNG export & JSON preset</text>
          <text x="303" y="292" fill="rgba(255,255,255,.84)" font-family="Inter, Arial" font-size="13">• Frontend-only MVP</text>

          <text x="92" y="351" fill="rgba(255,255,255,.55)" font-family="Inter, Arial" font-size="12">MAGICBLOCK MODEL • PREVIEW PACKAGING</text>
        </g>
      </svg>
    `;

    el.boxWrap.innerHTML = svg;
  }

  function renderStage() {
    el.captureArea.style.background = `radial-gradient(700px 340px at 50% 12%, rgba(255,255,255,.04), transparent 70%), linear-gradient(180deg, ${state.bgColor} 0%, ${shadeHex(state.bgColor, -12)} 100%)`;
    el.stageBgGlow.style.background = `radial-gradient(300px 180px at 50% 40%, ${hexToRgba(state.glowColor, .28)}, transparent 70%)`;
    el.builderScene.style.setProperty('--glow', state.glowColor);
  }

  function syncToolbar() {
    el.toggleBoxBtn.classList.toggle('active', state.showBox);
    el.toggleFigureOnlyBtn.classList.toggle('active', !state.showBox);
  }

  // SVG fragments
  function renderBodyShape(base, skin, bodyScale) {
    const transform = `translate(0 ${Math.round((1-bodyScale)*40)}) scale(1 ${bodyScale})`;

    if (base === 'slim') {
      return `
      <g transform="${transform}">
        <rect x="132" y="176" width="56" height="86" rx="20" fill="${skin}" filter="url(#shadow)"/>
        <rect x="118" y="184" width="20" height="86" rx="10" fill="${skin}"/>
        <rect x="182" y="184" width="20" height="86" rx="10" fill="${skin}"/>
        <rect x="136" y="258" width="18" height="74" rx="9" fill="${skin}"/>
        <rect x="166" y="258" width="18" height="74" rx="9" fill="${skin}"/>
      </g>`;
    }
    if (base === 'chunky') {
      return `
      <g transform="${transform}">
        <rect x="118" y="172" width="84" height="96" rx="26" fill="${skin}" filter="url(#shadow)"/>
        <rect x="102" y="186" width="22" height="86" rx="11" fill="${skin}"/>
        <rect x="196" y="186" width="22" height="86" rx="11" fill="${skin}"/>
        <rect x="126" y="262" width="24" height="72" rx="11" fill="${skin}"/>
        <rect x="170" y="262" width="24" height="72" rx="11" fill="${skin}"/>
      </g>`;
    }
    return `
      <g transform="${transform}">
        <rect x="124" y="174" width="72" height="92" rx="22" fill="${skin}" filter="url(#shadow)"/>
        <rect x="108" y="184" width="20" height="86" rx="10" fill="${skin}"/>
        <rect x="192" y="184" width="20" height="86" rx="10" fill="${skin}"/>
        <rect x="132" y="260" width="22" height="74" rx="10" fill="${skin}"/>
        <rect x="166" y="260" width="22" height="74" rx="10" fill="${skin}"/>
      </g>`;
  }

  function renderHead(skin, headScale) {
    const s = clamp(headScale, .8, 1.25);
    const tx = 160 - 160*s;
    const ty = 148 - 148*s + (1-s)*18;
    return `
    <g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(3)})">
      <circle cx="160" cy="126" r="74" fill="${skin}" filter="url(#shadow)"/>
      <ellipse cx="136" cy="118" rx="18" ry="10" fill="rgba(255,255,255,.12)"/>
      <ellipse cx="183" cy="112" rx="12" ry="7" fill="rgba(255,255,255,.08)"/>
      <rect x="148" y="186" width="24" height="12" rx="6" fill="${skin}"/>
    </g>`;
  }

  function renderHair(style, color) {
    const c = color;
    switch(style) {
      case 'buzz':
        return `<path d="M103 112q16-46 57-57 46-12 87 13 22 13 33 42-9-12-29-19-39-14-64-10-24 3-46 14-18 10-38 17z" fill="${c}"/>`;
      case 'short':
        return `<path d="M94 136q4-43 35-63 28-18 67-18 53 0 83 39 17 23 17 52-12-17-31-24-17-6-39-6-31 0-57 9-29 10-53 11-12 1-22 0z" fill="${c}"/>`;
      case 'wavy':
        return `<path d="M90 145q-1-38 24-62 26-25 69-30 41-5 73 17 36 24 39 68-15-20-36-24-10-2-22-1-4-22-24-25-22-3-32 16-13-15-36-10-18 5-24 23-16 4-31 15z" fill="${c}"/>`;
      case 'long':
        return `<path d="M88 140q2-42 30-66 30-26 76-26 45 0 74 25 30 26 30 72 0 31-12 56-14-20-17-44-3-22-6-36-9-35-43-35-18 0-30 11-11-12-31-12-23 0-36 17-11 15-13 38-2 22-10 40-16-31-12-40z" fill="${c}"/>`;
      case 'afro':
        return `<g fill="${c}"><circle cx="118" cy="101" r="30"/><circle cx="146" cy="84" r="33"/><circle cx="179" cy="83" r="34"/><circle cx="206" cy="100" r="29"/><circle cx="96" cy="126" r="23"/><circle cx="224" cy="128" r="24"/><circle cx="160" cy="111" r="44"/></g>`;
      case 'capHair':
        return `<g><path d="M90 126q13-34 44-49 38-19 79-8 42 11 62 43 8 13 12 27-30 2-46 8-25 8-78 8-45 0-73-6z" fill="#15171e"/><path d="M89 125q20-15 64-19 75-8 124 20-4 25-33 25H118q-26 0-29-26z" fill="${c}"/></g>`;
      default:
        return '';
    }
  }

  function renderEyes(style, color, spacing) {
    const dx = Number(spacing) || 0;
    switch(style) {
      case 'dot':
        return `<g fill="${color}"><circle cx="${140-dx}" cy="128" r="5"/><circle cx="${180+dx}" cy="128" r="5"/></g>`;
      case 'anime':
        return `<g><ellipse cx="${140-dx}" cy="128" rx="10" ry="14" fill="#fff"/><ellipse cx="${180+dx}" cy="128" rx="10" ry="14" fill="#fff"/><circle cx="${140-dx}" cy="130" r="5" fill="${color}"/><circle cx="${180+dx}" cy="130" r="5" fill="${color}"/><circle cx="${137-dx}" cy="126" r="1.8" fill="#fff"/><circle cx="${177+dx}" cy="126" r="1.8" fill="#fff"/></g>`;
      case 'sleepy':
        return `<g stroke="${color}" stroke-linecap="round" stroke-width="3" fill="none"><path d="M${130-dx} 130q10-7 20 0"/><path d="M${170+dx} 130q10-7 20 0"/></g>`;
      case 'almond':
      default:
        return `<g><path d="M${128-dx} 128q12-10 24 0-12 10-24 0z" fill="#fff"/><path d="M${168+dx} 128q12-10 24 0-12 10-24 0z" fill="#fff"/><circle cx="${140-dx}" cy="128" r="4.3" fill="${color}"/><circle cx="${180+dx}" cy="128" r="4.3" fill="${color}"/></g>`;
    }
  }

  function renderBrows(style) {
    const c = '#231f20';
    switch(style) {
      case 'none': return '';
      case 'soft':
        return `<g stroke="${c}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".75"><path d="M129 111q11-7 23-2"/><path d="M168 109q13-6 24 2"/></g>`;
      case 'thick':
        return `<g stroke="${c}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M127 111q13-9 27-3"/><path d="M166 108q15-7 27 3"/></g>`;
      case 'sharp':
      default:
        return `<g stroke="${c}" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M127 114l24-7"/><path d="M169 107l24 8"/></g>`;
    }
  }

  function renderMouth(style) {
    const c = '#6a2d24';
    switch(style) {
      case 'neutral': return `<path d="M147 156h26" stroke="${c}" stroke-linecap="round" stroke-width="3"/>`;
      case 'grin': return `<path d="M145 152q15 15 30 0" fill="#fff" stroke="${c}" stroke-width="2"/>`;
      case 'smirk': return `<path d="M147 156q12 7 26 -2" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
      case 'smile':
      default:
        return `<path d="M145 154q15 12 30 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    }
  }

  function renderOutfit(outfit, color) {
    const shade = shadeHex(color, -18);
    const light = shadeHex(color, 18);
    switch(outfit) {
      case 'jacket':
        return `<g><path d="M116 178q44-17 88 0v72q-1 24-20 24h-48q-20 0-20-24z" fill="${shade}"/><path d="M126 184q34-10 68 0v79h-68z" fill="${color}"/><path d="M159 184v90" stroke="${light}" stroke-opacity=".55"/><path d="M123 194q36 22 74 0" stroke="rgba(255,255,255,.1)"/></g>`;
      case 'tee':
        return `<g><path d="M117 178q43-14 86 0v70q0 25-22 25h-42q-22 0-22-25z" fill="${color}"/><path d="M135 183q10 14 25 14t25-14" stroke="rgba(255,255,255,.16)" stroke-width="4" fill="none"/></g>`;
      case 'robe':
        return `<g><path d="M112 176q48-18 96 0l-8 95q-2 20-22 20h-36q-20 0-22-20z" fill="${color}"/><path d="M160 176l-18 114" stroke="${shade}" stroke-width="5"/><path d="M160 176l18 114" stroke="${shade}" stroke-width="5"/><rect x="147" y="226" width="26" height="6" rx="3" fill="${shade}"/></g>`;
      case 'armor':
        return `<g><path d="M116 178q44-17 88 0l-4 76q0 22-20 22h-40q-20 0-20-22z" fill="${shade}"/><path d="M124 184h72v32h-72z" fill="${light}" opacity=".45"/><path d="M124 220h72v22h-72z" fill="${color}"/><path d="M160 184v88" stroke="rgba(255,255,255,.2)"/></g>`;
      case 'suit':
        return `<g><path d="M116 178q44-18 88 0v74q0 23-19 23h-50q-19 0-19-23z" fill="#1a1c23"/><path d="M132 184q10 12 28 12t28-12v86h-56z" fill="${color}" opacity=".92"/><path d="M160 184l-10 20 10 14 10-14z" fill="#fff"/></g>`;
      case 'hoodie':
      default:
        return `<g><path d="M114 180q46-21 92 0v66q0 29-24 29h-44q-24 0-24-29z" fill="${color}"/><path d="M132 186q8 14 28 14t28-14" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="4"/><rect x="145" y="235" width="30" height="18" rx="9" fill="${shade}" opacity=".65"/></g>`;
    }
  }

  function renderAccessories(acc) {
    let s = '';
    if (acc.glasses) {
      s += `<g stroke="#101317" stroke-width="3" fill="none"><rect x="126" y="119" width="26" height="18" rx="7"/><rect x="168" y="119" width="26" height="18" rx="7"/><path d="M152 127h16"/></g>`;
    }
    if (acc.cap) {
      s += `<g><path d="M96 126q34-28 80-28 48 0 82 27-6 18-28 18H121q-21 0-25-17z" fill="#181b23"/><path d="M124 126q18 6 42 6 28 0 52-8 7 17-11 24-10 4-38 4-27 0-38-4-18-7-7-22z" fill="${state.outfitColor}"/></g>`;
    }
    if (acc.chain) {
      s += `<path d="M132 188q28 24 56 0" fill="none" stroke="#d7c16a" stroke-width="4" stroke-linecap="round"/>`;
    }
    if (acc.earring) {
      s += `<circle cx="216" cy="145" r="4" fill="#d7c16a"/><circle cx="216" cy="145" r="7" fill="none" stroke="#d7c16a" stroke-width="2"/>`;
    }
    return s;
  }

  // Tiny icon helpers for options panel
  function hairIcon(id){
    return `<svg viewBox="0 0 28 28" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="11" fill="rgba(255,255,255,.08)"/>${
      id==='buzz' ? '<path d="M5 14c2-6 8-9 14-7 3 1 5 4 6 7-2-1-4-2-7-2-5 0-8 2-13 2Z" fill="#fff" opacity=".85"/>' :
      id==='short' ? '<path d="M4 16c1-7 6-11 13-11 5 0 9 3 11 8-2-1-5-2-9-2-5 0-8 3-15 5Z" fill="#fff" opacity=".85"/>' :
      id==='wavy' ? '<path d="M4 17c0-7 5-12 12-12 6 0 10 4 12 10-3-1-3-3-6-3-2 0-2 2-4 2s-2-2-4-2c-3 0-4 3-10 5Z" fill="#fff" opacity=".85"/>' :
      id==='long' ? '<path d="M4 17c0-8 5-12 12-12s12 5 12 12c0 2-1 4-2 6-1-2-1-4-2-6-1-3-3-4-5-4-2 0-4 1-5 3-1 2-1 4-2 7-5-4-8-4-8-6Z" fill="#fff" opacity=".85"/>' :
      id==='afro' ? '<g fill="#fff" opacity=".85"><circle cx="9" cy="11" r="4"/><circle cx="14" cy="9" r="5"/><circle cx="19" cy="11" r="4"/><circle cx="14" cy="14" r="6"/></g>' :
      '<path d="M4 14c2-6 8-9 14-7 4 1 7 5 8 9-3 0-6 1-10 1-4 0-8 0-12-1Z" fill="#fff" opacity=".85"/>'
    }</svg>`;
  }
  function eyeIcon(id){
    return `<svg viewBox="0 0 28 28" width="24" height="24" xmlns="http://www.w3.org/2000/svg">${
      id==='dot' ? '<circle cx="10" cy="14" r="2" fill="#fff"/><circle cx="18" cy="14" r="2" fill="#fff"/>' :
      id==='anime' ? '<ellipse cx="10" cy="14" rx="4" ry="5" fill="#fff"/><ellipse cx="18" cy="14" rx="4" ry="5" fill="#fff"/><circle cx="10" cy="15" r="2" fill="#111"/><circle cx="18" cy="15" r="2" fill="#111"/>' :
      id==='sleepy' ? '<path d="M6 15c2-2 4-2 6 0M16 15c2-2 4-2 6 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' :
      '<path d="M6 14c2-3 6-3 8 0-2 3-6 3-8 0Z" fill="#fff"/><path d="M14 14c2-3 6-3 8 0-2 3-6 3-8 0Z" fill="#fff"/><circle cx="10" cy="14" r="1.5" fill="#111"/><circle cx="18" cy="14" r="1.5" fill="#111"/>'
    }</svg>`;
  }
  function browIcon(id){
    return `<svg viewBox="0 0 28 28" width="24" height="24" xmlns="http://www.w3.org/2000/svg">${
      id==='none' ? '<circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,.2)" stroke-dasharray="3 3"/>' :
      id==='soft' ? '<path d="M6 11c4-3 7-2 10-1M12 10c4-1 7 0 10 3" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' :
      id==='thick' ? '<path d="M5 12c4-3 7-3 10-2M13 10c4-1 7 0 10 3" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>' :
      '<path d="M5 13l10-4M13 9l10 4" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    }</svg>`;
  }
  function mouthIcon(id){
    return `<svg viewBox="0 0 28 28" width="24" height="24" xmlns="http://www.w3.org/2000/svg">${
      id==='neutral' ? '<path d="M9 16h10" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' :
      id==='grin' ? '<path d="M8 14c3 4 9 4 12 0v3c-3 3-9 3-12 0z" fill="#fff"/>' :
      id==='smirk' ? '<path d="M9 16c3 2 6 2 10-1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' :
      '<path d="M8 14c3 4 9 4 12 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>'
    }</svg>`;
  }
  function outfitIcon(id){
    return `<svg viewBox="0 0 28 28" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="14" height="14" rx="4" fill="rgba(255,255,255,.22)"/>${
      id==='hoodie' ? '<path d="M9 10c2-2 8-2 10 0v9H9z" fill="#fff" opacity=".9"/><path d="M11 10c1 2 4 2 6 0" stroke="#222" opacity=".2"/>' :
      id==='jacket' ? '<path d="M9 9h10v11H9z" fill="#fff" opacity=".9"/><path d="M14 9v11" stroke="#222" opacity=".25"/>' :
      id==='tee' ? '<path d="M9 10c2-1 8-1 10 0v10H9z" fill="#fff" opacity=".9"/>' :
      id==='robe' ? '<path d="M10 8h8l2 13H8z" fill="#fff" opacity=".9"/><path d="M14 8l-3 13M14 8l3 13" stroke="#222" opacity=".25"/>' :
      id==='armor' ? '<path d="M9 9h10v5H9zM9 15h10v6H9z" fill="#fff" opacity=".9"/>' :
      '<path d="M9 9h10v12H9z" fill="#111" opacity=".8"/><path d="M10 9c2 2 6 2 8 0v12h-8z" fill="#fff" opacity=".9"/>'
    }</svg>`;
  }
  function accessoryIcon(id){
    return id==='glasses' ? '👓' : id==='cap' ? '🧢' : id==='chain' ? '⛓️' : '💍';
  }

  // Controls
  el.randomizeBtn.addEventListener('click', () => {
    const pick = arr => arr[Math.floor(Math.random()*arr.length)];
    const randomAccessory = {};
    DATA.accessories.forEach(a => randomAccessory[a.id] = Math.random() > 0.55);
    setState({
      base: pick(DATA.base),
      skinColor: pick(DATA.skinPalette),
      hairStyle: pick(DATA.hairStyles),
      hairColor: pick(DATA.hairColors),
      eyeStyle: pick(DATA.eyeStyles),
      eyeColor: pick(DATA.eyeColors),
      browStyle: pick(DATA.browStyles),
      mouthStyle: pick(DATA.mouthStyles),
      outfit: pick(DATA.outfits).id,
      outfitColor: pick(DATA.outfitColors),
      accessory: randomAccessory,
      box: {
        theme: pick(DATA.boxThemes).id,
        number: String(Math.floor(Math.random()*900)+100),
      }
    });
  });

  el.resetBtn.addEventListener('click', () => {
    state = structuredClone(DEFAULT_STATE);
    render();
    saveState();
  });

  el.toggleBoxBtn.addEventListener('click', () => setState({ showBox: true }));
  el.toggleFigureOnlyBtn.addEventListener('click', () => setState({ showBox: false }));
  el.rotateLeftBtn.addEventListener('click', () => setState({ yaw: (state.yaw - 20) % 360 }));
  el.rotateRightBtn.addEventListener('click', () => setState({ yaw: (state.yaw + 20) % 360 }));

  el.bgColorInput.addEventListener('input', e => setState({ bgColor: e.target.value }));
  el.glowColorInput.addEventListener('input', e => setState({ glowColor: e.target.value }));

  el.savePresetBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `mb-model-preset-${Date.now()}.json`);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  el.loadPresetInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      state = deepMerge(structuredClone(DEFAULT_STATE), parsed);
      render();
      saveState();
      pulseAutosave('Preset loaded');
    } catch {
      pulseAutosave('Invalid preset');
    } finally {
      e.target.value = '';
    }
  });

  el.downloadPngBtn.addEventListener('click', () => exportScene({ transparent:false }));
  el.downloadTransparentBtn.addEventListener('click', () => exportScene({ transparent:true }));

  async function exportScene({ transparent }) {
    try {
      pulseAutosave('Exporting...');
      const sceneW = transparent ? 320 : 900;
      const sceneH = transparent ? 380 : 700;
      const canvas = document.createElement('canvas');
      canvas.width = sceneW;
      canvas.height = sceneH;
      const ctx = canvas.getContext('2d');

      if (!transparent) {
        // stage bg
        const grad = ctx.createLinearGradient(0, 0, 0, sceneH);
        grad.addColorStop(0, state.bgColor);
        grad.addColorStop(1, shadeHex(state.bgColor, -12));
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,sceneW,sceneH);

        // glow
        const rg = ctx.createRadialGradient(sceneW/2, sceneH*0.38, 20, sceneW/2, sceneH*0.38, 220);
        rg.addColorStop(0, hexToRgba(state.glowColor, .34));
        rg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rg;
        ctx.fillRect(0,0,sceneW,sceneH);
      }

      // draw box first (if visible)
      if (!transparent && state.showBox) {
        const boxSvg = el.boxWrap.querySelector('svg');
        if (boxSvg) {
          const boxImg = await svgElementToImage(boxSvg);
          ctx.drawImage(boxImg, sceneW*0.17, sceneH*0.48, sceneW*0.66, sceneH*0.42);
        }
      }

      // draw figure
      const figSvg = el.figureWrap.querySelector('svg');
      if (figSvg) {
        const figImg = await svgElementToImage(figSvg);
        if (transparent) {
          ctx.drawImage(figImg, 0, 0, sceneW, sceneH);
        } else {
          ctx.drawImage(figImg, sceneW*0.32, sceneH*0.19, sceneW*0.36, sceneH*0.43);
        }
      }

      const dataUrl = canvas.toDataURL('image/png');
      triggerDownload(dataUrl, transparent ? `mb-figure-transparent-${Date.now()}.png` : `mb-figure-scene-${Date.now()}.png`);
      pulseAutosave('Export ready');
    } catch (e) {
      console.error(e);
      pulseAutosave('Export failed');
    }
  }

  function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function svgElementToImage(svgEl) {
    return new Promise((resolve, reject) => {
      const svgString = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  // utility
  function titleCase(s){ return String(s).replace(/([A-Z])/g, ' $1').replace(/[_-]/g,' ').replace(/^./,m=>m.toUpperCase()); }
  function escapeXml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function hexToRgba(hex, alpha=1) {
    const h = hex.replace('#','');
    const bigint = parseInt(h.length === 3 ? h.split('').map(x=>x+x).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function shadeHex(hex, percent) {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map(x=>x+x).join('') : h;
    let r = parseInt(full.slice(0,2),16);
    let g = parseInt(full.slice(2,4),16);
    let b = parseInt(full.slice(4,6),16);
    r = clamp(Math.round(r * (100 + percent) / 100), 0, 255);
    g = clamp(Math.round(g * (100 + percent) / 100), 0, 255);
    b = clamp(Math.round(b * (100 + percent) / 100), 0, 255);
    return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  }

  // init
  render();
})();
