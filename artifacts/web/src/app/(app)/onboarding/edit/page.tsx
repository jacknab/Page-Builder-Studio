import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getSiteByUserId } from "@/lib/sites";
import { OnboardingForm } from "../onboarding-form";

export const dynamic = "force-dynamic";

export default async function EditPage() {
  const user = await requireUser();
  const site = await getSiteByUserId(user.id);
  if (!site) redirect("/onboarding");

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Edit content</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Update your site</h1>
      </header>
      <OnboardingForm mode="edit" initialContent={site.content} initialTemplate={site.templateSlug} />
    </div>
  );
}
