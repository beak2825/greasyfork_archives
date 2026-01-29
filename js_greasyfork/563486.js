// ==UserScript==
// @name         隐藏网站碍眼元素
// @namespace    http://tampermonkey.net
// @version      0.4.1
// @author       Feny
// @description  隐藏网站上的一些碍眼元素
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABBZJREFUWEfVVwlME2kU/qYttLQKtIIVAW9NEIRoXONqVl2NZrNqIhrURIwbZI0HHjHAqolYPEAB44FHRGOMilHILiYe8Y6S9QxmFSgmaqOIWBDpQQ8svTb/6FS7MyOD1pB9yUw789773vfevP/9+Sl8lKolM+VhdnG2CNQQACMAJDK6AP1WA6jxwPvcLHcXjC45Zye4FLk9S52lEYHaFKBAgmA88OYOPXlWQ2lTUoJlUpdDkFeAjd47JFKqO7Jn8iBVoHSpyWUAUgKcnFC4ckq3MLkWXsQL9QioHQUtqYA3oKBdBPt/EaCkMsgTkiAbFgexUglxuJLO9/0TLYwVZ9A3Jw+USIRGzTrBdRBUAUmvCIRPn4Ue4ydCJFewwM2Xz8NtNkE1NxXOpjdoyMoIHIHQqb/SwQkJPqnPSEP/fUdptT5/E6LW58JQVgrTuT87JcJbgSB1FCJ+W4KQhCQWSHvNIzhe6tBe8xguQyuUs+ejx7ifYKu6B7fRAEKaiK3qPpr37PgiCU4C4tAw9Fm7HtLBw1jOBJAAMxISn4iodRr6kZQ+tnCfn4/LaMCrVem8JFgEKEkQ1Gv+gDxpFMup7epFvDt+xO99TP5uBMf0o5vQersSsUX7WX4O3VPexmQRiPw9Az0nTGaXXVsN/fYPmTIS9ssM9FqQhs+zjExfgZ4Tp7D83x0rQdv1S6z3fgQUY8ZBvTKTs1yWW9fQcuSATyeSyTDg8Cn6ubm4ELYHd+n/JDghwSX6/By019X6qfwIRG3YjJC4BE5nUmLjX2d8OiZTe/U/aCrc8qkn4hJAcLik/Ukt9Hk5/ATkiSPRJ2sjp7P1TiXeHtxN66SDhyJa86G7G7JXwqlv9PmQWdF76WpOjObiItge3OEnQDThM+dANXcBC8BtaUNDdgY8ViuicwsgHTQEpgtnYTh93M9WOXselMnzWP6WyhtoOey/QogR5zIccOgE58Qjn8HV2orI9OVwWy2oX7bIL1Doz9MQkbaUFZzMjaZd+fA6nV9uQkYb3H8gYrbuZBm3lBTTAchSbTm0F5a/b3ZaescLHZp2bqNHNZfwTkJRiByxBcW+Dcd6+xbcFgvI0iPNZKoogywuHpJINSRKFchA+q/YHt6nR7LzzWvO4Lyf4HNr9aosKH74EQ2ZK3xDpnFjJqK3FPGCeuw2ejCZL53ntWEUgnZDel9YvIxeouYrFyFRqaAYPZYTnGRtrChDR/2LToMLqgCDQrpbHBaO1tJjCJ00BUF9Y+jLbTbD3WaCs/E17I+q6M2pKyKoAl0B7KotIfD4O5yChPKoJgROAmBPHqEQ32ZX2v0HE3IoVdoltm9L5Ou8jXKXovsPpwx3ckgNljo3iEANB4XhAT8tUdDCizoPvHUdjqC8+PLyDhL7X7pJoBxFTNpPAAAAAElFTkSuQmCC
// @match        *://*/*
// @grant        GM_addElement
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/563486/%E9%9A%90%E8%97%8F%E7%BD%91%E7%AB%99%E7%A2%8D%E7%9C%BC%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/563486/%E9%9A%90%E8%97%8F%E7%BD%91%E7%AB%99%E7%A2%8D%E7%9C%BC%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MSG_SOURCE = "GM_HIDE_SOME";
  const cssText = "width:0!important;height:0!important;opacity:0!important;display:none!important;";
  const App = {
    isTopWin: () => window === window.top,
    getCache: () => GM_getValue(location.host),
    setCache: (value) => GM_setValue(location.host, value),
    postMessage: (win, data) => win?.postMessage({ source: MSG_SOURCE, ...data }, "*"),
    addStyle(id = "gm_hide_some") {
      const selector = this.getCache();
      document.querySelector(`#${id}`)?.remove();
      selector && GM_addElement("style", { id, textContent: `${selector}{${cssText}}` });
    },
    setupMenuCmds() {
      if (!this.isTopWin()) return;
      const title = "此站要隐藏的元素";
      GM_registerMenuCommand(title, () => {
        const input = prompt(title, this.getCache());
        if (input !== null) this.refreshStyle(input);
      });
    },
    refreshStyle(value) {
      this.setCache(value);
      this.syncDataToIFrames(value);
      Promise.resolve().then(() => this.addStyle());
    },
    syncDataToIFrames(selector) {
      const iFrames = document.querySelectorAll("iframe");
      iFrames.forEach((el) => this.postMessage(el?.contentWindow, { selector }));
    },
    setupEventListener() {
      if (this.isTopWin()) return;
      window.addEventListener("message", ({ data }) => {
        if (!data?.source?.includes(MSG_SOURCE)) return;
        if ("selector" in data) this.refreshStyle(data.selector);
      });
    },
    init() {
      this.addStyle();
      this.setupMenuCmds();
      this.setupEventListener();
    }
  };
  App.init();

})();