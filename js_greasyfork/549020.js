// ==UserScript==
// @name         Xospital Incidents Auto-Rescue (ЧП) — fixed Study priority
// @namespace    xospital-helper
// @version      0.3.1
// @description  ЧП: на списке кликает «Исследовать» в приоритете. ylwtitle — только если Study отсутствует. Завершает по «Завершить», затем «Продолжить». Повторяет цикл.
// @match        https://xospital.mobi/*
// @match        http://xospital.mobi/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549020/Xospital%20Incidents%20Auto-Rescue%20%28%D0%A7%D0%9F%29%20%E2%80%94%20fixed%20Study%20priority.user.js
// @updateURL https://update.greasyfork.org/scripts/549020/Xospital%20Incidents%20Auto-Rescue%20%28%D0%A7%D0%9F%29%20%E2%80%94%20fixed%20Study%20priority.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const LOG = (...a) => console.log('[xospital/ЧП]', ...a);

  // URLs/селекторы/регексы
  const INCIDENT_LIST_URL       = '/Quests';
  const ICON_SEL                = 'img[src$="tornado-icon.png"]';
  const STAR_SEL                = 'span.ylwtitle';
  const BTN_ACTION_SEL          = 'a.btn';
  const BTN_REFRESH_SEL         = 'a.btn_b';

  const RE_STUDY_TEXT           = /Исследовать/i;
  const RE_STUDY_HREF           = /\/Quests\/Study\b/i;

  const RE_CONTINUE_TEXT        = /Продолжить/i;
  const RE_CONTINUE_HREF        = /\/Quests\/StudyEnd\b/i;

  const RE_FINISH_TEXT          = /Завершить/i;
  const RE_FINISH_HREF          = /\/Quests\/StudyComplete\b/i;

  // Тайминги
  const CLICK_DELAY_MS          = [900, 2200];
  const START_DELAY_MS          = [600, 1200];
  const LIST_POLL_MS            = [120000, 180000];
  const LIST_REFRESH_MIN_MS     = 120000;
  const POST_FINISH_TO_CONT_MS  = [700, 1500];
  const AFTER_CONTINUE_MS       = [800, 1600];
  const YLWTITLE_THROTTLE_MS    = 10_000; // не клацать ylwtitle чаще, чем раз в 10с

  // Утилиты
  const sleep  = (ms) => new Promise(r => setTimeout(r, ms));
  const rand   = (a,b) => a + Math.floor(Math.random()*(b-a+1));
  const norm   = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const inPath = (p) => location.pathname.toLowerCase().startsWith(p.toLowerCase());
  const q  = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const now = () => Date.now();

  function clickSafe(el) {
    if (!el) return false;
    try { el.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, view:window })); } catch {}
    try { el.click(); } catch {}
    const href = el.getAttribute('href') || el.href;
    if (href) location.href = href;
    return true;
  }
  function findLinkByTextRE(re, root=document) {
    return qa('a', root).find(a => re.test(norm(a.textContent)));
  }
  function findLinkByHrefRE(re, root=document) {
    return qa('a', root).find(a => re.test(a.getAttribute('href') || ''));
  }

  // троттлинг обновления
  const LAST_REFRESH_KEY = 'quests_last_refresh_ts';
  function mayRefresh(delay) {
    const last = parseInt(sessionStorage.getItem(LAST_REFRESH_KEY) || '0', 10) || 0;
    const dt = now() - last;
    if (dt >= delay) {
      sessionStorage.setItem(LAST_REFRESH_KEY, String(now()));
      return { ok:true, wait:0 };
    }
    return { ok:false, wait: delay - dt };
  }

  // троттлинг ylwtitle
  const YLW_KEY = 'quests_last_ylw_click';
  function mayClickYlwtitle() {
    const last = parseInt(sessionStorage.getItem(YLW_KEY) || '0', 10) || 0;
    const ok = now() - last >= YLWTITLE_THROTTLE_MS;
    if (ok) sessionStorage.setItem(YLW_KEY, String(now()));
    return ok;
  }

  function findIncidentLinkOnList() {
    for (const li of qa('li')) {
      if (!q(ICON_SEL, li) || !q(STAR_SEL, li)) continue;
      const links = qa('a[href^="/Quests"]', li);
      const chp = links.find(a => /ЧП/i.test(norm(a.textContent)));
      if (chp) return chp;
      if (links[0]) return links[0];
    }
    return null;
  }

  async function main() {
    try {
      // заход на список
      if (!inPath('/Quests')) {
        const quick = q('a[href^="/Quests"]');
        if (quick) { LOG('→ /Quests (href)'); clickSafe(quick); return; }
        LOG('→ /Quests (direct)'); location.href = INCIDENT_LIST_URL; return;
      }

      // ПРИОРИТЕТЫ: Завершить → Продолжить → Исследовать → действия → поиск ЧП → ylwtitle → обновление
      const btnFinish   = findLinkByHrefRE(RE_FINISH_HREF)   || findLinkByTextRE(RE_FINISH_TEXT);
      if (btnFinish) {
        const d = rand(...START_DELAY_MS);
        LOG(`Нашёл «Завершить» → клик через ${Math.round(d/1000)}с`);
        await sleep(d);
        clickSafe(btnFinish);
        return;
      }

      const btnContinue = findLinkByHrefRE(RE_CONTINUE_HREF) || findLinkByTextRE(RE_CONTINUE_TEXT);
      if (btnContinue) {
        const d = rand(...POST_FINISH_TO_CONT_MS);
        LOG(`Нашёл «Продолжить» → клик через ${Math.round(d/1000)}с`);
        await sleep(d);
        clickSafe(btnContinue);
        setTimeout(() => { location.href = INCIDENT_LIST_URL; }, rand(...AFTER_CONTINUE_MS));
        return;
      }

      // ВАЖНО: «Исследовать» в приоритете, даже если ylwtitle виден
      const btnStudy = findLinkByHrefRE(RE_STUDY_HREF) || findLinkByTextRE(RE_STUDY_TEXT);
      if (btnStudy) {
        const d = rand(...START_DELAY_MS);
        LOG(`Нашёл «Исследовать» → клик через ${Math.round(d/1000)}с`);
        await sleep(d);
        clickSafe(btnStudy);
        return;
      }

      // Действия шага: любая .btn, кроме служебных кнопок
      const action = qa(BTN_ACTION_SEL).find(a => {
        const t = norm(a.textContent);
        const h = a.getAttribute('href') || '';
        if (RE_FINISH_HREF.test(h) || RE_FINISH_TEXT.test(t)) return false;
        if (RE_CONTINUE_HREF.test(h) || RE_CONTINUE_TEXT.test(t)) return false;
        if (RE_STUDY_HREF.test(h)   || RE_STUDY_TEXT.test(t))   return false;
        if (/обновить/i.test(t)) return false;
        return true;
      });
      if (action) {
        const d = rand(...CLICK_DELAY_MS);
        LOG(`Действие «${norm(action.textContent)}» → клик через ${Math.round(d/1000)}с`);
        await sleep(d);
        clickSafe(action);
        return;
      }

      // Если действий нет — попробуем найти ЧП в списке
      const inc = findIncidentLinkOnList();
      if (inc) {
        LOG(`Нашёл ЧП: «${norm(inc.textContent)}» → перехожу`);
        clickSafe(inc);
        return;
      }

      // ylwtitle как последняя попытка перейти к активному ЧП, но с троттлингом
      const star = q(STAR_SEL);
      if (star && mayClickYlwtitle()) {
        const host = star.closest('li') || document;
        const link = qa('a[href^="/Quests"]', host).find(a => /ЧП/i.test(norm(a.textContent))) || qa('a[href^="/Quests"]', host)[0];
        if (link) {
          LOG('Кликаю по квесту из ylwtitle (*)');
          clickSafe(link);
          return;
        }
      }

      // обновление списка (редко)
      const refresh = q(BTN_REFRESH_SEL) || findLinkByTextRE(/обновить/i);
      if (refresh) {
        const gate = mayRefresh(LIST_REFRESH_MIN_MS);
        if (!gate.ok) {
          const w = Math.ceil(gate.wait/1000);
          LOG(`ЧП нет. Жду ${w}с до следующего «Обновить».`);
          setTimeout(main, gate.wait + 50);
          return;
        }
        LOG('ЧП нет → жму «Обновить»');
        clickSafe(refresh);
        return;
      }

      // fallback: просто вернёмся к списку через 2–3 минуты
      const w = rand(...LIST_POLL_MS);
      LOG(`ЧП не найдено. Подожду ${Math.round(w/1000)}с и вернусь к списку.`);
      setTimeout(() => { location.href = INCIDENT_LIST_URL; }, w);

    } catch (e) {
      console.error('[xospital/ЧП] Ошибка:', e);
    }
  }

  // Автоперезапуски
  const scheduleRun = (d=0) => setTimeout(main, d);
  window.addEventListener('pageshow', () => scheduleRun(80));
  window.addEventListener('popstate', () => scheduleRun(0));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleRun(0); });
  setInterval(() => { if (!document.hidden) main(); }, 20000);

  scheduleRun(0);
})();
