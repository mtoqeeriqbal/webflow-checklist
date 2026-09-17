export default function ChecklistItem({ item, isChecked, isNA, onToggle, onToggleNA }) {
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
        </div>
        <div className="item-meta">
          <span className={"tag prio " + item.priority.toLowerCase()}>{item.priority} priority</span>
          <span className="tag tool">{item.tool}</span>
        </div>
      </div>
      <button className={"na-toggle" + (isNA ? " active" : "")} onClick={onToggleNA}>
        N/A
      </button>
    </div>
  );
}
