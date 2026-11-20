import { Suspense } from "react";
import { requireRole } from "@/modules/identity/services";
import { connection } from "next/server";

async function StudentContent({
  children,
}: {
  children: React.ReactNode;
}) {
    await connection();
  await requireRole(["STUDENT"]);
  return <>{children}</>;
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8">Loading student area...</div>}>
      <StudentContent>{children}</StudentContent>
    </Suspense>
  );
}