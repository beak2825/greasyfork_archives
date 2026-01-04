// ==UserScript==
// @name         Popov Article Lookup
// @namespace    http://tampermonkey.net/
// @version      2.0.12
// @description  Отслеживает артикулы на странице и показывает окно. Запросы к API делает Automator скрипт.
// @author       You
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555843/Popov%20Article%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/555843/Popov%20Article%20Lookup.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Упрощенная версия - только отслеживание артикула и показ/скрытие окна
  // Запросы к API делает Automator скрипт

  const DEFAULT_CONFIG = {
    articleSelector: 'span.ant-typography[variant="body-medium"]', // Для mobiledubai.com
    articleRegex: "",
    autoAttachObserver: true
  };

  const OVERLAY_ID = "popov-lookup-overlay";
  const OVERLAY_DATA_ATTR = "data-popov-article";
  const SETTINGS_KEY = "popov_lookup_settings";

  let settings = { ...DEFAULT_CONFIG };
  let currentArticle = "";
  let lastObservedArticle = "";
  let overlay = null;

  function loadSettings() {
    try {
      const stored = GM_getValue(SETTINGS_KEY, null);
      if (stored) {
        settings = { ...DEFAULT_CONFIG, ...stored };
      } else {
        settings = { ...DEFAULT_CONFIG };
      }
    } catch (e) {
      console.warn("[Popov Lookup] Failed to load settings:", e);
      settings = { ...DEFAULT_CONFIG };
    }
    return Promise.resolve(settings);
  }

  function saveSettings(newSettings) {
    try {
      GM_setValue(SETTINGS_KEY, newSettings);
      settings = { ...DEFAULT_CONFIG, ...newSettings };
    } catch (e) {
      console.warn("[Popov Lookup] Failed to save settings:", e);
    }
  }

  // Добавление CSS стилей
  var cssStyles =
    "#" + OVERLAY_ID + " {" +
    "position: fixed;" +
    "bottom: 20px;" +
    "right: 20px;" +
    "width: 493px;" +
    "max-height: 80vh;" +
    "background: rgba(15, 17, 23, 0.95);" +
    "color: #f5f5f5;" +
    "border-radius: 12px;" +
    "box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);" +
    "backdrop-filter: blur(6px);" +
    "opacity: 0;" +
    "transform: translateY(20px);" +
    "transition: opacity 0.25s ease, transform 0.25s ease;" +
    "font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;" +
    "z-index: 2147483647;" +
    "overflow: hidden;" +
    "pointer-events: all;" +
    "}" +
    "#" + OVERLAY_ID + ".popov-visible {" +
    "opacity: 1;" +
    "transform: translateY(0);" +
    "}" +
    "#" + OVERLAY_ID + " .popov-header {" +
    "display: flex;" +
    "align-items: center;" +
    "justify-content: space-between;" +
    "padding: 15px 22px;" +
    "background: rgba(255, 255, 255, 0.06);" +
    "border-bottom: 1px solid rgba(255, 255, 255, 0.08);" +
    "}" +
    "#" + OVERLAY_ID + " .popov-title {" +
    "font-weight: 600;" +
    "font-size: 20px;" +
    "letter-spacing: 0.4px;" +
    "text-transform: uppercase;" +
    "color: #8fb1ff;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-close-btn {" +
    "border: none;" +
    "background: transparent;" +
    "color: #b0b7c3;" +
    "font-size: 28px;" +
    "line-height: 1;" +
    "cursor: pointer;" +
    "padding: 4px;" +
    "border-radius: 6px;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-close-btn:hover {" +
    "background: rgba(255, 255, 255, 0.1);" +
    "color: #fff;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-content {" +
    "padding: 19px 24px 24px;" +
    "overflow-y: auto;" +
    "max-height: calc(80vh - 68px);" +
    "}" +
    "#" + OVERLAY_ID + " .popov-placeholder," +
    "#" + OVERLAY_ID + " .popov-error {" +
    "margin: 0;" +
    "font-size: 22px;" +
    "line-height: 1.5;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-error {" +
    "color: #ff8080;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-article {" +
    "font-size: 14px;" +
    "margin-bottom: 15px;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-our {" +
    "display: flex;" +
    "gap: 15px;" +
    "align-items: center;" +
    "flex-wrap: wrap;" +
    "font-size: 20px;" +
    "margin-bottom: 19px;" +
    "color: #b3f2b2;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-pill {" +
    "display: inline-flex;" +
    "align-items: center;" +
    "justify-content: center;" +
    "background: rgba(66, 181, 73, 0.2);" +
    "color: #8ef898;" +
    "padding: 3px 12px;" +
    "border-radius: 999px;" +
    "font-size: 17px;" +
    "letter-spacing: 0.6px;" +
    "text-transform: uppercase;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-list {" +
    "list-style: none;" +
    "margin: 0;" +
    "padding: 0;" +
    "display: grid;" +
    "gap: 8px;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-list li {" +
    "display: flex;" +
    "align-items: center;" +
    "justify-content: space-between;" +
    "font-size: 20px;" +
    "padding: 9px 15px;" +
    "background: rgba(255, 255, 255, 0.05);" +
    "border-radius: 8px;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-list li strong {" +
    "font-weight: 600;" +
    "color: #fdfdfd;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-list li span {" +
    "color: #d5d9e1;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-list li.popov-empty {" +
    "justify-content: center;" +
    "color: #a1a7b3;" +
    "font-style: italic;" +
    "}" +
    "#" + OVERLAY_ID + " .popov-message {" +
    "margin-top: 19px;" +
    "padding: 12px 15px;" +
    "background: rgba(255, 255, 255, 0.06);" +
    "border-radius: 8px;" +
    "font-size: 20px;" +
    "line-height: 1.4;" +
    "color: #c0c7d6;" +
    "}";

  GM_addStyle(cssStyles);

  function createOverlay() {
    if (overlay) {
      if (!document.body.contains(overlay)) {
        document.body.appendChild(overlay);
      }
      return overlay;
    }

    overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.setAttribute(OVERLAY_DATA_ATTR, "");
    overlay.innerHTML = `
      <div class="popov-header">
        <span class="popov-title">Popov Lookup</span>
        <button class="popov-close-btn" title="Закрыть">&times;</button>
      </div>
      <div class="popov-content">
        <p class="popov-placeholder">Ожидание поиска...</p>
        <p class="popov-hint" style="font-size: 19px; color: #888; margin-top: 15px;">
          Запустите поиск через Automator
        </p>
      </div>
    `;

    if (!document.body.contains(overlay)) {
      document.body.appendChild(overlay);
    }

    const closeBtn = overlay.querySelector(".popov-close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        hideOverlay();
      });
    }

    return overlay;
  }

  function showOverlay(article) {
    const node = createOverlay();
    node.setAttribute(OVERLAY_DATA_ATTR, article || "");

    const content = node.querySelector(".popov-content");
    if (content) {
      content.innerHTML = `
        <p class="popov-placeholder">Артикул найден: <strong>${escapeHtml(article)}</strong></p>
        <p class="popov-hint" style="font-size: 19px; color: #888; margin-top: 15px;">
          Запустите поиск через Automator
        </p>
      `;
    }

    node.classList.add("popov-visible");
    currentArticle = article || "";
  }

  function hideOverlay() {
    if (overlay) {
      overlay.classList.remove("popov-visible");
      overlay.setAttribute(OVERLAY_DATA_ATTR, "");
      currentArticle = "";
      lastObservedArticle = "";
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function extractArticleFromElement(el) {
    if (!el) return "";
    let value = "";
    if (el.dataset?.article) {
      value = el.dataset.article;
    } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      value = el.value;
    } else {
      value = el.textContent || "";
    }
    value = (value || "").trim();
    if (!value) return "";

    // Нормализуем пробелы: заменяем множественные пробелы на одинарные
    value = value.replace(/\s+/g, " ").trim();

    // Игнорируем служебные слова
    const ignoredWords = ["Валюта", "Валюта:", "Currency", "Currency:", "Локация", "Локация:", "Location", "Location:", "STOCK", "Stock", "stock"];
    const normalizedValue = value.trim();
    if (ignoredWords.some(word => normalizedValue === word || normalizedValue.startsWith(word + " "))) {
      return "";
    }

    if (settings.articleRegex) {
      try {
        const regex = new RegExp(settings.articleRegex, "i");
        const match = value.match(regex);
        if (match) {
          return (match[1] || match[0] || "").replace(/\s+/g, " ").trim();
        }
      } catch (error) {
        console.warn("[Popov Lookup] Invalid article regex:", error);
      }
    }
    return value;
  }

  function isElementInTable(element) {
    // Проверяем, находится ли элемент внутри таблицы
    let parent = element.parentElement;
    while (parent) {
      if (parent.tagName === 'TABLE' || parent.tagName === 'TR' || parent.tagName === 'TD' ||
          parent.tagName === 'TBODY' || parent.tagName === 'THEAD' || parent.tagName === 'TFOOT' ||
          parent.classList.contains('ant-table') || parent.classList.contains('ant-table-row') ||
          parent.classList.contains('ant-table-cell')) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  function findArticleCandidate() {
    if (!settings.articleSelector) {
      return "";
    }

    // Получаем все элементы, соответствующие селектору
    const elements = document.querySelectorAll(settings.articleSelector);
    if (!elements || elements.length === 0) {
      return "";
    }

    // Ищем первый элемент, который подходит для артикула
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];

      // Игнорируем элементы с определенными атрибутами
      if (element.hasAttribute && element.hasAttribute('data-qa')) {
        const dataQa = element.getAttribute('data-qa');
        if (dataQa === 'page-header__language-toggle') {
          continue; // Пропускаем этот элемент
        }
      }

      // Игнорируем элементы внутри таблиц
      if (isElementInTable(element)) {
        continue;
      }

      // Пробуем извлечь артикул из этого элемента
      const article = extractArticleFromElement(element);
      if (article) {
        // Дополнительная проверка: артикул должен быть достаточно длинным
        // (исключаем короткие значения типа "IN", "STOCK" и т.д.)
        if (article.length < 5) {
          continue;
        }
        return article;
      }
    }

    return "";
  }

  function mutationTouchesOverlay(mutation) {
    const overlayEl = document.getElementById(OVERLAY_ID);
    if (!overlayEl) {
      return false;
    }
    if (overlayEl.contains(mutation.target)) {
      return true;
    }
    const nodes = [
      ...mutation.addedNodes,
      ...mutation.removedNodes
    ];
    for (const node of nodes) {
      if (node === overlayEl) {
        return true;
      }
      if (node instanceof Element && overlayEl.contains(node)) {
        return true;
      }
    }
    return false;
  }

  function observeMutations() {
    if (!settings.autoAttachObserver || !settings.articleSelector) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      const hasRelevantMutation = mutations.some(
        (mutation) => !mutationTouchesOverlay(mutation)
      );
      if (!hasRelevantMutation) {
        return;
      }

      const article = findArticleCandidate();

      if (!article) {
        // Артикул пропал - скрываем окно
        if (currentArticle) {
          hideOverlay();
        }
        lastObservedArticle = "";
        return;
      }

      // Артикул найден или изменился - показываем окно
      if (article !== lastObservedArticle) {
        console.log("[Popov Lookup] Артикул найден:", article);
        console.log("[Popov Lookup] Предыдущий артикул:", lastObservedArticle);
        lastObservedArticle = article;
        currentArticle = article; // Обновляем currentArticle
        showOverlay(article);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  // Функция для обновления содержимого окна извне (вызывается из Automator)
  function updateOverlayContent(html) {
    const node = createOverlay();
    const content = node.querySelector(".popov-content");
    if (content) {
      content.innerHTML = html;
    }
    node.classList.add("popov-visible");
  }

  // Экспортируем функции для доступа из JavaScript (для Automator)
  // Используем и unsafeWindow и window для максимальной совместимости
  const overlayAPI = {
    show: showOverlay,
    hide: hideOverlay,
    update: updateOverlayContent,
    getCurrentArticle: () => {
      console.log("[Popov Lookup] getCurrentArticle вызван, возвращает:", currentArticle);
      return currentArticle;
    },
    setArticle: (article) => {
      if (article) {
        showOverlay(article);
      } else {
        hideOverlay();
      }
    }
  };

  unsafeWindow.popovOverlay = overlayAPI;
  window.popovOverlay = overlayAPI;

  // Также для совместимости
  const lookupAPI = {
    status: "ready",
    getCurrentArticle: () => currentArticle
  };
  unsafeWindow.popovLookup = lookupAPI;
  window.popovLookup = lookupAPI;

  function initialize() {
    loadSettings().then(() => {
      if (!settings.articleSelector) {
        console.warn("[Popov Lookup] articleSelector is not configured.");
        return;
      }

      // Автоматическая настройка для mobiledubai.com
      if (window.location.hostname.includes('mobiledubai.com')) {
        settings.articleSelector = 'span.ant-typography[variant="body-medium"]';
      }

      observeMutations();
      const article = findArticleCandidate();
      if (article) {
        console.log("[Popov Lookup] Начальный артикул найден:", article);
        lastObservedArticle = article;
        currentArticle = article; // Устанавливаем currentArticle
        showOverlay(article);
      } else {
        console.log("[Popov Lookup] Артикул не найден на странице");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }

  console.log("[Popov Lookup] Script loaded! Version 2.0.12 - Tracking only mode");
  console.log("[Popov Lookup] popovOverlay available:", typeof window.popovOverlay !== 'undefined');
})();
