export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentHover: string;
    accentLight: string;
    card: string;
    cardHover: string;
    border: string;
    heroOverlay: string;
    buttonPrimary: string;
    buttonPrimaryHover: string;
    buttonSecondary: string;
    buttonSecondaryHover: string;
    priceTag: string;
    divider: string;
    footerBg: string;
    footerText: string;
    navBg: string;
    navText: string;
    badge: string;
    badgeText: string;
  };
  fonts: { heading: string; body: string };
  heroImage: string;
  style: string;
}

const PEXELS_NAILS_1 = 'https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=1920';
const PEXELS_NAILS_2 = 'https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=1920';
const PEXELS_NAILS_3 = 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=1920';
const PEXELS_NAILS_4 = 'https://images.pexels.com/photos/4210334/pexels-photo-4210334.jpeg?auto=compress&cs=tinysrgb&w=1920';
const PEXELS_NAILS_5 = 'https://images.pexels.com/photos/3738383/pexels-photo-3738383.jpeg?auto=compress&cs=tinysrgb&w=1920';

export const themes: Theme[] = [
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    description: 'Soft blush pink with rose gold accents',
    colors: { bg:'#fdf0f3',bgSecondary:'#f5e0e6',text:'#2d1a20',textSecondary:'#7a4f5a',accent:'#c8748a',accentHover:'#d98898',accentLight:'rgba(200,116,138,0.1)',card:'#ffffff',cardHover:'#fdf0f3',border:'#e8c8d0',heroOverlay:'rgba(45,26,32,0.45)',buttonPrimary:'#c8748a',buttonPrimaryHover:'#d98898',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(200,116,138,0.08)',priceTag:'#c8748a',divider:'#c8748a',footerBg:'#2d1a20',footerText:'#d4a8b4',navBg:'rgba(253,240,243,0.95)',navText:'#2d1a20',badge:'#c8748a',badgeText:'#ffffff' },
    fonts: { heading:"'Cormorant Garamond', serif", body:"'Nunito', sans-serif" },
    heroImage: PEXELS_NAILS_2, style:'romantic',
  },
  {
    id: 'midnight-noir',
    name: 'Midnight Noir',
    description: 'Dramatic black with rose gold glamour',
    colors: { bg:'#0d0d0d',bgSecondary:'#181818',text:'#f5f0ec',textSecondary:'#a89890',accent:'#c9a87c',accentHover:'#dbbf96',accentLight:'rgba(201,168,124,0.1)',card:'#1e1e1e',cardHover:'#282828',border:'#333333',heroOverlay:'rgba(0,0,0,0.55)',buttonPrimary:'#c9a87c',buttonPrimaryHover:'#dbbf96',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(201,168,124,0.1)',priceTag:'#c9a87c',divider:'#c9a87c',footerBg:'#060606',footerText:'#a89890',navBg:'rgba(13,13,13,0.95)',navText:'#f5f0ec',badge:'#c9a87c',badgeText:'#0d0d0d' },
    fonts: { heading:"'Playfair Display', serif", body:"'Raleway', sans-serif" },
    heroImage: PEXELS_NAILS_1, style:'luxury',
  },
  {
    id: 'ivory-gold',
    name: 'Ivory & Gold',
    description: 'Pristine ivory with warm gold accents',
    colors: { bg:'#fdfaf4',bgSecondary:'#f5ede0',text:'#2a1f10',textSecondary:'#6b5a3e',accent:'#b8860b',accentHover:'#cfaa30',accentLight:'rgba(184,134,11,0.08)',card:'#ffffff',cardHover:'#fdfaf4',border:'#e0d4b8',heroOverlay:'rgba(42,31,16,0.4)',buttonPrimary:'#b8860b',buttonPrimaryHover:'#cfaa30',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(184,134,11,0.08)',priceTag:'#b8860b',divider:'#b8860b',footerBg:'#2a1f10',footerText:'#d4c4a0',navBg:'rgba(253,250,244,0.95)',navText:'#2a1f10',badge:'#b8860b',badgeText:'#fdfaf4' },
    fonts: { heading:"'EB Garamond', serif", body:"'Lato', sans-serif" },
    heroImage: PEXELS_NAILS_4, style:'classic',
  },
  {
    id: 'blush-luxe',
    name: 'Blush Luxe',
    description: 'Warm blush with mauve and dusty rose',
    colors: { bg:'#f8f0ee',bgSecondary:'#edddd9',text:'#2e1c1a',textSecondary:'#7a5550',accent:'#a0522d',accentHover:'#b8633a',accentLight:'rgba(160,82,45,0.08)',card:'#ffffff',cardHover:'#f8f0ee',border:'#e0c8c4',heroOverlay:'rgba(46,28,26,0.4)',buttonPrimary:'#a0522d',buttonPrimaryHover:'#b8633a',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(160,82,45,0.08)',priceTag:'#a0522d',divider:'#a0522d',footerBg:'#2e1c1a',footerText:'#d4b0a8',navBg:'rgba(248,240,238,0.95)',navText:'#2e1c1a',badge:'#a0522d',badgeText:'#f8f0ee' },
    fonts: { heading:"'Cormorant Garamond', serif", body:"'Jost', sans-serif" },
    heroImage: PEXELS_NAILS_3, style:'romantic',
  },
  {
    id: 'emerald-glam',
    name: 'Emerald Glam',
    description: 'Deep emerald green with champagne shimmer',
    colors: { bg:'#0d1f17',bgSecondary:'#081510',text:'#f0f8f0',textSecondary:'#88b898',accent:'#d4b483',accentHover:'#e0c898',accentLight:'rgba(212,180,131,0.1)',card:'#162a1e',cardHover:'#1e3828',border:'#245234',heroOverlay:'rgba(8,21,16,0.5)',buttonPrimary:'#d4b483',buttonPrimaryHover:'#e0c898',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(212,180,131,0.1)',priceTag:'#d4b483',divider:'#d4b483',footerBg:'#040a07',footerText:'#88b898',navBg:'rgba(13,31,23,0.95)',navText:'#f0f8f0',badge:'#d4b483',badgeText:'#0d1f17' },
    fonts: { heading:"'Playfair Display', serif", body:"'DM Sans', sans-serif" },
    heroImage: PEXELS_NAILS_5, style:'luxury',
  },
  {
    id: 'nude-studio',
    name: 'Nude Studio',
    description: 'Clean neutral nudes with a modern edge',
    colors: { bg:'#f5f0eb',bgSecondary:'#ebe3da',text:'#1a1614',textSecondary:'#5a5048',accent:'#8a7560',accentHover:'#9e8872',accentLight:'rgba(138,117,96,0.08)',card:'#faf7f4',cardHover:'#f5f0eb',border:'#d8cfc4',heroOverlay:'rgba(26,22,20,0.4)',buttonPrimary:'#8a7560',buttonPrimaryHover:'#9e8872',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(138,117,96,0.08)',priceTag:'#8a7560',divider:'#8a7560',footerBg:'#1a1614',footerText:'#c0b8b0',navBg:'rgba(245,240,235,0.95)',navText:'#1a1614',badge:'#8a7560',badgeText:'#faf7f4' },
    fonts: { heading:"'DM Serif Display', serif", body:"'DM Sans', sans-serif" },
    heroImage: PEXELS_NAILS_4, style:'minimal',
  },
  {
    id: 'plum-velvet',
    name: 'Plum Velvet',
    description: 'Deep plum luxury with lavender highlights',
    colors: { bg:'#1a0d2e',bgSecondary:'#120820',text:'#f0ecf8',textSecondary:'#b09ec8',accent:'#c084fc',accentHover:'#d0a4fc',accentLight:'rgba(192,132,252,0.1)',card:'#251340',cardHover:'#301a50',border:'#3d2060',heroOverlay:'rgba(18,8,32,0.55)',buttonPrimary:'#c084fc',buttonPrimaryHover:'#d0a4fc',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(192,132,252,0.1)',priceTag:'#c084fc',divider:'#c084fc',footerBg:'#080410',footerText:'#b09ec8',navBg:'rgba(26,13,46,0.95)',navText:'#f0ecf8',badge:'#c084fc',badgeText:'#1a0d2e' },
    fonts: { heading:"'Cormorant Garamond', serif", body:"'Nunito', sans-serif" },
    heroImage: PEXELS_NAILS_1, style:'luxury',
  },
  {
    id: 'champagne-cream',
    name: 'Champagne & Cream',
    description: 'Warm champagne bubbles with cream elegance',
    colors: { bg:'#faf6ee',bgSecondary:'#f0e8d8',text:'#2a2016',textSecondary:'#6a5a40',accent:'#c8a870',accentHover:'#d8bc88',accentLight:'rgba(200,168,112,0.1)',card:'#ffffff',cardHover:'#faf6ee',border:'#e0d4b8',heroOverlay:'rgba(42,32,22,0.4)',buttonPrimary:'#c8a870',buttonPrimaryHover:'#d8bc88',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(200,168,112,0.08)',priceTag:'#c8a870',divider:'#c8a870',footerBg:'#2a2016',footerText:'#d4c4a0',navBg:'rgba(250,246,238,0.95)',navText:'#2a2016',badge:'#c8a870',badgeText:'#2a2016' },
    fonts: { heading:"'EB Garamond', serif", body:"'Lora', serif" },
    heroImage: PEXELS_NAILS_2, style:'classic',
  },
  {
    id: 'carbon-coral',
    name: 'Carbon & Coral',
    description: 'Dark carbon modern with coral pop',
    colors: { bg:'#1a1a1a',bgSecondary:'#111111',text:'#f5f5f5',textSecondary:'#909090',accent:'#ff6b6b',accentHover:'#ff8585',accentLight:'rgba(255,107,107,0.1)',card:'#252525',cardHover:'#2e2e2e',border:'#383838',heroOverlay:'rgba(0,0,0,0.55)',buttonPrimary:'#ff6b6b',buttonPrimaryHover:'#ff8585',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(255,107,107,0.1)',priceTag:'#ff6b6b',divider:'#ff6b6b',footerBg:'#080808',footerText:'#909090',navBg:'rgba(26,26,26,0.95)',navText:'#f5f5f5',badge:'#ff6b6b',badgeText:'#ffffff' },
    fonts: { heading:"'Syne', sans-serif", body:"'Inter', sans-serif" },
    heroImage: PEXELS_NAILS_1, style:'modern',
  },
  {
    id: 'sage-linen',
    name: 'Sage & Linen',
    description: 'Earthy sage green with natural linen warmth',
    colors: { bg:'#f2f0ea',bgSecondary:'#e4e0d5',text:'#252420',textSecondary:'#5a5848',accent:'#6b7c5a',accentHover:'#7e9069',accentLight:'rgba(107,124,90,0.08)',card:'#faf9f6',cardHover:'#f2f0ea',border:'#d0ccbf',heroOverlay:'rgba(37,36,32,0.4)',buttonPrimary:'#6b7c5a',buttonPrimaryHover:'#7e9069',buttonSecondary:'transparent',buttonSecondaryHover:'rgba(107,124,90,0.08)',priceTag:'#6b7c5a',divider:'#6b7c5a',footerBg:'#252420',footerText:'#b8b4a8',navBg:'rgba(242,240,234,0.95)',navText:'#252420',badge:'#6b7c5a',badgeText:'#f2f0ea' },
    fonts: { heading:"'Fraunces', serif", body:"'Karla', sans-serif" },
    heroImage: PEXELS_NAILS_5, style:'botanical',
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) ?? themes[0];
}
