"use client";

import { useCallback, useEffect, useState } from "react";

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
    credentials: "include",
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = { error: text }; }
  if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
  return json as T;
}

export function useResource<T = any>(resource: string) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const json = await api<{ data: T[] }>(`/api/admin/${resource}`);
      setRows(json.data || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (body: Record<string, any>) => {
    const json = await api<{ data: T }>(`/api/admin/${resource}`, { method: "POST", body: JSON.stringify(body) });
    await load();
    return json.data;
  }, [resource, load]);

  const update = useCallback(async (id: number | string, body: Record<string, any>) => {
    const json = await api<{ data: T }>(`/api/admin/${resource}/${id}`, { method: "PUT", body: JSON.stringify(body) });
    await load();
    return json.data;
  }, [resource, load]);

  const remove = useCallback(async (id: number | string) => {
    await api(`/api/admin/${resource}/${id}`, { method: "DELETE" });
    await load();
  }, [resource, load]);

  return { rows, loading, error, reload: load, create, update, remove };
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const json = await api<{ data: { url: string }[] }>("/api/upload", { method: "POST", body: form });
  return (json.data || []).map((d) => d.url);
}
