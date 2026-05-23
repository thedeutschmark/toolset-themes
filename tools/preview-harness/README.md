# preview-harness

A tiny local preview server for testing a toolset theme without a toolset
account. Reads your `theme.json` (+ optional `overrides.css`), serves a
mock widget shell at `http://localhost:3000` with the theme applied, and
hot-reloads when you save.

Zero npm dependencies — pure Node, runs on Node 20+.

## Usage

From the repo root, after building a theme under
`submissions/<your-handle>/<theme-slug>/`:

```bash
node tools/preview-harness/src/server.mjs --theme submissions/your-handle/my-theme/theme.json
```

Then open <http://localhost:3000>. Edit `theme.json` or `overrides.css`
and the page reloads. Use `--port 4000` to change the port; use `--help`
for the flag list.

## What it shows

A static mock widget shell (chat-box style by default) with your theme's
`fields` exposed as CSS custom properties and your `overridesCSS` injected.
This is a visual check against the documented CSS-variable contract —
not a simulator of the live toolset runtime.

If the live toolset's contract changes, the harness updates in the same
PR that updates `docs/css-selectors.md`. Where the two disagree, the docs
are the source of truth.
