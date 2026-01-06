// ==UserScript==
// @name                Weaver Patch - Fix out-of-range daily puzzle index
// @name:zh-CN          Weaver 补丁——修复每日谜题索引越界问题
// @name:zh-TW          Weaver 補丁——修復每日謎題索引越界問題
// @name:ja             Weaver パッチ——日替わりパズルのインデックス範囲外問題を修正
// @namespace           http://tampermonkey.net/
// @version             2026-01-06.3
// @description         Unofficial userscript patch: fixes Weaver crash caused by hardcoded modulo (e.g. %19040) going out of range.
// @description:zh-CN   非官方用户脚本：修复 Weaver 因写死取模（如 %19040）导致题库索引越界崩溃白屏的问题。
// @description:zh-TW   非官方使用者腳本：修復 Weaver 因寫死取模（如 %19040）導致題庫索引越界而當機白屏的問題。
// @description:ja      非公式ユーザースクリプト：ハードコードされた剰余（例：%19040）が範囲外となり、Weaver がクラッシュして白画面になる問題を修正します。
// @author              KARPED1EM
// @license             MIT
// @match               https://weavergame.org/*
// @run-at              document-start
// @grant               GM_xmlhttpRequest
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               unsafeWindow
// @connect             weavergame.org
// @downloadURL https://update.greasyfork.org/scripts/561587/Weaver%20Patch%20-%20Fix%20out-of-range%20daily%20puzzle%20index.user.js
// @updateURL https://update.greasyfork.org/scripts/561587/Weaver%20Patch%20-%20Fix%20out-of-range%20daily%20puzzle%20index.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PLUGIN_NAME = 'Weaver Patch';
  const PLUGIN_VERSION = '2026-01-06.3';
  const PLUGIN_ORIGIN = 'Community Tampermonkey userscript (unofficial).';

  const EXPECTED_WEAVER_VERSION = '6.5';

  const SUPPRESS_KEY = 'weaver_patch_suppress_versions_v1';

  // Status line dismissal: hide for this session.
  const STATUS_HIDE_SESSION_KEY = 'weaver_patch_hide_status_this_session_v1';

  const SCRIPT_PATH_RE = /\/weaver\.js$/i;

  let noticeShown = false;
  let statusEl = null;

  function detectTheme() {
    // The site uses <body class="dark"> for dark mode.
    // If body not ready, default to light (safer for readability on blank white page).
    try {
      if (document.body && document.body.classList && document.body.classList.contains('dark')) return 'dark';
    } catch {}
    return 'light';
  }

  function applyThemeToStatusLine() {
    if (!statusEl) return;

    const theme = detectTheme();
    if (theme === 'dark') {
      statusEl.style.color = 'rgba(255,255,255,0.65)';
      statusEl.style.background = 'rgba(0,0,0,0.22)';
      statusEl.style.border = '1px solid rgba(255,255,255,0.10)';
      if (statusEl._closeBtn) {
        statusEl._closeBtn.style.color = 'rgba(255,255,255,0.75)';
        statusEl._closeBtn.style.border = '1px solid rgba(255,255,255,0.12)';
      }
    } else {
      statusEl.style.color = 'rgba(0,0,0,0.70)';
      statusEl.style.background = 'rgba(255,255,255,0.92)';
      statusEl.style.border = '1px solid rgba(0,0,0,0.12)';
      if (statusEl._closeBtn) {
        statusEl._closeBtn.style.color = 'rgba(0,0,0,0.65)';
        statusEl._closeBtn.style.border = '1px solid rgba(0,0,0,0.14)';
      }
    }
  }

  function observeThemeChanges(onChange) {
    // Body might not exist at document-start, so we attach later.
    const attach = () => {
      if (!document.body) return false;
      const bodyObs = new MutationObserver(() => onChange());
      bodyObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      onChange();
      return true;
    };

    if (attach()) return;

    const docObs = new MutationObserver(() => {
      if (attach()) docObs.disconnect();
    });

    docObs.observe(document.documentElement, { childList: true, subtree: true });
  }

  function parseWeaverVersionFromUrl(url) {
    try {
      const u = new URL(url, location.href);
      const vParam = u.searchParams.get('v');
      if (vParam) return String(vParam).trim();
      const m = (u.search || '').match(/v(\d+(?:\.\d+)+)/i);
      if (m && m[1]) return m[1];
      return 'unknown';
    } catch {
      return 'unknown';
    }
  }

  function getSuppressedVersions() {
    try {
      const raw = GM_getValue(SUPPRESS_KEY, '[]');
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return new Set();
      return new Set(arr.map(String));
    } catch {
      return new Set();
    }
  }

  function setSuppressedVersions(set) {
    try { GM_setValue(SUPPRESS_KEY, JSON.stringify(Array.from(set))); } catch { /* ignore */ }
  }

  function shouldShowVersionNotice(currentWeaverVersion) {
    if (noticeShown) return false;
    if (!currentWeaverVersion || currentWeaverVersion === 'unknown') return false;
    if (currentWeaverVersion === EXPECTED_WEAVER_VERSION) return false;

    const suppressed = getSuppressedVersions();
    if (suppressed.has(currentWeaverVersion)) return false;

    return true;
  }

  function applyThemeToModal(overlay, box, btnPrimary, btnSecondary) {
    const theme = detectTheme();

    if (theme === 'dark') {
      overlay.style.background = 'rgba(0,0,0,0.55)';
      box.style.background = '#111';
      box.style.color = '#eee';
      box.style.border = '1px solid rgba(255,255,255,0.12)';

      btnSecondary.style.color = '#eee';
      btnSecondary.style.border = '1px solid rgba(255,255,255,0.18)';
      btnSecondary.style.background = 'transparent';
    } else {
      overlay.style.background = 'rgba(0,0,0,0.35)';
      box.style.background = '#fff';
      box.style.color = '#111';
      box.style.border = '1px solid rgba(0,0,0,0.12)';

      btnSecondary.style.color = '#111';
      btnSecondary.style.border = '1px solid rgba(0,0,0,0.18)';
      btnSecondary.style.background = 'transparent';
    }

    // Primary button looks fine on both; keep but slightly adjust border for light theme
    btnPrimary.style.border = '1px solid rgba(255,255,255,0.18)';
  }

  function createModal({ title, bodyLines, primaryText, secondaryText, onPrimary, onSecondary }) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '2147483647';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '16px';

    const box = document.createElement('div');
    box.style.width = 'min(720px, 100%)';
    box.style.borderRadius = '10px';
    box.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
    box.style.padding = '16px';
    box.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    box.style.lineHeight = '1.5';

    const h = document.createElement('div');
    h.textContent = title;
    h.style.fontSize = '16px';
    h.style.fontWeight = '600';
    h.style.marginBottom = '10px';
    box.appendChild(h);

    const body = document.createElement('div');
    body.style.fontSize = '13px';
    body.style.opacity = '0.95';
    body.style.marginBottom = '14px';

    for (const line of bodyLines) {
      const p = document.createElement('div');
      p.textContent = line;
      p.style.margin = '6px 0';
      body.appendChild(p);
    }
    box.appendChild(body);

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '10px';
    btnRow.style.justifyContent = 'flex-end';

    const btnPrimary = document.createElement('button');
    btnPrimary.type = 'button';
    btnPrimary.textContent = primaryText;
    btnPrimary.style.background = '#1f6feb';
    btnPrimary.style.color = '#fff';
    btnPrimary.style.borderRadius = '8px';
    btnPrimary.style.padding = '8px 12px';
    btnPrimary.style.cursor = 'pointer';
    btnPrimary.style.fontSize = '13px';

    const btnSecondary = document.createElement('button');
    btnSecondary.type = 'button';
    btnSecondary.textContent = secondaryText;
    btnSecondary.style.borderRadius = '8px';
    btnSecondary.style.padding = '8px 12px';
    btnSecondary.style.cursor = 'pointer';
    btnSecondary.style.fontSize = '13px';

    btnPrimary.addEventListener('click', () => { try { onPrimary(); } finally { overlay.remove(); } });
    btnSecondary.addEventListener('click', () => { try { onSecondary(); } finally { overlay.remove(); } });

    btnRow.appendChild(btnSecondary);
    btnRow.appendChild(btnPrimary);
    box.appendChild(btnRow);

    overlay.appendChild(box);
    document.documentElement.appendChild(overlay);

    // Apply theme now, and keep synced if theme toggles while modal is open.
    applyThemeToModal(overlay, box, btnPrimary, btnSecondary);
    observeThemeChanges(() => applyThemeToModal(overlay, box, btnPrimary, btnSecondary));
  }

  function maybeShowVersionNotice(currentWeaverVersion) {
    if (!shouldShowVersionNotice(currentWeaverVersion)) return;
    noticeShown = true;

    const title = 'Weaver update detected / 检测到 Weaver 已更新';
    const bodyLines = [
      `Current Weaver.js version: ${currentWeaverVersion} (expected: ${EXPECTED_WEAVER_VERSION}) / 当前 Weaver.js 版本：${currentWeaverVersion}（预期：${EXPECTED_WEAVER_VERSION}）`,
      `If Weaver official has fixed the issue, please disable/uninstall this userscript. / 如果官方已经修复问题，请禁用或卸载本插件。`,
      `Plugin: ${PLUGIN_NAME} / 插件：${PLUGIN_NAME}`,
      `Plugin version: ${PLUGIN_VERSION} / 插件版本：${PLUGIN_VERSION}`,
      `Origin: ${PLUGIN_ORIGIN} / 来源：${PLUGIN_ORIGIN}`,
      `What it does: patches hardcoded modulo (%19040 → %B.length) to prevent out-of-range daily puzzle index crash. / 作用：把写死的取模（%19040 → %B.length）改为动态长度，避免每日题目索引越界导致白屏崩溃。`,
    ];

    createModal({
      title,
      bodyLines,
      primaryText: 'Don’t remind again (this version) / 此版本不再提示',
      secondaryText: 'Ignore / 忽略',
      onPrimary: () => {
        const suppressed = getSuppressedVersions();
        suppressed.add(String(currentWeaverVersion));
        setSuppressedVersions(suppressed);
      },
      onSecondary: () => {}
    });
  }

  function isStatusHiddenThisSession() {
    try { return sessionStorage.getItem(STATUS_HIDE_SESSION_KEY) === '1'; } catch { return false; }
  }

  function hideStatusForThisSession() {
    try { sessionStorage.setItem(STATUS_HIDE_SESSION_KEY, '1'); } catch {}
    if (statusEl) statusEl.remove();
    statusEl = null;
  }

  function ensureStatusLine() {
    if (statusEl) return statusEl;
    if (isStatusHiddenThisSession()) return null;

    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = '10px';
    el.style.bottom = '10px';
    el.style.zIndex = '2147483646';
    el.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    el.style.fontSize = '11px';
    el.style.borderRadius = '8px';
    el.style.padding = '5px 8px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.gap = '8px';
    el.style.maxWidth = 'min(520px, calc(100% - 20px))';

    const text = document.createElement('span');
    text.textContent = 'Weaver Patch: init / 初始化';
    text.style.whiteSpace = 'nowrap';
    text.style.overflow = 'hidden';
    text.style.textOverflow = 'ellipsis';

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.title = 'Hide for this session / 本次不再显示';
    close.style.cursor = 'pointer';
    close.style.borderRadius = '6px';
    close.style.width = '22px';
    close.style.height = '20px';
    close.style.lineHeight = '18px';
    close.style.padding = '0';
    close.style.fontSize = '14px';
    close.style.background = 'transparent';

    close.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideStatusForThisSession();
    });

    el.appendChild(text);
    el.appendChild(close);

    // Don't block the page; only close button is clickable.
    el.style.pointerEvents = 'none';
    close.style.pointerEvents = 'auto';

    document.documentElement.appendChild(el);

    statusEl = el;
    statusEl._textNode = text;
    statusEl._closeBtn = close;

    applyThemeToStatusLine();
    observeThemeChanges(applyThemeToStatusLine);

    return statusEl;
  }

  function setStatusLine(text) {
    const el = ensureStatusLine();
    if (!el) return;
    if (el._textNode) el._textNode.textContent = text;
  }

  function patchSource(srcText) {
    // Replace hardcoded modulo "%19040" with "%B.length"
    return srcText.replaceAll('%19040', '%B.length');
  }

  function injectPatchedCode(code) {
    return new Promise((resolve, reject) => {
      // Strategy 1: Blob URL
      try {
        const blob = new Blob([code], { type: 'text/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        const s = document.createElement('script');
        s.src = blobUrl;
        s.onload = () => {
          try { URL.revokeObjectURL(blobUrl); } catch {}
          resolve('blob');
        };
        s.onerror = () => {
          try { URL.revokeObjectURL(blobUrl); } catch {}

          // Strategy 2: inline
          try {
            const s2 = document.createElement('script');
            s2.textContent = code;
            document.documentElement.appendChild(s2);
            resolve('inline');
          } catch (e2) {
            // Strategy 3: eval
            try {
              // eslint-disable-next-line no-eval
              unsafeWindow.eval(code);
              resolve('eval');
            } catch (e3) {
              reject(e3);
            }
          }
        };
        document.documentElement.appendChild(s);
      } catch (e1) {
        // Strategy 2 fallback
        try {
          const s2 = document.createElement('script');
          s2.textContent = code;
          document.documentElement.appendChild(s2);
          resolve('inline');
        } catch (e2) {
          // Strategy 3 fallback
          try {
            // eslint-disable-next-line no-eval
            unsafeWindow.eval(code);
            resolve('eval');
          } catch (e3) {
            reject(e3);
          }
        }
      }
    });
  }

  function fetchAndPatch(url, currentWeaverVersion) {
    setStatusLine(`Weaver v${currentWeaverVersion} | Patch v${PLUGIN_VERSION}`);

    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: async (res) => {
        const original = String(res.responseText || '');
        const patched = patchSource(original);
        const changed = (original !== patched);

        try {
          const method = await injectPatchedCode(patched);
          // Keep it short.
          setStatusLine(`Weaver v${currentWeaverVersion} | Patch v${PLUGIN_VERSION} | ${changed ? 'OK' : 'N/A'}`);
          // Soft fade after a few seconds.
          setTimeout(() => {
            if (!statusEl) return;
            statusEl.style.opacity = '0.55';
          }, 6000);
        } catch (e) {
          console.error('[Weaver Patch] Injection failed:', e);
          setStatusLine(`Weaver v${currentWeaverVersion} | Patch failed / 修复失败`);
        }
      },
      onerror: (err) => {
        console.error('[Weaver Patch] Failed to fetch weaver.js:', err);
        setStatusLine('Patch: fetch failed / 拉取失败');
      }
    });
  }

  function isTargetWeaverScript(scriptEl) {
    if (!scriptEl || scriptEl.tagName !== 'SCRIPT') return false;
    if (!scriptEl.src) return false;

    try {
      const u = new URL(scriptEl.src, location.href);
      return SCRIPT_PATH_RE.test(u.pathname) || u.pathname.toLowerCase().endsWith('/weaver.js');
    } catch {
      return String(scriptEl.src).includes('/weaver.js');
    }
  }

  function blockAndPatch(scriptEl) {
    try {
      const url = scriptEl.src;
      const weaverVersion = parseWeaverVersionFromUrl(url);

      maybeShowVersionNotice(weaverVersion);

      scriptEl.type = 'javascript/blocked';
      if (scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);

      fetchAndPatch(url, weaverVersion);
      return true;
    } catch (e) {
      console.error('[Weaver Patch] blockAndPatch failed:', e);
      return false;
    }
  }

  function tryBlockExisting() {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    for (const sc of scripts) {
      if (isTargetWeaverScript(sc)) {
        return blockAndPatch(sc);
      }
    }
    return false;
  }

  // Start
  ensureStatusLine();

  if (tryBlockExisting()) return;

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!node || node.nodeType !== 1) continue;
        if (node.tagName === 'SCRIPT' && isTargetWeaverScript(node)) {
          obs.disconnect();
          blockAndPatch(node);
          return;
        }
      }
    }
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
