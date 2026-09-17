import { useCallback, useRef, useState } from "react";

export function useToast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
    setVisible(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 2200);
  }, []);

  return { message, visible, showToast };
}
