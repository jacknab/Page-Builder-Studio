import { lazy, Suspense } from "react";

const BarbershopPreview  = lazy(() => import("./BarbershopPreview"));
const BarbershopPreview2 = lazy(() => import("./BarbershopPreview2"));
const NailSalonPreview   = lazy(() => import("./NailSalonPreview"));

export type PreviewType = "barbershop" | "barbershop2" | "nail-salon";

interface Props {
  previewType: PreviewType;
  themeId: string;
}

export default function TemplatePreview({ previewType, themeId }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">
          Loading preview…
        </div>
      }
    >
      {previewType === "barbershop"  && <BarbershopPreview  themeId={themeId} />}
      {previewType === "barbershop2" && <BarbershopPreview2 themeId={themeId} />}
      {previewType === "nail-salon"  && <NailSalonPreview   themeId={themeId} />}
    </Suspense>
  );
}
