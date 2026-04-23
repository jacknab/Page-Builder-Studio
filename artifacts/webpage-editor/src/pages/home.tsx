import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Block, TEMPLATES, Template, generateId, GOOGLE_FONTS } from "@/lib/templates";
import { HTML_TEMPLATES, HtmlTemplate } from "@/lib/htmlTemplates";
import { ADMIN_STORAGE_EVENT, getCustomTemplates, getCategories, type CustomHtmlTemplate, type Category } from "@/lib/adminStorage";
import { logout, getUser, isAdmin } from "@/lib/auth";
import { BlockRenderer } from "@/components/editor/blocks";
import { HtmlTemplateEditor } from "@/components/editor/HtmlTemplateEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateHtml } from "@/lib/export";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Code,
  Code2,
  Download,
  Eye,
  FileText,
  Globe2,
  Grid3X3,
  LayoutTemplate,
  Link,
  Map,
  Monitor,
  PenTool,
  Play,
  Plus,
  Rocket,
  Settings,
  Smartphone,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";

type DeviceMode = "desktop" | "mobile";
type ViewMode = "dashboard" | "builder";
type SiteStatus = "draft" | "live";
type SiteSource = "blocks" | "html";

interface WebsiteSite {
  id: string;
  name: string;
  slug: string;
  status: SiteStatus;
  source: SiteSource;
  templateId: string;
  blocks: Block[];
  html?: string;
  font?: string;
  createdAt: string;
  lastEdited: string;
  publishedAt?: string;
}

const STORAGE_KEY = "webpage-editor-sites-v2";

const cloneBlocks = (blocks: Block[]) =>
  blocks.map((block) => ({
    ...block,
    id: generateId(),
    props: JSON.parse(JSON.stringify(block.props)),
  }));

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "my-site";

const starterSite = (): WebsiteSite => ({
  id: generateId(),
  name: "New Startup Site",
  slug: "new-startup-site",
  status: "draft",
  source: "blocks",
  templateId: TEMPLATES[0].id,
  blocks: cloneBlocks(TEMPLATES[0].blocks),
  createdAt: new Date().toISOString(),
  lastEdited: new Date().toISOString(),
});

const normalizeSite = (site: WebsiteSite): WebsiteSite => ({
  ...site,
  source: site.source ?? "blocks",
  blocks: site.blocks ?? [],
});

const createSiteFromTemplate = (template: Template, name?: string): WebsiteSite => {
  const siteName = name?.trim() || `${template.name} Website`;

  return {
    id: generateId(),
    name: siteName,
    slug: toSlug(siteName),
    status: "draft",
    source: "blocks",
    templateId: template.id,
    blocks: cloneBlocks(template.blocks),
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString(),
  };
};

const createSiteFromHtmlTemplate = (template: HtmlTemplate): WebsiteSite => ({
  id: generateId(),
  name: template.name,
  slug: toSlug(template.name),
  status: "draft",
  source: "html",
  templateId: template.id,
  blocks: [],
  html: template.html,
  createdAt: new Date().toISOString(),
  lastEdited: new Date().toISOString(),
});

const blockLabels: Record<Block["type"], string> = {
  hero: "Hero",
  features: "Features",
  text: "Text",
  image: "Image",
  footer: "Footer",
  widget: "Widget / Embed",
  buttons: "Buttons Showcase",
};

