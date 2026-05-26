# Sunset Deck

A multi-widget pack covering Music, Chat Box, and Death Counter.

## What's in this folder

- `theme.json` — the ThemePack manifest (schemaVersion 2, kind `theme-pack`).
- `preview-hero.png` — the catalog card image. Replace with your own (16:9 ratio recommended; ≤512 KB).
- `preview-player.png`, `preview-chat-box.png`, `preview-death-counter.png` — one preview per widget the pack styles. Shown in the apply modal so the user can see what each source will look like before clicking Apply.
- `README.md` — this file. Used by the public mirror's listing; not parsed by the catalog.

## How to author your own

1. Copy this folder to a new directory named after your slug, e.g. `themes/my-cool-pack/`.
2. Edit `theme.json`:
   - Change `name`, `author`, `description`.
   - Update the `palette` to reflect your colors (cosmetic — drives the catalog swatch chip).
   - For each widget you want to style, fill in `widgets["<widget-type>"].fields` with override values. Keys must be a strict subset of that widget's FIELDS schema (see `apps/toolset/components/scene-builder/fields/widgetFieldSchemas.ts`).
   - Drop any widget you don't style — there's no need to include every widget type.
3. Replace the PNGs.
4. Submit a PR. Catalog CI validates against `schema/theme-pack.schema.json` and the per-widget allowed-keys list.

## Pack vs single-widget theme

This format (schemaVersion 2) is for "all-encompassing" themes that apply to several widgets at once. If you only want to style one widget surface, use the v1 `widget-theme` format instead — see `../my-first-theme/`. Both formats live side-by-side in the catalog.

## License

By submitting to the public mirror you agree to CC BY-NC 4.0 — your pack stays open and credited, but can't be repackaged for sale.
