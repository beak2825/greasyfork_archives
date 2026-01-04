// ==UserScript==
// @name         Подсчёт входящих и исходящих обменов (с кликами)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Считает количество входящих и исходящих обменов и показывает на любой странице animestars.org, с переходом по клику на страницу обменов
// @author       honoikazuch1
// @match        https://animestars.org/*
// @match        https://asstars.tv/*
// @grant        GM_xmlhttpRequest
// @connect      animestars.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551332/%D0%9F%D0%BE%D0%B4%D1%81%D1%87%D1%91%D1%82%20%D0%B2%D1%85%D0%BE%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D0%B8%20%D0%B8%D1%81%D1%85%D0%BE%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%20%28%D1%81%20%D0%BA%D0%BB%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551332/%D0%9F%D0%BE%D0%B4%D1%81%D1%87%D1%91%D1%82%20%D0%B2%D1%85%D0%BE%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D0%B8%20%D0%B8%D1%81%D1%85%D0%BE%D0%B4%D1%8F%D1%89%D0%B8%D1%85%20%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%20%28%D1%81%20%D0%BA%D0%BB%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function createCounterBox() {
    const box = document.createElement('div');
    box.id = 'trades-counter-box';
    box.style.position = 'fixed';
    box.style.left = '10px';
    box.style.bottom = '10px';
    box.style.padding = '6px 12px';
    box.style.backgroundColor = 'rgba(0,0,0,0.75)';
    box.style.color = 'white';
    box.style.fontSize = '14px';
    box.style.lineHeight = '1.4';
    box.style.zIndex = 9999;
    box.style.borderRadius = '6px';
    box.style.pointerEvents = 'auto'; // теперь кликабельно
    box.style.cursor = 'pointer';
    document.body.appendChild(box);
    return box;
  }

  function updateCounter(incoming, outgoing) {
    const box = document.getElementById('trades-counter-box') || createCounterBox();
    box.innerHTML = `
      📥 <a href="https://animestars.org/trades/" target="_blank" style="color:#4FC3F7; text-decoration:none;">Входящие</a>: ${incoming}<br>
      📤 <a href="https://animestars.org/trades/offers/" target="_blank" style="color:#FFB74D; text-decoration:none;">Исходящие</a>: ${outgoing}
    `;
  }

  function fetchIncoming(callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://animestars.org/trades/',
      onload: function(response) {
        let count = 0;
        if (response.status === 200) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, 'text/html');
          count = [...doc.querySelectorAll('.trade__list-name')]
            .filter(el => el.textContent.trim().startsWith('от ')).length;
        }
        callback(count);
      },
      onerror: function() {
        callback('—');
      }
    });
  }

  function fetchOutgoing(callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://animestars.org/trades/offers/',
      onload: function(response) {
        let count = 0;
        if (response.status === 200) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, 'text/html');
          count = [...doc.querySelectorAll('.trade__list-name')]
            .filter(el => el.textContent.trim().startsWith('для ')).length;
        }
        callback(count);
      },
      onerror: function() {
        callback('—');
      }
    });
  }

  function refreshCounters() {
    fetchIncoming(incoming => {
      fetchOutgoing(outgoing => {
        updateCounter(incoming, outgoing);
      });
    });
  }

  // Первый запрос сразу
  refreshCounters();
  // Обновление каждые 10 секунд
  setInterval(refreshCounters, 10000);
})();
