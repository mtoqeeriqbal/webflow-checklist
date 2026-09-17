import * as XLSX from "xlsx";
import { getActiveCategories, getActiveCategoryItems } from "../state/auditState";

const COL_HEADER_BG = "FF1F2937";
const COL_HEADER_FG = "FFFFFFFF";
const COL_CAT_FILLS = ["FF2563EB", "FF7C3AED", "FF059669", "FFD97706", "FF0891B2"];
const COL_PASS_BG = "FFD1FAE5";
const COL_PASS_FG = "FF065F46";
const COL_FAIL_BG = "FFFEE2E2";
const COL_FAIL_FG = "FF991B1B";
const COL_NA_BG = "FFF3F4F6";
const COL_NA_FG = "FF6B7280";
const COL_OPEN_BG = "FFFEF3C7";
const COL_OPEN_FG = "FF92400E";
const COL_HIDDEN_BG = "FFE5E7EB";
const COL_HIDDEN_FG = "FF9CA3AF";
const COL_SUMMARY_BG = "FFEFF6FF";
const COL_TITLE_BG = "FF111827";
const COL_TITLE_FG = "FFFFFFFF";

function cellStyle(fgColor, bgColor, bold = false, wrapText = true, hAlign = "center") {
  return {
    font: { name: "Arial", sz: 9, color: { rgb: fgColor }, bold },
    fill: { patternType: "solid", fgColor: { rgb: bgColor } },
    alignment: { horizontal: hAlign, vertical: "center", wrapText },
    border: {
      top: { style: "thin", color: { rgb: "FFD1D5DB" } },
      bottom: { style: "thin", color: { rgb: "FFD1D5DB" } },
      left: { style: "thin", color: { rgb: "FFD1D5DB" } },
      right: { style: "thin", color: { rgb: "FFD1D5DB" } },
    },
  };
}

// The checklist scope (which categories/tiers are enabled) is project-wide, so it's
// safe to build one shared set of columns for every page. Whether an individual item
// is hidden "from report" is a per-page choice, so that's handled per-cell instead.
function activeData(state) {
  return getActiveCategories(state).map((cat) => ({ ...cat, items: getActiveCategoryItems(state, cat) }));
}

