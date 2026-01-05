// ==UserScript==
// @name         ChatGPT 推理强度快捷切换（⌘O：Light ↔ Heavy / Standard ↔ Extended）
// @namespace    https://github.com/lueluelue2006/ChatGPT-Reasoning-Effort-Toggle
// @version      1.1
// @description  在 chatgpt.com 使用 ⌘O 切换推理强度：5.2 Thinking(四档)在 Light↔Heavy 之间切；5.2 Pro(两档)在 Standard↔Extended 之间切；每次切换会在控制台输出检测模式与目标档位，并让选择器闪一下提示已切换。
// @author       schweigen
// @license      MIT
// @match        https://chatgpt.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558764/ChatGPT%20%E6%8E%A8%E7%90%86%E5%BC%BA%E5%BA%A6%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%EF%BC%88%E2%8C%98O%EF%BC%9ALight%20%E2%86%94%20Heavy%20%20Standard%20%E2%86%94%20Extended%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558764/ChatGPT%20%E6%8E%A8%E7%90%86%E5%BC%BA%E5%BA%A6%E5%BF%AB%E6%8D%B7%E5%88%87%E6%8D%A2%EF%BC%88%E2%8C%98O%EF%BC%9ALight%20%E2%86%94%20Heavy%20%20Standard%20%E2%86%94%20Extended%EF%BC%89.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const DEBUG = false;
  const LOG_PREFIX = "[TM][ThinkingToggle]";
  const PULSE_STYLE_ID = "__tm_thinking_toggle_pulse_style";
  const PULSE_CLASS = "__tm_thinking_toggle_pulse";

  let busy = false;

  function log(...args) {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.debug(LOG_PREFIX, ...args);
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function ensurePulseStyle() {
    if (document.getElementById(PULSE_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = PULSE_STYLE_ID;
    style.textContent = `
@keyframes __tmThinkingTogglePulse {
  0%   { transform: scale(1);    box-shadow: 0 0 0 0 rgba(56,189,248,0);    filter: brightness(1); }
  45%  { transform: scale(1.06); box-shadow: 0 0 0 6px rgba(56,189,248,.35); filter: brightness(1.18); }
  100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(56,189,248,0);    filter: brightness(1); }
}
button.${PULSE_CLASS} {
  animation: __tmThinkingTogglePulse 650ms ease-in-out 0s 1;
  will-change: transform, box-shadow, filter;
}
`;
    (document.head || document.documentElement).appendChild(style);
  }

  function pulseOnce(el) {
    if (!(el instanceof HTMLElement)) return;
    ensurePulseStyle();
    try {
      el.classList.remove(PULSE_CLASS);
      // 强制 reflow 以便重复触发动画
      void el.offsetWidth;
      el.classList.add(PULSE_CLASS);
    } catch (_) {
      // ignore
    }
  }

  function schedulePulse(pill) {
    window.setTimeout(() => {
      let target = pill;
      if (!(target instanceof HTMLElement) || !document.contains(target)) {
        const root = getComposerRoot();
        const pills = Array.from(root.querySelectorAll("button.__composer-pill"));
        target =
          pills.find((p) => /thinking|pro/i.test((p.textContent || "").trim())) || pills[0] || null;
      }
      if (target) pulseOnce(target);
    }, 80);
  }

  function info(message) {
    // eslint-disable-next-line no-console
    console.log(LOG_PREFIX, message);
  }

  function warn(message) {
    // eslint-disable-next-line no-console
    console.warn(LOG_PREFIX, message);
  }

  function error(message, err) {
    // eslint-disable-next-line no-console
    if (typeof err === "undefined") console.error(LOG_PREFIX, message);
    else console.error(LOG_PREFIX, message, err);
  }

  function isHotkey(event) {
    if (!event.metaKey) return false;
    if (event.ctrlKey || event.altKey || event.shiftKey) return false;

    const code = typeof event.code === "string" ? event.code : "";
    const key = typeof event.key === "string" ? event.key : "";
    return code === "KeyO" || key.toLowerCase() === "o";
  }

  function clickLikeUser(el) {
    if (!(el instanceof Element)) return false;
    try {
      el.focus?.();
    } catch (_) {
      // ignore
    }

    const base = { bubbles: true, cancelable: true };

    try {
      el.dispatchEvent(
        new PointerEvent("pointerdown", {
          ...base,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
        })
      );
      el.dispatchEvent(
        new PointerEvent("pointerup", {
          ...base,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
        })
      );
    } catch (_) {
      // ignore
    }

    el.dispatchEvent(new MouseEvent("mousedown", base));
    el.dispatchEvent(new MouseEvent("mouseup", base));
    el.dispatchEvent(new MouseEvent("click", base));
    return true;
  }

  function getComposerRoot() {
    return document.querySelector("#thread-bottom-container") || document.body;
  }

  function listComposerPills() {
    const root = getComposerRoot();
    return Array.from(
      root.querySelectorAll(
        "button.__composer-pill[aria-haspopup='menu'],button.__composer-pill"
      )
    ).filter((el) => el instanceof HTMLButtonElement);
  }

  function getEffortItems(menu) {
    const items = Array.from(menu.querySelectorAll("[role='menuitemradio']"));
    /** @type {Element|null} */
    let light = null;
    /** @type {Element|null} */
    let standard = null;
    /** @type {Element|null} */
    let extended = null;
    /** @type {Element|null} */
    let heavy = null;

    for (const item of items) {
      const t = (item.textContent || "").trim().toLowerCase();
      if (!light && /\blight\b/.test(t)) light = item;
      if (!standard && /\bstandard\b/.test(t)) standard = item;
      if (!extended && /\bextended\b/.test(t)) extended = item;
      if (!heavy && /\bheavy\b/.test(t)) heavy = item;
    }

    return { light, standard, extended, heavy };
  }

  function menuHasEffortOptions(menu) {
    const { light, standard, extended, heavy } = getEffortItems(menu);
    const hasTwo = !!standard && !!extended;
    const hasFourExtremes = !!light && !!heavy;
    return hasTwo || hasFourExtremes;
  }

  function findMenuForPill(pill) {
    if (!(pill instanceof Element)) return null;
    const labelId = typeof pill.id === "string" ? pill.id : "";
    if (!labelId) return null;

    const menus = Array.from(document.querySelectorAll("[role='menu']"));
    for (const menu of menus) {
      if (menu.getAttribute("aria-labelledby") === labelId) return menu;
    }
    return null;
  }

  async function findEffortPill() {
    const pills = listComposerPills();
    if (!pills.length) return null;
    if (pills.length === 1) return pills[0];

    /** @type {HTMLButtonElement[]} */
    const ordered = [];

    const active = document.activeElement;
    if (active instanceof HTMLButtonElement && active.matches("button.__composer-pill")) {
      ordered.push(active);
    }

    const likely = pills.filter((p) => /thinking|pro/i.test((p.textContent || "").trim()));
    for (const p of likely) if (!ordered.includes(p)) ordered.push(p);
    for (const p of pills) if (!ordered.includes(p)) ordered.push(p);

    for (const pill of ordered) {
      const opened = await openThinkingMenu(pill);
      if (!opened) continue;

      /** @type {Element|null} */
      let menu = null;
      for (let i = 0; i < 8; i++) {
        menu = findMenuForPill(pill);
        if (menu) break;
        await sleep(40);
      }

      if (menu && menuHasEffortOptions(menu)) return pill;

      // 不是推理强度菜单：关掉再继续试下一个
      clickLikeUser(pill);
      await sleep(60);
    }

    return ordered[0] || null;
  }

  function getStandardExtendedItems(menu) {
    const items = Array.from(menu.querySelectorAll("[role='menuitemradio']"));
    /** @type {Element|null} */
    let standard = null;
    /** @type {Element|null} */
    let extended = null;

    for (const item of items) {
      const t = (item.textContent || "").trim().toLowerCase();
      if (!standard && t.includes("standard")) standard = item;
      if (!extended && t.includes("extended")) extended = item;
    }

    return { standard, extended };
  }

  async function openThinkingMenu(pill) {
    clickLikeUser(pill);
    await sleep(60);
    if (pill.getAttribute("aria-expanded") === "true") return true;
    if (pill.getAttribute("data-state") === "open") return true;

    clickLikeUser(pill);
    await sleep(120);
    return pill.getAttribute("aria-expanded") === "true" || pill.getAttribute("data-state") === "open";
  }

  async function toggleThinkingTime() {
    if (busy) return;
    busy = true;

    try {
      const pill = await findEffortPill();
      if (!pill) {
        warn("没找到推理强度选择器（可能当前模型/页面不支持）");
        return;
      }

      const opened = await openThinkingMenu(pill);
      if (!opened) {
        warn("打开推理强度菜单失败");
        return;
      }

      /** @type {Element|null} */
      let menu = null;
      for (let i = 0; i < 10; i++) {
        menu = findMenuForPill(pill);
        if (menu && menuHasEffortOptions(menu)) break;
        await sleep(50);
      }
      if (!menu) {
        warn("没找到推理强度菜单");
        return;
      }

      const { light, standard, extended, heavy } = getEffortItems(menu);

      if (light && heavy) {
        const heavyChecked = heavy.getAttribute("aria-checked") === "true";
        const target = heavyChecked ? light : heavy;
        clickLikeUser(target);
        info(`检测到thinking模式，切换到${heavyChecked ? "Light" : "Heavy"} thinking`);
        schedulePulse(pill);
        return;
      }

      if (!standard || !extended) {
        warn("菜单里没看到 Standard/Extended");
        return;
      }

      const extendedChecked = extended.getAttribute("aria-checked") === "true";
      const target = extendedChecked ? standard : extended;
      clickLikeUser(target);
      info(`检测到pro模式，切换到${extendedChecked ? "Standard" : "Extended"} thinking`);
      schedulePulse(pill);
    } catch (err) {
      log(err);
      error("切换失败", err);
    } finally {
      busy = false;
    }
  }

  window.addEventListener(
    "keydown",
    (event) => {
      if (!isHotkey(event)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      if (event.repeat) return;
      toggleThinkingTime();
    },
    true
  );
})();
