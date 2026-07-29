import { createContext, useCallback, useMemo, useState } from "react";
export const NotificationContext = createContext(null);
export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const notify = useCallback((message, type = "success") => {
    setNotification({ message, type });
    window.setTimeout(() => setNotification(null), 3500);
  }, []);
  const value = useMemo(() => ({ notification, notify }), [notification, notify]);
  return <NotificationContext.Provider value={value}>{children}{notification && <div className="toast">{notification.message}</div>}</NotificationContext.Provider>;
}