const createBlock = (type: Block["type"]): Block => {
  switch (type) {
    case "hero":
      return {
        id: generateId(),
        type: "hero",
        props: {
          title: "A clearer promise for your business",
          subtitle: "Write a short line that tells visitors exactly what you do and why it matters.",
          buttonText: "Start now",
          imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop",
        },
      };
    case "features":
      return {
        id: generateId(),
        type: "features",
        props: {
          title: "Why customers choose you",
          features: [
            { title: "Simple setup", description: "Explain one benefit in plain language." },
            { title: "Fast delivery", description: "Show people what makes you reliable." },
            { title: "Human support", description: "Add proof that you care after the sale." },
          ],
        },
      };
    case "text":
      return {
        id: generateId(),
        type: "text",
        props: {
          content: "<h2>Tell your story</h2><p>Use this section for a founder note, service details, pricing explanation, or anything your audience needs before they take action.</p>",
          align: "left",
        },
      };
    case "image":
      return {
        id: generateId(),
        type: "image",
        props: {
          url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop",
          alt: "Website image",
        },
      };
    case "footer":
      return {
        id: generateId(),
        type: "footer",
        props: { text: "© 2026 Your Company. Built with LaunchSite." },
      };
    case "widget":
      return {
        id: generateId(),
        type: "widget",
        props: { html: "", label: "Embedded Widget", height: 420 },
      };
    case "buttons":
      return {
        id: generateId(),
        type: "buttons",
        props: {
          title: "Our Buttons",
          subtitle: "Mix and match to find what fits your brand.",
          bg: "white",
          buttons: [
            { id: "solid-blue",      text: "Get Started" },
            { id: "solid-green",     text: "Sign Up Free" },
            { id: "solid-purple",    text: "Learn More" },
            { id: "solid-dark",      text: "Contact Us" },
            { id: "outline-blue",    text: "View Plans" },
            { id: "outline-purple",  text: "Upgrade" },
            { id: "pill-blue",       text: "Follow Us" },
            { id: "gradient-purple", text: "Get Premium" },
            { id: "gradient-sunset", text: "Start Free Trial" },
            { id: "shadow-blue",     text: "Press Me" },
            { id: "soft-blue",       text: "View More" },
            { id: "soft-green",      text: "Download" },
            { id: "ghost-blue",      text: "Read More →" },
          ],
        },
      };
  }
};

