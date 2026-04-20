import { useState, useRef, useEffect } from 'react';
import { Block, BUTTON_PRESETS } from '@/lib/templates';
import { EditableText } from './EditableText';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon, Code2, Plus, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
            dangerouslySetInnerHTML={{ __html: content }}
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

function buildWidgetSrcdoc(snippet: string, editable: boolean) {
  const editorStyles = editable
    ? `*, *::before, *::after { pointer-events: auto !important; }
       [contenteditable="true"] { user-select: text !important; outline: none; }
       [data-launchsite-selected="true"] { outline: 3px solid #2563eb !important; outline-offset: 4px !important; }
       a[href], button { cursor: text !important; }`
    : '';

  const editorScript = editable
    ? `<script data-launchsite-editor="true">
(function(){
  document.body.setAttribute('contenteditable','true');
  function postUpdate(){
    var p; try { p = parent; } catch(e){}
    if (p) p.postMessage({ type: 'launchsite-widget-updated', html: document.body.innerHTML }, '*');
  }
  document.addEventListener('focusout', function(){ setTimeout(postUpdate, 80); }, true);
  document.addEventListener('input', function(){ setTimeout(postUpdate, 300); }, true);
})();
</script>`
    : '';

  return `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:sans-serif;padding:8px}
${editorStyles}
</style></head><body>${snippet}${editorScript}</body></html>`;
}

export function WidgetBlock({ block, onChange, onDelete, preview }: BlockProps) {
  const { html = '', label = 'Embedded Widget', height = 400 } = block.props;
  const [showCodeEditor, setShowCodeEditor] = useState(!html);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updateProp = (key: string, value: any) =>
    onChange({ ...block, props: { ...block.props, [key]: value } });

  // Listen for inline edits made inside the iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'launchsite-widget-updated' && typeof event.data.html === 'string') {
        onChange({ ...block, props: { ...block.props, html: event.data.html } });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [block, onChange]);

  const QUICK_PRESETS = [
    {
      name: 'YouTube Video',
      html: `<iframe width="100%" height="400" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`,
    },
    {
      name: 'Google Maps',
      html: `<iframe src="https://maps.google.com/maps?q=New+York+City&output=embed" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>`,
    },
    {
      name: 'Calendly (placeholder)',
      html: `<div style="background:#f0f4ff;border-radius:12px;padding:40px;text-align:center;font-family:sans-serif;height:400px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px"><div style="font-size:24px">📅</div><strong>Calendly Booking Widget</strong><p style="color:#666;margin:0">Replace this with your Calendly embed code</p></div>`,
    },
    {
      name: 'Typeform (placeholder)',
      html: `<div style="background:#f5f0ff;border-radius:12px;padding:40px;text-align:center;font-family:sans-serif;height:400px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px"><div style="font-size:24px">📋</div><strong>Typeform Survey Widget</strong><p style="color:#666;margin:0">Replace this with your Typeform embed code</p></div>`,
    },
  ];

  // In edit mode: make the iframe content editable inline (like HtmlTemplateEditor).
  // In preview mode: render as plain sandbox.
  const srcdoc = buildWidgetSrcdoc(html, !preview && !showCodeEditor && !!html);

  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <div className="bg-background py-8 px-6 md:px-12">
        {!preview && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Code2 className="h-4 w-4" />
              <Input
                value={label}
                onChange={(e) => updateProp('label', e.target.value)}
                className="h-7 w-48 text-sm font-semibold border-dashed"
              />
            </div>
            <Button size="sm" variant="outline" onClick={() => setShowCodeEditor(!showCodeEditor)} className="gap-1 text-xs">
              {showCodeEditor ? <X className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
              {showCodeEditor ? 'Hide code' : 'Edit source'}
            </Button>
          </div>
        )}

        {!preview && showCodeEditor && (
          <div className="mb-4 space-y-3 rounded-xl border border-dashed border-border bg-muted/30 p-4">
            <div className="flex flex-wrap gap-2">
              {QUICK_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => { updateProp('html', p.html); setShowCodeEditor(false); }}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                >
                  {p.name}
                </button>
              ))}
            </div>
            <Textarea
              value={html}
              onChange={(e) => updateProp('html', e.target.value)}
              placeholder="Paste your widget or embed code here… (YouTube, Calendly, Google Maps, Stripe, etc.)"
              className="min-h-[120px] font-mono text-xs"
            />
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">Preview height (px)</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => updateProp('height', Number(e.target.value))}
                className="h-7 w-24 text-xs"
                min={100}
                max={1200}
              />
            </div>
          </div>
        )}

        {html ? (
          <div className="w-full overflow-hidden rounded-2xl border border-border/50 shadow-sm">
            {!preview && !showCodeEditor && (
              <p className="px-3 py-1.5 text-[11px] text-muted-foreground bg-muted/40 border-b border-border/40">
                Click text to edit • Use "Edit source" to change the HTML code
              </p>
            )}
            <iframe
              ref={iframeRef}
              key={`${showCodeEditor}-${preview}`}
              srcDoc={srcdoc}
              title={label}
              style={{ width: '100%', height: `${height}px`, border: 'none', display: 'block' }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground"
            style={{ height: `${height}px` }}
          >
            <Code2 className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">Paste your widget code above</p>
            <p className="text-xs opacity-60">Supports YouTube, Calendly, Maps, Typeform, and any embed code</p>
          </div>
        )}
      </div>
    </BlockWrapper>
  );
}

