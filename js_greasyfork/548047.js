// ==UserScript==
// @name:zh-CN  Telegram 网页全屏
// @name:zh-TW  Telegram 網頁全螢幕
// @name:ja     Telegram ウェブ全画面
// @name        Telegram in-page fullscree
// @namespace    http://tampermonkey.net/
// @version      1.3
// @icon         https://img.icons8.com/color/452/telegram-app--v5.png
// @description:zh-CN  为网页Telegram添加视频播放网页全屏功能
// @description:zh-TW  為網頁Telegram添加視頻播放網頁全螢幕功能
// @description:ja     ウェブ版Telegramに動画再生の全画面機能を追加
// @description  Add browser viewport full video playback feature for WebTelegram
// @author       zolay-poi
// @match        https://web.telegram.org/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548047/Telegram%20%E3%82%A6%E3%82%A7%E3%83%96%E5%85%A8%E7%94%BB%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/548047/Telegram%20%E3%82%A6%E3%82%A7%E3%83%96%E5%85%A8%E7%94%BB%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const i18n = {
    en: { enter: "Web Fullscreen", exit: "Exit Web Fullscreen" },
    "zh-CN": { enter: "网页全屏", exit: "退出网页全屏" },
    "zh-TW": { enter: "網頁全螢幕", exit: "退出網頁全螢幕" },
    ja: { enter: "ウェブ全画面", exit: "ウェブ全画面を終了" },
  };

  const language = navigator.language || navigator.userLanguage || "en";
  const baseLang = language.split("-")[0];
  const resolvedLang =
    (i18n[language] && language) ||
    (i18n[baseLang] && baseLang) ||
    (baseLang === "zh" ? "zh-CN" : "en");

  const h = (key) => i18n[resolvedLang][key];

  const doms = {
    btn: null,
    span: null,
  };

  const btnCls = "my-btn-dom-fullscreen";
  const fullCls = "tg-inner-fs";
  const styleId = "tg-inner-fs-style-tag";

  const CONTAINER_SELECTORS = [
    "body div.media-viewer-whole.active div.right-controls",
    "div.media-viewer-whole.active .right-controls",
    ".media-viewer-whole .right-controls",
    ".right-controls",
  ];

  const TARGET_SELECTORS = [
    "div.media-viewer-whole.active .media-viewer-mover.center.active",
    ".media-viewer-whole.active .media-viewer-mover.center.active",
    ".media-viewer-whole.active .media-viewer-mover.center",
    ".media-viewer-whole .media-viewer-mover.center.active",
    ".media-viewer-mover.center.active",
  ];

  function findTarget() {
    for (const sel of TARGET_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function findContainer() {
    for (const sel of CONTAINER_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  const spanIcons = {
    enter: "\ue969",
    exit: "\ue948",
  };

  function ensureStyle() {
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .${fullCls} .media-viewer-topbar,
      .${fullCls} .media-viewer-caption {
        display: none !important;
      }
      .${fullCls} .media-viewer-mover.center {
        width: 100% !important;
        height: 100% !important;
        max-height: 100% !important;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureDoms() {
    if (!doms.btn || !(doms.btn instanceof HTMLElement)) {
      const btn = document.createElement("div");
      btn.title = h("enter");
      btn.className = btnCls + " btn-icon default__button";

      const span = document.createElement("span");
      span.className = "tgico button-icon";
      span.innerText = spanIcons.enter;
      btn.appendChild(span);

      btn.addEventListener("click", function () {
        const target = findTarget();
        if (!target) return;

        const isFull = btn.dataset.fullscreen === "1";
        if (isFull) {
          document.body.classList.remove(fullCls);
          btn.dataset.fullscreen = "0";
          doms.span && (doms.span.innerText = spanIcons.enter);
          btn.title = h("enter");
        } else {
          document.body.classList.add(fullCls);
          btn.dataset.fullscreen = "1";
          doms.span && (doms.span.innerText = spanIcons.exit);
          btn.title = h("exit");
        }
      });

      doms.btn = btn;
      doms.span = span;
    } else if (!doms.span || !(doms.span instanceof HTMLElement)) {
      const existed = doms.btn.querySelector("span.tgico.button-icon");
      if (existed) doms.span = existed;
    }
    return doms;
  }

  function insertBeforeLastChild(container, node) {
    const last = container.lastElementChild;
    if (last) {
      container.insertBefore(node, last);
    } else {
      container.appendChild(node);
    }
  }

  function tryInsert() {
    const container = findContainer();
    if (!container) return false;
    ensureStyle();
    const existed = container.querySelector("." + btnCls);
    const { btn } = ensureDoms();
    if (existed || container.contains(btn)) return true;
    insertBeforeLastChild(container, btn);
    return true;
  }

  let pending = false;
  function scheduleTryInsert() {
    if (pending) return;
    pending = true;
    (window.requestAnimationFrame || window.setTimeout)(() => {
      pending = false;
      tryInsert();
    }, 16);
  }

  tryInsert();

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList" && (m.addedNodes.length || m.removedNodes.length)) {
        scheduleTryInsert();
        break;
      }
      if (m.type === "attributes" && m.attributeName === "class") {
        const t = m.target;
        if (t && t.nodeType === 1) {
          const el = t;
          if (el.matches && (el.matches(".media-viewer-whole") || el.matches(".right-controls"))) {
            scheduleTryInsert();
            break;
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

  window.addEventListener("beforeunload", () => observer.disconnect());
})();
