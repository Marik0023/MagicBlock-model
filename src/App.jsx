import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Copy, Download, Lock, RotateCcw, Share2, Sparkles, Upload } from 'lucide-react'

const TGE_DATE = '2026-12-31T12:00:00Z'
const STORAGE_KEY = 'tge_time_capsule_local_demo_v2'

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function countdownParts(targetIso) {
  const diff = Math.max(new Date(targetIso).getTime() - Date.now(), 0)
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function useCountdown(targetIso) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return useMemo(() => countdownParts(targetIso), [targetIso])
}

function GlassCard({ className = '', children }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_22px_70px_rgba(0,0,0,0.38)] ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="space-y-2">
      {eyebrow ? <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">{eyebrow}</div> : null}
      <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">{title}</h2>
      {subtitle ? <p className="text-white/60 max-w-2xl">{subtitle}</p> : null}
    </div>
  )
}

function NeonButton({ variant = 'primary', className = '', children, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed'
  const styles =
    variant === 'ghost'
      ? 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
      : 'border border-cyan-300/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_30px_rgba(56,189,248,0.14)] hover:bg-cyan-400/20'
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  )
}

function InputField({ label, value, onChange, placeholder, maxLength = 28, error }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/80">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/20"
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </label>
  )
}

function TextAreaField({ label, value, onChange, placeholder, maxLength = 400, rows = 4, error, required = false }) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-white/80">
          {label}
          {required ? <span className="text-cyan-200"> *</span> : null}
        </span>
        <span className="text-xs text-white/40">{value.length}/{maxLength}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-cyan-300/35 focus:ring-2 focus:ring-cyan-300/20"
      />
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </label>
  )
}

function AvatarUploader({ avatarPreview, onFile, error }) {
  const inputRef = useRef(null)

  return (
    <div className="space-y-3">
      <div className="text-sm text-white/80">Avatar</div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative h-28 w-28 rounded-3xl border border-white/10 bg-white/5 overflow-hidden grid place-items-center"
        >
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
              <div className="absolute inset-0 ring-2 ring-cyan-300/35 rounded-3xl" />
            </>
          ) : (
            <div className="text-center text-white/40 px-2">
              <Upload className="mx-auto h-5 w-5 mb-2" />
              <div className="text-xs">Upload photo</div>
            </div>
          )}
        </button>
        <div className="space-y-2 text-sm text-white/60">
          <p>Square photo works best. PNG/JPG up to ~5MB.</p>
          <div className="flex flex-wrap gap-2">
            <NeonButton type="button" variant="ghost" onClick={() => inputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Choose avatar
            </NeonButton>
            {avatarPreview ? (
              <NeonButton type="button" variant="ghost" onClick={() => onFile(null)}>
                <RotateCcw className="h-4 w-4" /> Remove
              </NeonButton>
            ) : null}
          </div>
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </div>
  )
}

