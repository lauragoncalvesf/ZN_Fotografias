---
name: zn-photography-editorial-landing
description: Design and implement refined photography portfolio landing pages by reconciling Anything and Portrait reference systems with ZN Fotografias brand assets.
---

# SKILL — ZN Fotografias | Editorial Photography Landing

## 1. Mission and precedence
Create a premium, human, photographic landing page; never substitute a generic SaaS template. **Read both complete source references** (`DESIGN ZN(1).md` = Anything; `DESIGN(1).md` = Portrait) before implementing. These documents are source-of-truth **for their own respective styles**; their incompatible rules must not be combined literally. The ZN logo, user-provided photographs, client instructions, and verified contact details are source-of-truth for the brand. Precedence: (1) explicit client requirements and actual brand assets; (2) original reference documents for the chosen visual role; (3) this merged skill's documented reconciliation; (4) minimal justified implementation choices. Label inferences; do not invent testimonials, prices, portfolio credits, business claims, WhatsApp numbers, or photos.

## 2. Visual thesis
**Anything supplies:** atmospheric imagery, generous whitespace, frosted floating navigation, quiet editorial composition, restrained shadows and 20px soft geometry. **Portrait supplies:** storytelling through asymmetrical photographs, personal scrapbook feeling, variable image aspect ratios, compressed display typography, gentle labels, minimal outlined photo cards. **ZN supplies:** actual ZN monogram, strong royal-blue identity, photography services, location and contact channel. Result: white-paper editorial portfolio with deep-blue accents, carefully art-directed imagery, warm personal tone, and one prominent contact path.

## 3. Explicit vs adapted rules
| Topic | Anything source | Portrait source | ZN implementation decision |
|---|---|---|---|
| Canvas | white `#fff`, soft `#f9f9f9` | white `#fff` | white with rare off-white cards |
| Ink | charcoal `#18191b` | navy `#08304c` | navy primary; charcoal supporting |
| Accent | fern `#448f52` sparingly | rainbow on one word/CTA | **do not use either by default**; logo-inspired royal blue (approximation; verify exact color with client) |
| Typography | Instrument Serif italic + Instrument Sans + Inter | Basier Circle display + Switzer UI | Inter UI + Instrument Sans/compatible display; optional Instrument Serif for short editorial accent; **never replace actual ZN logo with a typed wordmark** |
| Geometry | cards/images 20px, CTA pill | cards/images 24px, nav/buttons 28px | photo cards 24px, nav 28px, pill CTA 9999px; one consistent system |
| Layout | full-bleed atmospheric hero | collage hero + masonry | restrained photo collage hero, then irregular portfolio grid |
| Action | dark filled pill | rainbow-outline pill | navy/royal-blue single primary contact pill; neutral ghost secondary; no rainbow |
| Shadow | 0.1 max soft | layered 0.03–0.08 | subtle layered shadow, max alpha 0.08 on standard cards |
| Images | atmospheric, soft, full-bleed | natural candid Polaroids | **real ZN work only**, varied wedding, event, sports and content categories; no fake sample photographs presented as portfolio |

These are **adaptation decisions**, not claims that the original references specify ZN branding.

## 4. Design tokens
```css
:root {
  --zn-paper:#ffffff; --zn-snow:#f9f9f9; --zn-ink:#08304c;
  --zn-charcoal:#18191b; --zn-muted:#6a6a6c; --zn-line:#e4e7eb;
  --zn-blue:#1039ba; /* proposed from supplied logo image; verify before release */
  --zn-wash:#e8f1ff; --zn-radius-card:24px; --zn-radius-nav:28px;
  --zn-radius-action:9999px; --zn-content:1200px;
  --zn-space-section:clamp(72px,9vw,128px);
  --zn-shadow:0 16px 16px -8px rgba(0,0,0,.03),0 6px 10px -5px rgba(0,0,0,.04);
  --zn-font-ui:'Inter',system-ui,sans-serif;
  --zn-font-display:'Instrument Sans','Inter',system-ui,sans-serif;
  --zn-font-editorial:'Instrument Serif',Georgia,serif;
}
```
Use accessible licensed/hosted fonts; fall back gracefully. Body 16px/1.5, captions 12–14px, section titles clamp(36px,5vw,60px), hero clamp(48px,7vw,88px) with carefully tuned negative tracking and line-height 1.03–1.12. Preserve word breaks on small screens. Content max width 1200px; horizontal gutters 20–48px; element gap 12–24px. Small eyebrow labels 11–12px uppercase tracked 0.12em. Never use rainbow text or green accent without explicit brand approval.

