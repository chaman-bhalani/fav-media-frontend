import { useEffect, useRef } from "react";

export function useInfiniteScroll(callback: () => void, enabled = true) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) callback(); });
    }, { rootMargin: "200px" });

    if (ref.current) obs.observe(ref.current);

    return () => {
      obs.disconnect();
    };
  }, [callback, enabled]);

  return ref;
}
