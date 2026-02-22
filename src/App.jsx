
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Share2,
  Sparkles,
  Lock,
  ArrowRight,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";

const TGE_DATE = "2026-12-31T12:00:00Z"; // replace later or wire to Supabase config
const STORAGE_KEY = "tge_time_capsule_local_demo";

function formatDate(ts) {
  return new Date(ts).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function countdownParts(targetIso) {
  const diff = new Date(targetIso).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
  const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((clamped / (1000 * 60)) % 60);
  const seconds = Math.floor((clamped / 1000) % 60);
  return { diff, days, hours, minutes, seconds };
}

function useCountdown(targetIso) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => countdownParts(targetIso), [tick, targetIso]);
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <div className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">{eyebrow}</div>
      ) : null}
      <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">{title}</h2>
      {subtitle ? <p className="text-sm md:text-base text-white/60 max-w-xl">{subtitle}</p> : null}
    </div>
  );
}

function NeonButton({ children, className = "", variant = "primary", ...props }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "ghost"
      ? "border border-white/10 bg-white/5 text-white hover:bg-white/10"
      : "border border-cyan-300/30 bg-cyan-400/15 text-cyan-100 shadow-[0_0_30px_rgba(56,189,248,0.15)] hover:bg-cyan-400/20";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function InputField({ label, value, onChange, placeholder, maxLength = 40 }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-white/80">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 500,
  rows = 4,
  required = false,
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-white/80">
          {label}
          {required ? <span className="text-cyan-300"> *</span> : null}
        </span>
        <span className="text-xs text-white/40">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-cyan-300/40 focus:ring-2 focus:ring-cyan-300/20"
      />
    </label>
  );
}

function AvatarUploader({ avatarPreview, onFile, error }) {
  const fileRef = useRef(null);
  return (
    <div className="space-y-3">
      <div className="text-sm text-white/80">Avatar</div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => fileRef.current?.click()}
          className="relative h-28 w-28 rounded-3xl overflow-hidden border border-white/10 bg-white/5 grid place-items-center shadow-[0_0_30px_rgba(56,189,248,0.08)]"
        >
          {avatarPreview ? (
            <>
              <img src={avatarPreview} alt="avatar preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 ring-2 ring-cyan-300/40 rounded-3xl" />
            </>
          ) : (
            <div className="text-white/40 text-center px-2">
              <Upload className="mx-auto mb-2 h-5 w-5" />
              <div className="text-xs">Upload photo</div>
            </div>
          )}
        </motion.button>

        <div className="space-y-2 text-sm text-white/60">
          <p>Square photo works best. PNG/JPG up to ~5MB.</p>
          <div className="flex gap-2 flex-wrap">
            <NeonButton type="button" variant="ghost" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" /> Choose avatar
            </NeonButton>
            {avatarPreview ? (
              <NeonButton type="button" variant="ghost" onClick={() => onFile(null)}>
                <RotateCcw className="h-4 w-4" /> Remove
              </NeonButton>
            ) : null}
          </div>
          {error ? <p className="text-rose-300 text-xs">{error}</p> : null}
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onFile(e.target.files?.[0] || null)}
      />
    </div>
  );
}