function CapsuleReferenceScene({ mode = 'open', name, avatarPreview, tgeDate, message, small = false }) {
  const cd = useCountdown(tgeDate)
  const w = small ? 420 : 620
  const h = small ? 290 : 420
  const displayTop = small ? 205 : 286
  const displayLeft = small ? 165 : 240
  const displayWidth = small ? 205 : 300
  const displayHeight = small ? 58 : 82
  const avatarTop = small ? 200 : 279
  const avatarLeft = small ? 118 : 170
  const avatarSize = small ? 70 : 100

  const isSealing = mode === 'sealing'
  const isClosed = mode === 'closed'

  return (
    <div className="relative mx-auto" style={{ width: w, height: h }}>
      <motion.div
        className="absolute inset-x-[12%] bottom-4 h-8 rounded-full blur-2xl"
        style={{ background: 'rgba(56,189,248,0.22)' }}
        animate={isSealing ? { opacity: [0.25, 0.9, 0.35], scaleX: [0.95, 1.07, 1] } : { opacity: 0.28, scaleX: 1 }}
        transition={isSealing ? { duration: 1.1, repeat: Infinity } : { duration: 0.4 }}
      />

      <div className="absolute inset-0 rounded-[32px] overflow-hidden">
        <img src="/MagicBlock-model/capsule-reference.png" onError={(e)=>{e.currentTarget.src='/capsule-reference.png'}} alt="capsule" className="h-full w-full object-contain select-none pointer-events-none" />
      </div>

      {/* Letter overlay only after identity step */}
      {!isClosed && (
        <motion.div
          className="absolute rounded-2xl border border-cyan-300/20 bg-[#08121f]/90 shadow-[0_0_35px_rgba(56,189,248,0.14)]"
          style={{
            left: small ? 208 : 300,
            top: small ? 170 : 236,
            width: small ? 170 : 250,
            padding: small ? '10px 12px' : '12px 14px',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={
            isSealing
              ? { opacity: [1, 1, 0], y: [0, 10, 30], scale: [1, 0.98, 0.93] }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={isSealing ? { duration: 0.8, ease: 'easeInOut' } : { duration: 0.25 }}
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Letter</div>
          <div className="mt-1 text-white/80 text-xs leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {message?.trim() || 'Write your message to the future, your prediction, and your goal before sealing the capsule.'}
          </div>
        </motion.div>
      )}

      {/* Fake sealing shutter to make the open capsule feel closed later */}
      <motion.div
        className="absolute rounded-[24px] border border-cyan-300/15 bg-gradient-to-b from-[#0b1422]/95 to-[#060b13]/95 shadow-[0_0_40px_rgba(56,189,248,0.12)] overflow-hidden"
        style={{
          left: small ? 162 : 232,
          top: small ? 124 : 176,
          width: small ? 222 : 328,
          height: small ? 58 : 84,
        }}
        initial={false}
        animate={
          mode === 'open'
            ? { opacity: 0, y: -18, scaleY: 0.75 }
            : mode === 'sealing'
            ? { opacity: [0, 0.9, 1], y: [-18, 0, 0], scaleY: [0.75, 1, 1] }
            : { opacity: 1, y: 0, scaleY: 1 }
        }
        transition={mode === 'sealing' ? { duration: 0.95, ease: [0.2, 0.85, 0.2, 1] } : { duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(56,189,248,0.08),transparent_45%)]" />
        <div className="absolute left-4 right-4 top-2 h-[2px] rounded-full bg-cyan-300/55 shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
        <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-cyan-300/90 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
      </motion.div>

      {/* Front display overlay */}
      <motion.div
        className="absolute rounded-[16px] border border-cyan-300/20 bg-[#0a1730]/80 shadow-[inset_0_0_25px_rgba(56,189,248,0.08)] overflow-hidden"
        style={{ left: displayLeft, top: displayTop, width: displayWidth, height: displayHeight }}
        animate={isSealing ? { boxShadow: ['inset 0 0 15px rgba(56,189,248,0.08)', 'inset 0 0 26px rgba(56,189,248,0.16)', 'inset 0 0 15px rgba(56,189,248,0.08)'] } : {}}
        transition={isSealing ? { duration: 0.85, repeat: Infinity } : { duration: 0.3 }}
      >
        <div className="h-full flex items-center px-3 gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/60">Capsule</div>
            <div className="truncate text-white font-medium text-sm">{name?.trim() || 'Your Name'}</div>
            <div className="text-[10px] text-cyan-200/65">{isClosed || isSealing ? 'Locked until TGE' : 'Ready to seal'}</div>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isSealing ? { opacity: [0.45, 1, 0.6] } : { opacity: 0.65 }}
          transition={isSealing ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
          style={{ boxShadow: 'inset 0 0 0 1px rgba(56,189,248,0.12), inset 0 0 28px rgba(56,189,248,0.06)' }}
        />
      </motion.div>

      {/* Avatar slot overlay */}
      <div
        className="absolute rounded-2xl border border-cyan-300/20 bg-[#08101d]/85 overflow-hidden grid place-items-center"
        style={{ left: avatarLeft, top: avatarTop, width: avatarSize, height: avatarSize }}
      >
        {avatarPreview && (isSealing || isClosed) ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: mode === 'closed' ? 0.08 : 0 }}
            src={avatarPreview}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-[10px] text-cyan-200/60">AVATAR</div>
        )}
      </div>

      {/* Lock strip */}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-[#07101b]/80 px-3 py-1 text-[11px] text-cyan-100/80 flex items-center gap-2" style={{ bottom: small ? 16 : 20 }}>
        <Lock className="h-3 w-3" />
        <span>{isClosed ? `Opens on ${new Date(tgeDate).toLocaleDateString()}` : `TGE in ${cd.days}d ${cd.hours}h ${cd.minutes}m`}</span>
      </div>
    </div>
  )
}

function ShareCard({ data, tgeDate }, ref) {
  return (
    <div
      ref={ref}
      className="relative w-[1080px] h-[1350px] overflow-hidden rounded-[38px] border border-white/10"
      style={{ background: 'radial-gradient(900px 500px at 15% 10%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(700px 500px at 90% 80%, rgba(96,165,250,0.14), transparent 55%), #05070d' }}
    >
      <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="absolute top-10 left-10 right-10 flex items-start justify-between gap-6">
        <div>
          <div className="text-cyan-200 text-sm tracking-[0.24em] uppercase">TGE Time Capsule</div>
          <div className="text-white text-4xl font-semibold mt-2">Capsule Sealed</div>
          <div className="text-white/55 mt-2 text-lg">Locked until TGE</div>
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100 text-sm">{new Date(tgeDate).toLocaleDateString()}</div>
      </div>

      <div className="absolute left-0 right-0 top-[150px] flex justify-center scale-[1.28] origin-top">
        <CapsuleReferenceScene mode="closed" name={data.name} avatarPreview={data.avatarPreview} tgeDate={tgeDate} message={data.message} />
      </div>

      <div className="absolute left-10 right-10 bottom-10 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="grid grid-cols-[120px_1fr] gap-6 items-center">
          <div className="h-[120px] w-[120px] rounded-3xl border border-white/10 overflow-hidden bg-white/5">
            {data.avatarPreview ? <img src={data.avatarPreview} alt="avatar" className="h-full w-full object-cover" /> : <div className="h-full grid place-items-center text-white/30">No avatar</div>}
          </div>
          <div className="min-w-0">
            <div className="truncate text-white text-3xl font-semibold">{data.name || 'Your Name'}</div>
            <div className="text-cyan-100/80 mt-1">I sealed my message to the future before TGE.</div>
            <div className="text-white/50 mt-3 text-sm">Sealed on {data.sealedAt ? formatDate(data.sealedAt) : '—'} • Opens on TGE day</div>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70 mb-2">Message Preview</div>
          <p className="text-white/80 leading-relaxed text-lg" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {data.message?.trim() || 'A message to my future self and the community, sealed before TGE.'}
          </p>
        </div>
      </div>
    </div>
  )
}

const ForwardShareCard = React.forwardRef(ShareCard)

function saveLocalCapsule(record) {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  current.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 50)))
}

