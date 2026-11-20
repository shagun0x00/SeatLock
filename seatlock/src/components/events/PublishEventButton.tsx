"use client";

import { useState, useTransition } from "react";
import { publishEventAction } from "@/modules/events/actions/publishEvent";

export function PublishEventButton({
  eventId,
  version,
}: {
  eventId: string;
  version: number;
}) {
  const [message, setMessage] = useState<{
    text: string;
    kind: "error" | "success";
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePublish() {
    setMessage(null);

    startTransition(async () => {
      const result = await publishEventAction(eventId, version);

      setMessage({
        text: result.error ?? result.success ?? "",
        kind: result.error ? "error" : "success",
      });
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handlePublish}
        disabled={isPending}
        className="rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Publishing..." : "Publish"}
      </button>

      {message && (
        <p className={`mt-2 text-sm ${message.kind === "error" ? "text-red-500" : "text-green-500"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}