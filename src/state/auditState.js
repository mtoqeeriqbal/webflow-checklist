import { DATA } from "../data/checklistData";

export const STORAGE_KEY = "seo_aeo_audit_state_v2";
const OLD_STORAGE_KEY = "seo_aeo_audit_state_v1";

export function makePageId() {
  return "page_" + Math.random().toString(36).slice(2, 10);
}

function emptyPage(name) {
  return { name, checked: {}, na: {}, hidden: {} };
}

export function defaultState() {
  const id = makePageId();
  return {
    project: "",
    activePageId: id,
    pageOrder: [id],
    pages: { [id]: emptyPage("/ (Homepage)") },
    collapsed: {},
    enabledCategories: {},
    showAdvancedSeo: true,
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
          if (!p.hidden) p.hidden = {};
        });
        if (!parsed.enabledCategories) parsed.enabledCategories = {};
        if (typeof parsed.showAdvancedSeo !== "boolean") parsed.showAdvancedSeo = true;
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
        pages: { [id]: { name: "/ (Homepage)", checked: old.checked || {}, na: {}, hidden: {} } },
        collapsed: old.collapsed || {},
        enabledCategories: {},
        showAdvancedSeo: true,
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

// ---------- Checklist scope (category / tier) ----------

export function isCategoryEnabled(state, catId) {
  return state.enabledCategories?.[catId] !== false;
}

export function showsAdvancedSeo(state) {
  return state.showAdvancedSeo !== false;
}

export function isItemActive(state, item) {
  if (item.tier === "advanced" && !showsAdvancedSeo(state)) return false;
  return true;
}

export function getActiveCategories(state) {
  return DATA.filter((cat) => isCategoryEnabled(state, cat.id));
}

export function getActiveCategoryItems(state, cat) {
  return cat.items.filter((it) => isItemActive(state, it));
}

export function getActiveItems(state) {
  return getActiveCategories(state).flatMap((cat) => getActiveCategoryItems(state, cat));
}

// ---------- Progress stats (scope-aware, ignores "hidden from report") ----------

export function applicableTotal(state, pageId) {
  const page = getPage(state, pageId);
  const items = getActiveItems(state);
  if (!page) return items.length;
  return items.filter((it) => !page.na[it.id]).length;
}

export function checkedCount(state, pageId) {
  const page = getPage(state, pageId);
  if (!page) return 0;
  return getActiveItems(state).filter((it) => page.checked[it.id]).length;
}

export function categoryApplicableTotal(state, cat, pageId) {
  const page = getPage(state, pageId);
  const items = getActiveCategoryItems(state, cat);
  if (!page) return items.length;
  return items.filter((it) => !page.na[it.id]).length;
}

export function categoryCheckedCount(state, cat, pageId) {
  const page = getPage(state, pageId);
  if (!page) return 0;
  return getActiveCategoryItems(state, cat).filter((it) => page.checked[it.id]).length;
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

    case "TOGGLE_HIDDEN": {
      const page = getPage(state);
      const nextPage = { ...page, hidden: { ...page.hidden, [action.id]: !page.hidden[action.id] } };
      return { ...state, pages: { ...state.pages, [state.activePageId]: nextPage } };
    }

    case "TOGGLE_COLLAPSE":
      return { ...state, collapsed: { ...state.collapsed, [action.catId]: !state.collapsed[action.catId] } };

    case "SET_ALL_COLLAPSED": {
      const collapsed = {};
      action.catIds.forEach((id) => { collapsed[id] = action.value; });
      return { ...state, collapsed };
    }

    case "SET_CATEGORY_ENABLED":
      return { ...state, enabledCategories: { ...state.enabledCategories, [action.catId]: action.value } };

    case "SET_SHOW_ADVANCED_SEO":
      return { ...state, showAdvancedSeo: action.value };

    case "APPLY_CHECKLIST_PRESET":
      return { ...state, enabledCategories: { ...action.enabledCategories }, showAdvancedSeo: action.showAdvancedSeo };

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
          [newId]: {
            name: page.name + " (copy)",
            checked: { ...page.checked },
            na: { ...page.na },
            hidden: { ...page.hidden },
          },
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
        ? { name: action.name, checked: { ...src.checked }, na: { ...src.na }, hidden: { ...src.hidden } }
        : emptyPage(action.name);
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
          pages[targetPid] = emptyPage(p.name);
          pageOrder = [...pageOrder, targetPid];
        }
        const checked = {};
        p.checkedIds.forEach((id) => { checked[id] = true; });
        const na = {};
        p.naIds.forEach((id) => { na[id] = true; });
        pages[targetPid] = { ...pages[targetPid], checked, na, hidden: pages[targetPid].hidden || {} };
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
