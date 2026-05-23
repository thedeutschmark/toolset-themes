#!/usr/bin/env node
// Local preview server for a toolset theme. Zero deps.
//
//   node tools/preview-harness/src/server.mjs --theme path/to/theme.json
//
// Loads the theme.json + optional overrides.css, serves a static mock
// widget at http://localhost:3000 with the theme applied. Watches the
// theme directory; on any change reloads the page via Server-Sent Events.
// This is a visual check against the documented CSS-variable contract,
// not a simulation of the toolset runtime.

import { createServer } from "node:http";
import { readFileSync, watch, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

const { values, positionals } = parseArgs({
  options: {
    theme: { type: "string" },
    port: { type: "string", default: "3000" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`preview-harness — local toolset theme preview

  --theme  <path>   Path to a theme.json file. (required)
  --port   <n>      Port to listen on (default 3000).
  --help            Show this help.
`);
  process.exit(0);
}

const themePath = values.theme ? resolve(values.theme) : null;
if (!themePath || !existsSync(themePath)) {
  console.error("Pass --theme <path/to/theme.json>");
  process.exit(2);
}
const themeDir = dirname(themePath);
const port = Number.parseInt(values.port ?? "3000", 10);

const sseClients = new Set();

function loadTheme() {
  const json = JSON.parse(readFileSync(themePath, "utf8"));
  const css = json.overridesCSS && existsSync(join(themeDir, json.overridesCSS))
    ? readFileSync(join(themeDir, json.overridesCSS), "utf8")
    : "";
  return { json, css };
}

function renderPage(theme) {
  const fields = theme.json.fields ?? {};
  // Project field values into CSS custom properties so an overrides.css
  // file can reach them as var(--field-<key>).
  const fieldVars = Object.entries(fields)
    .map(([k, v]) => `  --field-${k}: ${typeof v === "string" ? v : String(v)};`)
    .join("\n");
  const safeCss = (theme.css ?? "").replace(/<\//g, "<\\/");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${theme.json.name ?? "theme preview"} — preview-harness</title>
<style>
  :root {
${fieldVars}
  }
  html, body { margin: 0; padding: 0; background: #0b0c0e; color: #e6e6e3; font-family: ui-sans-serif, system-ui, sans-serif; min-height: 100vh; }
  .harness { display: grid; grid-template-rows: auto 1fr; min-height: 100vh; }
  .harness__bar { display: flex; gap: 16px; align-items: center; padding: 10px 16px; border-bottom: 1px solid #1a1c20; font-size: 12px; color: #8e8d8a; }
  .harness__bar strong { color: #e6e6e3; font-weight: 600; }
  .harness__stage { display: grid; place-items: center; padding: 36px; }
  .widget { width: min(540px, 100%); padding: 24px; border-radius: 14px; background: var(--field-bgColor, rgba(20,20,24,0.85)); color: var(--field-messageColor, #e6e6e3); font-family: var(--field-fontFamily, inherit); }
  .chat-line { display: flex; gap: 10px; padding: 6px 0; }
  .chat-name-chip { padding: 2px 8px; border-radius: 6px; background: rgba(255,255,255,0.06); color: var(--field-nameColor, #fff); font-weight: 600; opacity: var(--field-chipOpacity, 1); }
  .chat-message { color: var(--field-messageColor, #c7ccd6); }
  ${safeCss}
</style>
</head>
<body>
  <div class="harness">
    <div class="harness__bar">
      <strong>${theme.json.name ?? "(unnamed)"}</strong>
      <span>· widgetType: ${theme.json.widgetType ?? "?"}</span>
      <span>· by ${theme.json.author ?? "?"}</span>
      <span style="margin-left:auto">edits hot-reload</span>
    </div>
    <div class="harness__stage">
      <div class="widget" data-widget="${theme.json.widgetType}">
        <div class="chat-line"><span class="chat-name-chip">streamer</span><span class="chat-message">welcome to the stream</span></div>
        <div class="chat-line"><span class="chat-name-chip">viewer_1</span><span class="chat-message">lol that was wild</span></div>
        <div class="chat-line"><span class="chat-name-chip">viewer_2</span><span class="chat-message">first time here, this looks great</span></div>
        <div class="chat-line"><span class="chat-name-chip">moderator</span><span class="chat-message">remember to follow if you're enjoying!</span></div>
      </div>
    </div>
  </div>
  <script>
    const es = new EventSource("/events");
    es.onmessage = () => location.reload();
  </script>
</body>
</html>`;
}

const server = createServer((req, res) => {
  if (req.url === "/events") {
    res.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "keep-alive",
    });
    res.write(": connected\n\n");
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
    return;
  }
  try {
    const theme = loadTheme();
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(renderPage(theme));
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end(`Failed to load theme:\n${err.message}`);
  }
});

server.listen(port, () => {
  console.log(`preview-harness → http://localhost:${port}`);
  console.log(`  theme: ${themePath}`);
  console.log(`  watching: ${themeDir}`);
});

// Watch the theme directory; on any change, ping all SSE clients to
// trigger a page reload. fs.watch is good enough for a dev tool.
let debounce = null;
watch(themeDir, { recursive: true }, () => {
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(() => {
    for (const client of sseClients) client.write("data: reload\n\n");
  }, 80);
});
