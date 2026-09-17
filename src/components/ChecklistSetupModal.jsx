import { DATA } from "../data/checklistData";
import { PRESETS } from "../data/presets";
import { isCategoryEnabled, showsAdvancedSeo } from "../state/auditState";

export default function ChecklistSetupModal({ open, state, dispatch, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <h2>Checklist Setup</h2>
        <p className="sub" style={{ marginTop: 0 }}>
          Choose what this project's checklist covers. Not every client needs full SEO/AEO — turn off what doesn't
          apply and every page, report, and export will follow.
        </p>

        <div className="setup-section">
          <div className="setup-label">Quick presets</div>
          <div className="preset-row">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                className="btn-secondary"
                title={preset.description}
                onClick={() =>
                  dispatch({
                    type: "APPLY_CHECKLIST_PRESET",
                    enabledCategories: preset.enabledCategories,
                    showAdvancedSeo: preset.showAdvancedSeo,
                  })
                }
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <div className="setup-label">Categories included</div>
          {DATA.map((cat) => (
            <label className="setup-checkbox-row" key={cat.id}>
              <input
                type="checkbox"
                checked={isCategoryEnabled(state, cat.id)}
                onChange={(e) =>
                  dispatch({ type: "SET_CATEGORY_ENABLED", catId: cat.id, value: e.target.checked })
                }
              />
              {cat.name}
              <span className="setup-item-count">{cat.items.length} items</span>
            </label>
          ))}
        </div>

        <div className="setup-section">
          <div className="setup-label">SEO depth</div>
          <label className="setup-checkbox-row">
            <input
              type="checkbox"
              checked={showsAdvancedSeo(state)}
              onChange={(e) => dispatch({ type: "SET_SHOW_ADVANCED_SEO", value: e.target.checked })}
            />
            Include advanced Technical &amp; On-Page SEO items
            <span className="setup-item-count">unchecked = basic SEO only</span>
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
