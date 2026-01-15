// ==UserScript==
// @name         TORN: Comeback Notify
// @namespace    dekleinekobini.private.comeback-notify
// @version      1.0.1
// @author       DeKleineKobini [2114440]
// @description  Notify you when comeback is active on your weapon.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562576/TORN%3A%20Comeback%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/562576/TORN%3A%20Comeback%20Notify.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const stylesString = ".comeback-active [class*='itemBorder___'] {\n    border: 3px solid green;\n}\n\n.comeback-not-active [class*='itemBorder___'] {\n    border: 3px solid red;\n}";
  function findByPartialClass(node, className, subSelector = "") {
    return node.querySelector(`[class*='${className}'] ${subSelector}`.trim());
  }
  async function findDelayed(node, findElement, timeout) {
    return new Promise((resolve, reject) => {
      const initialElement = findElement();
      if (initialElement) {
        resolve(initialElement);
        return;
      }
      const observer = new MutationObserver(() => {
        const element = findElement();
        element && (clearTimeout(timeoutId), observer.disconnect(), resolve(element));
      }), timeoutId = setTimeout(() => {
        observer.disconnect(), reject("Failed to find the element within the acceptable timeout.");
      }, timeout);
      observer.observe(node, { childList: true, subtree: true });
    });
  }
  async function findByPartialClassDelayed(node, className, subSelector = "", timeout = 5e3) {
    return findDelayed(node, () => findByPartialClass(node, className, subSelector), timeout);
  }
  async function main() {
    if (new URL(window.location.href).searchParams.get("sid") !== "attack") return;
    injectStyles();
    const lifeElement = await findByPartialClassDelayed(document, "iconHealth___", "+ span");
    new MutationObserver(() => checkWeapons()).observe(lifeElement, { characterData: true, subtree: true });
    checkWeapons();
  }
  function injectStyles() {
    const styleElement = document.createElement("style");
    styleElement.setAttribute("type", "text/css");
    styleElement.innerHTML = stylesString;
    document.head.appendChild(styleElement);
  }
  function checkWeapons() {
    const comebackActive = isComebackActive();
    Array.from(document.querySelectorAll("[class*='weaponList___'] [class*='weaponWrapper___'][aria-describedby*='attacker']")).filter(hasWeaponComeback).forEach((weapon) => {
      if (comebackActive) {
        weapon.classList.add("comeback-active");
        weapon.classList.remove("comeback-not-active");
      } else {
        weapon.classList.remove("comeback-active");
        weapon.classList.add("comeback-not-active");
      }
    });
  }
  function hasWeaponComeback(weapon) {
    return weapon.querySelector("[data-bonus-attachment-title='Comeback']");
  }
  function isComebackActive() {
    const lifeElement = findByPartialClass(document, "iconHealth___", "+ span");
    if (!lifeElement) return false;
    const lifeText = lifeElement.textContent.split(" / ").map((s) => s.replaceAll(",", "").trim());
    const currentHealth = parseInt(lifeText[0]);
    const maximumHealth = parseInt(lifeText[1]);
    return currentHealth < maximumHealth * 0.25;
  }
  main().catch(console.error);

})();