"""Create transparent variants of the generated questionnaire artwork.

The source PNGs contain a light checkerboard baked into the RGB pixels.  This
script removes only the near-white region connected to the canvas edge, so the
white sheets and their soft shadows remain intact.
"""

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


FILES = (
    "bild-01-fragebogen-leer-v2.png",
)

SINGLE_PAGE_BOUNDS = {
    "bild-01-fragebogen-leer-v2.png": (145, 46, 1107, 1190),
    "bild-02-fragebogen-erkannt-v4.png": (145, 46, 1107, 1190),
}

DETECTED_SOURCE = Path("bild-02-fragebogen-erkannt-v4.png")
BLANK_SOURCE = Path("bild-01-fragebogen-leer-v2.png")
CLEAN_DETECTED_TARGET = Path("bild-02-fragebogen-ausgefuellt-clean-alpha.png")


def remove_baked_background(source: Path) -> Path:
    image = Image.open(source).convert("RGB")
    pixels = np.asarray(image)

    if source.name in SINGLE_PAGE_BOUNDS:
        left, top, right, bottom = SINGLE_PAGE_BOUNDS[source.name]
        alpha = np.zeros(pixels.shape[:2], dtype=float)
        alpha[top:bottom, left:right] = 1
    else:
        minimum = pixels.min(axis=2)
        maximum = pixels.max(axis=2)
        near_white = (minimum >= 239) & ((maximum - minimum) <= 5)

        labels, _ = ndimage.label(near_white)
        edge_labels = np.unique(
            np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1]))
        )
        background = np.isin(labels, edge_labels[edge_labels != 0])

        # Preserve the antialiased paper/shadow edge while gently fading the
        # last two background pixels to avoid a pale fringe.
        distance = ndimage.distance_transform_edt(~background)
        alpha = np.clip(distance / 2.0, 0, 1)
        alpha[~background & (distance >= 2)] = 1

    rgba = np.dstack((pixels, np.rint(alpha * 255).astype(np.uint8)))
    target = source.with_name(f"{source.stem}-alpha.png")
    Image.fromarray(rgba).save(target, optimize=True)
    return target


def create_clean_detected_page() -> Path:
    """Remove colored recognition frames while preserving handwritten marks."""
    detected = np.asarray(Image.open(DETECTED_SOURCE).convert("RGB")).copy()
    blank = np.asarray(Image.open(BLANK_SOURCE).convert("RGB"))

    red = detected[:, :, 0]
    green = detected[:, :, 1]
    blue = detected[:, :, 2]
    maximum = detected.max(axis=2)
    minimum = detected.min(axis=2)
    bright_tint = ((maximum - minimum) > 4) & (maximum > 135)
    red_line = (red > green + 9) & (red > blue + 9)
    green_line = (green > red + 7) & (green > blue + 7)
    violet_line = (red > green + 7) & (blue > green + 7) & (maximum > 75)
    colored_overlay = bright_tint | red_line | green_line | violet_line
    detected[colored_overlay] = blank[colored_overlay]

    left, top, right, bottom = SINGLE_PAGE_BOUNDS[DETECTED_SOURCE.name]
    alpha = np.zeros(detected.shape[:2], dtype=np.uint8)
    alpha[top:bottom, left:right] = 255
    rgba = np.dstack((detected, alpha))
    Image.fromarray(rgba).save(CLEAN_DETECTED_TARGET, optimize=True)
    return CLEAN_DETECTED_TARGET


if __name__ == "__main__":
    for filename in FILES:
        result = remove_baked_background(Path(filename))
        print(result)
    print(create_clean_detected_page())
