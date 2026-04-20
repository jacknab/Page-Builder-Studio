import { Block } from './templates';

export function generateHtml(blocks: Block[], title = 'My Generated Site'): string {
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
            <span class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-blue-600 text-white px-8 py-4 shadow-sm">${b.props.buttonText}</span>
          </div>
        </div>
        <div class="h-[400px] md:h-[500px]">
          <img src="${b.props.imageUrl}" alt="Hero image" class="w-full h-full object-cover rounded-xl shadow-lg" />
        </div>
      </div>
    </section>`;

      case 'features':
        const featureItems = b.props.features.map((f: any) => `
          <div class="space-y-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 class="text-xl font-semibold text-gray-900">${f.title}</h3>
            <p class="text-gray-600 leading-relaxed">${f.description}</p>
          </div>
        `).join('\n');
        
        return `
    <section class="py-20 px-6 md:px-12 bg-gray-50">
      <div class="max-w-5xl mx-auto space-y-16">
        <h2 class="text-3xl md:text-4xl font-bold text-center tracking-tight text-gray-900">${b.props.title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${featureItems}
        </div>
      </div>
    </section>`;

      case 'text':
        const alignClass = b.props.align === 'center' ? 'text-center mx-auto' : '';
        return `
    <section class="py-16 px-6 md:px-12 bg-white">
      <div class="max-w-3xl mx-auto prose prose-lg prose-slate ${alignClass}">
        ${b.props.content}
      </div>
    </section>`;

      case 'image':
        return `
    <section class="py-12 px-6 md:px-12 bg-white flex justify-center">
      <div class="max-w-5xl w-full h-[500px]">
        <img src="${b.props.url}" alt="${b.props.alt || 'Image block'}" class="w-full h-full object-cover rounded-xl shadow-md" />
      </div>
    </section>`;

      case 'footer':
        return `
    <footer class="py-8 px-6 md:px-12 bg-gray-900 text-white text-center">
      <p class="text-sm opacity-80">${b.props.text}</p>
    </footer>`;

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
  <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  </style>
</head>
<body class="bg-gray-50 text-gray-900 antialiased">
  ${blockHtmls.join('\n')}
</body>
</html>`;
}
