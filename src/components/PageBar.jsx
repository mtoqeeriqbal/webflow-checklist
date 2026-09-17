import { applicableTotal, checkedCount } from "../state/auditState";

export default function PageBar({ state, dispatch, onManagePages }) {
  return (
    <div className="page-bar">
      {state.pageOrder.map((pid) => {
        const page = state.pages[pid];
        if (!page) return null;
        const done = checkedCount(state, pid);
        const total = applicableTotal(state, pid);
        return (
          <div
            key={pid}
            className={"page-chip" + (pid === state.activePageId ? " active" : "")}
            onClick={() => dispatch({ type: "SET_ACTIVE_PAGE", pageId: pid })}
          >
            {page.name} ({done}/{total})
          </div>
        );
      })}
      <div className="page-chip manage" onClick={onManagePages}>
        + Manage Pages
      </div>
    </div>
  );
}
