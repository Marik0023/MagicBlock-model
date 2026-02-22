import { useRef, useState } from "react";
import { useBuilderStore } from "../store/builderStore";
import { exportSvgNodeToPng } from "../utils/exportPng";
import { downloadPresetJson, readPresetFile } from "../utils/presetIO";

export default function BottomActions() {
  const preset = useBuilderStore((s) => s.preset);
  const resetPreset = useBuilderStore((s) => s.resetPreset);
  const randomizePreset = useBuilderStore((s) => s.randomizePreset);
  const loadPreset = useBuilderStore((s) => s.loadPreset);
  const fileInputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const withBusy = async (fn) => {
    try {
      setBusy(true);
      await fn();
    } catch (error) {
      alert(error?.message || "Action failed.");
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  const onDownload = (mode) =>
    withBusy(async () => {
      const svg = document.getElementById("builder-export-svg");
      const filename = mode === "transparent" ? "figure-transparent.png" : "figure-scene.png";
      await exportSvgNodeToPng(svg, filename, mode);
    });

  const onSavePreset = () => downloadPresetJson(preset);

  const onLoadPresetClick = () => fileInputRef.current?.click();

  const onLoadPresetChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await withBusy(async () => {
      const parsed = await readPresetFile(file);
      const ok = loadPreset(parsed);
      if (!ok) throw new Error("Failed to load preset.");
    });
    e.target.value = "";
  };

  return (
    <section className="bottom-actions">
      <div className="action-group">
        <button type="button" className="btn ghost" onClick={resetPreset} disabled={busy}>
          Reset
        </button>
        <button type="button" className="btn ghost" onClick={randomizePreset} disabled={busy}>
          Randomize
        </button>
      </div>

      <div className="action-group">
        <button type="button" className="btn" onClick={onSavePreset} disabled={busy}>
          Save Preset (.json)
        </button>
        <button type="button" className="btn" onClick={onLoadPresetClick} disabled={busy}>
          Load Preset
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={onLoadPresetChange}
        />
      </div>

      <div className="action-group">
        <button type="button" className="btn primary" onClick={() => onDownload("full")} disabled={busy}>
          Download PNG
        </button>
        <button type="button" className="btn primary-alt" onClick={() => onDownload("transparent")} disabled={busy}>
          PNG Transparent
        </button>
      </div>
    </section>
  );
}
