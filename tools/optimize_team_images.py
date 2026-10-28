"""Create high-quality responsive team photos; preserve source files. Requires Pillow."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
source_dir = ROOT / 'assets/ZN_EQUIPE'
target_dir = ROOT / 'assets/optimized/ZN_EQUIPE'
target_dir.mkdir(parents=True, exist_ok=True)
for source in sorted(source_dir.glob('*.jpeg')):
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        widths = (480, 960, 1600) if source.stem == 'equipe' else (480, 960)
        for width in sorted({min(w, image.width) for w in widths}):
            height = round(image.height * width / image.width)
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                target_dir / f'{source.stem}-{width}.webp',
                'WEBP', quality=88, method=6)
print('Team photos optimized; source files preserved.')
