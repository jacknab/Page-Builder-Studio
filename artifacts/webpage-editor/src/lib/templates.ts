export type BlockType = 'hero' | 'features' | 'text' | 'image' | 'footer' | 'widget' | 'buttons';

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Block[];
}

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const BUTTON_PRESETS = [
  { id: 'solid-blue',       label: 'Solid Blue',       tw: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',                                                                     defaultText: 'Get Started' },
  { id: 'solid-green',      label: 'Solid Green',      tw: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',                                                               defaultText: 'Sign Up Free' },
  { id: 'solid-red',        label: 'Solid Red',        tw: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',                                                                       defaultText: 'Buy Now' },
  { id: 'solid-purple',     label: 'Solid Purple',     tw: 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm',                                                                 defaultText: 'Learn More' },
  { id: 'solid-orange',     label: 'Solid Orange',     tw: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm',                                                                 defaultText: 'Try It Free' },
  { id: 'solid-dark',       label: 'Solid Dark',       tw: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm',                                                                   defaultText: 'Contact Us' },
  { id: 'solid-teal',       label: 'Solid Teal',       tw: 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm',                                                                     defaultText: 'Explore' },
  { id: 'solid-rose',       label: 'Solid Rose',       tw: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm',                                                                     defaultText: 'Join Now' },
  { id: 'outline-blue',     label: 'Outline Blue',     tw: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent',                                                 defaultText: 'Learn More' },
  { id: 'outline-green',    label: 'Outline Green',    tw: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent',                                        defaultText: 'View Plans' },
  { id: 'outline-red',      label: 'Outline Red',      tw: 'border-2 border-red-500 text-red-500 hover:bg-red-50 bg-transparent',                                                    defaultText: 'Delete' },
  { id: 'outline-purple',   label: 'Outline Purple',   tw: 'border-2 border-violet-600 text-violet-600 hover:bg-violet-50 bg-transparent',                                           defaultText: 'Upgrade' },
  { id: 'pill-blue',        label: 'Pill Blue',        tw: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-full',                                                        defaultText: 'Follow Us' },
  { id: 'pill-outline',     label: 'Pill Outline',     tw: 'border-2 border-slate-300 text-slate-700 hover:border-slate-500 bg-transparent rounded-full',                           defaultText: 'Cancel' },
  { id: 'gradient-purple',  label: 'Gradient Purple',  tw: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md',         defaultText: 'Get Premium' },
  { id: 'gradient-sunset',  label: 'Gradient Sunset',  tw: 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600 shadow-md',             defaultText: 'Start Free Trial' },
  { id: 'gradient-ocean',   label: 'Gradient Ocean',   tw: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-md',                 defaultText: 'Dive In' },
  { id: 'gradient-dark',    label: 'Gradient Dark',    tw: 'bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 shadow-lg',             defaultText: 'Get Access' },
  { id: 'shadow-blue',      label: '3D Shadow',        tw: 'bg-blue-600 text-white shadow-[0_5px_0_#1e40af] hover:shadow-[0_2px_0_#1e40af] hover:translate-y-[3px] transition-all', defaultText: 'Press Me' },
  { id: 'soft-blue',        label: 'Soft Blue',        tw: 'bg-blue-100 text-blue-700 hover:bg-blue-200',                                                                            defaultText: 'View More' },
  { id: 'soft-green',       label: 'Soft Green',       tw: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',                                                                   defaultText: 'Download' },
  { id: 'soft-purple',      label: 'Soft Purple',      tw: 'bg-violet-100 text-violet-700 hover:bg-violet-200',                                                                      defaultText: 'Preview' },
  { id: 'ghost',            label: 'Ghost',            tw: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-transparent',                                                  defaultText: 'Skip' },
  { id: 'ghost-blue',       label: 'Ghost Blue',       tw: 'text-blue-600 hover:bg-blue-50 bg-transparent',                                                                          defaultText: 'Read More →' },
];

export const GOOGLE_FONTS: { name: string; family: string; url: string }[] = [
  { name: 'Inter',              family: "'Inter', sans-serif",                url: 'Inter:wght@400;500;600;700;800' },
  { name: 'Plus Jakarta Sans',  family: "'Plus Jakarta Sans', sans-serif",    url: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  { name: 'Poppins',            family: "'Poppins', sans-serif",              url: 'Poppins:wght@400;500;600;700;800' },
  { name: 'Roboto',             family: "'Roboto', sans-serif",               url: 'Roboto:wght@400;500;700;900' },
  { name: 'Open Sans',          family: "'Open Sans', sans-serif",            url: 'Open+Sans:wght@400;600;700;800' },
  { name: 'Lato',               family: "'Lato', sans-serif",                 url: 'Lato:wght@400;700;900' },
  { name: 'Montserrat',         family: "'Montserrat', sans-serif",           url: 'Montserrat:wght@400;500;600;700;800' },
  { name: 'Raleway',            family: "'Raleway', sans-serif",              url: 'Raleway:wght@400;500;600;700;800' },
  { name: 'Nunito',             family: "'Nunito', sans-serif",               url: 'Nunito:wght@400;600;700;800' },
  { name: 'DM Sans',            family: "'DM Sans', sans-serif",              url: 'DM+Sans:wght@400;500;600;700' },
  { name: 'Space Grotesk',      family: "'Space Grotesk', sans-serif",        url: 'Space+Grotesk:wght@400;500;600;700' },
  { name: 'Outfit',             family: "'Outfit', sans-serif",               url: 'Outfit:wght@400;500;600;700;800' },
  { name: 'Sora',               family: "'Sora', sans-serif",                 url: 'Sora:wght@400;500;600;700;800' },
  { name: 'Figtree',            family: "'Figtree', sans-serif",              url: 'Figtree:wght@400;500;600;700;800' },
  { name: 'Oswald',             family: "'Oswald', sans-serif",               url: 'Oswald:wght@400;500;600;700' },
  { name: 'Merriweather',       family: "'Merriweather', serif",              url: 'Merriweather:wght@400;700;900' },
  { name: 'Playfair Display',   family: "'Playfair Display', serif",          url: 'Playfair+Display:wght@400;600;700;800' },
  { name: 'Lora',               family: "'Lora', serif",                      url: 'Lora:wght@400;500;600;700' },
  { name: 'Libre Baskerville',  family: "'Libre Baskerville', serif",         url: 'Libre+Baskerville:wght@400;700' },
  { name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif",        url: 'Cormorant+Garamond:wght@400;500;600;700' },
  { name: 'Bebas Neue',         family: "'Bebas Neue', cursive",              url: 'Bebas+Neue' },
  { name: 'Pacifico',           family: "'Pacifico', cursive",                url: 'Pacifico' },
  { name: 'Caveat',             family: "'Caveat', cursive",                  url: 'Caveat:wght@400;600;700' },
  { name: 'Source Code Pro',    family: "'Source Code Pro', monospace",       url: 'Source+Code+Pro:wght@400;500;600;700' },
];

export const TEMPLATES: Template[] = [
  {
    id: 'startup',
    name: 'Startup',
    description: 'A clean landing page for a new product or service.',
    blocks: [
      {
        id: generateId(),
        type: 'hero',
        props: {
          title: 'Build something amazing',
          subtitle: 'The ultimate tool for creators who want to move fast and make things that matter.',
          buttonText: 'Get Started',
          imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop'
        }
      },
      {
        id: generateId(),
        type: 'features',
        props: {
          title: 'Everything you need',
          features: [
            { title: 'Lightning Fast', description: 'Built on the edge for maximum performance.' },
            { title: 'Beautiful Design', description: 'Carefully crafted components that look great out of the box.' },
            { title: 'Fully Customizable', description: 'Tweak every detail to match your brand.' }
          ]
        }
      },
      {
        id: generateId(),
        type: 'footer',
        props: {
          text: '© 2024 Startup Inc. All rights reserved.'
        }
      }
    ]
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with a minimal, typography-focused design.',
    blocks: [
      {
        id: generateId(),
        type: 'text',
        props: {
          align: 'left',
          content: '<h1>Hi, I am Alex.</h1><p>I design interfaces and build digital products.</p>'
        }
      },
      {
        id: generateId(),
        type: 'image',
        props: {
          url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop',
          alt: 'Abstract art'
        }
      },
      {
        id: generateId(),
        type: 'footer',
        props: {
          text: 'Get in touch at hello@example.com'
        }
      }
    ]
  }
];
