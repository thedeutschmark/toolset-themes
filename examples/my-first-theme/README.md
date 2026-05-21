# my-first-theme

A minimal, working chat-box theme. Copy this directory to
`submissions/<your-handle>/<theme-slug>/` and edit it to make your own.

## Files

- `theme.json` — the theme manifest. Change `name`, `author`, the `fields`,
  and (if you keep CSS) leave `overridesCSS` pointing at `overrides.css`.
- `overrides.css` — optional scoped CSS. Delete it and remove the
  `overridesCSS` line from `theme.json` if you only use field overrides.
- `preview.png` — replace with an honest screenshot of your theme applied.
  (This example ships without one; your submission must include it.)

## What it does

Sets a high-contrast white-on-dark chat: white names, slightly dimmed
message text, no chip backing, badges hidden, Space Grotesk, names on their
own row, fade-in. The CSS tightens the stacked-row gap and nudges message
opacity — both small touches the fields alone can't express.

## Try it

1. Validate `theme.json` against `../../schema/widget-theme.schema.json`.
2. Confirm every `fields` key appears in `../../docs/fields-overview.md` for
   `chat-box`.
3. Confirm any CSS selectors appear in `../../docs/css-selectors.md`.
