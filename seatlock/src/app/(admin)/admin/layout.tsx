import { Suspense } from "react";
import { connection } from "next/server";
import { requireRole } from "@/modules/identity/services";

async function AdminContent({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  await requireRole(["ADMIN"]);

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="p-8">Loading admin area...</div>}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}