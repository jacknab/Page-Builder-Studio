import { BARBER_IMAGE_LIST as B } from "./barbershopImages";

export interface LaunchsiteTemplate {
  id: string;
  name: string;
  description: string;
  businessType: string;
  heroImage: string;
  accentColor: string;
  bgColor: string;
  style: string;
}

export interface TemplateCategory {
  type: "barbershop" | "nail-salon" | "hair-salon" | "haircut-studio";
  label: string;
  emoji: string;
  description: string;
  port: number;
  heroImage: string;
  available: boolean;
}

/* Nail / Hair / Studio images (unchanged) */
const PEXELS_NAILS_1   = "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800";
const PEXELS_NAILS_2   = "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=800";
const THUMB_NS_EMERALD = "/thumb-ns-emerald-glam.png";
const THUMB_NS_NUDE    = "/thumb-ns-nude-studio.png";
const THUMB_NS_SAGE    = "/thumb-ns-sage-linen.png";
const THUMB_NS_BLUSH   = "/thumb-ns-blush-luxe.png";
const THUMB_NS_IVORY   = "/thumb-ns-ivory-gold.png";
const PEXELS_HAIR_1    = "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800";
const PEXELS_CUT_1     = "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=800";

/** Cycle through the library so index never goes out of bounds */
const img = (i: number) => B[i % B.length];

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    type: "barbershop",
    label: "Barbershop",
    emoji: "💈",
    description: "Fades, shaves, beard trims & more",
    port: 6000,
    heroImage: img(0),
    available: true,
  },
  {
    type: "nail-salon",
    label: "Nail Salon",
    emoji: "💅",
    description: "Manicures, pedicures, nail art & more",
    port: 5173,
    heroImage: PEXELS_NAILS_2,
    available: true,
  },
  {
    type: "hair-salon",
    label: "Hair Salon",
    emoji: "✂️",
    description: "Cuts, colour, styling & treatments",
    port: 5175,
    heroImage: PEXELS_HAIR_1,
    available: false,
  },
  {
    type: "haircut-studio",
    label: "Haircut Studio",
    emoji: "🪒",
    description: "Walk-in cuts, quick & affordable",
    port: 5176,
    heroImage: PEXELS_CUT_1,
    available: false,
  },
];

