"use client";

import * as React from "react";

/*
  Reads client-only data (localStorage) after mount and exposes a reload
  function. Browser storage is only readable post-hydration, so a single
  post-mount state update is the correct synchronization point.

  `key` retriggers the read when the underlying identity changes
  (e.g. the logged-in user id).
*/
export function useLocalData<T>(
  load: () => T,
  key?: string | number | null
): [T | null, () => void] {
  const [data, setData] = React.useState<T | null>(null);

  const loadRef = React.useRef(load);
  React.useEffect(() => {
    loadRef.current = load;
  });

  const reload = React.useCallback(() => {
    setData(loadRef.current());
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload, key]);

  return [data, reload];
}
