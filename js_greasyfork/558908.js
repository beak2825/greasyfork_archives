// ==UserScript==
// @name         YouTube Copy Clean Link
// @name:fa		 لینک تمیز یوتیوب
// @name:zh-CN	 简洁的 YouTube 分享链接
// @name:ar		 رابط مشاركة يوتيوب قصير ونظيف
// @name:fr		 Lien de partage YouTube court et propre

// @version      0.1.0
// @author       qop
// @description  clicking yt share button > copies a short clean link to clipboard, without triggering share popup! *Right clicking it adds current time *Also works for yt short videos

// @description:fa		با کلیک روی دکمه شر یوتیوب کوتاه ترین لینک ممکن کپی میشه، برای اضافه کردن زمان راست کلیک کنید
// @description:zh-CN 	点击 YouTube 分享按钮 > 会将一个简洁的短链接复制到剪贴板，而不会弹出分享窗口！*右键点击会添加当前时间* 也适用于 YouTube 短视频。
// @description:ar		الضغط على زر المشاركة في يوتيوب > ينسخ رابطًا قصيرًا ونظيفًا إلى الحافظة، دون ظهور نافذة المشاركة المنبثقة! *الضغط بزر الفأرة الأيمن يضيف الوقت الحالي* يعمل أيضًا مع فيديوهات يوتيوب القصيرة
// @description:fr		Cliquer sur le bouton de partage YouTube copie un lien court et propre dans le presse-papiers, sans afficher la fenêtre de partage ! *Un clic droit ajoute l'heure actuelle. *Fonctionne également pour les vidéos YouTube Shorts.

// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @namespace    https://greasyfork.org/en/users/1532178-qop-z
// @grant        GM_setClipboard
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/558908/YouTube%20Copy%20Clean%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/558908/YouTube%20Copy%20Clean%20Link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const style = document.createElement('style');
  style.id = 'yt-transparent-delhi-controls';

  const inject = () => {
    if (!document.getElementById(style.id)) {
      (document.head || document.documentElement).appendChild(style);
    }
  };

  // Inject early and observe for SPA navigations
  inject();
  const obs = new MutationObserver(inject);
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
// right click easy share
(() => {
    // Build base link (no https)
    const baseLink = () => {
        const u = new URL(location.href);
        const p = u.pathname;

        if (p === "/watch") {
            const v = u.searchParams.get("v");
            return v ? `youtu.be/${v}` : null;
        }

        if (p.startsWith("/shorts/")) {
            const id = p.split("/shorts/")[1].split(/[/?]/)[0];
            return id ? `youtube.com/shorts/${id}` : null;
        }

        return null;
    };

    const currentTime = () => {
        const v = document.querySelector("video");
        return v ? Math.floor(v.currentTime || 0) : 0;
    };

    const isShareBtn = (e) =>
        e.composedPath().some(el =>
            el instanceof HTMLElement &&
            el.getAttribute &&
            el.getAttribute("aria-label") === "Share"
        );

    // Left-click → clean link
    window.addEventListener("click", e => {
        if (!isShareBtn(e)) return;
        e.preventDefault(); e.stopPropagation();

        const link = baseLink();
        if (link) GM_setClipboard(link);
        console.log("[QuickShare] Clean:", link);
    }, true);

    // Right-click → timestamp link
    window.addEventListener("contextmenu", e => {
        if (!isShareBtn(e)) return;
        e.preventDefault(); e.stopPropagation();

        const link = baseLink();
        if (!link) return;

        const t = currentTime();
        const full = link + `&t=${t}`;
        GM_setClipboard(full);

        console.log("[QuickShare] With Time:", full);
    }, true);
})();