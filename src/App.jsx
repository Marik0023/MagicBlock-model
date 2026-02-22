import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Download, Lock, RotateCcw, Upload, Sparkles, Check } from 'lucide-react';

const TGE_DATE = '2026-12-31T12:00:00Z';
const STORAGE_KEY = 'tge_capsule_v3_local';

function cn(...v) {
  return v.filter(Boolean).join(' ');
}

function fmtDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function useCountdown(targetIso) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const diff = Math.max(0, new Date(targetIso).getTime() - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { days, hours, minutes, seconds, diff };
  }, [now, targetIso]);
}

function useTypewriter(text, enabled, speed = 55, delay = 0) {
  const [out, setOut] = useState(enabled ? '' : '');
  useEffect(() => {
    let timeoutId;
    let intervalId;
    if (!enabled) {
      setOut('');
      return undefined;
    }
    setOut('');
    timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(intervalId);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, enabled, speed, delay]);
  return out;
}

function GlassPanel({ className = '', children }) {
  return (
    <div className={cn('rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_15px_60px_rgba(0,0,0,.45)]', className)}>
      {children}
    </div>
  );
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary'
          ? 'border border-cyan-300/35 bg-cyan-400/15 text-cyan-100 hover:bg-cyan-400/20 shadow-[0_0_25px_rgba(56,189,248,.12)]'
          : 'border border-white/10 bg-white/5 text-white hover:bg-white/10',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function CountdownCard() {
  const c = useCountdown(TGE_DATE);
  return (
    <GlassPanel className="p-4 min-w-[280px]">
      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Locked until TGE</div>
      <div className="mt-2 text-xl font-semibold text-white">{new Date(TGE_DATE).toLocaleString()}</div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {[
          [c.days, 'Days'],
          [c.hours, 'Hours'],
          [c.minutes, 'Min'],
          [c.seconds, 'Sec'],
        ].map(([n, label]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 py-2 text-center">
            <div className="text-sm font-semibold text-white">{String(n).padStart(2, '0')}</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/45">{label}</div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function AvatarUpload({ avatarPreview, onFile, error }) {
  const inputRef = useRef(null);
  return (
    <div className="space-y-3">
      <div className="text-sm text-white/80">Avatar</div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative h-24 w-24 rounded-2xl border border-white/10 bg-white/5 overflow-hidden grid place-items-center"
        >
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="avatar preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 ring-2 ring-cyan-300/35 rounded-2xl" />
            </>
          ) : (
            <div className="text-center text-white/45 text-xs px-2">
              <Upload className="h-4 w-4 mx-auto mb-1" />
              Upload photo
            </div>
          )}
        </button>
        <div className="space-y-2 text-sm text-white/60">
          <div>Square image works best (PNG/JPG, up to ~5MB).</div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Choose avatar
            </Button>
            {avatarPreview ? (
              <Button type="button" variant="ghost" onClick={() => onFile(null)}>
                <RotateCcw className="h-4 w-4" /> Remove
              </Button>
            ) : null}
          </div>
          {error ? <div className="text-rose-300 text-xs">{error}</div> : null}
        </div>
      </div>
      <input ref={inputRef} hidden type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] || null)} />
    </div>
  );
}

function Input({ label, value, onChange, placeholder, maxLength = 40, error }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/80">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'w-full rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 transition',
          error ? 'border-rose-300/50 ring-2 ring-rose-300/15' : 'border-white/10 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20',
        )}
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder, maxLength = 700, error }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-white/80">{label}</span>
        <span className="text-xs text-white/40">{value.length}/{maxLength}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={12}
        className={cn(
          'w-full resize-none rounded-2xl border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 transition leading-relaxed',
          error ? 'border-rose-300/50 ring-2 ring-rose-300/15' : 'border-white/10 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20',
        )}
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </label>
  );
}

function saveLocal(record) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    current.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 20)));
  } catch {
    // ignore demo persistence errors
  }
}

