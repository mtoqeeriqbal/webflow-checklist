export default function ChecklistItem({ item, isChecked, isNA, isHidden, onToggle, onToggleNA, onToggleHidden }) {
  return (
    <div className={"item" + (isChecked ? " checked" : "") + (isNA ? " na" : "")}>
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isNA}
        onChange={onToggle}
      />
      <div className="item-main">
        <div className="item-title" onClick={() => { if (!isNA) onToggle(); }}>
          {item.text}
          {isHidden && <span className="hidden-badge">hidden from report</span>}
        </div>
        <div className="item-meta">
          <span className={"tag prio " + item.priority.toLowerCase()}>{item.priority} priority</span>
          <span className="tag tool">{item.tool}</span>
          {item.tier === "advanced" && <span className="tag tier">Advanced</span>}
        </div>
      </div>
      <div className="item-toggles">
        <button className={"na-toggle" + (isNA ? " active" : "")} onClick={onToggleNA}>
          N/A
        </button>
        <button
          className={"hide-toggle" + (isHidden ? " active" : "")}
          onClick={onToggleHidden}
          title="Hide this item from generated reports"
        >
          {isHidden ? "Hidden" : "Hide"}
        </button>
      </div>
    </div>
  );
}