/* ── Classic Barbershop — 25 themes, each with a unique hero image ─────────── */
export const BARBERSHOP_THEMES: LaunchsiteTemplate[] = [
  { id: "midnight-gold",     name: "Midnight & Gold",      description: "Dark luxury with gold accents",                  businessType: "barbershop", heroImage: img(0),  accentColor: "#d4a853", bgColor: "#0a0a0a",  style: "Luxury" },
  { id: "cream-heritage",    name: "Cream & Heritage",     description: "Warm cream tones with rich brown",               businessType: "barbershop", heroImage: img(1),  accentColor: "#8b4513", bgColor: "#faf6f0",  style: "Classic" },
  { id: "slate-steel",       name: "Slate & Steel",        description: "Cool grays with steel blue accents",             businessType: "barbershop", heroImage: img(2),  accentColor: "#38bdf8", bgColor: "#1e293b",  style: "Modern" },
  { id: "obsidian-copper",   name: "Obsidian & Copper",    description: "Deep black with warm copper highlights",         businessType: "barbershop", heroImage: img(3),  accentColor: "#c87533", bgColor: "#0c0c0c",  style: "Industrial" },
  { id: "ivory-emerald",     name: "Ivory & Emerald",      description: "Clean ivory with rich emerald green",            businessType: "barbershop", heroImage: img(4),  accentColor: "#2d6a4f", bgColor: "#fffff0",  style: "Classic" },
  { id: "charcoal-crimson",  name: "Charcoal & Crimson",   description: "Dark charcoal with bold red accents",            businessType: "barbershop", heroImage: img(5),  accentColor: "#dc2626", bgColor: "#1a1a1a",  style: "Bold" },
  { id: "sand-turquoise",    name: "Sand & Turquoise",     description: "Desert sand with turquoise accents",             businessType: "barbershop", heroImage: img(6),  accentColor: "#2a9d8f", bgColor: "#f4efe6",  style: "Tropical" },
  { id: "noir-silver",       name: "Noir & Silver",        description: "Pure black with silver metallic",               businessType: "barbershop", heroImage: img(7),  accentColor: "#c0c0c0", bgColor: "#000000",  style: "Minimal" },
  { id: "walnut-brass",      name: "Walnut & Brass",       description: "Rich walnut wood with brass hardware",           businessType: "barbershop", heroImage: img(8),  accentColor: "#d4a843", bgColor: "#3e2723",  style: "Rustic" },
  { id: "frost-navy",        name: "Frost & Navy",         description: "Icy white with deep navy blue",                 businessType: "barbershop", heroImage: img(9),  accentColor: "#1e3a5f", bgColor: "#f8fafc",  style: "Scandinavian" },
  { id: "espresso-cream",    name: "Espresso & Cream",     description: "Rich espresso brown with cream",                 businessType: "barbershop", heroImage: img(10), accentColor: "#f5deb3", bgColor: "#2c1e14",  style: "Rustic" },
  { id: "graphite-amber",    name: "Graphite & Amber",     description: "Cool graphite with warm amber glow",             businessType: "barbershop", heroImage: img(11), accentColor: "#f59e0b", bgColor: "#2d3436",  style: "Industrial" },
  { id: "pearl-rosewood",    name: "Pearl & Rosewood",     description: "Soft pearl white with rosewood accents",         businessType: "barbershop", heroImage: img(12), accentColor: "#8b2252", bgColor: "#faf5f0",  style: "Art Deco" },
  { id: "onyx-teal",         name: "Onyx & Teal",          description: "Deep onyx with vibrant teal",                   businessType: "barbershop", heroImage: img(13), accentColor: "#14b8a6", bgColor: "#121212",  style: "Contemporary" },
  { id: "linen-charcoal",    name: "Linen & Charcoal",     description: "Natural linen with charcoal accents",           businessType: "barbershop", heroImage: img(14), accentColor: "#333333", bgColor: "#f5f0e8",  style: "Minimal" },
  { id: "volcanic-ember",    name: "Volcanic & Ember",     description: "Deep volcanic black with fiery orange embers",   businessType: "barbershop", heroImage: img(15), accentColor: "#ff6d00", bgColor: "#1a0a00",  style: "Bold" },
  { id: "arctic-fjord",      name: "Arctic & Fjord",       description: "Glacial white with deep Nordic blue",           businessType: "barbershop", heroImage: img(16), accentColor: "#0c4a6e", bgColor: "#f0f4f8",  style: "Scandinavian" },
  { id: "mahogany-whiskey",  name: "Mahogany & Whiskey",   description: "Rich mahogany wood with whiskey amber",          businessType: "barbershop", heroImage: img(17), accentColor: "#d4880f", bgColor: "#4a1c1c",  style: "Luxury" },
  { id: "concrete-moss",     name: "Concrete & Moss",      description: "Raw concrete gray with living moss green",       businessType: "barbershop", heroImage: img(18), accentColor: "#4a7c59", bgColor: "#e8e4e0",  style: "Contemporary" },
  { id: "midnight-sapphire", name: "Midnight & Sapphire",  description: "Deep midnight blue with sapphire brilliance",   businessType: "barbershop", heroImage: img(19), accentColor: "#3b82f6", bgColor: "#0a1628",  style: "Modern" },
  { id: "desert-sunset",     name: "Desert & Sunset",      description: "Warm desert sand with sunset coral",            businessType: "barbershop", heroImage: img(20), accentColor: "#e07a5f", bgColor: "#fdf6ec",  style: "Tropical" },
  { id: "thunder-platinum",  name: "Thunder & Platinum",   description: "Storm gray with platinum metallic sheen",        businessType: "barbershop", heroImage: img(21), accentColor: "#e5e4e2", bgColor: "#2d2d2d",  style: "Industrial" },
  { id: "sage-terracotta",   name: "Sage & Terracotta",    description: "Muted sage green with warm terracotta",         businessType: "barbershop", heroImage: img(0),  accentColor: "#c4724e", bgColor: "#f4f1eb",  style: "Rustic" },
  { id: "neon-carbon",       name: "Neon & Carbon",        description: "Carbon fiber black with electric neon green",   businessType: "barbershop", heroImage: img(1),  accentColor: "#39ff14", bgColor: "#0a0a0a",  style: "Retro" },
  { id: "porcelain-ink",     name: "Porcelain & Ink",      description: "Delicate porcelain white with ink black",       businessType: "barbershop", heroImage: img(2),  accentColor: "#1a1a1a", bgColor: "#faf8f5",  style: "Art Deco" },
];

