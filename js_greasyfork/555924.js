// ==UserScript==
// @name         Deadgod WIKI
// @namespace    http://tampermonkey.net/
// @version      2025-11-16.5
// @description  DeadGod: заметки (минимум фич). Фикс: только логика лайков/дизлайков, стабильный userHash, человеко-понятные alert'ы, свежая подгрузка заметок, и сохранение переносов строк даже если бэкенд их сплющивает.
// @author       You
// @match        https://dead-god.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dead-god.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555924/Deadgod%20WIKI.user.js
// @updateURL https://update.greasyfork.org/scripts/555924/Deadgod%20WIKI.meta.js
// ==/UserScript==

// ВАЖНО: сохранены все твои правки и структура. Изменены ТОЛЬКО:
// 1) userHash — стабильный 64‑символьный hex, хранится в localStorage и добавляется в body + query к /publish, /rate, /notes.
// 2) Голосование — строго -1 или 1 (бэкенд не принимает 0), переключение между ними.
// 3) «Заметки игроков» — при каждом открытии всегда свежий запрос.
// 4) ЧЕЛОВЕКО‑ПОНЯТНЫЕ ОШИБКИ: HTTP‑коды и error.code мапятся на простые сообщения (429 → «слишком часто», и т. п.).
// 5) ПОСЛЕ ПУБЛИКАЦИИ — сразу обновляем блок «Заметки игроков» (forceFresh), даже если он свернут (пересчитается счётчик).
// 6) ПЕРЕНОСЫ СТРОК: отображение сохранено с переносами (white-space: pre-wrap). Для защиты от их потери на бэкенде — при публикации кодируем \n в [[DG_NL]], а при показе декодируем обратно.

