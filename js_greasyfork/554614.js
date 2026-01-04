// ==UserScript==
// @name         Moderation MultiTool by unblock
// @namespace    https://lolz.live/
// @version      1.8
// @description  В модалке удаления: вкладки (Стандартные / Оффтоп), клоны нативных кнопок, автозаполнение обоих полей, чекбокс уведомления всегда включён. Без панелей, без MutationObserver/interval..
// @match        https://lolz.live/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554614/Moderation%20MultiTool%20by%20unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/554614/Moderation%20MultiTool%20by%20unblock.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_PREFIX = '[Moderation MultiTool]';

  // Минимальный spacing (никаких цветов темы не трогаем)
  addMinimalCSS(`
    .unblock-reasons-wrapper-spacer { margin-top: 8px; }
    .unblock-reason-wrapper { display: inline-block; margin: 4px 8px 4px 0; vertical-align: top; }
  `);

  // Кастомные причины
  const CUSTOM_REASONS = [
    'п.1 правил оффтопа',
    'п.2 правил оффтопа',
    'п.3 правил оффтопа',
    'п.4 правил оффтопа',
    'п.5 правил оффтопа',
    'п.6 правил оффтопа',
    'п.7 правил оффтопа',
    'п.8 правил оффтопа',
    '1.1'
  ];

  // --- Эффективный детект появления оверлея/формы ---
  // Патчим точечные методы вставки DOM-узлов. Никаких обсёрверов/интервалов.
  const _appendChild = Element.prototype.appendChild;
  const _insertBefore = Element.prototype.insertBefore;
  const _insertAdjacentHTML = Element.prototype.insertAdjacentHTML;

  Element.prototype.appendChild = function(node) {
    const res = _appendChild.call(this, node);
    checkNodeForDeleteForm(node);
    return res;
  };
  Element.prototype.insertBefore = function(node, ref) {
    const res = _insertBefore.call(this, node, ref);
    checkNodeForDeleteForm(node);
    return res;
  };
  Element.prototype.insertAdjacentHTML = function(position, text) {
    const res = _insertAdjacentHTML.call(this, position, text);
    // Быстрый парс: если в тексте есть form#delete-post — проверим контейнер
    if (typeof text === 'string' && text.indexOf('form') !== -1 && text.indexOf('delete-post') !== -1) {
      checkNodeForDeleteForm(this);
    } else {
      // На всякий: иногда контейнер — .xenOverlay, проверим всё равно
      if (this && this.querySelector) {
        const maybe = this.querySelector('form#delete-post');
        if (maybe) enhanceDeleteForm(maybe);
      }
    }
    return res;
  };

  // Если форма уже в DOM (редкий кейс) — усилим при готовности
  if (document.readyState !== 'loading') {
    const f = document.querySelector('form#delete-post');
    if (f) safeEnhanceSoon(f);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      const f = document.querySelector('form#delete-post');
      if (f) safeEnhanceSoon(f);
    });
  }

  function checkNodeForDeleteForm(node) {
    if (!node) return;
    if (node.nodeType !== 1) return; // только ELEMENT_NODE
    if (node.matches && node.matches('form#delete-post')) {
      safeEnhanceSoon(node);
      return;
    }
    if (node.querySelector) {
      const form = node.querySelector('form#delete-post');
      if (form) safeEnhanceSoon(form);
    }
  }

  // Дадим одному кадру пройти, чтобы их скрипты дорисовали labelauty-разметку,
  // а мы уже клонировали готовый шаблон.
  function safeEnhanceSoon(form) {
    if (form._unblockEnhancing || form._unblockEnhanced) return;
    form._unblockEnhancing = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try { enhanceDeleteForm(form); }
        catch(e){ console.warn(SCRIPT_PREFIX, 'enhance error', e); }
        finally {
          form._unblockEnhancing = false;
        }
      });
    });
  }

  function enhanceDeleteForm(form) {
    if (!form || form._unblockEnhanced) return;
    form._unblockEnhanced = true;

    const reasonInput      = form.querySelector('#ctrl_reason');
    const alertReasonInput = form.querySelector('input[name="author_alert_reason"]');
    const alertCheckbox    = form.querySelector('#ctrl_send_author_alert');
    const disablerUl       = form.querySelector('#ctrl_send_author_alert_Disabler');
    const originalReasonList = form.querySelector('.reasonList._modForm');

    if (!reasonInput || !alertReasonInput || !alertCheckbox || !disablerUl || !originalReasonList) {
      // чего-то не дорисовано — позволим повторно попытаться при следующей вставке
      form._unblockEnhanced = false;
      return;
    }

    // Если уже есть наши вкладки — не дублируем
    if (form.querySelector('.unblock-reasons-master')) {
      attachReasonHandlers(form, reasonInput, alertReasonInput, alertCheckbox);
      forceEnableAlertCheckbox(alertCheckbox);
      return;
    }

    // 1) Вкладки
    const { stdBlock, customBlock } = buildTabsAndBlocks(disablerUl, originalReasonList);

    // 2) Переносим оригинальные причины в "Стандартные"
    stdBlock.appendChild(originalReasonList);

    // 3) проставляем data-reason-text
    stampDataReasonText(originalReasonList);

    // 4) Строим кастомные причины (клон готовой пары input+label)
    const customReasonListDiv = cloneReasonListForCustom(originalReasonList, CUSTOM_REASONS);
    customBlock.appendChild(customReasonListDiv);

    // 5) Чекбокс уведомления — всегда ON
    forceEnableAlertCheckbox(alertCheckbox);

    // 6) Клики по причинам → текст в оба поля
    attachReasonHandlers(form, reasonInput, alertReasonInput, alertCheckbox);

    // 7) При закрытии оверлея позволим усилять заново, если модалка будет создана снова
    const closer = form.closest('.xenOverlay')?.querySelector('.OverlayCloser');
    if (closer) {
      closer.addEventListener('click', () => {
        form._unblockEnhanced = false;
      }, { once: true });
    }
  }

  // --- вкладки ---
  function buildTabsAndBlocks(disablerUl, originalReasonList) {
    const wrapper = document.createElement('div');
    wrapper.className = 'unblock-reasons-master';
    wrapper.innerHTML = `
      <ul class="tabs mainTabs Tabs unblock-reason-tabs">
        <li class="active"><a href="" class="active" data-tab="std">Стандартные</a></li>
        <li><a href="" data-tab="custom">Оффтоп / мод причины</a></li>
      </ul>
      <div class="unblock-reasons-wrapper-spacer">
        <div class="unblock-reasons-std"></div>
        <div class="unblock-reasons-custom" style="display:none;"></div>
      </div>
    `;
    disablerUl.insertBefore(wrapper, originalReasonList);

    const stdBlock    = wrapper.querySelector('.unblock-reasons-std');
    const customBlock = wrapper.querySelector('.unblock-reasons-custom');

    setupTabs(wrapper, stdBlock, customBlock);
    return { stdBlock, customBlock };
  }

  function setupTabs(wrapper, stdBlock, customBlock) {
    const tabList = wrapper.querySelector('.unblock-reason-tabs');
    const tabsLi  = tabList.querySelectorAll('li');
    const tabsA   = tabList.querySelectorAll('a');

    tabsA.forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const tab = a.getAttribute('data-tab');
        tabsLi.forEach(li => li.classList.remove('active'));
        tabsA.forEach(_a => _a.classList.remove('active'));
        a.parentElement.classList.add('active');
        a.classList.add('active');
        if (tab === 'std') {
          stdBlock.style.display = '';
          customBlock.style.display = 'none';
        } else {
          stdBlock.style.display = 'none';
          customBlock.style.display = '';
        }
      });
    });
  }

  function stampDataReasonText(reasonListDiv) {
    reasonListDiv.querySelectorAll('label').forEach(lbl => {
      const txt = (lbl.innerText || '').trim();
      if (txt) lbl.setAttribute('data-reason-text', txt);
    });
  }

  function cloneReasonListForCustom(originalReasonList, customReasonsArray) {
    const customListDiv = document.createElement('div');
    customListDiv.className = originalReasonList.className; // "reasonList _modForm"

    // Находим первую пару input+label в оригинале — это эталон разметки
    let tplRadio = null, tplLabel = null;
    const kids = Array.from(originalReasonList.children);
    for (let i = 0; i < kids.length - 1; i++) {
      const a = kids[i], b = kids[i + 1];
      if (a?.tagName === 'INPUT' && b?.tagName === 'LABEL') { tplRadio = a; tplLabel = b; break; }
    }
    if (!tplRadio || !tplLabel) return customListDiv;

    customReasonsArray.forEach((textVal, idx) => {
      const id = `labelauty-custom-${Date.now()}-${idx}`;

      // input[type=radio]
      const r = document.createElement('input');
      copyAttrs(tplRadio, r);
      r.setAttribute('id', id);

      // label
      const l = document.createElement('label');
      copyAttrs(tplLabel, l);
      l.innerHTML = tplLabel.innerHTML; // переносим внутренние span'ы 1в1
      l.setAttribute('for', id);
      l.setAttribute('data-reason-text', textVal);
      l.querySelectorAll('span').forEach(s => {
        if (s.classList.contains('labelauty-unchecked')) s.textContent = textVal;
        if (s.classList.contains('labelauty-checked'))   s.textContent = textVal;
      });

      const wrap = document.createElement('div');
      wrap.className = 'unblock-reason-wrapper';
      wrap.appendChild(r);
      wrap.appendChild(l);

      customListDiv.appendChild(wrap);
    });

    return customListDiv;
  }

  function attachReasonHandlers(form, reasonInput, alertReasonInput, alertCheckbox) {
    const labels = form.querySelectorAll('.reasonList._modForm label');
    labels.forEach(label => {
      if (label._unblockClickBound) label.removeEventListener('click', label._unblockClickBound);
      const handler = () => {
        const txt = label.getAttribute('data-reason-text') || label.innerText.trim();
        if (reasonInput) {
          reasonInput.value = txt;
          reasonInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (alertReasonInput) {
          alertReasonInput.value = txt;
          alertReasonInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        forceEnableAlertCheckbox(alertCheckbox);
      };
      label._unblockClickBound = handler;
      label.addEventListener('click', handler);
    });
  }

  function forceEnableAlertCheckbox(chk) {
    if (!chk) return;
    const lock = () => { chk.checked = true; };
    if (!chk.checked) {
      chk.checked = true;
      chk.dispatchEvent(new Event('change', { bubbles: true }));
    }
    chk.addEventListener('click', lock);
    chk.addEventListener('change', lock);
  }

  function copyAttrs(src, dst) {
    for (const a of src.attributes) dst.setAttribute(a.name, a.value);
  }

  function addMinimalCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

})();