## 5. Component specifications
1. **Floating nav:** white/translucent pill, 28px radius, soft shadow, restrained blur, max width 1100px. Real logo left, anchors to Portfolio/Serviços/Sobre, one Orçamento action right. On mobile, simplify navigation without hiding contact.
2. **Hero:** short photographic promise, personal subtitle, one CTA to WhatsApp, secondary anchor to portfolio; offset real photos or full-bleed real hero. Photography must not obscure text. No hero search input: reference component is product-specific, not relevant to photographer.
3. **Photo collage:** mixed portrait/landscape aspect ratios, optional restrained 2–5° tilt only in hero; no random rotations in main gallery. All crops preserve faces and key subjects.
4. **Portfolio grid:** mixed ratios (e.g. 4:5, 3:4, 16:10), gap 12–20px, 24px radius, tiny caption/category; do not force every image into identical tiles. Use actual supplied work; until then, honest placeholders rather than stock photos masquerading as portfolio.
5. **Service cards:** Casamentos, Eventos, Esportes, Produção de conteúdo only where confirmed; clear 1-sentence descriptions, no fabricated packages or prices.
6. **About:** José Erick / ZN Fotografias; warm factual language; no unsupported years of experience, awards or guarantees.
7. **Contact:** one prominent WhatsApp CTA; wire only after verifying number. If unknown, link to confirmed Instagram profile or mark configuration TODO.
8. **Footer:** actual brand, minimal nav and working verified social/contact links.

## 6. Photography art direction
Photographs are the product. Prioritize authentic, high-resolution images supplied by ZN; meaningful alt text; source permission; consistent but non-destructive grading; responsive `srcset` where available; lazy-load below the fold; avoid stretching and upscaling. Balance intimate portraits, celebratory group moments, and dynamic sports imagery. Do not embed Instagram screenshots as portfolio photographs or scrape content without authorization. For placeholder states, use clearly marked blocks and descriptive labels.

## 7. Interaction, quality, accessibility
Semantic HTML, one H1, logical headings, keyboard navigation, visible focus, accessible contrast, reduced-motion support, responsive 320px+ layouts, no horizontal overflow, proper external link targets, image loading strategies, sensible SEO title/description and Open Graph only when verified. Navigation anchors and CTAs must work; no dead buttons. Animations limited to gentle opacity/translate, no excessive parallax. Avoid generic icon grids, purple gradients, fake metrics, invented testimonials, hard borders, saturated rainbow CTAs, stock photo walls, and unverified social proof.

## 8. Build protocol for VS Code/Codex
1. Read both source documents and this Skill. Inventory supplied images, logo, texts, links, consent and missing details.
2. Produce a short visual brief mapping each section to its source influence and brand adaptation.
3. Define tokens first; implement mobile-first semantic structure and responsive gallery.
4. Use genuine content; mark unknowns explicitly in code and notes.
5. Review desktop (1440px), tablet (768px), mobile (390px and 320px); inspect photo crops and menu behavior.
6. Check keyboard/focus, contrast, alt text, loading, links, and reduced motion.
7. Iterate on spacing, typographic rhythm, imagery, and CTA hierarchy before adding decoration.

## 9. Release checklist
- [ ] Both original documents were reviewed; adaptations documented.
- [ ] ZN original logo used without replacing or redrawing the monogram.
- [ ] Brand blue verified; no unapproved green/rainbow accents.
- [ ] One clear contact CTA; contact link verified and functional.
- [ ] Hero, gallery and services tell a coherent photographic story.
- [ ] All portfolio photos are authentic, approved, correctly credited if needed.
- [ ] No invented testimonials, metrics, awards, pricing or years of experience.
- [ ] Mixed image ratios feel intentional; no awkward face crops.
- [ ] Soft cards, floating nav, consistent 24/28/pill geometry.
- [ ] Typography uses coherent display/UI hierarchy; no arbitrary fonts.
- [ ] Mobile 320/390, tablet 768, desktop 1440 checked for overflow.
- [ ] All navigation and CTAs work; no dead or placeholder links in production.
- [ ] Keyboard, focus, alt text, reduced motion and contrast checked.
- [ ] Image sizes optimized; lazy loading below hero; metadata checked.
- [ ] Final visual comparison against references and supplied brand assets completed.

## 10. Unresolved details to confirm before publishing
Actual portfolio photos and rights; approved logo variant; exact blue brand color; WhatsApp number; photographer's preferred short bio; whether additional services should be shown; domain and final publication platform. A prototype may proceed with explicit TODOs, but must not be described as publication-ready until these are resolved.
