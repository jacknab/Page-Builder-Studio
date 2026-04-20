export type BlockType = 'hero' | 'features' | 'text' | 'image' | 'footer';

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
