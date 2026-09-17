import { applicableTotal, checkedCount, getActiveItems, getPage } from "../state/auditState";

export default function SummaryBar({ state }) {
  const page = getPage(state);
  const total = applicableTotal(state);
  const done = checkedCount(state);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const activeItems = getActiveItems(state);
  const highOpen = activeItems.filter(
    (it) => it.priority === "High" && !page.checked[it.id] && !page.na[it.id]
  ).length;
  const naCount = activeItems.filter((it) => page.na[it.id]).length;

  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="num">{done}/{total}</div>
        <div className="lbl">Checked (this page)</div>
      </div>
      <div className="summary-card">
        <div className="num">{pct}%</div>
        <div className="lbl">Complete</div>
      </div>
      <div className="summary-card">
        <div className="num" style={{ color: highOpen ? "var(--high)" : "var(--pass)" }}>{highOpen}</div>
        <div className="lbl">High Priority Open</div>
      </div>
      <div className="summary-card">
        <div className="num" style={{ color: "var(--text-muted)" }}>{naCount}</div>
        <div className="lbl">Marked N/A</div>
      </div>
    </div>
  );
}
