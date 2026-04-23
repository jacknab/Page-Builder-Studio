import type { SiteContent } from "@workspace/db/schema";

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function defaultBusinessName(content: SiteContent, fallback = "Your Business"): string {
  return content.business?.name?.trim() || fallback;
}

export function activeServices(content: SiteContent) {
  return (content.services ?? []).filter((s) => s.name?.trim().length);
}

export function activeHours(content: SiteContent) {
  return (content.hours ?? []).filter((h) => h.day);
}

export function socialLinks(content: SiteContent) {
  const s = content.social ?? {};
  const list: { label: string; url: string }[] = [];
  if (s.instagram) list.push({ label: "Instagram", url: s.instagram });
  if (s.facebook) list.push({ label: "Facebook", url: s.facebook });
  if (s.tiktok) list.push({ label: "TikTok", url: s.tiktok });
  if (s.twitter) list.push({ label: "X / Twitter", url: s.twitter });
  if (s.youtube) list.push({ label: "YouTube", url: s.youtube });
  return list;
}
