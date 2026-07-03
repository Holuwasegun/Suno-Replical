"use client";

import { useState, useEffect, useCallback } from "react";

export function QuotaBadge() {
  const [quota, setQuota] = useState<{ used: number; limit: number; remaining: number } | null>(null);

  const fetchQuota = useCallback(async () => {
    try {
      const res = await fetch("/api/quota");
      if (res.ok) {
        setQuota(await res.json());
      }
    } catch {
      
    }
  }, []);

  useEffect(() => {
    fetchQuota();
    const interval = setInterval(fetchQuota, 30000);
    return () => clearInterval(interval);
  }, [fetchQuota]);

  if (!quota) return null;

  return (
    <span className="text-xs text-zinc-500">
      {quota.remaining} / {quota.limit} remaining
    </span>
  );
}
