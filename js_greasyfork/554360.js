// ==UserScript==
// @name         FaviconsPlox
// @name:es      FaviconsPlox
// @name:en      FaviconsPlox
// @name:fr      FaviconsPlox
// @name:de      FaviconsPlox
// @name:it      FaviconsPlox
// @name:pt      FaviconsPlox
// @name:ru      FaviconsPlox
// @name:zh      FaviconsPlox
// @name:ja      FaviconsPlox
// @name:ko      FaviconsPlox
// @name:zh-TW   FaviconsPlox
// @name:zh-CN   FaviconsPlox
// @namespace    favicons-plox
// @version      0.0.1
// @description  Muestra favicons junto a los enlaces visibles. Incluye opciones de menú y usa dummyimage como fallback si el favicon no carga.
// @description:es Muestra favicons junto a los enlaces visibles. Incluye opciones de menú y usa dummyimage como fallback si el favicon no carga.
// @description:en Shows favicons next to visible links. Includes menu options and uses dummyimage as fallback if the favicon fails to load.
// @description:fr Affiche les favicons à côté des liens visibles. Inclut des options de menu et utilise dummyimage comme fallback si le favicon ne charge pas.
// @description:de Zeigt Favicons neben sichtbaren Links an. Beinhaltet Menüoptionen und nutzt dummyimage als Fallback, wenn das Favicon nicht lädt.
// @description:it Mostra i favicon accanto ai link visibili. Include opzioni di menu e usa dummyimage come fallback se il favicon non viene caricato.
// @description:pt Mostra favicons junto aos links visíveis. Inclui opções de menu e usa dummyimage como fallback se o favicon não carregar.
// @description:ru Показывает фавиконы рядом с видимыми ссылками. Включает опции меню и использует dummyimage как запасной вариант, если фавикон не загружается.
// @description:zh 在可见链接旁显示网站图标。包含菜单选项，如果图标未加载则使用dummyimage。
// @description:ja 可視リンクの横にファビコンを表示。メニューオプションを含み、ファビコンが読み込めない場合はdummyimageを使用。
// @description:ko 보이는 링크 옆에 파비콘 표시. 메뉴 옵션 포함, 파비콘 로드 실패 시 dummyimage 사용.
// @description:zh-TW 在可見連結旁顯示網站圖示。包含選單選項，如圖示無法載入則使用dummyimage。
// @description:zh-CN 在可见链接旁显示网站图标。包含菜单选项，如果图标未加载则使用dummyimage。
// @author       Alplox
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554360/FaviconsPlox.user.js
// @updateURL https://update.greasyfork.org/scripts/554360/FaviconsPlox.meta.js
// ==/UserScript==

(function() {
  'use strict';

  /********************************************
   * ⚙️ OPCIONES Y ESTADO
   ********************************************/
  const SETTINGS = {
    enabled: "enabled",
    externalOnly: "externalOnly"
  };

  const getSetting = (key, def = true) => GM_getValue(key, def);
  const setSetting = (key, val) => GM_setValue(key, val);

  function toggleSetting(key) {
    const newVal = !getSetting(key);
    setSetting(key, newVal);
    refreshMenus();
    removeFavicons();
    if (getSetting(SETTINGS.enabled)) observeLinks();
  }

  /********************************************
   * 🧭 MENÚ DINÁMICO
   ********************************************/
  let menuIds = [];

  function refreshMenus() {
    for (const id of menuIds) {
      try { GM_unregisterMenuCommand(id); } catch {}
    }
    menuIds = [];

    const enabled = getSetting(SETTINGS.enabled);
    const externalOnly = getSetting(SETTINGS.externalOnly);

    menuIds.push(
      GM_registerMenuCommand(
        `${enabled ? "☑️" : "⬜"} Activar script (clic para ${enabled ? "desactivar" : "activar"})`,
        () => toggleSetting(SETTINGS.enabled)
      )
    );

    menuIds.push(
      GM_registerMenuCommand(
        `${externalOnly ? "☑️" : "⬜"} Solo enlaces externos`,
        () => toggleSetting(SETTINGS.externalOnly)
      )
    );
  }

  refreshMenus();

  /********************************************
   * 🧩 FUNCIONALIDAD PRINCIPAL
   ********************************************/

  const DUMMY_FAVICON = "https://dummyimage.com/16x16/888/fff.png&text=?";

  const getFavicon = (domain) => `https://www.google.com/s2/favicons?sz=16&domain=${domain}`;

  function addFavicon(link) {
    if (link.dataset.faviconAdded) return;
    link.dataset.faviconAdded = "true";

    let url;
    try {
      url = new URL(link.href);
    } catch {
      return;
    }

    const img = document.createElement("img");
    img.src = getFavicon(url.hostname);
    img.alt = "favicon";
    img.className = "user-favicon-icon";
    img.style.cssText = `
      width:16px;
      height:16px;
      margin-right:4px;
      vertical-align:middle;
    `;

    // Si el favicon no carga → fallback dummyimage
    img.onerror = () => {
      img.onerror = null; // evitar bucles infinitos
      img.src = DUMMY_FAVICON;
    };

    link.prepend(img);
  }

  function removeFavicons() {
    document.querySelectorAll("img.user-favicon-icon").forEach((img) => img.remove());
    document.querySelectorAll("a[data-favicon-added]").forEach((a) => delete a.dataset.faviconAdded);
    if (observer) observer.disconnect();
  }

  /********************************************
   * 👀 OBSERVADOR DE VISIBILIDAD
   ********************************************/
  let observer;

  function observeLinks() {
    if (!getSetting(SETTINGS.enabled)) return;

    if (observer) observer.disconnect();

    const allLinks = Array.from(document.querySelectorAll('a[href]'));
    const externalOnly = getSetting(SETTINGS.externalOnly);
    const currentHost = location.hostname;

    const links = allLinks.filter(link => {
      if (!/^https?:/i.test(link.href)) return false;
      if (externalOnly) {
        try {
          const url = new URL(link.href);
          return url.hostname !== currentHost;
        } catch { return false; }
      }
      return true;
    });

    if (!links.length) return;

    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1
    };

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          addFavicon(entry.target);
          observer.unobserve(entry.target);
        }
      }
    }, options);

    links.forEach(link => observer.observe(link));
  }

  /********************************************
   * 🔄 OBSERVADOR DE CAMBIOS DINÁMICOS
   ********************************************/
  const mutationObserver = new MutationObserver(() => observeLinks());
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Inicializar si está activo
  if (getSetting(SETTINGS.enabled)) observeLinks();

})();