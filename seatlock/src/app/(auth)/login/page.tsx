"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type LoginState } from "@/modules/identity/actions/login";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_460px]">
      <section className="relative hidden overflow-hidden bg-[#11132c] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(139,92,246,.28),transparent_32%),radial-gradient(circle_at_20%_80%,rgba(79,70,229,.18),transparent_30%)]" />
        <div className="relative px-12 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="SeatLock home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
              <span aria-hidden="true">◆</span>
            </span>
            <span className="text-xl font-extrabold text-white">
              seat<span className="text-violet-400">ora</span>
            </span>
          </Link>
        </div>
        <div className="relative mx-auto max-w-xl px-12 pb-20">
          <p className="text-xs font-bold tracking-[0.24em] text-violet-300">
            CAMPUS EXPERIENCES
          </p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.08] text-white">
            Every great event starts with a seat.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Discover what’s happening, choose your place, and never miss a moment.
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2.5 lg:hidden"
            aria-label="SeatLock home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
              ◆
            </span>
            <span className="text-xl font-extrabold text-slate-950">
              seat<span className="text-violet-600">ora</span>
            </span>
          </Link>
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-violet-600">
              WELCOME BACK
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
              Sign in to SeatLock
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Use your campus account to continue.
            </p>
          </div>

          <form action={formAction} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@campus.edu"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm shadow-sm"
              />
            </div>
            {state.error && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {state.error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="h-12 w-full rounded-xl bg-violet-600 text-sm font-bold text-white shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{" "}
            <Link
              href="/events"
              className="font-bold text-violet-600 hover:text-violet-700"
            >
              Browse events
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}