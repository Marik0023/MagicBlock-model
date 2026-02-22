export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-badge" aria-hidden="true">◇</div>
        <div>
          <p className="brand-title">Figure Builder MVP</p>
          <p className="brand-subtitle">Frontend-only • Original placeholder style</p>
        </div>
      </div>

      <div className="topbar-pill">
        <span className="dot" />
        Auto-save enabled
      </div>
    </header>
  );
}
