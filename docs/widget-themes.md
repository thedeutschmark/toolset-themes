# The WidgetTheme format

A widget theme is a `theme.json` file plus optional sibling files in the
same directory. The JSON validates against
[`schema/widget-theme.schema.json`](../schema/widget-theme.schema.json).

## Shape

```json
{
  "schemaVersion": 1,
  "kind": "widget-theme",
  "widgetType": "chat-box",
  "name": "Monochrome Minimal",
  "author": "your-github-handle",
  "description": "High-contrast minimal chat, no chips.",
  "previewImage": "preview.png",
  "fields": {
    "nameColor": "#ffffff",
    "messageColor": "#c7ccd6",
    "bgColor": "transparent",
    "chipOpacity": 0,
    "showBadges": false,
    "fontFamily": "Space Grotesk"
  },
  "overridesCSS": "overrides.css"
}
```

## Fields of the manifest

| Key | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Always `1` for this contract version. |
| `kind` | yes | Always `"widget-theme"`. |
| `widgetType` | yes | The widget the theme targets. Must be a known type. |
| `name` | yes | Display name in the catalog. Max 80 chars. |
| `author` | yes | Your handle. Max 64 chars. |
| `description` | yes | One line. Max 200 chars. |
| `previewImage` | yes | Relative path to `preview.png`. Max 512 KB. |
| `fields` | yes | Partial config; keys must be a subset of the widget's field schema. See [`fields-overview.md`](fields-overview.md). |
| `overridesCSS` | no | Relative path to a CSS file in the theme directory. |

## What a theme cannot do

- Run JavaScript. No `.js`, no `<script>`, no inline handlers.
- Reference external assets. No `url(http…)`, no `@import`.
- Change a widget's behavior. A theme only changes appearance — field
  values and scoped CSS. It can't add commands, change polling, or alter
  how the widget connects to anything.
- Target undocumented markup. CSS may only use the selectors in
  [`css-selectors.md`](css-selectors.md).

## Slugs

Your submission directory determines your slug:
`submissions/<your-handle>/<theme-slug>/`. The slug is
`<your-handle>/<theme-slug>` and must be unique in the catalog. Updating an
accepted theme means submitting a new slug (e.g. `monochrome-minimal-v2`) —
accepted themes are immutable so applied looks don't change under users.
