"""Create reproducible website screenshots from the real desktop applications."""

from __future__ import annotations

import importlib.util
import sys
import time
from pathlib import Path

import fitz
from PIL import ImageGrab


HERE = Path(__file__).resolve().parent
APPS = HERE.parents[3]
SOURCE_IMAGE = HERE / "bild-01-fragebogen-leer-v2-alpha.png"
DEMO_PDF = HERE / "Fragebogen_Beispiel.pdf"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Modul konnte nicht geladen werden: {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


def create_demo_pdf() -> None:
    document = fitz.open()
    page = document.new_page(width=720, height=720)
    page.insert_image(page.rect, filename=str(SOURCE_IMAGE), keep_proportion=True)
    document.save(DEMO_PDF)
    document.close()


def settle(root, seconds: float = 1.5) -> None:
    root.deiconify()
    root.attributes("-topmost", True)
    root.lift()
    root.focus_force()
    end = time.monotonic() + seconds
    while time.monotonic() < end:
        root.update()
        time.sleep(0.03)


def capture_window(root, destination: Path) -> None:
    root.update_idletasks()
    root.update()
    x = root.winfo_rootx()
    y = root.winfo_rooty()
    width = root.winfo_width()
    height = root.winfo_height()
    image = ImageGrab.grab(
        bbox=(x, y, x + width, y + height),
        all_screens=True,
    )
    image.save(destination, optimize=True)


def capture_corner_app() -> None:
    module = load_module(
        "website_corner_app",
        APPS / "02_Eckensetzer" / "app" / "app.py",
    )
    module.DND_AVAILABLE = False
    root = module.tk.Tk()
    app = module.CornerApp(root)
    root.state("normal")
    root.geometry("1500x920+20+20")
    settle(root, 0.6)
    app.load_pdf_from_path(DEMO_PDF)
    settle(root, 1.8)
    capture_window(root, HERE / "eckensetzer-app-real.png")
    root.destroy()


def capture_pdf_toolkit() -> None:
    module = load_module(
        "website_pdf_toolkit",
        APPS / "03_PDFs aufteilen" / "pdf_splitter_modern.py",
    )
    app = module.ModernPDFApp()
    app.root.state("normal")
    app.root.geometry("1500x920+20+20")
    app.pdf_files = [str(DEMO_PDF)]
    app.selected_files_var.set(app._format_selected_files())
    app._update_preview_selector()
    app._update_summary()
    settle(app.root, 0.8)
    if app._preview_resize_job is not None:
        app.root.after_cancel(app._preview_resize_job)
        app._preview_resize_job = None
    app._render_image_preview = lambda _path: None
    app.preview_render_token += 1
    app._clear_preview_canvas()
    document = fitz.open(DEMO_PDF)
    pixmap = document.load_page(0).get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False)
    app._add_preview_image_from_bytes(
        app.preview_render_token,
        0,
        pixmap.tobytes("png"),
    )
    document.close()
    app.preview_total_pages = 1
    app._log("Vorschau geladen: Fragebogen_Beispiel.pdf (1 Seite)")
    settle(app.root, 1.5)
    capture_window(app.root, HERE / "pdf-toolkit-app-real.png")
    app.root.destroy()


def main() -> None:
    create_demo_pdf()
    try:
        capture_pdf_toolkit()
        capture_corner_app()
    finally:
        DEMO_PDF.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
