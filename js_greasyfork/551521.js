// ==UserScript==
// @name         Steam 语言切换器 NEW
// @namespace    Squarelan
// @version      1.0.2
// @description  嵌入导航栏最右侧语言切换按钮，自动记忆语言选择，响应式布局，亮蓝 Steam 风格按钮
// @match        https://store.steampowered.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551521/Steam%20%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E5%99%A8%20NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/551521/Steam%20%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E5%99%A8%20NEW.meta.js
// ==/UserScript==

(function () {
  const steam_lang_btn_map = [
    { label: "中", url: "schinese", iso: "zh-cn" },
    { label: "日", url: "japanese", iso: "ja" },
    { label: "英", url: "english", iso: "en" }
  ];

  const WRAP_ID = "steam-lang-btn-wrapper";
  const PREF_KEY = "steamLangPref";

  const insert_styles = () => {
    if (document.getElementById("steam-lang-style")) return;
    const style = document.createElement("style");
    style.id = "steam-lang-style";
    style.textContent = `
      #${WRAP_ID}{
        position:absolute;
        right:8px;
        top:50%;
        transform:translateY(-50%);
        display:flex;
        gap:6px;
        z-index:2147483647;
        white-space:nowrap;
      }
      #${WRAP_ID} .steam-lang-btn{
        width:34px;
        height:34px;
        display:flex;
        align-items:center;
        justify-content:center;
        border-radius:2px;
        background-color:#1A9FFF;
        color:#FFFFFF;
        font-size:13px;
        font-family:"Motiva Sans", Sans-serif;
        cursor:pointer;
        transition:background-color 0.2s ease;
        box-shadow:0 0 2px rgba(0,0,0,0.3);
        user-select:none;
        line-height:1;
      }
      #${WRAP_ID} .steam-lang-btn:hover:not(.disabled){ background-color:#167ACC; }
      #${WRAP_ID} .steam-lang-btn.disabled{
        background-color:#3b3f45;
        color:#7f8c99;
        cursor:not-allowed;
        opacity:0.6;
      }
      @media (max-width:600px){ #${WRAP_ID}{ display:none; } }
    `;
    document.head.appendChild(style);
  };

  const find_nav = () => {
    const navs = document.querySelectorAll('div[role="navigation"]');
    for (const nav of navs) {
      const form = nav.querySelector('form[role="search"][action]');
      if (!form) continue;
      const action = form.getAttribute("action") || "";
      if (action.includes("store.steampowered.com/search") || action.endsWith("/search")) {
        return nav;
      }
    }
    return null;
  };

  const find_fullwidth_container = (nav) => {
    if (!nav) return null;
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    let el = nav;
    let best = nav;
    let bestW = 0;

    while (el && el !== document.body && el !== document.documentElement) {
      const r = el.getBoundingClientRect();
      if (r.width > bestW) {
        bestW = r.width;
        best = el;
      }
      if (r.width >= vw * 0.92) return el;
      el = el.parentElement;
    }
    return best || nav;
  };

  const inject_lang_buttons = () => {
    if (document.getElementById(WRAP_ID)) return;

    const nav = find_nav();
    if (!nav) return;

    const container = find_fullwidth_container(nav);
    if (!container) return;

    const cs = window.getComputedStyle(container);
    if (cs.position === "static") container.style.position = "relative";

    const wrapper = document.createElement("div");
    wrapper.id = WRAP_ID;

    steam_lang_btn_map.forEach(({ label, url, iso }) => {
      const currentLang = document.documentElement.lang || "";
      const isActive =
        currentLang.startsWith(iso) ||
        new URL(window.location).searchParams.get("l") === url;

      const btn = document.createElement("div");
      btn.className = "steam-lang-btn" + (isActive ? " disabled" : "");
      btn.textContent = label;

      if (!isActive) {
        const newURL = new URL(window.location);
        newURL.searchParams.set("l", url);
        btn.onclick = () => {
          localStorage.setItem(PREF_KEY, url);
          window.location = newURL.href;
        };
      }

      wrapper.appendChild(btn);
    });

    container.appendChild(wrapper);
  };

  const patch_links_with_lang = () => {
    const currentLang = document.documentElement.lang || "";
    const langEntry = steam_lang_btn_map.find(({ iso }) => currentLang.startsWith(iso));
    if (!langEntry) return;

    document.querySelectorAll("a[href]").forEach((node) => {
      try {
        const url = new URL(node.href);
        if (["steamcommunity.com", "store.steampowered.com"].includes(url.host)) {
          url.searchParams.set("l", langEntry.url);
          node.href = url.href;
        }
      } catch {}
    });
  };

  const hide_es_warning = () => {
    const warning = document.querySelector(".es_language_warning");
    if (warning) warning.style.display = "none";
  };

  const auto_redirect_if_needed = () => {
    const saved = localStorage.getItem(PREF_KEY);
    const current = new URL(window.location).searchParams.get("l");
    const redirected = sessionStorage.getItem("steamLangRedirected");

    if (saved && saved !== current && !redirected) {
      sessionStorage.setItem("steamLangRedirected", "1");
      const newURL = new URL(window.location);
      newURL.searchParams.set("l", saved);
      window.location.replace(newURL.href);
    }
  };

  const init = () => {
    auto_redirect_if_needed();
    insert_styles();
    inject_lang_buttons();
    patch_links_with_lang();
    hide_es_warning();

    const observer = new MutationObserver(() => {
      inject_lang_buttons();
      patch_links_with_lang();
      hide_es_warning();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  setTimeout(init, 1000);
})();