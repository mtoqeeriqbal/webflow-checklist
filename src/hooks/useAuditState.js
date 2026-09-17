import { useEffect, useReducer } from "react";
import { auditReducer, loadState, saveState } from "../state/auditState";

export function useAuditState() {
  const [state, dispatch] = useReducer(auditReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return [state, dispatch];
}
