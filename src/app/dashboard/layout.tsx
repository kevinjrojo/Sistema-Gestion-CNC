import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar
        userEmail={user.email}
        userName={user.user_metadata?.full_name}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
