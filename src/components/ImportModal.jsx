import { useRef, useState } from "react";
import { parseImportedReport } from "../utils/importParser";

export default function ImportModal({ open, state, dispatch, onClose, onConfirm, onToast }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleClose = () => {
    setText("");
    setParsed(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(reader.result);
    reader.onerror = () => onToast("Could not read that file.");
    reader.readAsText(file);
  };

  const handlePreview = () => {
    if (!text.trim()) {
      onToast("Paste or upload a report first.");
      return;
    }
    setParsed(parseImportedReport(text));
  };

  const handleApply = async () => {
    if (!parsed || !parsed.pages.length) return;
    const ok = await onConfirm("Apply import?", `This will overwrite checklist state for ${parsed.pages.length} matching page(s).`);
    if (!ok) return;
    dispatch({ type: "IMPORT_PAGES", pages: parsed.pages, project: parsed.project });
    onToast(`Imported ${parsed.pages.length} page(s).`);
    handleClose();
  };

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
      <div className="modal">
        <h2>Import Report</h2>
        <p className="sub" style={{ marginTop: 0 }}>
          Paste the contents of a previously exported .md report, or upload the file. Only pages found in the file
          will be updated — other pages are left as-is.
        </p>
        <div className="file-input-row">
          <input ref={fileInputRef} type="file" accept=".md,.txt,text/markdown,text/plain" onChange={handleFile} />
        </div>
        <textarea
          className="import-textarea"
          placeholder="Paste report content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {parsed && (
          <div className="import-preview" style={{ display: "block" }}>
            {!parsed.pages.length ? (
              <strong>No recognizable pages found.</strong>
            ) : (
              <>
                <strong>Found {parsed.pages.length} page(s):</strong>
                <ul style={{ margin: "6px 0 0 18px", padding: 0 }}>
                  {parsed.pages.map((p) => {
                    const exists = state.pageOrder.some(
                      (pid) => state.pages[pid].name.trim().toLowerCase() === p.name.trim().toLowerCase()
                    );
                    return (
                      <li key={p.name}>
                        {p.name} — {p.checkedIds.length} passed, {p.naIds.length} N/A
                        {p.unmatchedCount ? `, ${p.unmatchedCount} unmatched` : ""}{" "}
                        <em>{exists ? "(will overwrite existing page)" : "(will create new page)"}</em>
                      </li>
                    );
                  })}
                </ul>
                {parsed.project && (
                  <div style={{ marginTop: 8 }}>
                    Project name in file: <strong>{parsed.project}</strong>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-primary" onClick={handlePreview}>Preview Import</button>
          {parsed && parsed.pages.length > 0 && (
            <button className="btn-primary" onClick={handleApply}>Apply Import</button>
          )}
          <button className="btn-secondary" onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
