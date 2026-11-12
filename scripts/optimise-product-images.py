"""Preserve subject framing; optional reviewed crop uses normalized coordinates."""
import json
import sys
from pathlib import Path
from PIL import Image, ImageOps

source, destination, crop_json = sys.argv[1:]
with Image.open(source) as opened:
    image = ImageOps.exif_transpose(opened).convert('RGB')
    original_size = image.size
    crop = json.loads(crop_json)
    if crop:
        image = image.crop(tuple(round(value * image.size[index % 2]) for index, value in enumerate(crop)))
    output = {}
    for name, edge, quality in [('image', 1400, 84), ('thumbnail', 384, 82)]:
        variant = image.copy()
        variant.thumbnail((edge, edge), Image.Resampling.LANCZOS)
        filename = Path(destination + '-' + name + '.webp')
        variant.save(filename, 'WEBP', quality=quality, method=6)
        output[name] = {'file': str(filename), 'width': variant.width, 'height': variant.height, 'bytes': filename.stat().st_size}
    print(json.dumps({'originalWidth': original_size[0], 'originalHeight': original_size[1], **output}))
