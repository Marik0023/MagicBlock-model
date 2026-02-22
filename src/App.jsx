import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, ArrowRight, Lock, Download, RotateCcw, Check, Copy, Sparkles, ShieldCheck } from 'lucide-react'

const TGE_DATE = '2026-12-31T12:00:00Z'
const STORAGE_KEY = 'tge_capsule_v4_demo'

function pad(n) {
  return String(n).padStart(2, '0')
}

function useCountdown(target) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return useMemo(() => {
    const diff = Math.max(0, new Date(target).getTime() - now)
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      min: Math.floor((diff / 60000) % 60),
      sec: Math.floor((diff / 1000) % 60),
      done: diff <= 0,
    }
  }, [now, target])
}

function useTypedText(targetText, enabled, speed = 70) {
  const [value, setValue] = useState('')
  useEffect(() => {
    if (!enabled) {
      setValue('')
      return
    }
    let i = 0
    setValue('')
    const id = setInterval(() => {
      i += 1
      setValue(targetText.slice(0, i))
      if (i >= targetText.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [targetText, enabled, speed])
  return value
}

function formatDate(d) {
  return new Date(d).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Glass({ className = '', children }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,.45)] ${className}`}>
      {children}
    </div>
  )
}

function NeonBtn({ children, className = '', variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-[.99] disabled:opacity-50 disabled:cursor-not-allowed'
  const style =
    variant === 'ghost'
      ? 'bg-white/[0.03] border border-white/10 text-white hover:bg-white/[0.07]'
      : 'bg-cyan-400/15 border border-cyan-300/30 text-cyan-100 hover:bg-cyan-400/20 shadow-[0_0_28px_rgba(34,211,238,.14)]'
  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  )
}

function Label({ children, right }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <label className="text-sm text-white/85">{children}</label>
      {right ? <span className="text-xs text-white/40">{right}</span> : null}
    </div>
  )
}

function Input({ value, onChange, placeholder, maxLength = 28 }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/15"
    />
  )
}

function Textarea({ value, onChange, placeholder, maxLength = 700 }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
      rows={12}
      placeholder={placeholder}
      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/15"
    />
  )
}

function ElectricParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300"
          style={{
            left: `${8 + (i * 7) % 84}%`,
            top: `${12 + (i * 13) % 70}%`,
            opacity: 0.5,
            boxShadow: '0 0 14px rgba(34,211,238,.8)',
          }}
          animate={{
            y: [0, -8, 0, 5, 0],
            opacity: [0.15, 0.9, 0.2],
            scale: [0.7, 1.4, 0.8],
          }}
          transition={{ duration: 2.6 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.14 }}
        />
      ))}
    </div>
  )
}

function Capsule({ name, avatarPreview, phase = 'open', tgeDate = TGE_DATE, sealProgress = 0, compact = false }) {
  const c = useCountdown(tgeDate)
  const typed = useTypedText('LOCKED UNTIL TGE', phase === 'sealing' || phase === 'sealed', 65)

  const W = compact ? 360 : 620
  const H = compact ? 260 : 420
  const lidW = compact ? 275 : 470
  const lidH = compact ? 100 : 165
  const bodyW = compact ? 300 : 520
  const bodyH = compact ? 110 : 180

  const lidState =
    phase === 'open' ? { y: 0, rotateX: -64 } : phase === 'sealing' ? { y: 82, rotateX: 0 } : { y: 82, rotateX: 0 }

  const showIdentity = !!name || !!avatarPreview

  return (
    <div className="relative mx-auto" style={{ width: W, height: H, perspective: 1400 }}>
      <div className="absolute inset-[4%] rounded-[26px] border border-cyan-300/10 bg-gradient-to-b from-cyan-500/5 to-blue-500/5" />
      <ElectricParticleField />

      <motion.div
        className="absolute left-1/2 bottom-4 h-6 -translate-x-1/2 rounded-full blur-2xl"
        style={{ width: compact ? 220 : 380, background: 'rgba(34,211,238,.24)' }}
        animate={phase === 'sealing' ? { opacity: [0.2, 0.9, 0.35], scaleX: [0.95, 1.08, 1] } : { opacity: 0.35, scaleX: 1 }}
        transition={phase === 'sealing' ? { duration: 1.1, repeat: Infinity } : { duration: 0.25 }}
      />

      {/* body */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2" style={{ width: bodyW, height: bodyH }}>
        <div className="absolute inset-0 rounded-[30px] border border-white/15 bg-gradient-to-b from-[#f4fbff] via-[#e6eef5] to-[#cad5e2] shadow-[0_14px_40px_rgba(0,0,0,.45)] overflow-hidden">
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.85),transparent_33%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,.12),transparent_48%)]" />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl border border-white/40 bg-white/55 backdrop-blur-sm grid place-items-center text-cyan-900/70 shadow-inner">✧</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl border border-white/40 bg-white/55 backdrop-blur-sm grid place-items-center text-cyan-900/70 shadow-inner">⌁</div>
          <div className="absolute left-6 bottom-5 h-2 w-8 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.8)]" />
          <div className="absolute right-6 bottom-5 h-2 w-12 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,.8)]" />
          <div className="absolute left-6 top-11 h-8 w-1 rounded-full bg-cyan-300/90" />
          <div className="absolute right-6 top-11 h-8 w-1 rounded-full bg-cyan-300/90" />

          {/* center plate */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[22px] border border-cyan-200/50 bg-gradient-to-r from-[#d5e4ed]/80 to-[#c8d8e3]/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,.25)]"
            style={{ width: compact ? 200 : 350, height: compact ? 70 : 110 }}>
            <div className="absolute left-2 top-2 bottom-2 aspect-square rounded-xl border border-cyan-900/20 bg-[#051624] overflow-hidden shadow-[inset_0_0_0_1px_rgba(34,211,238,.14)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.12),transparent_55%)]" />
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-[10px] font-medium tracking-[.15em] text-cyan-200/65">AVATAR</div>
              )}
              <div className="absolute inset-1 rounded-[10px] border border-cyan-300/15" />
            </div>

            <div className="absolute left-[32%] right-3 top-2 bottom-2 flex flex-col justify-center min-w-0">
              <div className="text-[9px] uppercase tracking-[.26em] text-cyan-900/35">Capsule ID</div>
              <div className="truncate font-semibold text-cyan-950/70 text-sm md:text-base">
                {showIdentity ? name || 'Unnamed' : '—'}
              </div>
              <div className="mt-1 h-5 rounded-lg border border-cyan-900/8 bg-[#5d7388]/20 px-2 flex items-center overflow-hidden">
                <motion.div
                  className="text-[9px] md:text-[10px] uppercase tracking-[.18em] text-cyan-900/45 whitespace-nowrap"
                  animate={phase === 'sealing' ? { opacity: [0.2, 1, 0.4] } : { opacity: 1 }}
                  transition={phase === 'sealing' ? { duration: 0.8, repeat: Infinity } : { duration: 0.2 }}
                >
                  {phase === 'sealed' ? 'Locked until TGE' : phase === 'sealing' ? (typed || 'LOCKING...') : 'Ready to seal'}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 bottom-2 rounded-full border border-white/20 bg-[#081320]/80 px-3 py-1 text-[10px] text-cyan-100/90 flex items-center gap-1.5 shadow-[0_0_20px_rgba(34,211,238,.1)]">
            <Lock className="h-3 w-3" />
            {phase === 'sealed'
              ? `Opens on ${new Date(tgeDate).toLocaleDateString()}`
              : `TGE in ${c.days}d ${c.hours}h ${c.min}m`}
          </div>
        </div>
      </div>

      {/* lid shadow */}
      <motion.div
        className="absolute left-1/2 top-[26%] -translate-x-1/2 rounded-[28px] bg-black/35 blur-xl"
        style={{ width: lidW * 0.92, height: lidH * 0.42 }}
        animate={phase === 'open' ? { opacity: 0.35, y: -8 } : { opacity: 0.15, y: 10 }}
      />

      {/* lid */}
      <motion.div
        className="absolute left-1/2 top-[16%] -translate-x-1/2 origin-bottom"
        style={{ width: lidW, height: lidH, transformStyle: 'preserve-3d' }}
        animate={lidState}
        transition={phase === 'sealing' ? { duration: 1.2, ease: [0.22, 0.98, 0.2, 1] } : { duration: 0.35 }}
      >
        <div className="relative h-full w-full rounded-[28px] border border-white/20 bg-gradient-to-b from-[#f3fbff] via-[#d9e9f6] to-[#b8c9d7] p-[8px] shadow-[0_16px_36px_rgba(0,0,0,.35)]">
          <div className="relative h-full w-full rounded-[22px] border border-cyan-300/25 bg-gradient-to-br from-[#07244a] via-[#04162f] to-[#020a18] overflow-hidden shadow-[inset_0_0_50px_rgba(34,211,238,.12)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(56,189,248,.22),transparent_38%),radial-gradient(circle_at_78%_70%,rgba(34,211,238,.15),transparent_52%)]" />
            <motion.div
              className="absolute left-3 right-3 top-3 h-[2px] rounded-full bg-cyan-300"
              style={{ boxShadow: '0 0 12px rgba(34,211,238,.8)' }}
              animate={phase === 'sealing' ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.6 }}
              transition={phase === 'sealing' ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
            />
            <motion.div
              className="absolute top-2 h-[calc(100%-16px)] w-7 rounded-xl border border-cyan-300/20 bg-cyan-300/10"
              style={{ left: compact ? '52%' : '60%' }}
              animate={phase === 'sealing' ? { x: [0, compact ? -130 : -220, 0], opacity: [0.2, 0.9, 0.2] } : { opacity: 0.35 }}
              transition={phase === 'sealing' ? { duration: 1.2, repeat: Infinity } : { duration: 0.2 }}
            />
            <div className="absolute left-4 bottom-4 h-2 w-9 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 14px rgba(34,211,238,.75)' }} />
            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-cyan-300" style={{ boxShadow: '0 0 14px rgba(34,211,238,.75)' }} />

            {/* display text on lid during sealing/sealed */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 w-[74%] rounded-xl border border-cyan-300/20 bg-[#07101e]/75 px-3 py-2 overflow-hidden">
              <div className="text-[9px] uppercase tracking-[.18em] text-cyan-200/65">Status display</div>
              <div className="mt-1 h-4 text-[10px] md:text-xs text-cyan-100 font-medium tracking-[.16em] whitespace-nowrap">
                {phase === 'open' ? 'CAPSULE OPEN' : (typed || (phase === 'sealed' ? 'LOCKED UNTIL TGE' : '...'))}
                {(phase === 'sealing' || phase === 'open') && <span className="ml-1 inline-block w-1.5 h-3 bg-cyan-200/85 align-middle animate-pulse" />}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* electric arcs on seal */}
      <AnimatePresence>
        {phase === 'sealing' && (
          <>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.9, 0], scale: [0.8, 1.05, 0.9], rotate: [0, i % 2 ? 4 : -4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.18, repeat: Infinity, repeatDelay: 0.3 }}
                className="absolute left-1/2 -translate-x-1/2 top-[41%] h-[2px] bg-cyan-200"
                style={{ width: compact ? 220 : 380, boxShadow: '0 0 14px rgba(34,211,238,.95)', clipPath: 'polygon(0 50%, 8% 35%, 16% 70%, 24% 32%, 34% 62%, 46% 28%, 58% 68%, 70% 36%, 82% 60%, 92% 40%, 100% 50%, 100% 70%, 0 70%)' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShareImageCard({ name, avatarPreview, letter, sealedAt }) {
  return (
    <div
      className="w-[1080px] h-[1350px] rounded-[38px] overflow-hidden border border-white/10 relative"
      style={{
        background:
          'radial-gradient(900px 500px at 15% 8%, rgba(34,211,238,.18), transparent 60%), radial-gradient(700px 550px at 88% 80%, rgba(59,130,246,.15), transparent 55%), #05070d',
      }}
    >
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="absolute top-10 left-10 right-10 flex items-start justify-between">
        <div>
          <div className="text-cyan-300 text-sm tracking-[.24em] uppercase">TGE Time Capsule</div>
          <div className="mt-2 text-white text-5xl font-semibold">Capsule Sealed</div>
          <div className="mt-2 text-white/55 text-lg">Locked until TGE</div>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-cyan-100 text-sm">{new Date(TGE_DATE).toLocaleDateString()}</div>
      </div>

      <div className="absolute left-0 right-0 top-[190px] flex justify-center scale-[1.25] origin-top">
        <Capsule name={name} avatarPreview={avatarPreview} phase="sealed" compact />
      </div>

      <div className="absolute left-10 right-10 bottom-10 rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-8">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {avatarPreview ? <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-semibold text-white truncate">{name || 'Unnamed user'}</div>
            <div className="text-sm text-white/50 mt-1">Sealed: {sealedAt ? formatDate(sealedAt) : '—'}</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-xs uppercase tracking-[.2em] text-cyan-200/70 mb-2">Letter preview</div>
          <p className="text-white/80 text-lg leading-relaxed line-clamp-4">{letter || 'My message to the future is sealed until TGE.'}</p>
        </div>
      </div>
    </div>
  )
}

function StepPills({ step }) {
  const items = ['Identity', 'Letter', 'Sealed']
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it, idx) => {
        const active = step === idx + 1
        const done = step > idx + 1
        return (
          <div
            key={it}
            className={`rounded-2xl border px-3 py-2 text-sm ${active || done ? 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/[0.02] text-white/45'}`}
          >
            <span className="mr-2">{idx + 1}</span>
            {it}
          </div>
        )
      })}
    </div>
  )
}

