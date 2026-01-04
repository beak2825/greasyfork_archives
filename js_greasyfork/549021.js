// ==UserScript==
// @name         Xospital Operation Runner (queue -> go -> dice delayed) + dice mode (safe Go)
// @namespace    xospital-helper
// @version      0.9.0
// @description  Операционная: очередь → Перейти (только по приглашению и если операция не активна) → кидать кубик с рандомной задержкой. Режимы: plain_only | prefer_plus2.
// @match        https://xospital.mobi/*
// @match        http://xospital.mobi/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549021/Xospital%20Operation%20Runner%20%28queue%20-%3E%20go%20-%3E%20dice%20delayed%29%20%2B%20dice%20mode%20%28safe%20Go%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549021/Xospital%20Operation%20Runner%20%28queue%20-%3E%20go%20-%3E%20dice%20delayed%29%20%2B%20dice%20mode%20%28safe%20Go%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const LOG = (...a) => console.log('[xospital/operation]', ...a);

  // ====== НАСТРОЙКА ИГРОКА ======
  // Поставь свой ник ровно как в игре. Используется, чтобы понять, что ты уже в активной операции.
  const MY_NICK = 'InGodWeTrust';

  // ====== РЕЖИМ БРОСКА КУБИКА ======
  const PROMPT_DICE_MODE  = true;
  const DICE_MODE_DEFAULT = 'prefer_plus2'; // 'plain_only' | 'prefer_plus2'
  const DICE_MODE_KEY     = 'xop_dice_mode';

  function getDiceMode() {
    let m = sessionStorage.getItem(DICE_MODE_KEY);
    if (!m) {
      if (PROMPT_DICE_MODE) {
        const ans = prompt(
          'Выбери режим кубика:\n' +
          '1 — plain_only (только обычный, без +2)\n' +
          '2 — prefer_plus2 (если есть +2 — его, иначе обычный)',
          '2'
        );
        const map = { '1': 'plain_only', '2': 'prefer_plus2' };
        m = map[String(ans || '').trim()] || DICE_MODE_DEFAULT;
      } else {
        m = DICE_MODE_DEFAULT;
      }
      sessionStorage.setItem(DICE_MODE_KEY, m);
      LOG('Режим кубика:', m);
    }
    return m;
  }

  // ====== ТАЙМИНГИ ======
  const REFRESH_QUEUE_MS    = 15_000; // когда стоим в очереди
  const REFRESH_DEFAULT_MS  = 10_000; // вне очереди
  const DICE_WAIT_MAX_MS    = 15_000; // максимум ждать появления кнопки кубика
  const DICE_POLL_MS        = 3_000;  // опрос наличия кубика
  const MIN_CLICK_DELAY_MS  = 1_500;  // задержка перед кликом по кубику (мин)
  const MAX_CLICK_DELAY_MS  = 5_000;  // задержка перед кликом по кубику (макс)
  const AFTER_FINISH_MIN_MS = 8_000; // пауза после "Операция завершена"
  const AFTER_FINISH_MAX_MS = 15_000;

  // троттлинги
  const LAST_REFRESH_TS_KEY = 'op_last_refresh_ts';
  const GO_LAST_TS_KEY      = 'xop_last_go_ts';
  const GO_THROTTLE_MS      = 35_000; // не жать «Перейти» чаще, чем раз в 50с

  // ====== УТИЛИТЫ ======
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const inPath= (p) => location.pathname.toLowerCase().startsWith(p.toLowerCase());
  const now   = () => Date.now();
  const normText = (s) => (s || '').replace(/\s+/g, ' ').trim();

  function findLinkContains(text, root = document) {
    const t = String(text).trim();
    const as = root.querySelectorAll('a');
    for (const a of as) if (normText(a.textContent).includes(t)) return a;
    return null;
  }
  function clickSafe(el) {
    if (!el) return false;
    try { el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); } catch {}
    try { el.click?.(); } catch {}
    const href = el.getAttribute?.('href') || el.href;
    if (href) location.href = href;
    return true;
  }
  function textExists(selectorOrRoot, regex) {
    let text = '';
    if (typeof selectorOrRoot === 'string') {
      const el = document.querySelector(selectorOrRoot);
      text = normText((el && (el.innerText || el.textContent)) || '');
    } else {
      const root = selectorOrRoot || document.body;
      text = normText(root.innerText || root.textContent || '');
    }
    return regex.test(text);
  }
  function mayRefreshAfter(delayMs) {
    const last = parseInt(sessionStorage.getItem(LAST_REFRESH_TS_KEY) || '0', 10) || 0;
    const delta = now() - last;
    if (delta >= delayMs) {
      sessionStorage.setItem(LAST_REFRESH_TS_KEY, String(now()));
      return { ok: true, wait: 0 };
    }
    return { ok: false, wait: delayMs - delta };
  }

  // приглашение + защита от клика «Перейти» во время активной игры
  function invitedToOR() {
    return /Вас зовут в операционную!/i.test(document.body.innerText || '');
  }
  function hasActiveOperationUI() {
    // признаки, что операция уже идёт и уходить нельзя
    if (document.querySelector('a[href^="/Operation/DropDice"]')) return true; // кнопка броска
    if (/Ход операции/i.test(document.body.innerText || '')) return true;
    if (/Журнал/i.test(document.body.innerText || '')) return true;
    if (findLinkContains(MY_NICK)) return true; // мой ник виден в составе команды
    return false;
  }
  function mayClickGoNow() {
    const last = parseInt(sessionStorage.getItem(GO_LAST_TS_KEY) || '0', 10) || 0;
    const ok = now() - last >= GO_THROTTLE_MS;
    if (ok) sessionStorage.setItem(GO_LAST_TS_KEY, String(now()));
    return ok;
  }

  // ====== КУБИК ======
  function findDiceLink() {
    const links = Array.from(document.querySelectorAll('a[href^="/Operation/DropDice"]'));
    if (!links.length) return null;

    const mode  = getDiceMode();
    const plus2 = links.find(a => /\+2/.test(normText(a.textContent))) || null;
    const plain = links.find(a => !/\+2/.test(normText(a.textContent))) || null;

    if (mode === 'plain_only') return plain;            // только обычный
    if (mode === 'prefer_plus2') return plus2 || plain; // +2 в приоритете
    return plain || plus2 || null;
  }
  async function clickDiceWithDelay(dice) {
    const delay = rand(MIN_CLICK_DELAY_MS, MAX_CLICK_DELAY_MS);
    LOG(`Кубик (${normText(dice.textContent) || 'link'}) → через ${Math.round(delay/1000)}с [mode=${getDiceMode()}]`);
    await sleep(delay);
    clickSafe(dice);
  }

  // ====== ОСНОВНОЙ ЦИКЛ ======
  async function main() {
    try {
      // не в /Operation → зайти
      if (!inPath('/Operation')) {
        const opHref = document.querySelector('a[href^="/Operation"]');
        if (opHref) { LOG('→ «Операционная» (href)'); clickSafe(opHref); return; }
        const opText = findLinkContains('Операционная');
        if (opText) { LOG('→ «Операционная» (text)'); clickSafe(opText); return; }
        LOG('→ /Operation (direct)'); location.href = '/Operation'; return;
      }

      // операция завершена
      if (textExists(document.body, /Операция завершена\./i)) {
        const delay = rand(AFTER_FINISH_MIN_MS, AFTER_FINISH_MAX_MS);
        LOG(`Операция завершена → пауза ${Math.round(delay/1000)}с`);
        await sleep(delay);
        location.href = '/Operation';
        return;
      }

      // 1) Встать в очередь
      const join = findLinkContains('Встать в очередь');
      if (join) { LOG('Жму «Встать в очередь»'); clickSafe(join); return; }

      // 2) Перейти — ТОЛЬКО если есть приглашение и операция не активна (плюс троттлинг)
      const go = findLinkContains('Перейти');
      if (go && invitedToOR() && !hasActiveOperationUI() && mayClickGoNow()) {
        LOG('Жму «Перейти» (есть приглашение, активной операции нет)');
        clickSafe(go);
        return;
      }

      // 3) Кубики
      let dice = findDiceLink();
      if (dice) { await clickDiceWithDelay(dice); return; }

      // ждём появления кубика
      const maxWaitSec = Math.ceil(DICE_WAIT_MAX_MS / 1000);
      LOG(`Жду кнопку кубика до ${maxWaitSec}с…`);
      const start = now();
      while (now() - start < DICE_WAIT_MAX_MS) {
        dice = findDiceLink();
        if (dice) { await clickDiceWithDelay(dice); return; }
        await sleep(DICE_POLL_MS);
      }

      // «Обновить» по троттлингу
      const refresh = findLinkContains('Обновить');
      if (refresh) {
        const inQueue = /В очереди/i.test(document.body.innerText || '');
        const delay = inQueue ? REFRESH_QUEUE_MS : REFRESH_DEFAULT_MS;
        const gate = mayRefreshAfter(delay);
        if (!gate.ok) {
          LOG(`Рано обновлять, подожду ${Math.ceil(gate.wait/1000)}с (inQueue=${inQueue})`);
          setTimeout(main, gate.wait + 50);
          return;
        }
        LOG(`Кубика нет ${maxWaitSec}с → «Обновить» (интервал ${delay/1000}с, inQueue=${inQueue})`);
        clickSafe(refresh);
        return;
      }

      // фолбэк
      LOG('Нет подходящих кнопок. Перезахожу в /Operation.');
      location.href = '/Operation';

    } catch (e) {
      console.error('[xospital/operation] Ошибка:', e);
    }
  }

  const scheduleRun = (d=0) => setTimeout(main, d);
  window.addEventListener('pageshow', () => scheduleRun(80));
  window.addEventListener('popstate', () => scheduleRun(0));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleRun(0); });
  setInterval(() => { if (!document.hidden) main(); }, 20_000);

  // стартуем
  getDiceMode();
  scheduleRun(0);
})();
