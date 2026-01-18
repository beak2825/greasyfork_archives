// ==UserScript==
// @name        Gemini Command Menu
// @namespace   Violentmonkey Scripts
// @match       https://gemini.google.com/*
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     5.3
// @author      jackiechan285
// @description Adds a native-styled command menu triggered by "/" in the Gemini input box. Unifies tools and file upload sources, providing instant access by just typing, with seamless navigation and interaction.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=gemini.google.com
// @downloadURL https://update.greasyfork.org/scripts/560396/Gemini%20Command%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/560396/Gemini%20Command%20Menu.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Iframe Guard ---
  if (window.top !== window.self) return;

  // --- Configuration ---
  const CONFIG = {
    triggerChar: '/',
    minQueryLength: 0,
    maxQueryLength: 20
  };

  const TRIGGER_SELECTORS = {
    'Tools': 'button.toolbox-drawer-button, button[aria-label*="Gemini Advanced"], button[data-test-id="toolbox-trigger"]',
    'Add Files': 'button.upload-card-button, button[aria-label="Open upload file menu"], button[aria-label="Upload files"]'
  };

  const STYLE_ID_HIDE = 'vm-hide-native-menu';

  // --- Scoped Style Overrides ---
  const CUSTOM_CSS = `
    .command-menu-overlay .toolbox-drawer-item-list-button {
        height: 40px !important;
    }
    .command-menu-overlay .menu-icon {
        margin-left: 16px !important;
        margin-right: 12px !important;
    }
    .command-menu-overlay .menu-icon.img-icon {
        padding: 10px 2px 0px 2px;
    }
    .command-menu-overlay mat-icon[data-mat-icon-type="svg"] {
        width: 20px;
        height: 20px;
        padding: 2px;
    }
    .command-menu-overlay mat-card {
        box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));
    }
    .command-menu-overlay .toolbox-drawer-card {
        min-width: unset !important;
    }
    .command-menu-overlay .menu-item-label {
        color: rgb(154, 155, 156) !important;
        padding: 6px 24px 4px 16px !important;
        font-family: Google Sans, Roboto, sans-serif !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        line-height: 20px !important;
    }
  `;
  GM_addStyle(CUSTOM_CSS);

  // --- Trusted Types Helper ---
  let ttPolicy = null;
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
      try {
          ttPolicy = window.trustedTypes.createPolicy('gemini-userscript-policy', {
              createHTML: (string) => string,
          });
      } catch (e) {}
  }

  function getTrustedHTML(htmlString) {
      if (ttPolicy) return ttPolicy.createHTML(htmlString);
      return htmlString;
  }

  // --- State & Storage ---

  let cachedMenuData = GM_getValue('menu_items_cache_v2', { tools: [], addFiles: [] });

  let cachedNgAttrs = GM_getValue('ngAttributes_v3', {
    container: '_ngcontent-ng-c133789645',
    item: '_ngcontent-ng-c2899984923'
  });

  let sessionState = {
    toolsDone: cachedMenuData.tools.length > 0,
    filesDone: cachedMenuData.addFiles.length > 0
  };

  const observedCards = new WeakSet();

  let state = {
    isOpen: false,
    activeIndex: 0,
    query: '',
    visibleItems: [],
    menuElement: null
  };

  // --- Utilities ---
  const utils = {
    wait: (selector, timeout = 3000) => new Promise((resolve, reject) => {
        if (document.querySelector(selector)) return resolve(document.querySelector(selector));
        const obs = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) { obs.disconnect(); resolve(el); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => { obs.disconnect(); reject(`Timeout waiting for: ${selector}`); }, timeout);
    }),

    toggleUI: (hide) => {
        const style = document.getElementById(STYLE_ID_HIDE);
        if (hide && !style) {
            const s = document.createElement('style');
            s.id = STYLE_ID_HIDE;
            s.textContent = `.cdk-overlay-container { visibility: hidden !important; opacity: 0 !important; }`;
            document.head.appendChild(s);
        } else if (!hide && style) {
            style.remove();
        }
    },

    sleep: (ms) => new Promise(r => setTimeout(r, ms))
  };

  // --- Context Menu ---
  GM_registerMenuCommand("Reset Menu Cache (Re-scan)", () => {
    if (confirm("Reset menu cache? Open 'Plus' and 'Tools' menus in Gemini to re-populate.")) {
        cachedMenuData = { tools: [], addFiles: [] };
        GM_setValue('menu_items_cache_v2', cachedMenuData);
        sessionState.toolsDone = false;
        sessionState.filesDone = false;
        alert("Cache cleared. Please open the menus to re-scan.");
    }
  });

  // --- Discovery Engine ---

  function extractNgAttr(element) {
    if (!element) return null;
    const attrs = element.getAttributeNames();
    for (const attr of attrs) {
      if (attr.startsWith('_ngcontent-ng-')) {
        return attr;
      }
    }
    return null;
  }

  function generateId(label) {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }

  function scrapeMenu(card, type) {
    if (card.classList.contains('gemini-command-ui')) return null;
    if (card.closest('[hidden]') || card.offsetParent === null) return null;

    console.log(`[Gemini Command] Scanning ${type}...`);

    // Tools: Capture container/item styles
    if (type === 'tools') {
        let attrsChanged = false;
        const containerAttr = extractNgAttr(card);
        if (containerAttr && containerAttr !== cachedNgAttrs.container) {
            cachedNgAttrs.container = containerAttr;
            attrsChanged = true;
        }
        const sampleBtn = card.querySelector('button.mat-mdc-list-item');
        if (sampleBtn) {
            const itemAttr = extractNgAttr(sampleBtn);
            if (itemAttr && itemAttr !== cachedNgAttrs.item) {
                cachedNgAttrs.item = itemAttr;
                attrsChanged = true;
            }
        }
        if (attrsChanged) GM_setValue('ngAttributes_v3', cachedNgAttrs);
    }

    const items = [];
    const buttons = card.querySelectorAll('button.mat-mdc-list-item');

    buttons.forEach(btn => {
        if (btn.closest('[hidden]') || btn.closest('.cdk-visually-hidden')) return;

        const labelEl = btn.querySelector('.menu-text') ||
                        btn.querySelector('.label.gds-label-l') ||
                        btn.querySelector('.mdc-list-item__primary-text');

        if (!labelEl) return;
        const label = labelEl.textContent.trim();
        if (!label) return;

        let iconType = 'font';
        let iconValue = 'extension';
        let iconContent = '';

        const matIcon = btn.querySelector('mat-icon');
        const imgIcon = btn.querySelector('img.menu-icon') || btn.querySelector('img');

        if (matIcon) {
            const typeAttr = matIcon.getAttribute('data-mat-icon-type');
            if (typeAttr === 'svg') {
                iconType = 'svg';
                iconValue = matIcon.getAttribute('data-mat-icon-name') || 'custom_svg';
                iconContent = matIcon.innerHTML;
            } else {
                iconType = 'font';
                iconValue = matIcon.getAttribute('data-mat-icon-name') ||
                            matIcon.getAttribute('fonticon') ||
                            matIcon.textContent.trim();
            }
        } else if (imgIcon && !imgIcon.className.includes('emoji')) {
            iconType = 'img';
            iconValue = imgIcon.src;
        }

        items.push({
            label: label,
            category: type === 'tools' ? 'Tools' : 'Add Files',
            id: type + '_' + generateId(label),
            iconType: iconType,
            icon: iconValue,
            iconContent: iconContent
        });
    });

    return items;
  }

  function observeAndScrape(cardElement, type) {
    if (type === 'tools' && sessionState.toolsDone) return;
    if (type === 'files' && sessionState.filesDone) return;

    if (cardElement.classList.contains('gemini-command-ui')) return;
    if (observedCards.has(cardElement)) return;

    observedCards.add(cardElement);
    console.log(`[Gemini Command] Attaching observer to ${type} menu.`);

    let timer;
    const performScrape = () => {
        const items = scrapeMenu(cardElement, type);

        if (items && items.length > 0) {
            if (type === 'tools') {
                cachedMenuData.tools = items;
                sessionState.toolsDone = true;
            } else {
                cachedMenuData.addFiles = items;
                sessionState.filesDone = true;
            }

            GM_setValue('menu_items_cache_v2', cachedMenuData);
            console.log(`[Gemini Command] Scraped ${items.length} items for ${type}.`);

            if (observer) observer.disconnect();
        }
    };

    const observer = new MutationObserver(() => {
        clearTimeout(timer);
        timer = setTimeout(performScrape, 500);
    });

    observer.observe(cardElement, { childList: true, subtree: true });
    timer = setTimeout(performScrape, 500);
  }

  // --- UI Construction ---

  function createSectionHeader(title) {
      const div = document.createElement('div');
      div.className = 'menu-item-label gds-label-l ng-star-inserted';
      div.textContent = title;
      return div;
  }

  function createIcon(item) {
    if (item.iconType === 'img') {
        const img = document.createElement('img');
        if (cachedNgAttrs.item) img.setAttribute(cachedNgAttrs.item, '');
        img.className = 'menu-icon img-icon gds-icon-l ng-star-inserted';
        img.src = item.icon;
        img.alt = '';
        return img;
    }
    else if (item.iconType === 'svg') {
        const icon = document.createElement('mat-icon');
        if (cachedNgAttrs.item) icon.setAttribute(cachedNgAttrs.item, '');
        icon.className = 'mat-icon notranslate mat-mdc-list-item-icon menu-icon gds-icon-l mat-icon-no-color mdc-list-item__start ng-star-inserted';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('matlistitemicon', '');
        icon.setAttribute('data-mat-icon-type', 'svg');
        icon.setAttribute('data-mat-icon-name', item.icon);
        try {
            if (item.iconContent) {
                icon.innerHTML = getTrustedHTML(item.iconContent);
            }
        } catch (e) {
            icon.setAttribute('data-mat-icon-type', 'font');
            icon.textContent = 'grid_view';
        }
        return icon;
    }
    else {
        const icon = document.createElement('mat-icon');
        if (cachedNgAttrs.item) icon.setAttribute(cachedNgAttrs.item, '');
        icon.className = 'mat-icon notranslate mat-mdc-list-item-icon menu-icon gds-icon-l google-symbols mat-ligature-font mat-icon-no-color mdc-list-item__start ng-star-inserted';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        icon.setAttribute('matlistitemicon', '');
        icon.setAttribute('data-mat-icon-type', 'font');
        icon.setAttribute('data-mat-icon-name', item.icon);
        icon.setAttribute('fonticon', item.icon);
        return icon;
    }
  }

  function createMenuItem(item, isSelected, query) {
    const wrapper = document.createElement('toolbox-drawer-item');
    if (cachedNgAttrs.container) wrapper.setAttribute(cachedNgAttrs.container, '');
    wrapper.className = 'mat-mdc-tooltip-trigger toolbox-drawer-menu-item short-list-item mat-mdc-tooltip-disabled';

    const btn = document.createElement('button');
    if (cachedNgAttrs.item) btn.setAttribute(cachedNgAttrs.item, '');

    let classes = 'mat-mdc-list-item mdc-list-item mat-mdc-list-item-interactive toolbox-drawer-item-list-button mdc-list-item--with-leading-icon mat-mdc-list-item-single-line mdc-list-item--with-one-line';
    if (isSelected) {
      classes += ' mdc-ripple-upgraded--background-focused';
      btn.style.backgroundColor = 'var(--mat-mdc-list-list-item-hover-state-layer-color, rgba(255,255,255,0.08))';
    }
    btn.className = classes;
    btn.setAttribute('type', 'button');
    btn.setAttribute('mat-list-item', '');

    btn.appendChild(createIcon(item));

    const spanContent = document.createElement('span');
    spanContent.className = 'mdc-list-item__content';

    const spanPrimary = document.createElement('span');
    spanPrimary.className = 'mat-mdc-list-item-unscoped-content mdc-list-item__primary-text';

    const divFeature = document.createElement('div');
    if (cachedNgAttrs.item) divFeature.setAttribute(cachedNgAttrs.item, '');
    divFeature.className = 'feature-content';

    const divLabels = document.createElement('div');
    if (cachedNgAttrs.item) divLabels.setAttribute(cachedNgAttrs.item, '');
    divLabels.className = 'labels';

    const divLabelFinal = document.createElement('div');
    if (cachedNgAttrs.item) divLabelFinal.setAttribute(cachedNgAttrs.item, '');
    divLabelFinal.className = 'label gds-label-l';

    const labelText = item.label;
    const lowerLabel = labelText.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerLabel.indexOf(lowerQuery);

    if (query && matchIndex !== -1) {
      const before = document.createTextNode(labelText.substring(0, matchIndex));
      const bold = document.createElement('b');
      bold.textContent = labelText.substring(matchIndex, matchIndex + query.length);
      const after = document.createTextNode(labelText.substring(matchIndex + query.length));
      divLabelFinal.appendChild(before);
      divLabelFinal.appendChild(bold);
      divLabelFinal.appendChild(after);
    } else {
      divLabelFinal.textContent = labelText;
    }

    divLabels.appendChild(divLabelFinal);
    divFeature.appendChild(divLabels);
    spanPrimary.appendChild(divFeature);
    spanContent.appendChild(spanPrimary);
    btn.appendChild(spanContent);

    const divFocus = document.createElement('div');
    divFocus.className = 'mat-focus-indicator';
    btn.appendChild(divFocus);

    wrapper.appendChild(btn);
    return wrapper;
  }

  function getCaretCoordinates() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
        const editor = document.querySelector('.ql-editor');
        if (editor) return editor.getBoundingClientRect();
    }
    return rect;
  }

  // --- UI Logic ---

  const UI = {
    open: () => {
      UI.close();

      const menu = document.createElement('div');
      menu.className = 'cdk-overlay-pane command-menu-overlay';
      menu.style.position = 'absolute';
      menu.style.zIndex = '9999';
      menu.style.minWidth = '250px';
      menu.style.maxWidth = '300px';

      const card = document.createElement('mat-card');
      if (cachedNgAttrs.container) card.setAttribute(cachedNgAttrs.container, '');
      card.className = 'mat-mdc-card mdc-card toolbox-drawer-card gemini-command-ui';

      const list = document.createElement('mat-action-list');
      if (cachedNgAttrs.container) list.setAttribute(cachedNgAttrs.container, '');
      list.className = 'mat-mdc-action-list mat-mdc-list-base mdc-list';
      list.setAttribute('role', 'group');
      list.id = 'gemini-command-list';

      card.appendChild(list);
      menu.appendChild(card);

      const container = document.querySelector('.cdk-overlay-container') || document.body;
      container.appendChild(menu);
      state.menuElement = menu;
    },

    close: () => {
      if (state.menuElement && state.menuElement.parentNode) {
        state.menuElement.parentNode.removeChild(state.menuElement);
      }
      state.menuElement = null;
    },

    render: (tools, files, activeIndex, query) => {
      if (!state.menuElement) UI.open();

      const list = state.menuElement.querySelector('#gemini-command-list');
      if (!list) return;

      list.replaceChildren();

      let globalIndex = 0;

      // Render Tools Section
      if (tools.length > 0) {
          list.appendChild(createSectionHeader('Tools'));
          tools.forEach(item => {
              const isActive = globalIndex === activeIndex;
              const el = createMenuItem(item, isActive, query);
              // Bind click
              const btn = el.querySelector('button');
              if (btn) {
                  btn.onmousedown = (e) => { e.preventDefault(); selectItem(item); };
                  // Mark the button with its global index for easy lookup later
                  btn.dataset.index = globalIndex;
              }
              list.appendChild(el);
              globalIndex++;
          });
      }

      // Render Files Section
      if (files.length > 0) {
          list.appendChild(createSectionHeader('Add Files'));
          files.forEach(item => {
              const isActive = globalIndex === activeIndex;
              const el = createMenuItem(item, isActive, query);
              const btn = el.querySelector('button');
              if (btn) {
                  btn.onmousedown = (e) => { e.preventDefault(); selectItem(item); };
                  btn.dataset.index = globalIndex;
              }
              list.appendChild(el);
              globalIndex++;
          });
      }

      try {
          const caret = getCaretCoordinates();
          if (caret && state.menuElement) {
            const menuHeight = state.menuElement.offsetHeight || 300;
            const editorRect = document.querySelector('.ql-editor').getBoundingClientRect();

            let left = caret.left;
            if (left + 300 > editorRect.right) left = editorRect.right - 300;

            const top = caret.top - menuHeight - 10;

            state.menuElement.style.top = `${window.scrollY + top}px`;
            state.menuElement.style.left = `${window.scrollX + left}px`;
          }
      } catch(e) {}
    },

    updateSelection: (activeIndex) => {
      const list = state.menuElement.querySelector('#gemini-command-list');
      if (!list) return;

      const buttons = list.querySelectorAll('button');
      buttons.forEach(btn => {
          const idx = parseInt(btn.dataset.index, 10);
          if (idx === activeIndex) {
              btn.classList.add('mdc-ripple-upgraded--background-focused');
              btn.style.backgroundColor = 'var(--mat-mdc-list-list-item-hover-state-layer-color, rgba(255,255,255,0.08))';
              btn.scrollIntoView({ block: 'nearest' });
          } else {
              btn.classList.remove('mdc-ripple-upgraded--background-focused');
              btn.style.backgroundColor = '';
          }
      });
    }
  };

  // --- Logic Engine ---

  function filterItems() {
    const q = state.query.toLowerCase();

    const filteredTools = cachedMenuData.tools.filter(item => item.label.toLowerCase().includes(q));
    const filteredFiles = cachedMenuData.addFiles.filter(item => item.label.toLowerCase().includes(q));

    state.visibleItems = [...filteredTools, ...filteredFiles];

    if (state.activeIndex >= state.visibleItems.length) {
      state.activeIndex = Math.max(0, state.visibleItems.length - 1);
    }

    if (state.visibleItems.length > 0) {
      UI.render(filteredTools, filteredFiles, state.activeIndex, state.query);
    } else {
      closeMenu();
    }
  }

  function openMenu() {
    state.isOpen = true;
    state.activeIndex = 0;
    state.query = '';
    filterItems();
  }

  function closeMenu() {
    state.isOpen = false;
    state.query = '';
    state.visibleItems = [];
    UI.close();
  }

  async function selectItem(item) {
    const editor = document.querySelector('.ql-editor');
    if (editor) {
      const selection = window.getSelection();
      if (selection.rangeCount) {
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;
        if (textNode.nodeType === Node.TEXT_NODE) {
          const text = textNode.textContent;
          const textBefore = text.substring(0, range.startOffset);
          const triggerIndex = textBefore.lastIndexOf(CONFIG.triggerChar);
          if (triggerIndex !== -1) {
            const charsToRemove = textBefore.length - triggerIndex;
            const afterTriggerNode = textNode.splitText(triggerIndex);
            const currentContent = afterTriggerNode.textContent;
            afterTriggerNode.textContent = currentContent.substring(charsToRemove);
            const newRange = document.createRange();
            newRange.setStart(afterTriggerNode, 0);
            newRange.setEnd(afterTriggerNode, 0);
            selection.removeAllRanges();
            selection.addRange(newRange);
            editor.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      }
    }

    closeMenu();
    await executeAction(item);
  }

  async function executeAction(item) {
    console.log('[Gemini Command] Triggering:', item.label);
    utils.toggleUI(true);

    try {
        const triggerSelector = TRIGGER_SELECTORS[item.category];
        if (!triggerSelector) throw `No trigger for ${item.category}`;

        const triggerBtn = document.querySelector(triggerSelector);
        if (!triggerBtn) throw "Trigger button not found";

        triggerBtn.click();

        let itemSelector = '';
        if (item.iconType === 'img') {
            itemSelector = `.cdk-overlay-container img[src="${item.icon}"]`;
        } else {
            itemSelector = `.cdk-overlay-container mat-icon[data-mat-icon-name="${item.icon}"], .cdk-overlay-container mat-icon[fonticon="${item.icon}"]`;
        }

        const targetIcon = await utils.wait(itemSelector);
        const actionBtn = targetIcon.closest('button, .mat-mdc-list-item');
        const menuPane = actionBtn.closest('.cdk-overlay-pane');

        actionBtn.click();

        await utils.sleep(150);
        if (menuPane && document.body.contains(menuPane)) {
            triggerBtn.click();
        }

    } catch (e) {
        console.error('[Gemini Command] Action Failed:', e);
    } finally {
        utils.toggleUI(false);
    }
  }

  function handleInput(e) {
    const editor = document.querySelector('.ql-editor');
    if (editor && editor.textContent.trim().length === 0) {
       if (state.isOpen) closeMenu();
       return;
    }

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const node = selection.anchorNode;

    if (!node || node.nodeType !== Node.TEXT_NODE) {
        if (state.isOpen) closeMenu();
        return;
    }

    const text = node.textContent;
    const offset = selection.anchorOffset;
    const textBefore = text.substring(0, offset);
    const triggerIndex = textBefore.lastIndexOf(CONFIG.triggerChar);

    if (triggerIndex !== -1) {
      const charBefore = triggerIndex > 0 ? text.charAt(triggerIndex - 1) : null;
      const isValidTrigger = triggerIndex === 0 || charBefore === ' ' || charBefore === '\u00A0';

      if (isValidTrigger) {
        const query = textBefore.substring(triggerIndex + 1);

        if (query.length <= CONFIG.maxQueryLength) {
          if (!state.isOpen) openMenu();
          state.query = query;
          filterItems();
          return;
        }
      }
    }

    if (state.isOpen) closeMenu();
  }

  function handleKeydown(e) {
    if (e.key === 'Backspace') {
        setTimeout(() => {
            const editor = document.querySelector('.ql-editor');
            if (editor && editor.textContent.trim().length === 0) {
                if (state.isOpen) closeMenu();
            }
        }, 0);
    }

    if (!state.isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      state.activeIndex = (state.activeIndex + 1) % state.visibleItems.length;
      UI.updateSelection(state.activeIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      state.activeIndex = (state.activeIndex - 1 + state.visibleItems.length) % state.visibleItems.length;
      UI.updateSelection(state.activeIndex);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      if (state.visibleItems.length > 0) {
        selectItem(state.visibleItems[state.activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    }
  }

  function handleClickOutside(e) {
    if (state.isOpen && state.menuElement && !state.menuElement.contains(e.target)) {
       closeMenu();
    }
  }

  const observer = VM.observe(document.body, () => {
    const editor = document.querySelector('.ql-editor');
    if (editor && !editor.dataset.vmSlashLogicAttached) {
      editor.dataset.vmSlashLogicAttached = 'true';
      editor.addEventListener('input', handleInput);
      editor.addEventListener('keydown', handleKeydown, true);
      editor.addEventListener('click', () => { if(state.isOpen) closeMenu(); });
    }

    // Scrape Tools
    if (!sessionState.toolsDone) {
        const toolsCards = document.querySelectorAll('mat-card.toolbox-drawer-card');
        toolsCards.forEach(card => observeAndScrape(card, 'tools'));
    }

    // Scrape Files
    if (!sessionState.filesDone) {
        const addFilesCards = document.querySelectorAll('mat-card.upload-file-card-container');
        addFilesCards.forEach(card => observeAndScrape(card, 'files'));
    }
  });

  document.addEventListener('click', handleClickOutside);

})();