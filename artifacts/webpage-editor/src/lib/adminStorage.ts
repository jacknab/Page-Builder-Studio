export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface CustomHtmlTemplate {
  id: string;
  name: string;
  description: string;
  categoryId: string | null;
  html: string;
  createdAt: string;
}

const CATEGORIES_KEY = "launchsite-admin-categories";
const TEMPLATES_KEY = "launchsite-admin-templates";
export const ADMIN_STORAGE_EVENT = "launchsite-admin-storage-change";

const generateId = () => Math.random().toString(36).substr(2, 9);

function notifyAdminStorageChange(): void {
  window.dispatchEvent(new CustomEvent(ADMIN_STORAGE_EVENT));
}

export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch {
    return [];
  }
}

export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  notifyAdminStorageChange();
}

export function addCategory(name: string, color: string): Category {
  const categories = getCategories();
  const category: Category = {
    id: generateId(),
    name: name.trim(),
    color,
    createdAt: new Date().toISOString(),
  };
  saveCategories([...categories, category]);
  return category;
}

export function deleteCategory(id: string): void {
  const categories = getCategories().filter((c) => c.id !== id);
  saveCategories(categories);
  const templates = getCustomTemplates().map((t) =>
    t.categoryId === id ? { ...t, categoryId: null } : t
  );
  saveCustomTemplates(templates);
}

export function getCustomTemplates(): CustomHtmlTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    return raw ? (JSON.parse(raw) as CustomHtmlTemplate[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomTemplates(templates: CustomHtmlTemplate[]): void {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  notifyAdminStorageChange();
}

export function addCustomTemplate(
  name: string,
  description: string,
  html: string,
  categoryId: string | null
): CustomHtmlTemplate {
  const templates = getCustomTemplates();
  const template: CustomHtmlTemplate = {
    id: generateId(),
    name: name.trim(),
    description: description.trim(),
    categoryId,
    html,
    createdAt: new Date().toISOString(),
  };
  saveCustomTemplates([...templates, template]);
  return template;
}

export function deleteCustomTemplate(id: string): void {
  saveCustomTemplates(getCustomTemplates().filter((t) => t.id !== id));
}

export const CATEGORY_COLORS = [
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Purple", value: "#a855f7" },
  { label: "Orange", value: "#f97316" },
  { label: "Pink", value: "#ec4899" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Red", value: "#ef4444" },
];
