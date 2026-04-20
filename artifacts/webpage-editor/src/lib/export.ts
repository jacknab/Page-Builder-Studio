import { Block, BUTTON_PRESETS, GOOGLE_FONTS } from './templates';

function getFontLink(fontName: string): string {
  const font = GOOGLE_FONTS.find((f) => f.name === fontName);
  if (!font) return '';
  return `<link href="https://fonts.googleapis.com/css2?family=${font.url}&display=swap" rel="stylesheet">`;
}

function getFontFamily(fontName: string): string {
  const font = GOOGLE_FONTS.find((f) => f.name === fontName);
  return font ? font.family : "'Plus Jakarta Sans', sans-serif";
}

export function generateHtml(blocks: Block[], title = 'My Generated Site', fontName = 'Plus Jakarta Sans'): string {
  const fontLink = getFontLink(fontName);
  const fontFamily = getFontFamily(fontName);

  const blockHtmls = blocks.map(b => {
    switch (b.type) {
      case 'hero':
        return `
    <section class="py-20 md:py-32 px-6 md:px-12 bg-white">
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">${b.props.title}</h1>
          <p class="text-lg md:text-xl text-gray-600 max-w-lg">${b.props.subtitle}</p>
          <div>
            <span class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white px-8 py-4 shadow-sm">${b.props.buttonText}</span>
          </div>
        </div>
        <div style="height:500px">
          <img src="${b.props.imageUrl}" alt="Hero image" style="width:100%;height:100%;object-fit:cover;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.1)" />
        </div>
      </div>
    </section>`;

      case 'features': {
        const featureItems = b.props.features.map((f: any) => `
          <div style="padding:24px;background:#fff;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,0.06);border:1px solid #f1f5f9">
            <h3 style="margin:0 0 8px;font-size:20px;font-weight:600;color:#0f172a">${f.title}</h3>
            <p style="margin:0;color:#64748b;line-height:1.6">${f.description}</p>
          </div>
        `).join('\n');
        return `
    <section style="padding:80px 48px;background:#f8fafc">
      <div style="max-width:900px;margin:0 auto">
        <h2 style="font-size:36px;font-weight:700;text-align:center;margin:0 0 64px;color:#0f172a">${b.props.title}</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px">
          ${featureItems}
        </div>
      </div>
    </section>`;
      }

      case 'text': {
        const alignStyle = b.props.align === 'center' ? 'text-align:center;margin:0 auto' : '';
        return `
    <section style="padding:64px 48px;background:#fff">
      <div style="max-width:720px;margin:0 auto;font-size:18px;line-height:1.8;color:#334155;${alignStyle}">
        ${b.props.content}
      </div>
    </section>`;
      }

      case 'image':
        return `
    <section style="padding:48px;background:#fff;display:flex;justify-content:center">
      <div style="max-width:900px;width:100%;height:500px">
        <img src="${b.props.url}" alt="${b.props.alt || 'Image block'}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08)" />
      </div>
    </section>`;

      case 'footer':
        return `
    <footer style="padding:32px 48px;background:#0f172a;color:#fff;text-align:center">
      <p style="margin:0;font-size:14px;opacity:.75">${b.props.text}</p>
    </footer>`;

      case 'widget':
        return b.props.html
          ? `
    <section style="padding:32px 48px;background:#fff">
      <div style="max-width:900px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
        ${b.props.html}
      </div>
    </section>`
          : '';

      case 'buttons': {
        const buttonItems = (b.props.buttons || []).map((btn: { id: string; text: string }) => {
          const preset = BUTTON_PRESETS.find((p) => p.id === btn.id);
          if (!preset) return '';
          const styleMap: Record<string, string> = {
            'solid-blue':      'background:#2563eb;color:#fff;border:none',
            'solid-green':     'background:#059669;color:#fff;border:none',
            'solid-red':       'background:#ef4444;color:#fff;border:none',
            'solid-purple':    'background:#7c3aed;color:#fff;border:none',
            'solid-orange':    'background:#f97316;color:#fff;border:none',
            'solid-dark':      'background:#0f172a;color:#fff;border:none',
            'solid-teal':      'background:#14b8a6;color:#fff;border:none',
            'solid-rose':      'background:#f43f5e;color:#fff;border:none',
            'outline-blue':    'background:transparent;color:#2563eb;border:2px solid #2563eb',
            'outline-green':   'background:transparent;color:#059669;border:2px solid #059669',
            'outline-red':     'background:transparent;color:#ef4444;border:2px solid #ef4444',
            'outline-purple':  'background:transparent;color:#7c3aed;border:2px solid #7c3aed',
            'pill-blue':       'background:#2563eb;color:#fff;border:none;border-radius:9999px',
            'pill-outline':    'background:transparent;color:#475569;border:2px solid #cbd5e1;border-radius:9999px',
            'gradient-purple': 'background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#fff;border:none',
            'gradient-sunset': 'background:linear-gradient(135deg,#fb923c,#ec4899);color:#fff;border:none',
            'gradient-ocean':  'background:linear-gradient(135deg,#06b6d4,#2563eb);color:#fff;border:none',
            'gradient-dark':   'background:linear-gradient(135deg,#1e293b,#0f172a);color:#fff;border:none',
            'shadow-blue':     'background:#2563eb;color:#fff;border:none;box-shadow:0 5px 0 #1e40af',
            'soft-blue':       'background:#dbeafe;color:#1d4ed8;border:none',
            'soft-green':      'background:#d1fae5;color:#065f46;border:none',
            'soft-purple':     'background:#ede9fe;color:#5b21b6;border:none',
            'ghost':           'background:transparent;color:#475569;border:none',
            'ghost-blue':      'background:transparent;color:#2563eb;border:none',
          };
          const style = styleMap[preset.id] || 'background:#2563eb;color:#fff;border:none';
          const borderRadius = preset.id.startsWith('pill') ? '9999px' : '8px';
          return `<a href="#" style="display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;border-radius:${borderRadius};font-size:14px;font-weight:600;text-decoration:none;${style}">${btn.text}</a>`;
        }).join('\n');

        const bgStyle = b.props.bg === 'dark' ? 'background:#0f172a' : b.props.bg === 'muted' ? 'background:#f8fafc' : 'background:#fff';
        const titleColor = b.props.bg === 'dark' ? '#f8fafc' : '#0f172a';
        const subColor = b.props.bg === 'dark' ? '#94a3b8' : '#64748b';
        return `
    <section style="padding:80px 48px;${bgStyle}">
      <div style="max-width:900px;margin:0 auto;text-align:center">
        <h2 style="font-size:36px;font-weight:800;margin:0 0 12px;color:${titleColor}">${b.props.title || 'Button Styles'}</h2>
        <p style="font-size:18px;color:${subColor};margin:0 0 48px">${b.props.subtitle || ''}</p>
        <div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;align-items:center">
          ${buttonItems}
        </div>
      </div>
    </section>`;
      }

      default:
        return '';
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${fontLink}
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      margin: 0;
      background: #f8fafc;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3, h4 { font-family: ${fontFamily}; }
    a { cursor: pointer; }
  </style>
</head>
<body>
  ${blockHtmls.join('\n')}
</body>
</html>`;
}
