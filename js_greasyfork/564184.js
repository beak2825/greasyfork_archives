// ==UserScript==
// @name         fail link show
// @namespace    tp-wen@tepeng.com
// @description  标识无效的a标签
// @version      0.3
// @match        *://*.3d66.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564184/fail%20link%20show.user.js
// @updateURL https://update.greasyfork.org/scripts/564184/fail%20link%20show.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STYLE_ID = "__query_only_mark_style__";
  const MARK_CLASS = "__query_only_mark";
  const BADGE_CLASS = "__query_only_badge";

  const ensureStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const styleEl = document.createElement("style");
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
      a.${MARK_CLASS}{
        outline:none !important;
      }
      a.${MARK_CLASS} .${BADGE_CLASS}{
        position:absolute !important;top:4px !important;right:4px !important;z-index:99999 !important;
        pointer-events:none !important;
        display:inline-flex !important;align-items:center !important;justify-content:center !important;
        width:16px !important;height:16px !important;
        font-size:10px !important;line-height:1 !important;border-radius:999px !important;
        font-weight:700 !important;
        color:#fff !important;
        background:linear-gradient(145deg,#ff6b6b,#d32f2f) !important;
        border:1px solid rgba(211,47,47,.9) !important;
        box-shadow:0 0 0 1px rgba(255,255,255,.9), 0 1px 4px rgba(211,47,47,.35) !important;
      }
    `;
    document.head.appendChild(styleEl);
  };

  const isEmptyHref = (href) => href == null || href.trim() === "";

  const isQueryOnlyHref = (href) => {
    if (isEmptyHref(href)) return false;
    const trimmed = href.trim();
    return trimmed.startsWith("?");
  };

  const applyBadges = () => {
    ensureStyle();
    document.querySelectorAll("a").forEach((a) => {
      const rawHref = a.getAttribute("href");
      const badge = a.querySelector(`.${BADGE_CLASS}`);
      const isBadLink = isEmptyHref(rawHref) || isQueryOnlyHref(rawHref);
      if (!isBadLink) {
        a.classList.remove(MARK_CLASS);
        badge?.remove();
        return;
      }

      const rect = a.getBoundingClientRect();
      const hasImg = a.querySelector("img") !== null;
      // 判断是否为卡片/块级元素：有图片，或尺寸较大，或绝对定位
      const computed = getComputedStyle(a);
      const isAbsolute = computed.position === "absolute" || computed.position === "fixed";
      const isCard = hasImg || (rect.height > 40 && rect.width > 40) || isAbsolute;

      // 基础样式
      const baseStyle =
        "z-index:99999;pointer-events:none;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;font-weight:700;color:#fff;background:linear-gradient(145deg,#ff6b6b,#d32f2f);border:1px solid rgba(211,47,47,.9);box-shadow:0 0 0 1px rgba(255,255,255,.9), 0 1px 4px rgba(211,47,47,.35);";

      let finalStyle = "";
      if (isCard) {
        // 卡片模式：右上角绝对定位
        if (computed.position === "static") {
          a.style.position = "relative";
        }
        finalStyle = `${baseStyle} position:absolute;top:4px;right:4px;width:16px;height:16px;font-size:10px;line-height:1;margin:0;transform:none;`;
      } else {
        // 文本模式：行内追加，不遮挡文字
        // 不需要设置 relative
        finalStyle = `${baseStyle} position:static;width:14px;height:14px;font-size:9px;line-height:1;margin-left:4px;vertical-align:middle;transform:translateY(-1px);`;
      }

      const ensureBadge = () => {
        if (!badge) {
          const nextBadge = document.createElement("span");
          nextBadge.className = BADGE_CLASS;
          nextBadge.textContent = "!";
          nextBadge.style.cssText = finalStyle;
          a.appendChild(nextBadge);
        } else {
          badge.style.cssText = finalStyle;
          // 确保在最后，防止位置不对
          if (a.lastElementChild !== badge) {
            a.appendChild(badge);
          }
        }
      };
      ensureBadge();
    });
  };

  let rafId = null;
  const scheduleApply = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      applyBadges();
    });
  };

  const observer = new MutationObserver(() => scheduleApply());
  observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyBadges(), { once: true });
  } else {
    applyBadges();
  }
})();
