import { DATA } from "../data/checklistData";
import Category from "./Category";

export default function CategoryList({ state, dispatch }) {
  return (
    <div id="categories">
      {DATA.map((cat) => (
        <Category key={cat.id} cat={cat} state={state} dispatch={dispatch} />
      ))}
    </div>
  );
}
