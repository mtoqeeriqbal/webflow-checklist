import { ITEM_BY_ID, ITEM_BY_TEXT } from "../data/checklistData";

export function parseImportedReport(text) {
  const pageHeadingRe = /^##\s+Page:\s+(.+?)\s+\(\d+\/\d+\s*—\s*\d+%\)\s*$/gm;
  const matches = [];
  let m;
  while ((m = pageHeadingRe.exec(text)) !== null) {
    matches.push({ name: m[1].trim(), index: m.index, headingEnd: pageHeadingRe.lastIndex });
  }
  if (matches.length === 0) return { project: null, pages: [] };

  const projectMatch = text.match(/^\*\*Project:\*\*\s*(.+)$/m);
  const project = projectMatch ? projectMatch[1].trim() : null;

  const pages = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].headingEnd;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    const block = text.slice(start, end);

    const checkedIds = [];
    const openIds = [];
    const naIds = [];
    let unmatchedCount = 0;

    const lineRe = /^- \[( |x|~)\]\s*(?:\(([^)]+)\)\s*)?(.+?)(?:\s*—\s*_check with:.+?_)?\s*(?:<!--id:(\S+?)-->)?\s*$/gim;
    let lm;
    while ((lm = lineRe.exec(block)) !== null) {
      const mark = lm[1];
      const itemText = lm[3].trim().replace(/\s*\(N\/A\)\s*$/i, "");
      const idTag = lm[4];

      const item = (idTag && ITEM_BY_ID[idTag]) || ITEM_BY_TEXT[itemText.toLowerCase()];
      if (!item) {
        unmatchedCount += 1;
        continue;
      }
      if (mark === "x") checkedIds.push(item.id);
      else if (mark === "~") naIds.push(item.id);
      else openIds.push(item.id);
    }

    pages.push({
      name: matches[i].name,
      checkedIds,
      naIds,
      matchedCount: checkedIds.length + naIds.length + openIds.length,
      unmatchedCount,
    });
  }

  return { project, pages };
}
