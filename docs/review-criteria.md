# Review criteria

What a reviewer checks before accepting a theme. There is no scoring rubric —
this is human judgment. A reviewer who is uncertain rejects rather than
approves.

## Visual quality

Does the theme look intentional? Does it read well at stream-viewing
distance, over real game footage, at the size an overlay actually appears?
Low-contrast text and effects that fight the content are the most common
reasons a well-formed theme is turned down.

## Appropriateness

Nothing unsuitable for a professional streaming context. Slurs, hate
imagery, and sexually explicit content are rejected outright.

## Originality

Not a reskin of an already-accepted theme with one value changed. The
catalog is small; each entry should bring a distinct point of view.

## No AI

Does the CSS or copy read as machine-generated? The PR includes a no-AI
attestation; this step applies judgment to back it. Generic, padded, or
"comprehensive" descriptions and boilerplate CSS are warning signs.

## Honesty

Is the `preview.png` an accurate picture of the result? Is the description
truthful about what the theme does? A misleading preview is a rejection even
if the theme itself is good.

## Technical

Did anything slip past the automated checks? `fields` keys real and in
range, CSS targeting only documented selectors, no external assets, no
JavaScript, preview within size limits.

## Decision

- **Accepted:** the PR is merged and the theme is promoted to the catalog.
- **Rejected:** the PR is closed with a comment naming the specific problem —
  not a canned message. You're welcome to address it and resubmit.

There is no SLA. We read every PR; we don't commit to a turnaround time.
