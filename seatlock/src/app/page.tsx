import Link from "next/link";
import FeaturedEvents from "@/components/events/FeaturedEvents";
import { Suspense } from "react";

const steps = [
	{
		number: "01",
		title: "Discover events",
		description:
			"Explore upcoming campus events and find the experiences that interest you.",
	},
	{
		number: "02",
		title: "Choose your seats",
		description:
			"View the live seat map and select the seats you want.",
	},
	{
		number: "03",
		title: "Confirm your booking",
		description:
			"Secure your seats and get your booking confirmation.",
	},
];

function ArrowIcon() {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			className="h-4 w-4"
			stroke="currentColor"
			strokeWidth="2"
		>
			<path d="M5 12h14m-6-6 6 6-6 6" />
		</svg>
	);
}

function Logo() {
	return (
		<Link href="/" className="flex items-center gap-2.5">
			<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					className="h-6 w-6"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<path d="M5 19V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11M5 12h14M8 6V4m8 2V4M8 19v-3m8 3v-3" />
				</svg>
			</span>
			<span className="text-xl font-extrabold tracking-tight text-slate-950">
				seat<span className="text-violet-600">ora</span>
			</span>
		</Link>
	);
}

export default function HomePage() {
	return (
		<main className="min-h-screen overflow-hidden bg-white text-slate-900">
			{/* NAVBAR */}
			<header className="relative z-10 border-b border-slate-100 bg-white">
				<nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
					<Logo />

					<div className="hidden items-center gap-9 md:flex">
						<Link
							href="/"
							className="text-sm font-semibold text-violet-600"
						>
							Home
						</Link>
						<Link
							href="/events"
							className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
						>
							Explore Events
						</Link>
						<a
							href="#how-it-works"
							className="text-sm font-medium text-slate-600 transition hover:text-violet-600"
						>
							How it works
						</a>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/login"
							className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
						>
							Log in
						</Link>
						<Link
							href="/events"
							className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
						>
							Explore Events
						</Link>
					</div>
				</nav>
			</header>

			{/* HERO */}
			<section className="relative bg-[#101126]">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(124,58,237,0.28),transparent_45%)]" />
				<div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-violet-700/10 blur-3xl" />

				<div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2 lg:px-10">
					<div>
						<div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs font-semibold tracking-wider text-violet-200">
							<span className="h-2 w-2 rounded-full bg-violet-400" />
							YOUR CAMPUS. YOUR EVENTS.
						</div>

						<h1 className="max-w-2xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
							Find your event.
							<span className="block text-violet-400">
								Claim your seat.
							</span>
						</h1>

						<p className="mt-7 max-w-lg text-lg leading-8 text-slate-300">
							Discover exciting campus events, choose your perfect seats,
							and make every moment count. Your next experience starts here.
						</p>

						<div className="mt-9 flex flex-wrap gap-4">
							<Link
								href="/events"
								className="inline-flex items-center gap-3 rounded-xl bg-violet-600 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-violet-950/30 transition hover:-translate-y-0.5 hover:bg-violet-500"
							>
								Explore Events <ArrowIcon />
							</Link>
							<Link
								href="/login"
								className="rounded-xl border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
							>
								Sign in
							</Link>
						</div>

						<div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-slate-300">
							<span className="flex items-center gap-2">
								<span className="text-violet-400">✓</span> Secure booking
							</span>
							<span className="flex items-center gap-2">
								<span className="text-violet-400">✓</span> Live seat selection
							</span>
							<span className="flex items-center gap-2">
								<span className="text-violet-400">✓</span> Instant confirmation
							</span>
						</div>
					</div>

					{/* HERO VISUAL */}
					<div className="relative mx-auto w-full max-w-xl">
						<div className="absolute -inset-5 rounded-[2rem] bg-violet-600/20 blur-3xl" />

						<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#20213b] p-3 shadow-2xl">
							<div
								className="relative flex h-72 flex-col justify-end overflow-hidden rounded-2xl bg-cover bg-center sm:h-96"
								style={{
									backgroundImage:
										"linear-gradient(to top, rgba(12,12,30,0.95), rgba(12,12,30,0.05)), url('https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200&q=90')",
								}}
							>
								<div className="p-7">
									<span className="rounded-full bg-violet-500 px-3 py-1.5 text-[10px] font-bold tracking-widest text-white">
										FEATURED EXPERIENCE
									</span>
									<h2 className="mt-4 text-3xl font-bold text-white">
										Make memories.
									</h2>
									<p className="mt-2 text-sm text-slate-200">
										Discover what is happening on your campus.
									</p>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-2 p-3">
								<div className="rounded-xl bg-white/5 p-3 text-center">
									<p className="text-lg font-bold text-white">01</p>
									<p className="mt-1 text-[10px] text-slate-400">
										Discover
									</p>
								</div>
								<div className="rounded-xl bg-violet-500/20 p-3 text-center">
									<p className="text-lg font-bold text-violet-300">02</p>
									<p className="mt-1 text-[10px] text-slate-300">
										Select
									</p>
								</div>
								<div className="rounded-xl bg-white/5 p-3 text-center">
									<p className="text-lg font-bold text-white">03</p>
									<p className="mt-1 text-[10px] text-slate-400">
										Book
									</p>
								</div>
							</div>
						</div>

						<div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:block">
							<p className="text-xs font-medium text-slate-500">
								Your next experience
							</p>
							<p className="mt-1 font-bold text-slate-900">
								Starts with a seat.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* TRUST STRIP */}
			<section className="border-b border-slate-100 bg-white">
				<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 sm:grid-cols-3 lg:px-10">
					{[
						["Simple discovery", "Find events that interest you"],
						["Smart seat selection", "Choose seats with confidence"],
						["Secure reservations", "Hold and confirm your seats"],
					].map(([title, description]) => (
						<div key={title} className="flex items-center gap-4">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
								<span className="text-xl">✓</span>
							</div>
							<div>
								<p className="font-bold text-slate-900">{title}</p>
								<p className="mt-1 text-sm text-slate-500">
									{description}
								</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* FEATURED EVENTS */}
			<Suspense fallback={<div>Loading...</div>}>
				<FeaturedEvents />
			</Suspense>

			{/* HOW IT WORKS */}
			<section id="how-it-works" className="bg-[#f8f7ff] py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-10">
					<div className="mx-auto max-w-2xl text-center">
						<p className="text-xs font-bold tracking-[0.2em] text-violet-600">
							THREE SIMPLE STEPS
						</p>
						<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
							Booking made effortless.
						</h2>
						<p className="mt-4 leading-7 text-slate-500">
							From discovering an event to securing your seat, the process
							stays simple.
						</p>
					</div>

					<div className="mt-16 grid gap-8 md:grid-cols-3">
						{steps.map((step) => (
							<div
								key={step.number}
								className="rounded-2xl border border-violet-100 bg-white p-8 shadow-sm"
							>
								<span className="text-4xl font-extrabold text-violet-200">
									{step.number}
								</span>
								<h3 className="mt-7 text-xl font-bold text-slate-950">
									{step.title}
								</h3>
								<p className="mt-3 leading-7 text-slate-500">
									{step.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="px-6 py-24">
				<div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-violet-700 px-8 py-16 text-center sm:px-16">
					<div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />
					<div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

					<div className="relative">
						<p className="text-xs font-bold tracking-[0.2em] text-violet-200">
							YOUR NEXT EXPERIENCE AWAITS
						</p>
						<h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
							Dont&apos;t just hear about it. Be there.
						</h2>
						<p className="mx-auto mt-5 max-w-xl leading-7 text-violet-100">
							Explore campus events, find your people, and make your moments
							count.
						</p>
						<Link
							href="/events"
							className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
						>
							Find your event <ArrowIcon />
						</Link>
					</div>
				</div>
			</section>

			{/* FOOTER */}
			<footer className="border-t border-slate-200 bg-white">
				<div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 sm:flex-row sm:items-center lg:px-10">
					<div>
						<Logo />
						<p className="mt-3 text-sm text-slate-500">
							Your seat. Your event. Your moment.
						</p>
					</div>

					<div className="flex flex-wrap gap-7 text-sm font-medium text-slate-500">
						<Link href="/" className="hover:text-violet-600">
							Home
						</Link>
						<Link href="/events" className="hover:text-violet-600">
							Events
						</Link>
						<Link href="/login" className="hover:text-violet-600">
							Login
						</Link>
						<a href="#how-it-works" className="hover:text-violet-600">
							How it works
						</a>
					</div>

					<p className="text-xs text-slate-400">
						© 2026 Seatora. All rights reserved.
					</p>
				</div>
			</footer>
		</main>
	);
}
