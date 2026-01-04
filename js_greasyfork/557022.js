// ==UserScript==
// @name         Gemini Enterprise - Auto Gemini 3 Pro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically switch Gemini Enterprise model selector to Gemini 3 Pro when available.
// @author       schweigen
// @match        https://business.gemini.google/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557022/Gemini%20Enterprise%20-%20Auto%20Gemini%203%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/557022/Gemini%20Enterprise%20-%20Auto%20Gemini%203%20Pro.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_LABEL = '3 Pro';
  const LOG_PREFIX = '[GeminiAuto3Pro]';

  function log() {
    if (typeof console === 'undefined' || !console.log) {
      return;
    }
    var args = Array.prototype.slice.call(arguments);
    args.unshift(LOG_PREFIX);
    console.log.apply(console, args);
  }

  function deepQuerySelector(selector) {
    function search(root) {
      if (!root || !root.querySelector) {
        return null;
      }
      var found = root.querySelector(selector);
      if (found) {
        return found;
      }
      var elements = root.querySelectorAll('*');
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        if (el.shadowRoot) {
          var fromShadow = search(el.shadowRoot);
          if (fromShadow) {
            return fromShadow;
          }
        }
      }
      return null;
    }
    return search(document);
  }

  function deepQuerySelectorAll(selector) {
    var collected = [];
    function search(root) {
      if (!root || !root.querySelectorAll) {
        return;
      }
      var matches = root.querySelectorAll(selector);
      for (var i = 0; i < matches.length; i++) {
        collected.push(matches[i]);
      }
      var elements = root.querySelectorAll('*');
      for (var j = 0; j < elements.length; j++) {
        var el = elements[j];
        if (el.shadowRoot) {
          search(el.shadowRoot);
        }
      }
    }
    search(document);
    return collected;
  }

  function waitForElement(selector, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var start = Date.now();
      log('waitForElement: start polling for', selector);

      function check() {
        var found = deepQuerySelector(selector);
        if (found) {
          log('waitForElement: found:', selector);
          resolve(found);
          return;
        }
        var elapsed = Date.now() - start;
        if (elapsed >= timeoutMs) {
          log('waitForElement: timeout for', selector);
          reject(new Error('Timeout waiting for selector: ' + selector));
          return;
        }
        setTimeout(check, 400);
      }

      check();
    });
  }

  function findModelSelectorHost() {
    const candidates = deepQuerySelectorAll(
      'md-text-button.action-model-selector#model-selector-menu-anchor'
    );
    if (!candidates.length) {
      log('findModelSelectorHost: no candidates');
      return null;
    }

    // Prefer the one that actually looks like the main model selector
    const preferred = candidates.find(function (el) {
      const text = (el.textContent || '').toLowerCase();
      return text.includes('auto') || text.includes('gemini');
    });

    const host = preferred || candidates[candidates.length - 1];
    log(
      'findModelSelectorHost: picked host, text=',
      (host.textContent || '').trim()
    );
    return host;
  }

  function findModelSelectorButton() {
    const host = findModelSelectorHost();
    if (!host) {
      log('findModelSelectorButton: host not found');
      return null;
    }
    const shadowButton = host.shadowRoot && host.shadowRoot.querySelector('button');
    const button = shadowButton || host;
    log('findModelSelectorButton: using element:', button.tagName);
    return button;
  }

  function isAlreadyOnTarget() {
    const host = findModelSelectorHost();
    if (!host) {
      return false;
    }
    const labelText = (host.textContent || '').trim();
    log('isAlreadyOnTarget: current label =', labelText);
    return labelText.includes(TARGET_LABEL);
  }

  function openModelMenuIfNeeded() {
    const menuElement = deepQuerySelector('md-menu.model-selector-menu');
    if (menuElement) {
      const isHidden = menuElement.getAttribute('aria-hidden') === 'true';
      const hasOpenAttribute = menuElement.hasAttribute('open');
      if (!isHidden && hasOpenAttribute) {
        log('openModelMenuIfNeeded: menu already open');
        return true;
      }
    }

    const buttonElement = findModelSelectorButton();
    if (!buttonElement) {
      log('openModelMenuIfNeeded: button not found');
      return false;
    }

    log('openModelMenuIfNeeded: clicking button to open menu');
    buttonElement.click();
    return true;
  }

  function clickGemini3Pro() {
    const menuElement = deepQuerySelector('md-menu.model-selector-menu');
    if (!menuElement) {
      log('clickGemini3Pro: menu element not found');
      return false;
    }

    const menuItems = Array.from(menuElement.querySelectorAll('md-menu-item'));
    if (!menuItems.length) {
      log('clickGemini3Pro: no menu items found');
      return false;
    }

    const targetItem = menuItems.find(function (itemElement) {
      const text = (itemElement.textContent || '').trim();
      log('clickGemini3Pro: checking menu item text =', text);
      return text.includes(TARGET_LABEL);
    });

    if (!targetItem) {
      log('clickGemini3Pro: target item not found for label', TARGET_LABEL);
      return false;
    }

    // Prefer clicking the actual <li id="item"> inside the shadow DOM if present
    var interactiveElement = targetItem;
    if (targetItem.shadowRoot) {
      var li = targetItem.shadowRoot.querySelector('#item');
      if (li) {
        interactiveElement = li;
      }
    }

    log('clickGemini3Pro: clicking target item');
    interactiveElement.click();
    return true;
  }

  function trySelectGemini3ProOnce() {
    if (isAlreadyOnTarget()) {
      log('trySelectGemini3ProOnce: already on target');
      return true;
    }

    const opened = openModelMenuIfNeeded();
    if (!opened) {
      log('trySelectGemini3ProOnce: could not open menu');
      return false;
    }

    setTimeout(function () {
      log('trySelectGemini3ProOnce: attempting to click Gemini 3 Pro');
      waitForElement('md-menu.model-selector-menu', 10000)
        .then(function () {
          clickGemini3Pro();
        })
        .catch(function (err) {
          log('trySelectGemini3ProOnce: menu did not appear in time', err && err.message);
        });
    }, 350);

    return true;
  }

  function bootstrapSelectionWithObserver() {
    log('bootstrapSelectionWithObserver: start');
    waitForElement('md-text-button.action-model-selector#model-selector-menu-anchor', 30000)
      .then(function () {
        setTimeout(function () {
          trySelectGemini3ProOnce();
        }, 50);
      })
      .catch(function () {
        log('bootstrapSelectionWithObserver: waitForElement failed, falling back to single attempt');
        trySelectGemini3ProOnce();
      });
  }

  function removeDisclaimersOnce() {
    var disclaimers = deepQuerySelectorAll('div.disclaimer');
    if (!disclaimers || !disclaimers.length) {
      return false;
    }
    for (var i = 0; i < disclaimers.length; i++) {
      var el = disclaimers[i];
      try {
        log(
          'removeDisclaimersOnce: removing disclaimer with text =',
          (el.textContent || '').trim()
        );
      } catch (e) {
        // ignore logging failures
      }
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      } else if (el && el.remove) {
        el.remove();
      }
    }
    return true;
  }

  function bootstrapDisclaimerRemoval() {
    log('bootstrapDisclaimerRemoval: start');
    var attempts = 0;
    var maxAttempts = 30;

    function tick() {
      attempts++;
      var removed = removeDisclaimersOnce();
      if (removed || attempts >= maxAttempts) {
        if (removed) {
          log('bootstrapDisclaimerRemoval: disclaimer(s) removed');
        } else {
          log('bootstrapDisclaimerRemoval: no disclaimers found after retries');
        }
        return;
      }
      setTimeout(tick, 1000);
    }

    tick();
  }

  log('script loaded');
  if (typeof window !== 'undefined') {
    try {
      window.__GeminiEnterpriseAutoGemini3Pro = true;
    } catch (e) {
      // ignore
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    bootstrapSelectionWithObserver();
    bootstrapDisclaimerRemoval();
  } else {
    window.addEventListener('DOMContentLoaded', function () {
      bootstrapSelectionWithObserver();
      bootstrapDisclaimerRemoval();
    });
  }
})();
