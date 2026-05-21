# The CSS selector contract

Field overrides cover most of what a theme needs. When you need finer
control, a theme may include an `overrides.css` file. This document is the
contract for what your CSS may target.

Your CSS is scoped to the widget's root element at apply time, so you write
plain selectors against the documented class names below. A class on this
list is stable — themes may rely on it. **Any class not on this list is
internal markup and may change without notice.** A theme that depends on
undocumented classes will break on a widget update and is rejected at review.

## Reach for fields first

Before writing CSS, check whether a field override does the job (see
[`fields-overview.md`](fields-overview.md)). Field overrides are the
supported, stable surface. CSS is for what fields can't express — spacing,
custom borders, subtle motion.

## chat-box

| Selector | Targets |
|---|---|
| `.chat-root` | The widget's outer container. |
| `.chat-line` | One message row. |
| `.chat-line--stacked` | A message row when name and message stack vertically (`nameOnOwnRow`). |
| `.chat-meta` | The name + badges cluster. |
| `.chat-name` | The username text. |
| `.chat-message` | The message body text. |
| `.chat-name-chip` | The chip backing behind the name. |
| `.chat-badges-chip` | The chip backing behind the badges. |
| `.chat-emote` | An inline emote image. |

The right-aligned layout adds `.chat-align-right` on an ancestor — account
for it if your CSS assumes left alignment.

## Other widgets

Other widget types (death-counter, player, …) do not yet expose a formalized
CSS selector contract. For those, build with **field overrides only** until
their selectors are documented here. Submitting CSS against a widget not
listed above will be rejected — there is no stable surface to target yet.

> This list grows as widgets formalize their markup. It is the single source
> of truth; if a selector isn't here, treat it as off-limits.