export default function Home() {
  const [, navigate] = useLocation();
  const [sites, setSites] = useState<WebsiteSite[]>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [starterSite()];
    }

    try {
      const parsed = JSON.parse(saved) as WebsiteSite[];
      // Enforce 1-site limit: only keep the first site
      return parsed.length ? [normalizeSite(parsed[0])] : [starterSite()];
    } catch {
      return [starterSite()];
    }
  });
  const [activeSiteId, setActiveSiteId] = useState(sites[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return new URLSearchParams(window.location.search).has("edit") ? "builder" : "dashboard";
  });
  const [isPreview, setIsPreview] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const { toast } = useToast();

  const activeSite = useMemo(
    () => sites.find((site) => site.id === activeSiteId) ?? sites[0],
    [sites, activeSiteId],
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    if (!activeSite && sites.length) {
      setActiveSiteId(sites[0].id);
    }
  }, [activeSite, sites]);

  const updateActiveSite = (updater: (site: WebsiteSite) => WebsiteSite) => {
    if (!activeSite) return;

    setSites((current) =>
      current.map((site) =>
        site.id === activeSite.id
          ? updater({ ...site, lastEdited: new Date().toISOString(), status: site.status === "live" ? "draft" : site.status })
          : site,
      ),
    );
  };

  const openSite = (siteId: string) => {
    setActiveSiteId(siteId);
    setViewMode("builder");
    setIsPreview(false);
  };

  const addSite = (template: Template) => {
    setSites((current) => {
      if (current.length > 0) {
        return current.map((site, i) =>
          i === 0
            ? { ...site, templateId: template.id, source: "blocks" as const, blocks: cloneBlocks(template.blocks), html: undefined, lastEdited: new Date().toISOString() }
            : site
        );
      }
      const site = createSiteFromTemplate(template);
      return [site];
    });
    setActiveSiteId((id) => id || sites[0]?.id || "");
    setViewMode("builder");
    toast({ title: "Template applied", description: `${template.name} is now your active site.` });
  };

  const addHtmlSite = (template: HtmlTemplate) => {
    setSites((current) => {
      if (current.length > 0) {
        return current.map((site, i) =>
          i === 0
            ? { ...site, templateId: template.id, source: "html" as const, blocks: [], html: template.html, lastEdited: new Date().toISOString() }
            : site
        );
      }
      const site = createSiteFromHtmlTemplate(template);
      return [site];
    });
    setActiveSiteId((id) => id || sites[0]?.id || "");
    setViewMode("builder");
    toast({ title: "Template applied", description: `${template.name} is now your active site.` });
  };

  const scrollToTemplates = () => {
    document.getElementById("template-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  const deleteSite = (siteId: string) => {
    setSites((current) => {
      if (current.length === 1) {
        toast({ title: "Keep one site", description: "Your workspace needs at least one site." });
        return current;
      }

      const next = current.filter((site) => site.id !== siteId);
      if (activeSiteId === siteId) {
        setActiveSiteId(next[0].id);
      }
      return next;
    });
  };

  const updateBlock = (id: string, updated: Block) => {
    updateActiveSite((site) => ({
      ...site,
      blocks: site.blocks.map((block) => (block.id === id ? updated : block)),
    }));
  };

  const deleteBlock = (id: string) => {
    updateActiveSite((site) => ({
      ...site,
      blocks: site.blocks.filter((block) => block.id !== id),
    }));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    updateActiveSite((site) => {
      const index = site.blocks.findIndex((block) => block.id === id);
      const target = direction === "up" ? index - 1 : index + 1;

      if (index < 0 || target < 0 || target >= site.blocks.length) {
        return site;
      }

      const blocks = [...site.blocks];
      const [item] = blocks.splice(index, 1);
      blocks.splice(target, 0, item);
      return { ...site, blocks };
    });
  };

  const addBlock = (type: Block["type"]) => {
    updateActiveSite((site) => ({ ...site, blocks: [...site.blocks, createBlock(type)] }));
  };

  const injectCodeToSite = (code: string) => {
    if (!code.trim()) return;
    if (activeSite.source === "html") {
      const html = activeSite.html ?? "";
      const injected = html.includes("</body>")
        ? html.replace("</body>", `${code}\n</body>`)
        : `${html}\n${code}`;
      updateActiveSite((site) => ({ ...site, html: injected }));
      toast({ title: "Code injected", description: "Your code has been added to the page." });
    } else {
      const newBlock = createBlock("widget");
      newBlock.props = { ...newBlock.props, html: code };
      updateActiveSite((site) => ({ ...site, blocks: [...site.blocks, newBlock] }));
      toast({ title: "Widget added", description: "A widget block with your code has been added." });
    }
  };

  const applyTemplateToActiveSite = (template: Template) => {
    updateActiveSite((site) => ({
      ...site,
      source: "blocks",
      templateId: template.id,
      blocks: cloneBlocks(template.blocks),
      html: undefined,
    }));
    toast({ title: "Template loaded", description: "The builder canvas has been replaced with the selected template." });
  };

  const applyHtmlTemplateToActiveSite = (template: HtmlTemplate) => {
    updateActiveSite((site) => ({
      ...site,
      source: "html",
      templateId: template.id,
      blocks: [],
      html: template.html,
    }));
    toast({ title: "Full HTML template loaded", description: "The original uploaded page is now editable in the builder." });
  };

  const publishSite = () => {
    if (!activeSite) return;

    setSites((current) =>
      current.map((site) =>
        site.id === activeSite.id
          ? { ...site, status: "live", publishedAt: new Date().toISOString(), lastEdited: new Date().toISOString() }
          : site,
      ),
    );
    toast({
      title: "Site marked live",
      description: `${activeSite.slug}.launchsite.local is ready for client preview in this demo.`,
    });
  };

  const exportHtml = () => {
    if (!activeSite) return;

    const html = activeSite.source === "html" ? activeSite.html ?? "" : generateHtml(activeSite.blocks, activeSite.name, activeSite.font);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeSite.slug || "website"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "HTML downloaded", description: "Your current site has been exported as a single HTML file." });
  };

  const copyHtml = async () => {
    if (!activeSite) return;

    await navigator.clipboard.writeText(activeSite.source === "html" ? activeSite.html ?? "" : generateHtml(activeSite.blocks, activeSite.name, activeSite.font));
    toast({ title: "HTML copied", description: "The full page code is now on your clipboard." });
  };

  if (!activeSite) return null;

  const activeFontFamily = GOOGLE_FONTS.find((f) => f.name === activeSite.font)?.family ?? "'Plus Jakarta Sans', sans-serif";

  const generatedHtml = activeSite.source === "html" ? activeSite.html ?? "" : generateHtml(activeSite.blocks, activeSite.name, activeSite.font);
  const liveUrl = `${activeSite.slug}.launchsite.local`;

  if (viewMode === "dashboard") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-slate-950">
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">LaunchSite Studio</h1>
                <p className="text-sm text-slate-500">Website builder service workspace</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-slate-400 sm:block">{getUser()?.email}</span>
              {isAdmin() && (
                <Button variant="outline" onClick={() => navigate("/admin")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button onClick={() => openSite(activeSite.id)} className="gap-2 bg-blue-600 hover:bg-blue-700">
                <PenTool className="h-4 w-4" />
                Edit my site
              </Button>
              <Button
                variant="ghost"
                onClick={() => { logout(); navigate("/login"); }}
                className="gap-2 text-slate-500 hover:text-slate-900"
              >
                Log out
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">
          <section className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-blue-100">
                  <Sparkles className="h-4 w-4" />
                  Build client-ready single page sites
                </div>
                <div className="space-y-3">
                  <h2 className="max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl">A Wix-style service for launching simple websites fast.</h2>
                  <p className="max-w-2xl text-lg leading-8 text-slate-300">
                    Pick a template, edit every section visually, preview mobile layouts, then export your finished page.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={scrollToTemplates} size="lg" className="gap-2 bg-white text-slate-950 hover:bg-blue-50">
                    <LayoutTemplate className="h-4 w-4" />
                    Change template
                  </Button>
                  <Button onClick={() => openSite(activeSite.id)} size="lg" variant="outline" className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <PenTool className="h-4 w-4" />
                    Continue editing
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl">
                <div className="rounded-2xl bg-white p-4 text-slate-950">
                  <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Live workspace</span>
                    <span>1 site</span>
                  </div>
                  <div className="space-y-3">
                    {sites.slice(0, 1).map((site) => (
                      <div key={site.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold">{site.name}</p>
                            <p className="text-xs text-slate-500">{site.slug}.launchsite.local</p>
                          </div>
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${site.status === "live" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {site.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="template-library" className="mb-10 scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Change your site template</h2>
                <p className="text-sm text-slate-500">Pick a new starting point — this will replace your current site design. Your site name and settings are kept.</p>
              </div>
              <div className="flex items-center gap-2">
                <TemplateCounter />
                {isAdmin() && (
                  <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="gap-2">
                    <Settings className="h-3.5 w-3.5" />
                    Manage
                  </Button>
                )}
              </div>
            </div>
            <TemplateLibrary onSelect={addSite} onSelectHtml={addHtmlSite} />
          </section>

          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Your site</h2>
              <p className="text-sm text-slate-500">Edit, preview, and export your site.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sites.slice(0, 1).map((site) => (
              <article key={site.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <button onClick={() => openSite(site.id)} className="block w-full bg-slate-100 p-4 text-left">
                  <div className="h-44 overflow-hidden rounded-2xl bg-white shadow-inner">
                    <div className="origin-top scale-[0.34] w-[300%] pointer-events-none">
                      {site.source === "html" ? (
                        <iframe title={`${site.name} preview`} srcDoc={site.html} className="h-[520px] w-full origin-top scale-[0.34] border-0" />
                      ) : (
                        site.blocks.slice(0, 3).map((block) => (
                          <BlockRenderer key={block.id} block={block} onChange={() => undefined} onDelete={() => undefined} preview />
                        ))
                      )}
                    </div>
                  </div>
                </button>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold tracking-tight">{site.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{site.slug}.launchsite.local</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${site.status === "live" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {site.status === "live" ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                      {site.status === "live" ? "Live" : "Draft"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => openSite(site.id)} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
                      <PenTool className="h-4 w-4" />
                      Edit site
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {!isPreview && (
        <aside className="z-20 flex w-80 shrink-0 flex-col border-r border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <Button variant="ghost" className="mb-4 h-8 gap-2 px-2 text-muted-foreground" onClick={() => setViewMode("dashboard")}>
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Wand2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-extrabold tracking-tight">{activeSite.name}</h1>
                <p className="truncate text-xs text-muted-foreground">{liveUrl}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <Tabs defaultValue="site" className="p-5">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="site">Site</TabsTrigger>
                <TabsTrigger value="add">Add</TabsTrigger>
                <TabsTrigger value="settings">Setup</TabsTrigger>
              </TabsList>

              <TabsContent value="site" className="mt-5 space-y-6">
                {/* Pages */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <FileText className="h-4 w-4" /> Pages
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Home page</span>
                      </div>
                      <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">Active</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-dashed"
                      onClick={() => { setViewMode("dashboard"); setTimeout(() => { document.getElementById("template-library")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
                    >
                      <Plus className="h-4 w-4" />
                      Add new page
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Embeds & Widgets */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Link className="h-4 w-4" /> Quick Embeds
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="h-14 flex-col gap-1 items-start px-3 text-left"
                      onClick={() => injectCodeToSite(`<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:2rem 0"><iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>`)}
                    >
                      <Play className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-semibold">YouTube Video</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex-col gap-1 items-start px-3 text-left"
                      onClick={() => injectCodeToSite(`<div style="margin:2rem 0"><iframe src="https://maps.google.com/maps?q=YOUR+LOCATION&output=embed" width="100%" height="350" style="border:0;border-radius:12px" allowfullscreen loading="lazy"></iframe></div>`)}
                    >
                      <Map className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-semibold">Google Maps</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex-col gap-1 items-start px-3 text-left"
                      onClick={() => injectCodeToSite(`<!-- Calendly inline widget -->\n<div class="calendly-inline-widget" data-url="https://calendly.com/YOUR_LINK" style="min-width:320px;height:630px;margin:2rem 0"></div>\n<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>`)}
                    >
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-semibold">Calendly</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-14 flex-col gap-1 items-start px-3 text-left"
                      onClick={() => injectCodeToSite(`<iframe src="YOUR_EMBED_URL" width="100%" height="400" style="border:0;border-radius:12px;margin:2rem 0" allowfullscreen></iframe>`)}
                    >
                      <Globe2 className="h-4 w-4 text-slate-500" />
                      <span className="text-xs font-semibold">URL / iFrame</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Custom Code */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Code2 className="h-4 w-4" /> Custom Code
                  </h3>
                  <p className="text-xs text-muted-foreground">Paste any HTML, script, or widget code. It will be added to the bottom of the page.</p>
                  <Textarea
                    placeholder={'<script src="...">\n<!-- or any HTML embed -->'}
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    className="font-mono text-xs"
                    rows={5}
                  />
                  <Button
                    className="w-full gap-2"
                    disabled={!customCode.trim()}
                    onClick={() => { injectCodeToSite(customCode); setCustomCode(""); }}
                  >
                    <Code2 className="h-4 w-4" />
                    Add to page
                  </Button>
                </div>

                <Separator />

                {/* Page Sections */}
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Grid3X3 className="h-4 w-4" /> Page sections
                  </h3>
                  <div className="space-y-2">
                    {activeSite.source === "html" ? (
                      <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                        Full HTML template — edit text directly on the page, click images to replace them, and use Delete selected to remove elements.
                      </div>
                    ) : activeSite.blocks.map((block, index) => (
                      <div key={block.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm">
                        <div>
                          <p className="font-semibold">{index + 1}. {blockLabels[block.type]}</p>
                          <p className="text-xs text-muted-foreground">Editable section</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" disabled={index === 0} onClick={() => moveBlock(block.id, "up")}>Up</Button>
                          <Button size="sm" variant="ghost" disabled={index === activeSite.blocks.length - 1} onClick={() => moveBlock(block.id, "down")}>Down</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="add" className="mt-5 space-y-5">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Plus className="h-4 w-4" /> Content Sections
                </h3>
                {activeSite.source === "html" ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Complete HTML templates keep their original structure. Use the in-page editor for text, image, and delete changes.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {(["hero", "features", "text", "image", "footer"] as Block["type"][]).map((type) => (
                        <Button key={type} variant="secondary" onClick={() => addBlock(type)} className="h-12 bg-muted text-sm shadow-none hover:bg-accent">
                          {blockLabels[type]}
                        </Button>
                      ))}
                    </div>
                    <div className="pt-1">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Widgets & Components</p>
                      <div className="grid gap-2">
                        <Button
                          variant="outline"
                          onClick={() => addBlock("widget")}
                          className="h-14 flex-col gap-1 text-left items-start px-4 border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700"
                        >
                          <span className="font-semibold text-sm">Widget / Embed</span>
                          <span className="text-xs font-normal text-blue-500">YouTube, Maps, Calendly, any HTML</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => addBlock("buttons")}
                          className="h-14 flex-col gap-1 text-left items-start px-4 border-violet-200 bg-violet-50/50 hover:bg-violet-50 text-violet-700"
                        >
                          <span className="font-semibold text-sm">Buttons Showcase</span>
                          <span className="text-xs font-normal text-violet-500">24 styles — solid, outline, gradient, 3D</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  Click text directly on the page to edit it. Hover images to replace them. Hover sections to delete them.
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-5 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site name</Label>
                  <Input
                    id="site-name"
                    value={activeSite.name}
                    onChange={(event) =>
                      updateActiveSite((site) => ({
                        ...site,
                        name: event.target.value,
                        slug: toSlug(event.target.value),
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Site font</Label>
                  <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background p-1 space-y-0.5">
                    {GOOGLE_FONTS.map((font) => {
                      const isActive = (activeSite.font ?? "Plus Jakarta Sans") === font.name;
                      return (
                        <button
                          key={font.name}
                          onClick={() => {
                            updateActiveSite((s) => ({ ...s, font: font.name }));
                            const id = `gf-${font.name.replace(/\s+/g, "-")}`;
                            if (!document.getElementById(id)) {
                              const link = document.createElement("link");
                              link.id = id;
                              link.rel = "stylesheet";
                              link.href = `https://fonts.googleapis.com/css2?family=${font.url}&display=swap`;
                              document.head.appendChild(link);
                            }
                          }}
                          style={{ fontFamily: font.family }}
                          className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-muted text-foreground"}`}
                        >
                          {font.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Applies to all text on the page and the exported HTML.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-slug">Site address</Label>
                  <div className="flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                    <Input
                      id="site-slug"
                      value={activeSite.slug}
                      onChange={(event) => updateActiveSite((site) => ({ ...site, slug: toSlug(event.target.value) }))}
                      className="border-0 focus-visible:ring-0"
                    />
                    <span className="flex items-center pr-3 text-xs text-muted-foreground">.launchsite.local</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Status</span>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${activeSite.status === "live" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {activeSite.status === "live" ? "Live" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Publishing in this demo creates a client-preview status and address. Export downloads the actual HTML file.</p>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </aside>
      )}

      <div className="relative flex flex-1 flex-col bg-muted/20">
        <header className="z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {isPreview ? (
              <div className="flex rounded-md bg-muted p-1">
                <Button variant={deviceMode === "desktop" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setDeviceMode("desktop")}>
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button variant={deviceMode === "mobile" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setDeviceMode("mobile")}>
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
                <FileText className="h-4 w-4" />
                Home page
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant={isPreview ? "secondary" : "default"} onClick={() => setIsPreview(!isPreview)} className="gap-2">
              {isPreview ? <PenTool className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreview ? "Back to edit" : "Preview"}
            </Button>
            <Button variant="outline" onClick={() => setShowCodeDialog(true)} className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </Button>
            <Button variant="outline" onClick={exportHtml} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={publishSite} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Rocket className="h-4 w-4" />
              Publish
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div
            style={{ fontFamily: activeFontFamily }}
            className={`mx-auto transition-all duration-300 ${isPreview ? (deviceMode === "mobile" ? "my-8 min-h-[800px] max-w-[400px] overflow-hidden rounded-3xl border-x border-border bg-background shadow-2xl" : "max-w-none bg-background") : "max-w-[1200px] space-y-4 p-8"}`}
          >
            {activeSite.source === "html" ? (
              <HtmlTemplateEditor
                html={activeSite.html ?? ""}
                onChange={(html) => updateActiveSite((site) => ({ ...site, html }))}
                preview={isPreview}
                deviceMode={deviceMode}
              />
            ) : activeSite.blocks.length === 0 ? (
              <div className="flex h-[60vh] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground">
                <LayoutTemplate className="mb-4 h-12 w-12 opacity-20" />
                <p className="text-lg font-medium">Your page is empty</p>
                <p className="text-sm">Choose a template or add a section from the left panel.</p>
              </div>
            ) : (
              activeSite.blocks.map((block) => (
                <div key={block.id} className={isPreview ? "" : "overflow-hidden rounded-xl border border-border/40 bg-background shadow-sm"}>
                  <BlockRenderer block={block} onChange={(updated) => updateBlock(block.id, updated)} onDelete={() => deleteBlock(block.id)} preview={isPreview} />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generated HTML</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={copyHtml} className="gap-2"><Code className="h-4 w-4" />Copy code</Button>
              <Button onClick={exportHtml} variant="outline" className="gap-2"><Download className="h-4 w-4" />Download HTML</Button>
            </div>
            <pre className="max-h-[520px] overflow-auto rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
              <code>{generatedHtml}</code>
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateCounter() {
  const [count, setCount] = useState(TEMPLATES.length + HTML_TEMPLATES.length + getCustomTemplates().length);
  useEffect(() => {
    const update = () => setCount(TEMPLATES.length + HTML_TEMPLATES.length + getCustomTemplates().length);
    update();
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    window.addEventListener("visibilitychange", update);
    window.addEventListener(ADMIN_STORAGE_EVENT, update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
      window.removeEventListener("visibilitychange", update);
      window.removeEventListener(ADMIN_STORAGE_EVENT, update);
    };
  }, []);
  return (
    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
      {count} templates available
    </div>
  );
}

type TemplateCardItem =
  | { kind: "block"; template: Template }
  | { kind: "html"; template: { id: string; name: string; description: string; html: string; categoryId?: string | null; isCustom?: boolean } };

function TemplateCard({
  item,
  category,
  onSelect,
  onSelectHtml,
  onDelete,
}: {
  item: TemplateCardItem;
  category?: Category | null;
  onSelect: (t: Template) => void;
  onSelectHtml: (t: HtmlTemplate) => void;
  onDelete?: () => void;
}) {
  if (item.kind === "block") {
    const t = item.template;
    return (
      <button
        onClick={() => onSelect(t)}
        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div className="h-48 overflow-hidden bg-slate-100">
          <div className="origin-top-left pointer-events-none" style={{ transform: "scale(0.3)", width: "333%", transformOrigin: "top left" }}>
            {t.blocks.slice(0, 3).map((block) => (
              <BlockRenderer key={block.id} block={block} onChange={() => undefined} onDelete={() => undefined} preview />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-slate-900 truncate">{t.name}</h3>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
              Built-in
            </span>
          </div>
        </div>
      </button>
    );
  }

  const t = item.template;
  const isCustom = !!t.isCustom;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button
        onClick={() => onSelectHtml({ id: t.id, name: t.name, description: t.description, html: t.html })}
        className="w-full text-left"
      >
        <div className="h-48 overflow-hidden bg-slate-100">
          <iframe
            title={`${t.name} preview`}
            srcDoc={t.html}
            className="h-[600px] w-full border-0 pointer-events-none"
            style={{ transform: "scale(0.3)", transformOrigin: "top left", width: "333%" }}
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-4 py-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold tracking-tight text-slate-900 truncate">{t.name}</h3>
            {category ? (
              <span
                className="mt-1.5 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            ) : isCustom ? (
              <span className="mt-1.5 inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700">
                Custom
              </span>
            ) : (
              <span className="mt-1.5 inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
                Built-in
              </span>
            )}
          </div>
          {isCustom && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const confirmed = window.confirm(`Delete "${t.name}"?`);
                if (confirmed) onDelete();
              }}
              className="shrink-0 rounded-full p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </button>
    </div>
  );
}

function TemplateCategorySection({
  label,
  color,
  items,
  categories,
  onSelect,
  onSelectHtml,
  onDelete,
}: {
  label: string;
  color?: string;
  items: TemplateCardItem[];
  categories: Category[];
  onSelect: (t: Template) => void;
  onSelectHtml: (t: HtmlTemplate) => void;
  onDelete: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        {color && <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />}
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">{label}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{items.length}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const catId = item.kind === "html" ? item.template.categoryId : null;
          const cat = catId ? categories.find((c) => c.id === catId) : null;
          const id = item.kind === "block" ? item.template.id : item.template.id;
          return (
            <TemplateCard
              key={id}
              item={item}
              category={cat}
              onSelect={onSelect}
              onSelectHtml={onSelectHtml}
              onDelete={item.kind === "html" && item.template.isCustom ? () => onDelete(id) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

function TemplateLibrary({ onSelect, onSelectHtml }: { onSelect: (template: Template) => void; onSelectHtml: (template: HtmlTemplate) => void }) {
  const [customTemplates, setCustomTemplates] = useState<CustomHtmlTemplate[]>(() => getCustomTemplates());
  const [categories, setCategories] = useState<Category[]>(() => getCategories());

  useEffect(() => {
    const update = () => {
      setCustomTemplates(getCustomTemplates());
      setCategories(getCategories());
    };
    update();
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    window.addEventListener("visibilitychange", update);
    window.addEventListener(ADMIN_STORAGE_EVENT, update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
      window.removeEventListener("visibilitychange", update);
      window.removeEventListener(ADMIN_STORAGE_EVENT, update);
    };
  }, []);

  const handleDelete = (id: string) => {
    const stored: CustomHtmlTemplate[] = JSON.parse(localStorage.getItem("launchsite-admin-templates") ?? "[]");
    localStorage.setItem("launchsite-admin-templates", JSON.stringify(stored.filter((t) => t.id !== id)));
    window.dispatchEvent(new CustomEvent(ADMIN_STORAGE_EVENT));
  };

  const builtInItems: TemplateCardItem[] = [
    ...TEMPLATES.map((t): TemplateCardItem => ({ kind: "block", template: t })),
    ...HTML_TEMPLATES.map((t): TemplateCardItem => ({ kind: "html", template: { ...t, categoryId: null, isCustom: false } })),
  ];

  const sections: Array<{ label: string; color?: string; items: TemplateCardItem[] }> = [
    { label: "Built-in", items: builtInItems },
    ...categories.map((cat) => ({
      label: cat.name,
      color: cat.color,
      items: customTemplates
        .filter((t) => t.categoryId === cat.id)
        .map((t): TemplateCardItem => ({ kind: "html", template: { ...t, isCustom: true } })),
    })),
  ];

  const uncategorizedCustom = customTemplates.filter((t) => !t.categoryId);
  if (uncategorizedCustom.length > 0) {
    sections.push({
      label: "Custom",
      items: uncategorizedCustom.map((t): TemplateCardItem => ({ kind: "html", template: { ...t, isCustom: true } })),
    });
  }

  return (
    <div>
      {sections.map((section) => (
        <TemplateCategorySection
          key={section.label}
          label={section.label}
          color={section.color}
          items={section.items}
          categories={categories}
          onSelect={onSelect}
          onSelectHtml={onSelectHtml}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
