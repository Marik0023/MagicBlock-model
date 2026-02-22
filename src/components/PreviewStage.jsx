import { CATALOG } from "../data/catalog";
import { useBuilderStore } from "../store/builderStore";

function byId(items, id, fallbackIndex = 0) {
  return items.find((x) => x.id === id) ?? items[fallbackIndex];
}

function hairColorFor(preset) {
  return byId(CATALOG.hairs, preset.hair)?.color ?? "#2f2f35";
}
function skinColorFor(preset) {
  return byId(CATALOG.skinTones, preset.skinTone)?.color ?? "#efc1a0";
}
function outfitFor(preset) {
  return byId(CATALOG.outfits, preset.outfit);
}
function bgFor(preset) {
  return byId(CATALOG.backgrounds, preset.bg);
}
function boxThemeFor(preset) {
  return byId(CATALOG.boxThemes, preset.box.theme);
}

function HairShape({ type, color }) {
  switch (type) {
    case "buzz":
      return <ellipse cx="250" cy="226" rx="78" ry="52" fill={color} opacity="0.95" />;
    case "wave_short":
      return (
        <path
          d="M176 243c0-42 38-75 84-75s84 33 84 75v10c-13-18-26-23-40-16-14 6-21 7-29 0-10-9-22-9-37 2-12 8-26 10-62 12v-8Z"
          fill={color}
        />
      );
    case "long_curve":
      return (
        <>
          <path d="M170 237c0-41 37-74 83-74s83 33 83 74v26c-10-8-19-16-29-23-22-15-41-11-56 3-14-17-32-22-57-17-9 2-16 5-24 10v-25Z" fill={color} />
          <path d="M173 255c-10 18-9 46-4 67 24-9 34-32 32-60l-28-7Z" fill={color} opacity="0.95" />
          <path d="M329 250c12 17 12 46 6 67-23-8-36-31-35-59l29-8Z" fill={color} opacity="0.95" />
        </>
      );
    case "afro_round":
      return (
        <>
          {[200, 230, 260, 290, 320].map((x, i) => (
            <circle key={x} cx={x} cy={220 + (i % 2) * 4} r="30" fill={color} />
          ))}
          {[216, 248, 280, 312].map((x) => (
            <circle key={`${x}-2`} cx={x} cy={194} r="28" fill={color} />
          ))}
        </>
      );
    case "pony":
      return (
        <>
          <path d="M174 242c0-40 37-72 82-72s82 32 82 72v13c-14-14-29-20-45-20-20 0-33 11-48 16-17 5-41 4-71 3v-12Z" fill={color} />
          <path d="M336 250c29 8 40 35 35 60-23 1-36-10-44-29 2-12 4-22 9-31Z" fill={color} />
        </>
      );
    case "side_part":
      return (
        <>
          <path d="M171 244c0-43 38-77 85-77 31 0 58 14 73 36-20-5-37-2-50 8-16 12-33 16-51 14-18-2-33 6-57 25v-6Z" fill={color} />
          <path d="M326 205c8 12 13 25 13 39v17c-14-15-30-22-49-22 20-11 29-22 36-34Z" fill={color} opacity="0.95" />
        </>
      );
    default:
      return null;
  }
}

function EyeShapes({ type }) {
  switch (type) {
    case "spark":
      return (
        <>
          <polygon points="223,276 230,282 237,276 231,286 241,291 229,291 223,302 220,291 208,291 218,286 212,276" fill="#111827" />
          <polygon points="275,276 282,282 289,276 283,286 293,291 281,291 275,302 272,291 260,291 270,286 264,276" fill="#111827" />
        </>
      );
    case "sleepy":
      return (
        <>
          <path d="M212 287c8-6 22-6 30 0" stroke="#111827" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M264 287c8-6 22-6 30 0" stroke="#111827" strokeWidth="6" strokeLinecap="round" fill="none" />
        </>
      );
    case "wide":
      return (
        <>
          <ellipse cx="226" cy="287" rx="12" ry="10" fill="#111827" />
          <ellipse cx="278" cy="287" rx="12" ry="10" fill="#111827" />
          <circle cx="230" cy="284" r="3" fill="#fff" />
          <circle cx="282" cy="284" r="3" fill="#fff" />
        </>
      );
    case "oval_smile":
    default:
      return (
        <>
          <ellipse cx="226" cy="287" rx="10" ry="8" fill="#111827" />
          <ellipse cx="278" cy="287" rx="10" ry="8" fill="#111827" />
        </>
      );
  }
}

