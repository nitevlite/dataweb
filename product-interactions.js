(() => {
  const hero = document.querySelector(".product-hero");
  const carouselLinks = [...document.querySelectorAll(".product-carousel-arrow")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const productHeader = document.querySelector(".product-header");
  const productNav = document.querySelector(".product-nav");
  const productMenuToggle = document.querySelector(".product-menu-toggle");
  const closeProductMenu = () => {
    productHeader?.classList.remove("menu-open");
    productMenuToggle?.setAttribute("aria-expanded", "false");
  };
  productMenuToggle?.addEventListener("click", () => {
    const open = productHeader.classList.toggle("menu-open");
    productMenuToggle.setAttribute("aria-expanded", String(open));
  });
  productNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeProductMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProductMenu();
  });

  const revealHeadings = [...document.querySelectorAll("[data-product-scroll-reveal]")];
  revealHeadings.forEach((heading) => {
    const revealText = heading.textContent.trim();
    heading.setAttribute("aria-label", revealText);
    heading.innerHTML = revealText
      .split(/\s+/)
      .map(
        (word) =>
          `<span class="reveal-word" aria-hidden="true">${Array.from(word)
            .map((character) => `<span class="reveal-character">${character}</span>`)
            .join("")}</span>`,
      )
      .join(" ");
  });

  const updateRevealHeadings = () => {
    revealHeadings.forEach((heading) => {
      const characters = [...heading.querySelectorAll(".reveal-character")];
      const rect = heading.getBoundingClientRect();
      const progress = reduceMotion.matches
        ? 1
        : Math.max(
            0,
            Math.min(
              1,
              (window.innerHeight * 0.82 - rect.top) /
                (window.innerHeight * 0.34),
            ),
          );
      const activeCount = Math.round(progress * characters.length);
      characters.forEach((character, index) =>
        character.classList.toggle("active", index < activeCount),
      );
    });
  };
  if (revealHeadings.length) {
    window.addEventListener("scroll", updateRevealHeadings, { passive: true });
    window.addEventListener("resize", updateRevealHeadings);
    reduceMotion.addEventListener?.("change", updateRevealHeadings);
    updateRevealHeadings();
  }

  try {
    const incomingDirection = sessionStorage.getItem("productCarouselDirection");
    sessionStorage.removeItem("productCarouselDirection");
    if (hero && incomingDirection && !reduceMotion.matches) {
      hero.classList.add(`carousel-enter-${incomingDirection}`);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => hero.classList.add("carousel-enter-active")),
      );
    }
  } catch {
    // The carousel still works as a normal link when storage is unavailable.
  }

  const navigateProduct = (link, direction) => {
    if (!link) return;
    if (!reduceMotion.matches) {
      try {
        sessionStorage.setItem("productCarouselDirection", direction);
      } catch {
        // Navigation and the outgoing animation remain available.
      }
      hero?.classList.add(`carousel-leave-${direction}`);
    }
    window.setTimeout(() => {
      window.location.href = link.href;
    }, hero && !reduceMotion.matches ? 340 : 0);
  };

  carouselLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const direction = link.classList.contains("product-carousel-arrow--next") ? "next" : "prev";
      navigateProduct(link, direction);
    });
  });

  if (hero && carouselLinks.length === 2) {
    const products = [
      { path: "datatool.html", label: "DataTool" },
      { path: "pdf-toolkit.html", label: "PDF Toolkit" },
      { path: "eckensetzer.html", label: "Eckensetzer" },
    ];
    const currentPath = window.location.pathname.split("/").pop();
    const currentIndex = Math.max(0, products.findIndex((product) => product.path === currentPath));
    let hintSeen = false;
    try {
      hintSeen = localStorage.getItem("productSwipeHintSeen") === "1";
    } catch {
      // The hint may appear again if local storage is unavailable.
    }

    const swipeNavigation = document.createElement("div");
    swipeNavigation.className = "product-swipe-navigation";
    swipeNavigation.setAttribute("aria-label", "Position in den enthaltenen Anwendungen");
    swipeNavigation.innerHTML = `
      ${hintSeen ? "" : '<p class="product-swipe-hint"><i aria-hidden="true">← ↔ →</i><span>Nach links oder rechts wischen</span></p>'}
      <div class="product-swipe-position" aria-live="polite">
        ${products.map((product, index) => `<span class="${index === currentIndex ? "active" : ""}" aria-hidden="true"></span>`).join("")}
        <strong>${products[currentIndex].label}</strong>
      </div>
    `;
    const productCopy = hero.querySelector(".product-copy");
    if (productCopy) {
      productCopy.after(swipeNavigation);
    } else {
      hero.append(swipeNavigation);
    }

    let touchStart = null;
    const blockedSwipeTarget = (target) => target instanceof Element && Boolean(
      target.closest(".product-visual, a, button, input, select, textarea, [role='button']"),
    );
    hero.addEventListener("touchstart", (event) => {
      if (event.touches.length !== 1 || blockedSwipeTarget(event.target)) {
        touchStart = null;
        return;
      }
      const touch = event.touches[0];
      touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    hero.addEventListener("touchend", (event) => {
      if (!touchStart || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStart.x;
      const dy = touch.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < 64 || Math.abs(dx) < Math.abs(dy) * 1.35) return;

      try {
        localStorage.setItem("productSwipeHintSeen", "1");
      } catch {
        // Swipe navigation works without persistent hint state.
      }
      const hint = swipeNavigation.querySelector(".product-swipe-hint");
      hint?.classList.add("is-dismissed");
      const direction = dx < 0 ? "next" : "prev";
      const link = carouselLinks.find((item) => item.classList.contains(`product-carousel-arrow--${direction}`));
      navigateProduct(link, direction);
    }, { passive: true });
  }

  document.querySelectorAll("[data-corner-game]").forEach((game) => {
    const tray = game.querySelector("[data-marker-tray]");
    const markers = [...game.querySelectorAll("[data-corner-marker]")];
    const zones = [...game.querySelectorAll("[data-corner-dropzone]")];
    const progress = game.querySelector("[data-corner-progress]");
    const status = game.querySelector("[data-corner-status]");
    const reset = game.querySelector("[data-corner-reset]");
    let selectedMarker = null;

    const update = () => {
      const placed = zones.filter((zone) => zone.dataset.filled === "true").length;
      if (progress) progress.textContent = `${placed} / ${zones.length}`;
      if (!status) return;

      status.classList.toggle("complete", placed === zones.length);
      status.textContent =
        placed === zones.length
          ? ""
          : selectedMarker
            ? "Markierung gewählt – ziehen oder eine freie Ecke antippen."
            : "Markierungen vor dem Drucken an allen vier Ecken platzieren.";
    };

    const selectMarker = (marker) => {
      markers.forEach((item) => item.classList.toggle("selected", item === marker));
      selectedMarker = marker;
      update();
    };

    const placeMarker = (marker, zone) => {
      if (!marker || !zone || zone.dataset.filled === "true") return;

      const previousZone = marker.closest("[data-corner-dropzone]");
      if (previousZone) {
        previousZone.dataset.filled = "false";
        previousZone.classList.remove("filled");
      }

      zone.append(marker);
      zone.dataset.filled = "true";
      zone.classList.add("filled");
      zone.classList.remove("drag-over");
      marker.classList.remove("selected");
      selectedMarker = null;
      update();
    };

    markers.forEach((marker) => {
      marker.addEventListener("click", () => {
        if (marker.dataset.justDragged === "true") return;
        selectMarker(selectedMarker === marker ? null : marker);
      });

      marker.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        const startX = event.clientX;
        const startY = event.clientY;
        let moved = false;
        let ghost = null;

        marker.setPointerCapture(event.pointerId);

        const moveGhost = (moveEvent) => {
          const distance = Math.hypot(
            moveEvent.clientX - startX,
            moveEvent.clientY - startY,
          );
          if (!moved && distance < 5) return;

          if (!ghost) {
            moved = true;
            marker.classList.add("is-dragging");
            ghost = marker.cloneNode(true);
            ghost.removeAttribute("data-corner-marker");
            ghost.classList.add("corner-drag-marker-ghost");
            document.body.append(ghost);
          }

          ghost.style.left = `${moveEvent.clientX}px`;
          ghost.style.top = `${moveEvent.clientY}px`;
          zones.forEach((zone) => {
            const rect = zone.getBoundingClientRect();
            const inside =
              moveEvent.clientX >= rect.left &&
              moveEvent.clientX <= rect.right &&
              moveEvent.clientY >= rect.top &&
              moveEvent.clientY <= rect.bottom;
            zone.classList.toggle(
              "drag-over",
              inside && zone.dataset.filled !== "true",
            );
          });
        };

        const finishDrag = (upEvent) => {
          marker.removeEventListener("pointermove", moveGhost);
          marker.removeEventListener("pointerup", finishDrag);
          marker.removeEventListener("pointercancel", cancelDrag);
          marker.releasePointerCapture?.(event.pointerId);

          if (moved) {
            marker.dataset.justDragged = "true";
            const target = document
              .elementFromPoint(upEvent.clientX, upEvent.clientY)
              ?.closest("[data-corner-dropzone]");
            if (target) placeMarker(marker, target);
            window.setTimeout(() => delete marker.dataset.justDragged, 0);
          }

          ghost?.remove();
          marker.classList.remove("is-dragging");
          zones.forEach((zone) => zone.classList.remove("drag-over"));
        };

        const cancelDrag = () => {
          marker.removeEventListener("pointermove", moveGhost);
          marker.removeEventListener("pointerup", finishDrag);
          marker.removeEventListener("pointercancel", cancelDrag);
          ghost?.remove();
          marker.classList.remove("is-dragging");
          zones.forEach((zone) => zone.classList.remove("drag-over"));
        };

        marker.addEventListener("pointermove", moveGhost);
        marker.addEventListener("pointerup", finishDrag);
        marker.addEventListener("pointercancel", cancelDrag);
      });
    });

    zones.forEach((zone) => {
      zone.dataset.filled = "false";
      zone.addEventListener("click", () => placeMarker(selectedMarker, zone));
      zone.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          placeMarker(selectedMarker, zone);
        }
      });
    });

    reset?.addEventListener("click", () => {
      markers.forEach((marker) => {
        marker.classList.remove("selected", "is-dragging");
        tray?.append(marker);
      });
      zones.forEach((zone) => {
        zone.dataset.filled = "false";
        zone.classList.remove("filled", "drag-over");
      });
      selectedMarker = null;
      update();
    });

    update();
  });

  document.querySelectorAll("[data-questionnaire-demo]").forEach((demo) => {
    const rows = [...demo.querySelectorAll("[data-answer-row]")];
    const overlays = [...demo.querySelectorAll("[data-answer-overlay]")];
    const supportOverlays = [...demo.querySelectorAll("[data-support-overlay]")];
    const colorInfoButtons = [...demo.querySelectorAll("[data-color-info]")];
    const reset = demo.querySelector("[data-questionnaire-reset]");
    const hero = demo.closest("[data-datatool-hero]");
    const focusOpen = hero?.querySelector("[data-demo-focus-open]");
    const focusClose = demo.querySelector("[data-demo-focus-close]");
    const nextDemoLink = document.querySelector("[data-next-demo-link]");
    const templateDemo = document.querySelector("#template-erstellen");
    const tutorial = demo.querySelector("[data-demo-tutorial]");
    const tutorialCard = tutorial?.querySelector(".demo-tutorial-card");
    const tutorialOpenButtons = [...demo.querySelectorAll("[data-tutorial-open]")];
    const tutorialCloseButtons = [...demo.querySelectorAll("[data-tutorial-close]")];
    const clickState = new WeakMap();
    let tutorialReturnFocus = null;

    const openTutorial = (trigger = null) => {
      if (!tutorial) return;
      tutorialReturnFocus = trigger;
      tutorial.classList.add("is-open");
      tutorial.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() =>
        tutorialCard
          ?.querySelector("[data-tutorial-close]")
          ?.focus({ preventScroll: true }),
      );
    };

    const closeTutorial = () => {
      if (!tutorial) return;
      tutorial.classList.remove("is-open");
      tutorial.setAttribute("aria-hidden", "true");
      tutorialReturnFocus?.focus({ preventScroll: true });
      tutorialReturnFocus = null;
    };

    const setFocusMode = (active, { showTutorial = false } = {}) => {
      if (!hero) return;
      hero.classList.toggle("demo-focus-active", active);
      focusOpen?.setAttribute("aria-expanded", String(active));
      focusClose?.toggleAttribute("hidden", !active);

      if (active) {
        if (showTutorial) openTutorial(focusOpen);
      } else {
        closeTutorial();
        focusOpen?.focus({ preventScroll: true });
      }
    };

    focusOpen?.addEventListener("click", () =>
      setFocusMode(true, { showTutorial: true }),
    );
    focusClose?.addEventListener("click", () => setFocusMode(false));
    nextDemoLink?.addEventListener("click", (event) => {
      event.preventDefault();
      setFocusMode(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          templateDemo?.scrollIntoView({ behavior: "smooth", block: "start" }),
        ),
      );
    });
    tutorialOpenButtons.forEach((button) =>
      button.addEventListener("click", () => openTutorial(button)),
    );
    tutorialCloseButtons.forEach((button) =>
      button.addEventListener("click", closeTutorial),
    );
    tutorial?.addEventListener("click", (event) => {
      if (event.target === tutorial) closeTutorial();
    });

    const closeColorInfo = (except = null) => {
      colorInfoButtons.forEach((button) => {
        if (button === except) return;
        button.classList.remove("is-open");
        button.setAttribute("aria-expanded", "false");
      });
    };

    colorInfoButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const open = !button.classList.contains("is-open");
        closeColorInfo(button);
        button.classList.toggle("is-open", open);
        button.setAttribute("aria-expanded", String(open));
      });
    });

    document.addEventListener("click", () => closeColorInfo());
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeColorInfo();
      if (tutorial?.classList.contains("is-open")) {
        closeTutorial();
      } else if (hero?.classList.contains("demo-focus-active")) {
        setFocusMode(false);
      }
    });

    overlays.forEach((overlay) => {
      overlay.addEventListener("click", () => {
        const row = overlay.closest("[data-answer-row]");
        const now = Date.now();
        const state = clickState.get(overlay) ?? { count: 0, lastClick: 0 };
        state.count = now - state.lastClick <= 800 ? state.count + 1 : 1;
        state.lastClick = now;
        if (state.count === 1) {
          state.startedAllMarked = row?.classList.contains("all-marked") ?? false;
        }
        clickState.set(overlay, state);

        if (state.count === 3) {
          const clearAll = state.startedAllMarked;
          row?.classList.toggle("all-marked", !clearAll);
          row?.classList.toggle("all-cleared", clearAll);
          row?.classList.remove("has-correction");
          row
            ?.querySelectorAll("[data-answer-overlay]")
            .forEach((item) => item.classList.remove("confirmed"));
          state.count = 0;
          return;
        }

        row?.classList.remove("all-marked", "all-cleared");
        row?.classList.add("has-correction");
        row
          ?.querySelectorAll("[data-answer-overlay]")
          .forEach((item) => item.classList.toggle("confirmed", item === overlay));
      });
    });

    supportOverlays.forEach((overlay) => {
      overlay.addEventListener("click", () => {
        const now = Date.now();
        const state = clickState.get(overlay) ?? { count: 0, lastClick: 0 };
        state.count = now - state.lastClick <= 800 ? state.count + 1 : 1;
        state.lastClick = now;
        clickState.set(overlay, state);

        if (state.count === 3) {
          overlay.classList.remove("confirmed");
          overlay.classList.add("cleared");
          state.count = 0;
          return;
        }

        overlay.classList.remove("cleared");
        overlay.classList.toggle("confirmed");
      });
    });

    reset?.addEventListener("click", () => {
      rows.forEach((row) => {
        row.classList.toggle("all-marked", row.hasAttribute("data-initial-multiple"));
        row.classList.remove("has-correction", "all-cleared");
      });
      overlays.forEach((overlay) => {
        overlay.classList.remove("confirmed");
        clickState.delete(overlay);
      });
      supportOverlays.forEach((overlay) =>
        overlay.classList.remove("confirmed", "cleared"),
      );
      supportOverlays.forEach((overlay) => clickState.delete(overlay));
    });

    const demoRequested =
      new URLSearchParams(window.location.search).get("demo") === "1";
    if (demoRequested) {
      requestAnimationFrame(() =>
        setFocusMode(true, { showTutorial: true }),
      );
    }
  });

  document.querySelectorAll("[data-template-lab]").forEach((lab) => {
    const canvas = lab.querySelector("[data-template-canvas]");
    const surface = lab.querySelector("[data-template-draw-surface]");
    const selection = lab.querySelector("[data-template-selection]");
    const target = lab.querySelector(".template-target");
    const grid = lab.querySelector("[data-template-grid]");
    const config = lab.querySelector("[data-template-config]");
    const success = lab.querySelector("[data-template-success]");
    const instruction = lab.querySelector("[data-template-instruction]");
    const counter = lab.querySelector("[data-template-counter]");
    const status = lab.querySelector("[data-template-status]");
    const save = lab.querySelector("[data-template-save]");
    const valueEditor = lab.querySelector("[data-template-value-editor]");
    const selectedLabel = lab.querySelector("[data-template-selected-label]");
    const valueSelect = lab.querySelector("[data-template-value]");
    const conflictValue = lab.querySelector("[data-template-conflict-value]");
    const colsInput = lab.querySelector("[data-template-cols]");
    const rowsInput = lab.querySelector("[data-template-rows]");
    const startValueInput = lab.querySelector("[data-template-start-value]");
    const preview = lab.querySelector("[data-template-preview]");
    const create = lab.querySelector("[data-template-create]");
    const applyValue = lab.querySelector("[data-template-apply-value]");
    const resetButtons = [...lab.querySelectorAll("[data-template-reset]")];
    const toolButtons = [...lab.querySelectorAll("[data-template-tool]")];
    const stepItems = [...lab.querySelectorAll("[data-template-step]")];
    let drawing = false;
    let startPoint = null;
    let selectedCell = null;

    const clampNumber = (value, min, max, fallback) => {
      const number = Number.parseInt(value, 10);
      return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    };

    const setStep = (step) => {
      stepItems.forEach((item) => {
        const itemStep = Number(item.dataset.templateStep);
        item.classList.toggle("active", itemStep === step);
        item.classList.toggle("complete", itemStep < step);
      });
    };

    const setOverlayOpen = (overlay, open) => {
      overlay?.classList.toggle("open", open);
      overlay?.setAttribute("aria-hidden", String(!open));
    };

    const pointFromEvent = (event) => {
      const bounds = canvas.getBoundingClientRect();
      return {
        x: Math.min(bounds.width, Math.max(0, event.clientX - bounds.left)),
        y: Math.min(bounds.height, Math.max(0, event.clientY - bounds.top)),
        width: bounds.width,
        height: bounds.height,
      };
    };

    const renderSelection = (from, to) => {
      const left = Math.min(from.x, to.x);
      const top = Math.min(from.y, to.y);
      const width = Math.abs(to.x - from.x);
      const height = Math.abs(to.y - from.y);
      selection.classList.add("visible");
      selection.style.left = `${(left / to.width) * 100}%`;
      selection.style.top = `${(top / to.height) * 100}%`;
      selection.style.width = `${(width / to.width) * 100}%`;
      selection.style.height = `${(height / to.height) * 100}%`;
    };

    const updatePreview = () => {
      const cols = clampNumber(colsInput?.value, 1, 9, 5);
      const rows = clampNumber(rowsInput?.value, 1, 9, 4);
      if (preview) {
        preview.textContent = `Vorschau: ${cols} × ${rows} Raster mit ${cols * rows} Feldern`;
      }
    };

    const finishDrawing = (event) => {
      if (!drawing) return;
      drawing = false;
      surface.releasePointerCapture?.(event.pointerId);
      const endPoint = pointFromEvent(event);
      if (
        Math.abs(endPoint.x - startPoint.x) < 8 ||
        Math.abs(endPoint.y - startPoint.y) < 8
      ) {
        renderSelection(
          {
            x: endPoint.width * 0.4059,
            y: endPoint.height * 0.1738,
          },
          {
            x: endPoint.width * 0.8437,
            y: endPoint.height * 0.3516,
            width: endPoint.width,
            height: endPoint.height,
          },
        );
      }
      selection.classList.add("snapped");
      if (target) target.hidden = true;
      setStep(2);
      if (instruction) instruction.textContent = "Legen Sie Spalten, Zeilen und den ersten Ausgabewert fest.";
      if (status) status.textContent = "Bereich erkannt. Raster-Konfiguration geöffnet.";
      window.setTimeout(() => {
        setOverlayOpen(config, true);
        colsInput?.focus({ preventScroll: true });
      }, 280);
    };

    surface?.addEventListener("pointerdown", (event) => {
      if (surface.classList.contains("disabled")) return;
      drawing = true;
      startPoint = pointFromEvent(event);
      selection.classList.remove("snapped");
      surface.setPointerCapture?.(event.pointerId);
      renderSelection(startPoint, startPoint);
    });

    surface?.addEventListener("pointermove", (event) => {
      if (!drawing) return;
      renderSelection(startPoint, pointFromEvent(event));
    });
    surface?.addEventListener("pointerup", finishDrawing);
    surface?.addEventListener("pointercancel", finishDrawing);

    [colsInput, rowsInput, startValueInput].forEach((input) =>
      input?.addEventListener("input", updatePreview),
    );

    create?.addEventListener("click", () => {
      const cols = clampNumber(colsInput?.value, 1, 9, 5);
      const rows = clampNumber(rowsInput?.value, 1, 9, 4);
      const startValue = clampNumber(startValueInput?.value, 0, 99, 1);
      grid.replaceChildren();
      grid.style.setProperty("--template-cols", String(cols));
      grid.style.setProperty("--template-rows", String(rows));

      valueSelect.replaceChildren();
      for (let col = 0; col < cols; col += 1) {
        const option = document.createElement("option");
        option.value = String(startValue + col);
        option.textContent = String(startValue + col);
        valueSelect.append(option);
      }

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const cell = document.createElement("button");
          cell.type = "button";
          cell.className = "template-grid-cell";
          cell.textContent = String(startValue + col);
          cell.dataset.row = String(row + 1);
          cell.dataset.col = String(col + 1);
          cell.dataset.value = String(startValue + col);
          cell.setAttribute(
            "aria-label",
            `Zeile ${row + 1}, Antwortfeld ${col + 1}, Wert ${startValue + col}`,
          );
          cell.addEventListener("click", () => {
            grid
              .querySelectorAll(".template-grid-cell")
              .forEach((item) => item.classList.toggle("selected", item === cell));
            selectedCell = cell;
            valueEditor.hidden = false;
            selectedLabel.textContent = `Zeile ${cell.dataset.row}, Feld ${cell.dataset.col}`;
            valueSelect.value = cell.dataset.value;
            setStep(3);
            if (instruction) instruction.textContent = "Prüfen oder ändern Sie den Ausgabewert des markierten Feldes.";
            if (status) status.textContent = "Antwortfeld ausgewählt.";
          });
          grid.append(cell);
        }
      }

      grid.classList.add("visible");
      selection.classList.remove("visible");
      surface.classList.add("disabled");
      setOverlayOpen(config, false);
      setStep(3);
      if (counter) counter.textContent = `${cols * rows} Felder`;
      if (instruction) instruction.textContent = "Klicken Sie ein erzeugtes Antwortfeld an.";
      if (status) status.textContent = `${cols} × ${rows} Raster erstellt. Wählen Sie ein Feld aus.`;
      toolButtons.forEach((button) =>
        button.classList.toggle("active", button.dataset.templateTool === "select"),
      );
    });

    applyValue?.addEventListener("click", () => {
      if (!selectedCell) return;
      selectedCell.dataset.value = valueSelect.value;
      selectedCell.textContent = valueSelect.value;
      selectedCell.classList.add("configured");
      setStep(4);
      save.disabled = false;
      if (instruction) instruction.textContent = "Der Ausgabewert ist hinterlegt. Speichern Sie das Template.";
      if (status) {
        status.textContent = `Wert ${valueSelect.value}, Konfliktwert ${conflictValue.value || "9"} übernommen.`;
      }
    });

    save?.addEventListener("click", () => {
      if (save.disabled) return;
      setStep(4);
      setOverlayOpen(success, true);
    });

    toolButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.templateTool === "grid" && !grid.classList.contains("visible")) {
          toolButtons.forEach((item) => item.classList.toggle("active", item === button));
          if (status) status.textContent = "Eigenes Raster ist ausgewählt.";
          return;
        }
        if (button.dataset.templateTool === "select" && grid.classList.contains("visible")) {
          toolButtons.forEach((item) => item.classList.toggle("active", item === button));
          if (status) status.textContent = "Auswahlmodus: Klicken Sie ein Antwortfeld an.";
          return;
        }
        if (status) {
          status.textContent =
            "Diese geführte Übung verwendet das Werkzeug „Eigenes Raster“.";
        }
      });
    });

    const reset = () => {
      drawing = false;
      startPoint = null;
      selectedCell = null;
      selection.classList.remove("visible", "snapped");
      selection.removeAttribute("style");
      grid.classList.remove("visible");
      grid.replaceChildren();
      surface.classList.remove("disabled");
      if (target) target.hidden = false;
      valueEditor.hidden = true;
      save.disabled = true;
      if (colsInput) colsInput.value = "5";
      if (rowsInput) rowsInput.value = "4";
      if (startValueInput) startValueInput.value = "1";
      if (conflictValue) conflictValue.value = "9";
      if (counter) counter.textContent = "0 Felder";
      if (instruction) instruction.textContent = "Ziehen Sie einen Rahmen über die erste Antworttabelle.";
      if (status) status.textContent = "Eigenes Raster ist ausgewählt.";
      toolButtons.forEach((button) =>
        button.classList.toggle("active", button.dataset.templateTool === "grid"),
      );
      setOverlayOpen(config, false);
      setOverlayOpen(success, false);
      setStep(1);
      updatePreview();
    };

    resetButtons.forEach((button) => button.addEventListener("click", reset));
    updatePreview();
  });

})();
