// ==UserScript==
// @name         EasyFlag
// @license      Amazon
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Ultra-clean ticket generator: Issue + API Key + Locale → AI ticket. Auto owner. Saved key.
// @author       You
// @match        https://www.amazon.fr/*
// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.de/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.nl/*
// @match        https://*.amazon.se/*
// @match        https://*.amazon.pl/*
// @match        https://*.amazon.ie/*
// @match        https://*.amazon.com.tr/*
// @match        https://*.amazon.com.be/*
// @match        https://console.harmony.a2z.com/content-symphony/EU/placements/*
// @match        https://sim.amazon.com/issues/create?assignedFolder=e3306293-dbb4-498d-9ea5-63d093bb5477&descriptionContentType=text%2Fplain&extensions%5Btt%5D%5Bcategory%5D=&customFields%5Bstring%5D%5B0%5D%5Bid%5D=marketplace&customFields%5Bstring%5D%5B0%5D%5Bvalue%5D=*
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      bedrock-runtime.us-east-1.amazonaws.com
// @require      https://cdn.jsdelivr.net/npm/mustache@4.2.0/mustache.min.js
// @icon         https://i.im.ge/2025/10/31/nzMP7c.Untitled-design.png
// @downloadURL https://update.greasyfork.org/scripts/555644/EasyFlag.user.js
// @updateURL https://update.greasyfork.org/scripts/555644/EasyFlag.meta.js
// ==/UserScript==

