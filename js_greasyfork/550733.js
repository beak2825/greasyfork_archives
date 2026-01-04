// ==UserScript==
// @name         График информация | РесселингА24
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Загружает список копирайтеров с GAS и сохраняет в localStorage
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      script.google.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550733/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%7C%20%D0%A0%D0%B5%D1%81%D1%81%D0%B5%D0%BB%D0%B8%D0%BD%D0%B3%D0%9024.user.js
// @updateURL https://update.greasyfork.org/scripts/550733/%D0%93%D1%80%D0%B0%D1%84%D0%B8%D0%BA%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D1%8F%20%7C%20%D0%A0%D0%B5%D1%81%D1%81%D0%B5%D0%BB%D0%B8%D0%BD%D0%B3%D0%9024.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVblkw9iO_JLNcbWgsFgr-0g4NlaDUwPTe4zqzwYWVYZLosxWjyWF0YfukHgpOWtnY/exec';
  const STORAGE_KEY = 'copywritersData';
  const LAST_FETCH_KEY = 'copywritersLastFetch';
  const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 минут

  function isCacheValid() {
    const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
    if (!lastFetch) return false;
    const now = Date.now();
    return (now - parseInt(lastFetch, 10)) < CACHE_DURATION_MS;
  }

  function updateLastFetchTime() {
    localStorage.setItem(LAST_FETCH_KEY, String(Date.now()));
  }

  function fetchCopywriters() {
    // Используем GM_xmlhttpRequest для обхода CORS (Google Apps Script требует этого)
    GM_xmlhttpRequest({
      method: 'GET',
      url: SCRIPT_URL,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          // Проверяем, что ответ содержит ожидаемые поля
          if (data && (data.copywriters || data.message || data.error)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            updateLastFetchTime();
            console.log('✅ Данные копирайтеров обновлены и сохранены в localStorage');
          } else {
            console.warn('⚠️ Получен неожиданный формат данных:', data);
          }
        } catch (e) {
          console.error('❌ Ошибка при обработке ответа от GAS:', e, response.responseText);
        }
      },
      onerror: function (error) {
        console.error('❌ Ошибка при запросе к Google Apps Script:', error);
      }
    });
  }

  // Запуск
  if (isCacheValid()) {
    console.log('ℹ️ Данные копирайтеров актуальны (менее 30 мин назад). Запрос не выполняется.');
  } else {
    console.log('🔄 Запрашиваем обновлённые данные копирайтеров...');
    fetchCopywriters();
  }
})();