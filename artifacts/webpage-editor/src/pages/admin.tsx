import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FolderOpen,
  LayoutTemplate,
  Plus,
  Trash2,
  Wand2,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"categories" | "templates">("categories");

  const [categories, setCategories] = useState<Category[]>(() => getCategories());
  const [customTemplates, setCustomTemplates] = useState<CustomHtmlTemplate[]>(() => getCustomTemplates());

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0].value);

  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [newTemplateCategoryId, setNewTemplateCategoryId] = useState<string>("none");
  const [newTemplateHtml, setNewTemplateHtml] = useState("");

  const [previewTemplate, setPreviewTemplate] = useState<CustomHtmlTemplate | null>(null);

  const refreshData = () => {
    setCategories(getCategories());
    setCustomTemplates(getCustomTemplates());
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
    toast({ title: "Category deleted", description: `"${name}" has been removed. Templates were uncategorized.` });
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
    toast({ title: "Template added", description: `"${newTemplateName.trim()}" is now available in the template library.` });
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    deleteCustomTemplate(id);
    refreshData();
    toast({ title: "Template deleted", description: `"${name}" has been removed.` });
  };

  const getCategoryById = (id: string | null) =>
    id ? categories.find((c) => c.id === id) : null;

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
              <p className="text-sm text-slate-500">Manage categories and templates</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to studio
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex gap-2 mb-8">
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
            Templates
            {customTemplates.length > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs ${activeTab === "templates" ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                {customTemplates.length}
              </span>
            )}
          </button>
        </div>

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
                      <div
                        key={cat.id}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cat.color }}
                          />
                          <div>
                            <p className="font-bold text-slate-900">{cat.name}</p>
                            <p className="text-xs text-slate-500">
                              {templateCount} template{templateCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        >
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
                  <Label htmlFor="cat-name" className="mb-1.5 block text-sm font-semibold">
                    Name
                  </Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g. Restaurants, Salons, Startups…"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block text-sm font-semibold">Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_COLORS.map((color) => (
                      <button
                        key={color.value}
                        title={color.label}
                        onClick={() => setNewCategoryColor(color.value)}
                        className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
                          newCategoryColor === color.value ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
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
                  <Input
                    id="tpl-name"
                    placeholder="e.g. Downtown Barber Shop"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                  />
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
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cat.color }}
                            />
                            {cat.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      No categories yet —{" "}
                      <button className="underline text-blue-600" onClick={() => setActiveTab("categories")}>
                        create one first
                      </button>
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="tpl-desc" className="mb-1.5 block text-sm font-semibold">Description</Label>
                  <Input
                    id="tpl-desc"
                    placeholder="Short description shown in the template library"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="tpl-html" className="mb-1.5 block text-sm font-semibold">
                    HTML content *
                  </Label>
                  <Textarea
                    id="tpl-html"
                    placeholder="Paste your full HTML page code here (including <!DOCTYPE html>)…"
                    value={newTemplateHtml}
                    onChange={(e) => setNewTemplateHtml(e.target.value)}
                    className="min-h-[200px] font-mono text-xs"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={handleAddTemplate} className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  Add template
                </Button>
                {newTemplateHtml.trim() && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      setPreviewTemplate({
                        id: "preview",
                        name: newTemplateName || "Preview",
                        description: "",
                        categoryId: null,
                        html: newTemplateHtml,
                        createdAt: "",
                      })
                    }
                    className="gap-2"
                  >
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
                <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                  {customTemplates.length} total
                </span>
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
                      <div
                        key={tpl.id}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                      >
                        <div className="relative h-36 overflow-hidden bg-slate-200">
                          <iframe
                            title={tpl.name}
                            srcDoc={tpl.html}
                            className="h-[520px] w-full origin-top border-0 pointer-events-none"
                            style={{ transform: "scale(0.27)", transformOrigin: "top left", width: "370%" }}
                          />
                          <button
                            onClick={() => setPreviewTemplate(tpl)}
                            className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100"
                          >
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
                              {tpl.description && (
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tpl.description}</p>
                              )}
                              {category && (
                                <span
                                  className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.name}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                            >
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
              <iframe
                title="Template preview"
                srcDoc={previewTemplate.html}
                className="h-full w-full border-0"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
