import Category from "./Category";
import { getActiveCategories } from "../state/auditState";

export default function CategoryList({ state, dispatch }) {
  const categories = getActiveCategories(state);

  if (!categories.length) {
    return (
      <div id="categories">
        <div className="empty-state">
          No checklist categories are enabled for this project. Open <strong>Checklist Setup</strong> to turn some on.
        </div>
      </div>
    );
  }

  return (
    <div id="categories">
      {categories.map((cat) => (
        <Category key={cat.id} cat={cat} state={state} dispatch={dispatch} />
      ))}
    </div>
  );
}
