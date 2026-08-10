#!/usr/bin/env python3
"""
build_cyborg_neck.py

Builds the two-part Cyborg used by the extending-neck gag in the Journey
section, plus the metadata the front-end needs to draw the neck between them.

Why this can't go through process_characters.py: that script centers each image
independently inside its own canvas, which would leave the head and body
misaligned. Here both halves are composed into a *shared* canvas at their
correct assembled rest position, so the front-end can simply stack them with
`inset-0` — at rest they look like one figure, with the wires tucked behind the
collar.

The neck gag itself is driven in CyborgNeck.jsx: the HEAD is the fixed anchor
and the BODY translates DOWNWARD with scroll, the tube stretching to fill the
growing gap. The body's travel is measured live from the section layout, so it
is NOT baked into the art here — this script only needs to emit the two halves
at their shared rest position plus the tube's attachment geometry.

Outputs (into public/characters-processed/giant/):
    cyborg-body.png / .webp / @2x   — body only, in the shared canvas
    cyborg-head.png / .webp / @2x   — head only, at rest position, same canvas
    cyborg-neck.json                — tube geometry as canvas percentages

Sources: public/characters/v3/cyborg-head.png and cyborg-body.png
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "characters" / "v3"
OUT = ROOT / "public" / "characters-processed" / "giant"

# Canvas matches the "giant" group in process_characters.py so the two systems
# stay visually consistent.
CANVAS = (800, 1067)
VARIANTS = [("", 1.0), ("@2x", 2.0)]

# How wide the head reads relative to the body's neck collar. 1.9 was picked by
# rendering 1.7 / 1.9 / 2.1 side by side — 1.7 looked pin-headed, 2.1 let the
# wire bundle poke out past the collar at rest.
HEAD_TO_COLLAR = 1.9

# How far the skull sinks into the collar at rest, in body-native px. Tuned by
# rendering the retracted pose: at 18 a band of wires still showed above the
# collar and the head read as a separate object, which is exactly what the gag
# must avoid until you scroll. 34 seats the jaw onto the collar cleanly.
REST_TUCK = 34

# Legacy: emitted as maxLiftPct for backward compatibility, but no longer gates
# the neck. In the current gag the body descends by a distance measured live from
# the timeline height (CyborgNeck.jsx), so the neck can span the whole section
# rather than a fixed fraction of the character canvas.
MAX_LIFT = 586

FILL_H = 0.80
FILL_W_MAX = 0.92
BOTTOM_MARGIN_FRAC = 0.015


def landmarks(head_a, body_a):
    """Locate the skull/wire boundary on the head and the collar on the body."""
    hcov = head_a.sum(axis=1)
    peak = hcov.max()
    # Below the skull the silhouette collapses to a thin bundle of wires.
    skull_bottom = max(y for y in range(len(hcov)) if hcov[y] > peak * 0.55)
    xs = np.where(head_a[skull_bottom // 2])[0]
    head_cx = (xs.min() + xs.max()) / 2
    srow = np.where(head_a[int(skull_bottom * 0.5)])[0]
    skull_w = srow.max() - srow.min()

    bcov = body_a.sum(axis=1)
    collar_top = min(y for y in range(len(bcov)) if bcov[y] > 0)
    cxs = np.where(body_a[collar_top + 6])[0]
    collar_w = cxs.max() - cxs.min()
    collar_cx = (cxs.min() + cxs.max()) / 2
    return skull_bottom, head_cx, skull_w, collar_top, collar_w, collar_cx


def main():
    head = Image.open(SRC / "cyborg-head.png").convert("RGBA")
    body = Image.open(SRC / "cyborg-body.png").convert("RGBA")
    head_a = np.array(head)[:, :, 3] > 60
    body_a = np.array(body)[:, :, 3] > 60

    skull_bottom, head_cx, skull_w, collar_top, collar_w, collar_cx = landmarks(head_a, body_a)

    # Scale the head so it reads correctly against the collar.
    hs = (collar_w * HEAD_TO_COLLAR) / skull_w
    hw, hh = round(head.width * hs), round(head.height * hs)
    head_s = head.resize((hw, hh), Image.LANCZOS)
    skull_bottom_s = skull_bottom * hs
    head_cx_s = head_cx * hs

    # Rest position, in body-native coordinates (head origin is negative — it
    # sits above the body's own origin).
    rest_head_y = (collar_top + REST_TUCK) - skull_bottom_s
    head_x = collar_cx - head_cx_s

    # Assembled bounding box at rest.
    top = min(0.0, rest_head_y)
    left = min(0.0, head_x)
    right = max(float(body.width), head_x + hw)
    asm_w = right - left
    asm_h = body.height - top

    for suffix, mult in VARIANTS:
        cw, ch = round(CANVAS[0] * mult), round(CANVAS[1] * mult)
        scale = min((FILL_H * ch) / asm_h, (FILL_W_MAX * cw) / asm_w)

        draw_w, draw_h = asm_w * scale, asm_h * scale
        ox = (cw - draw_w) / 2 - left * scale
        oy = ch - round(ch * BOTTOM_MARGIN_FRAC) - body.height * scale

        # body layer
        b_canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        b_s = body.resize((max(1, round(body.width * scale)), max(1, round(body.height * scale))), Image.LANCZOS)
        b_canvas.paste(b_s, (round(ox), round(oy)), b_s)

        # head layer, same canvas, at rest
        h_canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        h_s = head.resize((max(1, round(hw * scale)), max(1, round(hh * scale))), Image.LANCZOS)
        h_canvas.paste(h_s, (round(ox + head_x * scale), round(oy + rest_head_y * scale)), h_s)

        for name, img in (("cyborg-body", b_canvas), ("cyborg-head", h_canvas)):
            OUT.mkdir(parents=True, exist_ok=True)
            img.save(OUT / f"{name}{suffix}.png", "PNG")
            img.save(OUT / f"{name}{suffix}.webp", "WEBP", lossless=True, method=6)

        if suffix == "":
            meta = {
                "canvas": [cw, ch],
                # Tube is a bit narrower than the collar so it reads as sliding out of it.
                "tubeCenterXPct": round((ox + collar_cx * scale) / cw, 5),
                "tubeWidthPct": round((collar_w * 0.66 * scale) / cw, 5),
                # Tube disappears into the collar here.
                "tubeBottomYPct": round((oy + (collar_top + 12) * scale) / ch, 5),
                # Top of the tube when fully retracted (== underside of the skull).
                "tubeTopRestYPct": round((oy + (rest_head_y + skull_bottom_s) * scale) / ch, 5),
                # Legacy: fraction of canvas height, no longer read by the
                # front-end (body travel is measured from the live layout).
                "maxLiftPct": round((MAX_LIFT * scale) / ch, 5),
            }
            with open(OUT / "cyborg-neck.json", "w") as f:
                json.dump(meta, f, indent=2)
            print(json.dumps(meta, indent=2))

    print(f"\nhead scale={hs:.3f}  assembled={asm_w:.0f}x{asm_h:.0f}  -> canvas {CANVAS}")
    print(f"Wrote cyborg-head/body (1x, @2x, png+webp) + cyborg-neck.json to {OUT}")


if __name__ == "__main__":
    main()
