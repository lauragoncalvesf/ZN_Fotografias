"""Generate WebP variants without changing original photographs (requires Pillow)."""
from pathlib import Path
import re
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
html_path = ROOT / 'index.html'
html = html_path.read_text()
# Also permit regenerating images after the page already uses optimized paths.
originals = sorted(p for folder in ('ZN_FOTOS', 'BRANDIG')
                   for p in (ROOT / 'assets' / folder).iterdir()
                   if p.suffix.lower() in ('.jpg', '.jpeg', '.png'))
variants = {}
for source in originals:
    relative = source.relative_to(ROOT).as_posix()
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
        widths = sorted(set(min(image.width, width) for width in (480, 960, 1600)))
        if source.name == 'logo-zn.jpeg':
            widths = [min(image.width, 160)]
        items = []
        for width in widths:
            height = round(image.height * width / image.width)
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            target = ROOT / 'assets' / 'optimized' / source.parent.name / f'{source.stem}-{width}.webp'
            target.parent.mkdir(parents=True, exist_ok=True)
            resized.save(target, 'WEBP', quality=88, method=6)
            items.append((width, target.relative_to(ROOT).as_posix()))
        variants[relative] = items

def replace_image(match):
    tag = match.group(0)
    src = re.search(r'\bsrc="([^"]+)"', tag)
    if not src or src[1] not in variants:
        return tag
    items = variants[src[1]]
    # 960px fallback remains crisp on high-density displays; srcset selects as needed.
    fallback = min(items, key=lambda item: abs(item[0] - 960))[1]
    tag = tag.replace(src.group(0), f'src="{fallback}"')
    if len(items) > 1:
        sizes = ('(max-width: 600px) 21vw, 245px' if 'loading="eager"' in tag else
                 '(max-width: 600px) calc((100vw - 42px) / 2), (max-width: 1100px) calc((100vw - 80px) / 3), 283px')
        if 'service-photo' in html[max(0, match.start() - 80):match.start()]:
            sizes = '(max-width: 600px) calc(100vw - 68px), 560px'
        if 'hero-logo' in tag:
            sizes = '(max-width: 600px) 90vw, 600px'
        srcset = ', '.join(f'{path} {width}w' for width, path in items)
        tag = tag.replace(' src=', f' srcset="{srcset}" sizes="{sizes}" src=', 1)
    return tag
html = re.sub(r'<img\b[^>]*>', replace_image, html)
# favicon uses the small optimized brand image too.
logo = variants.get('assets/BRANDIG/logo-zn.jpeg')
if logo:
    html = html.replace('type="image/jpeg" href="assets/BRANDIG/logo-zn.jpeg"',
                        f'type="image/webp" href="{logo[0][1]}"')
html_path.write_text(html)
print(f'Generated {sum(len(v) for v in variants.values())} WebP files; originals preserved.')