export function ButtonsBlock({ block, onChange, onDelete, preview }: BlockProps) {
  const {
    title = 'Button Styles',
    subtitle = 'Mix and match to find what fits your brand.',
    buttons = BUTTON_PRESETS.map((p) => ({ id: p.id, text: p.defaultText })),
    bg = 'white',
  } = block.props;

  const updateProp = (key: string, value: any) =>
    onChange({ ...block, props: { ...block.props, [key]: value } });

  const updateButtonText = (id: string, text: string) => {
    updateProp('buttons', buttons.map((b: any) => b.id === id ? { ...b, text } : b));
  };

  const addButton = (presetId: string) => {
    if (buttons.find((b: any) => b.id === presetId)) return;
    const preset = BUTTON_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    updateProp('buttons', [...buttons, { id: presetId, text: preset.defaultText }]);
  };

  const removeButton = (id: string) => {
    updateProp('buttons', buttons.filter((b: any) => b.id !== id));
  };

  const bgClass = bg === 'muted' ? 'bg-muted/30' : bg === 'dark' ? 'bg-slate-900' : 'bg-background';
  const textClass = bg === 'dark' ? 'text-white' : 'text-foreground';
  const subClass = bg === 'dark' ? 'text-slate-300' : 'text-muted-foreground';

  return (
    <BlockWrapper onDelete={onDelete} preview={preview}>
      <div className={`py-20 px-6 md:px-12 ${bgClass}`}>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <EditableText
              as="h2"
              value={title}
              onChange={(v) => updateProp('title', v)}
              preview={preview}
              className={`text-3xl md:text-4xl font-extrabold tracking-tight ${textClass}`}
            />
            <EditableText
              as="p"
              value={subtitle}
              onChange={(v) => updateProp('subtitle', v)}
              preview={preview}
              className={`text-lg max-w-xl mx-auto ${subClass}`}
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            {buttons.map((btn: { id: string; text: string }) => {
              const preset = BUTTON_PRESETS.find((p) => p.id === btn.id);
              if (!preset) return null;
              return (
                <div key={btn.id} className="relative group/btn">
                  {!preview && (
                    <button
                      onClick={() => removeButton(btn.id)}
                      className="absolute -top-2 -right-2 z-10 hidden group-hover/btn:flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs shadow"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    className={`inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${preset.tw}`}
                  >
                    {!preview ? (
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateButtonText(btn.id, e.currentTarget.textContent ?? btn.text)}
                        className="outline-none min-w-[40px]"
                      >
                        {btn.text}
                      </span>
                    ) : btn.text}
                  </button>
                </div>
              );
            })}
          </div>

          {!preview && (
            <div className="border-t border-border/40 pt-6">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Add more styles
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {BUTTON_PRESETS.filter((p) => !buttons.find((b: any) => b.id === p.id)).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => addButton(preset.id)}
                    className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-blue-400 hover:text-blue-600 transition"
                  >
                    <Plus className="h-3 w-3" />
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BlockWrapper>
  );
}

export const BlockRenderer = ({ block, onChange, onDelete, preview }: BlockProps) => {
  switch (block.type) {
    case 'hero':    return <HeroBlock    block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'features':return <FeaturesBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'text':    return <TextBlock    block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'image':   return <SingleImageBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'footer':  return <FooterBlock  block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'widget':  return <WidgetBlock  block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    case 'buttons': return <ButtonsBlock block={block} onChange={onChange} onDelete={onDelete} preview={preview} />;
    default: return <div className="p-4 border border-dashed border-red-500 text-red-500">Unknown block type: {block.type}</div>;
  }
};
