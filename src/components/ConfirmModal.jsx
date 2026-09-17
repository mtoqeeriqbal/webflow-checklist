export default function ConfirmModal({ dialog, onRespond }) {
  if (!dialog) return null;
  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onRespond(false); }}>
      <div className="modal" style={{ maxWidth: 400 }}>
        <h2 style={{ fontSize: "1.1rem", marginTop: 0 }}>{dialog.title}</h2>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 18 }}>{dialog.message}</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={() => onRespond(true)}>Confirm</button>
          <button className="btn-secondary" onClick={() => onRespond(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
