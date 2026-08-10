#!/usr/bin/env python3
"""
process_characters.py

Normalizes framing/sizing of the Teen Titans character PNGs in
public/characters so the same character reads at a consistent scale
across every usage group on the site (giant decorative, footer lineup,
project-card badge, boot-loader icon).

For each image, per group:
  1. Auto-trims dead transparent space around the subject (alpha-based bbox).
  2. Rescales the trimmed subject so it fills a consistent target
     proportion of the target canvas (fill ratio), capped at MAX_UPSCALE
     to avoid blowing up low-res source art.
  3. Centers the subject horizontally and bottom-anchors it vertically
     (characters sit in bottom-aligned flex containers in the site CSS,
     so padding must go on top, not bottom, or they'll look like they're
     floating).
  4. Exports PNG at 1x (and 2x where configured).

Never touches the originals in public/characters — everything is written
to OUT_DIR. Anything auto-trim can't handle confidently is flagged in the
printed report and in report.json, not guessed at.

Usage:
    python3 scripts/process_characters.py            # full batch
    python3 scripts/process_characters.py --sample    # 3 sample images only
    python3 scripts/process_characters.py --files robin.png cyborg.png
"""

import argparse
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "public" / "characters"
OUT_DIR = ROOT / "public" / "characters-processed"

# Higher-res replacement sources. Each is a full replacement generation for
# some subset of characters; originals in SRC_DIR are left untouched. Priority:
# v3 (dedicated single-pose, white-bg Gemini generations) > v2 (poses extracted
# from the original six reference sheets) > SRC_DIR (original tiny crops).
V3_DIR = SRC_DIR / "v3"
V2_DIR = SRC_DIR / "v2"


def resolve_source(fname: str) -> Path:
    for d in (V3_DIR, V2_DIR):
        p = d / fname
        if p.exists():
            return p
    return SRC_DIR / fname

# Alpha values at/below this are treated as "not part of the subject" when
# computing the trim bbox. Filters out faint anti-aliasing fringe noise.
ALPHA_THRESHOLD = 10

# Small crop padding (px, in source-image space) kept around the trimmed
# bbox so we don't shave off anti-aliased edge pixels.
TRIM_PAD = 2

# Never scale a source image up by more than this factor. If hitting the
# group's target fill ratio would require more, we cap the scale and flag
# it instead of guessing / silently shipping a soft, over-upscaled image.
MAX_UPSCALE = 4.0

# Minimum plausible trimmed-subject dimension (px). Below this, auto-trim
# is almost certainly wrong (e.g. a near-blank image) and we flag + skip.
MIN_TRIMMED_DIM = 20

# Bottom margin as a fraction of canvas height, so the subject's feet sit
# just off the very edge rather than exactly touching it.
BOTTOM_MARGIN_FRAC = 0.015

