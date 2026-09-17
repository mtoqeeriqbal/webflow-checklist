import { useState } from "react";
import Header from "./components/Header";
import SummaryBar from "./components/SummaryBar";
import CategoryList from "./components/CategoryList";
import ActionBar from "./components/ActionBar";
import ReportModal from "./components/ReportModal";
import PageManagerModal from "./components/PageManagerModal";
import ConfirmModal from "./components/ConfirmModal";
import ImportModal from "./components/ImportModal";
import ChecklistSetupModal from "./components/ChecklistSetupModal";
import Toast from "./components/Toast";
import { useAuditState } from "./hooks/useAuditState";
import { useToast } from "./hooks/useToast";
import { useConfirm } from "./hooks/useConfirm";
import { getPage } from "./state/auditState";
import { buildReport, buildSiteReport, safeFilenamePart, saveTextFile, downloadBlob } from "./utils/reportBuilder";
import { pdfFromReportText } from "./utils/pdfExport";
import { exportToXlsxBlob } from "./utils/xlsxExport";

export default function App() {
  const [state, dispatch] = useAuditState();
  const { message: toastMessage, visible: toastVisible, showToast } = useToast();
  const { dialog: confirmDialog, requestConfirm, respond: respondConfirm } = useConfirm();

  const [pageManagerOpen, setPageManagerOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [checklistSetupOpen, setChecklistSetupOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportKind, setReportKind] = useState("page"); // "page" | "site"
  const [reportText, setReportText] = useState("");

  const activePage = getPage(state);

  const handleReset = async () => {
    const ok = await requestConfirm("Reset page?", `Reset all checked/N/A items for "${activePage.name}"? This cannot be undone.`);
    if (ok) dispatch({ type: "RESET_PAGE" });
  };

  const openPageReport = () => {
    setReportKind("page");
    setReportText(buildReport(state));
    setReportOpen(true);
  };

  const openSiteReport = () => {
    setReportKind("site");
    setReportText(buildSiteReport(state));
    setReportOpen(true);
  };

  const reportTitle = reportKind === "site" ? "Full Site Audit Report" : `Audit Report — ${activePage.name}`;

  const currentSuffix = () =>
    reportKind === "site" ? "full_site" : safeFilenamePart(activePage.name || "page");

  const handleDownloadMd = () => {
    const project = safeFilenamePart(state.project) || "project";
    saveTextFile(`site_audit_${project}_${currentSuffix()}.md`, reportText);
    showToast("Report downloaded.");
  };

  const handleDownloadPdf = () => {
    const project = safeFilenamePart(state.project) || "project";
    try {
      const blob = pdfFromReportText(reportText);
      downloadBlob(`site_audit_${project}_${currentSuffix()}.pdf`, blob);
      showToast("PDF downloaded.");
    } catch (e) {
      showToast("Could not build the PDF in this browser.");
    }
  };

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      showToast("Copied to clipboard.");
    } catch (e) {
      showToast("Could not copy. Select the text manually.");
    }
  };

  const handleExportXlsx = () => {
    try {
      const blob = exportToXlsxBlob(state);
      const project = safeFilenamePart(state.project) || "export";
      downloadBlob(`site_audit_${project}.xlsx`, blob);
      showToast("Spreadsheet downloading…");
    } catch (e) {
      showToast("Could not build the spreadsheet in this browser.");
    }
  };

  return (
    <div className="wrap">
      <Header
        state={state}
        dispatch={dispatch}
        onManagePages={() => setPageManagerOpen(true)}
        onReset={handleReset}
      />
      <SummaryBar state={state} />
      <CategoryList state={state} dispatch={dispatch} />
      <ActionBar
        dispatch={dispatch}
        onGenerateReport={openPageReport}
        onGenerateSiteReport={openSiteReport}
        onImport={() => setImportOpen(true)}
        onExportXlsx={handleExportXlsx}
        onChecklistSetup={() => setChecklistSetupOpen(true)}
      />

      <ReportModal
        open={reportOpen}
        title={reportTitle}
        reportText={reportText}
        onClose={() => setReportOpen(false)}
        onDownloadMd={handleDownloadMd}
        onDownloadPdf={handleDownloadPdf}
        onCopy={handleCopyReport}
      />

      <PageManagerModal
        open={pageManagerOpen}
        state={state}
        dispatch={dispatch}
        onClose={() => setPageManagerOpen(false)}
        onConfirm={requestConfirm}
        onToast={showToast}
      />

      <ImportModal
        open={importOpen}
        state={state}
        dispatch={dispatch}
        onClose={() => setImportOpen(false)}
        onConfirm={requestConfirm}
        onToast={showToast}
      />

      <ChecklistSetupModal
        open={checklistSetupOpen}
        state={state}
        dispatch={dispatch}
        onClose={() => setChecklistSetupOpen(false)}
      />

      <ConfirmModal dialog={confirmDialog} onRespond={respondConfirm} />

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
