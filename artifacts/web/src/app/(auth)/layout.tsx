import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-black tracking-tight">
          LaunchSite
        </Link>
        <Link href="/" className="text-sm font-bold text-slate-600 hover:text-slate-900">
          ← Back
        </Link>
      </header>
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 pb-20 pt-8">{children}</main>
    </div>
  );
}