function BrowShapes({ type }) {
  switch (type) {
    case "angled":
      return (
        <>
          <path d="M210 266l28-8" stroke="#221b1b" strokeWidth="5" strokeLinecap="round" />
          <path d="M266 258l28 8" stroke="#221b1b" strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "flat":
      return (
        <>
          <path d="M210 262h28" stroke="#221b1b" strokeWidth="5" strokeLinecap="round" />
          <path d="M266 262h28" stroke="#221b1b" strokeWidth="5" strokeLinecap="round" />
        </>
      );
    case "none":
      return null;
    case "soft":
    default:
      return (
        <>
          <path d="M210 265c8-4 18-6 28-4" stroke="#221b1b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M266 261c10-2 20 0 28 4" stroke="#221b1b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </>
      );
  }
}

function MouthShape({ type }) {
  switch (type) {
    case "grin":
      return (
        <>
          <path d="M225 330c16 16 36 16 52 0" stroke="#8b1d2c" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M231 330h40" stroke="#fff" strokeWidth="3" opacity="0.9" />
        </>
      );
    case "ooh":
      return <ellipse cx="252" cy="333" rx="9" ry="12" fill="#8b1d2c" />;
    case "line":
      return <path d="M235 333c11 4 23 4 34 0" stroke="#7b1c26" strokeWidth="4.5" strokeLinecap="round" fill="none" />;
    case "smile":
    default:
      return <path d="M232 330c12 10 28 10 40 0" stroke="#8b1d2c" strokeWidth="5" strokeLinecap="round" fill="none" />;
  }
}

function Outfit({ outfit }) {
  const colors = outfit?.colors ?? { top: "#4338ca", accent: "#a5b4fc", bottom: "#1f2937" };
  return (
    <>
      {/* torso */}
      <path d="M201 382c12-22 35-35 51-35s39 13 51 35l14 48c6 20-7 42-28 45H215c-21-3-34-25-28-45l14-48Z" fill={colors.top} />
      <path d="M233 356c12 9 24 9 36 0l8 20c-15 8-37 8-52 0l8-20Z" fill={colors.accent} opacity="0.95" />
      {/* sleeves / arms */}
      <rect x="180" y="388" width="28" height="88" rx="14" fill={colors.top} transform="rotate(8 194 432)" />
      <rect x="296" y="388" width="28" height="88" rx="14" fill={colors.top} transform="rotate(-8 310 432)" />
      {/* pants */}
      <rect x="219" y="470" width="30" height="95" rx="14" fill={colors.bottom} />
      <rect x="255" y="470" width="30" height="95" rx="14" fill={colors.bottom} />
      {/* shoes */}
      <ellipse cx="234" cy="573" rx="23" ry="10" fill="#e5e7eb" />
      <ellipse cx="270" cy="573" rx="23" ry="10" fill="#e5e7eb" />
    </>
  );
}

function Accessories({ preset }) {
  const glasses = preset.accessories.glasses;
  const hat = preset.accessories.hat;
  const neck = preset.accessories.neck;
  const hand = preset.accessories.hand;

  return (
    <>
      {/* hat/headwear */}
      {hat === "beanie" && (
        <>
          <path d="M186 232c8-30 39-51 72-51 37 0 67 22 74 55-49-14-100-14-146-4Z" fill="#be123c" />
          <rect x="184" y="227" width="148" height="20" rx="10" fill="#fb7185" />
        </>
      )}
      {hat === "cap" && (
        <>
          <path d="M194 228c11-23 35-37 60-37 29 0 53 15 65 40H194Z" fill="#2563eb" />
          <path d="M234 230c31-4 62 2 90 18-36 8-73 4-100-8 2-3 5-6 10-10Z" fill="#1d4ed8" />
        </>
      )}
      {hat === "halo_band" && (
        <>
          <path d="M182 224c42-21 108-21 150 0" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" fill="none" />
          <circle cx="332" cy="231" r="8" fill="#fde68a" />
        </>
      )}

      {/* glasses */}
      {glasses === "round_clear" && (
        <g stroke="#111827" strokeWidth="4" fill="none">
          <circle cx="226" cy="288" r="18" />
          <circle cx="278" cy="288" r="18" />
          <path d="M244 288h16" />
        </g>
      )}
      {glasses === "retro_square" && (
        <g stroke="#111827" strokeWidth="4" fill="rgba(255,255,255,0.08)">
          <rect x="206" y="271" width="40" height="30" rx="8" />
          <rect x="258" y="271" width="40" height="30" rx="8" />
          <path d="M246 286h12" />
        </g>
      )}
      {glasses === "visor" && (
        <path d="M201 271c28-10 76-10 102 0v26c-26 8-78 8-102 0v-26Z" fill="rgba(56,189,248,0.35)" stroke="#0ea5e9" strokeWidth="4" />
      )}

      {/* neck */}
      {neck === "chain" && (
        <path d="M223 378c8 15 18 21 29 21s21-6 29-21" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" fill="none" />
      )}
      {neck === "scarf" && (
        <>
          <path d="M221 373c9 8 18 12 31 12 12 0 21-4 30-12" fill="none" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
          <rect x="269" y="384" width="14" height="38" rx="6" fill="#34d399" />
        </>
      )}
      {neck === "headphones" && (
        <>
          <path d="M214 274c0-21 17-38 38-38s38 17 38 38" stroke="#111827" strokeWidth="7" fill="none" />
          <rect x="205" y="287" width="12" height="24" rx="6" fill="#111827" />
          <rect x="287" y="287" width="12" height="24" rx="6" fill="#111827" />
        </>
      )}

      {/* hand props */}
      {hand === "coffee" && (
        <>
          <rect x="323" y="444" width="18" height="25" rx="4" fill="#fafaf9" />
          <path d="M341 450c8 1 8 12 0 13" stroke="#fafaf9" strokeWidth="3" fill="none" />
          <path d="M327 440c2-6 7-8 9-13" stroke="#d6d3d1" strokeWidth="2" fill="none" />
        </>
      )}
      {hand === "controller" && (
        <g transform="translate(318 446)">
          <rect x="0" y="0" width="34" height="20" rx="9" fill="#111827" />
          <circle cx="12" cy="10" r="3" fill="#9ca3af" />
          <circle cx="23" cy="10" r="3" fill="#9ca3af" />
        </g>
      )}
      {hand === "flower" && (
        <>
          <path d="M334 438v36" stroke="#16a34a" strokeWidth="4" />
          <circle cx="334" cy="434" r="7" fill="#ef4444" />
          <circle cx="326" cy="436" r="5" fill="#fb7185" />
          <circle cx="342" cy="436" r="5" fill="#fb7185" />
        </>
      )}
    </>
  );
}

function Figure({ preset }) {
  const skin = skinColorFor(preset);
  const hairColor = hairColorFor(preset);
  const outfit = outfitFor(preset);

  return (
    <g id="figure-layer">
      {/* shadow */}
      <ellipse data-export="hide-on-transparent" cx="252" cy="595" rx="118" ry="18" fill="rgba(0,0,0,0.25)" />
      {/* body / outfit */}
      <Outfit outfit={outfit} />
      {/* hands (skin) */}
      <circle cx="186" cy="471" r="13" fill={skin} />
      <circle cx="318" cy="470" r="13" fill={skin} />
      {/* neck */}
      <rect x="238" y="340" width="28" height="26" rx="10" fill={skin} />
      {/* head */}
      <rect x="175" y="196" width="154" height="170" rx="58" fill={skin} />
      {/* ears */}
      <circle cx="171" cy="278" r="12" fill={skin} />
      <circle cx="333" cy="278" r="12" fill={skin} />
      {/* hair */}
      <HairShape type={preset.hair} color={hairColor} />
      {/* face */}
      <BrowShapes type={preset.brows} />
      <EyeShapes type={preset.eyes} />
      <path d="M251 297c5 8 6 14 0 20" stroke="#8b5a3c" strokeWidth="3.2" fill="none" strokeLinecap="round" opacity="0.55" />
      <MouthShape type={preset.mouth} />
      {/* cheeks */}
      <ellipse cx="208" cy="317" rx="11" ry="6" fill="rgba(244,114,182,0.18)" />
      <ellipse cx="296" cy="317" rx="11" ry="6" fill="rgba(244,114,182,0.18)" />
      {/* accessories */}
      <Accessories preset={preset} />
    </g>
  );
}

function Box({ preset }) {
  const theme = boxThemeFor(preset);
  const [c1, c2, c3] = theme.colors;

  return (
    <g data-export="hide-on-transparent" id="box-layer">
      {/* outer */}
      <rect x="415" y="170" width="220" height="360" rx="28" fill="rgba(8,10,14,0.75)" stroke="rgba(255,255,255,0.14)" />
      {/* theme gradient card */}
      <defs>
        <linearGradient id="boxThemeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="60%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </linearGradient>
      </defs>
      <rect x="432" y="186" width="186" height="326" rx="20" fill="url(#boxThemeGrad)" />
      {/* box window */}
      <rect x="447" y="253" width="156" height="160" rx="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.24)" />
      <circle cx="525" cy="333" r="42" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.16)" />
      <circle cx="525" cy="324" r="13" fill="rgba(255,255,255,0.22)" />
      <rect x="502" y="343" width="46" height="29" rx="10" fill="rgba(255,255,255,0.22)" />
      {/* labels */}
      <text x="447" y="223" fill="rgba(255,255,255,0.85)" fontSize="13" letterSpacing="2">COLLECTOR EDITION</text>
      <text x="447" y="454" fill="#fff" fontSize="23" fontWeight="700" letterSpacing="1">{(preset.box.title || "CUSTOM").slice(0, 16)}</text>
      <text x="447" y="477" fill="rgba(255,255,255,0.85)" fontSize="12" letterSpacing="1">
        {(preset.box.subtitle || "Custom Figure").slice(0, 30)}
      </text>
      <rect x="447" y="488" width="156" height="8" rx="4" fill="rgba(255,255,255,0.22)" />
      <text x="448" y="205" fill="rgba(255,255,255,0.25)" fontSize="42" fontWeight="700">01</text>
    </g>
  );
}

