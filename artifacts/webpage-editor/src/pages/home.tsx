import { useEffect, useMemo, useState } from "react";
import { Block, TEMPLATES, Template, generateId } from "@/lib/templates";
import { HTML_TEMPLATES, HtmlTemplate } from "@/lib/htmlTemplates";
import { BlockRenderer } from "@/components/editor/blocks";
import { HtmlTemplateEditor } from "@/components/editor/HtmlTemplateEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateHtml } from "@/lib/export";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code,
  Download,
  Eye,
  FileText,
  Globe2,
  Grid3X3,
  LayoutTemplate,
  Monitor,
  PenTool,
  Plus,
  Rocket,
  Settings,
  Smartphone,
  Sparkles,
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
  }
};

export default function Home() {
  const [sites, setSites] = useState<WebsiteSite[]>(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [starterSite()];
    }

    try {
      const parsed = JSON.parse(saved) as WebsiteSite[];
      return parsed.length ? parsed.map(normalizeSite) : [starterSite()];
    } catch {
      return [starterSite()];
    }
  });
  const [activeSiteId, setActiveSiteId] = useState(sites[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [isPreview, setIsPreview] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [showCodeDialog, setShowCodeDialog] = useState(false);
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
    const site = createSiteFromTemplate(template);
    setSites((current) => [site, ...current]);
    setActiveSiteId(site.id);
    setViewMode("builder");
    toast({ title: "Site created", description: `${site.name} is ready to edit.` });
  };

  const addHtmlSite = (template: HtmlTemplate) => {
    const site = createSiteFromHtmlTemplate(template);
    setSites((current) => [site, ...current]);
    setActiveSiteId(site.id);
    setViewMode("builder");
    toast({ title: "HTML template added", description: `${site.name} is loaded with its original design.` });
  };

  const scrollToTemplates = () => {
    document.getElementById("template-library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const duplicateSite = (site: WebsiteSite) => {
    const copy: WebsiteSite = {
      ...site,
      id: generateId(),
      name: `${site.name} Copy`,
      slug: `${site.slug}-copy`,
      status: "draft",
      source: site.source,
      blocks: cloneBlocks(site.blocks),
      html: site.html,
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString(),
      publishedAt: undefined,
    };

    setSites((current) => [copy, ...current]);
    toast({ title: "Site duplicated", description: `${copy.name} has been added to your workspace.` });
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

    const html = activeSite.source === "html" ? activeSite.html ?? "" : generateHtml(activeSite.blocks, activeSite.name);
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

    await navigator.clipboard.writeText(activeSite.source === "html" ? activeSite.html ?? "" : generateHtml(activeSite.blocks, activeSite.name));
    toast({ title: "HTML copied", description: "The full page code is now on your clipboard." });
  };

  if (!activeSite) return null;

  const generatedHtml = activeSite.source === "html" ? activeSite.html ?? "" : generateHtml(activeSite.blocks, activeSite.name);
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
            <Button onClick={scrollToTemplates} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Create new site
            </Button>
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
                    Pick a template, edit every section visually, manage multiple customer sites, preview mobile layouts, then export the finished page.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={scrollToTemplates} size="lg" className="gap-2 bg-white text-slate-950 hover:bg-blue-50">
                    <LayoutTemplate className="h-4 w-4" />
                    Browse templates
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
                    <span>{sites.length} site{sites.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="space-y-3">
                    {sites.slice(0, 3).map((site) => (
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
                <h2 className="text-2xl font-extrabold tracking-tight">Template library</h2>
                <p className="text-sm text-slate-500">Choose a starter page below. No popup needed — browse and launch directly from here.</p>
              </div>
              <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                {TEMPLATES.length + HTML_TEMPLATES.length} templates available
              </div>
            </div>
            <TemplateLibrary onSelect={addSite} onSelectHtml={addHtmlSite} />
          </section>

          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Your sites</h2>
              <p className="text-sm text-slate-500">Create, edit, duplicate, and export customer-ready pages.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sites.map((site) => (
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
                      Edit
                    </Button>
                    <Button onClick={() => duplicateSite(site)} variant="outline">Duplicate</Button>
                    <Button onClick={() => deleteSite(site.id)} variant="outline">Delete</Button>
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
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <LayoutTemplate className="h-4 w-4" /> Templates
                  </h3>
                  <div className="grid gap-2">
                    {TEMPLATES.map((template) => (
                      <Button
                        key={template.id}
                        variant={activeSite.templateId === template.id ? "default" : "outline"}
                        className="block h-auto w-full justify-start px-4 py-3 text-left"
                        onClick={() => applyTemplateToActiveSite(template)}
                      >
                        <span className="block font-semibold">{template.name}</span>
                        <span className="block whitespace-normal text-xs font-normal opacity-75">{template.description}</span>
                      </Button>
                    ))}
                    {HTML_TEMPLATES.map((template) => (
                      <Button
                        key={template.id}
                        variant={activeSite.templateId === template.id ? "default" : "outline"}
                        className="block h-auto w-full justify-start px-4 py-3 text-left"
                        onClick={() => applyHtmlTemplateToActiveSite(template)}
                      >
                        <span className="block font-semibold">{template.name}</span>
                        <span className="block whitespace-normal text-xs font-normal opacity-75">{template.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Grid3X3 className="h-4 w-4" /> Page sections
                  </h3>
                  <div className="space-y-2">
                    {activeSite.source === "html" ? (
                      <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
                        This is a complete HTML page template. Edit text directly inside the page, click images to replace them, and use Delete selected for unwanted elements.
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

              <TabsContent value="add" className="mt-5 space-y-4">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Plus className="h-4 w-4" /> Add a section
                </h3>
                {activeSite.source === "html" ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                    Complete HTML templates keep their original structure. Use the in-page editor for text, image, and delete changes.
                  </div>
                ) : <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(blockLabels) as Block["type"][]).map((type) => (
                    <Button key={type} variant="secondary" onClick={() => addBlock(type)} className="h-12 bg-muted text-sm shadow-none hover:bg-accent">
                      {blockLabels[type]}
                    </Button>
                  ))}
                </div>}
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
          <div className={`mx-auto transition-all duration-300 ${isPreview ? (deviceMode === "mobile" ? "my-8 min-h-[800px] max-w-[400px] overflow-hidden rounded-3xl border-x border-border bg-background shadow-2xl" : "max-w-none bg-background") : "max-w-[1200px] space-y-4 p-8"}`}>
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

function TemplateLibrary({ onSelect, onSelectHtml }: { onSelect: (template: Template) => void; onSelectHtml: (template: HtmlTemplate) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {TEMPLATES.map((template) => (
        <button key={template.id} onClick={() => onSelect(template)} className="group rounded-3xl border border-border bg-card p-4 text-left transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-4 h-40 overflow-hidden rounded-2xl bg-muted">
            <div className="origin-top scale-[0.28] w-[360%] pointer-events-none">
              {template.blocks.slice(0, 3).map((block) => (
                <BlockRenderer key={block.id} block={block} onChange={() => undefined} onDelete={() => undefined} preview />
              ))}
            </div>
          </div>
          <h3 className="text-lg font-extrabold tracking-tight">{template.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
            Use this template
            <Globe2 className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </button>
      ))}
      {HTML_TEMPLATES.map((template) => (
        <button key={template.id} onClick={() => onSelectHtml(template)} className="group rounded-3xl border border-border bg-card p-4 text-left transition hover:-translate-y-1 hover:shadow-xl">
          <div className="mb-4 h-40 overflow-hidden rounded-2xl bg-muted">
            <iframe title={`${template.name} preview`} srcDoc={template.html} className="h-[520px] w-full origin-top scale-[0.28] border-0" />
          </div>
          <h3 className="text-lg font-extrabold tracking-tight">{template.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
            Use full HTML template
            <Globe2 className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </button>
      ))}
    </div>
  );
}
