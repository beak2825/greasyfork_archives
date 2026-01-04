// ==UserScript==
// @name         JanitorAI Improvements: Tokens+Definition check+UI/Pagination
// @namespace    http://tampermonkey.net/
// @version      2026.01.02
// @author       WolfgangNoir
// @description  Adds a smart context-sensitive UI to JanitorAI, featuring: advanced token filter, persistent auto-pagination, definition checker, toggles in the settings panel to show/hide definition icon or change opacity of cards
// @match        https://janitorai.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://files.catbox.moe/jer5m2.png
// @downloadURL https://update.greasyfork.org/scripts/550187/JanitorAI%20Improvements%3A%20Tokens%2BDefinition%20check%2BUIPagination.user.js
// @updateURL https://update.greasyfork.org/scripts/550187/JanitorAI%20Improvements%3A%20Tokens%2BDefinition%20check%2BUIPagination.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Solo queda configuración de definición y opacidad por definición
  function getDefinitionCheckEnabled() {
    return typeof GM_getValue !== "undefined" ? GM_getValue("defCheckEnabled", true) : true;
  }
  function setDefinitionCheckEnabled(val) {
    if (typeof GM_setValue !== "undefined") GM_setValue("defCheckEnabled", !!val);
  }
  function getHideOnHiddenDef() {
    return typeof GM_getValue !== "undefined" ? GM_getValue("hideOnHiddenDef", false) : false;
  }
  function setHideOnHiddenDef(val) {
    if (typeof GM_setValue !== "undefined") GM_setValue("hideOnHiddenDef", !!val);
  }

  const TOKEN_FILTER_KEY = 'janitorAITokenFilter';
  const MENU_VISIBLE_KEY = 'janitorAIMenuVisible';
  const PAGINATION_KEY = 'janitorAIPaginationOn';
  const DEFAULT_MIN_TOKENS = 500;
  let minTokens = parseInt(localStorage.getItem(TOKEN_FILTER_KEY), 10) || DEFAULT_MIN_TOKENS;
  let paginationEnabled = localStorage.getItem(PAGINATION_KEY) === 'true';
  let controlPanel = null;

  function isMainOrSearchPage() {
    return (
      location.pathname === '/' ||
      location.pathname.startsWith('/search')
    );
  }

  function insertUI() {
    if (!isMainOrSearchPage()) return;
    if (!document.body) return setTimeout(insertUI, 300);

    if (!document.getElementById('janitor-control-panel')) {
      controlPanel = document.createElement('div');
      controlPanel.id = 'janitor-control-panel';
      Object.assign(controlPanel.style, {
        position: 'fixed',
        top: '100px',
        left: '10px',
        zIndex: '100000',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: 'flex-start'
      });

      const settingsButton = document.createElement('button');
      settingsButton.id = 'token-filter-toggle';
      settingsButton.textContent = '🛠️';
      Object.assign(settingsButton.style, {
        width: '30px',
        height: '30px',
        padding: '0',
        backgroundColor: 'rgba(74, 74, 74, 0.7)',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        transition: 'background-color 0.2s'
      });
      settingsButton.title = 'Show/hide advanced menu';
      settingsButton.onclick = function () {
        const menu = document.getElementById('janitorai-enhanced-ui');
        if (menu) {
          menu.style.display = menu.style.display === 'none' ? '' : 'none';
          localStorage.setItem(MENU_VISIBLE_KEY, menu.style.display !== 'none');
        }
      };
      controlPanel.appendChild(settingsButton);
      document.body.appendChild(controlPanel);
    }

    if (document.getElementById('janitorai-enhanced-ui')) return;

    const container = document.createElement('div');
    container.id = "janitorai-enhanced-ui";
    container.style.position = 'fixed';
    container.style.top = '38px';
    container.style.left = '50px';
    container.style.zIndex = '99999';
    container.style.background = 'rgba(40,40,60,0.98)';
    container.style.padding = '14px 18px';
    container.style.borderRadius = '14px';
    container.style.fontFamily = 'sans-serif';
    container.style.fontSize = '15px';
    container.style.color = '#fff';
    container.style.boxShadow = '0 2px 12px #111a';
    container.style.display = localStorage.getItem(MENU_VISIBLE_KEY) === 'true' ? '' : 'none';

    container.innerHTML =
      `<b>JanitorAI Improvements:</b><br/>` +
      `<label style="display:flex;align-items:center;margin-bottom:10px;">
        <input type="checkbox" id="janitorai-def-toggle-checkbox" style="margin-right:6px;" ${getDefinitionCheckEnabled() ? "checked" : ""}>
        Enable definition status icon
      </label>` +
      `<label style="display:flex;align-items:center;margin-bottom:10px;">
        <input type="checkbox" id="janitorai-hide-def-checkbox" style="margin-right:6px;" ${getHideOnHiddenDef() ? "checked" : ""}>
        Change opacity if definition is hidden
      </label>` +
      `Min tokens:
      <input id="janitorai-token-input" type="number" value="${minTokens}" style="width:80px;">
      <button id="janitorai-token-save">Filter</button>
      <hr style="margin:8px 0;">
      <button id="janitorai-toggle-pagination">Auto-pagination: <span id="janitorai-pagination-state">${paginationEnabled ? 'ON' : 'OFF'}</span></button>
    `;

    document.body.appendChild(container);

    document.getElementById('janitorai-def-toggle-checkbox').onchange = function(e) {
      setDefinitionCheckEnabled(e.target.checked);
      document.querySelectorAll('.definition-status-icon').forEach(ic => ic.remove());
      document.querySelectorAll('.profile-character-card-stack-link-component').forEach(card => card.removeAttribute('custom-icons-checked'));
    };
    document.getElementById('janitorai-hide-def-checkbox').onchange = function(e) {
      setHideOnHiddenDef(e.target.checked);
      document.querySelectorAll('.profile-character-card-stack-link-component').forEach(card => card.removeAttribute('custom-icons-checked'));
    };
    document.getElementById('janitorai-token-save').onclick = function () {
      const value = parseInt(document.getElementById('janitorai-token-input').value, 10);
      minTokens = isNaN(value) ? DEFAULT_MIN_TOKENS : value;
      localStorage.setItem(TOKEN_FILTER_KEY, minTokens);
      filterCards();
    };
    document.getElementById('janitorai-toggle-pagination').onclick = function () {
      paginationEnabled = !paginationEnabled;
      document.getElementById('janitorai-pagination-state').innerText = paginationEnabled ? "ON" : "OFF";
      localStorage.setItem(PAGINATION_KEY, paginationEnabled);
    };
  }

  function parseTokens(cardElement) {
    const tokenSpan = cardElement.querySelector(".chakra-text.pp-cc-tokens-count.profile-character-card-tokens-count");
    if (tokenSpan) {
      const raw = tokenSpan.textContent.replace(/\s+tokens?/i, '').trim();
      let tokens;
      if (raw.endsWith('k')) {
        tokens = parseFloat(raw) * 1000;
      } else {
        tokens = parseInt(raw.replace(/\D/g, ''), 10);
      }
      return tokens;
    }
    return null;
  }

  function filterCards() {
    if (!isMainOrSearchPage()) return;
    const cards = document.querySelectorAll('.pp-cc-wrapper.profile-character-card-wrapper');
    cards.forEach(card => {
      const tokens = parseTokens(card);
      card.style.display = (tokens !== null && tokens >= minTokens) ? '' : 'none';
    });
  }

  (function() {
    let isNavigating = false;
    let scrollCount = 0;
    const requiredScrolls = 3;
    const pageDelay = 2000;

    function isAtVeryBottom() {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      return pageHeight - scrollPosition <= 1;
    }

    function getNextPageElement() {
      return document.querySelector('button[aria-label="Next Page"]:not([disabled]),button.profile-pagination-next-button:not([disabled])');
    }

    window.addEventListener('wheel', function(event) {
      if (!paginationEnabled || isNavigating || !isMainOrSearchPage()) return;
      if (event.deltaY > 0 && isAtVeryBottom()) {
        scrollCount++;
        if (scrollCount >= requiredScrolls) {
          const nextPage = getNextPageElement();
          if (nextPage) {
            isNavigating = true;
            nextPage.click();
            setTimeout(() => {
              isNavigating = false;
              scrollCount = 0;
            }, pageDelay);
          }
        }
      } else if (!isAtVeryBottom()) {
        scrollCount = 0;
      }
    }, { passive: true });
  })();

  // ========= SOLO DEFINICIÓN =========

  async function definitionIsHidden(characterURL) {
    try {
      const response = await fetch(characterURL);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const elements = doc.querySelectorAll('h4, div, span');
      for (let el of elements) {
        if (el.textContent && el.textContent.includes("Character Definition is hidden")) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  setInterval(async function () {
    const hideOnHiddenDef = getHideOnHiddenDef();
    const showDef = getDefinitionCheckEnabled();
    const characterCardElements = [...document.querySelectorAll(".profile-character-card-stack-link-component")];

    for (let i = 0; i < characterCardElements.length; i++) {
      const element = characterCardElements[i];
      if (!document.body.contains(element)) continue;
      if (!element.getAttribute("custom-icons-checked")) {
        element.setAttribute("custom-icons-checked", "yes");
        const cardWrapper = element.parentElement.parentElement;
        const titleElement = element.children[0] && element.children[0].children[0];

        let defRes = false;
        if (showDef || hideOnHiddenDef) defRes = await definitionIsHidden(element.href);

        let faded = false;
        if (hideOnHiddenDef && defRes) faded = true;
        if (cardWrapper) {
          cardWrapper.style.opacity = faded ? 0.25 : 1;
          cardWrapper.style.pointerEvents = faded ? "none" : "";
        }

        ['definition-status-icon'].forEach(cls => {
          const old = titleElement && titleElement.querySelector('.'+cls);
          if (old) old.remove();
        });

        if (showDef) {
          const defIcon = document.createElement('span');
          defIcon.className = 'definition-status-icon';
          defIcon.style.marginRight = "6px";
          defIcon.style.fontSize = "1.2em";
          defIcon.textContent = defRes ? "❌" : "✅";
          defIcon.title = defRes ? "Definition is hidden" : "Definition visible";
          if (titleElement && titleElement.firstChild) titleElement.insertBefore(defIcon, titleElement.firstChild);
          else if (titleElement) titleElement.appendChild(defIcon);
        }
      }
    }
  }, 2500);

  let lastLocation = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastLocation) {
      lastLocation = location.pathname;
      onPageChange();
    }
  }, 400);

  function onPageChange() {
    document.getElementById('janitor-control-panel')?.remove();
    document.getElementById('janitorai-enhanced-ui')?.remove();

    insertUI();
    filterCards();
    observerDom.observe(document.body, {childList: true, subtree: true});
  }

  const observerDom = new MutationObserver(() => {
    insertUI();
    filterCards();
  });

  onPageChange();
})();
