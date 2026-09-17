import { getActiveCategories, getActiveCategoryItems } from "../state/auditState";

// Items that count toward the *report* for this page: in-scope (category enabled,
// tier allowed) AND not individually flagged "hide from report" on this page.
// Note this is distinct from the app's own progress totals, which ignore the
// "hidden" flag — hiding an item from the report doesn't stop tracking it in-app.
function reportItemsForCategory(state, cat, pageId) {
  const page = state.pages[pageId];
  return getActiveCategoryItems(state, cat).filter((it) => !page.hidden?.[it.id]);
}

function reportItemsForPage(state, pageId) {
  return getActiveCategories(state).flatMap((cat) => reportItemsForCategory(state, cat, pageId));
}

function reportTotals(state, pageId) {
  const page = state.pages[pageId];
  const items = reportItemsForPage(state, pageId);
  const applicable = items.filter((it) => !page.na[it.id]).length;
  const done = items.filter((it) => page.checked[it.id]).length;
  return { applicable, done };
}

export function buildPageSection(state, pageId, headingLevel) {
  const page = state.pages[pageId];
  const h = "#".repeat(headingLevel);
  const { applicable: total, done } = reportTotals(state, pageId);
  const pct = total ? Math.round((done / total) * 100) : 0;

  let out = `${h} Page: ${page.name} (${done}/${total} — ${pct}%)\n\n`;

  getActiveCategories(state).forEach((cat) => {
    const catItems = reportItemsForCategory(state, cat, pageId);
    if (!catItems.length) return;

    const catTotal = catItems.filter((it) => !page.na[it.id]).length;
    const catDone = catItems.filter((it) => page.checked[it.id]).length;
    out += `${h}# ${cat.name} (${catDone}/${catTotal})\n\n`;
    const open = catItems.filter((it) => !page.checked[it.id] && !page.na[it.id]);
    const passed = catItems.filter((it) => page.checked[it.id]);
    const na = catItems.filter((it) => page.na[it.id]);

    if (open.length) {
      out += `**Outstanding items:**\n`;
      open
        .slice()
        .sort((a, b) => (a.priority === "High" ? -1 : 1) - (b.priority === "High" ? -1 : 1))
        .forEach((it) => {
          out += `- [ ] (${it.priority}) ${it.text} — _check with: ${it.tool}_ <!--id:${it.id}-->\n`;
        });
      out += `\n`;
    }
    if (passed.length) {
      out += `**Passed:**\n`;
      passed.forEach((it) => {
        out += `- [x] ${it.text} <!--id:${it.id}-->\n`;
      });
      out += `\n`;
    }
    if (na.length) {
      out += `**Marked N/A:**\n`;
      na.forEach((it) => {
        out += `- [~] ${it.text} (N/A) <!--id:${it.id}-->\n`;
      });
      out += `\n`;
    }
  });

  const highOpen = reportItemsForPage(state, pageId).filter(
    (it) => it.priority === "High" && !page.checked[it.id] && !page.na[it.id]
  );
  if (highOpen.length) {
    out += `**Priority fixes (High priority, not yet done):**\n`;
    highOpen.forEach((it) => (out += `- ${it.text}\n`));
    out += `\n`;
  }

  return out;
}

export function buildReport(state) {
  const project = state.project || "Untitled project";
  const date = new Date().toISOString().slice(0, 10);
  const page = state.pages[state.activePageId];

  let out = `# Site Audit Report\n\n`;
  out += `**Project:** ${project}\n`;
  out += `**Page:** ${page.name}\n`;
  out += `**Date:** ${date}\n\n`;
  out += buildPageSection(state, state.activePageId, 2);
  return out;
}

export function buildSiteReport(state) {
  const project = state.project || "Untitled project";
  const date = new Date().toISOString().slice(0, 10);

  let out = `# Full Site Audit Report\n\n`;
  out += `**Project:** ${project}\n`;
  out += `**Date:** ${date}\n`;
  out += `**Pages audited:** ${state.pageOrder.length}\n\n`;

  out += `## Page Summary\n\n`;
  out += `| Page | Checked | % Complete | High-Priority Open |\n`;
  out += `|---|---|---|---|\n`;
  state.pageOrder.forEach((pid) => {
    const p = state.pages[pid];
    const { applicable: total, done } = reportTotals(state, pid);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const highOpen = reportItemsForPage(state, pid).filter(
      (it) => it.priority === "High" && !p.checked[it.id] && !p.na[it.id]
    ).length;
    out += `| ${p.name} | ${done}/${total} | ${pct}% | ${highOpen} |\n`;
  });
  out += `\n`;

  state.pageOrder.forEach((pid) => {
    out += buildPageSection(state, pid, 2);
    out += `---\n\n`;
  });

  return out;
}

export function safeFilenamePart(text) {
  return (text || "").replace(/[^a-z0-9\-_]+/gi, "_").toLowerCase();
}

export function saveTextFile(filename, content, mimeType = "text/markdown") {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
