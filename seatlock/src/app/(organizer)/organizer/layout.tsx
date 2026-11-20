import { Suspense } from "react";
import { requireRole } from "@/modules/identity/services";
import { connection } from "next/server";

async function OrganizerContent({
  children,
}: {
  children: React.ReactNode;
}) {
    await connection();
  await requireRole(["ORGANIZER", "ADMIN"]);

  return <>{children}</>;
}

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8">Loading organizer area...</div>}>
      <OrganizerContent>{children}</OrganizerContent>
    </Suspense>
  );
}