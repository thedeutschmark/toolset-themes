# Contributing a theme

Thanks for building something. This guide covers how submission works, the
quality bar, and the rules. Read it before you open a pull request.

## How submission works

1. **Fork** this repository.
2. **Create** a directory under `submissions/<your-handle>/<theme-slug>/`
   with:
   - `theme.json` — your theme, in the WidgetTheme format.
   - `overrides.css` — optional scoped CSS.
   - `preview.png` — required. An honest screenshot of the theme applied,
     at most 512 KB, PNG only.
3. **Open a pull request** against `main`. Title it like
   `[theme] Monochrome Minimal — chat-box`.
4. **Automated checks run** (see below). They must pass before a human
   looks at the PR.
5. **A reviewer reads it.** If accepted, the PR is merged and the theme is
   promoted to the in-app catalog. If not, the PR is closed with a comment
   naming the specific problem. You're welcome to address it and resubmit.

## The rules

These are firm. A submission that breaks any of them is rejected.

### No AI-generated submissions

AI-generated visuals, AI-generated CSS, and AI-generated copy are not
accepted. The pull request template includes an attestation that you wrote
the theme yourself. Automated tools can't reliably detect generated CSS, so
this is enforced by human judgment during review. A reviewer who is unsure
will reject rather than approve.

### No commerce

There are no paid themes, no tiers, no "support the creator" buttons, and
no revenue share. Once a theme is in the catalog it is free to every
toolset user. What you do with your work off-platform is your business; the
platform itself carries no commerce in the theme flow.

### No JavaScript or external assets

Themes are field values and CSS. The following are rejected — most of them
automatically:

- `.js` files, `<script>` tags, inline event handlers, `javascript:` URIs.
- `@import` rules in CSS.
- `url(http://…)` or `url(https://…)` in CSS — bundle assets in your
  directory instead.
- HTML files.
- Binary files other than `preview.png` (PNG, max 512 KB).

## The quality bar

A reviewer judges your theme against the criteria in
[`docs/review-criteria.md`](docs/review-criteria.md). In short:

- **Visual quality** — does it look intentional, and read well at
  stream-viewing distance?
- **Appropriateness** — nothing unsuitable for a professional streaming
  context.
- **Originality** — not a one-color reskin of an already-accepted theme.
- **Honesty** — the `preview.png` accurately represents the result; the
  description is truthful.
- **Technical correctness** — `fields` keys are real keys for the widget
  type; values stay in range; CSS targets only documented selectors.

## Field overrides

Your `fields` object must use keys the target widget actually exposes. The
authoritative list per widget type is in
[`docs/fields-overview.md`](docs/fields-overview.md). Unknown keys fail
validation. Values outside a field's range are coerced to the widget's
default when the theme is applied, so keep them in range.

## CSS

Optional. If you write `overrides.css`, target only the documented class
selectors in [`docs/css-selectors.md`](docs/css-selectors.md). Class names
that aren't on that list are internal markup and may change without notice —
a theme that depends on them will break. Your CSS is scoped to the widget's
root at apply time.

## License

By submitting a theme you agree to license it under the terms in
[`LICENSE`](LICENSE). It permits free use and redistribution within the
toolset and bars commercial resale of the theme itself. If the license
terms don't work for you, don't submit.
