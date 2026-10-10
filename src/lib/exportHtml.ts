// Standalone HTML export.
// Strategy: the browser has already computed the final, fully-compiled CSS
// for the running app (Tailwind's JIT output included) — we read it
// straight out of document.styleSheets instead of re-running a build step.
// Combined with the already-rendered preview DOM, this produces a single
// self-contained file with no external CDN, no build tool, and no server.

function escapeTitle(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function getAllAppCss(): string {
  let css = ''
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = sheet.cssRules
      for (const rule of Array.from(rules)) css += rule.cssText + '\n'
    } catch {
      // Cross-origin stylesheet (shouldn't happen in this app) — skip it.
    }
  }
  return css
}

export function buildStandaloneHtml(templateOuterHtml: string, css: string, title: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeTitle(title)}</title>
<style>
${css}
html,body{margin:0;background:#f3f4f6;}
.export-frame{max-width:1040px;margin:0 auto;}
@media (max-width:1040px){.export-frame{max-width:100%;}}
</style>
</head>
<body>
<div class="export-frame">
${templateOuterHtml}
</div>
</body>
</html>
`
}

export function slugify(name: string): string {
  const s = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return s || 'profile'
}
