import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/logout-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-black tracking-tight">
              LaunchSite
            </Link>
            <nav className="hidden gap-6 text-sm font-bold text-slate-600 md:flex">
              <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
              {user.isAdmin ? <Link href="/admin" className="hover:text-slate-900">Admin</Link> : null}
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
