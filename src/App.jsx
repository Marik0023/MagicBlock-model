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


function Capsule({ profile, sealed, compact = false, name, avatarPreview, phase }) {
  const normalizedProfile = profile || { nickname: name || "pilot", avatar: avatarPreview || null };
  const isSealed = typeof sealed === "boolean" ? sealed : phase !== "open";
  const lidState = isSealed
    ? { y: -10, rotate: 0, scaleX: 1.0, opacity: 1 }
    : { y: -92, rotate: -3, scaleX: 1.03, opacity: 1 };

  const scanState = isSealed
    ? { x: ["0%", "100%", "0%"], opacity: [0.25, 0.55, 0.25] }
    : { x: ["0%", "120%", "0%"], opacity: [0.4, 0.9, 0.4] };

  return (
    <div className={cn("relative w-full", compact ? "max-w-[640px]" : "max-w-[900px]")}> 
      <div className={cn("relative mx-auto", compact ? "h-[310px]" : "h-[560px]")} style={{ perspective: 1400 }}>
        {/* Ambient glow / shadows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[72%] h-24 w-[72%] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute left-1/2 top-[76%] h-14 w-[54%] -translate-x-1/2 rounded-full bg-blue-500/20 blur-2xl" />
          <div className="absolute inset-x-[9%] bottom-[8%] h-[36%] rounded-[26px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(17,31,45,.75),rgba(4,10,18,.4))] shadow-[inset_0_1px_0_rgba(255,255,255,.06)]" />
          <div className="absolute inset-x-[10%] bottom-[9%] h-[34%] rounded-[24px] opacity-40" style={{
            backgroundImage:
              "linear-gradient(rgba(91,233,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(91,233,255,.06) 1px, transparent 1px)",
            backgroundSize: compact ? "14px 14px" : "22px 22px",
          }} />
          {[...Array(compact ? 8 : 14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-cyan-300"
              style={{
                width: i % 3 === 0 ? 6 : 3,
                height: i % 3 === 0 ? 6 : 3,
                left: `${8 + (i * 7) % 84}%`,
                top: `${14 + ((i * 9) % 44)}%`,
                opacity: 0.35,
                filter: "blur(.2px)",
              }}
              animate={{ y: [0, -8, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}
        </div>

        {/* Main 3D stage */}
        <div
          className={cn(
            "absolute left-1/2 top-[54%] -translate-x-1/2",
            compact ? "w-[520px] h-[210px]" : "w-[760px] h-[300px]"
          )}
          style={{ transformStyle: "preserve-3d", transform: "translateX(-50%) rotateX(8deg) rotateY(-6deg)" }}
        >
          {/* Floor reflection */}
          <div className="pointer-events-none absolute inset-x-[9%] -bottom-5 h-12 rounded-full bg-black/60 blur-2xl" />
          <div className="pointer-events-none absolute inset-x-[16%] -bottom-2 h-6 rounded-full bg-cyan-400/15 blur-xl" />

          {/* Back chassis plate */}
          <div
            className="absolute inset-[6%] rounded-[28px] border border-cyan-200/12 bg-[linear-gradient(160deg,rgba(10,29,46,.92),rgba(6,13,20,.85)_48%,rgba(7,23,38,.88))]"
            style={{ transform: compact ? "translateZ(-12px)" : "translateZ(-18px)" }}
          >
            <div className="absolute inset-0 rounded-[28px] opacity-45" style={{
              backgroundImage:
                "radial-gradient(circle at 12% 18%, rgba(92,239,255,.18), transparent 34%), radial-gradient(circle at 85% 78%, rgba(64,170,255,.14), transparent 40%)",
            }} />
            <div className="absolute inset-2 rounded-[24px] border border-white/5" />
          </div>

          {/* Base capsule body */}
          <div
            className="absolute inset-x-[8%] bottom-[4%] h-[62%]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* depth layers */}
            <div className="absolute inset-0 rounded-[28px] bg-[#a8bac8]/90 shadow-[0_28px_60px_rgba(0,0,0,.45),inset_0_2px_0_rgba(255,255,255,.55)]" style={{ transform: "translateZ(-8px)" }} />
            <div className="absolute inset-x-1 inset-y-1 rounded-[26px] border border-cyan-100/30 bg-[linear-gradient(180deg,#eef4f8,#d6e2ea_48%,#c8d5df)] shadow-[inset_0_1px_0_rgba(255,255,255,.75),inset_0_-12px_20px_rgba(125,155,184,.15)]" style={{ transform: "translateZ(0px)" }}>
              <div className="absolute inset-0 rounded-[26px] opacity-40" style={{
                backgroundImage:
                  "radial-gradient(circle at 18% 18%, rgba(120,230,255,.22), transparent 34%), radial-gradient(circle at 86% 84%, rgba(91,198,255,.18), transparent 36%), linear-gradient(115deg, rgba(255,255,255,.18), transparent 38%)",
              }} />
            </div>

            {/* top ridge */}
            <div className="absolute left-[6%] right-[6%] top-[12%] h-[8%] rounded-full border border-cyan-200/30 bg-cyan-50/45 shadow-[inset_0_1px_0_rgba(255,255,255,.85)]" style={{ transform: "translateZ(6px)" }} />

            {/* side rails */}
            {["left", "right"].map((side) => (
              <div key={side} className={cn("absolute top-[24%] bottom-[18%] w-[3.1%] rounded-full bg-cyan-200/30", side === "left" ? "left-[2.8%]" : "right-[2.8%]")} style={{ transform: "translateZ(8px)" }}>
                <div className="absolute inset-0 rounded-full border border-cyan-300/40" />
                <div className="absolute inset-[20%] rounded-full bg-cyan-300/65 blur-[1px]" />
              </div>
            ))}

            {/* mini bumpers */}
            <div className="absolute bottom-[9%] left-[6%] h-[4.5%] w-[8%] rounded-full bg-cyan-300/70 blur-[.3px]" style={{ transform: "translateZ(10px)" }} />
            <div className="absolute bottom-[9%] right-[6%] h-[4.5%] w-[10%] rounded-full bg-cyan-300/70 blur-[.3px]" style={{ transform: "translateZ(10px)" }} />

            {/* stickers / decals with logos */}
            <motion.div className="absolute left-[2.7%] top-[13%] h-[12%] w-[11%] rounded-[12px] border border-black/10 bg-white/88 shadow-md" style={{ transform: "translateZ(12px) rotate(-7deg)" }} whileHover={{ rotate: -5 }}>
              <div className="absolute inset-[6%] rounded-[10px] border border-slate-300/60 bg-white/90" />
              {logoSrc ? <img src={logoSrc} alt="MB sticker" className="absolute left-[8%] top-[16%] h-[56%] w-auto object-contain" /> : null}
              <span className="absolute right-[8%] top-[33%] text-[0.52rem] font-black tracking-[0.22em] text-slate-700">MB</span>
            </motion.div>

            <motion.div className="absolute right-[2.8%] top-[13%] h-[12%] w-[11%] rounded-[12px] border border-black/10 bg-white/90 shadow-md" style={{ transform: "translateZ(12px) rotate(6deg)" }} whileHover={{ rotate: 4 }}>
              <div className="absolute inset-[6%] rounded-[10px] border border-slate-300/60 bg-white/90" />
              {logoSrc ? <img src={logoSrc} alt="TGE sticker" className="absolute left-[8%] top-[16%] h-[56%] w-auto object-contain opacity-90" /> : null}
              <span className="absolute right-[8%] top-[33%] text-[0.5rem] font-black tracking-[0.22em] text-slate-700">TGE</span>
            </motion.div>

            <motion.div className="absolute right-[10%] bottom-[7.5%] h-[11%] w-[19%] rounded-[12px] border border-black/10 bg-white/88 shadow-md" style={{ transform: "translateZ(12px) rotate(-8deg)" }} whileHover={{ rotate: -6 }}>
              <div className="absolute inset-[6%] rounded-[10px] border border-slate-300/60 bg-white/90" />
              {logoSrc ? <img src={logoSrc} alt="sealed sticker" className="absolute left-[8%] top-[18%] h-[50%] w-auto object-contain opacity-70" /> : null}
              <span className="absolute right-[8%] top-[31%] text-[0.5rem] font-black tracking-[0.24em] text-slate-700">SEALED DROP</span>
            </motion.div>

            {/* left command button */}
            <div className="absolute left-[4.2%] top-[40%] h-[22%] w-[8.8%] rounded-[18px] border border-slate-200/80 bg-[linear-gradient(180deg,#f7fbff,#dbe6ee)] shadow-[inset_0_1px_0_rgba(255,255,255,.9)]" style={{ transform: "translateZ(9px)" }}>
              <div className="absolute inset-[8%] rounded-[14px] border border-black/5 bg-white/30" />
              <div className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/40" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.9rem] text-slate-500">✧</div>
            </div>

            {/* right command button */}
            <div className="absolute right-[4.2%] top-[40%] h-[22%] w-[8.8%] rounded-[18px] border border-slate-200/80 bg-[linear-gradient(180deg,#f7fbff,#dbe6ee)] shadow-[inset_0_1px_0_rgba(255,255,255,.9)]" style={{ transform: "translateZ(9px)" }}>
              <div className="absolute inset-[8%] rounded-[14px] border border-black/5 bg-white/30" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.82rem] font-black tracking-[0.2em] text-slate-500">↯</div>
            </div>

            {/* avatar cartridge */}
            <div className="absolute left-[14%] top-[24%] h-[54%] w-[18%] rounded-[20px] border border-cyan-300/25 bg-[linear-gradient(180deg,rgba(20,37,52,.96),rgba(7,14,22,.98))] shadow-[inset_0_2px_0_rgba(255,255,255,.06),0_10px_24px_rgba(0,0,0,.18)]" style={{ transform: "translateZ(16px)" }}>
              <div className="absolute inset-[5%] rounded-[16px] border border-cyan-200/15" />
              <div className="absolute inset-[10%] rounded-[14px] border border-cyan-300/30 bg-black/40 overflow-hidden">
                {normalizedProfile.avatar ? (
                  <img src={normalizedProfile.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(83,220,255,.25),transparent_40%),#07111c]">
                    <User className="h-10 w-10 text-cyan-100/70" />
                  </div>
                )}
                <div className="absolute inset-0 opacity-25" style={{
                  backgroundImage:
                    "linear-gradient(rgba(82,234,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(82,234,255,.12) 1px, transparent 1px)",
                  backgroundSize: compact ? "12px 12px" : "18px 18px",
                }} />
                <motion.div
                  className="absolute left-0 right-0 h-3 bg-cyan-300/35 blur-[2px]"
                  animate={{ top: ["8%", "84%", "8%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <div className="absolute inset-x-[9%] bottom-[8%] h-[5%] rounded-full bg-cyan-300/70 blur-[.4px]" />
            </div>

            {/* central info core */}
            <div className="absolute left-[34%] right-[14%] top-[24%] bottom-[24%] rounded-[22px] border border-cyan-300/25 bg-[linear-gradient(180deg,#d7e4ee,#c4d2dd)] shadow-[inset_0_1px_0_rgba(255,255,255,.8),inset_0_-8px_14px_rgba(94,120,145,.14)]" style={{ transform: "translateZ(14px)" }}>
              <div className="absolute inset-[2px] rounded-[20px] border border-white/40" />
              <div className="absolute inset-0 rounded-[22px] opacity-40" style={{
                backgroundImage:
                  "linear-gradient(130deg, rgba(255,255,255,.25), transparent 30%, rgba(91,224,255,.12) 65%, transparent 85%)",
              }} />
              <div className="absolute left-[5%] top-[18%] text-[0.55rem] font-semibold tracking-[0.28em] text-slate-400">CAPSULE ID</div>
              <div className={cn("absolute left-[5%] top-[38%] text-slate-700 font-bold truncate", compact ? "max-w-[72%] text-lg" : "max-w-[75%] text-3xl")}>{normalizedProfile.nickname || "pilot"}</div>
              <div className="absolute left-[5%] right-[5%] bottom-[18%] h-[20%] rounded-full border border-white/70 bg-[linear-gradient(180deg,#c7d3de,#b8c6d3)] shadow-[inset_0_1px_0_rgba(255,255,255,.75)]">
                <motion.div
                  className="absolute inset-y-[18%] left-[1%] rounded-full bg-[linear-gradient(90deg,rgba(68,231,255,.22),rgba(68,231,255,.55),rgba(110,160,255,.28))]"
                  initial={false}
                  animate={{ width: isSealed ? "98%" : "32%" }}
                  transition={{ type: "spring", stiffness: 110, damping: 18 }}
                />
                <div className="absolute inset-0 grid place-items-center text-[0.55rem] font-black tracking-[0.28em] text-slate-500">
                  {isSealed ? "SEALED • QUANTUM LOCK" : "READY TO SEAL"}
                </div>
              </div>
            </div>

            {/* bottom timer badge */}
            <div className="absolute left-1/2 bottom-[3.5%] -translate-x-1/2 rounded-full border border-white/15 bg-[#24313f]/92 px-4 py-2 text-[0.68rem] font-semibold tracking-wide text-cyan-100 shadow-[0_8px_18px_rgba(0,0,0,.28)]" style={{ transform: "translateX(-50%) translateZ(18px)" }}>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-cyan-200" />
                {formatTimeUntilTGE(TGE_DATE)}
              </span>
            </div>
          </div>

          {/* Floating top lid / clamp assembly */}
          <motion.div
            className="absolute left-[47%] top-[2%] z-20 h-[28%] w-[55%]"
            style={{ transformStyle: "preserve-3d", transformOrigin: "22% 82%" }}
            initial={false}
            animate={lidState}
            transition={{ type: "spring", stiffness: 110, damping: 16 }}
          >
            <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(-6deg) rotateY(-6deg)" }}>
              {/* underside depth */}
              <div className="absolute inset-x-[4%] top-[26%] h-[62%] rounded-[22px] bg-[#0d1f33] shadow-[0_14px_30px_rgba(0,0,0,.45)]" style={{ transform: "translateZ(-10px) skewX(-16deg)" }} />
              {/* lid frame */}
              <div className="absolute inset-0 rounded-[24px] border border-cyan-50/45 bg-[linear-gradient(180deg,#f4fbff,#d7e7f3)] shadow-[inset_0_1px_0_rgba(255,255,255,.95),0_20px_40px_rgba(0,0,0,.32)]" style={{ clipPath: "polygon(4% 8%, 98% 8%, 90% 92%, 0% 92%)", transform: "translateZ(8px)" }}>
                <div className="absolute inset-[3px] rounded-[22px] border border-cyan-100/60 bg-[linear-gradient(160deg,#0f3960,#0d2744_42%,#10375c)]" style={{ clipPath: "polygon(4% 8%, 98% 8%, 90% 92%, 0% 92%)" }}>
                  <div className="absolute inset-0 opacity-70" style={{
                    backgroundImage:
                      "linear-gradient(110deg, rgba(255,255,255,.18), transparent 28%, rgba(112,208,255,.12) 52%, transparent 74%), radial-gradient(circle at 8% 92%, rgba(76,232,255,.35), transparent 24%)",
                  }} />
                  <div className="absolute left-[7%] top-[58%] h-[7%] w-[11%] rounded-full bg-cyan-300/95 blur-[.2px] shadow-[0_0_14px_rgba(88,235,255,.45)]" />
                  <div className="absolute right-[4.5%] top-[14%] h-[4.6%] w-[3.2%] rounded-full bg-cyan-200/90 blur-[.2px] shadow-[0_0_12px_rgba(88,235,255,.45)]" />

                  {/* status display strip */}
                  <div className="absolute left-[16%] right-[16%] top-[50%] h-[23%] rounded-[12px] border border-cyan-200/20 bg-black/28">
                    <div className="absolute inset-[1px] rounded-[10px] border border-white/5" />
                    <div className="absolute left-[4%] top-[18%] text-[0.42rem] font-black tracking-[0.36em] text-cyan-100/70">STATUS DISPLAY</div>
                    <div className="absolute left-[4%] bottom-[16%] text-[0.72rem] font-black tracking-[0.24em] text-cyan-50">
                      {isSealed ? "CAPSULE SEALED" : "CAPSULE OPEN"}
                    </div>
                    <motion.div
                      className="absolute top-[8%] bottom-[8%] w-[18%] rounded-[10px] bg-[linear-gradient(90deg,transparent,rgba(133,225,255,.25),transparent)]"
                      animate={scanState}
                      transition={{ duration: isSealed ? 3.4 : 2.2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>

                  <div className="absolute left-[7%] top-[14%] flex items-center gap-1 rounded-full border border-cyan-200/20 bg-white/10 px-2 py-1 text-[0.42rem] font-black tracking-[0.32em] text-cyan-100/70">
                    <div className="h-2 w-3 rounded-[2px] border border-white/30 bg-white/20" />
                    STATUS
                  </div>
                </div>
              </div>

              {/* front edge thickness */}
              <div className="absolute left-[2%] right-[6%] top-[76%] h-[12%] rounded-full border border-cyan-100/25 bg-[linear-gradient(180deg,rgba(213,234,246,.95),rgba(159,181,198,.95))] shadow-[0_6px_16px_rgba(0,0,0,.22)]" style={{ transform: "translateZ(4px) skewX(-18deg)" }} />
            </div>
          </motion.div>

          {/* Energy seals / lock beam */}
          <div className="pointer-events-none absolute inset-0 z-10">
            <motion.div
              className="absolute left-[35%] right-[14%] top-[63%] h-[2px] bg-gradient-to-r from-transparent via-cyan-300/90 to-transparent blur-[.2px]"
              animate={{ opacity: isSealed ? [0.4, 0.95, 0.4] : [0.2, 0.55, 0.2] }}
              transition={{ duration: isSealed ? 1.4 : 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-cyan-300/25"
                style={{
                  left: compact ? "28%" : "30%",
                  right: compact ? "20%" : "18%",
                  top: compact ? "50%" : "52%",
                  height: compact ? 52 + i * 10 : 70 + i * 16,
                }}
                animate={{ opacity: isSealed ? [0.12, 0.3, 0.12] : [0.05, 0.18, 0.05], scale: [1, 1.02, 1] }}
                transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
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
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_.9fr] gap-6 items-start">
            <Glass className="p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Capsule Stage</div>
                  <p className="mt-1 text-sm text-white/55">Тепер капсула вже має твоє імʼя та аватар. Напиши лист справа і закрий її.</p>
                </div>
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">LETTER</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/20 p-4 min-h-[520px] xl:min-h-[560px] flex items-center justify-center overflow-hidden">
                <Capsule name={name} avatarPreview={avatarPreview} phase={phase} />
              </div>

              <div className="mt-4"><StepPills step={2} /></div>
            </Glass>

            <Glass className="p-5 md:p-6 xl:sticky xl:top-4">
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
            <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_.95fr] gap-6 items-start">
              <Glass className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[.22em] text-cyan-200/80">Capsule Stage</div>
                    <p className="mt-1 text-sm text-white/55">Футуристична електро-капсула закрита. На дисплеї надруковано “LOCKED UNTIL TGE”.</p>
                  </div>
                  <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">SEALED</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 min-h-[520px] xl:min-h-[560px] flex items-center justify-center overflow-hidden">
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