function loadLocalCapsules() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function StepPills({ step }) {
  const activeStates = {
    profile: ['1'],
    letter: ['1', '2'],
    sealing: ['1', '2', '3'],
    sealed: ['1', '2', '3'],
  }
  const active = new Set(activeStates[step] || [])
  const pills = [
    ['1', 'Identity'],
    ['2', 'Letter'],
    ['3', 'Sealed'],
  ]
  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      {pills.map(([n, label]) => (
        <div key={n} className={`rounded-xl border px-3 py-2 ${active.has(n) ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 bg-white/5 text-white/50'}`}>
          <span className="mr-2">{n}</span>{label}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [step, setStep] = useState('profile')
  const [name, setName] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')
  const [message, setMessage] = useState('')
  const [prediction, setPrediction] = useState('')
  const [goal, setGoal] = useState('')
  const [wish, setWish] = useState('')
  const [errors, setErrors] = useState({})
  const [sealingStatus, setSealingStatus] = useState('Preparing capsule...')
  const [sealedAt, setSealedAt] = useState('')
  const [saveState, setSaveState] = useState('idle')
  const [savedCapsules, setSavedCapsules] = useState([])
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)
  const shareRef = useRef(null)

  const countdown = useCountdown(TGE_DATE)

  useEffect(() => {
    setSavedCapsules(loadLocalCapsules())
  }, [])

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('')
      return
    }
    const url = URL.createObjectURL(avatarFile)
    setAvatarPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [avatarFile])

  useEffect(() => {
    if (step !== 'sealing') return

    const messages = ['Encrypting your message...', 'Locking capsule shell...', 'Syncing front display...', 'Final seal complete...']
    let idx = 0
    setSealingStatus(messages[idx])
    const statusTimer = setInterval(() => {
      idx = Math.min(idx + 1, messages.length - 1)
      setSealingStatus(messages[idx])
    }, 560)

    setSaveState('saving')
    const stamp = new Date().toISOString()
    setSealedAt(stamp)

    const record = {
      id: globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()),
      name: name.trim(),
      avatarPreview,
      message: message.trim(),
      prediction: prediction.trim(),
      goal: goal.trim(),
      wish: wish.trim(),
      status: 'sealed',
      sealedAt: stamp,
      tgeDate: TGE_DATE,
    }

    const saveTimer = setTimeout(() => {
      try {
        saveLocalCapsule(record)
        setSavedCapsules(loadLocalCapsules())
        setSaveState('saved')
      } catch (e) {
        console.error(e)
        setSaveState('error')
      }
    }, 650)

    const finishTimer = setTimeout(() => setStep('sealed'), 2100)

    return () => {
      clearInterval(statusTimer)
      clearTimeout(saveTimer)
      clearTimeout(finishTimer)
    }
  }, [step, name, avatarPreview, message, prediction, goal, wish])

  const draftData = { name, avatarPreview, message, prediction, goal, wish, sealedAt }

  function validateProfile() {
    const next = {}
    if (!name.trim()) next.name = 'Please enter your name or nickname.'
    if (!avatarFile) next.avatar = 'Please upload an avatar/photo.'
    setErrors((prev) => ({ ...prev, ...next }))
    return Object.keys(next).length === 0
  }

  function validateLetter() {
    const next = {}
    if (!message.trim()) next.message = 'Main message is required.'
    setErrors((prev) => ({ ...prev, ...next }))
    return Object.keys(next).length === 0
  }

  function onProfileContinue() {
    setErrors({})
    if (!validateProfile()) return
    setStep('letter')
  }

  function sealCapsule() {
    setErrors({})
    if (!validateProfile()) return setStep('profile')
    if (!validateLetter()) return
    setStep('sealing')
  }

  async function downloadShareImage() {
    if (!shareRef.current) return
    try {
      setExporting(true)
      const htmlToImage = await import('html-to-image')
      const dataUrl = await htmlToImage.toPng(shareRef.current, { cacheBust: true, pixelRatio: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `tge-capsule-${(name || 'user').replace(/\s+/g, '-').toLowerCase()}.png`
      a.click()
    } catch (e) {
      console.error(e)
      alert('Could not export image in this environment. Try in the deployed site.')
    } finally {
      setExporting(false)
    }
  }

  async function copyShareText() {
    try {
      await navigator.clipboard.writeText('I sealed my TGE Time Capsule ✨ Locked until TGE.')
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error(e)
    }
  }

  async function nativeShare() {
    const text = 'I sealed my TGE Time Capsule ✨ Locked until TGE. #TimeCapsule #TGE'
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TGE Time Capsule', text })
        return
      } catch {
        // user canceled
      }
    }
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  function resetFlow() {
    setStep('profile')
    setName('')
    setAvatarFile(null)
    setMessage('')
    setPrediction('')
    setGoal('')
    setWish('')
    setErrors({})
    setSealedAt('')
    setSaveState('idle')
  }

  const showCapsuleStage = step !== 'profile'

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden bg-[#05070d]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-[-5%] h-[460px] w-[460px] rounded-full bg-cyan-400/10 blur-[90px]" />
        <div className="absolute top-[20%] right-[-10%] h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[25%] h-[360px] w-[360px] rounded-full bg-cyan-300/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col xl:flex-row gap-6 xl:items-start xl:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Premium MVP • Frontend only (Supabase later)
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">TGE Time Capsule</h1>
            <p className="text-white/60 mt-3 max-w-2xl">
              Write a message to the future, seal it inside an electric capsule, and share your sealed capsule before TGE.
            </p>
          </div>

          <GlassCard className="p-4 min-w-[280px]">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Locked until TGE</div>
            <div className="mt-2 text-lg font-medium">{new Date(TGE_DATE).toLocaleString()}</div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                [countdown.days, 'Days'],
                [countdown.hours, 'Hours'],
                [countdown.minutes, 'Min'],
                [countdown.seconds, 'Sec'],
              ].map(([v, label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 py-2">
                  <div className="text-sm font-semibold">{String(v).padStart(2, '0')}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.14em]">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {!showCapsuleStage ? (
          <div className="max-w-3xl mx-auto space-y-4">
            <GlassCard className="p-5 sm:p-6">
              <SectionTitle
                eyebrow="Step 1"
                title="Create your capsule identity first"
                subtitle="Спочатку юзер вводить ім’я і аватар. Лише після цього показуємо капсулу з уже підставленими даними — як ти і хотів."
              />
              <div className="mt-6 space-y-5">
                <InputField
                  label="Name / Nickname"
                  value={name}
                  onChange={(v) => {
                    setErrors((p) => ({ ...p, name: undefined }))
                    setName(v)
                  }}
                  placeholder="e.g. Markiian Sora"
                  maxLength={28}
                  error={errors.name}
                />

                <AvatarUploader
                  avatarPreview={avatarPreview}
                  error={errors.avatar}
                  onFile={(file) => {
                    setErrors((p) => ({ ...p, avatar: undefined }))
                    if (!file) return setAvatarFile(null)
                    if (file.size > 5 * 1024 * 1024) {
                      return setErrors((p) => ({ ...p, avatar: 'Image is too large (max ~5MB).' }))
                    }
                    setAvatarFile(file)
                  }}
                />

                <div className="flex flex-wrap gap-3 pt-1">
                  <NeonButton onClick={onProfileContinue}>
                    Continue to Capsule <ArrowRight className="h-4 w-4" />
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
            <StepPills step={step} />
          </div>
        ) : (
          <div className="grid grid-cols-1 2xl:grid-cols-[1.02fr_0.98fr] gap-6 xl:gap-8 items-start">
            <GlassCard className="p-4 sm:p-6 min-w-0">
              <div className="flex items-center justify-between mb-4 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Capsule stage</div>
                  <div className="text-white/65 text-sm mt-1">
                    {step === 'letter' && 'Капсула вже бачить ім’я та аватар, бо вони введені на попередньому кроці.'}
                    {step === 'sealing' && 'Sealing in progress…'}
                    {step === 'sealed' && 'Capsule sealed successfully.'}
                  </div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">{step.toUpperCase()}</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-3 sm:p-4 min-h-[360px] grid place-items-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    {step === 'letter' && (
                      <CapsuleReferenceScene mode="open" name={name} avatarPreview={avatarPreview} tgeDate={TGE_DATE} message={message} />
                    )}
                    {step === 'sealing' && (
                      <div className="space-y-4">
                        <CapsuleReferenceScene mode="sealing" name={name} avatarPreview={avatarPreview} tgeDate={TGE_DATE} message={message} />
                        <div className="text-center text-cyan-100/85 text-sm">{sealingStatus}</div>
                      </div>
                    )}
                    {step === 'sealed' && (
                      <div className="space-y-4">
                        <CapsuleReferenceScene mode="closed" name={name} avatarPreview={avatarPreview} tgeDate={TGE_DATE} message={message} />
                        <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
                          <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">SEALED</span>
                          <span className="text-white/50">{sealedAt ? `Sealed at ${formatDate(sealedAt)}` : ''}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4"><StepPills step={step} /></div>
            </GlassCard>

            <div className="space-y-6 min-w-0">
              {step === 'letter' && (
                <GlassCard className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Step 2"
                    title="Write your message to the future"
                    subtitle="This will be stored now and revealed later. For now, only the sealed capsule is shown."
                  />

                  <div className="mt-6 space-y-4">
                    <TextAreaField
                      label="Main message (to community / future self)"
                      value={message}
                      onChange={(v) => {
                        setErrors((p) => ({ ...p, message: undefined }))
                        setMessage(v)
                      }}
                      placeholder="Write what you feel before TGE, what this moment means to you, or a message to your future self..."
                      maxLength={700}
                      rows={6}
                      required
                      error={errors.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TextAreaField label="Prediction" value={prediction} onChange={setPrediction} placeholder="Your prediction for TGE / project" maxLength={220} rows={3} />
                      <TextAreaField label="Goal after TGE" value={goal} onChange={setGoal} placeholder="Your goal for next season / next steps" maxLength={220} rows={3} />
                    </div>

                    <TextAreaField label="Wish to the project" value={wish} onChange={setWish} placeholder="A short wish to the team / project / community" maxLength={220} rows={3} />

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                      Once sealed, your capsule stays <span className="text-cyan-200">locked until TGE</span>. Reveal mode will be added later.
                    </div>

                    <div className="flex flex-wrap gap-3 pt-1">
                      <NeonButton variant="ghost" onClick={() => setStep('profile')}>Back</NeonButton>
                      <NeonButton onClick={sealCapsule}><Lock className="h-4 w-4" /> Seal Capsule</NeonButton>
                    </div>
                  </div>
                </GlassCard>
              )}

              {step === 'sealing' && (
                <GlassCard className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Sealing"
                    title="Your capsule is being sealed"
                    subtitle="Frontend MVP currently saves data locally. Supabase can be connected later without changing the UI/UX flow."
                  />
                  <div className="mt-6 grid gap-3">
                    {['Animation', 'Save letter', 'Finalize display'].map((label, i) => {
                      const active = i === 0 ? true : i === 1 ? saveState !== 'idle' : saveState === 'saved'
                      const status = i === 1 ? (saveState === 'error' ? 'Error' : saveState === 'saved' ? 'Saved' : 'Saving...') : active ? 'In progress' : 'Waiting'
                      return (
                        <div key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                          <span className="text-white/80">{label}</span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${active ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100' : 'border-white/10 text-white/40'}`}>{status}</span>
                        </div>
                      )
                    })}
                  </div>
                </GlassCard>
              )}

              {step === 'sealed' && (
                <>
                  <GlassCard className="p-5 sm:p-6">
                    <SectionTitle eyebrow="Step 3" title="Capsule sealed successfully" subtitle="Your letter is stored locally for now. Export the share image and post it in socials." />

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                        <div>
                          <div className="text-sm text-white/50">Status</div>
                          <div className="flex items-center gap-2 text-cyan-100"><Lock className="h-4 w-4" /> Locked until TGE</div>
                        </div>
                        <div>
                          <div className="text-sm text-white/50">Sealed at</div>
                          <div className="text-white/90">{sealedAt ? formatDate(sealedAt) : '—'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                        <NeonButton onClick={downloadShareImage} disabled={exporting} className="w-full"><Download className="h-4 w-4" /> {exporting ? 'Exporting...' : 'Download PNG'}</NeonButton>
                        <NeonButton variant="ghost" onClick={nativeShare} className="w-full"><Share2 className="h-4 w-4" /> Share</NeonButton>
                        <NeonButton variant="ghost" onClick={copyShareText} className="w-full">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy text'}</NeonButton>
                        <NeonButton variant="ghost" onClick={resetFlow} className="w-full"><RotateCcw className="h-4 w-4" /> New capsule</NeonButton>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 sm:p-6 overflow-hidden">
                    <SectionTitle eyebrow="Preview" title="Share image preview" subtitle="PNG export uses this layout. You can later brand it with your project logo and exact copy." />
                    <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-3 overflow-auto">
                      <div className="w-[1080px] h-[1350px] origin-top-left scale-[0.24] sm:scale-[0.31] lg:scale-[0.4]">
                        <ForwardShareCard ref={shareRef} data={draftData} tgeDate={TGE_DATE} />
                      </div>
                    </div>
                  </GlassCard>
                </>
              )}
            </div>
          </div>
        )}

        <div className="mt-8">
          <GlassCard className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <SectionTitle eyebrow="Optional demo" title="Locked Capsule Board" subtitle="Shows sealed capsules only (avatar + name + seal date). Letter content remains hidden until future reveal update." />
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">{savedCapsules.length} sealed capsule{savedCapsules.length === 1 ? '' : 's'}</div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCapsules.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-white/50">No capsules yet. Seal your first one above.</div>
              ) : (
                savedCapsules.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5">{c.avatarPreview ? <img src={c.avatarPreview} alt={c.name} className="h-full w-full object-cover" /> : null}</div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-white">{c.name}</div>
                        <div className="text-xs text-white/50 truncate">{formatDate(c.sealedAt)}</div>
                      </div>
                      <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-100">LOCKED</div>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/40">Message hidden until TGE reveal update.</div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  )
}