export function buildAuditWorkbook(state) {
  const project = state.project || "Audit";
  const wb = XLSX.utils.book_new();
  const scopedData = activeData(state);
  const allItems = scopedData.flatMap((cat) => cat.items.map((item) => ({ cat, item })));
  const totalCols = 3 + allItems.length + 4;

  // ── Sheet 1: Full Checklist Matrix ──
  const wsData = [];
  const wsMerges = [];
  const wsCellStyles = {};
  const setStyle = (r, c, style) => { wsCellStyles[`${r},${c}`] = style; };

  const titleRow = new Array(totalCols).fill(null);
  titleRow[0] = `${project} — Audit`;
  wsData.push(titleRow);
  wsMerges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } });
  for (let c = 0; c < totalCols; c++) {
    setStyle(0, c, cellStyle(COL_TITLE_FG, COL_TITLE_BG, true, false, c === 0 ? "left" : "center"));
  }

  const catGroupRow = new Array(totalCols).fill(null);
  catGroupRow[0] = ""; catGroupRow[1] = ""; catGroupRow[2] = "";
  let colCursor = 3;
  scopedData.forEach((cat, ci) => {
    if (!cat.items.length) return;
    catGroupRow[colCursor] = cat.name;
    wsMerges.push({ s: { r: 1, c: colCursor }, e: { r: 1, c: colCursor + cat.items.length - 1 } });
    for (let c = colCursor; c < colCursor + cat.items.length; c++) {
      setStyle(1, c, cellStyle(COL_HEADER_FG, COL_CAT_FILLS[ci % COL_CAT_FILLS.length], true, false));
    }
    colCursor += cat.items.length;
  });
  catGroupRow[colCursor] = "Summary";
  wsMerges.push({ s: { r: 1, c: colCursor }, e: { r: 1, c: totalCols - 1 } });
  for (let c = colCursor; c < totalCols; c++) {
    setStyle(1, c, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false));
  }
  setStyle(1, 0, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false));
  setStyle(1, 1, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false));
  setStyle(1, 2, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false));
  wsData.push(catGroupRow);

  const headerRow = ["#", "Page / URL", "Audit Date"];
  allItems.forEach(({ item }) => {
    headerRow.push(item.text.length > 42 ? item.text.slice(0, 40) + "…" : item.text);
  });
  headerRow.push("✓ Checked", "~ N/A", "Applicable", "% Complete");
  wsData.push(headerRow);
  for (let c = 0; c < totalCols; c++) {
    setStyle(2, c, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, true, c < 3 ? "left" : "center"));
  }

  const descRow = ["", "Full item text →", ""];
  allItems.forEach(({ item }) => descRow.push(item.text));
  descRow.push("", "", "", "");
  wsData.push(descRow);
  for (let c = 0; c < totalCols; c++) {
    setStyle(3, c, cellStyle("FF6B7280", "FFF9FAFB", false, true, c < 3 ? "left" : "center"));
  }

  const toolRow = ["", "Tool to use →", ""];
  allItems.forEach(({ item }) => toolRow.push(item.tool));
  toolRow.push("", "", "", "");
  wsData.push(toolRow);
  for (let c = 0; c < totalCols; c++) {
    setStyle(4, c, cellStyle("FF6B7280", "FFF9FAFB", false, true, c < 3 ? "left" : "center"));
  }

  const prioRow = ["", "Priority →", ""];
  allItems.forEach(({ item }) => prioRow.push(item.priority));
  prioRow.push("", "", "", "");
  wsData.push(prioRow);
  for (let c = 0; c < totalCols; c++) {
    setStyle(5, c, cellStyle("FF6B7280", "FFF9FAFB", false, true, c < 3 ? "left" : "center"));
  }

  const dataStartRow = 6;
  state.pageOrder.forEach((pid, pageIdx) => {
    const page = state.pages[pid];
    if (!page) return;
    const row = [pageIdx + 1, page.name, new Date().toISOString().slice(0, 10)];
    const rowIdx = dataStartRow + pageIdx;

    let naCount = 0;
    let checkedCount2 = 0;
    let applicable = 0;

    allItems.forEach(({ item }, ci) => {
      const isHidden = !!page.hidden?.[item.id];
      const isChecked = !!page.checked[item.id];
      const isNA = !!page.na[item.id];
      let val, style;
      if (isHidden) {
        val = "Hidden";
        style = cellStyle(COL_HIDDEN_FG, COL_HIDDEN_BG, false, false);
      } else if (isChecked) {
        val = "Pass";
        style = cellStyle(COL_PASS_FG, COL_PASS_BG, false, false);
        applicable += 1;
        checkedCount2 += 1;
      } else if (isNA) {
        val = "N/A";
        style = cellStyle(COL_NA_FG, COL_NA_BG, false, false);
        naCount += 1;
      } else {
        val = "Open";
        style = cellStyle(COL_OPEN_FG, COL_OPEN_BG, false, false);
        applicable += 1;
      }
      row.push(val);
      setStyle(rowIdx, 3 + ci, style);
    });

    const pct = applicable > 0 ? Math.round((checkedCount2 / applicable) * 100) : 0;

    row.push(checkedCount2, naCount, applicable, `${pct}%`);

    const baseStyle = cellStyle("FF1F2937", COL_SUMMARY_BG, false, false);
    const pctStyle = cellStyle(
      pct >= 80 ? COL_PASS_FG : pct >= 50 ? COL_OPEN_FG : COL_FAIL_FG,
      pct >= 80 ? COL_PASS_BG : pct >= 50 ? COL_OPEN_BG : COL_FAIL_BG,
      true, false
    );
    const summaryStart = 3 + allItems.length;
    setStyle(rowIdx, summaryStart, baseStyle);
    setStyle(rowIdx, summaryStart + 1, baseStyle);
    setStyle(rowIdx, summaryStart + 2, baseStyle);
    setStyle(rowIdx, summaryStart + 3, pctStyle);
    setStyle(rowIdx, 0, cellStyle("FF1F2937", "FFFFFFFF", false, false, "center"));
    setStyle(rowIdx, 1, cellStyle("FF1F2937", "FFFFFFFF", true, false, "left"));
    setStyle(rowIdx, 2, cellStyle("FF6B7280", "FFFFFFFF", false, false, "center"));

    wsData.push(row);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(wsData);
  ws1["!merges"] = wsMerges;
  Object.entries(wsCellStyles).forEach(([key, style]) => {
    const [r, c] = key.split(",").map(Number);
    const cellAddr = XLSX.utils.encode_cell({ r, c });
    if (!ws1[cellAddr]) ws1[cellAddr] = { t: "s", v: "" };
    ws1[cellAddr].s = style;
  });

  const colWidths = [{ wch: 4 }, { wch: 28 }, { wch: 13 }];
  allItems.forEach(() => colWidths.push({ wch: 14 }));
  colWidths.push({ wch: 10 }, { wch: 7 }, { wch: 12 }, { wch: 12 });
  ws1["!cols"] = colWidths;

  ws1["!rows"] = [];
  ws1["!rows"][0] = { hpt: 28 };
  ws1["!rows"][1] = { hpt: 22 };
  ws1["!rows"][2] = { hpt: 36 };
  ws1["!rows"][3] = { hpt: 50 };
  ws1["!rows"][4] = { hpt: 30 };
  ws1["!rows"][5] = { hpt: 20 };
  for (let i = 0; i < state.pageOrder.length; i++) {
    ws1["!rows"][dataStartRow + i] = { hpt: 20 };
  }

  XLSX.utils.book_append_sheet(wb, ws1, "Checklist Matrix");

  // ── Sheet 2: Summary Dashboard ──
  const ws2Data = [];
  const ws2Styles = {};
  const ws2Merges = [];
  const setS2 = (r, c, style) => { ws2Styles[`${r},${c}`] = style; };

  ws2Data.push([`${project} — Summary Dashboard`, "", "", "", "", "", ""]);
  ws2Merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });
  for (let c = 0; c < 7; c++) setS2(0, c, cellStyle(COL_TITLE_FG, COL_TITLE_BG, true, false, c === 0 ? "left" : "center"));

  const s2Headers = ["#", "Page / URL", "Audit Date", "✓ Checked", "~ N/A", "Applicable", "% Complete"];
  ws2Data.push(s2Headers);
  s2Headers.forEach((_, c) => setS2(1, c, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false, c < 2 ? "left" : "center")));

  function pageTotals(page) {
    let naCount = 0;
    let checked = 0;
    let applicable = 0;
    allItems.forEach(({ item }) => {
      if (page.hidden?.[item.id]) return;
      if (page.checked[item.id]) { checked += 1; applicable += 1; }
      else if (page.na[item.id]) { naCount += 1; }
      else { applicable += 1; }
    });
    return { naCount, checked, applicable };
  }

  state.pageOrder.forEach((pid, i) => {
    const page = state.pages[pid];
    if (!page) return;
    const { naCount, checked, applicable } = pageTotals(page);
    const pct = applicable > 0 ? Math.round((checked / applicable) * 100) : 0;
    const pctStr = `${pct}%`;

    const r = 2 + i;
    ws2Data.push([i + 1, page.name, new Date().toISOString().slice(0, 10), checked, naCount, applicable, pctStr]);

    setS2(r, 0, cellStyle("FF1F2937", "FFFFFFFF", false, false, "center"));
    setS2(r, 1, cellStyle("FF1F2937", "FFFFFFFF", true, false, "left"));
    setS2(r, 2, cellStyle("FF6B7280", "FFFFFFFF", false, false, "center"));
    setS2(r, 3, cellStyle(COL_PASS_FG, COL_PASS_BG, false, false, "center"));
    setS2(r, 4, cellStyle(COL_NA_FG, COL_NA_BG, false, false, "center"));
    setS2(r, 5, cellStyle("FF1F2937", COL_SUMMARY_BG, false, false, "center"));
    setS2(r, 6, cellStyle(
      pct >= 80 ? COL_PASS_FG : pct >= 50 ? COL_OPEN_FG : COL_FAIL_FG,
      pct >= 80 ? COL_PASS_BG : pct >= 50 ? COL_OPEN_BG : COL_FAIL_BG,
      true, false, "center"
    ));
  });

  const categoriesWithItems = scopedData.filter((cat) => cat.items.length);
  const breakStartRow = 2 + state.pageOrder.length + 2;
  ws2Data.push([]);
  ws2Data.push(["Category Breakdown", "", "", ...categoriesWithItems.map((c) => c.name), ""]);
  ws2Merges.push({ s: { r: breakStartRow, c: 0 }, e: { r: breakStartRow, c: 2 } });
  for (let c = 0; c < 3 + categoriesWithItems.length; c++) {
    setS2(breakStartRow, c, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false, c < 3 ? "left" : "center"));
  }

  const breakHeaders2 = ["#", "Page / URL", "Audit Date", ...categoriesWithItems.map(() => "% Done")];
  ws2Data.push(breakHeaders2);
  const bhr2 = breakStartRow + 1;
  breakHeaders2.forEach((_, c) => setS2(bhr2, c, cellStyle(COL_HEADER_FG, COL_HEADER_BG, true, false, c < 3 ? "left" : "center")));

  state.pageOrder.forEach((pid, i) => {
    const page = state.pages[pid];
    if (!page) return;
    const catPcts = categoriesWithItems.map((cat) => {
      const visibleItems = cat.items.filter((it) => !page.hidden?.[it.id]);
      const applicable2 = visibleItems.filter((it) => !page.na[it.id]).length;
      const checked2 = visibleItems.filter((it) => page.checked[it.id]).length;
      return applicable2 > 0 ? `${Math.round((checked2 / applicable2) * 100)}%` : "—";
    });
    const r = breakStartRow + 2 + i;
    ws2Data.push([i + 1, page.name, new Date().toISOString().slice(0, 10), ...catPcts]);
    setS2(r, 0, cellStyle("FF1F2937", "FFFFFFFF", false, false, "center"));
    setS2(r, 1, cellStyle("FF1F2937", "FFFFFFFF", true, false, "left"));
    setS2(r, 2, cellStyle("FF6B7280", "FFFFFFFF", false, false, "center"));
    catPcts.forEach((pctStr, ci) => {
      const pctNum = parseInt(pctStr) || 0;
      setS2(r, 3 + ci, cellStyle(
        pctStr === "—" ? COL_NA_FG : pctNum >= 80 ? COL_PASS_FG : pctNum >= 50 ? COL_OPEN_FG : COL_FAIL_FG,
        pctStr === "—" ? COL_NA_BG : pctNum >= 80 ? COL_PASS_BG : pctNum >= 50 ? COL_OPEN_BG : COL_FAIL_BG,
        false, false, "center"
      ));
    });
  });

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2["!merges"] = ws2Merges;
  Object.entries(ws2Styles).forEach(([key, style]) => {
    const [r, c] = key.split(",").map(Number);
    const addr = XLSX.utils.encode_cell({ r, c });
    if (!ws2[addr]) ws2[addr] = { t: "s", v: "" };
    ws2[addr].s = style;
  });
  ws2["!cols"] = [{ wch: 4 }, { wch: 28 }, { wch: 13 }, { wch: 13 }, { wch: 8 }, { wch: 12 }, { wch: 13 }];
  ws2["!rows"] = [{ hpt: 28 }, { hpt: 22 }];
  XLSX.utils.book_append_sheet(wb, ws2, "Summary");

  // ── Legend sheet ──
  const legendData = [
    ["Legend", ""],
    ["Pass", "Item checked off — confirmed OK for this page"],
    ["Open", "Not yet audited — needs attention"],
    ["N/A", "Marked not applicable — excluded from score"],
    ["Hidden", "Hidden from reports on this page — excluded from score"],
    ["", ""],
    ["% Complete", "= Checked ÷ Applicable (N/A and Hidden items excluded from denominator)"],
    ["Green %", "80% or above"],
    ["Yellow %", "50–79%"],
    ["Red %", "Below 50%"],
    ["", ""],
    ["Note", "Only checklist categories/tiers enabled for this project are included in this export."],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(legendData);
  const legendStyles = {
    "0,0": cellStyle(COL_TITLE_FG, COL_TITLE_BG, true, false, "left"),
    "0,1": cellStyle(COL_TITLE_FG, COL_TITLE_BG, true, false, "left"),
    "1,0": cellStyle(COL_PASS_FG, COL_PASS_BG, true, false, "center"),
    "1,1": cellStyle("FF1F2937", "FFFFFFFF", false, true, "left"),
    "2,0": cellStyle(COL_OPEN_FG, COL_OPEN_BG, true, false, "center"),
    "2,1": cellStyle("FF1F2937", "FFFFFFFF", false, true, "left"),
    "3,0": cellStyle(COL_NA_FG, COL_NA_BG, true, false, "center"),
    "3,1": cellStyle("FF1F2937", "FFFFFFFF", false, true, "left"),
    "4,0": cellStyle(COL_HIDDEN_FG, COL_HIDDEN_BG, true, false, "center"),
    "4,1": cellStyle("FF1F2937", "FFFFFFFF", false, true, "left"),
  };
  Object.entries(legendStyles).forEach(([key, style]) => {
    const [r, c] = key.split(",").map(Number);
    const addr = XLSX.utils.encode_cell({ r, c });
    if (!ws3[addr]) ws3[addr] = { t: "s", v: "" };
    ws3[addr].s = style;
  });
  ws3["!cols"] = [{ wch: 16 }, { wch: 52 }];
  XLSX.utils.book_append_sheet(wb, ws3, "Legend");

  return wb;
}

export function exportToXlsxBlob(state) {
  const wb = buildAuditWorkbook(state);
  const wbOut = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
  return new Blob([wbOut], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