/* ── Modern Barbershop — 8 themes ───────────────────────────────────────────── */
export const BARBERSHOP2_THEMES: LaunchsiteTemplate[] = [
  { id: "urban-noir",     name: "Urban Noir",      description: "Stark black with electric yellow",   businessType: "barbershop", heroImage: img(3),  accentColor: "#f5c518", bgColor: "#0f0f0f",  style: "Bold" },
  { id: "clean-white",   name: "Clean White",      description: "Crisp white with black and red",      businessType: "barbershop", heroImage: img(6),  accentColor: "#e11d48", bgColor: "#ffffff",  style: "Modern" },
  { id: "forest-cream",  name: "Forest & Cream",   description: "Deep green with warm cream tones",    businessType: "barbershop", heroImage: img(9),  accentColor: "#2d5a27", bgColor: "#faf7f2",  style: "Classic" },
  { id: "copper-noir",   name: "Copper Noir",      description: "Near-black with copper warmth",       businessType: "barbershop", heroImage: img(11), accentColor: "#b87333", bgColor: "#12100e",  style: "Luxury" },
  { id: "sky-sand",      name: "Sky & Sand",       description: "Cool sky blue with sandy neutrals",   businessType: "barbershop", heroImage: img(14), accentColor: "#1e6fa8", bgColor: "#f0f4f8",  style: "Contemporary" },
  { id: "crimson-bone",  name: "Crimson & Bone",   description: "Bold crimson with off-white bone",    businessType: "barbershop", heroImage: img(17), accentColor: "#8b0000", bgColor: "#f8f4ee",  style: "Heritage" },
  { id: "slate-white",   name: "Slate & White",    description: "Sophisticated slate, clean white",    businessType: "barbershop", heroImage: img(19), accentColor: "#4a5568", bgColor: "#ffffff",  style: "Minimal" },
  { id: "midnight-rust", name: "Midnight & Rust",  description: "Midnight blue with rusty orange",     businessType: "barbershop", heroImage: img(21), accentColor: "#d4522a", bgColor: "#0d1117",  style: "Industrial" },
];

/* ── Walk-In & Check-In — 8 dark luxury themes ──────────────────────────────── */
export const BARBERSHOP3_THEMES: LaunchsiteTemplate[] = [
  { id: "midnight-gold",    name: "Midnight & Gold",     description: "Dark luxury with gold accents",              businessType: "barbershop", heroImage: img(4),  accentColor: "#d4a853", bgColor: "#0a0a0a",  style: "Luxury" },
  { id: "obsidian-copper",  name: "Obsidian & Copper",   description: "Deep black with warm copper highlights",      businessType: "barbershop", heroImage: img(7),  accentColor: "#c87533", bgColor: "#0c0c0c",  style: "Industrial" },
  { id: "walnut-brass",     name: "Walnut & Brass",      description: "Rich walnut wood with brass hardware",        businessType: "barbershop", heroImage: img(10), accentColor: "#d4a843", bgColor: "#3e2723",  style: "Rustic" },
  { id: "mahogany-whiskey", name: "Mahogany & Whiskey",  description: "Rich mahogany wood with whiskey amber",       businessType: "barbershop", heroImage: img(13), accentColor: "#d4880f", bgColor: "#4a1c1c",  style: "Luxury" },
  { id: "espresso-cream",   name: "Espresso & Cream",    description: "Rich espresso brown with cream",              businessType: "barbershop", heroImage: img(15), accentColor: "#f5deb3", bgColor: "#2c1e14",  style: "Rustic" },
  { id: "graphite-amber",   name: "Graphite & Amber",    description: "Cool graphite with warm amber glow",          businessType: "barbershop", heroImage: img(18), accentColor: "#f59e0b", bgColor: "#2d3436",  style: "Industrial" },
  { id: "charcoal-crimson", name: "Charcoal & Crimson",  description: "Dark charcoal with bold red accents",         businessType: "barbershop", heroImage: img(20), accentColor: "#dc2626", bgColor: "#1a1a1a",  style: "Bold" },
  { id: "noir-silver",      name: "Noir & Silver",       description: "Pure black with silver metallic",             businessType: "barbershop", heroImage: img(5),  accentColor: "#c0c0c0", bgColor: "#000000",  style: "Minimal" },
];

