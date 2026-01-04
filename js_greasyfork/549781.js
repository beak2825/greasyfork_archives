// ==UserScript==
// @name         Обмен карточками F2 с повторами + Предложить обмен (сначала переход)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Сначала жмёт "Предложить обмен" и ждёт загрузку страницы обмена, затем скроллит и кликает по карточкам. Повторяет попытку найти целевые карты 3 раза.
// @match        https://remanga.org/*
// @grant        none
// @license MIT  GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/549781/%D0%9E%D0%B1%D0%BC%D0%B5%D0%BD%20%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%D0%B8%20F2%20%D1%81%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D0%BC%D0%B8%20%2B%20%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B8%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD%20%28%D1%81%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549781/%D0%9E%D0%B1%D0%BC%D0%B5%D0%BD%20%D0%BA%D0%B0%D1%80%D1%82%D0%BE%D1%87%D0%BA%D0%B0%D0%BC%D0%B8%20F2%20%D1%81%20%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%B0%D0%BC%D0%B8%20%2B%20%D0%9F%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B8%D1%82%D1%8C%20%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD%20%28%D1%81%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function simulateClick(elem) {
    ['mousedown', 'mouseup', 'click'].forEach(type =>
      elem.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }))
    );
  }

  async function waitForExchangeUI(maxMs = 12000) {
    const start = Date.now();
    while (Date.now() - start < maxMs) {
      const onUrl = location.href.includes('/create/exchange');
      const hasItems = document.querySelector('[data-sentry-component="ExchangeItem"]');
      if (onUrl && hasItems) return true;
      await delay(150);
    }
    console.warn('⏳ Истекло время ожидания загрузки UI обмена');
    return false;
  }

  async function goToExchangePageFirst() {
    if (location.href.includes('/create/exchange')) {
      // Уже на странице обмена
      return await waitForExchangeUI();
    }

    // 1) Пытаемся кликнуть по ссылке внутри кнопки "Предложить обмен"
    let btn = document.querySelector('button[data-sentry-component="HeroCardSuggestExchangeButton"]');
    if (btn) {
      const link = btn.querySelector('a[href*="/create/exchange"]');
      if (link) {
        link.click();
        console.log('💱 Перехожу по ссылке "Предложить обмен"');
        return await waitForExchangeUI();
      }
      // Если ссылки нет, кликаем саму кнопку как запасной вариант
      simulateClick(btn);
      console.log('💱 Клик по кнопке "Предложить обмен"');
      return await waitForExchangeUI();
    }

    // 2) Прямой поиск любой ссылки на создание обмена
    const anyLink = Array.from(document.querySelectorAll('a'))
      .find(a => /\/create\/exchange/.test(a.getAttribute('href') || '') || a.textContent.trim().includes('Предложить обмен'));
    if (anyLink) {
      anyLink.click();
      console.log('💱 Перехожу по найденной ссылке на обмен');
      return await waitForExchangeUI();
    }

    console.warn('❌ Кнопка/ссылка "Предложить обмен" не найдена');
    return false;
  }

  async function scrollUntilCardFound(altText) {
    const maxAttempts = 30;
    const scrollStepPx = 500;
    let lastScrollHeight = 0;
    let sameHeightCount = 0;
    const maxSameHeightCount = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const cards = document.querySelectorAll('[data-sentry-component="ExchangeItem"]');
      for (const card of cards) {
        const img = card.querySelector('img[alt]');
        if (img && img.alt === altText) {
          console.log(`✅ Найдена карточка с alt="${altText}"`);
          return true;
        }
      }

      window.scrollBy(0, scrollStepPx);
      await delay(50);

      const scrollHeight = document.body.scrollHeight;
      const scrollY = window.scrollY;
      const innerHeight = window.innerHeight;

      if (scrollY + innerHeight >= scrollHeight - 5) {
        if (scrollHeight === lastScrollHeight) {
          sameHeightCount++;
        } else {
          sameHeightCount = 0;
          lastScrollHeight = scrollHeight;
        }

        if (sameHeightCount >= maxSameHeightCount) {
          console.warn('⚠️ Достигнут низ страницы, финальная проверка...');
          const finalCards = document.querySelectorAll('[data-sentry-component="ExchangeItem"]');
          for (const card of finalCards) {
            const img = card.querySelector('img[alt]');
            if (img && img.alt === altText) {
              console.log(`✅ Найдена карточка с alt="${altText}" после полной прокрутки`);
              return true;
            }
          }
          return false;
        }
      }
    }
    return false;
  }

  function visibleEnabled(btn) {
    if (!btn) return false;
    const style = window.getComputedStyle(btn);
    return !btn.disabled && style.opacity !== '0' && style.pointerEvents !== 'none';
  }

  async function clickPlusByAltText(altText) {
    const cards = document.querySelectorAll('[data-sentry-component="ExchangeItem"]');
    for (const card of cards) {
      const img = card.querySelector('img[alt]');
      if (img && img.alt === altText) {
        const actions = card.querySelector('[data-sentry-component="ExchangeItemActions"]');
        if (!actions) continue;
        const buttons = actions.querySelectorAll('button');
        if (buttons.length < 2) continue;

        const plusBtn = buttons[1];
        if (visibleEnabled(plusBtn)) {
          simulateClick(plusBtn);
          console.log(`✅ Нажат плюс у карты "${altText}"`);
          return true;
        } else {
          console.warn(`⚠️ Плюс у "${altText}" отключен или не видим`);
          return false;
        }
      }
    }
    console.warn(`❌ Карта "${altText}" не найдена`);
    return false;
  }

  async function clickInventoryButton() {
    const allButtons = Array.from(document.querySelectorAll('button'));
    const invBtn = allButtons.find(btn => btn.textContent.trim().startsWith('Инвентарь'));
    if (invBtn) {
      invBtn.disabled = false;
      invBtn.tabIndex = 0;
      simulateClick(invBtn);
      console.log('🎒 Нажата кнопка "Инвентарь"');
      return true;
    }
    console.warn('❌ Кнопка "Инвентарь" не найдена');
    return false;
  }

  async function clickSendButton() {
    const sendBtn = document.querySelector('button[data-sentry-component="CreateExchangeButton"]');
    if (visibleEnabled(sendBtn)) {
      simulateClick(sendBtn);
      console.log('🚀 Нажата кнопка "Отправить"');
      return true;
    }
    console.warn('❌ Кнопка "Отправить" не найдена или отключена');
    return false;
  }

  async function tryClickTarget(altText, maxRetries = 3) {
    for (let i = 1; i <= maxRetries; i++) {
      console.log(`🔁 Попытка найти "${altText}": ${i} из ${maxRetries}`);
      const found = await scrollUntilCardFound(altText);
      if (found) {
        await delay(100);
        const clicked = await clickPlusByAltText(altText);
        if (clicked) return true;
      }
      await delay(300);
    }
    console.warn(`❌ Не удалось кликнуть по "${altText}" после нескольких попыток`);
    return false;
  }

  const enableSecondCard = false;

  document.addEventListener('keydown', async function (e) {
  if (e.key === 'F2') {
    console.log('🚀 F2: старт сценария. Сначала — переход в обмен');

    // 1) Сначала переходим на страницу обмена
    const onExchange = await goToExchangePageFirst();
    if (!onExchange) return;

    // 2) Теперь выбираем свои карты (массивом)
    const myCards = [
      "Аркана",
 //     "1",  //Еще карты
  //    "2",
   //   "3"
    ]; // МОИ КАРТЫ

    for (const card of myCards) {
      const ok = await tryClickTarget(card);
    }

    // 3) Переходим в инвентарь оппонента
    await delay(200);
    const invClicked = await clickInventoryButton();
    if (!invClicked) return;

    await delay(500);

    // 4) Целевая карта (оппонента)
    const successTarget = await tryClickTarget("Стэнли Пайнс", 3); // НЕ моя карта
    if (!successTarget) return;

    await delay(300);

    // 5) Отправляем обмен
    await clickSendButton();
  }
});
})();
