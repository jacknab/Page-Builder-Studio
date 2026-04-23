import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getSiteByUserId } from "@/lib/sites";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await requireUser();
  const existing = await getSiteByUserId(user.id);
  if (existing) redirect("/dashboard");

  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Onboarding</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Tell us about your business</h1>
        <p className="mt-2 text-slate-600">We'll launch your site as soon as you finish.</p>
      </header>
      <OnboardingForm mode="create" />
    </div>
  );
}
