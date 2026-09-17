import { DATA } from "../data/checklistData";
import { applicableTotal, checkedCount, getPage } from "../state/auditState";

export default function SummaryBar({ state }) {
  const page = getPage(state);
  const total = applicableTotal(state);
  const done = checkedCount(state);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const highOpen = DATA.flatMap((c) => c.items).filter(
    (it) => it.priority === "High" && !page.checked[it.id] && !page.na[it.id]
  ).length;
  const naCount = Object.values(page.na).filter(Boolean).length;

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
