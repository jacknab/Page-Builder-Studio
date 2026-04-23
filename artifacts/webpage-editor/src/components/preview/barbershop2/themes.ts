export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    bgAlt: string;
    text: string;
    textMuted: string;
    accent: string;
    accentText: string;
    border: string;
    navBg: string;
    navText: string;
    footerBg: string;
    footerText: string;
    card: string;
  };
  fonts: { heading: string; body: string };
  heroImage: string;
  style: string;
}

const IMG_A = "https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=1920";
const IMG_B = "https://images.pexels.com/photos/3998424/pexels-photo-3998424.jpeg?auto=compress&cs=tinysrgb&w=1920";
const IMG_C = "https://images.pexels.com/photos/1484808/pexels-photo-1484808.jpeg?auto=compress&cs=tinysrgb&w=1920";
const IMG_D = "https://images.pexels.com/photos/4812636/pexels-photo-4812636.jpeg?auto=compress&cs=tinysrgb&w=1920";
const IMG_E = "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=1920";

export const themes: Theme[] = [
  {
    id: "urban-noir",
    name: "Urban Noir",
    description: "Stark black with electric yellow",
    colors: { bg:"#0f0f0f", bgAlt:"#1a1a1a", text:"#f5f5f5", textMuted:"#888", accent:"#f5c518", accentText:"#0f0f0f", border:"#2a2a2a", navBg:"#0f0f0f", navText:"#f5f5f5", footerBg:"#050505", footerText:"#666", card:"#1a1a1a" },
    fonts: { heading:"'Bebas Neue', sans-serif", body:"'Inter', sans-serif" },
    heroImage: IMG_A, style: "Bold",
  },
  {
    id: "clean-white",
    name: "Clean White",
    description: "Crisp white with black and red",
    colors: { bg:"#ffffff", bgAlt:"#f8f8f8", text:"#111111", textMuted:"#666666", accent:"#e11d48", accentText:"#ffffff", border:"#e5e5e5", navBg:"#ffffff", navText:"#111111", footerBg:"#111111", footerText:"#999999", card:"#f8f8f8" },
    fonts: { heading:"'Oswald', sans-serif", body:"'Inter', sans-serif" },
    heroImage: IMG_B, style: "Modern",
  },
  {
    id: "forest-cream",
    name: "Forest & Cream",
    description: "Deep green with warm cream tones",
    colors: { bg:"#faf7f2", bgAlt:"#f0ece3", text:"#1a2e1a", textMuted:"#5a6e5a", accent:"#2d5a27", accentText:"#faf7f2", border:"#d8d0c4", navBg:"#1a2e1a", navText:"#faf7f2", footerBg:"#0f1c0f", footerText:"#8a9e8a", card:"#f0ece3" },
    fonts: { heading:"'Playfair Display', serif", body:"'Source Sans 3', sans-serif" },
    heroImage: IMG_C, style: "Classic",
  },
  {
    id: "copper-noir",
    name: "Copper Noir",
    description: "Near-black with copper warmth",
    colors: { bg:"#12100e", bgAlt:"#1e1a16", text:"#f0e8dc", textMuted:"#8a7a6a", accent:"#b87333", accentText:"#12100e", border:"#2e2820", navBg:"#0c0a08", navText:"#f0e8dc", footerBg:"#0c0a08", footerText:"#6a5e50", card:"#1e1a16" },
    fonts: { heading:"'Cinzel', serif", body:"'Lato', sans-serif" },
    heroImage: IMG_D, style: "Luxury",
  },
  {
    id: "sky-sand",
    name: "Sky & Sand",
    description: "Cool sky blue with sandy neutrals",
    colors: { bg:"#f0f4f8", bgAlt:"#e4ecf4", text:"#1e3048", textMuted:"#5a7090", accent:"#1e6fa8", accentText:"#ffffff", border:"#c8d8e8", navBg:"#1e3048", navText:"#f0f4f8", footerBg:"#1e3048", footerText:"#7890a8", card:"#e4ecf4" },
    fonts: { heading:"'Raleway', sans-serif", body:"'Open Sans', sans-serif" },
    heroImage: IMG_E, style: "Contemporary",
  },
  {
    id: "crimson-bone",
    name: "Crimson & Bone",
    description: "Bold crimson with off-white bone",
    colors: { bg:"#f8f4ee", bgAlt:"#ede7de", text:"#1a0a06", textMuted:"#6a4a3a", accent:"#8b0000", accentText:"#f8f4ee", border:"#d8c8b8", navBg:"#8b0000", navText:"#f8f4ee", footerBg:"#1a0a06", footerText:"#8a7060", card:"#ede7de" },
    fonts: { heading:"'Libre Baskerville', serif", body:"'Nunito Sans', sans-serif" },
    heroImage: IMG_A, style: "Heritage",
  },
  {
    id: "slate-white",
    name: "Slate & White",
    description: "Sophisticated slate with clean white",
    colors: { bg:"#ffffff", bgAlt:"#f4f4f4", text:"#2d3748", textMuted:"#718096", accent:"#4a5568", accentText:"#ffffff", border:"#e2e8f0", navBg:"#2d3748", navText:"#ffffff", footerBg:"#1a202c", footerText:"#718096", card:"#f4f4f4" },
    fonts: { heading:"'Montserrat', sans-serif", body:"'Inter', sans-serif" },
    heroImage: IMG_B, style: "Minimal",
  },
  {
    id: "midnight-rust",
    name: "Midnight & Rust",
    description: "Midnight blue with rusty orange",
    colors: { bg:"#0d1117", bgAlt:"#161b22", text:"#f0f6fc", textMuted:"#7d8590", accent:"#d4522a", accentText:"#f0f6fc", border:"#21262d", navBg:"#0d1117", navText:"#f0f6fc", footerBg:"#010409", footerText:"#7d8590", card:"#161b22" },
    fonts: { heading:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" },
    heroImage: IMG_C, style: "Industrial",
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) ?? themes[0];
}