# ---------------------------------------------------------------------------
# Group definitions (see the size/ratio proposal approved for this project).
# canvas: (w, h) in px. variants: list of ("suffix", scale_multiplier) pairs
# applied on top of the base canvas size, e.g. 2x doubles both canvas and
# target pixel dimensions.
# ---------------------------------------------------------------------------
GROUPS = {
    "giant": {
        # Hero, Powers, About, Experience, Personality, Shift, Hire —
        # big decorative full-body characters anchored to a section edge.
        "files": [
            "robin.png",
            "robin-serious.png",
            "cyborg.png",
            "starfire.png",
            "beastboy.png",
            "raven.png",
            # Beast Boy's shape-shift forms (Skills section morph). Optional —
            # skipped with a flag if the art isn't present yet.
            "beastboy-cat.png",
            "beastboy-gorilla.png",
            "beastboy-lion.png",
            # NOTE: cyborg-head/-body are deliberately NOT here. They must be
            # composed into a shared canvas so the two halves line up — see
            # scripts/build_cyborg_neck.py.
        ],
        "canvas": (800, 1067),  # ~3:4. Was capped to 1x-only because the old
                                 # sources (esp. robin, beastboy) couldn't
                                 # support 2x without exceeding MAX_UPSCALE.
                                 # The v3 dedicated single-pose sources are
                                 # high-res enough that 2x now fits comfortably
                                 # (max ~3.83x needed, vs a 4x ceiling).
        "variants": [("", 1.0), ("@2x", 2.0)],
        "fill_h": 0.90,
        "fill_w_max": 0.92,
    },
    "footer": {
        # FooterOutro.jsx sign-off lineup.
        "files": ["robin.png", "beastboy.png", "cyborg.png", "starfire.png", "raven.png"],
        "canvas": (480, 640),  # exact 3:4
        "variants": [("", 1.0), ("@2x", 2.0)],
        "fill_h": 0.88,
        "fill_w_max": 0.90,
    },
    "badge": {
        # Projects.jsx corner mascot badge.
        "files": ["robin.png", "beastboy.png", "cyborg.png", "starfire.png", "raven.png"],
        "canvas": (315, 420),  # exact 3:4
        "variants": [("", 1.0), ("@2x", 2.0)],
        "fill_h": 0.95,
        "fill_w_max": 0.95,
    },
    "boot": {
        # App.jsx boot-loader icon (the one non-auto-width usage; fixed
        # w-32 h-40 box, so canvas AR matches the box exactly: 4:5).
        "files": ["robin.png"],
        "canvas": (320, 400),
        "variants": [("", 1.0), ("@2x", 2.0)],  # 2x included since it's cheap;
                                                  # flagged as a judgment call.
        "fill_h": 0.85,
        "fill_w_max": 0.85,
    },
}

report = []  # list of dicts, one per (group, file, variant)
flags = []   # list of human-readable warnings


def log_flag(msg):
    flags.append(msg)
    print(f"  FLAG: {msg}")


def trim_bbox(im):
    """Return a padded bbox around the non-transparent subject, or None."""
    if im.mode != "RGBA":
        return None, "not RGBA (no alpha channel) — cannot auto-trim by transparency"

    alpha = im.split()[-1]
    mask = alpha.point(lambda p: 255 if p > ALPHA_THRESHOLD else 0)
    bbox = mask.getbbox()
    if bbox is None:
        return None, "fully transparent — no visible subject found"

    l, t, r, b = bbox
    w, h = im.size

    # Flag (don't fail) if the bbox touches the source edges — could mean
    # the subject is already clipped in the original art and auto-trim
    # can't recover missing pixels.
    if l <= 0 or t <= 0 or r >= w - 1 or b >= h - 1:
        return (l, t, r, b), "EDGE_TOUCH"

    # Pad back out a couple px, clamped to image bounds.
    l = max(0, l - TRIM_PAD)
    t = max(0, t - TRIM_PAD)
    r = min(w, r + TRIM_PAD)
    b = min(h, b + TRIM_PAD)
    return (l, t, r, b), None


