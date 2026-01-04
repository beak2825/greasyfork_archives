// ==UserScript==
// @name         TV Virtual Mouse + TV Toolbar (Smooth + AutoScroll) [PATCH 2 TV-Bro Toolbar]
// @namespace    tv-virtual-mouse-kiwi
// @version      1.2.0
// @description  Virtual pointer super smooth untuk Android TV remote (D-Pad + OK) + toolbar TV-friendly + auto-scroll. Toolbar bisa dinavigasi tanpa pointer (mode toolbar ala TV-Bro).
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559743/TV%20Virtual%20Mouse%20%2B%20TV%20Toolbar%20%28Smooth%20%2B%20AutoScroll%29%20%5BPATCH%202%20TV-Bro%20Toolbar%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/559743/TV%20Virtual%20Mouse%20%2B%20TV%20Toolbar%20%28Smooth%20%2B%20AutoScroll%29%20%5BPATCH%202%20TV-Bro%20Toolbar%5D.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /*****************************************************************
   * Config
   *****************************************************************/
  const CFG = {
    // Pointer feel
    accel: 6800,
    maxSpeed: 2200,
    friction: 14.5,
    microJitterFix: 0.02,

    // Auto-scroll feel
    edgeZone: 0.16,
    scrollSpeed: 1400,
    scrollSmooth: true,

    // Toolbar behavior
    toolbarAutoHideMs: 2600,
    toolbarHeight: 58,
    toolbarPaddingTop: 8,

    // OK button behavior
    okLongPressMs: 430,
    clickPulseMs: 120,

    // Safety
    dontHijackWhenTyping: true,
  };

  /*****************************************************************
   * Helpers
   *****************************************************************/
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const now = () => performance.now();

  const isEditable = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return true;
    if (el.isContentEditable) return true;
    return false;
  };

  const prefersReducedMotion = (() => {
    try { return matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch { return false; }
  })();

  /*****************************************************************
   * DOM: Pointer
   *****************************************************************/
  const pointer = document.createElement("div");
  pointer.id = "__tv_pointer__";
  pointer.innerHTML = `<div class="dot"></div><div class="ring"></div>`;

  const pointerStyle = document.createElement("style");
  pointerStyle.textContent = `
    #__tv_pointer__{
      position: fixed;
      left: 50vw;
      top: 50vh;
      width: 22px;
      height: 22px;
      transform: translate(-50%, -50%);
      z-index: 2147483646;
      pointer-events: none;
      opacity: 0.98;
      transition: opacity 120ms linear;
    }
    #__tv_pointer__ .dot{
      position:absolute; inset:0;
      margin:auto;
      width:8px; height:8px;
      border-radius:999px;
      background:#fff;
      box-shadow: 0 0 0 2px rgba(0,0,0,0.55), 0 6px 18px rgba(0,0,0,0.45);
    }
    #__tv_pointer__ .ring{
      position:absolute; inset:0;
      border-radius:999px;
      border:2px solid rgba(255,255,255,0.55);
      box-shadow: 0 0 0 2px rgba(0,0,0,0.35);
      transform: scale(1.05);
      opacity:0.65;
    }
    #__tv_pointer__.clicking .ring{
      opacity:0.95;
      transform: scale(0.9);
    }

    /* Toolbar */
    #__tv_toolbar__{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      height: ${CFG.toolbarHeight}px;
      padding: ${CFG.toolbarPaddingTop}px 10px 8px 10px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 2147483645;
      background: rgba(10,10,10,0.72);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.10);
      color: #fff;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      transform: translateY(0);
      transition: transform 180ms ease;
    }
    #__tv_toolbar__.hidden{ transform: translateY(-110%); }

    #__tv_toolbar__ button{
      appearance: none;
      border: 1px solid rgba(255,255,255,0.14);
      background: rgba(255,255,255,0.10);
      color: #fff;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      outline: none;
    }
    #__tv_toolbar__ button:active{ transform: translateY(1px); }

    #__tv_toolbar__ button:focus,
    #__tv_toolbar__ input:focus{
      border-color: rgba(255,255,255,0.55);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.12);
    }

    #__tv_toolbar__ .spacer{ flex: 1 1 auto; min-width: 8px; }
    #__tv_toolbar__ .url{
      flex: 1 1 520px;
      min-width: 120px;
      max-width: 900px;
      display: flex;
      gap: 6px;
      align-items: center;
    }
    #__tv_toolbar__ input{
      flex: 1 1 auto;
      width: 100%;
      padding: 10px 12px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.16);
      background: rgba(0,0,0,0.35);
      color: #fff;
      outline: none;
      font-size: 14px;
    }
    #__tv_toolbar__ .hint{
      opacity: 0.75;
      font-size: 12px;
      white-space: nowrap;
    }

    :fullscreen #__tv_toolbar__{ display:none !important; }
    :fullscreen #__tv_pointer__{ opacity: 0.95; }
  `;

  document.documentElement.appendChild(pointerStyle);
  document.documentElement.appendChild(pointer);

  /*****************************************************************
   * DOM: Toolbar
   *****************************************************************/
  const toolbar = document.createElement("div");
  toolbar.id = "__tv_toolbar__";
  toolbar.innerHTML = `
    <button data-act="back"    tabindex="0">⟵</button>
    <button data-act="forward" tabindex="0">⟶</button>
    <button data-act="reload"  tabindex="0">⟳</button>
    <button data-act="home"    tabindex="0">⌂</button>
    <button data-act="newtab"  tabindex="0">＋Tab</button>
    <button data-act="options" tabindex="0">⚙</button>

    <div class="url">
      <input id="__tv_url__" type="text" inputmode="url" spellcheck="false" autocomplete="off" />
      <button data-act="go" tabindex="0">Go</button>
    </div>

    <div class="spacer"></div>
    <span class="hint" id="__tv_hint__">BACK: Toolbar • OK: Klik</span>
    <button data-act="exit" tabindex="0">Exit</button>
    <button data-act="hide" tabindex="0">✕</button>
  `;
  document.documentElement.appendChild(toolbar);

  const urlInput = toolbar.querySelector("#__tv_url__");
  const hint = toolbar.querySelector("#__tv_hint__");

  function normalizeUrl(u) {
    u = (u || "").trim();
    if (!u) return "";
    if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(u)) return "https://" + u;
    return u;
  }

  function refreshUrlBox() {
    try { urlInput.value = location.href; } catch {}
  }
  refreshUrlBox();

  /*****************************************************************
   * Toolbar show/hide + Mode Toolbar (navigasi tanpa pointer)
   *****************************************************************/
  let toolbarHidden = false;
  let toolbarTimer = null;

  // Mode toolbar: D-Pad menggerakkan fokus antar tombol toolbar (bukan pointer)
  let toolbarMode = false;
  let toolbarFocusIndex = 0;

  function getToolbarFocusables() {
    // urutan fokus toolbar
    const focusables = Array.from(
      toolbar.querySelectorAll('button[data-act], #__tv_url__')
    ).filter(el => !el.disabled && el.offsetParent !== null);
    return focusables;
  }

  function focusToolbarIndex(i) {
    const items = getToolbarFocusables();
    if (!items.length) return;
    toolbarFocusIndex = (i + items.length) % items.length;
    items[toolbarFocusIndex].focus?.();
  }

  function enterToolbarMode(focusAct = "back") {
    toolbarMode = true;
    showToolbar(true);

    const items = getToolbarFocusables();
    const idx = items.findIndex(el => el.matches(`button[data-act="${focusAct}"]`));
    focusToolbarIndex(idx >= 0 ? idx : 0);

    // (opsional) supaya pointer cepat “nyampe” toolbar juga, kita posisikan ke tengah toolbar
    // biar klik OK via pointer juga langsung kena kalau user tetap mau.
    x = window.innerWidth * 0.18;
    y = Math.max(18, CFG.toolbarHeight * 0.55);
  }

  function exitToolbarMode() {
    toolbarMode = false;
    // blur biar halaman nggak “nyangkut” fokus toolbar
    if (document.activeElement && toolbar.contains(document.activeElement)) {
      document.activeElement.blur?.();
    }
  }

  function hideToolbar() {
    toolbarHidden = true;
    toolbar.classList.add("hidden");
    exitToolbarMode();
  }

  function showToolbar(persist = false) {
    toolbarHidden = false;
    toolbar.classList.remove("hidden");
    if (!persist) scheduleToolbarHide();
  }

  function scheduleToolbarHide() {
    if (toolbarTimer) clearTimeout(toolbarTimer);
    toolbarTimer = setTimeout(() => {
      // jangan auto-hide kalau user lagi fokus di input URL atau mode toolbar aktif
      if (document.activeElement === urlInput) return scheduleToolbarHide();
      if (toolbarMode) return scheduleToolbarHide();
      hideToolbar();
    }, CFG.toolbarAutoHideMs);
  }

  scheduleToolbarHide();

  // update url box on navigation changes
  window.addEventListener("hashchange", refreshUrlBox, { passive: true });
  window.addEventListener("popstate", refreshUrlBox, { passive: true });

  /*****************************************************************
   * Toolbar actions
   *****************************************************************/
  function toolbarAction(act) {
    if (act === "back") history.back();
    if (act === "forward") history.forward();
    if (act === "reload") location.reload();
    if (act === "home") location.href = "about:blank";

    if (act === "newtab") {
      const u = normalizeUrl(urlInput.value || location.href);
      try { window.open(u, "_blank", "noopener,noreferrer"); } catch {}
    }

    if (act === "options") {
      // Simple options: toggle scrollSmooth & show quick help
      CFG.scrollSmooth = !CFG.scrollSmooth;
      hint.textContent = `⚙ Options: scrollSmooth = ${CFG.scrollSmooth ? "ON" : "OFF"} • BACK: Hide`;
      setTimeout(updateHint, 1400);
    }

    if (act === "exit") {
      // Di banyak browser TV, window.close() diblok. Fallback: about:blank
      let closed = false;
      try { window.close(); closed = true; } catch {}
      if (!closed) location.href = "about:blank";
    }

    if (act === "hide") hideToolbar();

    if (act === "go") {
      const u = normalizeUrl(urlInput.value);
      if (u) location.href = u;
    }
  }

  toolbar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    showToolbar(true);
    toolbarAction(btn.dataset.act);
  });

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const u = normalizeUrl(urlInput.value);
      if (u) location.href = u;
    }
  });

  /*****************************************************************
   * Pointer physics (PATCH: pointer boleh masuk toolbar)
   *****************************************************************/
  let x = window.innerWidth * 0.5;
  let y = window.innerHeight * 0.5;
  let vx = 0, vy = 0;

  const keys = { up: false, down: false, left: false, right: false };

  // PATCH: dulu “topSafe” bikin pointer ketahan. Sekarang 0 biar pointer bebas.
  function toolbarSafeTop() { return 0; }

  // Auto-scroll state
  let scrollVy = 0;

  function tick(dt) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Kalau mode toolbar aktif, pointer jangan digerakkan oleh D-Pad (biar fokus toolbar enak).
    if (toolbarMode) {
      pointer.style.left = x + "px";
      pointer.style.top = y + "px";
      return;
    }

    let ax = 0, ay = 0;
    if (keys.left) ax -= CFG.accel;
    if (keys.right) ax += CFG.accel;
    if (keys.up) ay -= CFG.accel;
    if (keys.down) ay += CFG.accel;

    vx += ax * dt;
    vy += ay * dt;

    const sp = Math.hypot(vx, vy);
    if (sp > CFG.maxSpeed) {
      const s = CFG.maxSpeed / sp;
      vx *= s; vy *= s;
    }

    const fr = Math.exp(-CFG.friction * dt);
    vx *= fr;
    vy *= fr;

    if (Math.abs(vx) < CFG.microJitterFix) vx = 0;
    if (Math.abs(vy) < CFG.microJitterFix) vy = 0;

    x += vx * dt;
    y += vy * dt;

    // bounds: PATCH (boleh masuk toolbar)
    const topSafe = toolbarSafeTop();
    x = clamp(x, 0, w);
    y = clamp(y, topSafe, h);

    // Auto-scroll
    scrollVy = 0;
    const edge = h * CFG.edgeZone;

    // PATCH kamu: nearTop pakai topSafe + edge
    const nearBottom = y > (h - edge);
    const nearTop = y < (topSafe + edge);

    if (keys.down && nearBottom) {
      scrollVy = CFG.scrollSpeed;
      y = clamp(y, topSafe, h - edge * 0.35);
    } else if (keys.up && nearTop) {
      scrollVy = -CFG.scrollSpeed;
      y = clamp(y, topSafe + edge * 0.35, h);
    }

    if (scrollVy !== 0) {
      if (CFG.scrollSmooth && "scrollBy" in window) {
        window.scrollBy({ top: scrollVy * dt, left: 0, behavior: "auto" });
      } else {
        window.scrollBy(0, scrollVy * dt);
      }
    }

    pointer.style.left = x + "px";
    pointer.style.top = y + "px";
  }

  let lastT = now();
  function rafLoop(t) {
    const dt = Math.min(0.033, (t - lastT) / 1000);
    lastT = t;
    tick(prefersReducedMotion ? Math.min(dt, 0.016) : dt);
    requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  window.addEventListener("resize", () => {
    x = clamp(x, 0, window.innerWidth);
    y = clamp(y, toolbarSafeTop(), window.innerHeight);
  }, { passive: true });

  /*****************************************************************
   * Click dispatch at pointer position
   *****************************************************************/
  function dispatchMouse(el, type, opts = {}) {
    if (!el) return;
    const ev = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      ...opts,
    });
    el.dispatchEvent(ev);
  }

  function clickAtPointer(button = 0) {
    const el = document.elementFromPoint(x, y);
    if (!el) return;

    pointer.classList.add("clicking");
    setTimeout(() => pointer.classList.remove("clicking"), CFG.clickPulseMs);

    if (isEditable(el)) el.focus?.();
    else if (document.activeElement === urlInput) urlInput.blur();

    dispatchMouse(el, "mousemove");
    dispatchMouse(el, "mouseover");
    dispatchMouse(el, "mousedown", { button, buttons: 1 });
    dispatchMouse(el, "mouseup", { button, buttons: 0 });
    dispatchMouse(el, "click", { button });
  }

  function contextAtPointer() {
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    dispatchMouse(el, "contextmenu", { button: 2, buttons: 2 });
  }

  /*****************************************************************
   * Key mapping (Android TV remote friendly)
   *****************************************************************/
  function isMenuKey(e) {
    return e.key === "ContextMenu" || e.key === "Menu" || e.code === "ContextMenu" || e.keyCode === 82;
  }

  function isOkKey(e) {
    return e.key === "Enter" || e.code === "Enter" || e.keyCode === 13 || e.keyCode === 23;
  }

  // BACK (Android): keyCode 4, atau BrowserBack
  function isBackKey(e) {
    return e.key === "Backspace" || e.key === "BrowserBack" || e.keyCode === 4;
  }

  function dirFromEvent(e) {
    if (e.key === "ArrowUp" || e.keyCode === 19) return "up";
    if (e.key === "ArrowDown" || e.keyCode === 20) return "down";
    if (e.key === "ArrowLeft" || e.keyCode === 21) return "left";
    if (e.key === "ArrowRight" || e.keyCode === 22) return "right";
    return null;
  }

  let okDownAt = 0;
  let okLongPressTimer = null;
  let okLongPressed = false;

  function onKeyDown(e) {
    // BACK = toggle toolbar mode (ala TV-Bro)
    if (isBackKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (toolbarHidden) {
        enterToolbarMode("back");
      } else {
        // kalau toolbar tampil: BACK -> hide + keluar mode
        hideToolbar();
      }
      return;
    }

    // MENU: toggle toolbar (tanpa harus keluar/masuk mode pointer)
    if (isMenuKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      if (toolbarHidden) enterToolbarMode("back");
      else hideToolbar();
      return;
    }

    // Kalau mode toolbar aktif: D-Pad = pindah fokus toolbar
    if (toolbarMode && !toolbarHidden) {
      const dir = dirFromEvent(e);
      if (dir) {
        // Jika fokus di urlInput, biarkan left/right untuk kursor teks
        const focused = document.activeElement === urlInput;
        const items = getToolbarFocusables();

        if (focused && (dir === "left" || dir === "right")) {
          // biarkan native
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (!items.length) return;

        // mapping: left/right pindah item, up/down juga pindah item
        const delta = (dir === "left" || dir === "up") ? -1 : +1;
        focusToolbarIndex(toolbarFocusIndex + delta);
        return;
      }

      if (isOkKey(e)) {
        e.preventDefault();
        e.stopPropagation();

        // long press OK saat mode toolbar: tetap bisa context menu via pointer
        if (!okDownAt) {
          okDownAt = now();
          okLongPressed = false;
          okLongPressTimer = setTimeout(() => {
            okLongPressed = true;
            contextAtPointer();
          }, CFG.okLongPressMs);
        }
        return;
      }
      // selain itu biarkan
      return;
    }

    // Jangan ganggu kalau user lagi ngetik (mode pointer)
    if (CFG.dontHijackWhenTyping && isEditable(document.activeElement)) return;

    const dir = dirFromEvent(e);
    if (dir) {
      e.preventDefault();
      e.stopPropagation();
      keys[dir] = true;
      showToolbar(false);
      return;
    }

    if (isOkKey(e)) {
      e.preventDefault();
      e.stopPropagation();
      showToolbar(false);

      if (!okDownAt) {
        okDownAt = now();
        okLongPressed = false;
        okLongPressTimer = setTimeout(() => {
          okLongPressed = true;
          contextAtPointer();
        }, CFG.okLongPressMs);
      }
      return;
    }
  }

  function onKeyUp(e) {
    // mode toolbar
    if (toolbarMode && !toolbarHidden) {
      if (isOkKey(e)) {
        e.preventDefault();
        e.stopPropagation();

        if (okLongPressTimer) {
          clearTimeout(okLongPressTimer);
          okLongPressTimer = null;
        }

        if (!okLongPressed) {
          // trigger action fokus toolbar
          const el = document.activeElement;
          if (el && el.matches('button[data-act]')) {
            toolbarAction(el.dataset.act);
          } else if (el === urlInput) {
            // OK di input: fokus tetap, tidak pindah
          }
        }

        okDownAt = 0;
        okLongPressed = false;
        return;
      }
      return;
    }

    // mode pointer
    if (CFG.dontHijackWhenTyping && isEditable(document.activeElement)) return;

    const dir = dirFromEvent(e);
    if (dir) {
      e.preventDefault();
      e.stopPropagation();
      keys[dir] = false;
      return;
    }

    if (isOkKey(e)) {
      e.preventDefault();
      e.stopPropagation();

      if (okLongPressTimer) {
        clearTimeout(okLongPressTimer);
        okLongPressTimer = null;
      }

      if (!okLongPressed) clickAtPointer(0);

      okDownAt = 0;
      okLongPressed = false;
      return;
    }
  }

  // Capture phase biar menang dari website yang “nyolong” key event
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);

  /*****************************************************************
   * Fullscreen: hint update
   *****************************************************************/
  function updateHint() {
    const fs = !!document.fullscreenElement;
    hint.textContent = fs
      ? "Fullscreen"
      : "BACK: Toolbar • OK: Klik • Tahan OK: Menu";
  }

  document.addEventListener("fullscreenchange", () => {
    updateHint();
    if (!document.fullscreenElement) showToolbar(false);
  }, { passive: true });

  updateHint();

  /*****************************************************************
   * Pointer fade
   *****************************************************************/
  let pointerFadeTimer = null;
  function nudgeVisible() {
    pointer.style.opacity = "0.98";
    if (pointerFadeTimer) clearTimeout(pointerFadeTimer);
    pointerFadeTimer = setTimeout(() => {
      if (toolbarHidden) pointer.style.opacity = "0.75";
    }, 2400);
  }
  window.addEventListener("scroll", nudgeVisible, { passive: true });
  nudgeVisible();
})();