function ElectricCapsule({ phase, avatarPreview, name, letter, tgeDate }) {
  const compactName = name?.trim() || 'Your Name';
  const isPreview = phase === 'preview';
  const isSealing = phase === 'sealing';
  const isSealed = phase === 'sealed';
  const typedLock = useTypewriter('LOCKED UNTIL TGE', isSealing || isSealed, 65, isSealing ? 620 : 0);
  const c = useCountdown(tgeDate);

  return (
    <div className="relative mx-auto w-full max-w-[760px] aspect-[1.35/1] min-h-[320px]">
      {/* ambient */}
      <motion.div
        className="absolute left-[12%] right-[12%] bottom-[6%] h-10 rounded-full blur-2xl"
        style={{ background: 'rgba(56,189,248,.25)' }}
        animate={isSealing ? { opacity: [0.25, 0.9, 0.35], scaleX: [0.95, 1.06, 1] } : { opacity: 0.3, scaleX: 1 }}
        transition={isSealing ? { duration: 1.05, repeat: Infinity } : { duration: 0.3 }}
      />

      {/* electric particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/80 blur-[1px]"
          style={{ left: `${8 + i * 8}%`, top: `${20 + (i % 4) * 10}%` }}
          animate={isSealing ? { opacity: [0.15, 0.95, 0.2], y: [0, -8, 0] } : { opacity: 0 }}
          transition={{ duration: 0.9 + (i % 3) * 0.2, repeat: Infinity, delay: i * 0.03 }}
        />
      ))}

      {/* letter sheet */}
      <AnimatePresence>
        {!isSealed && (
          <motion.div
            key="letter-sheet"
            className="absolute left-1/2 top-[40%] z-20 w-[50%] max-w-[360px] -translate-x-1/2"
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={
              isSealing
                ? { opacity: [1, 1, 0.15, 0], y: [0, 18, 46, 64], scale: [1, 0.98, 0.95, 0.9] }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={isSealing ? { duration: 1.05, ease: 'easeInOut' } : { duration: 0.25 }}
          >
            <div className="rounded-2xl border border-cyan-300/20 bg-[#081120]/90 backdrop-blur-xl p-4 shadow-[0_0_35px_rgba(56,189,248,.12)]">
              <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70 mb-2">Letter</div>
              <div className="text-white/80 text-xs leading-relaxed line-clamp-4">
                {letter?.trim() || 'Write one message to your future self / community, then seal the capsule.'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lid */}
      <motion.div
        className="absolute left-1/2 z-30 w-[86%] h-[44%] -translate-x-1/2 origin-bottom [transform-style:preserve-3d]"
        style={{ top: '6%' }}
        animate={
          isPreview
            ? { y: 0, rotateX: -46, rotateZ: 0 }
            : isSealing
            ? { y: [0, 10, 30, 44], rotateX: [-46, -18, -4, 0], rotateZ: [0, 0.4, 0] }
            : { y: 44, rotateX: 0, rotateZ: 0 }
        }
        transition={isSealing ? { duration: 1.35, ease: [0.22, 0.9, 0.24, 1] } : { duration: 0.45 }}
      >
        <div className="relative h-full w-full rounded-[42px] border border-white/20 bg-gradient-to-b from-white/90 via-white/75 to-white/60 shadow-[0_22px_45px_rgba(0,0,0,.35)] overflow-hidden">
          <div className="absolute inset-[7px] rounded-[34px] border border-cyan-300/20 bg-gradient-to-b from-[#0a1730] to-[#07101d] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,.22),transparent_35%),radial-gradient(circle_at_85%_75%,rgba(96,165,250,.15),transparent_40%)]" />
            <div className="absolute left-4 right-4 top-3 h-[2px] rounded-full bg-cyan-300/60 shadow-[0_0_12px_rgba(56,189,248,.65)]" />
            <div className="absolute left-[38%] top-[8%] h-6 w-[24%] rounded-xl border border-cyan-300/30 bg-cyan-300/10" />
            <div className="absolute left-6 bottom-4 h-2 w-10 rounded-full bg-cyan-300/70 shadow-[0_0_12px_rgba(56,189,248,.8)]" />
            <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-cyan-300/80 shadow-[0_0_12px_rgba(56,189,248,.8)]" />
          </div>
          <motion.div
            className="absolute inset-0"
            animate={isSealing ? { boxShadow: ['inset 0 0 0 rgba(56,189,248,0)', 'inset 0 0 85px rgba(56,189,248,.2)', 'inset 0 0 30px rgba(56,189,248,.1)'] } : { boxShadow: 'inset 0 0 25px rgba(56,189,248,.08)' }}
            transition={isSealing ? { duration: 0.95, repeat: Infinity } : { duration: 0.4 }}
          />
        </div>
      </motion.div>

      {/* base */}
      <div className="absolute left-1/2 bottom-[7%] z-10 w-[90%] h-[48%] -translate-x-1/2">
        <div className="relative h-full w-full rounded-[42px] border border-white/20 bg-gradient-to-b from-white/90 via-white/75 to-white/65 shadow-[0_25px_55px_rgba(0,0,0,.45)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,.75),transparent_45%),radial-gradient(circle_at_70%_120%,rgba(56,189,248,.16),transparent_55%)]" />
          <div className="absolute inset-[10px] rounded-[34px] border border-white/10 bg-transparent" />
          <div className="absolute left-4 top-[26%] grid place-items-center h-16 w-16 rounded-2xl border border-white/20 bg-white/35 backdrop-blur-sm">
            <div className="text-white/90 text-2xl">✦</div>
          </div>
          <div className="absolute right-4 top-[26%] grid place-items-center h-16 w-16 rounded-2xl border border-white/20 bg-white/35 backdrop-blur-sm">
            <div className="text-white/90 text-2xl">⌁</div>
          </div>
          <div className="absolute left-[6%] bottom-[12%] h-2 w-10 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(56,189,248,.75)]" />
          <div className="absolute right-[6%] bottom-[12%] h-2 w-14 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(56,189,248,.75)]" />
          <div className="absolute left-[4%] top-[45%] h-7 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_10px_rgba(56,189,248,.75)]" />
          <div className="absolute right-[4%] top-[45%] h-7 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_10px_rgba(56,189,248,.75)]" />

          {/* display with avatar + name + lock text */}
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[64%] h-[54%] rounded-[28px] border border-white/15 bg-[#071121]/92 shadow-[inset_0_0_40px_rgba(56,189,248,.08)] p-2.5 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(56,189,248,.1),transparent_40%),radial-gradient(circle_at_95%_85%,rgba(96,165,250,.08),transparent_45%)]" />
            <div className="relative h-full grid grid-cols-[72px_1fr] gap-2.5 items-stretch">
              <div className="rounded-2xl border border-cyan-300/25 bg-[#08111f] overflow-hidden relative grid place-items-center">
                <div className="absolute inset-2 rounded-xl border border-dashed border-cyan-300/20" />
                {avatarPreview ? (
                  <img src={avatarPreview} alt="avatar" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="text-[10px] text-cyan-200/60">AVATAR</span>
                )}
                <motion.div
                  className="absolute inset-0 bg-cyan-300/10"
                  animate={isSealing ? { opacity: [0, 0.35, 0] } : { opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-cyan-300/10 to-cyan-400/5 px-3 py-2 flex flex-col justify-center min-w-0">
                <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/70">Capsule ID</div>
                <div className="text-white font-semibold text-sm md:text-base truncate leading-tight">{compactName}</div>
                <div className="mt-1 h-5 rounded-lg border border-cyan-300/15 bg-black/20 px-2 flex items-center text-[10px] md:text-xs text-cyan-100/85 uppercase tracking-[0.16em] overflow-hidden">
                  {isPreview ? (
                    <span className="normal-case tracking-normal text-cyan-100/70">Ready to seal</span>
                  ) : (
                    <>
                      <span>{typedLock || (isSealed ? 'LOCKED UNTIL TGE' : '')}</span>
                      {typedLock.length < 'LOCKED UNTIL TGE'.length ? (
                        <motion.span className="ml-0.5 inline-block h-3 w-[1px] bg-cyan-300/90" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} />
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </div>
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={isSealing ? { opacity: [0.4, 1, 0.45] } : { opacity: 0.7 }}
              transition={isSealing ? { duration: 0.85, repeat: Infinity } : { duration: 0.3 }}
              style={{ boxShadow: 'inset 0 0 0 1px rgba(56,189,248,.12), inset 0 0 30px rgba(56,189,248,.07)' }}
            />
          </div>

          <div className="absolute left-1/2 bottom-2 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-[#07111d]/80 px-3 py-1 text-[11px] text-cyan-100/85 flex items-center gap-2">
            <Lock className="h-3 w-3" />
            {isPreview ? `TGE in ${c.days}d ${c.hours}h ${c.minutes}m` : `Opens on ${new Date(tgeDate).toLocaleDateString()}`}
          </div>
        </div>
      </div>

      {/* sealing scan line */}
      <motion.div
        className="absolute left-[10%] right-[10%] z-40 h-[2px] rounded-full bg-cyan-300/80 blur-[1px]"
        animate={
          isSealing ? { top: ['26%', '74%', '44%'], opacity: [0, 0.95, 0] } : { top: '45%', opacity: 0 }
        }
        transition={isSealing ? { duration: 1.2, ease: 'easeInOut' } : { duration: 0.2 }}
      />
    </div>
  );
}

function ShareCard({ data }) {
  return (
    <div
      className="w-[1080px] h-[1350px] rounded-[36px] overflow-hidden border border-white/10 relative"
      style={{
        background:
          'radial-gradient(900px 500px at 10% 0%, rgba(56,189,248,.18), transparent 60%), radial-gradient(700px 500px at 100% 85%, rgba(96,165,250,.13), transparent 55%), #05070d',
      }}
    >
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-10 left-10 right-10 flex items-center justify-between">
        <div>
          <div className="text-cyan-300 text-sm uppercase tracking-[0.25em]">TGE Time Capsule</div>
          <div className="text-white text-4xl font-semibold mt-2">Capsule Sealed</div>
          <div className="text-white/55 mt-2">Locked until TGE</div>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-100 text-sm">{new Date(TGE_DATE).toLocaleDateString()}</div>
      </div>
      <div className="absolute top-[140px] left-0 right-0 px-10 scale-[1.2] origin-top">
        <ElectricCapsule phase="sealed" avatarPreview={data.avatarPreview} name={data.name} letter={data.letter} tgeDate={TGE_DATE} />
      </div>
      <div className="absolute left-10 right-10 bottom-10 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="grid grid-cols-[100px_1fr] gap-5 items-center">
          <div className="h-[100px] w-[100px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            {data.avatarPreview ? <img src={data.avatarPreview} alt="avatar" className="h-full w-full object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <div className="text-white text-3xl font-semibold truncate">{data.name || 'Your Name'}</div>
            <div className="text-cyan-100/80 mt-1">I sealed my message before TGE ✨</div>
            <div className="text-white/50 text-sm mt-2">Sealed on {data.sealedAt ? fmtDate(data.sealedAt) : fmtDate(new Date().toISOString())}</div>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70 mb-2">Letter Preview</div>
          <p className="text-white/80 text-lg leading-relaxed line-clamp-4">
            {data.letter || 'A message to the future is sealed inside the capsule.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState('identity'); // identity | letter | sealing | sealed
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [letter, setLetter] = useState('');
  const [errors, setErrors] = useState({});
  const [sealStatus, setSealStatus] = useState('Preparing seal...');
  const [sealedAt, setSealedAt] = useState('');
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('');
      return undefined;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    if (step !== 'sealing') return undefined;

    const ts = new Date().toISOString();
    setSealedAt(ts);
    const phases = ['Dropping letter into capsule...', 'Closing shell...', 'Writing lock status...', 'Capsule sealed'];
    let idx = 0;
    setSealStatus(phases[0]);
    const statusInt = setInterval(() => {
      idx = Math.min(idx + 1, phases.length - 1);
      setSealStatus(phases[idx]);
    }, 580);

    const saveTimer = setTimeout(() => {
      saveLocal({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        name: name.trim(),
        avatarPreview,
        letter: letter.trim(),
        sealedAt: ts,
      });
    }, 900);

    const doneTimer = setTimeout(() => setStep('sealed'), 2400);

    return () => {
      clearInterval(statusInt);
      clearTimeout(saveTimer);
      clearTimeout(doneTimer);
    };
  }, [step, name, avatarPreview, letter]);

  const shareData = { name: name.trim(), avatarPreview, letter: letter.trim(), sealedAt };

  function validateIdentity() {
    const next = {};
    if (!name.trim()) next.name = 'Enter your name / nickname';
    if (!avatarFile) next.avatar = 'Upload avatar to continue';
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  function goToLetter() {
    setErrors({});
    if (!validateIdentity()) return;
    setStep('letter');
  }

  function sealCapsule() {
    const next = {};
    if (!name.trim()) next.name = 'Enter your name / nickname';
    if (!avatarFile) next.avatar = 'Upload avatar to continue';
    if (!letter.trim()) next.letter = 'Write one letter before sealing';
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.name || next.avatar) setStep('identity');
      return;
    }
    setStep('sealing');
  }

  function resetAll() {
    setStep('identity');
    setName('');
    setAvatarFile(null);
    setLetter('');
    setErrors({});
    setSealedAt('');
    setSealStatus('Preparing seal...');
  }

  async function downloadPng() {
    if (!shareRef.current) return;
    try {
      setExporting(true);
      const htmlToImage = await import('html-to-image');
      const dataUrl = await htmlToImage.toPng(shareRef.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `capsule-${(name || 'user').replace(/\s+/g, '-').toLowerCase()}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      alert('Export failed in this environment. Try again in browser.');
    } finally {
      setExporting(false);
    }
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText('I sealed my TGE Time Capsule ✨ Locked until TGE.');
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-x-hidden">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-[-4%] h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-[90px]" />
        <div className="absolute top-[20%] right-[-8%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* header */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-start lg:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Electric Capsule UI v3 (frontend only)
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">TGE Time Capsule</h1>
            <p className="mt-2 text-white/60 max-w-3xl">Simple flow: identity → one letter → seal capsule. Avatar and name appear on the capsule before you start writing.</p>
          </div>
          <CountdownCard />
        </div>

        {step === 'identity' ? (
          <GlassPanel className="p-5 md:p-6 max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Step 1</div>
            <h2 className="mt-2 text-2xl md:text-4xl font-semibold">Create capsule identity</h2>
            <p className="mt-2 text-white/60">First fill name + avatar. After that you will see your personalized electric capsule.</p>
            <div className="mt-6 space-y-5">
              <Input
                label="Name / Nickname"
                value={name}
                onChange={(v) => {
                  setErrors((p) => ({ ...p, name: undefined }));
                  setName(v);
                }}
                placeholder="e.g. Markiian Sora"
                maxLength={28}
                error={errors.name}
              />
              <AvatarUpload
                avatarPreview={avatarPreview}
                error={errors.avatar}
                onFile={(file) => {
                  setErrors((p) => ({ ...p, avatar: undefined }));
                  if (!file) {
                    setAvatarFile(null);
                    return;
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    setErrors((p) => ({ ...p, avatar: 'Image is too large (max ~5MB).' }));
                    return;
                  }
                  setAvatarFile(file);
                }}
              />
              <div className="flex flex-wrap gap-3 pt-1">
                <Button onClick={goToLetter}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-5 items-start">
            {/* left: capsule stage */}
            <GlassPanel className="p-4 md:p-5 xl:sticky xl:top-4">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Capsule Stage</div>
                  <div className="text-sm text-white/60 mt-1">
                    {step === 'letter' && 'Name + avatar are already inserted into the capsule. Write one letter on the right and seal it.'}
                    {step === 'sealing' && sealStatus}
                    {step === 'sealed' && 'Capsule is sealed. Lock text appears on the display and the capsule stays closed until TGE.'}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 uppercase tracking-[0.15em]">{step}</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 min-h-[420px] md:min-h-[520px] grid place-items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    <ElectricCapsule
                      phase={step === 'letter' ? 'preview' : step === 'sealing' ? 'sealing' : 'sealed'}
                      avatarPreview={avatarPreview}
                      name={name}
                      letter={letter}
                      tgeDate={TGE_DATE}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ['1', 'Identity', true],
                  ['2', 'Letter', step !== 'identity'],
                  ['3', 'Sealed', step === 'sealing' || step === 'sealed'],
                ].map(([n, label, active]) => (
                  <div
                    key={label}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-sm',
                      active ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/5 text-white/45',
                    )}
                  >
                    <span className="mr-2">{n}</span>{label}
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* right: letter panel / result */}
            <div className="space-y-5 xl:sticky xl:top-4">
              {(step === 'letter' || step === 'sealing') && (
                <GlassPanel className="p-5 md:p-6 min-h-[520px] flex flex-col">
                  <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Step 2</div>
                  <h2 className="mt-2 text-2xl md:text-4xl font-semibold">Write one letter</h2>
                  <p className="mt-2 text-white/60">Simple input only: one message to the future / community. No extra fields.</p>

                  <div className="mt-5 flex-1 flex flex-col gap-4">
                    <Textarea
                      label="Your letter"
                      value={letter}
                      onChange={(v) => {
                        setErrors((p) => ({ ...p, letter: undefined }));
                        setLetter(v);
                      }}
                      placeholder="Write your message for the future self / community..."
                      maxLength={700}
                      error={errors.letter}
                    />

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                      When you press <span className="text-cyan-100">Seal Capsule</span>, the lid will close, and the capsule screen will type <span className="text-cyan-100 uppercase tracking-[0.15em]">Locked until TGE</span>.
                    </div>

                    <div className="mt-auto flex flex-wrap gap-3">
                      <Button variant="ghost" onClick={() => setStep('identity')} disabled={step === 'sealing'}>
                        Back
                      </Button>
                      <Button onClick={sealCapsule} disabled={step === 'sealing'}>
                        <Lock className="h-4 w-4" /> {step === 'sealing' ? 'Sealing...' : 'Seal Capsule'}
                      </Button>
                    </div>
                  </div>
                </GlassPanel>
              )}

              {step === 'sealed' && (
                <>
                  <GlassPanel className="p-5 md:p-6">
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Step 3</div>
                    <h2 className="mt-2 text-2xl md:text-4xl font-semibold">Capsule sealed</h2>
                    <p className="mt-2 text-white/60">Your local demo record is saved. You can export a share image and continue polishing UI before Supabase integration.</p>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <div className="text-sm text-white/50">Status</div>
                          <div className="mt-1 text-cyan-100 flex items-center gap-2"><Lock className="h-4 w-4" /> Locked until TGE</div>
                        </div>
                        <div>
                          <div className="text-sm text-white/50">Sealed at</div>
                          <div className="mt-1 text-white/90">{sealedAt ? fmtDate(sealedAt) : '—'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button onClick={downloadPng} disabled={exporting} className="w-full">
                          <Download className="h-4 w-4" /> {exporting ? 'Exporting...' : 'Download PNG'}
                        </Button>
                        <Button variant="ghost" onClick={copyText} className="w-full">
                          {copied ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} {copied ? 'Copied' : 'Copy share text'}
                        </Button>
                        <Button variant="ghost" onClick={() => setStep('letter')} className="w-full">
                          Edit letter
                        </Button>
                        <Button variant="ghost" onClick={resetAll} className="w-full">
                          <RotateCcw className="h-4 w-4" /> New capsule
                        </Button>
                      </div>
                    </div>
                  </GlassPanel>

                  <GlassPanel className="p-4">
                    <div className="text-xs uppercase tracking-[0.24em] text-cyan-200/70 mb-3">Share Image Preview</div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-3 overflow-auto">
                      <div className="origin-top-left scale-[0.28] sm:scale-[0.34] w-[1080px] h-[1350px]">
                        <div ref={shareRef}>
                          <ShareCard data={shareData} />
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
