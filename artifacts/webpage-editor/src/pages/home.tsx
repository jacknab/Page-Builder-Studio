import { useState } from "react";
import { Block, TEMPLATES, Template, generateId } from "@/lib/templates";
import { BlockRenderer } from "@/components/editor/blocks";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Monitor, 
  Smartphone, 
  Download, 
  Code, 
  Eye, 
  PenTool,
  Plus,
  LayoutTemplate
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { generateHtml } from "@/lib/export";

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>(TEMPLATES[0].blocks);
  const [isPreview, setIsPreview] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const { toast } = useToast();

  const updateBlock = (id: string, updated: Block) => {
    setBlocks(blocks.map(b => b.id === id ? updated : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const loadTemplate = (template: Template) => {
    // Clone blocks to get new IDs
    const newBlocks = template.blocks.map(b => ({ ...b, id: generateId() }));
    setBlocks(newBlocks);
  };

  const addBlock = (type: Block['type']) => {
    let newBlock: Block;
    switch(type) {
      case 'hero': 
        newBlock = { id: generateId(), type: 'hero', props: { title: 'New Hero', subtitle: 'Subtitle text goes here', buttonText: 'Click Me', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop' }};
        break;
      case 'features':
        newBlock = { id: generateId(), type: 'features', props: { title: 'New Features', features: [{title: 'Feature 1', description: 'Desc 1'}, {title: 'Feature 2', description: 'Desc 2'}, {title: 'Feature 3', description: 'Desc 3'}] }};
        break;
      case 'text':
        newBlock = { id: generateId(), type: 'text', props: { content: 'New text block content...', align: 'left' }};
        break;
      case 'image':
        newBlock = { id: generateId(), type: 'image', props: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', alt: 'Image' }};
        break;
      case 'footer':
        newBlock = { id: generateId(), type: 'footer', props: { text: 'New footer text' }};
        break;
      default: return;
    }
    setBlocks([...blocks, newBlock]);
  };

  const exportHtml = () => {
    const html = generateHtml(blocks);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported successfully",
      description: "Your webpage HTML has been downloaded.",
    });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      {!isPreview && (
        <div className="w-80 border-r border-border bg-card flex flex-col z-20 shadow-sm shrink-0">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight mb-1">
              <div className="w-6 h-6 rounded-sm bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs leading-none">W</span>
              </div>
              Webpage Editor
            </div>
            <p className="text-sm text-muted-foreground">Studio creator tool</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {/* Templates */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4" /> Templates
                </h3>
                <div className="grid gap-2">
                  {TEMPLATES.map(t => (
                    <Button 
                      key={t.id} 
                      variant="outline" 
                      className="justify-start h-auto py-3 px-4 text-left block w-full bg-background hover:bg-accent/50 hover:border-primary/30 transition-all"
                      onClick={() => loadTemplate(t)}
                    >
                      <span className="block font-medium mb-1">{t.name}</span>
                      <span className="block text-xs text-muted-foreground font-normal whitespace-normal">{t.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Add Blocks */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Block
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => addBlock('hero')} className="bg-muted hover:bg-accent hover:text-accent-foreground text-xs shadow-none">Hero</Button>
                  <Button variant="secondary" size="sm" onClick={() => addBlock('features')} className="bg-muted hover:bg-accent hover:text-accent-foreground text-xs shadow-none">Features</Button>
                  <Button variant="secondary" size="sm" onClick={() => addBlock('text')} className="bg-muted hover:bg-accent hover:text-accent-foreground text-xs shadow-none">Text</Button>
                  <Button variant="secondary" size="sm" onClick={() => addBlock('image')} className="bg-muted hover:bg-accent hover:text-accent-foreground text-xs shadow-none">Image</Button>
                  <Button variant="secondary" size="sm" onClick={() => addBlock('footer')} className="bg-muted hover:bg-accent hover:text-accent-foreground text-xs shadow-none col-span-2">Footer</Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col bg-muted/20 relative">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-2">
            {isPreview && (
              <div className="flex bg-muted p-1 rounded-md">
                <Button variant={deviceMode === 'desktop' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setDeviceMode('desktop')}>
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button variant={deviceMode === 'mobile' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setDeviceMode('mobile')}>
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant={isPreview ? "secondary" : "default"} 
              onClick={() => setIsPreview(!isPreview)}
              className="gap-2"
            >
              {isPreview ? <PenTool className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? 'Back to Edit' : 'Preview'}
            </Button>
            
            <Button variant="outline" onClick={exportHtml} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </header>

        {/* Editor Area */}
        <ScrollArea className="flex-1">
          <div className={`mx-auto transition-all duration-300 ${isPreview ? (deviceMode === 'mobile' ? 'max-w-[400px] border-x border-border bg-background my-8 shadow-2xl rounded-3xl overflow-hidden min-h-[800px]' : 'max-w-none bg-background') : 'max-w-[1200px] p-8 space-y-4'}`}>
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed border-border rounded-xl">
                <LayoutTemplate className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">Your page is empty</p>
                <p className="text-sm">Select a template or add a block from the sidebar to begin.</p>
              </div>
            ) : (
              blocks.map((block) => (
                <div key={block.id} className={isPreview ? "" : "bg-background rounded-xl shadow-sm border border-border/40 overflow-hidden"}>
                  <BlockRenderer
                    block={block}
                    onChange={(updated) => updateBlock(block.id, updated)}
                    onDelete={() => deleteBlock(block.id)}
                    preview={isPreview}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}