import { lazy, Suspense } from "react";

const BarbershopPreview = lazy(() => import("./BarbershopPreview"));
const NailSalonPreview = lazy(() => import("./NailSalonPreview"));

interface Props {
  businessType: "barbershop" | "nail-salon";
  themeId: string;
}

export default function TemplatePreview({ businessType, themeId }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">
          Loading preview…
        </div>
      }
    >
      {businessType === "barbershop" && <BarbershopPreview themeId={themeId} />}
      {businessType === "nail-salon" && <NailSalonPreview themeId={themeId} />}
    </Suspense>
  );
}
