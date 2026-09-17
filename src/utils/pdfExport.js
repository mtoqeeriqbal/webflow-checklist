import { jsPDF } from "jspdf";

export function pdfFromReportText(text) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginLeft = 40;
  const marginTop = 50;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const usableWidth = pageWidth - marginLeft * 2;
  let y = marginTop;

  const lines = text.split("\n");
  lines.forEach((rawLine) => {
    const line = rawLine.replace(/\s*<!--id:[^>]+-->\s*/g, "").replace(/\s+$/, "");
    let fontSize = 10;
    let fontStyle = "normal";
    let text2 = line;
    let extraGapBefore = 0;

    if (/^# /.test(line)) {
      fontSize = 18; fontStyle = "bold"; text2 = line.replace(/^# /, ""); extraGapBefore = 10;
    } else if (/^## /.test(line)) {
      fontSize = 14; fontStyle = "bold"; text2 = line.replace(/^## /, ""); extraGapBefore = 8;
    } else if (/^### /.test(line)) {
      fontSize = 12; fontStyle = "bold"; text2 = line.replace(/^### /, ""); extraGapBefore = 6;
    } else if (/^\*\*(.+)\*\*$/.test(line.trim())) {
      fontStyle = "bold"; text2 = line.trim().replace(/^\*\*|\*\*$/g, "");
    } else if (line.trim() === "---") {
      text2 = ""; extraGapBefore = 4;
    } else {
      text2 = line.replace(/^\*\*(.+?)\*\*/, "$1").replace(/\*\*/g, "").replace(/_/g, "");
    }

    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    y += extraGapBefore;

    if (text2 === "") {
      y += fontSize * 0.6;
      return;
    }

    const wrapped = doc.splitTextToSize(text2, usableWidth);
    wrapped.forEach((w) => {
      if (y > pageHeight - 50) {
        doc.addPage();
        y = marginTop;
      }
      doc.text(w, marginLeft, y);
      y += fontSize * 1.35;
    });
  });

  return doc.output("blob");
}