//Code for FLAG buttons on the Homepage .fr
// Detect any Amazon marketplace (e.g. amazon.fr, amazon.de, amazon.co.uk, etc.)
if (/^https:\/\/(www\.)?amazon\.[a-z.]+\/?/i.test(window.location.href)) {


(function () {
  // ---- Flag SVG (inline, no external request) ----
  const FLAG_SVG = `<img src="https://cdn-icons-png.flaticon.com/512/8373/8373429.png" style="width:100%;height:100%;object-fit:contain;">`;
  const STORAGE_KEY = 'ftc_links_visible';
  const DEFAULT_VISIBLE = true;

  // ---- State & utils ----
  const processed = new WeakSet(); // mark creatives we've handled
  const isMobile = document.documentElement.classList.contains('a-mobile');

  const getVisible = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === null ? DEFAULT_VISIBLE : raw === 'true';
  };
  const setVisible = (val) => localStorage.setItem(STORAGE_KEY, val ? 'true' : 'false');

  function detectRegion() {
    return 'EU';
  }
  const region = detectRegion();
  const csUrl = (pid) => `https://console.harmony.a2z.com/content-symphony/${region}/placements/${pid}/redirectToCreative`;

  function getPlacementId(el, platform) {
    if (platform === 'd' || platform === 'h') return el?.dataset?.pf_rd_p || null;
    if (platform === 'm') {
      const raw = el?.getAttribute('data-csa-c-content-id');
      if (!raw) return null;
      const cut = raw.startsWith('amzn1.sym.') ? raw.slice(10) : raw;
      return cut.split(':')[0].slice(0, 36);
    }
    return null;
  }

  // ---- Styles (use a root toggle class instead of mass inline styles) ----
  const style = document.createElement('style');
  style.textContent = `
    .gw-col, .celwidget { position: relative; }
    .creativeLinkWrapper { position: absolute; top: 0; z-index: 99999; }
    .gw-col .creativeLinkWrapper, .celwidget .creativeLinkWrapper { left: 1px; top: 1px; }
    .gw-col .creativeLinkWrapper { left: 12px; }
    .creativeLinkWrapper a {
  width: 24px !important;
  height: 24px !important;
  padding: 0 !important;
  background:rgba(250, 250, 250, 0.6);
  border-radius: 50%;
  display: flex !important;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,.3);
  transition: all .2s ease;
}
    .creativeLinkWrapper a:hover {
  background: #ff8800;
  box-shadow: 0 4px 12px rgba(0,0,0,.4);
}
    .creativeLinkWrapper a svg {
  width: 20px;
  height: 20px;
}
    #mobile-hero-order .a-carousel .a-carousel-card:first-of-type .creativeLinkWrapper { z-index: 1000000; }
    #gw-desktop-herotator .creativeLinkWrapper { left: 90px; }
    #mobile-hero-order .creativeLinkWrapper { left: 0; }

    /* Hide invalid links */
    a[href="https://console.harmony.a2z.com/content-symphony/NA/placements/undefined/redirectToCreative"],
    a[href="https://console.harmony.a2z.com/content-symphony/NA/placements/null/redirectToCreative"] { display: none; }

    /* Global visibility via root class */
    .ftc-hidden .creativeLinkWrapper { visibility: hidden !important; }

/* Floating toggle button — sticks to viewport */
#ftc-toggle {
  position: fixed;
  right: calc(env(safe-area-inset-right, 0px) + 16px);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: rgba(255,255,255,0.9);
  box-shadow: 0 2px 6px rgba(0,0,0,.3);
  transition: filter .2s ease, box-shadow .2s ease, transform .2s ease;
  z-index: 2147483647; /* over site UI */
  font-size: 12px; /* in case you add text later */
}

#ftc-toggle::before {
  content: "";
  display: block;
  width: 28px;
  height: 28px;
  background-image: url("https://cdn-icons-png.flaticon.com/512/8373/8373429.png"); /* swap to approved CDN if needed */
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

#ftc-toggle:hover {
  filter: brightness(0.95);
  box-shadow: 0 4px 12px rgba(0,0,0,.4);
  transform: translateY(-1px);
}

/* Optional: nudge on small screens */
@media (max-width: 480px) {
  #ftc-toggle {
    right: calc(env(safe-area-inset-right, 0px) + 12px);
    bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
    width: 44px;
    height: 44px;
  }
}


  `;
  document.head.appendChild(style);

  // ---- UI toggle ----
  function updateToggleLabel() {
    const btn = document.getElementById('ftc-toggle');
    if (btn) btn.innerHTML = getVisible() ? '<img src="https://i.im.ge/2025/10/31/nzMP7c.Untitled-design.png" style="width:100%;height:100%;object-fit:contain;">': '<img src="https://i.im.ge/2025/11/03/nHH8Ca.Hidden.png" style="width:100%;height:100%;object-fit:contain;">';
  }
  function applyVisibility() {
    const show = getVisible();
    document.documentElement.classList.toggle('ftc-hidden', !show);
    updateToggleLabel();
  }
  function mountToggleButton() {
     if (document.getElementById('ftc-toggle')) return;
     const btn = document.createElement('button');
     btn.id = 'ftc-toggle';
     btn.type = 'button';

     const img = document.createElement('img');
     img.alt = 'Toggle CS links';
     img.src = 'https://cdn-icons-png.flaticon.com/512/8373/8373429.png'; // move to approved CDN if needed
     img.style.width = '28px'; img.style.height = '28px';
     btn.appendChild(img);
     btn.addEventListener('click', () => {
       setVisible(!getVisible());
       applyVisibility();
     });
     document.body.appendChild(btn);
    // optional: keep text for a11y titles instead of visible label
    btn.title = getVisible() ? 'Hide links (Alt+L)' : 'Show links (Alt+L)';
   }
  function onKeydown(e) {
    if (e.altKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      setVisible(!getVisible());
      applyVisibility();
    }
  }

  // ---- Idempotent injection ----
  function ensureLink(el, pid, key) {
    if (processed.has(el)) return;
    if (!pid) return;
    if (!el.querySelector('.creativeLinkWrapper')) {
      const wrap = document.createElement('div');
      wrap.className = 'creativeLinkWrapper';
      wrap.dataset.linkNumber = key;
      const a = document.createElement('a');
a.href = csUrl(pid);
a.target = '_blank';
a.title = 'Open creative in Content Symphony';
a.innerHTML = FLAG_SVG;
wrap.appendChild(a);
      el.prepend(wrap);
    }
    processed.add(el);
  }

  function scanOnce() {
    // Heroes (desktop)
    const heroes = document.getElementsByClassName('gw-ftGr-desktop-hero');
    for (let i = 0; i < heroes.length; i++) {
      ensureLink(heroes[i], getPlacementId(heroes[i], 'h'), 'hLink' + i);
    }
    if (isMobile) {
      const mobile = document.getElementsByClassName('celwidget');
      for (let i = 0; i < mobile.length; i++) {
        ensureLink(mobile[i], getPlacementId(mobile[i], 'm'), 'mLink' + i);
      }
    } else {
      const desktop = document.getElementsByClassName('gw-col');
      for (let i = 0; i < desktop.length; i++) {
        ensureLink(desktop[i], getPlacementId(desktop[i], 'd'), 'dLink' + i);
      }
    }
  }

  // ---- Debounced scheduler for scans ----
  let scanScheduled = false;
  function scheduleScan() {
    if (scanScheduled) return;
    scanScheduled = true;
    // rAF + timeout to batch DOM churn across frames
    requestAnimationFrame(() => {
      setTimeout(() => {
        scanOnce();
        applyVisibility();
        scanScheduled = false;
      }, 120);
    });
  }

  // ---- MutationObserver (debounced) ----
  const mo = new MutationObserver((mutations) => {
    // Only react to added nodes; ignore attribute noise
    for (const m of mutations) {
      if (m.type === 'childList' && (m.addedNodes?.length || 0) > 0) {
        scheduleScan();
        break;
      }
    }
  });

  // ---- Boot ----
  function boot() {
    mountToggleButton();
    applyVisibility();
    scheduleScan(); // initial pass

    // Events (debounced)
    window.addEventListener('scroll', scheduleScan, { passive: true });
    window.addEventListener('keydown', onKeydown, false);

    // Observe body for lazy injected creatives
    mo.observe(document.body, { childList: true, subtree: true });

    // Some mobile decks
    const deck = document.getElementById('gwm-Deck-cf');
    if (deck) deck.addEventListener('touchmove', scheduleScan, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
}

//Code for Symphony Widget
if (window.location.href.startsWith("https://console.harmony.a2z.com/content-symphony/")) {
(function () {
  'use strict';

  // ==================== CONFIG ====================
  const MODEL_ID = 'global.anthropic.claude-opus-4-5-20251101-v1:0';
  const REGION = 'us-east-1';
  const CAMPAIGN_LINK = window.location.href;
  const STORAGE = {
  key: 'sim3_api_key',
  locale: 'sim3_locale',
  promptMode: 'sim3_prompt_mode',
  customPrompt: 'sim3_custom_prompt'
};

  const LOCALES = [
    { value: 'FR', label: 'France' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'DE', label: 'Germany' },
    { value: 'ES', label: 'Spain' },
    { value: 'IT', label: 'Italy' },
    { value: 'SE', label: 'Sweden' },
    { value: 'PL', label: 'Poland' },
    { value: 'TR', label: 'Turkey' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'BE', label: 'Belgium' },
    { value: 'IE', label: 'Ireland' },
  ];

  const DEFAULT_LOCALE = 'FR';
  const XPATH_OWNER = `//input[@placeholder='Enter creative owner']/@value |
                       //input[contains(@placeholder,'owner')]/@value |
                       //input[contains(@id,'formField37')]/@value`;

  const XPATH_BG = `//div[contains(@class,'awsui-select-trigger') and contains(@aria-labelledby,'textbox')]/div/span/span[contains(@class,'awsui-select-trigger-label') and text()='HP-HomepageTeam']/../.. |
                    //span[contains(@class,'awsui-select-trigger-label') and text()='HP-HomepageTeam']/text() |
                    //span[@class='awsui-select-trigger-label' and text()='HP-HomepageTeam']/text()`;


  const PROMPT_TEMPLATE = [
    '=> Here is my inputs: Campaign link: {{campaignLink}} Owner: @{{ownerName}} Issue I want to flag: {{issue}} Locale: {{locale}} Business Group: {{BusinessGroup}}',
    '1) QUIET - DO NOT DISPLAY: Find the issue category from this list that match the most the issue: Duplicate content, Broken link / blank landing page, Language issue - incorrect grammar on prominent placements, Confusing headline, captions, Improper targeting, Landing page CX not bar, Landing page not aligned with campaign, Language issue - incorrect grammar, Language issue - not following Amazon voice, Scheduling misconfiguration, Copy (truncated, character limitations, CTA not compliant), CTA not compliant, No mandatory secondary LoP enabled, Manual content that should be transitioned to dynamic content, Card/content is stale, CBRs approving their own campaigns, Re-approving autopurged content without any improvements, Missing or improper alt text, Dynamic recommendations issue, No issue found)',
    '2) QUIET - DO NOT DISPLAY: Think about the correction to this problem and how to correct ',
    '3) Write in English a ticket with these rules: ',
    '-Output: Just the result, no intro or pleasantries ',
    '-Tone: Friendly Pro — professional but polite greeting (Hello, ), short & clear sentences, positive ',
    '-Format (The only output you should display): ',
    '{{locale}}_HP_{{BusinessGroup}}_"Issue Category Name" (example : FR_HP_Language issue - incorrect grammar on prominent placements)',
    '',
    '//mandatory line break//',
    '',
    'Pro and warm greeting',
    'Quick context ( e.g: "Doing QA of your campaign... / Checking the Homepage I have...")',
    'Content or Key point or issue: Rephrase and explain the issue',
    'Recommendation and clear call to action (ex: I would suggest you to rework by changing with the word with: "xxx".... Could you please review and come back to me when done ?) ',
    '-Campaign URL: https://.....',
    'Tagging campaign owner: @{{ownerName}}'
  ].join('\n');
  const PROMPT_MODES = [
  {
    value: 'standard',
    label: 'Standard prompt',
    template: PROMPT_TEMPLATE
  },
  {
    value: 'custom',
    label: 'Custom prompt',
    template: '' // will come from textarea
  }
];

  // ==================== UTILS ====================
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const get = (k, def) => { try { return GM_getValue(k, def); } catch { return def; } };
  const set = (k, v) => { try { GM_setValue(k, v); } catch {} };

  function xpathNode(xpath) {
    try {
      const r = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return r.singleNodeValue;
    } catch { return null; }
  }

  function extract(node) {
    if (!node) return '';
    if (node.nodeType === Node.ATTRIBUTE_NODE) return node.value?.trim() || '';
    if (node.tagName?.match(/input|textarea/i)) return node.value?.trim() || '';
    return node.textContent?.trim() || '';
  }

  function toast(msg, type = 'info', time = 2200) {
    const el = Object.assign(document.createElement('div'), {
      textContent: msg,
      className: `sim3-toast sim3-toast-${type}`
    });
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, time);
  }

  // ==================== STYLES ====================
  GM_addStyle(`
    .sim3-widget {
      position: fixed; top: 16px; right: 16px; z-index: 2147483647;
      width: 300px; background: #fff; border: 1px solid #e2e8f0;
      border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.16);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1f2937; font-size: 13px; overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .sim3-widget:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,0.18); }
    .sim3-header {
      padding: 11px 15px; background: linear-gradient(135deg, #ffc105 0%, #ec7211 100%);
      color: white; font-weight: 600; font-size: 20px;
      cursor: move; user-select: none; border-radius: 12px 12px 0 0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .sim3-title { margin: 0; }
    .sim3-btn {
      background: rgba(255,255,255,0.22); border: none; color: white;
      width: 40px; height: 40px; border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 15px;
      transition: all 0.2s ease;
    }
    .sim3-btn:hover { background: rgba(255,255,255,0.32); }
    .sim3-body { padding: 16px; background: #fafafa; }
    .sim3-row { margin-bottom: 15px; }
    .sim3-row label {
      display: block; font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 12px;
    }
    .sim3-input, .sim3-textarea, .sim3-select {
      width: 240px; padding: 11px 13px; border: 1.8px solid #d1d5db; border-radius: 10px;
      font-size: 13px; background: white; transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .sim3-input:focus, .sim3-textarea:focus, .sim3-select:focus {
      outline: none; border-color: #f7b602; box-shadow: 0 0 0 3px rgba(250, 223, 150,0.22);
    }
    .sim3-textarea { resize: vertical; font-family: inherit; }
    .sim3-out {
      min-height: 116px; white-space: pre-wrap; background: #f8f9fa; border-color: #ced4da;
      font-family: inherit; color: #212529;
    }
    .sim3-select {
      appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M0%2C0%20L12%2C0%20L6%2C8%20L0%2C0%22%2F%3E%3C%2Fsvg%3E");
      background-repeat: no-repeat; background-position: right 13px center; padding-right: 38px;
    }
    .sim3-footer { display: flex; gap: 10px; margin-top: 10px; }
    .sim3-generate, .sim3-copy {
      flex: 1; padding: 12px; border: none; border-radius: 10px;
      font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s ease;
    }
    .sim3-generate {
      background: linear-gradient(135deg, #ffb347 0%, #ff9900 100%);
      color: white; box-shadow: 0 3px 9px rgba(99,102,241,0.32);
    }
    .sim3-generate:hover:not(:disabled) {
      transform: translateY(-1px); box-shadow: 0 6px 14px rgba(99,102,241,0.4);
    }
    .sim3-generate:disabled {
      opacity: 0.58; cursor: not-allowed; transform: none;
    }
    .sim3-copy {
      background: #f1f5f9; color: #475569; border: 1.8px solid #e2e8f0;
    }
    .sim3-copy:hover { background: #e2e8f0; }
    .sim3-copy.copied {
      background: #dcfce7; color: #166534; border-color: #86efac;
    }
    .sim3-loading {
      display: inline-block; width: 13px; height: 13px; border: 2.2px solid #fff;
      border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;
      margin-right: 7px; vertical-align: -1px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .sim3-collapsed .sim3-body { display: none; }
    .sim3-toast {
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%) translateY(-10px);
      background: #1f2937; color: white; padding: 11px 18px; border-radius: 12px;
      font-size: 12px; font-weight: 500; box-shadow: 0 10px 28px rgba(0,0,0,0.22);
      opacity: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10000;
      pointer-events: none; white-space: nowrap;
    }
    .sim3-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .sim3-muted {
      font-size: 10.5px; color: #94a3b8; text-align: center; margin-top: 12px; line-height: 1.4;
    }
  `);

  // ==================== WIDGET ====================
  const widget = document.createElement('div');
  widget.className = 'sim3-widget';
  widget.innerHTML = `
    <div class="sim3-header" id="sim3-drag-handle">
  <div class="sim3-title">
    <img src="https://i.im.ge/2025/10/31/nzMP7c.Untitled-design.png" style="height:60px; width:60px; vertical-align:middle; margin-right:8px; border-radius:4px;">
    Easy Flag
  </div>
  <div>
    <button class="sim3-btn" id="sim3-close-btn" ><img src="https://flaticons.net/icon.php?slug_category=mobile-application&slug_icon=close" alt="Close Logo" style="height:10px; width:auto; vertical-align:middle">
  </button>
    <button class="sim3-btn" id="sim3-collapse-btn" style="margin-top:10px;"><img src="https://www.nicepng.com/png/full/526-5265717_treatments-collapse-arrow-icon-white-png.png" alt="Collapse Logo" style="height:7px; width:auto; vertical-align:middle">
  </button>
</div>
</div>

    <div class="sim3-body">
      <div class="sim3-row">
        <label>What's the issue you want to flag?</label>
        <textarea class="sim3-textarea" id="sim3-issue" placeholder="e.g: ''missing impression capping''"></textarea>
      </div>
      <div class="sim3-row">
        <label>Key (saved on client side) <a class="sim3-muted" href="https://iad.merlon.amazon.dev/accounts?filter=allAccounts#accounts" <a href="https://www.google.com" target="_blank">  Find my key</a> </label>
        <input class="sim3-input" type="password" id="sim3-key" placeholder="Paste your Bedrock API Key" />
      </div>
      <div class="sim3-row">
        <label>Locale</label>
        <select class="sim3-select" id="sim3-locale"></select>
      </div>
      <div class="sim3-row" id="sim3-output-row">
        <label>Generated Ticket</label>
        <textarea class="sim3-textarea sim3-out" id="sim3-output" readonly placeholder="Your ticket will appear here..."></textarea>
        <div class="sim3-footer">
          <button class="sim3-copy" id="sim3-copy">Go SIM</button>
          <button class="sim3-generate" id="sim3-generate">
            <span id="sim3-gen-text">Generate</span>
          </button>
        </div>
      </div>
      <div class="sim3-row">
  <label>Prompt mode </label>
  <select class="sim3-select" id="sim3-prompt-mode"></select>
</div>

<div class="sim3-row" id="sim3-custom-prompt-row" style="display:none;">
  <div style="
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:10px;
    padding:8px 10px;
    border:1.8px solid #e2e8f0;
    border-radius:10px;
    background:#ffffff;
    margin-bottom:8px;
  ">
    <div style="flex:1; min-width:0;">
      <div style="font-size:11px; font-weight:600; color:#64748b; margin-bottom:2px;">
        IMPORTANT
      </div>
      <div style="font-size:10.5px; color:#94a3b8; line-height:1.35;">
        <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">{{variables}}</span>
        are placeholders. Do not remove or rename them.
      </div>
    </div>

    <button type="button" class="sim3-copy" id="sim3-reset-prompt" style="flex:0 0 auto; padding:8px 10px;">
      Reset
    </button>
  </div>

  <textarea
    class="sim3-textarea"
    id="sim3-custom-prompt"
    placeholder="Paste/edit your prompt template here..."
    style="min-height:160px;"></textarea>
</div>

      <div class="sim3-muted">
        Powered by AI - FR I&I Team - @dutrey
      </div>
    </div>`;
  document.body.appendChild(widget);

  // ==================== ELEMENTS ====================
  const els = {
    issue: $('#sim3-issue', widget),
    key: $('#sim3-key', widget),
    locale: $('#sim3-locale', widget),
    outputRow: $('#sim3-output-row', widget),
    output: $('#sim3-output', widget),
    genBtn: $('#sim3-generate', widget),
    genText: $('#sim3-gen-text'),
    copyBtn: $('#sim3-copy', widget),
    collapseBtn: $('#sim3-collapse-btn', widget),
    closeBtn: $('#sim3-close-btn', widget),
    promptMode: $('#sim3-prompt-mode', widget),
    customPromptRow: $('#sim3-custom-prompt-row', widget),
    customPrompt: $('#sim3-custom-prompt', widget),
    resetPromptBtn: $('#sim3-reset-prompt', widget)
  };

  // Locale dropdown
  els.locale.innerHTML = LOCALES.map(l => `<option value="${l.value}">${l.label}</option>`).join('');
  els.locale.value = get(STORAGE.locale, DEFAULT_LOCALE);
  els.locale.addEventListener('change', () => set(STORAGE.locale, els.locale.value));
  // Prompt mode dropdown
  els.promptMode.innerHTML = PROMPT_MODES
  .map(m => `<option value="${m.value}">${m.label}</option>`)
  .join('');
  els.promptMode.value = get(STORAGE.promptMode, 'standard');
  els.customPrompt.value = get(STORAGE.customPrompt, PROMPT_TEMPLATE);

// Show/hide custom prompt editor
function syncPromptUI() {
  const isCustom = els.promptMode.value === 'custom';
  els.customPromptRow.style.display = isCustom ? 'block' : 'none';
}

els.promptMode.addEventListener('change', () => {
  set(STORAGE.promptMode, els.promptMode.value);
  syncPromptUI();
});

els.customPrompt.addEventListener('input', () => {
  set(STORAGE.customPrompt, els.customPrompt.value);
});

syncPromptUI();

if (els.resetPromptBtn) {
  els.resetPromptBtn.addEventListener('click', () => {
    els.customPrompt.value = PROMPT_TEMPLATE;
    set(STORAGE.customPrompt, PROMPT_TEMPLATE);
    toast('Custom prompt reset.', 'success');
  });
} else {
  console.warn('[sim3] Reset button not found: #sim3-reset-prompt');
}
  // ==================== OWNER DETECTION ====================
  let owner = '';
  function detect() {
    const node = xpathNode(XPATH_OWNER);
    if (node) owner = extract(node);
    return !!owner;
  }
  if (!detect()) {
    [600, 1600, 3200].forEach(t => setTimeout(detect, t));
    const mo = new MutationObserver(() => { if (detect()) mo.disconnect(); });
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 9000);
  }

  // ==================== BG DETECTION ====================
  let businessGroup = '';
  function detectBG() {
    const nodebg = xpathNode(XPATH_BG);
    if (nodebg) businessGroup = extract(nodebg);
    return !!businessGroup;
  }
  if (!detectBG()) {
    [600, 1600, 3200].forEach(t => setTimeout(detectBG, t));
    const mo2 = new MutationObserver(() => { if (detectBG()) mo2.disconnect(); });
    mo2.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo2.disconnect(), 9000);
  }

  // ==================== PERSISTENCE ====================
  els.key.value = get(STORAGE.key, '');
  els.key.addEventListener('input', () => {
    const v = els.key.value.trim();
    v ? set(STORAGE.key, v) : GM_deleteValue(STORAGE.key);
    validate();
  });

  // ==================== VALIDATION ====================
  function validate() {
    const ok = els.issue.value.trim().length >= 5 &&
               els.key.value.trim().length > 0 &&
               els.locale.value;
    els.genBtn.disabled = !ok;
  }
  ['issue', 'key', 'locale'].forEach(k => els[k].addEventListener('input', validate));
  els.locale.addEventListener('change', validate);
  setTimeout(validate, 150);

  // ==================== PROMPT ====================
function buildPrompt() {
  const mode = els.promptMode.value;
  const modeObj = PROMPT_MODES.find(m => m.value === mode) || PROMPT_MODES[0];

  const template =
    mode === 'custom'
      ? (els.customPrompt.value.trim() || PROMPT_TEMPLATE)
      : modeObj.template;

  return Mustache.render(template, {
    locale: els.locale.value,
    campaignLink: CAMPAIGN_LINK,
    ownerName: owner || '(not detected)',
    BusinessGroup: businessGroup,
    issue: els.issue.value.trim()
  });
}


  // ==================== BEDROCK ====================
  async function callBedrock(prompt) {
    const url = `https://bedrock-runtime.${REGION}.amazonaws.com/model/${encodeURIComponent(MODEL_ID)}/converse`;
    const body = {
      messages: [{ role: 'user', content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2000, temperature: 0.7 }
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${els.key.value.trim()}`,
        'X-Amz-Target': 'BedrockRuntime_20240221Runtime.Converse'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timer);
    const text = await res.text();
    const json = text.trim().startsWith('{') ? JSON.parse(text) : { raw: text };

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${json.message || text}`);
    return json;
  }

  // ==================== GENERATE ====================
  els.genBtn.addEventListener('click', async () => {
    const prompt = buildPrompt();
    els.outputRow.style.display = 'block';
    els.output.value = 'Generating ticket...';
    els.genText.innerHTML = '<div class="sim3-loading"></div>Working...';
    els.genBtn.disabled = true;

    try {
      const json = await callBedrock(prompt);
      const text = json?.output?.message?.content?.[0]?.text?.trim() || '[No output]';
      els.output.value = text;
      els.genText.textContent = 'Generate';
      toast('Ticket ready!', 'success');
    } catch (e) {
      els.output.value = `Error: ${e.message}`;
      els.genText.textContent = 'Retry';
      toast('Failed', 'error');
    } finally {
      validate();
    }
  });

  // ==================== COPY ====================
  els.copyBtn.addEventListener('click', async () => {
  const text = els.output.value;
  const lines = text.split('\n');
  const title = lines.shift().trim();
  const body = lines.join('\n').trim();
  const SIM_URL = `https://sim.amazon.com/issues/create?assignedFolder=e3306293-dbb4-498d-9ea5-63d093bb5477&title=${encodeURIComponent(title)}&description=${encodeURIComponent(body)}&descriptionContentType=text/plain&customFields[string][0][id]=marketplace&customFields[string][0][value]=${els.locale.value}`;
  if (!text || /Generating|Error/.test(text)) return toast('Nothing to copy');
  try {
    await navigator.clipboard.writeText(text);
    els.copyBtn.textContent = 'Redirecting...';
    els.copyBtn.classList.add('copied');
    // ✅ Redirect after copying (for example after 1 second)
    setTimeout(() => {
      window.open(SIM_URL, '_blank'); // replace with your URL
    }, 100);

    setTimeout(() => {
      els.copyBtn.textContent = 'Copy';
      els.copyBtn.classList.remove('copied');
    }, 1600);
  } catch {
    toast('Copy failed', 'error');
  }
});

  // ==================== UI BEHAVIOR ====================
  let collapsed = false;
  els.collapseBtn.addEventListener('click', () => {
    collapsed = !collapsed;
    widget.classList.toggle('sim3-collapsed', collapsed);
  });
  els.closeBtn.addEventListener('click', () => widget.remove());

  // Drag
  (function () {
    const h = $('#sim3-drag-handle', widget);
    let x, y, lx, ly;
    const down = e => {
      x = e.clientX; y = e.clientY;
      const r = widget.getBoundingClientRect();
      lx = r.left; ly = r.top;
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
      e.preventDefault();
    };
    const move = e => {
      widget.style.left = (lx + e.clientX - x) + 'px';
      widget.style.top = (ly + e.clientY - y) + 'px';
      widget.style.right = 'auto';
    };
    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    h.addEventListener('mousedown', down);
  })();

  toast('SIM 3 ready. Owner auto-detected.', 'info', 2800);
})();
}
