import { CATALOG, TAB_GROUPS } from "../data/catalog";
import { readPath, useBuilderStore } from "../store/builderStore";

function Swatch({ item }) {
  if (item.color) return <span className="swatch" style={{ background: item.color }} />;
  if (item.colors) {
    return (
      <span
        className="swatch swatch-gradient"
        style={{ background: `linear-gradient(135deg, ${item.colors.join(", ")})` }}
      />
    );
  }
  if (item.swatch) return <span className="swatch" style={{ background: item.swatch }} />;
  return <span className="swatch swatch-empty">•</span>;
}

function OptionGrid({ path, optionsKey }) {
  const preset = useBuilderStore((s) => s.preset);
  const setValue = useBuilderStore((s) => s.setValue);
  const selected = readPath(preset, path);
  const items = CATALOG[optionsKey];

  return (
    <div className="option-grid">
      {items.map((item) => {
        const isActive = selected === item.id;
        return (
          <button
            key={String(item.id)}
            type="button"
            className={`option-card ${isActive ? "is-active" : ""}`}
            onClick={() => setValue(path, item.id)}
            title={item.name}
          >
            <Swatch item={item} />
            <span className="option-label">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function BoxTextEditor() {
  const box = useBuilderStore((s) => s.preset.box);
  const setBoxText = useBuilderStore((s) => s.setBoxText);

  return (
    <div className="box-text-editor">
      <label>
        Box title
        <input
          value={box.title}
          maxLength={16}
          onChange={(e) => setBoxText("title", e.target.value.toUpperCase())}
          placeholder="MARKO"
        />
      </label>
      <label>
        Subtitle
        <input
          value={box.subtitle}
          maxLength={30}
          onChange={(e) => setBoxText("subtitle", e.target.value)}
          placeholder="Custom Figure"
        />
      </label>
      <p className="helper-text">Tip: later you can replace preview art with PNG/SVG layer assets.</p>
    </div>
  );
}

export default function OptionPanel() {
  const activeTab = useBuilderStore((s) => s.activeTab);
  const tab = TAB_GROUPS.find((t) => t.id === activeTab) ?? TAB_GROUPS[0];

  return (
    <section className="option-panel">
      <div className="panel-header">
        <h2>{tab.label}</h2>
        <p>Pick an option for this layer</p>
      </div>

      {tab.kind === "boxText" ? (
        <BoxTextEditor />
      ) : (
        <OptionGrid path={tab.path} optionsKey={tab.optionsKey} />
      )}
    </section>
  );
}