(() => {
  if (window.__DG_NOTES_INITED__) return; // защита от повторной инициализации
  window.__DG_NOTES_INITED__ = true;

  const DG = {
    API: 'https://deadgod.ichuk.ru',
    modalSel: '#info',
    otherSel: '.info__other', // UL
    descSel: '.info__description',
    RATE_TTL_MS: 60000,        // не чаще 1 раза в минуту на itemId (для пассивного обновления)
    ERROR_BACKOFF_MS: 180000,  // после ошибки — пауза 3 минуты
    OBS_DEBOUNCE_MS: 300,      // дебаунс мутаций модалки
    AUTOSAVE_DEBOUNCE_MS: 600  // автосохранение заметки (дебаунс)
  };

  // Токен для кодирования переносов строк (минимальный шанс коллизии с пользовательским текстом)
  const NL_TOKEN = '[[DG_NL]]';

  // --- СТИЛИ: чёткая контрастность + подсветка активного лайка/дизлайка ---
  const style = document.createElement('style');
  style.textContent = `
  .dg-notes, .dg-notes-published { font-family: inherit; margin: 12px 0; }
  .dg-notes label { display:block; margin-bottom: 6px; font-weight: 600; color: #fff !important; }
  .dg-notes textarea {     min-height: 110px;
    border-radius: 10px;
    outline: none; }
  .dg-notes textarea::placeholder{ color:#aaa; }
  .dg-notes .dg-row { display:flex; gap:8px; align-items:center; margin-top:8px; flex-wrap: wrap; }
  .dg-notes button { border: 1px solid #333;
    border-radius: 8px;
    padding: 8px 12px;
    background: #494949 !important;
    color: #fff !important;
    cursor: pointer; }
  .dg-notes button[disabled]{ opacity:.6; cursor:default; }
  .dg-status{ margin-left:8px; font-size:.9em; color:#ddd; }

  /* В опубликованных — белый текст на тёмном фоне */
  .dg-notes-published { margin-top: 10px; }
  .dg-notes-published details{ border: none;
    border-radius: 12px;
    padding: 8px 12px;
    background: #0d0d0d00;
    color: #fff; }
  .dg-notes-published summary{ cursor:pointer; font-weight:700; color:#fff; }
  .dg-list{ margin-top:8px; display:grid; gap:10px; }
  .dg-note{     border-radius: 12px;
    padding: 8px 12px;
    background: #383838;
    border: 1px solid #0000001c;
    color: #fff;
 }
  .dg-note .dg-actions{ display:flex; gap:10px; align-items:center; margin-top:6px; }
  .dg-like, .dg-dislike{ border:1px solid #444; padding:6px 10px; border-radius:10px; background:#1f1f1f57!important; color:#fff !important; cursor:pointer; outline:none !important; }
  .dg-like.dg-active, .dg-dislike.dg-active{ outline: 2px solid #666; box-shadow: 0 0 0 2px #222 inset; }
  .dg-like[aria-pressed="true"], .dg-dislike[aria-pressed="true"]{ outline: 2px solid #666; box-shadow: 0 0 0 2px #222 inset; }
  .dg-score{ font-size:.9em; color:#bbb; }
  /* Показ переносов строк в тексте заметок */
  .dg-note .dg-text{ white-space: pre-wrap; }

  /* Корректное встраивание в UL.info__other */
  li.dg-notes-li { list-style: none; margin-top: 10px; }
  `;
  document.head.appendChild(style);

  // --- УТИЛИТЫ ---
  const getNumericId = (raw) => {
    if (!raw) return null;
    const m = String(raw).match(/(\d+)(?!.*\d)/);
    return m ? m[1] : String(raw);
  };
  const localKey = (itemId) => `dg:note:${itemId}`;

  const escapeHTML = (s) => String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const score = (note) => {
    const likes = Number(note.likes) || 0, dislikes = Number(note.dislikes) || 0;
    const total = likes + dislikes;
    const ratio = total ? likes / total : 0;
    const diff = likes - dislikes;
    return { ratio, diff, total };
  };

  const debounce = (fn, delay) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; };

  function clearStatusLater(node, ms = 1200) { setTimeout(() => { if (node && node.textContent === '✓ автосохранено') node.textContent = ''; }, ms); }

  // --- СТАБИЛЬНЫЙ userHash (один на браузер, 64 hex) ---
  function getUserHash(){
    const KEY = 'dg:userHash';
    try {
      let uh = localStorage.getItem(KEY);
      if (!uh) {
        if (window.crypto?.getRandomValues) {
          const arr = new Uint8Array(32); // 256 бит => 64 hex
          crypto.getRandomValues(arr);
          uh = Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
        } else {
          uh = 'uh-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
          // доводим до 64 символов
          while (uh.length < 64) uh += uh;
          uh = uh.slice(0,64);
        }
        localStorage.setItem(KEY, uh);
      }
      return uh;
    } catch {
      // на случай недоступного localStorage — volatile
      if (window.crypto?.getRandomValues) {
        const arr = new Uint8Array(32);
        crypto.getRandomValues(arr);
        return Array.from(arr).map(b => b.toString(16).padStart(2,'0')).join('');
      }
      return 'uh-' + Math.random().toString(36).slice(2).padEnd(64,'x').slice(0,64);
    }
  }
  const USER_HASH = getUserHash();

  // Универсальные помощники для ответов бэкенда
  async function readJsonSafe(res){
    try {
      const text = await res.text();
      if (!text) return null;
      try { return JSON.parse(text); } catch { return null; }
    } catch { return null; }
  }

  function friendlyHttpMessage(status, action){
    switch (Number(status)){
      case 429: return `Слишком часто ${action}. Подождите немного и попробуйте снова.`;
      case 400: return `Запрос отклонён: некорректные данные. Обновите страницу и повторите.`;
      case 401:
      case 403: return `Доступ к ${action} сейчас ограничен защитой сайта. Попробуйте позже.`;
      case 404: return `Не найдено. Возможно, заметка уже удалена.`;
      case 500:
      case 502:
      case 503:
      case 504: return `На сервере временная ошибка. Попробуйте чуть позже.`;
      default: return `Не удалось выполнить ${action} (HTTP ${status}). Попробуйте позже.`;
    }
  }

  function friendlyBackendError(error, action){
    const code = (error?.code || '').toUpperCase();
    const msg = error?.message;
    switch (code){
      case 'RATE_LIMITED': return `Слишком часто ${action}. Сделайте паузу 10–15 секунд и попробуйте снова.`;
      case 'VALIDATION_ERROR': return `Данные не прошли проверку на сервере: ${msg || 'проверьте ввод'}.`;
      case 'ALREADY_VOTED': return `Вы уже голосовали за эту заметку в этом браузере. Можно переключить голос, нажав другой значок.`;
      case 'NOT_FOUND': return `Заметка не найдена или уже удалена.`;
      case 'TOO_LONG': return `Слишком длинный текст. Сократите заметку и отправьте снова.`;
      case 'DUPLICATE': return `Такая заметка уже есть. Измените формулировку и попробуйте ещё раз.`;
      case 'SPAM': return `Похоже на спам. Измените формулировку и отправьте заново.`;
      default: return msg ? msg : `Не удалось выполнить ${action}. Попробуйте позже.`;
    }
  }

  function alertFromBackend(json, fallbackMsg, action){
    if (json && json.ok === false && json.error) {
      alert(friendlyBackendError(json.error, action) || fallbackMsg || 'Ошибка');
      return true;
    }
    return false;
  }

  // --- Источник правды про текущий itemId из модалки ---
  function getCurrentModalItemId(modal) {
    const idEl = modal.querySelector('.info__header-id');
    if (idEl) {
      const m = idEl.textContent && idEl.textContent.match(/ID\s*:\s*(\d+)/i);
      if (m) return m[1];
    }
    const img = modal.querySelector('.info__header-img');
    if (img?.src) {
      const m2 = img.src.match(/\/(\d+)\.(?:png|jpg|webp)/i);
      if (m2) return m2[1];
    }
    return null;
  }

  // --- КЭШ заметок + троттлинг запросов ---
  const NotesCache = new Map(); // itemId -> {notes:Array|null, lastFetch:number, nextAllowed:number, inFlight:Promise|null, lastError:boolean}

  async function fetchNotesThrottled(itemId) {
    itemId = String(getNumericId(itemId));
    const now = Date.now();
    const entry = NotesCache.get(itemId) || { notes:null, lastFetch:0, nextAllowed:0, inFlight:null, lastError:false };

    if (entry.inFlight) return entry.inFlight;
    // Возвращаем кэш или пустой массив, если ещё идёт бэкофф
    if (now < entry.nextAllowed) return entry.notes ?? [];

    const run = (async () => {
      const url = `${DG.API}/notes?id=${encodeURIComponent(itemId)}&userHash=${encodeURIComponent(USER_HASH)}`;
      try {
        const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await readJsonSafe(res);
        const notes = Array.isArray(data) ? data : (data?.notes || []);
        entry.notes = notes;
        entry.lastFetch = now;
        entry.nextAllowed = now + DG.RATE_TTL_MS; // нормальная частота
        entry.lastError = false;
        return entry.notes;
      } catch (e) {
        // CORS / сеть — ставим бэкофф подольше
        entry.nextAllowed = now + DG.ERROR_BACKOFF_MS;
        entry.lastError = true;
        return entry.notes ?? [];
      } finally {
        entry.inFlight = null;
        NotesCache.set(itemId, entry);
      }
    })();

    entry.inFlight = run;
    NotesCache.set(itemId, entry);
    return run;
  }

  // СВЕЖИЙ ЗАПРОС (для каждого раскрытия details) — обход троттлинга
  async function fetchNotesFresh(itemId) {
    itemId = String(getNumericId(itemId));
    const now = Date.now();
    const entry = NotesCache.get(itemId) || { notes:null, lastFetch:0, nextAllowed:0, inFlight:null, lastError:false };

    if (entry.inFlight) return entry.inFlight; // не дублируем конкурентные

    const run = (async () => {
      const url = `${DG.API}/notes?id=${encodeURIComponent(itemId)}&userHash=${encodeURIComponent(USER_HASH)}`;
      try {
        const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await readJsonSafe(res);
        const notes = Array.isArray(data) ? data : (data?.notes || []);
        entry.notes = notes;
        entry.lastFetch = now;
        entry.nextAllowed = now + DG.RATE_TTL_MS; // подстрахуем кэш для фона
        entry.lastError = false;
        return entry.notes;
      } catch (e) {
        entry.lastError = true;
        return entry.notes ?? [];
      } finally {
        entry.inFlight = null;
        NotesCache.set(itemId, entry);
      }
    })();

    entry.inFlight = run;
    NotesCache.set(itemId, entry);
    return run;
  }

  // --- РЕНДЕР ИНПУТА ЗАМЕТОК (АВТОСОХРАНЕНИЕ, БЕЗ КНОПКИ "СОХРАНИТЬ") ---
  function renderEditor(itemId) {
    const wrap = document.createElement('div');
    wrap.className = 'dg-notes';
    wrap.dataset.itemId = itemId;
    const areaId = `dg-note-area-${itemId}`;
    wrap.innerHTML = `
      <label for="${areaId}">Ваша заметка (автосохранение в браузере; можно опубликовать)</label>
      <textarea class="issue__input" id="${areaId}" placeholder="совет, синергия, баг, нюанс баланса и т. п."></textarea>
      <div class="dg-row">
        <button type="button" class="dg-publish">Опубликовать</button>
        <span class="dg-status" aria-live="polite"></span>
      </div>
    `;

    const ta = wrap.querySelector('textarea');
    const status = wrap.querySelector('.dg-status');

    // восстановление
    try {
      const saved = localStorage.getItem(localKey(itemId));
      if (saved) ta.value = saved;
    } catch {}

    // автосохранение с дебаунсом
    const doSave = () => {
      try {
        localStorage.setItem(localKey(itemId), ta.value.trim());
        status.textContent = '✓ автосохранено';
        clearStatusLater(status);
      } catch {}
    };
    const debouncedSave = debounce(doSave, DG.AUTOSAVE_DEBOUNCE_MS);
    ta.addEventListener('input', debouncedSave);

    // публикация (с подтверждающим диалогом)
    wrap.querySelector('.dg-publish').addEventListener('click', async () => {
      const raw = ta.value; // НЕ трогаем промежуточные переносы
      const normalized = raw.replace(/\r\n/g, '\n');
      const text = normalized.trim();
      if (!text) { status.textContent = 'Пустую заметку нельзя опубликовать'; setTimeout(()=>status.textContent='',1500); return; }

      // Закодируем переносы строк, чтобы бэкенд не «сплющил»
      const encodedText = text.replace(/\n/g, NL_TOKEN);

      // Диалог подтверждения
      const ok = window.confirm(
        'Перед публикацией: заметка должна быть полезна для всех игроков.\nЛичные заметки оставляйте личными.\n\nОпубликовать эту заметку?'
      );
      if (!ok) return;

      const btn = wrap.querySelector('.dg-publish');
      btn.disabled = true; status.textContent = 'Публикуем...';
      try {
        const res = await fetch(`${DG.API}/publish?userHash=${encodeURIComponent(USER_HASH)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({ itemId: getNumericId(itemId), text: encodedText, userHash: USER_HASH })
        });
        const json = await readJsonSafe(res);
        if (!res.ok) {
          alert(friendlyHttpMessage(res.status, 'публикацию'));
          status.textContent = 'Ошибка публикации';
          return;
        }
        if (alertFromBackend(json, 'Ошибка публикации', 'публикацию')) {
          status.textContent = 'Ошибка публикации';
          return;
        }
        status.textContent = 'Отправлено на модерацию/публикацию';

        // ★ После успешной публикации — обновляем блок «Заметки игроков» (forceFresh)
        const container = wrap.closest('li.dg-notes-li') || document;
        const pub = container.querySelector('.dg-notes-published');
        if (pub) {
          const list = pub.querySelector('.dg-list');
          const count = pub.querySelector('.dg-count');
          if (list) safeRefreshList(list, itemId, count, true);
        }
      } catch (e) {
        alert('Не удалось связаться с сервером. Проверьте интернет и попробуйте позже.');
        status.textContent = 'Ошибка публикации';
      } finally { btn.disabled = false; setTimeout(()=>status.textContent='',1500); }
    });

    return wrap;
  }

  // --- СПИСОК ОПУБЛИКОВАННЫХ ЗАМЕТОК ---
  function renderPublishedBlock(itemId) {
    const wrap = document.createElement('div');
    wrap.className = 'dg-notes-published';
    wrap.dataset.itemId = itemId;
    wrap.innerHTML = `
      <details>
        <summary> Заметки игроков <span class="dg-count"></span></summary>
        <div class="dg-list" data-item-id="${itemId}"></div>
      </details>
    `;

    const details = wrap.querySelector('details');
    details.addEventListener('toggle', () => {
      if (details.open) {
        // ВСЕГДА свежий запрос при каждом раскрытии
        const list = wrap.querySelector('.dg-list');
        const count = wrap.querySelector('.dg-count');
        safeRefreshList(list, itemId, count, true /* forceFresh */);
      }
    });

    return wrap;
  }

  function renderNoteCard(note, itemId) {
    const card = document.createElement('div');
    card.className = 'dg-note';
    card.dataset.noteId = note.id || note.noteId || '';
    note.likes = Number(note.likes) || 0;
    note.dislikes = Number(note.dislikes) || 0;

    // Декодируем переносы, если бэкенд вернул плоскую строку с нашим токеном
    const rawText = String(note.text || '');
    const withNewlines = rawText.includes(NL_TOKEN) ? rawText.split(NL_TOKEN).join('\n') : rawText;

    card.innerHTML = `
      <div class="dg-text">${escapeHTML(withNewlines)}</div>
      <div class="dg-actions">
        <button type="button" class="dg-like" aria-pressed="false">👍</button>
        <span class="dg-score"></span>
        <button type="button" class="dg-dislike" aria-pressed="false">👎</button>
      </div>
    `;

    const scoreEl = card.querySelector('.dg-score');
    const likeBtn = card.querySelector('.dg-like');
    const dislikeBtn = card.querySelector('.dg-dislike');

    const updateScore = () => {
      const s = score(note);
      scoreEl.textContent = `${note.likes || 0} / ${note.dislikes || 0} · ${(s.ratio * 100).toFixed(0)}%`;
    };

    const votedKey = `dg:vote:${getNumericId(itemId)}:${card.dataset.noteId}`;
    const getVote = () => {
      const v = Number(localStorage.getItem(votedKey) || '0'); // ожидаем -1 или 1; 0 = не голосовал
      return (v === 1 || v === -1) ? v : 0;
    };

    const reflectButtons = (vote) => {
      const set = (btn, active) => {
        btn.classList.toggle('dg-active', !!active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      };
      set(likeBtn, vote === 1);
      set(dislikeBtn, vote === -1);
    };

    // Локальное переключение строго между -1 и 1 (0 бэкенд не принимает)
    const applyLocalSwitch = (prev, next) => {
      if (prev === next) return;
      if (prev === 1) note.likes = Math.max(0, note.likes - 1);
      if (prev === -1) note.dislikes = Math.max(0, note.dislikes - 1);
      if (next === 1) note.likes += 1;
      if (next === -1) note.dislikes += 1;
      updateScore();
      reflectButtons(next);
      localStorage.setItem(votedKey, String(next));
    };

    updateScore();
    reflectButtons(getVote());

    let inFlight = false; // чтобы не спамить несколькими запросами подряд

    const sendVote = async (newVote, prevVote) => {
      try {
        const res = await fetch(`${DG.API}/rate?userHash=${encodeURIComponent(USER_HASH)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          cache: 'no-store',
          body: JSON.stringify({ itemId: getNumericId(itemId), noteId: card.dataset.noteId, vote: newVote, userHash: USER_HASH }) // только -1 или 1
        });
        const json = await readJsonSafe(res);
        if (!res.ok) {
          alert(friendlyHttpMessage(res.status, 'голосование'));
          // откатить локальные изменения
          applyLocalSwitch(newVote, prevVote);
          return;
        }
        if (alertFromBackend(json, 'Ошибка голосования', 'голосование')) {
          // откатить локальные изменения
          applyLocalSwitch(newVote, prevVote);
          return;
        }
      } catch (e) {
        alert('Не удалось связаться с сервером. Проверьте интернет и попробуйте позже.');
        // откатить локальные изменения
        applyLocalSwitch(newVote, prevVote);
      } finally {
        inFlight = false;
      }
    };

    likeBtn.addEventListener('click', () => {
      if (inFlight) return;
      const prev = getVote();
      const next = (prev === 1) ? -1 : 1; // 1 -> -1 -> 1
      inFlight = true;
      applyLocalSwitch(prev, next);
      sendVote(next, prev);
    });

    dislikeBtn.addEventListener('click', () => {
      if (inFlight) return;
      const prev = getVote();
      const next = (prev === -1) ? 1 : -1;
      inFlight = true;
      applyLocalSwitch(prev, next);
      sendVote(next, prev);
    });

    return card;
  }

  async function safeRefreshList(listEl, itemId, countEl, forceFresh = false) {
    if (!listEl) return;
    listEl.textContent = 'Загружаем заметки...';
    const notes = await (forceFresh ? fetchNotesFresh(itemId) : fetchNotesThrottled(itemId));

    // если последняя попытка была ошибочной и нет кэша — покажем дружелюбное сообщение
    const cache = NotesCache.get(String(getNumericId(itemId)));
    if (!notes || !notes.length) {
      listEl.textContent = cache?.lastError
        ? 'Не удалось загрузить заметки (CORS/сеть). Повторим позже.'
        : 'Пока нет заметок';
      if (countEl) countEl.textContent = notes && notes.length ? `(${notes.length})` : '(0)';
      return;
    }

    // сортировка
    notes.sort((a, b) => {
      const sa = score(a), sb = score(b);
      if (sb.ratio !== sa.ratio) return sb.ratio - sa.ratio;
      if (sb.diff !== sa.diff) return sb.diff - sa.diff;
      return (sb.total - sa.total);
    });

    listEl.textContent = '';
    if (countEl) countEl.textContent = `(${notes.length})`;
    notes.forEach(n => listEl.appendChild(renderNoteCard(n, itemId)));
  }

  // --- МОНТАЖ ВНУТРИ МОДАЛКИ #info ---
  function mountIntoModal(modal) {
    if (!modal) return;
    const itemId = getCurrentModalItemId(modal);
    if (!itemId) return;

    // если уже смонтировано под этот же id — просто убедимся, что блоки на месте
    if (modal.dataset.dgMountedForId === String(itemId)) {
      ensureBlocks(modal, itemId);
      return;
    }

    // новый item: очистка старых блоков
    modal.querySelectorAll('.dg-notes, .dg-notes-published, li.dg-notes-li').forEach(n => n.remove());
    modal.dataset.dgMountedForId = String(itemId);

    ensureBlocks(modal, itemId);
  }

  function ensureBlocks(modal, itemId) {
    const others = modal.querySelectorAll(DG.otherSel); // UL

    // Редактор + (под ним) опубликованные — как один блок внутри UL.info__other
    if (others.length) {
      others.forEach((ul) => {
        let li = ul.querySelector('li.dg-notes-li');
        if (!li) {
          li = document.createElement('li');
          li.className = 'dg-notes-li';
          const editor = renderEditor(itemId);
          li.appendChild(editor);
          const pub = renderPublishedBlock(itemId);
          li.appendChild(pub); // ЗАМЕТКИ ИГРОКОВ — ПОД ИНПУТОМ
          ul.appendChild(li);
        } else {
          // если li уже есть — убедимся, что внутри него есть editor и published на текущий itemId
          let editor = li.querySelector('.dg-notes');
          if (!editor) {
            editor = renderEditor(itemId);
            li.appendChild(editor);
          }
          let pub = li.querySelector('.dg-notes-published');
          if (!pub) {
            pub = renderPublishedBlock(itemId);
            li.appendChild(pub);
          } else if (pub.dataset.itemId !== String(itemId)) {
            pub.replaceWith(renderPublishedBlock(itemId));
          }
        }
      });
    } else {
      // Фолбэк: если UL нет — поместим в конец модалки (единым блоком editor + published)
      const fallback = modal.querySelector('.info__block') || modal;
      let container = fallback.querySelector('li.dg-notes-li, .dg-notes');
      if (!container) {
        const li = document.createElement('li');
        li.className = 'dg-notes-li';
        li.appendChild(renderEditor(itemId));
        li.appendChild(renderPublishedBlock(itemId));
        fallback.appendChild(li);
      } else {
        const parent = container.closest('li.dg-notes-li') || fallback;
        if (!parent.querySelector('.dg-notes')) parent.appendChild(renderEditor(itemId));
        if (!parent.querySelector('.dg-notes-published')) parent.appendChild(renderPublishedBlock(itemId));
      }
    }
  }

  // --- Наблюдаем за модалкой, но БЕЗ спама: дебаунс + кэш ---
  const modal = document.querySelector(DG.modalSel);
  const schedule = (() => { let t=null; return (fn)=>{ clearTimeout(t); t=setTimeout(fn, DG.OBS_DEBOUNCE_MS); } })();
  function tryMount() { mountIntoModal(modal); }

  if (modal) {
    const obs = new MutationObserver(() => schedule(tryMount));
    obs.observe(modal, { childList: true, subtree: true });
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', tryMount, { once:true });
    } else {
      tryMount();
    }
  } else {
    const bodyObs = new MutationObserver(() => {
      const m = document.querySelector(DG.modalSel);
      if (m) {
        bodyObs.disconnect();
        const obs = new MutationObserver(() => schedule(() => mountIntoModal(m)));
        obs.observe(m, { childList: true, subtree: true });
        mountIntoModal(m);
      }
    });
    bodyObs.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }
})();