function CapsuleScene({
  mode = "open", // open | sealing | closed
  avatarPreview,
  name,
  tgeDate,
  small = false,
  showLetterSheet = true,
  paperText = "",
}) {
  const countdown = useCountdown(tgeDate);
  const compact = small;

  const boxW = compact ? 340 : 520;
  const boxH = compact ? 230 : 330;
  const lidClosedY = compact ? 16 : 22;
  const lidOpenY = compact ? -82 : -120;
  const lidOpenRotate = compact ? -18 : -20;

  const isClosed = mode === "closed";
  const isSealing = mode === "sealing";

  return (
    <div className="relative mx-auto" style={{ width: boxW, height: boxH }}>
      {/* ambient glow */}
      <motion.div
        className="absolute inset-x-[12%] bottom-2 h-8 rounded-full blur-2xl"
        style={{ background: "rgba(56,189,248,0.24)" }}
        animate={
          isSealing ? { opacity: [0.25, 0.95, 0.35], scaleX: [0.95, 1.08, 1] } : { opacity: 0.25, scaleX: 1 }
        }
        transition={isSealing ? { duration: 1.2, repeat: Infinity } : { duration: 0.35 }}
      />

      {/* base capsule */}
      <div
        className="absolute inset-x-0 bottom-0 mx-auto"
        style={{ width: compact ? 320 : 500, height: compact ? 140 : 205 }}
      >
        <div className="absolute inset-0 rounded-[32px] border border-white/15 bg-gradient-to-b from-white/85 to-white/65 shadow-[0_22px_50px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.7),transparent_40%),radial-gradient(circle_at_70%_120%,rgba(56,189,248,0.13),transparent_55%)]" />

          {/* neon trims */}
          <div className="absolute left-3 right-3 top-3 h-2 rounded-full bg-cyan-300/35 blur-sm" />
          <div className="absolute left-6 bottom-5 h-2 w-10 rounded-full bg-cyan-300/70 shadow-[0_0_20px_rgba(56,189,248,0.65)]" />
          <div className="absolute right-6 bottom-5 h-2 w-16 rounded-full bg-cyan-300/60 shadow-[0_0_20px_rgba(56,189,248,0.55)]" />
          <div className="absolute left-4 top-12 h-7 w-1 rounded-full bg-cyan-300/70" />
          <div className="absolute right-4 top-12 h-7 w-1 rounded-full bg-cyan-300/70" />

          {/* left icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 grid place-items-center h-14 w-14 rounded-2xl border border-cyan-300/20 bg-white/30 backdrop-blur-sm">
            <div className="text-2xl">✦</div>
          </div>

          {/* right icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 grid place-items-center h-14 w-14 rounded-2xl border border-cyan-300/20 bg-white/30 backdrop-blur-sm">
            <div className="text-2xl">⌁</div>
          </div>

          {/* display panel */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[58%] h-[58%] rounded-[26px] border border-white/15 bg-[#0a1730]/85 shadow-[inset_0_0_40px_rgba(56,189,248,0.08),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md p-2">
            <div className="flex h-full gap-2 items-center">
              <div className="h-full aspect-square rounded-2xl border border-cyan-300/25 bg-[#08101d] grid place-items-center overflow-hidden relative">
                <motion.div
                  animate={isClosed || isSealing ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-2 rounded-xl border border-dashed border-cyan-300/25"
                />
                {avatarPreview && (isClosed || isSealing) ? (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: mode === "closed" ? 0.18 : 0 }}
                    src={avatarPreview}
                    alt="avatar"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-[10px] text-cyan-200/60">AVATAR</div>
                )}
              </div>
              <div className="min-w-0 flex-1 h-full rounded-2xl border border-cyan-300/20 bg-gradient-to-b from-cyan-300/8 to-cyan-400/5 px-3 py-2 flex flex-col justify-center">
                <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/60">Capsule</div>
                <motion.div
                  key={`${mode}-${name}`}
                  initial={{ opacity: 0.65 }}
                  animate={{ opacity: 1 }}
                  className="truncate text-white text-sm md:text-base font-medium"
                >
                  {name?.trim() ? name : "Your Name"}
                </motion.div>
                <div className="mt-1 text-[10px] md:text-xs text-cyan-200/70 truncate">
                  {isClosed || isSealing ? "Locked until TGE" : "Ready to seal"}
                </div>
              </div>
            </div>
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-[26px]"
              style={{ boxShadow: "inset 0 0 0 1px rgba(56,189,248,0.14), inset 0 0 30px rgba(56,189,248,0.08)" }}
              animate={isSealing ? { opacity: [0.4, 1, 0.5] } : { opacity: 0.65 }}
              transition={isSealing ? { duration: 0.9, repeat: Infinity } : { duration: 0.3 }}
            />
          </div>

          {/* bottom status strip */}
          <div className="absolute left-1/2 bottom-2 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-[#07111d]/70 px-3 py-1 text-[10px] text-cyan-200/70 flex items-center gap-2">
            <Lock className="h-3 w-3" />
            <span>
              {isClosed
                ? `Opens on ${new Date(tgeDate).toLocaleDateString()}`
                : `TGE in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}
            </span>
          </div>
        </div>
      </div>

      {/* inner chamber for letter */}
      <AnimatePresence>
        {!isClosed && showLetterSheet && (
          <motion.div
            key="paper"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={
              isSealing
                ? { opacity: [1, 1, 0], y: [0, 10, 34], scale: [1, 0.98, 0.92] }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={isSealing ? { duration: 0.8, ease: "easeInOut" } : { duration: 0.35 }}
            className="absolute left-1/2 bottom-[104px] -translate-x-1/2 w-[68%] rounded-2xl border border-cyan-300/15 bg-gradient-to-b from-[#0b1526]/95 to-[#070d18]/95 px-4 py-3 shadow-[0_0_40px_rgba(56,189,248,0.12)]"
          >
            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/60 mb-2">Letter</div>
            <div className="text-white/80 text-xs leading-relaxed line-clamp-3">
              {paperText?.trim() ||
                "Write your message to the future, your prediction, and your goal before sealing the capsule."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* lid */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 origin-bottom"
        style={{ width: compact ? 320 : 500, height: compact ? 122 : 175, top: lidOpenY }}
        animate={
          mode === "open"
            ? { y: 0, rotateX: lidOpenRotate, opacity: 1 }
            : mode === "sealing"
              ? { y: [0, 20, lidClosedY - lidOpenY], rotateX: [lidOpenRotate, -8, 0], opacity: 1 }
              : { y: lidClosedY - lidOpenY, rotateX: 0, opacity: 1 }
        }
        transition={
          mode === "sealing"
            ? { duration: 1.15, ease: [0.2, 0.9, 0.2, 1] }
            : { duration: 0.45, ease: "easeOut" }
        }
      >
        <div className="relative h-full w-full rounded-[34px] border border-white/15 bg-gradient-to-b from-white/90 to-white/65 shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.8),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(56,189,248,0.12),transparent_55%)]" />
          <div className="absolute inset-[8px] rounded-[28px] border border-cyan-300/20 bg-gradient-to-b from-[#081423] to-[#07101d] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_90%_70%,rgba(56,189,248,0.1),transparent_45%)]" />
            <div className="absolute left-4 right-4 top-3 h-[2px] rounded-full bg-cyan-300/50 shadow-[0_0_12px_rgba(56,189,248,0.55)]" />
            <div className="absolute left-3 bottom-3 h-2 w-8 rounded-full bg-cyan-300/80 shadow-[0_0_14px_rgba(56,189,248,0.75)]" />
            <div className="absolute right-4 top-5 h-2 w-2 rounded-full bg-cyan-300/90 shadow-[0_0_14px_rgba(56,189,248,0.75)]" />
            <div className="absolute left-[36%] top-2 h-5 w-[28%] rounded-xl border border-cyan-300/25 bg-cyan-300/10 shadow-[0_0_18px_rgba(56,189,248,0.18)]" />
          </div>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={
              isSealing
                ? {
                    boxShadow: [
                      "inset 0 0 0 rgba(56,189,248,0)",
                      "inset 0 0 70px rgba(56,189,248,0.18)",
                      "inset 0 0 20px rgba(56,189,248,0.08)",
                    ],
                  }
                : { boxShadow: "inset 0 0 20px rgba(56,189,248,0.06)" }
            }
            transition={isSealing ? { duration: 1.1, repeat: Infinity } : { duration: 0.35 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ShareCard({ data, tgeDate }, ref) {
  const sealedAt = data.sealedAt || new Date().toISOString();
  return (
    <div
      ref={ref}
      className="relative w-[1080px] h-[1350px] overflow-hidden rounded-[38px] border border-white/10"
      style={{
        background:
          "radial-gradient(900px 500px at 15% 10%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(700px 500px at 90% 80%, rgba(96,165,250,0.14), transparent 55%), #05070d",
      }}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute top-10 left-10 right-10 flex items-center justify-between">
        <div>
          <div className="text-cyan-300 text-sm tracking-[0.24em] uppercase">TGE Time Capsule</div>
          <div className="text-white text-4xl font-semibold mt-2">Capsule Sealed</div>
        </div>
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100 text-sm">
          Locked until TGE
        </div>
      </div>

      <div className="absolute left-0 right-0 top-[160px] flex justify-center scale-[1.45] origin-top">
        <CapsuleScene
          mode="closed"
          avatarPreview={data.avatarPreview}
          name={data.name}
          tgeDate={tgeDate}
          small={false}
          showLetterSheet={false}
          paperText={data.message}
        />
      </div>

      <div className="absolute left-10 right-10 bottom-10 rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="grid grid-cols-[120px_1fr] gap-6 items-center">
          <div className="h-[120px] w-[120px] rounded-3xl border border-white/10 overflow-hidden bg-white/5">
            {data.avatarPreview ? (
              <img src={data.avatarPreview} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full grid place-items-center text-white/30">No avatar</div>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-white text-3xl font-semibold truncate">{data.name || "Your Name"}</div>
            <div className="text-cyan-200/80 mt-1">I sealed my message to the future before TGE.</div>
            <div className="text-white/50 mt-3 text-sm">Sealed on {formatDate(sealedAt)} • Opens on TGE day</div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70 mb-2">Message Preview</div>
          <p className="text-white/80 leading-relaxed text-lg line-clamp-4">
            {data.message?.trim() || "A message to my future self and the community, sealed before TGE."}
          </p>
        </div>
      </div>
    </div>
  );
}
const ForwardShareCard = React.forwardRef(ShareCard);

function saveLocalCapsule(record) {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  current.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, 50)));
}

function loadLocalCapsules() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const [step, setStep] = useState("profile"); // profile | letter | sealing | sealed
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");
  const [prediction, setPrediction] = useState("");
  const [goal, setGoal] = useState("");
  const [wish, setWish] = useState("");
  const [errors, setErrors] = useState({});
  const [sealingStatus, setSealingStatus] = useState("Preparing capsule...");
  const [sealedAt, setSealedAt] = useState("");
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [savedCapsules, setSavedCapsules] = useState([]);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const shareRef = useRef(null);

  const tgeCountdown = useCountdown(TGE_DATE);

  useEffect(() => {
    setSavedCapsules(loadLocalCapsules());
  }, []);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview("");
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    if (step !== "sealing") return;
    const stages = [
      "Encrypting your message...",
      "Locking capsule shell...",
      "Syncing display panel...",
      "Final seal complete...",
    ];
    let i = 0;
    setSealingStatus(stages[0]);
    const statusTimer = setInterval(() => {
      i = Math.min(i + 1, stages.length - 1);
      setSealingStatus(stages[i]);
    }, 550);

    setSaveState("saving");
    const sealTimestamp = new Date().toISOString();
    setSealedAt(sealTimestamp);

    const record = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      avatarPreview,
      message: message.trim(),
      prediction: prediction.trim(),
      goal: goal.trim(),
      wish: wish.trim(),
      status: "sealed",
      sealedAt: sealTimestamp,
      tgeDate: TGE_DATE,
    };

    const saveTimer = setTimeout(() => {
      try {
        saveLocalCapsule(record);
        setSavedCapsules(loadLocalCapsules());
        setSaveState("saved");
      } catch (e) {
        console.error(e);
        setSaveState("error");
      }
    }, 650);

    const transitionTimer = setTimeout(() => {
      setStep("sealed");
    }, 2200);

    return () => {
      clearInterval(statusTimer);
      clearTimeout(saveTimer);
      clearTimeout(transitionTimer);
    };
  }, [step, name, avatarPreview, message, prediction, goal, wish]);

  const draftData = {
    name,
    avatarPreview,
    message,
    prediction,
    goal,
    wish,
    sealedAt,
  };

  function validateProfile() {
    const next = {};
    if (!name.trim()) next.name = "Please enter your name or nickname.";
    if (!avatarFile) next.avatar = "Please upload an avatar/photo.";
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  function validateLetter() {
    const next = {};
    if (!message.trim()) next.message = "Main message is required.";
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  function goToLetter() {
    setErrors({});
    if (!validateProfile()) return;
    setStep("letter");
  }

  function sealCapsule() {
    setErrors({});
    if (!validateProfile()) {
      setStep("profile");
      return;
    }
    if (!validateLetter()) return;
    setStep("sealing");
  }

  async function downloadShareImage() {
    if (!shareRef.current) return;
    try {
      setExporting(true);
      const htmlToImage = await import("html-to-image");
      const dataUrl = await htmlToImage.toPng(shareRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `tge-capsule-${(name || "user").replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("Could not export image in this environment. Try again in browser build.");
    } finally {
      setExporting(false);
    }
  }

  async function nativeShare() {
    const shareText = `I sealed my TGE Time Capsule ✨\nLocked until TGE.\n#TimeCapsule #TGE`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "TGE Time Capsule",
          text: shareText,
        });
        return;
      } catch {
        // user canceled
      }
    }
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function copyShareText() {
    const txt = `I sealed my TGE Time Capsule ✨ Locked until TGE.`;
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      console.error(e);
    }
  }

  function resetFlow() {
    setStep("profile");
    setName("");
    setAvatarFile(null);
    setMessage("");
    setPrediction("");
    setGoal("");
    setWish("");
    setErrors({});
    setSealedAt("");
    setSaveState("idle");
  }

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: "#05070d" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-[-5%] h-[460px] w-[460px] rounded-full bg-cyan-400/10 blur-[90px]" />
        <div className="absolute top-[25%] right-[-10%] h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[25%] h-[360px] w-[360px] rounded-full bg-cyan-300/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-200 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Premium MVP • Frontend only (Supabase later)
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">TGE Time Capsule</h1>
            <p className="text-white/60 mt-3 max-w-2xl">
              Write a message to the future, seal it inside an electric capsule, and share your sealed capsule before
              TGE.
            </p>
          </div>

          <GlassCard className="p-4 min-w-[280px]">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Locked until TGE</div>
            <div className="mt-2 text-lg font-medium">{new Date(TGE_DATE).toLocaleString()}</div>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[
                [tgeCountdown.days, "Days"],
                [tgeCountdown.hours, "Hours"],
                [tgeCountdown.minutes, "Min"],
                [tgeCountdown.seconds, "Sec"],
              ].map(([v, label]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 py-2">
                  <div className="text-sm font-semibold">{String(v).padStart(2, "0")}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.14em]">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_1.2fr] gap-6 xl:gap-8 items-start">
          {/* Left: Visual Stage */}
          <GlassCard className="p-4 sm:p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Capsule stage</div>
                <div className="text-white/70 text-sm mt-1">
                  {step === "profile" && "Set your identity to activate the capsule display."}
                  {step === "letter" && "Write your message before sealing the capsule."}
                  {step === "sealing" && "Sealing in progress…"}
                  {step === "sealed" && "Capsule sealed successfully."}
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {step.toUpperCase()}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-3 sm:p-4 min-h-[380px] grid place-items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28 }}
                  className="w-full"
                >
                  {(step === "profile" || step === "letter") && (
                    <CapsuleScene mode="open" avatarPreview={avatarPreview} name={name} tgeDate={TGE_DATE} paperText={message} />
                  )}
                  {step === "sealing" && (
                    <div className="space-y-4">
                      <CapsuleScene
                        mode="sealing"
                        avatarPreview={avatarPreview}
                        name={name}
                        tgeDate={TGE_DATE}
                        paperText={message}
                      />
                      <div className="text-center text-cyan-200/80 text-sm">{sealingStatus}</div>
                    </div>
                  )}
                  {step === "sealed" && (
                    <div className="space-y-4">
                      <CapsuleScene
                        mode="closed"
                        avatarPreview={avatarPreview}
                        name={name}
                        tgeDate={TGE_DATE}
                        showLetterSheet={false}
                        paperText={message}
                      />
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">
                          SEALED
                        </span>
                        <span className="text-white/50">{sealedAt ? `Sealed at ${formatDate(sealedAt)}` : ""}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              {[
                ["1", "Identity", step === "profile"],
                ["2", "Letter", step === "letter"],
                ["3", "Sealed", step === "sealing" || step === "sealed"],
              ].map(([n, label, active]) => (
                <div
                  key={label}
                  className={`rounded-xl border px-3 py-2 ${
                    active
                      ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/5 text-white/50"
                  }`}
                >
                  <span className="mr-2">{n}</span>
                  {label}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Right: Form / Result */}
          <div className="space-y-6">
            {step === "profile" && (
              <GlassCard className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Step 1"
                  title="Create your capsule identity"
                  subtitle="Enter your name and upload the avatar that will appear on the capsule display after sealing."
                />
                <div className="mt-6 space-y-5">
                  <InputField
                    label="Name / Nickname"
                    value={name}
                    onChange={setName}
                    placeholder="e.g. Markiian Sora"
                    maxLength={28}
                  />
                  {errors.name ? <p className="text-xs text-rose-300 -mt-3">{errors.name}</p> : null}

                  <AvatarUploader
                    avatarPreview={avatarPreview}
                    error={errors.avatar}
                    onFile={(file) => {
                      setErrors((prev) => ({ ...prev, avatar: undefined }));
                      if (!file) {
                        setAvatarFile(null);
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setErrors((prev) => ({ ...prev, avatar: "Image is too large (max ~5MB)." }));
                        return;
                      }
                      setAvatarFile(file);
                    }}
                  />

                  <div className="pt-2 flex flex-wrap gap-3">
                    <NeonButton onClick={goToLetter}>
                      Continue <ArrowRight className="h-4 w-4" />
                    </NeonButton>
                  </div>
                </div>
              </GlassCard>
            )}

            {step === "letter" && (
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
                      setErrors((prev) => ({ ...prev, message: undefined }));
                      setMessage(v);
                    }}
                    placeholder="Write what you feel before TGE, what this moment means to you, or a message to your future self..."
                    maxLength={700}
                    rows={6}
                    required
                  />
                  {errors.message ? <p className="text-xs text-rose-300 -mt-2">{errors.message}</p> : null}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextAreaField
                      label="Prediction"
                      value={prediction}
                      onChange={setPrediction}
                      placeholder="Your prediction for TGE / project"
                      maxLength={220}
                      rows={3}
                    />
                    <TextAreaField
                      label="Goal after TGE"
                      value={goal}
                      onChange={setGoal}
                      placeholder="Your goal for next season / next steps"
                      maxLength={220}
                      rows={3}
                    />
                  </div>

                  <TextAreaField
                    label="Wish to the project"
                    value={wish}
                    onChange={setWish}
                    placeholder="A short wish to the team / project / community"
                    maxLength={220}
                    rows={3}
                  />

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                    Once sealed, your capsule stays <span className="text-cyan-200">locked until TGE</span>. Reveal
                    mode will be added later.
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <NeonButton variant="ghost" onClick={() => setStep("profile")}>
                      Back
                    </NeonButton>
                    <NeonButton onClick={sealCapsule}>
                      <Lock className="h-4 w-4" /> Seal Capsule
                    </NeonButton>
                  </div>
                </div>
              </GlassCard>
            )}

            {step === "sealing" && (
              <GlassCard className="p-5 sm:p-6">
                <SectionTitle
                  eyebrow="Sealing"
                  title="Your capsule is being sealed"
                  subtitle="Frontend MVP currently saves data locally. Supabase can be connected later without changing the UI/UX flow."
                />
                <div className="mt-6 grid gap-3">
                  {["Animation", "Save letter", "Finalize display"].map((label, idx) => {
                    const active = idx === 0 ? true : idx === 1 ? saveState !== "idle" : saveState === "saved";
                    return (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <span className="text-white/80">{label}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            active
                              ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                              : "border-white/10 text-white/40"
                          }`}
                        >
                          {idx === 1
                            ? saveState === "error"
                              ? "Error"
                              : saveState === "saved"
                                ? "Saved"
                                : "Saving..."
                            : active
                              ? "In progress"
                              : "Waiting"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {step === "sealed" && (
              <>
                <GlassCard className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Step 3"
                    title="Capsule sealed successfully"
                    subtitle="Your letter is stored (locally for now). You can export a share image and post it in your socials."
                  />

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-white/50">Status</div>
                        <div className="flex items-center gap-2 text-cyan-100">
                          <Lock className="h-4 w-4" /> Locked until TGE
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-white/50">Sealed at</div>
                        <div className="text-white/90">{sealedAt ? formatDate(sealedAt) : "—"}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <NeonButton onClick={downloadShareImage} disabled={exporting} className="w-full">
                        <Download className="h-4 w-4" /> {exporting ? "Exporting..." : "Download PNG"}
                      </NeonButton>
                      <NeonButton variant="ghost" onClick={nativeShare} className="w-full">
                        <Share2 className="h-4 w-4" /> Share
                      </NeonButton>
                      <NeonButton variant="ghost" onClick={copyShareText} className="w-full">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy text"}
                      </NeonButton>
                      <NeonButton variant="ghost" onClick={resetFlow} className="w-full">
                        <RotateCcw className="h-4 w-4" /> New capsule
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 sm:p-6">
                  <SectionTitle
                    eyebrow="Preview"
                    title="Share image preview"
                    subtitle="This is the card used for PNG export. In production, you can brand it with your project logo and exact copy."
                  />
                  <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-3 overflow-auto">
                    <div className="origin-top-left scale-[0.28] sm:scale-[0.36] md:scale-[0.44] lg:scale-[0.52] w-[1080px] h-[1350px]">
                      <ForwardShareCard data={draftData} tgeDate={TGE_DATE} />
                    </div>
                  </div>
                </GlassCard>
              </>
            )}
          </div>
        </div>

        {/* Local locked capsules board */}
        <div className="mt-8">
          <GlassCard className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <SectionTitle
                eyebrow="Optional demo"
                title="Locked Capsule Board"
                subtitle="Shows sealed capsules only (avatar + name + seal date). Letter content remains hidden until future reveal update."
              />
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                {savedCapsules.length} sealed capsule{savedCapsules.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCapsules.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/3 p-8 text-center text-white/50">
                  No capsules yet. Seal your first one above.
                </div>
              ) : (
                savedCapsules.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        {c.avatarPreview ? (
                          <img src={c.avatarPreview} alt={c.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-white">{c.name}</div>
                        <div className="text-xs text-white/50 truncate">{formatDate(c.sealedAt)}</div>
                      </div>
                      <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[10px] text-cyan-100">
                        LOCKED
                      </div>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/40">
                      Message hidden until TGE reveal update.
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* hidden export node must stay in DOM */}
        <div className="fixed -left-[99999px] top-0 opacity-0 pointer-events-none">
          <ForwardShareCard ref={shareRef} data={draftData} tgeDate={TGE_DATE} />
        </div>
      </main>
    </div>
  );
}
