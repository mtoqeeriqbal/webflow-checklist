import { TOTAL_ITEMS } from "../data/checklistData";

export const STORAGE_KEY = "seo_aeo_audit_state_v2";
const OLD_STORAGE_KEY = "seo_aeo_audit_state_v1";

export function makePageId() {
  return "page_" + Math.random().toString(36).slice(2, 10);
}

export function defaultState() {
  const id = makePageId();
  return {
    project: "",
    activePageId: id,
    pageOrder: [id],
    pages: { [id]: { name: "/ (Homepage)", checked: {}, na: {} } },
    collapsed: {},
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.pages && parsed.activePageId) {
        Object.values(parsed.pages).forEach((p) => {
          if (!p.na) p.na = {};
        });
        return parsed;
      }
    }
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const old = JSON.parse(oldRaw);
      const id = makePageId();
      return {
        project: old.project || "",
        activePageId: id,
        pageOrder: [id],
        pages: { [id]: { name: "/ (Homepage)", checked: old.checked || {}, na: {} } },
        collapsed: old.collapsed || {},
      };
    }
  } catch (e) {
    console.warn("Could not load saved state", e);
  }
  return defaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save state", e);
  }
}

export function getPage(state, pageId) {
  return state.pages[pageId || state.activePageId];
}

export function applicableTotal(state, pageId) {
  const page = getPage(state, pageId);
  if (!page) return TOTAL_ITEMS;
  return TOTAL_ITEMS - Object.values(page.na).filter(Boolean).length;
}

export function checkedCount(state, pageId) {
  const page = getPage(state, pageId);
  if (!page) return 0;
  return Object.values(page.checked).filter(Boolean).length;
}

export function categoryApplicableTotal(state, cat, pageId) {
  const page = getPage(state, pageId);
  if (!page) return cat.items.length;
  return cat.items.filter((it) => !page.na[it.id]).length;
}

export function categoryCheckedCount(state, cat, pageId) {
  const page = getPage(state, pageId);
  if (!page) return 0;
  return cat.items.filter((it) => page.checked[it.id]).length;
}

export function auditReducer(state, action) {
  switch (action.type) {
    case "SET_PROJECT":
      return { ...state, project: action.project };

    case "SET_ACTIVE_PAGE":
      return { ...state, activePageId: action.pageId };

    case "TOGGLE_ITEM": {
      const page = getPage(state);
      if (page.na[action.id]) return state;
      const nextPage = { ...page, checked: { ...page.checked, [action.id]: !page.checked[action.id] } };
      return { ...state, pages: { ...state.pages, [state.activePageId]: nextPage } };
    }

    case "TOGGLE_NA": {
      const page = getPage(state);
      const nextNA = !page.na[action.id];
      const nextPage = {
        ...page,
        na: { ...page.na, [action.id]: nextNA },
        checked: nextNA ? { ...page.checked, [action.id]: false } : page.checked,
      };
      return { ...state, pages: { ...state.pages, [state.activePageId]: nextPage } };
    }

    case "TOGGLE_COLLAPSE":
      return { ...state, collapsed: { ...state.collapsed, [action.catId]: !state.collapsed[action.catId] } };

    case "SET_ALL_COLLAPSED": {
      const collapsed = {};
      action.catIds.forEach((id) => { collapsed[id] = action.value; });
      return { ...state, collapsed };
    }

    case "RENAME_PAGE": {
      const page = state.pages[action.pageId];
      if (!page) return state;
      const name = action.name.trim() || page.name;
      return { ...state, pages: { ...state.pages, [action.pageId]: { ...page, name } } };
    }

    case "DUPLICATE_PAGE": {
      const page = state.pages[action.pageId];
      if (!page) return state;
      const newId = makePageId();
      return {
        ...state,
        pages: {
          ...state.pages,
          [newId]: { name: page.name + " (copy)", checked: { ...page.checked }, na: { ...page.na } },
        },
        pageOrder: [...state.pageOrder, newId],
        activePageId: newId,
      };
    }

    case "DELETE_PAGE": {
      if (state.pageOrder.length <= 1) return state;
      const pages = { ...state.pages };
      delete pages[action.pageId];
      const pageOrder = state.pageOrder.filter((id) => id !== action.pageId);
      const activePageId = state.activePageId === action.pageId ? pageOrder[0] : state.activePageId;
      return { ...state, pages, pageOrder, activePageId };
    }

    case "ADD_PAGE": {
      const id = makePageId();
      const src = action.sourcePageId ? state.pages[action.sourcePageId] : null;
      const newPage = src
        ? { name: action.name, checked: { ...src.checked }, na: { ...src.na } }
        : { name: action.name, checked: {}, na: {} };
      return {
        ...state,
        pages: { ...state.pages, [id]: newPage },
        pageOrder: [...state.pageOrder, id],
        activePageId: id,
      };
    }

    case "RESET_PAGE": {
      const page = getPage(state);
      return { ...state, pages: { ...state.pages, [state.activePageId]: { ...page, checked: {}, na: {} } } };
    }

    case "IMPORT_PAGES": {
      const pages = { ...state.pages };
      let pageOrder = [...state.pageOrder];
      let firstImportedId = null;

      action.pages.forEach((p) => {
        let targetPid = pageOrder.find(
          (pid) => pages[pid].name.trim().toLowerCase() === p.name.trim().toLowerCase()
        );
        if (!targetPid) {
          targetPid = makePageId();
          pages[targetPid] = { name: p.name, checked: {}, na: {} };
          pageOrder = [...pageOrder, targetPid];
        }
        const checked = {};
        p.checkedIds.forEach((id) => { checked[id] = true; });
        const na = {};
        p.naIds.forEach((id) => { na[id] = true; });
        pages[targetPid] = { ...pages[targetPid], checked, na };
        if (!firstImportedId) firstImportedId = targetPid;
      });

      const project = action.project && !state.project ? action.project : state.project;

      return {
        ...state,
        pages,
        pageOrder,
        project,
        activePageId: firstImportedId || state.activePageId,
      };
    }

    default:
      return state;
  }
}
