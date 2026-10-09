import Link from "next/link";
import { ArrowLeft, Compass, Headset } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1b0f30] via-[#2b1146] to-[#12071f]" />
      <div className="absolute inset-0 -z-10 opacity-25 grid-bg" />
      <div className="absolute -left-20 top-10 h-72 w-72 -z-10 rounded-full bg-brand-500/30 blur-[110px] anim-float" />
      <div className="absolute -right-16 bottom-10 h-80 w-80 -z-10 rounded-full bg-grape-600/30 blur-[120px] anim-drift" />

      <div className="w-full max-w-xl text-center">
        <p className="font-display text-[6rem] font-black leading-none grad-text sm:text-[9rem]">404</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-white sm:text-3xl">This page is not on our shop floor</h1>
        <p className="mt-3 text-sm text-white/70">
          The link may be old or mistyped. Jump back to the machines catalogue, or ask our team — we will point you to the right page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full grad-brand px-6 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:scale-105">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <Link href="/machines" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20">
            <Compass className="h-4 w-4" /> Browse Machines
          </Link>
          <Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20">
            <Headset className="h-4 w-4" /> Support
          </Link>
        </div>
      </div>
    </div>
  );
}
