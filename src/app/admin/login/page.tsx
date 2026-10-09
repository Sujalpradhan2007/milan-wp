"use client";

import { useEffect, useState, type FormEvent } from "react";

import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "@/components/admin/api";
import { Alert, Btn } from "@/components/ui";
import { useApp } from "@/components/providers";

export default function AdminLoginPage() {
  const { theme } = useApp();
  const [email, setEmail] = useState("admin@milanenterprises.in");
  const [password, setPassword] = useState("Milan@2024");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email: email.trim(), password }) });
      window.location.assign("/admin");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  const demo = [
    { role: "Super Admin", email: "admin@milanenterprises.in", pass: "Milan@2024", desc: "Full access" },
    { role: "Sales Manager", email: "sales@milanenterprises.in", pass: "Sales@2024", desc: "Enquiries, offers, support, analytics" },
    { role: "Content Manager", email: "content@milanenterprises.in", pass: "Content@2024", desc: "Machines, materials, gallery, FAQ" },
  ];

  return (
    <div className="relative grid min-h-screen items-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#1b0f30] via-[#2b1146] to-[#12071f]" />
      <div className="absolute inset-0 -z-10 opacity-25 grid-bg" />
      <div className="absolute -left-24 top-10 -z-10 h-80 w-80 rounded-full bg-brand-500/30 blur-[110px] anim-float" />
      <div className="absolute -right-20 bottom-0 -z-10 h-96 w-96 rounded-full bg-grape-600/30 blur-[120px] anim-drift" />

      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        {/* brand side */}
        <div className="hidden flex-col justify-center text-white lg:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] ring-1 ring-white/20 backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-300" /> Secure Admin Access
          </span>
          <h1 className="mt-6 font-display text-4xl font-black leading-tight">
            Milan Enterprises<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(100deg,#ffb03a,#ff5f9e 45%,#c39bff)" }}>Control Panel</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            Manage machines, raw materials, spare parts, offers, festivals, gallery, enquiries, support tickets,
            analytics and company settings — all from one dashboard with role-based permissions enforced on the server.
          </p>
          <div className="mt-8 space-y-3">
            {["Role-based access: Super Admin, Sales Manager, Content Manager", "Persistent image storage with database references", "CSV export, WhatsApp templates and live analytics"].map((f) => (
              <p key={f} className="flex items-start gap-2.5 text-sm text-white/80">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" /> {f}
              </p>
            ))}
          </div>
        </div>

        {/* form */}
        <div className="rounded-[1.75rem] border border-white/15 bg-white/8 p-6 backdrop-blur-2xl sm:p-8">
          <h2 className="font-display text-2xl font-extrabold text-white">Sign in</h2>
          <p className="mt-1 text-sm text-white/65">Use your staff account to continue.</p>

          {error && <div className="mt-5"><Alert kind="error"><span className="text-rose-100">{error}</span></Alert></div>}

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/60">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username"
                  placeholder="admin@milanenterprises.in"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/40 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/20" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/60">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/40 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/20" />
              </div>
            </label>
            <Btn type="submit" size="lg" loading={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" />
            </Btn>
          </form>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/6 p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-white/60">Demo accounts (click to fill)</p>
            <div className="mt-3 space-y-2">
              {demo.map((d) => (
                <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword(d.pass); setError(""); }}
                  className="flex w-full items-center gap-3 rounded-xl bg-white/8 p-2.5 text-left transition hover:bg-white/16">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg grad-brand text-[10px] font-black text-white">{d.role.split(" ").map((w) => w[0]).join("")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-extrabold text-white">{d.role}</span>
                    <span className="block truncate text-[10px] text-white/60">{d.email} • {d.pass}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/50" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-white/45">
              Change these passwords from Users &amp; Roles before going live. Permissions are enforced on the server for every API call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
