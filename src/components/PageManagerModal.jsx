import { useState } from "react";

export default function PageManagerModal({ open, state, dispatch, onClose, onConfirm, onToast }) {
  const [newPageName, setNewPageName] = useState("");
  const [copyFrom, setCopyFrom] = useState("");

  if (!open) return null;

  const handleAddPage = () => {
    const name = newPageName.trim();
    if (!name) {
      onToast("Enter a page path or name first.");
      return;
    }
    dispatch({ type: "ADD_PAGE", name, sourcePageId: copyFrom || null });
    setNewPageName("");
    setCopyFrom("");
  };

  const handleDelete = async (pid, name) => {
    if (state.pageOrder.length <= 1) {
      onToast("You need at least one page.");
      return;
    }
    const ok = await onConfirm("Delete page?", `Delete "${name}" and its checklist progress? This cannot be undone.`);
    if (!ok) return;
    dispatch({ type: "DELETE_PAGE", pageId: pid });
  };

  const handleDuplicate = (pid, name) => {
    dispatch({ type: "DUPLICATE_PAGE", pageId: pid });
    onToast(`Duplicated "${name}" — checklist copied.`);
  };

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>Manage Pages</h2>
        <div style={{ marginBottom: 14 }}>
          {state.pageOrder.map((pid) => {
            const page = state.pages[pid];
            if (!page) return null;
            return (
              <div className="page-manage-row" key={pid}>
                <input
                  type="text"
                  defaultValue={page.name}
                  onBlur={(e) => dispatch({ type: "RENAME_PAGE", pageId: pid, name: e.target.value })}
                />
                <button className="btn-secondary small-btn" onClick={() => handleDuplicate(pid, page.name)}>
                  Duplicate
                </button>
                <button className="btn-secondary small-btn danger" onClick={() => handleDelete(pid, page.name)}>
                  Delete
                </button>
              </div>
            );
          })}
        </div>
        <div className="project-row" style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="/new-page-path"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddPage(); }}
          />
          <select className="copy-select" value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)}>
            <option value="">Start blank</option>
            {state.pageOrder.map((pid) => {
              const page = state.pages[pid];
              if (!page) return null;
              return (
                <option key={pid} value={pid}>
                  Copy from: {page.name}
                </option>
              );
            })}
          </select>
          <button className="btn-primary" onClick={handleAddPage}>Add Page</button>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
