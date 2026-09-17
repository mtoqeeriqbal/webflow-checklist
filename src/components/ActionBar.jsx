import { DATA } from "../data/checklistData";

export default function ActionBar({
  dispatch,
  onGenerateReport,
  onGenerateSiteReport,
  onImport,
  onExportXlsx,
  onChecklistSetup,
}) {
  return (
    <div className="actions">
      <button className="btn-primary" onClick={onGenerateReport}>Generate Page Report</button>
      <button className="btn-primary" onClick={onGenerateSiteReport}>Generate Full Site Report</button>
      <button className="btn-secondary" onClick={onChecklistSetup}>Checklist Setup</button>
      <button className="btn-secondary" onClick={onImport}>Import Report</button>
      <button className="btn-secondary" onClick={onExportXlsx}>Export to Spreadsheet</button>
      <button
        className="btn-secondary"
        onClick={() => dispatch({ type: "SET_ALL_COLLAPSED", catIds: DATA.map((c) => c.id), value: false })}
      >
        Expand All
      </button>
      <button
        className="btn-secondary"
        onClick={() => dispatch({ type: "SET_ALL_COLLAPSED", catIds: DATA.map((c) => c.id), value: true })}
      >
        Collapse All
      </button>
    </div>
  );
}
