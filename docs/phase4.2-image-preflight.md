# Phase 4.2 image rendering audit — before fixes

## Scope inspected

The Vite/React app serves 24 route surfaces: home, celebration index plus 10 details, collection index plus 6 details, Gallery, About, FAQ, Privacy, Terms, and Contact. I inspected `src/imageManifest.js`, all image-bearing React components, `src/content.js`, CSS image and background declarations, public files, and the deployed HTML/bundle.

The app has 25 route surfaces: home, celebration index plus 10 details, collection index plus 6 details, Gallery, About, FAQ, Privacy, Terms, and Contact. It has no local editorial image directory. Before repair, its 33 editorial photographs were remote Unsplash IDs registered in the manifest. Their 1200px audit JPEGs had already been downloaded and verified in Phase 4.1. No Next.js image loader is used. Vercel serves the Vite bundle, and its SPA rewrite sends routes to `index.html`.

## Findings before fixes

| Route/section | Before-fix state | Cause |
| --- | --- | --- |
| Home celebration cards | Baby Showers, Birthdays, Anniversaries, Griha Pravesh blank | `image: null`; `Celebrations` conditionally omits the `<img>` |
| Home rental previews | Five groups have valid image IDs; Serveware blank | `Showcases` explicitly skips Serveware and its registry image is null. Other images lacked full-card cover positioning |
| Decorative Details | Four gradient placeholders | Cards contain an empty `aria-hidden` `<div>` and no image reference |
| `/collections` hero | Text/gradient hero | `ListingPage` passes `image={null}` |
| `/collections` category cards | Six text-only burgundy cards | `ListingPage` renders no `<img>` and always uses `listing-card--text` |
| Serveware detail hero | Text/gradient hero | Both `image` and `pageImage` are null |
| `/celebrations` category cards | Ten text-only burgundy cards | Deliberate text-led directory design; no empty image containers |
| Celebration detail heroes | Ten valid registered image assignments | No missing source found |
| Other pages | About has registered photography; Gallery, FAQ, legal, and Contact use text-led sections | Deliberate text-only presentation, no empty image containers |

## Rendering and delivery checks

- `background-image`, CSS `url(...)`, and local public-image references: none found.
- Existing source IDs resolve on Unsplash; no misspelled/case-sensitive local paths or broken imports were found.
- The production root returned HTTP 200, and its JS/CSS asset names match the local Phase 4.1 build. The deployment is not serving stale code.
- The failures identified above are missing `<img>` placements and deliberate null assignments, not a production path rewrite or image-domain configuration issue.
- No image was found hidden by `display:none`, zero opacity, or a stacking layer. The general rental preview cards did need explicit cover styling so their available images fill their intended frames.

## Missing placements counted before repair

17: four home celebration cards, one Home Serveware preview, four decorative detail cards, the `/collections` hero, six collection index cards, and the Serveware detail hero. All ten celebration detail heroes and five other rental detail heroes already had valid image assignments. The `/celebrations` directory is intentionally text-only and is not counted as a missing-image section.

