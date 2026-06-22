"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NavigationLoading() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => setLoading(false), [pathname, searchParams]);

  useEffect(() => {
    const start = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (!link || link.target || link.hasAttribute("download") || event.defaultPrevented) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setLoading(true);
    };
    const submit = (event: Event) => {
      if (!event.defaultPrevented) setLoading(true);
    };
    const stop = () => setLoading(false);
    document.addEventListener("click", start);
    document.addEventListener("submit", submit);
    window.addEventListener("pageshow", stop);
    return () => {
      document.removeEventListener("click", start);
      document.removeEventListener("submit", submit);
      window.removeEventListener("pageshow", stop);
    };
  }, []);

  if (!loading) return null;
  return <div className="fixed inset-x-0 top-0 z-[9999]"><div className="h-1 w-full overflow-hidden bg-primary/20"><div className="h-full w-1/3 animate-pulse bg-primary"/></div><div className="pointer-events-none mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border bg-background/95 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur"><Loader2 className="h-4 w-4 animate-spin"/>Memuat...</div></div>;
}
