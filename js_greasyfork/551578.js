// ==UserScript==
// @name         Throne Surprise Gift Revealer
// @namespace    https://greasyfork.org/users/45933
// @version      0.1.2
// @author       ChatGPT 5 (unreviewed)
// @description  Press a key to reveal all secret gifts on Throne gifters pages. Optional automatic “Show More” loader (disabled by default). Persistent config via storage. Written by ChatGPT 5, not code reviewed.
// @match        https://throne.com/*
// @match        https://*.throne.com/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551578/Throne%20Surprise%20Gift%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/551578/Throne%20Surprise%20Gift%20Revealer.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(() => {
  // =========================
  // CONFIG DEFAULTS (persist via GM storage)
  // =========================
  const DEFAULT_KEYS = { trigger: 'F9', toggleAuto: 'Control+Shift+F9' };
  const DEFAULT_AUTO = false;

  // Reveal settings
  const REVEAL_DELAY_MS = 1;
  const REVEAL_MAX = 9999;

  // Show More background loop settings
  const SHOW_MORE_INTERVAL = 1000;  // 1s
  const SHOW_MORE_LIMIT = 100;      // safety ceiling
  const STALLED_LIMIT = 3;          // stop after 3 consecutive no-growth checks
  const SHOW_MORE_APPEAR_TIMEOUT_MS = 30000; // max wait for button to exist
  const SHOW_MORE_APPEAR_POLL_MS    = 500;   // poll interval while waiting

  // =========================
  // STATE
  // =========================
  const revealedButtons = new WeakSet();
  let isRunning = false;
  let showMoreTimer = null;


  // =========================
  // ROUTE WATCH (SPA-safe) + MOUNT/UNMOUNT
  // =========================
  const GIFTERS_RE = /^\/[^/]+\/gifters(?:[/?#]|$)/;

    function isGiftersPath(path = location.pathname) {
        return GIFTERS_RE.test(path);
    }

    // History wrapper + popstate + fallback poll
    const Route = (() => {
        let last = location.pathname + location.search + location.hash;
        const listeners = new Set();
        const fire = () => {
            const cur = location.pathname + location.search + location.hash;
            if (cur !== last) {
                const prev = last;
                last = cur;
                listeners.forEach(fn => { try { fn(cur, prev); } catch (e) { console.error(e); } });
            }
        };
        ['pushState','replaceState'].forEach(m => {
            const orig = history[m];
            history[m] = function(...args) {
                const ret = orig.apply(this, args);
                setTimeout(fire, 0);
                return ret;
            };
        });
        window.addEventListener('popstate', fire);
        setInterval(fire, 500); // fallback
        return { onChange: fn => listeners.add(fn) };
    })();

    let mounted = false;
    let keydownHandler = null;
    let triggerB = null;
    let toggleB  = null;

    async function mountOnGifters() {
        if (mounted) return;
        mounted = true;
        L.info('[mount] entering /gifters');

        await ensureDefaultsInStorage();
        const { runtimeKeys, runtimeAuto } = await readValidatedConfig();

        // Parse (validated already inside readValidatedConfig)
        triggerB = parseKeybinding(runtimeKeys.trigger);
        toggleB  = parseKeybinding(runtimeKeys.toggleAuto);

        keydownHandler = (e) => {
            if (isEditableTarget(e.target)) return;
            if (matchesBinding(e, triggerB)) {
                L.info('Trigger pressed → revealAll');
                revealAll();
            } else if (matchesBinding(e, toggleB)) {
                L.info('Toggle pressed → flip autoShowMoreEnabled (future only)');
                (async () => {
                    const cur = await GM.getValue('autoShowMoreEnabled', DEFAULT_AUTO);
                    await GM.setValue('autoShowMoreEnabled', !cur);
                    if (!cur) toast('For FUTURE page loads it will automatically click Show More.');
                    else      toast('For FUTURE page loads it will NOT auto-click Show More.');
                })();
            }
        };

        window.addEventListener('keydown', keydownHandler, false);

        if (runtimeAuto) startShowMoreLoop();

        L.info(`Ready. Keys(runtime): trigger=${runtimeKeys.trigger} | toggleAuto=${runtimeKeys.toggleAuto} | autoShowMoreEnabled=${runtimeAuto}`);
    }

    function unmountFromGifters() {
        if (!mounted) return;
        mounted = false;
        L.info('[unmount] leaving /gifters');

        // stop background loop
        if (showMoreTimer) { clearInterval(showMoreTimer); showMoreTimer = null; }

        // remove key handler
        if (keydownHandler) {
            window.removeEventListener('keydown', keydownHandler, false);
            keydownHandler = null;
        }

        // reset run state
        isRunning = false;
    }


  // =========================
  // LOGGING + TOAST
  // =========================
  const L = {
    info: (...a) => console.log('[Revealer]', ...a),
    warn: (...a) => console.warn('[Revealer]', ...a),
    errBox: (msg) => {
      const lines = [
        '================ KEYBIND REJECTED ================',
        msg,
        '=================================================='
      ];
      lines.forEach(line => console.error(line));
      alert(`Keybinding rejected:\n${msg}`);
    }
  };

  function toast(msg) {
    const styleId = 'throne-revealer-toast-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .throne-revealer-toast {
          position: fixed; top: 12px; right: 12px; z-index: 999999;
          background: rgba(20,20,20,0.94); color: #fff; padding: 8px 12px;
          border-radius: 8px; font: 12px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Arial;
          transition: opacity 0.4s ease; opacity: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.35);
        }`;
      document.head.appendChild(style);
    }
    const el = document.createElement('div');
    el.className = 'throne-revealer-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; });
    setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 450); }, 2000);
  }

  // =========================
  // KEYBIND PARSING + VALIDATION
  // =========================
  const HARD_REJECT_KEYS = new Set(['F1','F5','F11','Esc','Tab']);
  const HARD_REJECT_COMBOS = new Set([
    'Ctrl+R','Meta+R','Cmd+R',
    'Ctrl+W','Meta+W','Cmd+W',
    'Ctrl+L','Meta+L','Cmd+L',
    'Alt+F4',
    'Alt+ArrowLeft','Alt+ArrowRight',
    'Ctrl+Tab','Ctrl+Shift+Tab'
  ]);


  function normalizeBindingString(str) {
      if (!str) return '';

      // 1) Unify separators to '+' (accepts space / hyphens / underscores / multiple pluses)
      let s = String(str).trim();
      s = s.replace(/[\u2010-\u2015]/g, '-');     // all hyphen-like to '-'
      s = s.replace(/[ _\-]+/g, '+');             // spaces/underscores/hyphens -> '+'
      s = s.replace(/\++/g, '+');                 // collapse repeats
      s = s.replace(/^\+|\+$/g, '');              // trim leading/trailing '+'
      if (!s) return '';

      const tokens = s.split('+').filter(Boolean);

      // 2) Canonicalize tokens
      const mods = { ctrl:false, alt:false, shift:false, meta:false };
      let key = null;

      const modMap = {
         'control':'ctrl', 'ctrl':'ctrl',
         'alt':'alt', 'option':'alt', 'opt':'alt',
         'shift':'shift',
         'meta':'meta', 'cmd':'meta', 'command':'meta', 'super':'meta', 'win':'meta', 'windows':'meta'
      };

      const keyMap = {
         // arrows (allow "left", "arrowleft")
         'left':'ArrowLeft', 'arrowleft':'ArrowLeft',
         'right':'ArrowRight', 'arrowright':'ArrowRight',
         'up':'ArrowUp', 'arrowup':'ArrowUp',
         'down':'ArrowDown', 'arrowdown':'ArrowDown',

         // common keys
         'esc':'Escape', 'escape':'Escape',
         'return':'Enter', 'enter':'Enter',
         'space':'Space', 'spacebar':'Space',
         'del':'Delete', 'delete':'Delete',
         'ins':'Insert', 'insert':'Insert',
         'bksp':'Backspace', 'backspace':'Backspace',
         'home':'Home', 'end':'End',
         'pgup':'PageUp', 'pageup':'PageUp',
         'pgdn':'PageDown', 'pagedown':'PageDown',
         'tab':'Tab',
      };

      const isFKey = t => /^f([1-9]|1[0-9]|2[0-4])$/i.test(t);
      const toFKey = t => 'F' + t.match(/\d+/)[0];

      const isKeyLetter = t => /^[a-z]$/.test(t);
      const isKeyDigit  = t => /^[0-9]$/.test(t);

      const isKeyCodeLetter = t => /^key[a-z]$/.test(t);      // e.g. "keyr"
      const isDigitCode     = t => /^digit[0-9]$/.test(t);    // e.g. "digit9"
      const isNumpad        = t => /^numpad[0-9]$/.test(t);   // e.g. "numpad1"

      for (let raw of tokens) {
         const t = String(raw).trim().toLowerCase();
         if (!t) continue;

         // modifiers
         if (t in modMap) { mods[modMap[t]] = true; continue; }

         // F-keys
         if (isFKey(t)) { key = toFKey(t); continue; }

         // named keys & arrows
         if (t in keyMap) { key = keyMap[t]; continue; }

         // already-coded variants
         if (isKeyCodeLetter(t)) { key = 'Key' + t.slice(3).toUpperCase(); continue; }
         if (isDigitCode(t))     { key = 'Digit' + t.slice(5); continue; }
         if (isNumpad(t))        { key = 'Numpad' + t.slice(6); continue; }

         // single letter / digit
         if (isKeyLetter(t)) { key = t.toUpperCase(); continue; }
         if (isKeyDigit(t))  { key = t; continue; }

         // ArrowXYZ (already canonical), Enter/Escape/etc in proper case
         if (/^arrow(left|right|up|down)$/i.test(raw)) { key = 'Arrow' + raw.slice(5,6).toUpperCase() + raw.slice(6).toLowerCase(); continue; }
         if (/^(enter|escape|space|tab|home|end|delete|insert|backspace|pageup|pagedown)$/i.test(raw)) {
            const proper = raw[0].toUpperCase() + raw.slice(1).toLowerCase();
            key = proper;
            continue;
         }

         // last resort: preserve as-is (parser will try to map or reject)
         key = raw;
      }

      // 3) Emit canonical order: Ctrl + Alt + Shift + Meta + Key
      const out = [];
      if (mods.ctrl)  out.push('Ctrl');
      if (mods.alt)   out.push('Alt');
      if (mods.shift) out.push('Shift');
      if (mods.meta)  out.push('Meta');
      if (key)        out.push(key);

      return out.join('+');
   }


  function parseKeybinding(str) {
    const raw = normalizeBindingString(str);
    if (!raw) { L.errBox('Empty keybinding string.'); return null; }

    const parts = raw.split('+');
    let shift=false, ctrl=false, alt=false, meta=false;
    let keyPart = null;
    for (const p of parts) {
      const up = p.toLowerCase();
      if (up === 'shift') shift = true;
      else if (up === 'ctrl' || up === 'control') ctrl = true;
      else if (up === 'alt') alt = true;
      else if (up === 'meta' || up === 'cmd' || up === 'command') meta = true;
      else keyPart = p;
    }
    if (!keyPart) { L.errBox('No key provided in binding.'); return null; }

    // Map keyPart → KeyboardEvent.code
    let code = null;
    if (/^F([1-9]|1[0-9]|2[0-4])$/i.test(keyPart)) code = keyPart.toUpperCase();
    else if (/^Arrow(Left|Right|Up|Down)$/i.test(keyPart)) code = 'Arrow' + keyPart.slice(5,6).toUpperCase()+keyPart.slice(6).toLowerCase();
    else if (/^Key[A-Z]$/i.test(keyPart)) code = 'Key' + keyPart.slice(3,4).toUpperCase();
    else if (/^[A-Za-z]$/.test(keyPart)) code = 'Key' + keyPart.toUpperCase();
    else if (/^[0-9]$/.test(keyPart)) code = 'Digit' + keyPart;
    else {
      const map = {
        'Escape':'Escape','Esc':'Escape',
        'Enter':'Enter','Return':'Enter',
        'Tab':'Tab','Space':'Space','Spacebar':'Space',
        'Backspace':'Backspace','Delete':'Delete',
        'Home':'Home','End':'End','PageUp':'PageUp','PageDown':'PageDown',
        'Insert':'Insert'
      };
      code = map[keyPart] || null;
    }
    if (!code) { L.errBox(`Unrecognized key: ${keyPart}`); return null; }

    if (HARD_REJECT_KEYS.has(keyPart)) { L.errBox(`Forbidden key: ${keyPart}`); return null; }

    const normalizedCombo = [
      ctrl ? 'Ctrl' : null,
      alt ? 'Alt' : null,
      shift ? 'Shift' : null,
      meta ? 'Meta' : null,
      code
    ].filter(Boolean).join('+');

    if (HARD_REJECT_COMBOS.has(normalizedCombo)) { L.errBox(`Forbidden combo: ${normalizedCombo}`); return null; }
    if (code === 'Enter' && !shift && !ctrl && !alt && !meta) { L.errBox('Forbidden key: Enter (no modifiers)'); return null; }
    if ((/^Key[A-Z]$/.test(code) || /^Digit[0-9]$/.test(code)) && !shift && !ctrl && !alt && !meta) {
      L.errBox('Forbidden: bare letter/digit with no modifier'); return null;
    }

    return { code, shift, ctrl, alt, meta, normalizedCombo };
  }

  function matchesBinding(ev, b) {
    if (!b) return false;
    if (ev.code !== b.code) return false;
    b.shift = !!b.shift;
    b.ctrl  = !!b.ctrl;
    b.alt   = !!b.alt;
    b.meta  = !!b.meta;
    if (ev.shiftKey !== b.shift) return false;
    if (ev.ctrlKey  !== b.ctrl)  return false;
    if (ev.altKey   !== b.alt)   return false;
    if (ev.metaKey  !== b.meta)  return false;
    return true;
  }

  // =========================
  // DOM QUERIES
  // =========================
  function queryRevealIcons() {
    return Array.from(document.querySelectorAll('svg[viewBox="0 0 1024 1024"][height="15px"]'));
  }
  function countRevealIcons() {
    return queryRevealIcons().length;
  }

  // === FIND "SHOW MORE" (text-first, verbose) ===
  function findVisibleShowMoreButtonVerbose() {
    const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const isVisible = el => {
      try {
        const r = el.getBoundingClientRect();
        if (!r || r.width === 0 || r.height === 0) return false;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
        return true;
      } catch { return false; }
    };

    const allButtons     = Array.from(document.querySelectorAll('button'));
    const allRoleButtons = Array.from(document.querySelectorAll('[role="button"]'));
    const chakraAny      = Array.from(document.querySelectorAll('button[class*="chakra-button"]'));
    const chakraStrict   = Array.from(document.querySelectorAll('button.chakra-button'));

    const byTextBtn        = allButtons.filter(b => norm(b.textContent) === 'show more');
    const byRoleText       = allRoleButtons.filter(b => norm(b.textContent) === 'show more');
    const byChakraText     = chakraAny.filter(b => norm(b.textContent) === 'show more');
    const byChakraStrictText = chakraStrict.filter(b => norm(b.textContent) === 'show more');

    const v = {
      textBtn:  byTextBtn.filter(isVisible),
      roleText: byRoleText.filter(isVisible),
      chakraText: byChakraText.filter(isVisible),
      chakraStrictText: byChakraStrictText.filter(isVisible),
    };

    const winner =
      (v.textBtn[0]          && { method: 'textBtn',            el: v.textBtn[0] }) ||
      (v.roleText[0]         && { method: 'roleText',           el: v.roleText[0] }) ||
      (v.chakraText[0]       && { method: 'chakraText',         el: v.chakraText[0] }) ||
      (v.chakraStrictText[0] && { method: 'chakraStrictText',   el: v.chakraStrictText[0] }) ||
      null;

    const counts = {
      textBtn: byTextBtn.length,  textBtnVis: v.textBtn.length,
      roleText: byRoleText.length, roleTextVis: v.roleText.length,
      chakraText: byChakraText.length, chakraTextVis: v.chakraText.length,
      chakraStrictText: byChakraStrictText.length, chakraStrictTextVis: v.chakraStrictText.length,
    };

    if (winner) {
      console.log(`[ShowMoreFinder] method=${winner.method}`, counts);
      console.log('[ShowMoreFinder] outerHTML:', (winner.el.outerHTML || '').slice(0, 400));
      return { btn: winner.el, method: winner.method, counts };
    } else {
      console.log('[ShowMoreFinder] none found', counts);
      return { btn: null, method: null, counts };
    }
  }

  // =========================
  // CORE: Reveal all (idempotent via WeakSet)
  // =========================
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function clickNode(btn) {
    // Prefer the native method
    try { btn.click(); return true; } catch (_) {}
    // Fallback synthetic event (NO view: window)
    try {
      const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
      return btn.dispatchEvent(ev);
    } catch (e) {
      L.warn('Synthetic click failed:', e);
      return false;
    }
  }

  async function revealAll() {
    if (isRunning) { L.info('Already running; ignoring keypress.'); return; }
    isRunning = true;

    const icons = queryRevealIcons();
    L.info(`revealAll: icons=${icons.length}`);
    let clicked = 0;

    for (let i = 0; i < icons.length && clicked < REVEAL_MAX; i++) {
      const svg = icons[i];
      const btn = svg.closest('button,div,span');
      if (!btn || revealedButtons.has(btn)) continue;

      try {
        const ok = await clickNode(btn);
        revealedButtons.add(btn);
        if (ok) {
          svg.style.outline = '2px solid lime';
          clicked++;
          if ((clicked % 25) === 0) L.info(`Clicked so far: ${clicked}`);
        } else {
          L.warn('Click returned false (prevented?)');
        }
      } catch (e) {
        console.error('[Revealer] Click error:', e);
      }

      if (REVEAL_DELAY_MS > 0) await sleep(REVEAL_DELAY_MS);
    }

    L.info(`revealAll done: clicked=${clicked}`);
    isRunning = false;
  }

  // === SHOW MORE WARMUP (no clicks; single retry after waitMs) ===
  async function warmupFindShowMore(waitMs = 500) {
    const sleepLocal = ms => new Promise(r => setTimeout(r, ms));
    const norm = s => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const isVisible = el => {
      try {
        const r = el.getBoundingClientRect();
        if (!r || r.width === 0 || r.height === 0) return false;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
        return true;
      } catch { return false; }
    };

    function xPathNodes() {
         // Case-insensitive exact "show more"
      const xp = "//*[translate(normalize-space(string(.)), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='show more']";
      const res = document.evaluate(xp, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const arr = [];
      for (let i = 0; i < res.snapshotLength; i++) arr.push(res.snapshotItem(i));
      return arr;
    }

    function snapshot(passLabel) {
      const strictSel = 'button.chakra-button.css-k02bry';
      const loose1Sel = 'button.chakra-button';
      const loose2Sel = 'button[class*="chakra-button"]';

      const strict = Array.from(document.querySelectorAll(strictSel));
      const loose1 = Array.from(document.querySelectorAll(loose1Sel));
      const loose2 = Array.from(document.querySelectorAll(loose2Sel));
      const byTextBtn = Array.from(document.querySelectorAll('button')).filter(b => norm(b.textContent) === 'show more');
      const byRoleBtn = Array.from(document.querySelectorAll('[role="button"]')).filter(b => norm(b.textContent) === 'show more');
      const byXPath = xPathNodes();

      const vis = {
        strict: strict.filter(isVisible),
        loose1: loose1.filter(isVisible),
        loose2: loose2.filter(isVisible),
        textBtn: byTextBtn.filter(isVisible),
        roleBtn: byRoleBtn.filter(isVisible),
        xPath: byXPath.filter(isVisible),
      };

      const winner =
        (vis.strict[0] && { method: 'strict',  selector: strictSel, el: vis.strict[0] }) ||
        (vis.loose1[0] && { method: 'loose1',  selector: loose1Sel, el: vis.loose1[0] }) ||
        (vis.loose2[0] && { method: 'loose2',  selector: loose2Sel, el: vis.loose2[0] }) ||
        (vis.textBtn[0] && { method: 'textBtn', selector: 'button[text="show more"]', el: vis.textBtn[0] }) ||
        (vis.roleBtn[0] && { method: 'roleBtn', selector: '[role="button"][text="show more"]', el: vis.roleBtn[0] }) ||
        (vis.xPath[0]  && { method: 'xPath',   selector: 'XPath ci text == "show more"', el: vis.xPath[0] }) ||
        null;

      const row = {
        pass: passLabel,
        strict: strict.length,   strictVis: vis.strict.length,
        loose1: loose1.length,   loose1Vis: vis.loose1.length,
        loose2: loose2.length,   loose2Vis: vis.loose2.length,
        textBtn: byTextBtn.length, textBtnVis: vis.textBtn.length,
        roleBtn: byRoleBtn.length, roleBtnVis: vis.roleBtn.length,
        xPath: byXPath.length,   xPathVis: vis.xPath.length,
        found: !!winner
      };
      console.table([row]);

      if (winner) {
        console.log(`[ShowMoreWarmup] ${passLabel} winner method=${winner.method} selector=${winner.selector}`);
        const html = (winner.el.outerHTML || '').slice(0, 400);
        console.log('[ShowMoreWarmup] winner outerHTML:', html);
      } else {
        console.log(`[ShowMoreWarmup] ${passLabel} no candidate`);
      }

      return winner ? winner.el : null;
    }

    const t0 = performance.now();
    const btn1 = snapshot('immediate');
    if (btn1) {
      console.log(`[ShowMoreWarmup] Found immediately @ ${Math.round(performance.now()-t0)}ms`);
      return btn1;
    }

    await sleepLocal(waitMs);

    const btn2 = snapshot(`+${waitMs}ms`);
    if (btn2) {
      console.log(`[ShowMoreWarmup] Found after warmup @ ${Math.round(performance.now()-t0)}ms`);
      return btn2;
    }

    console.log('[ShowMoreWarmup] Not found after warmup.');
    return null;
  }

  // ===== SHOW MORE LOOP (poll up to 30s each tick) =====
  async function startShowMoreLoop() {
    let attempts = 0;
    let stalled = 0;
    let lastCount = countRevealIcons();

    if (showMoreTimer) clearInterval(showMoreTimer);

    // Warmup info (optional; keeps logging for your diagnosis)
    console.log('[ShowMoreLoop] Warmup check...');
    await warmupFindShowMore(500);

    let tickBusy = false;

    showMoreTimer = setInterval(async () => {
      if (tickBusy) { console.log('[ShowMoreLoop] Tick skipped (busy).'); return; }
      tickBusy = true;
      attempts++;

      const start = Date.now();
      let found = null;
      while ((Date.now() - start) < SHOW_MORE_APPEAR_TIMEOUT_MS) {
        const { btn, method, counts } = findVisibleShowMoreButtonVerbose();
        if (btn) {
          found = { btn, method, counts };
          console.log(`[ShowMoreLoop] Found button after ${Date.now() - start}ms via ${method}.`, counts);
          break;
        }
        console.log(`[ShowMoreLoop] Button not present yet (${Date.now() - start}ms)… polling again in ${SHOW_MORE_APPEAR_POLL_MS}ms.`);
        await sleep(SHOW_MORE_APPEAR_POLL_MS);
      }

      if (!found) {
        console.log(`[ShowMoreLoop] No button after waiting ${SHOW_MORE_APPEAR_TIMEOUT_MS}ms. Stopping.`);
        clearInterval(showMoreTimer);
        tickBusy = false;
        return;
      }

      const { btn, method } = found;
      console.log(`[ShowMoreLoop] Using method=${method}. Clicking.`);
      try {
        const ok = await clickNode(btn);
        console.log(`[ShowMoreLoop] click #${attempts}: ${ok ? 'OK' : 'blocked'}`);
      } catch (e) {
        console.error('[ShowMoreLoop] click error:', e);
      }

      const newCount = countRevealIcons();
      if (newCount > lastCount) {
        stalled = 0;
        lastCount = newCount;
        console.log(`[ShowMoreLoop] icons grew: ${newCount}`);
      } else {
        stalled++;
        console.log(`[ShowMoreLoop] no growth (${stalled}/${STALLED_LIMIT})`);
        if (stalled >= STALLED_LIMIT) {
          console.log('[ShowMoreLoop] Stalled 3×. Stopping.');
          clearInterval(showMoreTimer);
          tickBusy = false;
          return;
        }
      }

      if (attempts >= SHOW_MORE_LIMIT) {
        console.log('[ShowMoreLoop] Reached attempt limit. Stopping.');
        clearInterval(showMoreTimer);
        tickBusy = false;
        return;
      }

      tickBusy = false;
    }, SHOW_MORE_INTERVAL);

    console.log('[ShowMoreLoop] Started (1s interval).');
  }

  // =========================
  // STORAGE (Promise style) + DEFAULT SEED + VALIDATION
  // =========================
  function isPlainObject(x) {
    return x && typeof x === 'object' && !Array.isArray(x);
  }

  async function ensureDefaultsInStorage() {
    // keys
    let rawKeys = await GM.getValue('keys', null);
    L.info('[init] storage.keys (raw):', rawKeys);
    if (!isPlainObject(rawKeys)) {
      await GM.setValue('keys', DEFAULT_KEYS);
      L.info('[init] storage.keys: created defaults');
    } else {
      L.info('[init] storage.keys: ok');
    }

    // autoShowMoreEnabled
    let rawAuto = await GM.getValue('autoShowMoreEnabled', null);
    L.info('[init] storage.autoShowMoreEnabled (raw):', rawAuto);
    if (typeof rawAuto !== 'boolean') {
      await GM.setValue('autoShowMoreEnabled', DEFAULT_AUTO);
      L.info('[init] storage.autoShowMoreEnabled: created default');
    } else {
      L.info('[init] storage.autoShowMoreEnabled: ok');
    }
  }

  async function readValidatedConfig() {
    const storedKeys = await GM.getValue('keys', DEFAULT_KEYS);
    const storedAuto = await GM.getValue('autoShowMoreEnabled', DEFAULT_AUTO);

    const trigParsed = parseKeybinding(storedKeys?.trigger);
    const togParsed  = parseKeybinding(storedKeys?.toggleAuto);

    let runtimeKeys, usedDefaults = false;
    if (trigParsed && togParsed) {
      runtimeKeys = { trigger: storedKeys.trigger, toggleAuto: storedKeys.toggleAuto };
      L.info('[init] keys OK:', runtimeKeys);
    } else {
      runtimeKeys = { ...DEFAULT_KEYS };
      usedDefaults = true;
      L.info('[init] INVALID keys in storage → using safe defaults this session; fix in TM Storage tab');
    }

    const runtimeAuto = (typeof storedAuto === 'boolean') ? storedAuto : false;
    L.info('[init] autoShowMoreEnabled (validated):', runtimeAuto);

    return { runtimeKeys, runtimeAuto, usedDefaults };
  }

  // Optional console API (page-visible) for power users
  (function exposeConsoleAPI() {
    const api = Object.freeze({
      getKeys: () => GM.getValue('keys', DEFAULT_KEYS),
      setKeys: async (obj) => {
        const current = await GM.getValue('keys', DEFAULT_KEYS);
        const next = { ...current, ...obj };
        const trig = parseKeybinding(next.trigger);
        if (!trig) return;
        const tog  = parseKeybinding(next.toggleAuto);
        if (!tog) return;
        await GM.setValue('keys', { trigger: next.trigger, toggleAuto: next.toggleAuto });
        L.info('Saved keys for future loads:', next);
        toast('Saved keybindings. Takes effect on next load.');
      },
      getAutoShowMore: () => GM.getValue('autoShowMoreEnabled', DEFAULT_AUTO),
      setAutoShowMore: async (v) => { await GM.setValue('autoShowMoreEnabled', !!v); L.info('Saved autoShowMoreEnabled (future loads):', !!v); }
    });

    try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow) {
      Object.defineProperty(unsafeWindow, '__throneRevealerCfg_6b1d7d2f__', {
        value: api, writable: false, configurable: false, enumerable: false
      });
      L.info('Console API on unsafeWindow.__throneRevealerCfg_6b1d7d2f__');
    }} catch (e) { L.warn('Expose on unsafeWindow failed:', e); }

    try {
      window.__throneRevealerCfg_6b1d7d2f__ = api;
      L.info('Console API on window.__throneRevealerCfg_6b1d7d2f__ (sandbox)');
    } catch (e) { L.warn('Expose on window failed:', e); }
  })();

  // =========================
  // KEYDOWN HANDLER
  // =========================
  function isEditableTarget(t) {
    return (
      t &&
      (t.isContentEditable ||
       t.tagName === 'INPUT' ||
       t.tagName === 'TEXTAREA' ||
       t.tagName === 'SELECT')
    );
  }

(function boot() {
  const apply = () => {
    if (isGiftersPath()) mountOnGifters();
    else                 unmountFromGifters();
  };
  apply(); // initial
  Route.onChange(apply); // SPA transitions
})();

})();