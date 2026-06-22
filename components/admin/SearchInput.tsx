"use client";

import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export function SearchInput({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateQuery = useCallback((term: string) => {
    const params = new URLSearchParams(window.location.search);
    if (term) params.set("q", term);
    else params.delete("q");
    params.delete("page");
    const query = params.toString();
    router.push(`/admin/dashboard${query ? `?${query}` : ""}`);
  }, [router]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateQuery(val), 350);
  }

  function clear() {
    setValue("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateQuery("");
  }

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={onChange}
        placeholder="Cari nama peminjam..."
        className="flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
