import { Block } from '@/lib/templates';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BlockProps {
  block: Block;
  onChange: (block: Block) => void;
  onDelete: () => void;
  preview?: boolean;
}

function BlockWrapper({ children, onDelete, preview }: { children: React.ReactNode, onDelete: () => void, preview?: boolean }) {
  if (preview) return <>{children}</>;
  
  return (
    <div className="relative group/block border border-transparent hover:border-border transition-colors rounded-lg overflow-hidden">
      <div className="absolute top-2 right-2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10 bg-background/80 backdrop-blur-sm p-1 rounded-md border shadow-sm flex gap-1">
        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
}

function ImageEditor({ url, onChange, preview }: { url: string, onChange: (url: string) => void, preview?: boolean }) {
  if (preview) {
    return <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />;
  }

  return (
    <div className="relative group/image w-full h-full rounded-xl overflow-hidden bg-muted">
      <img src={url} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Change Image
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input 
                  value={url}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Paste any valid image URL. Unsplash images work great.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function HeroBlock({ block, onChange, onDelete, preview }: BlockProps) {
  const { title, subtitle, buttonText, imageUrl } = block.props;

  const updateProp = (key: string, value: string) => {
    onChange({ ...block, props: { ...block.props, [key]: value } });
  };

  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <div className="py-20 md:py-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-background">
        <div className="space-y-6">
          <EditableText
            as="h1"
            value={title}
            onChange={(v) => updateProp('title', v)}
            preview={preview}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
          />
          <EditableText
            as="p"
            value={subtitle}
            onChange={(v) => updateProp('subtitle', v)}
            preview={preview}
            className="text-lg md:text-xl text-muted-foreground max-w-lg"
          />
          <div>
            <div className="inline-block relative">
               <EditableText
                  as="span"
                  value={buttonText}
                  onChange={(v) => updateProp('buttonText', v)}
                  preview={preview}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground shadow px-8 py-4 pointer-events-none"
                />
            </div>
          </div>
        </div>
        <div className="h-[400px] md:h-[500px]">
           <ImageEditor 
             url={imageUrl} 
             onChange={(v) => updateProp('imageUrl', v)} 
             preview={preview} 
           />
        </div>
      </div>
    </BlockWrapper>
  );
}

export function FeaturesBlock({ block, onChange, onDelete, preview }: BlockProps) {
  const { title, features } = block.props;

  const updateProp = (key: string, value: any) => {
    onChange({ ...block, props: { ...block.props, [key]: value } });
  };

  const updateFeature = (index: number, key: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [key]: value };
    updateProp('features', newFeatures);
  };

  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <div className="py-20 px-6 md:px-12 bg-muted/30">
        <div className="max-w-5xl mx-auto space-y-16">
          <EditableText
            as="h2"
            value={title}
            onChange={(v) => updateProp('title', v)}
            preview={preview}
            className="text-3xl md:text-4xl font-bold text-center tracking-tight"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f: any, i: number) => (
              <div key={i} className="space-y-3 bg-background p-6 rounded-2xl shadow-sm border border-border/50">
                <EditableText
                  as="h3"
                  value={f.title}
                  onChange={(v) => updateFeature(i, 'title', v)}
                  preview={preview}
                  className="text-xl font-semibold"
                />
                <EditableText
                  as="p"
                  value={f.description}
                  onChange={(v) => updateFeature(i, 'description', v)}
                  preview={preview}
                  className="text-muted-foreground leading-relaxed"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}

export function TextBlock({ block, onChange, onDelete, preview }: BlockProps) {
  const { content, align } = block.props;

  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <div className="py-16 px-6 md:px-12 bg-background">
        <div className={`max-w-3xl mx-auto prose prose-slate dark:prose-invert prose-lg ${align === 'center' ? 'text-center mx-auto' : ''}`}>
          <EditableText
            as="div"
            value={content}
            onChange={(v) => onChange({ ...block, props: { ...block.props, content: v } })}
            preview={preview}
            dangerouslySetInnerHTML={{ __html: content }} // Warning: editable text with innerHTML is tricky, simpler string approach used in EditableText but let's stick to simple string content here for now.
          />
        </div>
      </div>
    </BlockWrapper>
  );
}

export function SingleImageBlock({ block, onChange, onDelete, preview }: BlockProps) {
  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <div className="py-12 px-6 md:px-12 bg-background flex justify-center">
        <div className="max-w-5xl w-full h-[500px]">
          <ImageEditor
            url={block.props.url}
            onChange={(v) => onChange({ ...block, props: { ...block.props, url: v } })}
            preview={preview}
          />
        </div>
      </div>
    </BlockWrapper>
  );
}

export function FooterBlock({ block, onChange, onDelete, preview }: BlockProps) {
  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <footer className="py-8 px-6 md:px-12 bg-foreground text-background text-center">
        <EditableText
          as="p"
          value={block.props.text}
          onChange={(v) => onChange({ ...block, props: { ...block.props, text: v } })}
          preview={preview}
          className="text-sm opacity-80"
        />
      </footer>
    </BlockWrapper>
  );
}

export const BlockRenderer = ({ block, onChange, onDelete, preview }: BlockProps) => {
  switch (block.type) {
    case 'hero': return <HeroBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'features': return <FeaturesBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'text': return <TextBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'image': return <SingleImageBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'footer': return <FooterBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    default: return <div className="p-4 border border-dashed border-red-500 text-red-500">Unknown block type: {block.type}</div>;
  }
};
