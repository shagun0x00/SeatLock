import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label="SeatLock home">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 18V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10M5 12h14M8 6V4m8 2V4M8 18v-3m8 3v-3" />
        </svg>
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${inverse ? "text-white" : "text-slate-950"}`}>
        seat<span className="text-violet-500">ora</span>
      </span>
    </Link>
  );
}
