import PageBar from "./PageBar";

export default function Header({ state, dispatch, onManagePages, onReset }) {
  return (
    <header>
      <h1>SEO + AEO Audit Checklist</h1>
      <p className="sub">Check off items as you audit the site. Progress saves automatically in this browser.</p>
      <div className="project-row">
        <input
          type="text"
          placeholder="Project / site name (e.g. acmeplumbing.com)"
          value={state.project}
          onChange={(e) => dispatch({ type: "SET_PROJECT", project: e.target.value })}
        />
        <button className="btn-secondary" onClick={onReset}>Reset Current Page</button>
      </div>
      <PageBar state={state} dispatch={dispatch} onManagePages={onManagePages} />
    </header>
  );
}
