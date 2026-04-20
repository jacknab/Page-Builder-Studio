import { useState } from "react";
import { useLocation } from "wouter";
import {
  addCategory,
  addCustomTemplate,
  deleteCategory,
  deleteCustomTemplate,
  getCategories,
  getCustomTemplates,
  saveCategories,
  saveCustomTemplates,
  CATEGORY_COLORS,
  type Category,
  type CustomHtmlTemplate,
} from "@/lib/adminStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FolderOpen,
  LayoutTemplate,
  Plus,
  Trash2,
  Wand2,
  Eye,
  Tag,
  Sparkles,
  Loader2,
  RefreshCw,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type AiTemplate = {
  id: number;
  name: string;
  type: string;
  style: string;
  description: string;
  html: string;
  createdAt: string;
};

const STYLES = [
  { value: "luxury", label: "Luxury", desc: "Dark tones, gold accents, premium feel" },
  { value: "modern", label: "Modern", desc: "Clean, minimal, tech-forward" },
  { value: "minimal", label: "Minimal", desc: "Whitespace, muted palette, elegant" },
  { value: "bold", label: "Bold", desc: "Vibrant colors, strong contrast" },
];

const BATCH_STYLES = ["luxury", "modern", "minimal", "bold"];

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"categories" | "templates" | "ai-generate">("ai-generate");

  const [categories, setCategories] = useState<Category[]>(() => getCategories());
  const [customTemplates, setCustomTemplates] = useState<CustomHtmlTemplate[]>(() => getCustomTemplates());

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0].value);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [newTemplateCategoryId, setNewTemplateCategoryId] = useState<string>("none");
  const [newTemplateHtml, setNewTemplateHtml] = useState("");

  const [previewTemplate, setPreviewTemplate] = useState<{ name: string; html: string } | null>(null);

  // AI Generate state
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [generating, setGenerating] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [aiTemplates, setAiTemplates] = useState<AiTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const refreshData = () => {
    setCategories(getCategories());
    setCustomTemplates(getCustomTemplates());
  };

  const fetchAiTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch(`${API_BASE}/api/templates?type=nail-salon`);
      const data = await res.json();
      setAiTemplates(data.templates ?? []);
    } catch {
      toast({ title: "Error", description: "Could not load AI templates.", variant: "destructive" });
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleGenerateSingle = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/templates/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "nail-salon", style: selectedStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      toast({ title: "Template created!", description: `"${data.template.name}" is ready.` });
      await fetchAiTemplates();
    } catch (err: unknown) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateBatch = async () => {
    setBatchGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/templates/generate-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "nail-salon", styles: BATCH_STYLES }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Batch generation failed");
      toast({
        title: "Batch complete!",
        description: `${data.templates.length} templates generated${data.failures > 0 ? `, ${data.failures} failed` : ""}.`,
      });
      await fetchAiTemplates();
    } catch (err: unknown) {
      toast({
        title: "Batch failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setBatchGenerating(false);
    }
  };

  const handleDeleteAiTemplate = async (id: number, name: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAiTemplates((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Deleted", description: `"${name}" has been removed.` });
    } catch {
      toast({ title: "Error", description: "Could not delete template.", variant: "destructive" });
    }
  };

  const handleRename = async (id: number) => {
    if (!editingName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Rename failed");
      setAiTemplates((prev) => prev.map((t) => (t.id === id ? data.template : t)));
      setEditingId(null);
      setEditingName("");
      toast({ title: "Renamed", description: `Template renamed successfully.` });
    } catch {
      toast({ title: "Error", description: "Could not rename template.", variant: "destructive" });
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Name required", description: "Please enter a category name.", variant: "destructive" });
      return;
    }
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName("");
    setNewCategoryColor(CATEGORY_COLORS[0].value);
    refreshData();
    toast({ title: "Category created", description: `"${newCategoryName.trim()}" is ready to use.` });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    deleteCategory(id);
    refreshData();
    toast({ title: "Category deleted", description: `"${name}" has been removed.` });
  };

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({ title: "Name required", description: "Please enter a template name.", variant: "destructive" });
      return;
    }
    if (!newTemplateHtml.trim()) {
      toast({ title: "HTML required", description: "Please paste your HTML content.", variant: "destructive" });
      return;
    }
    addCustomTemplate(
      newTemplateName.trim(),
      newTemplateDescription.trim(),
      newTemplateHtml.trim(),
      newTemplateCategoryId === "none" ? null : newTemplateCategoryId
    );
    setNewTemplateName("");
    setNewTemplateDescription("");
    setNewTemplateCategoryId("none");
    setNewTemplateHtml("");
    refreshData();
    toast({ title: "Template added", description: `"${newTemplateName.trim()}" is now available.` });
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    deleteCustomTemplate(id);
    refreshData();
    toast({ title: "Template deleted", description: `"${name}" has been removed.` });
  };

  const getCategoryById = (id: string | null) =>
    id ? categories.find((c) => c.id === id) : null;

  const styleLabel = (style: string) =>
    STYLES.find((s) => s.value === style)?.label ?? style;

  const STYLE_BADGE: Record<string, string> = {
    luxury: "bg-yellow-100 text-yellow-800",
    modern: "bg-blue-100 text-blue-800",
    minimal: "bg-slate-100 text-slate-700",
    bold: "bg-pink-100 text-pink-800",
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">LaunchSite Admin</h1>
              <p className="text-sm text-slate-500">Manage categories, templates & AI generation</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/app")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to studio
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => { setActiveTab("ai-generate"); fetchAiTemplates(); }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              activeTab === "ai-generate"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            AI Generate
            {aiTemplates.length > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "ai-generate" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                {aiTemplates.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              activeTab === "categories"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Tag className="h-4 w-4" />
            Categories
            {categories.length > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "categories" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                {categories.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
              activeTab === "templates"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <LayoutTemplate className="h-4 w-4" />
            Custom Templates
            {customTemplates.length > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "templates" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                {customTemplates.length}
              </span>
            )}
          </button>
        </div>

        {/* AI GENERATE TAB */}
        {activeTab === "ai-generate" && (
          <div className="space-y-6">
            {/* Generator controls */}
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold tracking-tight">Nail Salon Template Generator</h2>
              </div>
              <p className="text-sm text-slate-500 mb-6">
                Use AI to generate a complete, fully-responsive HTML website template for nail salons. Each template includes a hero, services, gallery, and contact section.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-2 block text-sm font-semibold">Business type</Label>
                  <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700">
                    💅 Nail Salon
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-semibold">Style</Label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STYLES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          <div>
                            <span className="font-semibold">{s.label}</span>
                            <span className="ml-2 text-xs text-slate-400">{s.desc}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={handleGenerateSingle}
                  disabled={generating || batchGenerating}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {generating ? "Generating…" : "Generate Template"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateBatch}
                  disabled={generating || batchGenerating}
                  className="gap-2"
                >
                  {batchGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  {batchGenerating ? "Generating all 4…" : "Generate All 4 Styles"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchAiTemplates}
                  disabled={loadingTemplates}
                  title="Refresh list"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingTemplates ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Generated templates list */}
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <LayoutTemplate className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold tracking-tight">Generated Templates</h2>
                <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                  {aiTemplates.length} nail salon
                </span>
              </div>

              {loadingTemplates ? (
                <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading templates…</span>
                </div>
              ) : aiTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Sparkles className="h-10 w-10 mb-3 opacity-30" />
                  <p className="font-semibold">No AI templates yet</p>
                  <p className="text-sm">Click "Generate Template" above to create your first one.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {aiTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="relative h-36 overflow-hidden bg-slate-200">
                        <iframe
                          title={tpl.name}
                          srcDoc={tpl.html}
                          className="h-[520px] w-full border-0 pointer-events-none"
                          style={{ transform: "scale(0.27)", transformOrigin: "top left", width: "370%" }}
                        />
                        <button
                          onClick={() => setPreviewTemplate({ name: tpl.name, html: tpl.html })}
                          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"
                        >
                          <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow">
                            <Eye className="h-4 w-4" />
                            Preview
                          </span>
                        </button>
                      </div>
                      <div className="p-4">
                        {editingId === tpl.id ? (
                          <div className="flex items-center gap-2 mb-2">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleRename(tpl.id);
                                if (e.key === "Escape") { setEditingId(null); setEditingName(""); }
                              }}
                            />
                            <Button size="icon" className="h-8 w-8 shrink-0 bg-blue-600 hover:bg-blue-700" onClick={() => handleRename(tpl.id)}>
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => { setEditingId(null); setEditingName(""); }}>
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-extrabold text-slate-900 truncate">{tpl.name}</h3>
                              {tpl.description && (
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tpl.description}</p>
                              )}
                              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${STYLE_BADGE[tpl.style] ?? "bg-slate-100 text-slate-700"}`}>
                                  {styleLabel(tpl.style)}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(tpl.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                onClick={() => { setEditingId(tpl.id); setEditingName(tpl.name); }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteAiTemplate(tpl.id, tpl.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] items-start">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold tracking-tight">All categories</h2>
              </div>
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Tag className="h-10 w-10 mb-3 opacity-30" />
                  <p className="font-semibold">No categories yet</p>
                  <p className="text-sm">Create a category to organize your templates.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat) => {
                    const templateCount = customTemplates.filter((t) => t.categoryId === cat.id).length;
                    return (
                      <div key={cat.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                          <div>
                            <p className="font-bold text-slate-900">{cat.name}</p>
                            <p className="text-xs text-slate-500">{templateCount} template{templateCount !== 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteCategory(cat.id, cat.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-5">
                <Plus className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold tracking-tight">New category</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cat-name" className="mb-1.5 block text-sm font-semibold">Name</Label>
                  <Input id="cat-name" placeholder="e.g. Restaurants, Salons, Startups…" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((color) => (
                      <button key={color.value} title={color.label} onClick={() => setNewCategoryColor(color.value)} className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${newCategoryColor === color.value ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : ""}`} style={{ backgroundColor: color.value }} />
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddCategory} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Create category
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM TEMPLATES TAB */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Plus className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold tracking-tight">Add new template</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="tpl-name" className="mb-1.5 block text-sm font-semibold">Template name *</Label>
                  <Input id="tpl-name" placeholder="e.g. Downtown Nail Studio" value={newTemplateName} onChange={(e) => setNewTemplateName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="tpl-cat" className="mb-1.5 block text-sm font-semibold">Category</Label>
                  <Select value={newTemplateCategoryId} onValueChange={setNewTemplateCategoryId}>
                    <SelectTrigger id="tpl-cat">
                      <SelectValue placeholder="No category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No category</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <span className="flex items-center gap-2">
                            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            {cat.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="mt-1 text-xs text-slate-400">No categories yet — <button className="underline text-blue-600" onClick={() => setActiveTab("categories")}>create one first</button></p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="tpl-desc" className="mb-1.5 block text-sm font-semibold">Description</Label>
                  <Input id="tpl-desc" placeholder="Short description shown in the template library" value={newTemplateDescription} onChange={(e) => setNewTemplateDescription(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="tpl-html" className="mb-1.5 block text-sm font-semibold">HTML content *</Label>
                  <Textarea id="tpl-html" placeholder="Paste your full HTML page code here (including <!DOCTYPE html>)…" value={newTemplateHtml} onChange={(e) => setNewTemplateHtml(e.target.value)} className="min-h-[200px] font-mono text-xs" />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={handleAddTemplate} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Add template
                </Button>
                {newTemplateHtml.trim() && (
                  <Button variant="outline" onClick={() => setPreviewTemplate({ name: newTemplateName || "Preview", html: newTemplateHtml })} className="gap-2">
                    <Eye className="h-4 w-4" />
                    Preview HTML
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <LayoutTemplate className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold tracking-tight">Custom templates</h2>
                <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{customTemplates.length} total</span>
              </div>
              {customTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <LayoutTemplate className="h-10 w-10 mb-3 opacity-30" />
                  <p className="font-semibold">No custom templates yet</p>
                  <p className="text-sm">Paste HTML above to add your first template.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {customTemplates.map((tpl) => {
                    const category = getCategoryById(tpl.categoryId);
                    return (
                      <div key={tpl.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="relative h-36 overflow-hidden bg-slate-200">
                          <iframe title={tpl.name} srcDoc={tpl.html} className="h-[520px] w-full origin-top border-0 pointer-events-none" style={{ transform: "scale(0.27)", transformOrigin: "top left", width: "370%" }} />
                          <button onClick={() => setPreviewTemplate({ name: tpl.name, html: tpl.html })} className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow">
                              <Eye className="h-4 w-4" />
                              Preview
                            </span>
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-slate-900 truncate">{tpl.name}</h3>
                              {tpl.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tpl.description}</p>}
                              {category && (
                                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: category.color }}>
                                  {category.name}
                                </span>
                              )}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name} — Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
            {previewTemplate && (
              <iframe title="Template preview" srcDoc={previewTemplate.html} className="h-full w-full border-0" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