export default function PreviewStage() {
  const preset = useBuilderStore((s) => s.preset);
  const bg = bgFor(preset);

  return (
    <section className="preview-stage">
      <div className="preview-header">
        <div>
          <h2>Live Preview</h2>
          <p>Original placeholder figure style (safe starting point)</p>
        </div>
        <div className="preview-badge">SVG • PNG export ready</div>
      </div>

      <div className="preview-frame">
        <svg
          id="builder-export-svg"
          className="preview-svg"
          viewBox="0 0 720 720"
          role="img"
          aria-label="Customized figure preview"
        >
          <defs>
            <linearGradient id="sceneBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={bg.colors[0]} />
              <stop offset="100%" stopColor={bg.colors[1]} />
            </linearGradient>
            <radialGradient id="glow" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.28)" />
              <stop offset="60%" stopColor="rgba(34,197,94,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <g data-export="hide-on-transparent" id="scene-layer">
            <rect width="720" height="720" rx="32" fill="url(#sceneBg)" />
            <rect width="720" height="720" fill="url(#glow)" />
            <circle cx="518" cy="164" r="84" fill="rgba(255,255,255,0.05)" />
            <path d="M68 545c88-62 179-84 278-77 84 6 150 26 241 82" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" strokeLinecap="round" />
          </g>

          <Figure preset={preset} />
          <Box preset={preset} />
        </svg>
      </div>
    </section>
  );
}
