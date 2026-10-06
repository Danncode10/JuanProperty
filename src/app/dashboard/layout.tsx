import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/services/dashboard";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserProfile();
  if (!session) redirect("/login");

  return children;
}
