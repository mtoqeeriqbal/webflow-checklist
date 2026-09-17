import ChecklistItem from "./ChecklistItem";
import { categoryApplicableTotal, categoryCheckedCount, getPage } from "../state/auditState";

export default function Category({ cat, state, dispatch }) {
  const page = getPage(state);
  const done = categoryCheckedCount(state, cat);
  const total = categoryApplicableTotal(state, cat);
  const isCollapsed = !!state.collapsed[cat.id];

  return (
    <div className={"category" + (isCollapsed ? " collapsed" : "")}>
      <div className="category-head" onClick={() => dispatch({ type: "TOGGLE_COLLAPSE", catId: cat.id })}>
        <h2>{cat.name}</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="progress-pill">{done}/{total}</span>
          <span className="chevron">&#9660;</span>
        </div>
      </div>
      <div className="category-body">
        {cat.items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            isChecked={!!page.checked[item.id]}
            isNA={!!page.na[item.id]}
            onToggle={() => dispatch({ type: "TOGGLE_ITEM", id: item.id })}
            onToggleNA={() => dispatch({ type: "TOGGLE_NA", id: item.id })}
          />
        ))}
      </div>
    </div>
  );
}