function saveLocal(record) {
  try {
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    arr.unshift(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 50)))
  } catch (e) {
    console.error(e)
  }
}

export default function App() {
  const [step, setStep] = useState(1)
  const [phase, setPhase] = useState('open') // open | sealing | sealed
  const [name, setName] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [letter, setLetter] = useState('')
  const [errors, setErrors] = useState({})
  const [sealedAt, setSealedAt] = useState('')
  const [copyDone, setCopyDone] = useState(false)
  const [exporting, setExporting] = useState(false)
  const shareRef = useRef(null)
  const fileRef = useRef(null)
  const countdown = useCountdown(TGE_DATE)

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('')
      return
    }
    const url = URL.createObjectURL(avatarFile)
    setAvatarPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  function validateIdentity() {
    const next = {}
    if (!name.trim()) next.name = 'Введи імʼя або нік.'
    if (!avatarFile) next.avatar = 'Додай аватар.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function toLetterStep() {
    if (!validateIdentity()) return
    setStep(2)
    setPhase('open')
  }

  function startSeal() {
    const next = {}
    if (!letter.trim()) next.letter = 'Напиши лист перед закриттям капсули.'
    if (Object.keys(next).length) {
      setErrors((prev) => ({ ...prev, ...next }))
      return
    }
    setErrors({})
    setStep(3)
    setPhase('sealing')
    const ts = new Date().toISOString()
    setSealedAt(ts)
    setTimeout(() => {
      setPhase('sealed')
      saveLocal({ id: Date.now(), name, avatarPreview, letter, sealedAt: ts, tgeDate: TGE_DATE })
    }, 1800)
  }

  function backToLetter() {
    setStep(2)
    setPhase('open')
  }

  function resetAll() {
    setStep(1)
    setPhase('open')
    setName('')
    setAvatarFile(null)
    setLetter('')
    setErrors({})
    setSealedAt('')
  }

  async function downloadPNG() {
    if (!shareRef.current) return
    try {
      setExporting(true)
      const htmlToImage = await import('html-to-image')
      const dataUrl = await htmlToImage.toPng(shareRef.current, { cacheBust: true, pixelRatio: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `capsule-${(name || 'user').replace(/\s+/g, '-').toLowerCase()}.png`
      a.click()
    } catch (e) {
      console.error(e)
      alert('Не вдалося експортувати PNG у цьому середовищі.')
    } finally {
      setExporting(false)
    }
  }

  async function copyShareText() {
    try {
      await navigator.clipboard.writeText(`I sealed my TGE Time Capsule ✨ Locked until TGE.`)
      setCopyDone(true)
      setTimeout(() => setCopyDone(false), 1500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-[#04070d] text-white overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute -top-24 left-[-5%] h-[360px] w-[360px] rounded-full bg-cyan-400/10 blur-[90px]" />
        <div className="absolute top-[20%] right-[-8%] h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-[-8%] left-[30%] h-[320px] w-[320px] rounded-full bg-cyan-300/10 blur-[100px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1500px] px-4 sm:px-6 py-6 md:py-8">
        <div className="mb-6 grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-4 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" /> Premium MVP • Frontend only (Supabase later)
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">TGE Time Capsule</h1>
            <p className="mt-3 max-w-2xl text-white/60">Заповни профіль → напиши один лист → закрий футуристичну капсулу. Лист відкриється пізніше в reveal режимі.</p>
          </div>

          <Glass className="p-4 min-w-[280px]">
            <div className="text-xs tracking-[.24em] uppercase text-cyan-200/80">Locked until TGE</div>
            <div className="mt-2 text-lg font-medium">{new Date(TGE_DATE).toLocaleString()}</div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[[countdown.days, 'DAYS'], [countdown.hours, 'HRS'], [countdown.min, 'MIN'], [countdown.sec, 'SEC']].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/[0.03] px-2 py-2 text-center">
                  <div className="text-sm font-semibold">{pad(v)}</div>
                  <div className="text-[10px] text-white/40 tracking-[.16em]">{l}</div>
                </div>
              ))}
            </div>
          </Glass>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-6 items-start">
            <Glass className="p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Capsule Preview</div>
                  <p className="mt-1 text-sm text-white/55">Капсула зʼявиться після введення імені та аватара — вже з твоїми даними на дисплеї.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70">STEP 1</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 min-h-[470px] grid place-items-center">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-20 w-20 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 grid place-items-center text-cyan-200">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-semibold">Спочатку створи ідентичність капсули</h3>
                  <p className="mt-3 text-white/55 max-w-md">Після натискання Continue відкриється сцена з електричною капсулою, де вже будуть твій аватар і імʼя.</p>
                </div>
              </div>
              <div className="mt-4"><StepPills step={1} /></div>
            </Glass>

            <Glass className="p-5 md:p-6 xl:sticky xl:top-4">
              <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Step 1</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Створи профіль капсули</h2>
              <p className="mt-3 text-white/60">Імʼя та аватар підставляються на капсулу ще до написання листа.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <Label>Імʼя / Нік</Label>
                  <Input value={name} onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined })) }} placeholder="Напр. Markiian Sora" />
                  {errors.name ? <p className="mt-2 text-xs text-rose-300">{errors.name}</p> : null}
                </div>

                <div>
                  <Label>Аватар</Label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="h-28 w-28 rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] grid place-items-center relative"
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="text-center text-white/40 text-xs px-2">
                          <Upload className="mx-auto mb-2 h-4 w-4" /> Upload
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-3xl ring-1 ring-cyan-300/15" />
                    </button>

                    <div className="space-y-3 text-sm text-white/55">
                      <p>PNG/JPG, квадратний аватар виглядає найкраще. Макс ~5MB.</p>
                      <div className="flex flex-wrap gap-2">
                        <NeonBtn variant="ghost" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Обрати аватар</NeonBtn>
                        {avatarFile ? <NeonBtn variant="ghost" onClick={() => setAvatarFile(null)}>Видалити</NeonBtn> : null}
                      </div>
                      {errors.avatar ? <p className="text-xs text-rose-300">{errors.avatar}</p> : null}
                    </div>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null
                      if (!f) return
                      if (f.size > 5 * 1024 * 1024) {
                        setErrors((p) => ({ ...p, avatar: 'Файл занадто великий (макс ~5MB).' }))
                        return
                      }
                      setErrors((p) => ({ ...p, avatar: undefined }))
                      setAvatarFile(f)
                    }}
                  />
                </div>

                <NeonBtn onClick={toLetterStep} className="w-full sm:w-auto">
                  Continue <ArrowRight className="h-4 w-4" />
                </NeonBtn>
              </div>
            </Glass>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="grid grid-cols-1 2xl:grid-cols-[1.15fr_.85fr] gap-6 items-start">
            <Glass className="p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Capsule Stage</div>
                  <p className="mt-1 text-sm text-white/55">Тепер капсула вже має твоє імʼя та аватар. Напиши лист справа і закрий її.</p>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">LETTER</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 min-h-[570px] flex items-center justify-center">
                <Capsule name={name} avatarPreview={avatarPreview} phase={phase} />
              </div>

              <div className="mt-4"><StepPills step={2} /></div>
            </Glass>

            <Glass className="p-5 md:p-6 2xl:sticky 2xl:top-4">
              <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Step 2</div>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Напиши лист</h2>
              <p className="mt-3 text-white/60">Просте заповнення: один лист. Без додаткових полів. Після натискання капсула закриється з анімацією.</p>

              <div className="mt-6">
                <Label right={`${letter.length}/700`}>Лист у майбутнє / комʼюніті</Label>
                <Textarea
                  value={letter}
                  onChange={(v) => { setLetter(v); setErrors((p) => ({ ...p, letter: undefined })) }}
                  maxLength={700}
                  placeholder="Напиши одне повідомлення: що відчуваєш перед TGE, що хочеш сказати собі в майбутньому, або комʼюніті..."
                />
                {errors.letter ? <p className="mt-2 text-xs text-rose-300">{errors.letter}</p> : null}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/55">
                Поки reveal режиму немає: у демо зберігається лише sealed-стан. Контент листа буде відкриватись пізніше.
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <NeonBtn variant="ghost" onClick={() => setStep(1)}>Back</NeonBtn>
                <NeonBtn onClick={startSeal}><Lock className="h-4 w-4" /> Закрити капсулу</NeonBtn>
              </div>
            </Glass>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 2xl:grid-cols-[1.05fr_.95fr] gap-6 items-start">
              <Glass className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Capsule Stage</div>
                    <p className="mt-1 text-sm text-white/55">Футуристична електро-капсула закрита. На дисплеї надруковано “LOCKED UNTIL TGE”.</p>
                  </div>
                  <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">SEALED</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 min-h-[570px] flex items-center justify-center">
                  <Capsule name={name} avatarPreview={avatarPreview} phase={phase} />
                </div>
                <div className="mt-4"><StepPills step={3} /></div>
              </Glass>

              <div className="space-y-6">
                <Glass className="p-5 md:p-6">
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Step 3</div>
                  <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Capsule sealed</h2>
                  <p className="mt-3 text-white/60">Локальна демо-запис збережена. Можеш скачати share image або повернутись редагувати лист.</p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-sm text-white/50">Status</div>
                    <div className="mt-2 flex items-center gap-2 text-cyan-100"><Lock className="h-4 w-4" /> Locked until TGE</div>
                    <div className="mt-2 text-xs text-white/40">Sealed at: {sealedAt ? formatDate(sealedAt) : '...'}</div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <NeonBtn onClick={downloadPNG} disabled={exporting} className="w-full"><Download className="h-4 w-4" /> {exporting ? 'Export...' : 'Download PNG'}</NeonBtn>
                    <NeonBtn variant="ghost" onClick={copyShareText} className="w-full">{copyDone ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copyDone ? 'Copied' : 'Copy share text'}</NeonBtn>
                    <NeonBtn variant="ghost" onClick={backToLetter} className="w-full">Edit letter</NeonBtn>
                    <NeonBtn variant="ghost" onClick={resetAll} className="w-full"><RotateCcw className="h-4 w-4" /> New capsule</NeonBtn>
                  </div>
                </Glass>

                <Glass className="p-5 md:p-6">
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Share Image Preview</div>
                  <div className="mt-4 rounded-3xl border border-white/10 bg-black/20 p-3 overflow-auto">
                    <div className="w-[1080px] h-[1350px] origin-top-left scale-[0.24] sm:scale-[0.3] md:scale-[0.36] lg:scale-[0.44]">
                      <div ref={shareRef}>
                        <ShareImageCard name={name} avatarPreview={avatarPreview} letter={letter} sealedAt={sealedAt} />
                      </div>
                    </div>
                  </div>
                </Glass>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
