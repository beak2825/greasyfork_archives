// ==UserScript==
// @name         reCAPTCHA Robust Auto-Refresh — GLOBAL
// @namespace    https://greasyfork.org/users/1231264
// @version      2.0.0
// @description  Универсальный скрипт: надёжно перезагружает / пересоздаёт Google reCAPTCHA iframe (включая динамические сайты). НЕ РЕШАЕТ капчу — только обновляет/рестартует виджет. Работает на всех сайтах; имеет UI, настройки и persist через localStorage.
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551162/reCAPTCHA%20Robust%20Auto-Refresh%20%E2%80%94%20GLOBAL.user.js
// @updateURL https://update.greasyfork.org/scripts/551162/reCAPTCHA%20Robust%20Auto-Refresh%20%E2%80%94%20GLOBAL.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /***************** Настройки по умолчанию (можно менять в UI) *****************/
  const DEFAULTS = {
    DEFAULT_REFRESH_SECONDS: 60, // базовый интервал (секунды)
    RANDOM_JITTER_SECONDS: 8,    // рандом для интервала (сек)
    MIN_TOKEN_LENGTH: 30,        // минимальная длина g-recaptcha-response считаем решённой
    DEBUG: false                 // логирование
  };
  const STORAGE_KEY = 'rc_auto_global_settings_v2';
  /******************************************************************************/

  // загрузка/сохранение настроек
  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, DEFAULTS, { AUTO_ENABLED: true });
      const parsed = JSON.parse(raw);
      return Object.assign({}, DEFAULTS, parsed);
    } catch (e) {
      console.error('[rc-auto] failed to load settings', e);
      return Object.assign({}, DEFAULTS, { AUTO_ENABLED: true });
    }
  }
  function saveSettings(obj){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    } catch(e){
      console.error('[rc-auto] failed to save settings', e);
    }
  }

  let settings = loadSettings();
  // ensure AUTO_ENABLED default true if not present
  if (typeof settings.AUTO_ENABLED === 'undefined') settings.AUTO_ENABLED = true;

  // лог-функции
  function log(...args){ if (settings.DEBUG) console.log('[rc-auto]', ...args); }
  function info(...args){ console.log('[rc-auto]', ...args); }
  function warn(...args){ console.warn('[rc-auto]', ...args); }

  // state
  let autoTimer = null;
  let isRunning = false;
  let lastReloadTs = 0;
  let observer = null;
  const MANUAL_BUTTON_ID = 'rc-auto-refresh-btn-global';
  const SETTINGS_PANEL_ID = 'rc-auto-settings-panel';

  function nowMs(){ return Date.now(); }

  // Поиск iframe reCAPTCHA
  function findRecaptchaIframes(root = document) {
    return Array.from(root.querySelectorAll('iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"], iframe[src*="recaptcha.net"]'));
  }

  // Проверка видимости элемента
  function isVisible(el){
    try {
      const r = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && el.offsetParent !== null;
    } catch (e) {
      return false;
    }
  }

  // Проверка решённости капчи
  function isCaptchaSolved() {
    try {
      const areas = document.querySelectorAll('textarea[name="g-recaptcha-response"], input[name="g-recaptcha-response"]');
      for (const a of areas) {
        if (a && a.value && a.value.trim().length >= settings.MIN_TOKEN_LENGTH) return true;
      }
      if (document.querySelector('.recaptcha-checkbox-checked')) return true;
      return false;
    } catch (e) {
      log('isCaptchaSolved error', e);
      return false;
    }
  }

  // Получить базовый src без query/hash
  function baseSrcFrom(frame){
    try {
      const url = frame.getAttribute('src') || '';
      return url.split('#')[0].split('?')[0];
    } catch(e){
      return null;
    }
  }

  // Пересоздать iframe (клонирование + новый src с reload)
  function recreateIframe(frame){
    try {
      const parent = frame.parentNode;
      if (!parent) return false;
      const base = baseSrcFrom(frame);
      if (!base) return false;

      const newFrame = document.createElement('iframe');
      for (const attr of frame.attributes) {
        if (attr.name === 'src') continue;
        newFrame.setAttribute(attr.name, attr.value);
      }
      const ts = nowMs();
      const reloadParam = 'reload=' + ts;
      newFrame.src = base + (base.includes('?') ? '&' : '?') + reloadParam + '&hl=' + (navigator.language || 'en');
      parent.insertBefore(newFrame, frame);
      setTimeout(()=>{ try { parent.removeChild(frame); } catch(e){} }, 500);
      info('Пересоздан iframe reCAPTCHA:', newFrame.src);
      lastReloadTs = ts;
      return true;
    } catch (e) {
      warn('recreateIframe error', e);
      return false;
    }
  }

  // Попытка простого reload (переназначение src + reload param)
  function reloadFrame(frame){
    try {
      const base = baseSrcFrom(frame);
      if (!base) return false;
      const ts = nowMs();
      frame.src = base + '?reload=' + ts + '&hl=' + (navigator.language || 'en');
      lastReloadTs = ts;
      info('Перезагружен iframe:', frame.src);
      return true;
    } catch(e){
      warn('reloadFrame error', e);
      return false;
    }
  }

  // Попробовать grecaptcha.reset() если доступен
  function tryGreCaptchaReset(){
    try {
      if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
        window.grecaptcha.reset();
        info('grecaptcha.reset() выполнен');
        lastReloadTs = nowMs();
        return true;
      }
    } catch (e) {
      log('grecaptcha.reset threw', e);
    }
    return false;
  }

  // Основной flow перезагрузки: сначала grecaptcha.reset, затем reload, иначе recreate
  function refreshAllCaptchaWidgets({force=false} = {}){
    if (isCaptchaSolved()){
      info('Token найден — автообновление остановлено');
      stopAuto();
      return;
    }

    const minIntervalMs = 6000; // минимум между reload
    if (!force && nowMs() - lastReloadTs < minIntervalMs) {
      log('Слишком недавно выполняли reload, пропускаем');
      return;
    }

    if (tryGreCaptchaReset()) return;

    const frames = findRecaptchaIframes(document).filter(isVisible);
    if (frames.length === 0) {
      log('reCAPTCHA iframe не найден (видимых):', frames.length);
      return;
    }
    frames.forEach(f => {
      const ok = reloadFrame(f);
      if (!ok) recreateIframe(f);
    });
  }

  // Авто-таймер с джиттером
  function startAuto(){
    if (isRunning) return;
    isRunning = true;
    info('Запуск авто-обновления reCAPTCHA (интервал', settings.DEFAULT_REFRESH_SECONDS, 'с ±', settings.RANDOM_JITTER_SECONDS, 'с)');
    refreshAllCaptchaWidgets();

    function scheduleNext(){
      const jitter = Math.floor(Math.random() * (settings.RANDOM_JITTER_SECONDS * 1000));
      const interval = settings.DEFAULT_REFRESH_SECONDS * 1000 + jitter;
      autoTimer = setTimeout(()=>{
        if (!isRunning) return;
        if (isCaptchaSolved()) { info('Token найден — остановка'); stopAuto(); return; }
        refreshAllCaptchaWidgets();
        scheduleNext();
      }, interval);
    }
    scheduleNext();
  }

  function stopAuto(){
    if (!isRunning) return;
    isRunning = false;
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
    info('Auto-обновление остановлено');
  }

  // UI: кнопка Refresh
  function addManualButton(){
    try {
      if (document.getElementById(MANUAL_BUTTON_ID)) return;
      const btn = document.createElement('button');
      btn.id = MANUAL_BUTTON_ID;
      btn.textContent = '⟳ Refresh CAPTCHA';
      Object.assign(btn.style, {
        position: 'fixed',
        right: '12px',
        bottom: '12px',
        zIndex: 2147483647,
        padding: '10px 12px',
        fontSize: '13px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        border: 'none',
        cursor: 'pointer',
        background: '#0a84ff',
        color: '#fff',
      });
      btn.title = 'Ручная перезагрузка reCAPTCHA iframe (НЕ решает капчу)';
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        info('Ручной refresh нажали');
        refreshAllCaptchaWidgets({force:true});
      });
      document.body.appendChild(btn);
    } catch(e){ log('addManualButton err', e); }
  }

  // UI: панель настроек
  function addSettingsPanel(){
    try {
      if (document.getElementById(SETTINGS_PANEL_ID)) return;
      const panel = document.createElement('div');
      panel.id = SETTINGS_PANEL_ID;
      Object.assign(panel.style, {
        position: 'fixed',
        right: '12px',
        bottom: '62px',
        zIndex: 2147483647,
        padding: '10px',
        background: 'rgba(255,255,255,0.98)',
        color: '#000',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        fontSize: '13px',
        minWidth: '230px',
      });

      panel.innerHTML = `
        <div style="margin-bottom:8px;font-weight:600">reCAPTCHA Auto (global)</div>
        <label style="display:block;margin-bottom:6px">
          <input type="checkbox" id="rc_auto_enabled"> Авто-обновление
        </label>
        <label style="display:block;margin-bottom:6px">
          Интервал (сек): <input id="rc_auto_interval" type="number" style="width:70px" min="10">
        </label>
        <label style="display:block;margin-bottom:6px">
          Джиттер (сек): <input id="rc_auto_jitter" type="number" style="width:50px" min="0">
        </label>
        <label style="display:block;margin-bottom:6px">
          <input type="checkbox" id="rc_auto_debug"> Режим отладки (логи)
        </label>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="rc_auto_save" style="flex:1">Сохранить</button>
          <button id="rc_auto_reset" style="flex:1">Сбросить</button>
        </div>
        <div style="margin-top:8px;font-size:12px;color:#666">Token: <span id="rc_auto_token_state">—</span></div>
      `;

      document.body.appendChild(panel);

      // заполнение значений
      document.getElementById('rc_auto_enabled').checked = !!settings.AUTO_ENABLED;
      document.getElementById('rc_auto_interval').value = settings.DEFAULT_REFRESH_SECONDS;
      document.getElementById('rc_auto_jitter').value = settings.RANDOM_JITTER_SECONDS;
      document.getElementById('rc_auto_debug').checked = !!settings.DEBUG;
      updateTokenState();

      document.getElementById('rc_auto_save').addEventListener('click', ()=>{
        settings.AUTO_ENABLED = !!document.getElementById('rc_auto_enabled').checked;
        settings.DEFAULT_REFRESH_SECONDS = Math.max(10, parseInt(document.getElementById('rc_auto_interval').value || settings.DEFAULT_REFRESH_SECONDS, 10));
        settings.RANDOM_JITTER_SECONDS = Math.max(0, parseInt(document.getElementById('rc_auto_jitter').value || settings.RANDOM_JITTER_SECONDS, 10));
        settings.DEBUG = !!document.getElementById('rc_auto_debug').checked;
        saveSettings(settings);
        info('Настройки сохранены', settings);
        if (settings.AUTO_ENABLED) startAuto(); else stopAuto();
      });

      document.getElementById('rc_auto_reset').addEventListener('click', ()=>{
        settings = Object.assign({}, DEFAULTS, { AUTO_ENABLED: true });
        saveSettings(settings);
        // обновить UI
        document.getElementById('rc_auto_enabled').checked = true;
        document.getElementById('rc_auto_interval').value = settings.DEFAULT_REFRESH_SECONDS;
        document.getElementById('rc_auto_jitter').value = settings.RANDOM_JITTER_SECONDS;
        document.getElementById('rc_auto_debug').checked = settings.DEBUG;
        info('Настройки сброшены');
        startAuto();
      });

    } catch (e) {
      log('addSettingsPanel err', e);
    }
  }

  // MutationObserver — наблюдаем за DOM, если появится капча — запускаем refresh
  function startDomObserver(){
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      let found = false;
      for (const m of mutations){
        if (m.addedNodes && m.addedNodes.length){
          for (const n of m.addedNodes){
            if (!(n instanceof HTMLElement)) continue;
            if (n.querySelector && n.querySelector('iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"], iframe[src*="recaptcha.net"]')) { found = true; break; }
            if (n.classList && (n.classList.contains('g-recaptcha') || n.className.includes('recaptcha') || n.className.includes('grecaptcha'))) { found = true; break; }
          }
        }
        if (found) break;
      }
      if (found){
        log('MutationObserver: найдены элементы capcha — выполняем refresh');
        setTimeout(()=> refreshAllCaptchaWidgets(), 600);
      }
    });

    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    log('MutationObserver запущен');
  }

  // Показ состояния токена в UI
  function updateTokenState(){
    try {
      const el = document.getElementById('rc_auto_token_state');
      if (!el) return;
      el.textContent = isCaptchaSolved() ? 'НАЙДЕН' : '—';
    } catch (e) { /* ignore */ }
  }

  // Инициализация UI и логики
  function init(){
    try {
      addManualButton();
      addSettingsPanel();
      startDomObserver();

      // автозапуск если включено и на странице есть признаки капчи
      function pageHasCaptchaHint() {
        try {
          if (document.querySelector('iframe[src*="recaptcha"], iframe[src*="google.com/recaptcha"], iframe[src*="recaptcha.net"]')) return true;
          if (document.querySelector('.g-recaptcha')) return true;
          if (document.querySelector('[data-sitekey]')) return true;
          if (/recaptcha|g-recaptcha|anti ?bot|captcha/i.test(document.body.innerText)) return true;
        } catch (e) {}
        return false;
      }

      if (settings.AUTO_ENABLED && pageHasCaptchaHint()) startAuto();
      // при клике — попробовать стартовать авто (если пользователь взаимодействует и капча может появиться)
      document.addEventListener('click', function onFirstClick(){
        setTimeout(()=> {
          if (settings.AUTO_ENABLED && pageHasCaptchaHint()) startAuto();
        }, 700);
        document.removeEventListener('click', onFirstClick);
      }, { once: true });

      // периодически обновлять индикатор токена
      setInterval(updateTokenState, 1500);
    } catch (e) {
      warn('init error', e);
    }
  }

  // cleanup
  window.addEventListener('beforeunload', ()=>{
    stopAuto();
    if (observer) observer.disconnect();
  });

  // старт
  init();

})();
