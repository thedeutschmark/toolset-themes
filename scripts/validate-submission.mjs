#!/usr/bin/env node
// Validates every theme directory under submissions/. Runs in CI before a
// human reviewer looks. The "no AI" rule is human-judged — that's not in
// here. What IS in here:
//
//   - theme.json validates against schema/widget-theme.schema.json (ajv).
//   - theme.json ≤ 64KB, preview.png ≤ 512KB and is a real PNG.
//   - overridesCSS (if listed) exists and contains no url(http*),
//     no @import, no <script>.
//   - No .js files anywhere in the submission directory.
//   - No two submissions share an author + slug combination.
//
// Fails the workflow with a non-zero exit and a clear per-error line.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ROOT = process.cwd();
const SUBMISSIONS = join(ROOT, "submissions");
const SCHEMA = join(ROOT, "schema", "widget-theme.schema.json");

const MAX_THEME_JSON_BYTES = 64 * 1024;
const MAX_PREVIEW_BYTES = 512 * 1024;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const errors = [];
function fail(where, msg) {
  errors.push(`${where}: ${msg}`);
}

function listDir(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function walkFiles(dir, out = []) {
  for (const entry of listDir(dir)) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

if (!existsSync(SUBMISSIONS)) {
  // Nothing to validate; not an error.
  console.log("No submissions/ directory — nothing to validate.");
  process.exit(0);
}
if (!existsSync(SCHEMA)) {
  console.error(`Missing schema: ${SCHEMA}`);
  process.exit(2);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(JSON.parse(readFileSync(SCHEMA, "utf8")));

// Each submission lives at submissions/<author>/<slug>/.
const seen = new Set();
let count = 0;
for (const author of listDir(SUBMISSIONS).filter((e) => e.isDirectory())) {
  const authorDir = join(SUBMISSIONS, author.name);
  for (const slug of listDir(authorDir).filter((e) => e.isDirectory())) {
    count++;
    const dir = join(authorDir, slug.name);
    const where = `submissions/${author.name}/${slug.name}`;
    const dupKey = `${author.name.toLowerCase()}/${slug.name.toLowerCase()}`;
    if (seen.has(dupKey)) {
      fail(where, `duplicate author+slug — another submission already uses ${dupKey}`);
      continue;
    }
    seen.add(dupKey);

    // theme.json — required, schema-valid, size-capped.
    const themeJsonPath = join(dir, "theme.json");
    if (!existsSync(themeJsonPath)) {
      fail(where, "theme.json is required");
      continue;
    }
    const themeBuf = readFileSync(themeJsonPath);
    if (themeBuf.byteLength > MAX_THEME_JSON_BYTES) {
      fail(where, `theme.json is ${themeBuf.byteLength} bytes — cap is ${MAX_THEME_JSON_BYTES}`);
    }
    let theme;
    try {
      theme = JSON.parse(themeBuf.toString("utf8"));
    } catch (err) {
      fail(where, `theme.json is not valid JSON — ${err.message}`);
      continue;
    }
    if (!validate(theme)) {
      for (const e of validate.errors ?? []) {
        fail(where, `theme.json ${e.instancePath || "/"} ${e.message}`);
      }
      continue;
    }

    // preview.png — must exist, be ≤512KB, be a real PNG.
    const previewPath = join(dir, theme.previewImage);
    if (!existsSync(previewPath)) {
      fail(where, `previewImage "${theme.previewImage}" not found in submission directory`);
    } else {
      const stat = statSync(previewPath);
      if (stat.size > MAX_PREVIEW_BYTES) {
        fail(where, `preview is ${stat.size} bytes — cap is ${MAX_PREVIEW_BYTES}`);
      }
      const buf = readFileSync(previewPath).subarray(0, 8);
      if (!buf.equals(PNG_MAGIC)) {
        fail(where, `previewImage is not a valid PNG (magic bytes mismatch)`);
      }
    }

    // overridesCSS — optional. If declared, must exist and be safe.
    if (theme.overridesCSS) {
      const cssPath = join(dir, theme.overridesCSS);
      if (!existsSync(cssPath)) {
        fail(where, `overridesCSS "${theme.overridesCSS}" not found`);
      } else {
        const css = readFileSync(cssPath, "utf8");
        if (/url\(\s*['"]?https?:/i.test(css)) {
          fail(where, "overrides.css contains url(http…/https…); bundle all assets in the submission directory");
        }
        if (/@import\b/i.test(css)) {
          fail(where, "overrides.css contains @import; bundle assets directly");
        }
        if (/<script\b/i.test(css)) {
          fail(where, "overrides.css contains <script>; themes are CSS + JSON only");
        }
      }
    }

    // No .js files anywhere in the submission dir.
    for (const file of walkFiles(dir)) {
      if (file.toLowerCase().endsWith(".js")) {
        fail(where, `${relative(dir, file)} — themes cannot include JavaScript`);
      }
    }
  }
}

if (errors.length) {
  console.error(`Validation failed (${errors.length} ${errors.length === 1 ? "error" : "errors"}):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

console.log(`Validated ${count} submission${count === 1 ? "" : "s"} — all checks passed.`);
