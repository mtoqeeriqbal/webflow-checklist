import { DATA } from "../data/checklistData";
import { applicableTotal, checkedCount, categoryApplicableTotal, categoryCheckedCount } from "../state/auditState";

export function buildPageSection(state, pageId, headingLevel) {
  const page = state.pages[pageId];
  const h = "#".repeat(headingLevel);
  const total = applicableTotal(state, pageId);
  const done = checkedCount(state, pageId);
  const pct = total ? Math.round((done / total) * 100) : 0;

  let out = `${h} Page: ${page.name} (${done}/${total} — ${pct}%)\n\n`;

  DATA.forEach((cat) => {
    const catTotal = categoryApplicableTotal(state, cat, pageId);
    const catDone = categoryCheckedCount(state, cat, pageId);
    out += `${h}# ${cat.name} (${catDone}/${catTotal})\n\n`;
    const open = cat.items.filter((it) => !page.checked[it.id] && !page.na[it.id]);
    const passed = cat.items.filter((it) => page.checked[it.id]);
    const na = cat.items.filter((it) => page.na[it.id]);

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

  const highOpen = DATA.flatMap((c) => c.items).filter(
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

  let out = `# SEO + AEO Audit Report\n\n`;
  out += `**Project:** ${project}\n`;
  out += `**Page:** ${page.name}\n`;
  out += `**Date:** ${date}\n\n`;
  out += buildPageSection(state, state.activePageId, 2);
  return out;
}

export function buildSiteReport(state) {
  const project = state.project || "Untitled project";
  const date = new Date().toISOString().slice(0, 10);

  let out = `# SEO + AEO Full Site Audit Report\n\n`;
  out += `**Project:** ${project}\n`;
  out += `**Date:** ${date}\n`;
  out += `**Pages audited:** ${state.pageOrder.length}\n\n`;

  out += `## Page Summary\n\n`;
  out += `| Page | Checked | % Complete | High-Priority Open |\n`;
  out += `|---|---|---|---|\n`;
  state.pageOrder.forEach((pid) => {
    const p = state.pages[pid];
    const total = applicableTotal(state, pid);
    const done = checkedCount(state, pid);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const highOpen = DATA.flatMap((c) => c.items).filter(
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
