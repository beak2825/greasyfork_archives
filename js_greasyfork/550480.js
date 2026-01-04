// ==UserScript==
// @name         Clean Links + Copy (no UTM)
// @namespace    https://nikk.agency/
// @version      1.0.0
// @description  Автоочистка ссылок от UTM/трекеров и быстрая копия чистого URL (кнопка 🔗 рядом со ссылкой + меню).
// @author       NAnews / NiKK
// @license      MIT
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/550480/Clean%20Links%20%2B%20Copy%20%28no%20UTM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550480/Clean%20Links%20%2B%20Copy%20%28no%20UTM%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const TRACKING_PARAMS = new Set([
    // универсальные
    "utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_name","utm_id","utm_reader","utm_brand",
    // соцсети/рекламные
    "fbclid","gclid","wbraid","gbraid","yclid","mc_cid","mc_eid","igshid","si","spm",
    "ref","ref_src","ref_url","campaign_id","adset_id","ad_id",
    // прочие популярные
    "mkt_tok","vero_id","sca_esv","_hsenc","_hsmi","ncid","trk","rb_clickid","ttclid",
  ]);

  const BUTTON_CLASS = "clean-link-copy-btn";

  function cleanUrl(raw) {
    try {
      const url = new URL(raw, location.href);
      // чистим хеш-трекинг типа ?x#~:text=...
      if (url.hash && /~:text=/.test(url.hash)) url.hash = "";
      // чистим параметры
      const p = url.searchParams;
      // удаляем все utm_*
      [...p.keys()].forEach((k) => {
        if (k.startsWith("utm_") || TRACKING_PARAMS.has(k)) p.delete(k);
      });
      // если остались пустые search/hash — норм
      url.search = p.toString() ? "?" + p.toString() : "";
      return url.toString();
    } catch {
      return raw;
    }
  }

  function attachCopyButtons() {
    const links = document.querySelectorAll("a[href]:not([data-clean-processed])");
    for (const a of links) {
      a.setAttribute("data-clean-processed", "1");

      // переписываем href на чистый (не меняем видимую надпись)
      const cleaned = cleanUrl(a.href);
      if (cleaned && cleaned !== a.href) a.href = cleaned;

      // не добавляем кнопку в навигации, меню и т.п. (сокращаем шум)
      const rect = a.getBoundingClientRect();
      const isTiny = rect.width < 20 || rect.height < 12;
      if (isTiny) continue;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "🔗Copy";
      btn.title = "Скопировать чистый URL";
      btn.className = BUTTON_CLASS;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = cleanUrl(a.href);
        try {
          if (typeof GM_setClipboard === "function") {
            GM_setClipboard(url, { type: "text", mimetype: "text/plain" });
          } else {
            navigator.clipboard?.writeText(url);
          }
          flash(a, "Скопировано!");
        } catch {
          flash(a, "Не удалось скопировать");
        }
      });

      // обертка для позиционирования
      const wrapper = document.createElement("span");
      wrapper.style.position = "relative";
      a.parentNode.insertBefore(wrapper, a);
      wrapper.appendChild(a);
      wrapper.appendChild(btn);
    }
  }

  function flash(el, msg) {
    const note = document.createElement("span");
    note.textContent = msg;
    note.style.cssText = `
      position:absolute; z-index: 999999; top:-1.6em; right:0;
      padding:2px 6px; border-radius:6px; font:12px/1.2 system-ui, sans-serif;
      background: rgba(0,0,0,.75); color:#fff; pointer-events:none;
    `;
    el.closest("span")?.appendChild(note);
    setTimeout(() => note.remove(), 900);
  }

  // меню
  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("Очистить все ссылки сейчас", () => {
      document.querySelectorAll("a[href]").forEach((a) => (a.href = cleanUrl(a.href)));
      alert("Готово: ссылки очищены.");
    });

    GM_registerMenuCommand("Скопировать чистый URL этой страницы", () => {
      const cleaned = cleanUrl(location.href);
      if (typeof GM_setClipboard === "function") {
        GM_setClipboard(cleaned, { type: "text", mimetype: "text/plain" });
      } else {
        navigator.clipboard?.writeText(cleaned);
      }
      alert("Скопировано:\n" + cleaned);
    });
  }

  // стили кнопки
  const css = document.createElement("style");
  css.textContent = `
    .${BUTTON_CLASS}{
      margin-left:6px; padding:2px 6px; border:1px solid rgba(0,0,0,.2);
      border-radius:6px; background:#fff; cursor:pointer; font:12px/1 system-ui,sans-serif;
      box-shadow:0 1px 2px rgba(0,0,0,.05);
    }
    .${BUTTON_CLASS}:hover{ background:#f5f5f5 }
  `;
  document.documentElement.appendChild(css);

  // первичный прогон и наблюдатель мутаций (для SPA/ленивой подгрузки)
  attachCopyButtons();
  const mo = new MutationObserver(() => attachCopyButtons());
  mo.observe(document.documentElement, { subtree: true, childList: true });
})();
