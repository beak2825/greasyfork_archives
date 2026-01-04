// ==UserScript==
// @name         Kinopoisk to Flcksbr
// @namespace    https://example.local/
// @version      1.0
// @description  Добавляет на Kinopoisk кнопку перехода на flcksbr для открытия соответствующей страницы фильма/сериала.
// @match        *://kinopoisk.ru/*
// @match        *://www.kinopoisk.ru/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559598/Kinopoisk%20to%20Flcksbr.user.js
// @updateURL https://update.greasyfork.org/scripts/559598/Kinopoisk%20to%20Flcksbr.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function injectStyle(cssText) {
    const style = document.createElement("style");
    style.type = "text/css";
    style.textContent = cssText;

    const target = document.head || document.documentElement;
    target.appendChild(style);
    return style;
  }

  injectStyle(`
.flickbar_button{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:4px 10px 4px;
  white-space:nowrap;
  color:#fff;
  border-radius:4px;
  font-family:Graphik Kinopoisk LC Web, Arial, sans-serif;
  font-weight:500;
  font-size:11px;
  line-height:14px;
  text-decoration:none;
  box-shadow:0 1px 2px rgba(0,0,0,.4);
  background:-webkit-radial-gradient(0 100.29%, 96.72% 187.09%, #ff5c00 5.21%, #ea507c 25.52%, #b941ef 48.44%, #5b61ff 70.83%, #21bee7 93.75%);
  background:radial-gradient(96.72% 187.09% at 0 100.29%, #ff5c00 5.21%, #ea507c 25.52%, #b941ef 48.44%, #5b61ff 70.83%, #21bee7 93.75%);
}
[class^="styles_buttonsContainer"] .flickbar_button{
  height:22px;
  padding:11px 32px;
  border-radius:30px;
  font-family:Graphik Kinopoisk LC Web, Arial, sans-serif;
  font-size:15px;
  line-height:20px;
  background:-webkit-radial-gradient(0 100.29%, 96.72% 187.09%, #ff5c00 5.21%, #ea507c 25.52%, #b941ef 48.44%, #5b61ff 70.83%, #21bee7 93.75%);
  background:radial-gradient(96.72% 187.09% at 0 100.29%, #ff5c00 5.21%, #ea507c 25.52%, #b941ef 48.44%, #5b61ff 70.83%, #21bee7 93.75%);
}
  `);

  class KinopoiskToFlcksbr {
    constructor() {
      this.observerRoot = null;
      this.observerList = null;
      this.scheduled = false;

      this.SELECTORS = {
        root: "#__next",
        listRoot: "[class^='styles_contentSlot__'] main",
        cardLink: "[class^='base-movie-main-info_link']",
        buttonsContainer: "[class^='styles_buttonsContainer']",
        buttonClass: "flickbar_button"
      };
    }

    init() {
      if (!/(\.|^)kinopoisk\.ru$/i.test(location.hostname)) return;

      const root = document.querySelector(this.SELECTORS.root);
      if (!root) return;

      this.refresh();

      this.observerRoot = new MutationObserver(() => this.scheduleRefresh());
      this.observerRoot.observe(root, { childList: true, subtree: true });
    }

    scheduleRefresh() {
      if (this.scheduled) return;
      this.scheduled = true;

      requestAnimationFrame(() => {
        this.scheduled = false;
        this.refresh();
      });
    }

    refresh() {
      const listNode = document.querySelector(this.SELECTORS.listRoot);

      if (this.observerList) {
        this.observerList.disconnect();
        this.observerList = null;
      }

      if (listNode) {
        this.updateList();
        this.observerList = new MutationObserver(() => this.scheduleRefresh());
        this.observerList.observe(listNode, { childList: true, subtree: true });
      }

      const buttons = document.querySelector(this.SELECTORS.buttonsContainer);
      if (buttons) this.insertButtonOnSinglePage(buttons);
    }

    updateList() {
      document.querySelectorAll(this.SELECTORS.cardLink).forEach((item) => {
        if (!item || !item.href) return;

        const next = item.nextElementSibling;
        if (next && next.classList && next.classList.contains(this.SELECTORS.buttonClass)) return;

        item.after(this.createLink(item.href));
      });
    }

    insertButtonOnSinglePage(wrapperButtons) {
      if (wrapperButtons.querySelector("." + this.SELECTORS.buttonClass)) return;

      const wrap = document.createElement("div");
      wrap.append(this.createLink(window.location.href));
      wrapperButtons.prepend(wrap);
    }

    createLink(href) {
      const a = document.createElement("a");
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.classList.add(this.SELECTORS.buttonClass);
      a.textContent = "Смотреть на flcksbr";
      a.href = this.mapToFlcksbr(href);
      return a;
    }

    mapToFlcksbr(href) {
      try {
        const u = new URL(href, window.location.origin);
        u.hostname = "flcksbr.lat";
        u.protocol = "https:";
        return u.toString();
      } catch (e) {
        return href;
      }
    }
  }

  new KinopoiskToFlcksbr().init();
})();