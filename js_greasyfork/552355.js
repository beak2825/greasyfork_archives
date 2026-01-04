// ==UserScript==
// @name         Smartschool_Edit
// @namespace    http://tampermonkey.net/
// @version      0.8.1.1
// @description  Smartschool aanpassen met extra functies: voorspelling van punten, nav kleuren, etc.
// @license      MIT
// @author       andreasthuis
// @match        https://*.smartschool.be/*
// @exclude      https://*.smartschool.be/index.php?module=Messages&file=composeMessage&*
// @exclude      https://*.smartschool.be/Upload/*
// @exclude      https://wopi2.smartschool.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartschool.be
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      raw.githubusercontent.com
// @connect      sm-edit.andreasdeborger27.workers.dev
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552355/Smartschool_Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/552355/Smartschool_Edit.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const baseUrl =
    "https://raw.githubusercontent.com/andreasthuis/Smartschool_edit/main/";
  const cssFiles = ["root.css"];
  const jsFiles = ["root.js"];

  // --- Loaders ---
  function loadCSS(path) {
    GM_xmlhttpRequest({
      method: "GET",
      url: baseUrl + path,
      onload: (res) => {
        if (res.status === 200) GM_addStyle(res.responseText);
        else console.error("❌ Failed to load CSS:", res.status, path);
      },
      onerror: (err) => console.error("❌ CSS request failed:", err),
    });
  }

  function loadJS(path) {
    GM_xmlhttpRequest({
      method: "GET",
      url: baseUrl + path,
      onload: (res) => {
        if (res.status === 200) {
          const script = document.createElement("script");
          script.textContent = res.responseText;
          document.documentElement.appendChild(script);
          script.remove();
        } else {
          console.error("❌ Failed to load JS:", res.status, path);
        }
      },
      onerror: (err) => console.error("❌ JS request failed:", err),
    });
  }

  const global = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  global.smartschool_loadScript = loadJS;
  global.smartschool_loadStyles = loadCSS;

  global.smartschool_webRequest = function (
    method,
    url,
    data = null,
    headers = {}
  ) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers: Object.assign({ "Content-Type": "application/json" }, headers),
        data: data ? JSON.stringify(data) : undefined,
        onload: (res) => {
          try {
            resolve(JSON.parse(res.responseText));
          } catch {
            resolve(res.responseText);
          }
        },
        onerror: (err) => reject(err),
        ontimeout: () => reject(new Error("Request timed out")),
      });
    });
  };

  global.smartschoolSettings = {
    get: (key, def) => {
      try {
        return GM_getValue(key, def);
      } catch (e) {
        console.error("[smartschoolSettings] get error", e);
        return def;
      }
    },
    set: (key, value) => {
      try {
        GM_setValue(key, value);
      } catch (e) {
        console.error("[smartschoolSettings] set error", e);
      }
    },
  };

  const $ = window.jQuery;

  /**
   * Wait until a selector appears in the DOM
   * @param {string} selector
   * @param {number} timeout - in ms (default 10s)
   */
  function waitForSelector(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const el = $(selector);
      if (el.length) return resolve(el);

      const observer = new MutationObserver(() => {
        const e = $(selector);
        if (e.length) {
          observer.disconnect();
          resolve(e);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      if (timeout > 0) {
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout waiting for selector: ${selector}`));
        }, timeout);
      }
    });
  }

  /**
   * Adds a persistent element (auto-reappears if removed)
   * @param {object} options
   * @param {string} options.parentSelector - Where to insert
   * @param {string} options.elementId - Unique ID
   * @param {string|jQuery|HTMLElement} options.content - Inner HTML / element to insert
   * @param {string} [options.insertType='append'] - append | prepend | before | after
   * @param {function} [options.onClick] - Optional click handler
   */
  async function addPersistentElement({
    parentSelector,
    elementId,
    content,
    insertType = "append",
    onClick,
  }) {
    const parent = await waitForSelector(parentSelector, 15000);
    const parentEl = parent[0];
    if (!parentEl) return console.error("Parent not found:", parentSelector);

    if (!$(`#${elementId}`).length) {
      const $el = $("<div/>").attr("id", elementId).addClass("auto-element");

      if (typeof content === "string") $el.html(content);
      else $el.append(content);

      if (onClick) $el.on("click", onClick);

      switch (insertType) {
        case "prepend":
          parent.prepend($el);
          break;
        case "before":
          parent.before($el);
          break;
        case "after":
          parent.after($el);
          break;
        default:
          parent.append($el);
      }
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.removedNodes.length) {
          mutation.removedNodes.forEach((node) => {
            if (node.id === elementId) {
              console.warn(`[PersistentElement] Re-adding ${elementId}`);
              addPersistentElement({
                parentSelector,
                elementId,
                content,
                insertType,
                onClick,
              });
            }
          });
        }
      }
    });
    observer.observe(parentEl, { childList: true, subtree: false });
  }

  global.smartschool_addElement = addPersistentElement;

  function loadAllAssets() {
    cssFiles.forEach(loadCSS);
    jsFiles.forEach(loadJS);
  }

  loadAllAssets();
})();
