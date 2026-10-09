"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGS, pick, pickList, t as translate, type Lang } from "@/lib/i18n";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  tr: (obj: unknown, field: string) => string;
  trl: (obj: unknown, field: string) => string[];
  theme: "light" | "dark";
  toggleTheme: () => void;
  langs: typeof LANGS;
  ready: boolean;
};

const AppCtx = createContext<Ctx | null>(null);

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(^|; )${name}=([^;]+)`));
  return m ? decodeURIComponent(m[2]) : null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedLang = (localStorage.getItem("me_lang") || readCookie("me_lang")) as Lang | null;
    if (storedLang && ["en", "hi", "or"].includes(storedLang)) setLangState(storedLang);
    else {
      const nav = navigator.language?.toLowerCase() || "";
      if (nav.startsWith("hi")) setLangState("hi");
      else if (nav.startsWith("or")) setLangState("or");
    }
    const storedTheme = localStorage.getItem("me_theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(storedTheme || (prefersDark ? "dark" : "light"));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = lang === "or" ? "or" : lang;
    localStorage.setItem("me_theme", theme);
  }, [theme, ready, lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof document !== "undefined") {
      localStorage.setItem("me_lang", l);
      document.cookie = `me_lang=${l};path=/;max-age=${60 * 60 * 24 * 365}`;
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key: string) => translate(lang, key),
      tr: (obj: unknown, field: string) => pick(obj, lang, field),
      trl: (obj: unknown, field: string) => pickList(obj, lang, field),
      theme,
      toggleTheme: () => setTheme((p) => (p === "dark" ? "light" : "dark")),
      langs: LANGS,
      ready,
    }),
    [lang, setLang, theme, ready]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <Providers>");
  return ctx;
}

/** Fire-and-forget analytics beacon. */
export function track(type: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  try {
    const lang = localStorage.getItem("me_lang") || "en";
    const body = JSON.stringify({ type, lang, path: window.location.pathname, ...payload });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    /* ignore */
  }
}
