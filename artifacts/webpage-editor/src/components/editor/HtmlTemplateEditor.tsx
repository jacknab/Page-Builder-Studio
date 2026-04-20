import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Image as ImageIcon, Save } from "lucide-react";

interface HtmlTemplateEditorProps {
  html: string;
  onChange: (html: string) => void;
  preview: boolean;
  deviceMode: "desktop" | "mobile";
}

interface SelectedElement {
  tag: string;
  text: string;
  src: string;
}

const decorateHtml = (html: string, preview: boolean) => {
  const escapedPreview = preview ? "true" : "false";
  const injection = `
<style data-launchsite-editor="true">
  ${preview ? "" : `
  [contenteditable="true"] * { outline-offset: 3px; }
  [data-launchsite-selected="true"] { outline: 3px solid #2563eb !important; outline-offset: 4px !important; }
  a, button { cursor: ${preview ? "pointer" : "text"} !important; }
  `}
</style>
<script data-launchsite-editor="true">
(function(){
  var preview = ${escapedPreview};
  var selected = null;
  function cleanHtml(){
    var clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('[data-launchsite-editor="true"]').forEach(function(node){ node.remove(); });
    clone.querySelectorAll('[data-launchsite-selected]').forEach(function(node){ node.removeAttribute('data-launchsite-selected'); });
    clone.querySelectorAll('[contenteditable]').forEach(function(node){ node.removeAttribute('contenteditable'); });
    return '<!DOCTYPE html>\n' + clone.outerHTML;
  }
  function postSave(){ parent.postMessage({ type:'launchsite-html-updated', html: cleanHtml() }, '*'); }
  function clearSelection(){
    document.querySelectorAll('[data-launchsite-selected]').forEach(function(node){ node.removeAttribute('data-launchsite-selected'); });
  }
  if (!preview) {
    document.body.setAttribute('contenteditable', 'true');
    document.addEventListener('click', function(event){
      var target = event.target;
      if (!target || target === document.documentElement || target === document.body) return;
      if (target.closest('[data-launchsite-editor="true"]')) return;
      event.preventDefault();
      event.stopPropagation();
      clearSelection();
      selected = target;
      selected.setAttribute('data-launchsite-selected', 'true');
      parent.postMessage({
        type:'launchsite-selected',
        tag: selected.tagName || '',
        text: selected.innerText || selected.alt || '',
        src: selected.getAttribute && (selected.getAttribute('src') || '')
      }, '*');
    }, true);
    document.addEventListener('focusout', function(){ setTimeout(postSave, 80); }, true);
    window.addEventListener('message', function(event){
      var data = event.data || {};
      if (data.type === 'launchsite-delete-selected' && selected) {
        var removeTarget = selected;
        selected = null;
        removeTarget.remove();
        clearSelection();
        postSave();
      }
      if (data.type === 'launchsite-update-image' && selected && selected.tagName === 'IMG') {
        selected.setAttribute('src', data.src || '');
        postSave();
      }
      if (data.type === 'launchsite-save') postSave();
    });
  }
})();
</script>`;

  if (html.includes("</body>")) {
    return html.replace("</body>", `${injection}</body>`);
  }

  return `${html}${injection}`;
};

export function HtmlTemplateEditor({ html, onChange, preview, deviceMode }: HtmlTemplateEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const srcDoc = useMemo(() => decorateHtml(html, preview), [html, preview]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data || {};
      if (data.type === "launchsite-selected") {
        const next = { tag: data.tag || "Element", text: data.text || "", src: data.src || "" };
        setSelected(next);
        setImageUrl(next.src);
      }
      if (data.type === "launchsite-html-updated" && typeof data.html === "string") {
        onChange(data.html);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onChange]);

  const postToFrame = (message: Record<string, string>) => {
    iframeRef.current?.contentWindow?.postMessage(message, "*");
  };

  return (
    <div className="space-y-4">
      {!preview && (
        <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-border bg-background p-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-sm font-bold">Full HTML template editor</p>
            <p className="text-xs text-muted-foreground">Click page text to edit it directly. Click an image to replace it, or delete the selected item.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            {selected?.tag === "IMG" && (
              <div className="w-72 space-y-1">
                <Label className="text-xs">Selected image URL</Label>
                <div className="flex gap-2">
                  <Input value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className="h-9" />
                  <Button size="sm" variant="secondary" onClick={() => postToFrame({ type: "launchsite-update-image", src: imageUrl })}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <Button size="sm" variant="outline" onClick={() => postToFrame({ type: "launchsite-save" })} className="gap-2">
              <Save className="h-4 w-4" />
              Save edits
            </Button>
            <Button size="sm" variant="destructive" disabled={!selected} onClick={() => postToFrame({ type: "launchsite-delete-selected" })} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete selected
            </Button>
          </div>
        </div>
      )}
      <div className={`mx-auto overflow-hidden bg-white shadow-2xl transition-all ${deviceMode === "mobile" ? "max-w-[390px] rounded-[2rem] border-[10px] border-slate-950" : "max-w-full rounded-2xl border border-border"}`}>
        <iframe
          ref={iframeRef}
          title="HTML template editor"
          srcDoc={srcDoc}
          className={`block w-full bg-white ${deviceMode === "mobile" ? "h-[780px]" : "h-[calc(100vh-180px)] min-h-[760px]"}`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      </div>
    </div>
  );
}
