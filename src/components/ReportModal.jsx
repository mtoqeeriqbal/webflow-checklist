export default function ReportModal({ open, title, reportText, onClose, onDownloadMd, onDownloadPdf, onCopy }) {
  if (!open) return null;
  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>{title}</h2>
        <div className="report-pre">{reportText}</div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onDownloadMd}>Download .md</button>
          <button className="btn-primary" onClick={onDownloadPdf}>Download PDF</button>
          <button className="btn-secondary" onClick={onCopy}>Copy to Clipboard</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
