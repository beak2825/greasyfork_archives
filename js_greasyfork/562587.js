// ==UserScript==
// @name        Walls Begone
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/factions.php*
// @grant       GM_addStyle
// @version     1.01
// @license     MIT
// @author      Bilbosaggings[2323763]
// @description walls big. mobile people scroll long time. this fix
// @downloadURL https://update.greasyfork.org/scripts/562587/Walls%20Begone.user.js
// @updateURL https://update.greasyfork.org/scripts/562587/Walls%20Begone.meta.js
// ==/UserScript==

const scriptKey = 'WallsBegone';

const defaultSettings = {
  'walls-begone': false,
};

const log = (...args) => console.log(`[${scriptKey}]: `, ...args);

const err = (...args) => console.error(`[${scriptKey}]: `, ...args);

const waitForElement = async (selector, target = document.body) => {
  return new Promise((resolve) => {
    if (target.querySelector(selector)) {
      resolve(target.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (target.querySelector(selector)) {
        resolve(target.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(target, {
      subtree: true,
      childList: true,
    });
  });
};

let storageCache;

const clearStorage = () => {
  localStorage.removeItem(scriptKey);
  storageCache = null;
  log('Storage Cleared');
};

const getStorage = (key) => {
  const data = localStorage.getItem(scriptKey);

  const json = JSON.parse(data) ?? storageCache ?? defaultSettings;

  storageCache = json;

  return key ? json[key] : json;
};

const updateStorage = (key, value) => {
  const data = getStorage();

  data[key] = value;

  storageCache = data;

  localStorage.setItem(scriptKey, JSON.stringify(data));
};

const makeButton = () => {
  const btn = document.createElement('button');
  btn.id = `${scriptKey}-walls-begone`;
  btn.className = `${scriptKey}-walls-begone right`;

  btn.textContent = 'Walls Begone';

  btn.addEventListener('click', () => {
    try {
      btn.disabled = true;

      const newState = !getStorage('walls-begone');

      updateStorage('walls-begone', newState);

      toggleHides();
    } catch (e) {
      err('Error: ', e);
    } finally {
      btn.disabled = false;
    }
  });

  return btn;
};

const insertButton = () => {
  waitForElement('#top-page-links-list').then((element) => {
    if(element.querySelector(`#${scriptKey}-walls-begone`)) return

    element.appendChild(makeButton());
  });
};

const toggleHideElement = (element) => {
  if (!element.dataset.initialDisplay)
    element.dataset.initialDisplay = getComputedStyle(element).display;

  const hide = getStorage('walls-begone');

  element.style.display = hide ? 'none' : element.dataset.initialDisplay;
};

const hideWalls = () => {
  waitForElement('#faction_war_list_id')
    .then((list) => {
      for (const child of list.children) toggleHideElement(child);
    })
    .catch((e) => err('Error hiding faction walls. Error: ', e));
};

const hideFactionStatusMessage = () => {
  waitForElement('[class*="f-msg"]')
    .then((element) => toggleHideElement(element))
    .catch((e) => err('Error hiding faction status. Error: ', e));
};

const hideFactionDescription = () => {
  waitForElement('[class*="titleToggle"]')
    .then((element) => toggleHideElement(element))
    .catch((e) => err('Error hiding faction description title. Error: ', e));
  waitForElement('[class*="faction-description"]')
    .then((element) => toggleHideElement(element))
    .catch((e) => err('Error hiding faction description body. Error: ', e));
};

const toggleHides = () => {
  hideFactionStatusMessage();
  hideWalls();
  hideFactionDescription();
};

(() => {
  insertButton();

  toggleHides();
})();

GM_addStyle(`
  .${scriptKey}-walls-begone {
    --btn-background: linear-gradient(
      180deg,
      #a42a2a 0%,
      #b03030 25%,
      #8f2323 60%,
      #7c1d1d 78%,
      #6b1717 100%
    ) !important;
    --btn-border: 1px solid #5a1414 !important;
    --btn-color: #ffffff !important;
    --btn-text-shadow: 0 1px 0 rgba(0, 0, 0, 0.35) !important;

    background: var(--btn-background) !important;
    border: var(--btn-border) !important;
    color: var(--btn-color) !important;
    text-shadow: var(--btn-text-shadow) !important;

    cursor: pointer !important;
    transition: background 0.15s ease, filter 0.15s ease;

    width: fit-content !important;
    height: fit-content !important;
    padding: 2px 4px !important;
    margin: 0 4px !important;
    border-radius: 6px;
  }

  .${scriptKey}-walls-begone:hover{
    --btn-background: linear-gradient(
      180deg,
      #b03030 0%,
      #c03535 25%,
      #9b2626 60%,
      #8a2020 78%,
      #781a1a 100%
    ) !important;
    background: var(--btn-background) !important;
    filter: brightness(1.1);
  }

  .${scriptKey}-walls-begone:active {
    --btn-background: linear-gradient(
      180deg,
      #7c1d1d 0%,
      #8a2020 25%,
      #6b1717 60%,
      #5a1414 78%,
      #4a1010 100%
    ) !important;
    background: var(--btn-background) !important;
    filter: brightness(0.9);
  }
`);
