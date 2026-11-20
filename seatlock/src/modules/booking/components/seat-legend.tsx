
export interface SeatLegendProps {
  compact?: boolean;
}

const legendItems = [
  {
    label: "Available",
    description: "Ready to select",
    style: "border-emerald-500 bg-white",
  },
  {
    label: "Selected",
    description: "Selected by you",
    style: "border-sky-600 bg-sky-600",
  },
  {
    label: "Held",
    description: "Temporarily reserved",
    style: "border-amber-400 bg-amber-100",
  },
  {
    label: "Booked",
    description: "Already booked",
    style: "border-slate-400 bg-slate-200",
  },
  {
    label: "Blocked",
    description: "Unavailable",
    style: "border-rose-400 bg-rose-100",
  },
] as const;

export function SeatLegend({
  compact = false,
}: SeatLegendProps) {
  return (
    <section
      aria-label="Seat status legend"
      className="w-full rounded-xl border border-slate-200 bg-white p-4"
    >
      <h3 className="mb-4 text-sm font-bold text-slate-800">
        Seat Availability
      </h3>

      <ul
        className={
          compact
            ? "flex flex-wrap gap-4"
            : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        }
      >
        {legendItems.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-2"
          >
            <span
              aria-hidden="true"
              className={[
                "h-5 w-5 shrink-0 rounded-md border-2",
                item.style,
              ].join(" ")}
            />

            <span className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">
                {item.label}
              </span>

              {!compact && (
                <span className="text-[10px] text-slate-500">
                  {item.description}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