def process_one(path: Path, group_name: str, group: dict):
    im = Image.open(path).convert("RGBA")
    bbox, note = trim_bbox(im)

    if bbox is None:
        log_flag(f"[{group_name}/{path.name}] auto-trim failed: {note} — skipped, no output written")
        return

    edge_touch = note == "EDGE_TOUCH"
    if edge_touch:
        log_flag(f"[{group_name}/{path.name}] trimmed bbox touches source edge — "
                  f"subject may already be clipped in the original art; verify visually")

    trimmed = im.crop(bbox)
    tw, th = trimmed.size

    if tw < MIN_TRIMMED_DIM or th < MIN_TRIMMED_DIM:
        log_flag(f"[{group_name}/{path.name}] trimmed subject implausibly small "
                  f"({tw}x{th}px) — skipped, check source file")
        return

    base_w, base_h = group["canvas"]
    fill_h = group["fill_h"]
    fill_w_max = group["fill_w_max"]

    out_group_dir = OUT_DIR / group_name
    out_group_dir.mkdir(parents=True, exist_ok=True)

    stem = path.stem  # e.g. "robin"

    # Composition is decided ONCE, against the 1x canvas, then simply multiplied
    # for @2x. Fitting each variant independently would let @2x hit the upscale
    # cap while 1x didn't, so the subject would fill less of the frame at 2x and
    # retina users would see a visibly *smaller* character than everyone else.
    base_scale = min((fill_h * base_h) / th, (fill_w_max * base_w) / tw)
    capped = base_scale > MAX_UPSCALE
    base_scale = min(base_scale, MAX_UPSCALE)

    for suffix, mult in group["variants"]:
        canvas_w = round(base_w * mult)
        canvas_h = round(base_h * mult)

        scale = base_scale * mult

        new_w = max(1, round(tw * scale))
        new_h = max(1, round(th * scale))

        resized = trimmed.resize((new_w, new_h), Image.LANCZOS)

        canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
        x = (canvas_w - new_w) // 2
        bottom_margin_px = round(canvas_h * BOTTOM_MARGIN_FRAC)
        y = canvas_h - new_h - bottom_margin_px
        canvas.paste(resized, (x, y), resized)

        out_name = f"{stem}{suffix}.png"
        out_path = out_group_dir / out_name
        canvas.save(out_path, "PNG")

        webp_path = out_group_dir / f"{stem}{suffix}.webp"
        canvas.save(webp_path, "WEBP", lossless=True, method=6)

        actual_fill_h = new_h / canvas_h
        actual_fill_w = new_w / canvas_w

        entry = {
            "group": group_name,
            "source": path.name,
            "variant": suffix or "1x",
            "trimmed_px": [tw, th],
            "canvas_px": [canvas_w, canvas_h],
            "scale": round(scale, 3),
            "capped_at_max_upscale": capped,
            "output_webp": str(webp_path.relative_to(ROOT)),
            "actual_fill_h": round(actual_fill_h, 3),
            "actual_fill_w": round(actual_fill_w, 3),
            "output": str(out_path.relative_to(ROOT)),
            "edge_touch": edge_touch,
        }
        report.append(entry)

        print(f"  [{group_name}/{stem}{suffix}] trimmed {tw}x{th} -> scale {scale:.2f}x -> "
              f"{new_w}x{new_h} on {canvas_w}x{canvas_h} canvas "
              f"(fill h={actual_fill_h:.0%} w={actual_fill_w:.0%})"
              + ("  [CAPPED @ MAX_UPSCALE]" if capped else ""))

        if capped and suffix == "":
            log_flag(
                f"[{group_name}/{path.name}] hit the {MAX_UPSCALE:.0f}x upscale ceiling — "
                f"fills only {actual_fill_h:.0%} of frame height instead of {fill_h:.0%} "
                f"(will look smaller/more padded than the rest of its group). "
                f"Source is {tw}x{th}px trimmed; needs ~{round(fill_h * base_h / MAX_UPSCALE)}px "
                f"tall at minimum to hit target."
            )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample", action="store_true", help="Process only 3 sample images")
    parser.add_argument("--files", nargs="*", help="Process only these source filenames")
    args = parser.parse_args()

    if args.sample:
        wanted = {"robin.png", "cyborg.png", "beastboy.png"}
    elif args.files:
        wanted = set(args.files)
    else:
        wanted = None  # everything

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    for group_name, group in GROUPS.items():
        for fname in group["files"]:
            if wanted is not None and fname not in wanted:
                continue
            src_path = resolve_source(fname)
            if not src_path.exists():
                log_flag(f"[{group_name}/{fname}] source file not found in {SRC_DIR}, {V2_DIR}, or {V3_DIR} — skipped")
                continue
            tag = "v3" if src_path.parent == V3_DIR else ("v2" if src_path.parent == V2_DIR else "orig")
            print(f"Processing {group_name}/{fname} [{tag}] ...")
            process_one(src_path, group_name, group)

    report_path = OUT_DIR / "report.json"
    with open(report_path, "w") as f:
        json.dump({"entries": report, "flags": flags}, f, indent=2)

    print(f"\nWrote {len(report)} image(s) to {OUT_DIR}")
    print(f"Report: {report_path}")
    if flags:
        print(f"\n{len(flags)} flag(s) raised — review before trusting group consistency:")
        for fl in flags:
            print(f"  - {fl}")
    else:
        print("No flags raised.")


if __name__ == "__main__":
    main()
