// ==UserScript==
// @name        UserStyles.org - Install with Stylus, view on archive, advanced scraping
// @namespace   Violentmonkey Scripts
// @match       *://userstyles.org/*
// @match       *://www.userstyles.org/*
// @connect     raw.githubusercontent.com
// @connect     uso.kkx.one
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @version     8.0
// @author      jackiechan285
// @description Adds "Install with Stylus" and "Scrape" buttons to userstyles.org, and provides a guided wizard for scraping.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=userstyles.org
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/560522/UserStylesorg%20-%20Install%20with%20Stylus%2C%20view%20on%20archive%2C%20advanced%20scraping.user.js
// @updateURL https://update.greasyfork.org/scripts/560522/UserStylesorg%20-%20Install%20with%20Stylus%2C%20view%20on%20archive%2C%20advanced%20scraping.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==========================================
  // 1. CONFIGURATION
  // ==========================================
  const REPO_BASE = "https://raw.githubusercontent.com/uso-archive/data/flomaster/data";
  const ARCHIVE_VIEW_BASE = "https://uso.kkx.one/style";

  // Native Selectors
  const CONTAINER_SELECTOR = ".style-details_topRight__46wEw";
  const BTN_BASE = "stylish-button_btn__9WVWB stylish-button_large___3hkg";
  const BTN_LABEL = "stylish-button_label__WMaXR";

  // Custom Styles
  const CUSTOM_STYLES = `
    .srm-btn-group { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; width: 100%; align-items: flex-end; }
    .srm-btn-install { background-color: #2ea44f !important; color: white !important; border: none !important; width: 100%; }
    .srm-btn-install:hover { background-color: #2c974b !important; }
    .srm-btn-archive { background-color: #0366d6 !important; color: white !important; border: none !important; width: 100%; }
    .srm-btn-archive:hover { background-color: #035fc7 !important; }
    .srm-btn-scrape { background-color: #d73a49 !important; color: white !important; border: none !important; width: 100%; }
    .srm-btn-scrape:hover { background-color: #cb2431 !important; }

    #srm-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 2147483647; display: flex; justify-content: center; align-items: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; backdrop-filter: blur(5px); }
    #srm-modal { background: #1e1e1e; color: #eee; width: 650px; max-width: 90%; max-height: 90vh; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.7); display: flex; flex-direction: column; border: 1px solid #333; }
    #srm-header { padding: 15px 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; background: #252526; border-radius: 12px 12px 0 0; }
    #srm-title { font-size: 1.2rem; font-weight: 700; color: #fff; }
    #srm-close { background: none; border: none; color: #888; font-size: 1.5rem; cursor: pointer; transition: 0.2s; }
    #srm-close:hover { color: #fff; }
    #srm-content { padding: 25px; overflow-y: auto; line-height: 1.6; }
    .srm-step { margin-bottom: 25px; padding-left: 15px; border-left: 3px solid #444; }
    .srm-step-title { font-size: 1.1rem; color: #4fc1ff; margin-bottom: 5px; font-weight: 600; }
    .srm-text { font-size: 0.95rem; color: #ccc; }
    .srm-highlight { background: #3a3a3a; padding: 2px 6px; border-radius: 4px; color: #ce9178; font-family: monospace; }
    #srm-copy-btn { width: 100%; padding: 12px; background: #238636; color: white; border: none; border-radius: 6px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 15px; transition: 0.2s; }
    #srm-copy-btn:hover { background: #2ea043; }
  `;

  // ==========================================
  // 2. SCRAPER GENERATOR
  // ==========================================

  function generateScraperScript(injectedHeader) {
    const headerCode = injectedHeader
      ? `const customHeader = \`${injectedHeader.replace(/`/g, '\\`')}\`;`
      : `const customHeader = null;`;

    return `(async function() {
    console.clear();
    console.log("🚀 Starting Full Stylish Export...");
    ${headerCode}
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    function getReactValue(element) {
        if (!element) return null;
        const key = Object.keys(element).find(key => key.startsWith("__reactProps") || key.startsWith("__reactEventHandlers"));
        return key ? element[key] : null;
    }
    function scrapeCurrentView(sectionName) {
        console.log(\`   ...scraping data for "\${sectionName}"\`);
        const ruleRows = document.querySelectorAll('.style-editor-rule_ruleRow__\\\\+GIMS');
        const rules = [];
        ruleRows.forEach(row => {
            const typeEl = row.querySelector('.style-editor-rule-type-select_ruleTypeValue__0SRkN > div:first-child');
            const type = typeEl ? typeEl.innerText.trim() : "Unknown";
            const inputEl = row.querySelector('input[data-stylish="editor-rule-input-field"]');
            const value = inputEl ? inputEl.value : "";
            rules.push({ type, value });
        });
        let codeContent = "";
        const cmWrapper = document.querySelector('.react-codemirror2');
        const reactProps = getReactValue(cmWrapper);
        if (reactProps && reactProps.value) { codeContent = reactProps.value; }
        else {
            const cmNode = document.querySelector('.CodeMirror');
            if (cmNode && cmNode.CodeMirror) { codeContent = cmNode.CodeMirror.getValue(); }
            else { codeContent = "/* ERROR: Could not extract code for this section */"; }
        }
        return { section: sectionName, rules: rules, code: codeContent };
    }
    const fullData = [];
    console.log("📂 Processing Visible Tabs...");
    const visibleTabs = Array.from(document.querySelectorAll('.style-editor-sections-tabs_sectionListItem__LMlKW'));
    for (const tab of visibleTabs) {
        const btn = tab.querySelector('[data-stylish="editor-specific-section-button"]');
        if (btn) { btn.click(); await sleep(400); fullData.push(scrapeCurrentView(btn.innerText)); }
    }
    const moreBtnSelector = 'button[data-stylish="editor-list-section-button"]';
    const menuWrapperSelector = '.style-editor-sections-tabs_extraSectionsWrapper__LjKgb';
    const menuItemSelector = '.style-editor-sections-tabs_extraSectionItem__-Qsdj';
    const moreBtn = document.querySelector(moreBtnSelector);
    if (moreBtn) {
        console.log("📂 Processing Dropdown Menu...");
        moreBtn.click(); await sleep(500);
        const initialItems = document.querySelectorAll(menuItemSelector);
        for (let i = 0; i < initialItems.length; i++) {
            if (!document.querySelector(menuWrapperSelector)) { document.querySelector(moreBtnSelector).click(); await sleep(500); }
            const items = document.querySelectorAll(menuItemSelector);
            if (items[i]) { const name = items[i].innerText; items[i].click(); await sleep(600); fullData.push(scrapeCurrentView(name)); }
        }
    }
    console.log(\`✅ Scraping complete. Found \${fullData.length} sections.\`);
    console.log("🏗️ Constructing UserCSS file...");
    const nameInput = document.querySelector('#editor-style-name-input');
    const styleName = nameInput ? nameInput.value.trim() : "Exported_Style";
    const lines = [];
    if (customHeader) {
        lines.push(customHeader.trim());
    } else {
        const meta = { name: styleName, namespace: "violentmonkey.scraping", version: "1.0.0", description: \`Exported from Stylish editor on \${new Date().toLocaleDateString()}\`, author: "Anonymous", license: "NO-REDISTRIBUTION", preprocessor: "default" };
        lines.push("/* ==UserStyle==");
        for (const [key, value] of Object.entries(meta)) { lines.push(\`@\${key.padEnd(13)} \${value}\`); }
        lines.push("==/UserStyle== */");
    }
    lines.push("");
    function escapeCssString(str) { return str.replace(/\\\\/g, '\\\\\\\\').replace(/"/g, '\\\\"'); }
    function buildMozDocument(rules) {
        if (!rules || rules.length === 0) return null;
        const conditions = rules.map(r => {
            const val = r.value.trim();
            if (!val) return null;
            switch (r.type) {
                case 'Domains': return \`domain("\${escapeCssString(val)}")\`;
                case 'URL': return \`url("\${escapeCssString(val)}")\`;
                case 'URL prefix': return \`url-prefix("\${escapeCssString(val)}")\`;
                case 'Regex': return \`regexp("\${escapeCssString(val)}")\`;
                default: return null;
            }
        }).filter(Boolean);
        if (conditions.length === 0) return null;
        return \`@-moz-document \${conditions.join(', ')}\`;
    }
    fullData.forEach(item => {
        lines.push(\`/* === \${item.section} === */\`);
        const documentRule = buildMozDocument(item.rules);
        if (documentRule) { lines.push(\`\${documentRule} {\`); lines.push(item.code.split('\\n').map(l => '  ' + l).join('\\n')); lines.push("}"); }
        else { lines.push(item.code); }
        lines.push("");
    });
    const finalCss = lines.join('\\n');
    const blob = new Blob([finalCss], { type: 'text/css' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl; link.download = \`\${styleName.replace(/[^a-z0-9\\-_]/gi, '_')}.user.css\`; link.style.display = 'none';
    document.body.appendChild(link);
    console.log("🎉 Export ready! Downloading...");
    link.click();
    setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(blobUrl); }, 2000);
})();`;
  }

  // ==========================================
  // 3. ARCHIVE LOGIC (ROBUST CONTENT CHECK)
  // ==========================================

  function getStyleIdFromUrl(url) {
    try {
      const u = new URL(url);
      const path = u.pathname.split('/');
      if (path[1] === 'styles' && path[2] && !isNaN(path[2])) return path[2];
      return null;
    } catch (e) { return null; }
  }

  function checkArchive(styleId, callback) {
    const cssUrl = `${REPO_BASE}/usercss/${styleId}.user.css`;
    const jsonUrl = `${REPO_BASE}/styles/${styleId}.json`;
    const archivePage = `${ARCHIVE_VIEW_BASE}/${styleId}`;

    // 1. Fetch the raw CSS file
    GM_xmlhttpRequest({
      method: "GET",
      url: cssUrl,
      onload: function(cssRes) {
        if (cssRes.status === 200) {
          // 2. Validate Content: Check if it's more than just a header
          const content = cssRes.responseText;

          // Remove comments (metadata block) to see if code remains
          const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '').trim();

          if (stripped.length > 5) {
             // Has actual code -> Valid Install
             callback({ status: 'installable', cssUrl, archivePage });
          } else {
             // Empty or header-only -> Broken/Indexed only
             // Pass the header to the callback so the scraper can use it
             callback({ status: 'indexed', archivePage, header: content });
          }
        } else {
          // 3. If 404, check if it exists in JSON index at all
          GM_xmlhttpRequest({
            method: "HEAD",
            url: jsonUrl,
            onload: function(jsonRes) {
              if (jsonRes.status === 200) {
                callback({ status: 'indexed', archivePage, header: null });
              } else {
                callback({ status: 'missing' });
              }
            },
            onerror: () => callback({ status: 'error' })
          });
        }
      },
      onerror: () => callback({ status: 'error' })
    });
  }

  // ==========================================
  // 4. UI COMPONENTS
  // ==========================================

  function el(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'style') Object.assign(element.style, value);
      else if (key.startsWith('on') && typeof value === 'function') element.addEventListener(key.substring(2).toLowerCase(), value);
      else if (key === 'html') element.innerHTML = value;
      else element[key] = value;
    });
    children.forEach(child => {
      if (typeof child === 'string') element.appendChild(document.createTextNode(child));
      else if (child instanceof Node) element.appendChild(child);
    });
    return element;
  }

  function showGuide(headerData) {
    const existing = document.getElementById('srm-overlay');
    if (existing) existing.remove();
    GM_addStyle(CUSTOM_STYLES);

    const codeToCopy = generateScraperScript(headerData);
    let statusHtml = "This style is <strong>not available</strong> in the archives. You can recover it manually.";

    if (headerData) {
        statusHtml = `<span style="color:#eebb00">⚠️ Partial Archive Found:</span> The style is broken in the archive (no code), but we recovered the <strong>original metadata</strong>. It will be included in the script below.`;
    }

    const modal = el('div', { id: 'srm-overlay', onclick: (e) => { if(e.target.id === 'srm-overlay') e.target.remove(); } }, [
      el('div', { id: 'srm-modal' }, [
        el('div', { id: 'srm-header' }, [
          el('div', { id: 'srm-title', textContent: 'Stylish Advanced Scraper' }),
          el('button', { id: 'srm-close', textContent: '×', onclick: () => document.getElementById('srm-overlay').remove() })
        ]),
        el('div', { id: 'srm-content' }, [
          el('div', { className: 'srm-text', style: { marginBottom: '20px' }, html: statusHtml }),
          el('div', { className: 'srm-step' }, [
            el('div', { className: 'srm-step-title', textContent: 'Step 1: Install Stylish' }),
            el('div', { className: 'srm-text', html: 'Install <a href="https://chromewebstore.google.com/detail/stylish-custom-themes-for/fjnbnpbmkenffdnngjfgmeleoegfcffe?hl=en" target="_blank" style="color:#4fc1ff">Stylish</a>. Click the <strong>"Install Style"</strong> button on the page.' })
          ]),
          el('div', { className: 'srm-step' }, [
            el('div', { className: 'srm-step-title', textContent: 'Step 2: Open Editor' }),
            el('div', { className: 'srm-text', html: 'Click the Stylish icon > "My Styles" > Hover style > Click <strong>Pencil Icon</strong>.' })
          ]),
          el('div', { className: 'srm-step' }, [
            el('div', { className: 'srm-step-title', textContent: 'Step 3: DevTools' }),
            el('div', { className: 'srm-text', html: 'Press <strong>F12</strong>. In <strong>Console</strong>, set context to <span class="srm-highlight">iframe-overlay...</span> or <span class="srm-highlight">index.html</span>.' })
          ]),
          el('div', { className: 'srm-step' }, [
            el('div', { className: 'srm-step-title', textContent: 'Step 4: Run Scraper' }),
            el('div', { className: 'srm-text', textContent: 'Copy the code below, paste into Console, and hit Enter.' }),
            el('button', { id: 'srm-copy-btn', textContent: '📋 Copy Scraper Code', onclick: function() {
              GM_setClipboard(codeToCopy);
              this.textContent = '✅ Copied!';
              this.style.background = '#444';
              setTimeout(() => { this.textContent = '📋 Copy Scraper Code'; this.style.background = '#238636'; }, 2000);
            }})
          ])
        ])
      ])
    ]);
    document.body.appendChild(modal);
  }

  function createNativeButton(text, customClass, onClick) {
    const span = el('span', { textContent: text });
    const labelDiv = el('div', { className: BTN_LABEL }, [span]);
    return el('button', { className: `${BTN_BASE} ${customClass} srm-injected`, onclick: onClick }, [labelDiv]);
  }

  // ==========================================
  // 5. MAIN LOGIC LOOP (SPA SUPPORT)
  // ==========================================

  let currentlyFetchingId = null;

  function injectButtons(container, result, styleId) {
    // Check if buttons already exist for THIS style ID
    const existingGroup = container.querySelector('.srm-btn-group');
    if (existingGroup) {
        if (existingGroup.dataset.styleId === styleId) {
            return; // Already correct
        } else {
            existingGroup.remove(); // Stale buttons
        }
    }

    const btnGroup = el('div', { className: 'srm-btn-group' });
    btnGroup.dataset.styleId = styleId; // Tag group with ID to prevent race conditions

    if (result.status === 'installable') {
        btnGroup.appendChild(createNativeButton('Install with Stylus (Archive)', 'srm-btn-install', () => window.location.href = result.cssUrl));
        btnGroup.appendChild(createNativeButton('View in uso.kkx.one', 'srm-btn-archive', () => GM_openInTab(result.archivePage, { active: true })));
    }
    else if (result.status === 'indexed') {
        btnGroup.appendChild(createNativeButton('Scrape (Broken in Archive)', 'srm-btn-scrape', () => showGuide(result.header)));
        btnGroup.appendChild(createNativeButton('View Entry in Archive', 'srm-btn-archive', () => GM_openInTab(result.archivePage, { active: true })));
    }
    else {
        btnGroup.appendChild(createNativeButton('Scrape (Not Archived)', 'srm-btn-scrape', () => showGuide(null)));
    }

    container.appendChild(btnGroup);
  }

  // The "Game Loop" - Runs every 500ms to ensure UI is in sync with URL
  function stateCheckLoop() {
      const currentId = getStyleIdFromUrl(window.location.href);
      if (!currentId) return;

      const container = document.querySelector(CONTAINER_SELECTOR);
      if (!container) return;

      // Check existing buttons
      const existingGroup = container.querySelector('.srm-btn-group');
      if (existingGroup) {
          // If the buttons are for a different ID than the URL, kill them immediately
          if (existingGroup.dataset.styleId !== currentId) {
              existingGroup.remove();
          } else {
              return; // Buttons match URL, all good
          }
      }

      // If we are already fetching THIS specific ID, don't spam requests
      if (currentlyFetchingId === currentId) return;

      currentlyFetchingId = currentId;
      console.log(`[Stylish Advanced Scraper] New Style Detected: ${currentId}. Checking archive...`);

      checkArchive(currentId, (result) => {
          // CRITICAL: Ensure the user hasn't navigated away while we were fetching
          const freshId = getStyleIdFromUrl(window.location.href);
          if (freshId === currentId) {
              injectButtons(container, result, currentId);
          }
          currentlyFetchingId = null;
      });
  }

  // ==========================================
  // 6. INITIALIZATION
  // ==========================================

  GM_registerMenuCommand("🚀 Open Stylish Advanced Scraper", () => showGuide(null));
  GM_addStyle(CUSTOM_STYLES);

  // Start the State Loop
  setInterval(stateCheckLoop, 500);

})();