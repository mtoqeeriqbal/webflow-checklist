import { useCallback, useRef, useState } from "react";

export function useConfirm() {
  const [dialog, setDialog] = useState(null); // { title, message }
  const resolveRef = useRef(null);

  const requestConfirm = useCallback((title, message) => {
    setDialog({ title, message });
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const respond = useCallback((result) => {
    setDialog(null);
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  }, []);

  return { dialog, requestConfirm, respond };
}
