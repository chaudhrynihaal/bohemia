"""
Sky masks for the opening night→day sequence (assets/dusk/f000–f053.webp).
For each frame: flood-fill the sky from the top edge, clean it up, and save
  assets/dusk-mask/fNNN.webp  — white with alpha = building/trees (sky transparent)
and assets/dusk-mask/sky.json — per-frame sky colours along the top edge (32 columns),
used to extend the sky above the frame so the BOHEMIA lettering can sit behind the roof.

    python tools/make_sky_masks.py
"""
import json, numpy as np, cv2
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SRC, OUT = ROOT / 'assets/dusk', ROOT / 'assets/dusk-mask'
OUT.mkdir(exist_ok=True)
sky_cols = []
for f in sorted(SRC.glob('f*.webp')):
    img = cv2.imread(str(f))                          # 1920x1080 BGR
    small = cv2.resize(img, (960, 540), interpolation=cv2.INTER_AREA)
    blur = cv2.bilateralFilter(small, 7, 30, 7)
    h, w = blur.shape[:2]
    mask = np.zeros((h + 2, w + 2), np.uint8)
    flags = 4 | cv2.FLOODFILL_MASK_ONLY | (255 << 8)  # neighbour-relative: follows gradients
    lab = cv2.cvtColor(blur, cv2.COLOR_BGR2LAB)
    for x in range(4, w - 4, 12):                     # seed along the top edge where it looks like sky
        if mask[1, x + 1]: continue
        L, a, b = lab[0, x].astype(int)
        cv2.floodFill(blur, mask, (x, 0), 0, (3, 3, 3), (3, 3, 3), flags)
    sky = mask[1:-1, 1:-1]
    # drop seeds that grew into the building/trees: keep regions that are mostly bright/blueish relative to the frame
    sky = cv2.morphologyEx(sky, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    sky = cv2.morphologyEx(sky, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    fg = 255 - sky
    fg = cv2.resize(fg, (1920, 1080), interpolation=cv2.INTER_LINEAR)
    fg = cv2.GaussianBlur(fg, (3, 3), 0)
    rgba = np.dstack([np.full_like(fg, 255)] * 3 + [fg])
    cv2.imwrite(str(OUT / (f.stem + '.webp')), rgba, [cv2.IMWRITE_WEBP_QUALITY, 90])
    # sky colour per column along the top band (fill gaps under roof/trees by interpolation)
    band = small[:6]; bmask = sky[:6] > 0
    cols = []
    for c in range(32):
        x0, x1 = c * w // 32, (c + 1) * w // 32
        px = band[:, x0:x1][bmask[:, x0:x1]]
        cols.append(px.mean(axis=0)[::-1].round().tolist() if len(px) else None)
    known = [i for i, v in enumerate(cols) if v]
    for i, v in enumerate(cols):
        if v is None:
            j = min(known, key=lambda k: abs(k - i)); cols[i] = cols[j]
    sky_cols.append([[int(c) for c in v] for v in cols])
    print(f.stem, f'sky {sky.mean() / 2.55:.0f}%')
json.dump(sky_cols, open(OUT / 'sky.json', 'w'))