/* ── Nail Salon — 10 themes ─────────────────────────────────────────────────── */
export const NAIL_SALON_THEMES: LaunchsiteTemplate[] = [
  { id: "rose-quartz",      name: "Rose Quartz",         description: "Soft blush pink with rose gold accents",      businessType: "nail-salon", heroImage: PEXELS_NAILS_2,   accentColor: "#c8748a", bgColor: "#fdf0f3",  style: "Romantic" },
  { id: "midnight-noir",    name: "Midnight Noir",        description: "Dramatic black with rose gold glamour",       businessType: "nail-salon", heroImage: PEXELS_NAILS_1,   accentColor: "#c9a87c", bgColor: "#0d0d0d",  style: "Luxury" },
  { id: "ivory-gold",       name: "Ivory & Gold",         description: "Pristine ivory with warm gold accents",       businessType: "nail-salon", heroImage: THUMB_NS_IVORY,   accentColor: "#b8860b", bgColor: "#fdfaf4",  style: "Classic" },
  { id: "blush-luxe",       name: "Blush Luxe",           description: "Warm blush with mauve and dusty rose",        businessType: "nail-salon", heroImage: THUMB_NS_BLUSH,   accentColor: "#a0522d", bgColor: "#f8f0ee",  style: "Romantic" },
  { id: "emerald-glam",     name: "Emerald Glam",         description: "Deep emerald green with champagne shimmer",   businessType: "nail-salon", heroImage: THUMB_NS_EMERALD, accentColor: "#d4b483", bgColor: "#0d1f17",  style: "Luxury" },
  { id: "nude-studio",      name: "Nude Studio",          description: "Clean neutral nudes with a modern edge",      businessType: "nail-salon", heroImage: THUMB_NS_NUDE,    accentColor: "#8a7560", bgColor: "#f5f0eb",  style: "Minimal" },
  { id: "plum-velvet",      name: "Plum Velvet",          description: "Deep plum luxury with lavender highlights",   businessType: "nail-salon", heroImage: PEXELS_NAILS_1,   accentColor: "#c084fc", bgColor: "#1a0d2e",  style: "Luxury" },
  { id: "champagne-cream",  name: "Champagne & Cream",    description: "Warm champagne bubbles with cream elegance",  businessType: "nail-salon", heroImage: PEXELS_NAILS_2,   accentColor: "#c8a870", bgColor: "#faf6ee",  style: "Classic" },
  { id: "carbon-coral",     name: "Carbon & Coral",       description: "Dark carbon modern with coral pop",           businessType: "nail-salon", heroImage: PEXELS_NAILS_1,   accentColor: "#ff6b6b", bgColor: "#1a1a1a",  style: "Modern" },
  { id: "sage-linen",       name: "Sage & Linen",         description: "Earthy sage green with natural linen warmth", businessType: "nail-salon", heroImage: THUMB_NS_SAGE,    accentColor: "#6b7c5a", bgColor: "#f2f0ea",  style: "Botanical" },
];
