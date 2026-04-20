from PIL import Image
import os

BUTTONS = [
    "assets/images/playhub.png",
    "assets/images/traininghub.png",
    "assets/images/performancehub.png",
    "assets/images/practicehub.png",
]

THRESHOLD = 35

for path in BUTTONS:
    img = Image.open(path).convert("RGBA")
    pixels = img.load()
    w, h = img.size
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r < THRESHOLD and g < THRESHOLD and b < THRESHOLD:
                pixels[x, y] = (0, 0, 0, 0)
                changed += 1
    img.save(path)
    print(f"✅ {os.path.basename(path)}: {changed:,} black pixels → transparent")

print("\nDone! Verify with: file assets/images/playhub.png")
