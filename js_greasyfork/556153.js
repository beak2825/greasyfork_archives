// ==UserScript==
// @name         Microsoft Forms: Fixed Top Nav Bar (<< < > >>) + Auto Jump to Last
// @namespace    https://userscript-tools
// @version      5.0
// @description  Adds a fixed top navigation bar with << < > >> on Microsoft Forms Survey Results pages; keeps original left-side <; auto-jumps to last on load (no URL tricks).
// @match        https://forms.office.com/pages/designpagev2.aspx*
// @match        https://*.office.com/Forms/DesignPageV2.aspx*
// @run-at       document-idle
// @grant        none
// @homepage     https://greasyfork.org/en/scripts/556153
// @downloadURL https://update.greasyfork.org/scripts/556153/Microsoft%20Forms%3A%20Fixed%20Top%20Nav%20Bar%20%28%3C%3C%20%3C%20%3E%20%3E%3E%29%20%2B%20Auto%20Jump%20to%20Last.user.js
// @updateURL https://update.greasyfork.org/scripts/556153/Microsoft%20Forms%3A%20Fixed%20Top%20Nav%20Bar%20%28%3C%3C%20%3C%20%3E%20%3E%3E%29%20%2B%20Auto%20Jump%20to%20Last.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -------- CONFIG -------
  const DEBUG = false;
  const CLICK_INTERVAL_MS = 110;       // pacing for repeated clicks
  const MAX_STEPS = 1500;              // safety cap for << and >>
  const AUTO_INIT_DELAY = 600;         // wait after mount to build UI
  const ENABLE_AUTO_JUMP_TO_LAST = true;

  // Top bar layout: 'right' | 'center' | 'left'
  const TOPBAR_ALIGN = 'center';

  // Visuals
  const TOPBAR_STYLE = {
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(0,0,0,0.15)',
    shadow: '0 2px 10px rgba(0,0,0,0.08)',
    height: 36,
    paddingX: 10,
    gap: 6,
    zIndex: 99999
  };
  // -----------------------

  const log = (...a) => { if (DEBUG) console.log('[MSForms TopBar]', ...a); };
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  function isSurveyResultsView() {
    try {
      const url = new URL(location.href);
      return (
        (url.searchParams.get('topview') || '').toLowerCase() === 'surveyresults' ||
        url.searchParams.get('analysis') === 'true'
      );
    } catch {
      return false;
    }
  }

  function findNextButton() {
    const selectors = [
      'button[title="Next"]',
      'button[aria-label="Next"]',
      'button[data-automationid="Results_Next"]',
      'div[role="button"][aria-label="Next"]',
      'button[aria-label*="Next"]',
      'div[role="button"][aria-label*="Next"]',
      'button[aria-label*="Chevron right"]',
      'button[aria-label*="Right"]',
      'button svg[data-icon-name="ChevronRight"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el.closest('button,[role="button"]') || el;
    }
    // Heuristic: rightmost control in a toolbar/pager area
    const toolbars = Array.from(document.querySelectorAll('div[role="toolbar"],div[aria-label*="results"],div[aria-label*="pager"],div[class*="pager"]'));
    for (const tb of toolbars) {
      const btns = tb.querySelectorAll('button,div[role="button"]');
      if (btns.length) return btns[btns.length - 1];
    }
    // Fallback by text/icon
    const candidates = Array.from(document.querySelectorAll('button,div[role="button"]'));
    const byText = candidates.find(el => /next|›|»|→/i.test(el.textContent || ''));
    return byText || null;
  }

  function findPrevButton() {
    const selectors = [
      'button[title="Previous"]',
      'button[aria-label="Previous"]',
      'button[data-automationid="Results_Previous"]',
      'div[role="button"][aria-label="Previous"]',
      'button[aria-label*="Previous"]',
      'div[role="button"][aria-label*="Previous"]',
      'button[aria-label*="Chevron left"]',
      'button[aria-label*="Left"]',
      'button svg[data-icon-name="ChevronLeft"]',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el.closest('button,[role="button"]') || el;
    }
    // Fallback by text/icon
    const candidates = Array.from(document.querySelectorAll('button,div[role="button"]'));
    const byText = candidates.find(el => /previous|prev|‹|«|←/i.test(el.textContent || ''));
    return byText || null;
  }

  function isDisabled(el) {
    return !el ||
           el.hasAttribute('disabled') ||
           el.getAttribute('aria-disabled') === 'true' ||
           el.classList.contains('is-disabled') ||
           el.classList.contains('disabled');
  }

  async function goToLast(nextBtn) {
    if (!nextBtn) {
      log('goToLast: next not found yet');
      return;
    }
    let steps = 0;
    while (!isDisabled(nextBtn) && steps < MAX_STEPS) {
      nextBtn.click();
      steps++;
      await sleep(CLICK_INTERVAL_MS);
      nextBtn = findNextButton();
    }
    log('goToLast: done in steps =', steps);
  }

  async function goToFirst(prevBtn) {
    if (!prevBtn) {
      log('goToFirst: prev not found yet');
      return;
    }
    let steps = 0;
    while (!isDisabled(prevBtn) && steps < MAX_STEPS) {
      prevBtn.click();
      steps++;
      await sleep(CLICK_INTERVAL_MS);
      prevBtn = findPrevButton();
    }
    log('goToFirst: done in steps =', steps);
  }

  // Build a fixed top bar with nav controls
  function buildTopBar() {
    if (!isSurveyResultsView()) return;

    const nextBtn = findNextButton();
    // We can still render the bar even if next isn’t found yet; buttons will sync state
    const barId = 'msforms-fixed-topbar';
    if (document.getElementById(barId)) return; // avoid duplicates

    const bar = document.createElement('div');
    bar.id = barId;
    bar.style.position = 'fixed';
    bar.style.top = '8px';
    // Align
    if (TOPBAR_ALIGN === 'left') {
      bar.style.left = '12px';
      bar.style.right = 'auto';
      bar.style.transform = 'none';
    } else if (TOPBAR_ALIGN === 'center') {
      bar.style.left = '50%';
      bar.style.transform = 'translateX(-50%)';
    } else {
      // right
      bar.style.right = '12px';
      bar.style.left = 'auto';
      bar.style.transform = 'none';
    }
    bar.style.display = 'inline-flex';
    bar.style.alignItems = 'center';
    bar.style.gap = `${TOPBAR_STYLE.gap}px`;
    bar.style.height = `${TOPBAR_STYLE.height}px`;
    bar.style.padding = `0 ${TOPBAR_STYLE.paddingX}px`;
    bar.style.background = TOPBAR_STYLE.background;
    bar.style.border = TOPBAR_STYLE.border;
    bar.style.boxShadow = TOPBAR_STYLE.shadow;
    bar.style.borderRadius = '8px';
    bar.style.zIndex = String(TOPBAR_STYLE.zIndex);
    bar.style.backdropFilter = 'saturate(180%) blur(8px)';

    function makeBtn(label, title) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.title = title;
      b.style.padding = '4px 10px';
      b.style.lineHeight = '1';
      b.style.height = '28px';
      b.style.minWidth = '36px';
      b.style.borderRadius = '6px';
      b.style.border = '1px solid rgba(0,0,0,0.2)';
      b.style.background = 'white';
      b.style.cursor = 'pointer';
      b.style.fontSize = '13px';
      b.style.fontWeight = '600';
      b.style.userSelect = 'none';
      b.style.transition = 'background 120ms ease';
      b.onmouseenter = () => b.style.background = '#f3f2f1';
      b.onmouseleave = () => b.style.background = 'white';
      return b;
    }

    const btnFirst = makeBtn('<<', 'First response');
    const btnPrev  = makeBtn('<',  'Previous response');
    const btnNext  = makeBtn('>',  'Next response');
    const btnLast  = makeBtn('>>', 'Last response');

    // Wire handlers
    btnPrev.addEventListener('click', () => {
      const p = findPrevButton();
      if (p && !isDisabled(p)) p.click();
    });
    btnNext.addEventListener('click', () => {
      const n = findNextButton();
      if (n && !isDisabled(n)) n.click();
    });
    btnFirst.addEventListener('click', async () => {
      await goToFirst(findPrevButton());
    });
    btnLast.addEventListener('click', async () => {
      await goToLast(findNextButton());
    });

    bar.appendChild(btnFirst);
    bar.appendChild(btnPrev);
    bar.appendChild(btnNext);
    bar.appendChild(btnLast);

    document.body.appendChild(bar);

    // Keep enabled/disabled state in sync with native buttons
    const syncState = () => {
      const p = findPrevButton();
      const n = findNextButton();
      const prevDisabled = !p || isDisabled(p);
      const nextDisabled = !n || isDisabled(n);

      btnFirst.disabled = prevDisabled;
      btnPrev.disabled  = prevDisabled;
      btnLast.disabled  = nextDisabled;
      btnNext.disabled  = nextDisabled;

      [btnFirst, btnPrev, btnNext, btnLast].forEach(b => {
        b.style.opacity = b.disabled ? '0.5' : '1';
        b.style.cursor  = b.disabled ? 'default' : 'pointer';
      });
    };

    syncState();
    const int = setInterval(syncState, 300);

    // Clean up interval if bar is removed
    const observer = new MutationObserver(() => {
      if (!document.body.contains(bar)) {
        clearInterval(int);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    log('Fixed top bar injected.');
  }

  // Auto-jump controller (per Results view mount)
  let autoJumpedForThisView = false;

  async function maybeAutoJumpToLast() {
    if (!ENABLE_AUTO_JUMP_TO_LAST) return;
    if (!isSurveyResultsView()) { autoJumpedForThisView = false; return; }
    if (autoJumpedForThisView) return;

    await sleep(AUTO_INIT_DELAY);
    const nextBtn = findNextButton();
    if (nextBtn && !isDisabled(nextBtn)) {
      await goToLast(nextBtn);
    }
    autoJumpedForThisView = true;
  }

  function installObserver() {
    const tryRun = () => {
      if (!isSurveyResultsView()) { autoJumpedForThisView = false; return; }
      // Build bar and then maybe auto-jump
      setTimeout(() => {
        buildTopBar();
        maybeAutoJumpToLast();
      }, AUTO_INIT_DELAY);
    };

    // Observe SPA mounts/changes
    const obs = new MutationObserver(() => tryRun());
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // Initial load
    window.addEventListener('load', () => setTimeout(tryRun, AUTO_INIT_DELAY));

    // SPA routing hooks
    const _push = history.pushState;
    history.pushState = function () {
      _push.apply(this, arguments);
      setTimeout(tryRun, 200);
    };
    window.addEventListener('popstate', () => setTimeout(tryRun, 200));
  }

  (function init() {
    installObserver();
  })();
})();