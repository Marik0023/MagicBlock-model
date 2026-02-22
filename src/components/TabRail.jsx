import { TAB_GROUPS } from "../data/catalog";
import { useBuilderStore } from "../store/builderStore";

export default function TabRail() {
  const activeTab = useBuilderStore((s) => s.activeTab);
  const setActiveTab = useBuilderStore((s) => s.setActiveTab);

  return (
    <aside className="tab-rail" aria-label="Builder categories">
      {TAB_GROUPS.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? "is-active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </aside>
  );
}
