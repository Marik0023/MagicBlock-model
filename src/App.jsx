import TopBar from "./components/TopBar";
import TabRail from "./components/TabRail";
import PreviewStage from "./components/PreviewStage";
import OptionPanel from "./components/OptionPanel";
import BottomActions from "./components/BottomActions";

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />

      <main className="builder-layout">
        <TabRail />
        <PreviewStage />
        <OptionPanel />
      </main>

      <BottomActions />

      <footer className="app-footer">
        <p>
          MVP starter • Frontend-only • Replace placeholder SVG art with your own assets later
        </p>
      </footer>
    </div>
  );
}
