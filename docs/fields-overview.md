# Field overrides

Field overrides are the primary, stable surface a theme targets. They are
the same settings the widget's tool page exposes — so a theme that sets them
behaves exactly as if a user set them by hand, and survives widget updates.

## How it works

Your `theme.json` has a `fields` object. When a user applies your theme, the
toolset merges those fields over the widget's current config and saves the
result. Fields you don't set are left untouched, so the user keeps their own
choices for anything your theme is silent on.

Values are re-validated by the toolset on save. A value outside a field's
allowed range is coerced to the widget's default rather than persisted — so
stay inside the documented ranges, or your theme won't look the way you
intended.

## Allowed keys per widget type

Your `fields` keys must be a subset of the keys the target widget exposes.
Unknown keys fail validation. The current sets:

### `chat-box`

| Key | Type | Notes |
|---|---|---|
| `nameColor` | hex color | Username text color |
| `messageColor` | hex color | Message body color |
| `bgColor` | hex color or `transparent` | Widget background |
| `chipColor` | hex color | Chip backing behind name/badges |
| `chipOpacity` | number 0–100 | Chip alpha |
| `chipGlass` | boolean | Frosted-glass chips |
| `nameChip` | boolean | Put the name on its own chip |
| `showBadges` | boolean | Show subscriber/mod/VIP badges |
| `nameOnOwnRow` | boolean | Stack name above message |
| `fontSize` | number 10–72 | |
| `fontFamily` | font name | Must be an allowlisted web font |
| `alignment` | `left` / `right` | |
| `animation` | `scale` / `slide` / `fade` | Message entrance |
| `nameCase` | `user` / `sentence` / `upper` | |

### `death-counter`

| Key | Type | Notes |
|---|---|---|
| `skin` | `bold` / `minimal` / `tombstone` / `skull` / `skullbar` | |
| `accent` | hex color | Accent color |
| `label` | text, ≤ 24 chars | e.g. "Deaths" |
| `showGameName` | boolean | Show the current game above the count |
| `fontFamily` | font name | |

### `player`

| Key | Type | Notes |
|---|---|---|
| `coverGlow` | boolean | Glow behind the album art |
| `coverBlur` | boolean | Blurred album-art backdrop |

## Fonts

`fontFamily` must be one of the allowlisted web fonts so the overlay can
preload it. The allowlist includes: Jost, Poppins, Inter, Roboto,
Montserrat, Open Sans, Lato, Nunito, Raleway, Source Sans 3, DM Sans,
Outfit, Lexend, Space Grotesk, Barlow. A value outside the allowlist is
coerced to the default.

> This list mirrors the toolset's field schemas at the time of writing. New
> widget types and fields are added over time; this file is updated when
> they land. If a key you want isn't listed here, it isn't themeable yet.
