// ==UserScript==
// @name         Chatwoot Main
// @namespace    http://tampermonkey.net/
// @version      33.4
// @description  :)
// @match        *://app.chatwoot.com/*
// @match        https://admin.4rabetsite.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      app.chatwoot.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564288/Chatwoot%20Main.user.js
// @updateURL https://update.greasyfork.org/scripts/564288/Chatwoot%20Main.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Функция для скрытия всех, кроме трёх последних чатов
    function showOnlyLastThree() {
        const chats = document.querySelectorAll('.contact-conversation--list .conversation');
        if (!chats.length) return;

        chats.forEach((chat, index) => {
            // Показываем только первые 3 (если сортировка сверху вниз по убыванию времени)
            if (index > 1) {
                chat.style.display = 'none';
            } else {
                chat.style.display = '';
            }
        });
    }

    // Наблюдаем за изменениями DOM (чаты подгружаются асинхронно)
    const observer = new MutationObserver(() => showOnlyLastThree());
    observer.observe(document.body, { childList: true, subtree: true });

    // Первоначальный запуск через короткую задержку
    setTimeout(showOnlyLastThree, 2000);
})();

(function() {
    'use strict';

    const DEBUG = Boolean(window.TM_TIMER_DEBUG);

    // ---------- Стили ----------
    GM_addStyle(`
      div.flex.group.is-editable > p {
        min-width: 60px !important;
        display: inline-flex !important;
        justify-content: center !important;
        cursor: pointer !important;
      }
      .tm-right-timer { font-weight: bold; }
      .tm-uuid-clickable { transition: color 0.2s ease; }
    `);

    // ---------- Утилиты парсинга ----------
    function tryParseDateString(s) {
        if (!s || typeof s !== 'string') return null;
        s = s.trim();
        const msMatch = s.match(/(\d{13})/);
        if (msMatch) return Number(msMatch[1]);
        const isoMatch = s.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?/);
        if (isoMatch) return Date.parse(isoMatch[0]);
        const parsed = Date.parse(s);
        if (!Number.isNaN(parsed)) return parsed;
        const hm = s.match(/\b(1?\d|2[0-3]):([0-5]\d)(?:\s*([AaPp][Mm]))?\b/);
        if (hm) {
            let hh = parseInt(hm[1], 10), mm = parseInt(hm[2], 10);
            const ampm = hm[3];
            if (ampm) {
                const up = ampm.toUpperCase();
                if (up === 'PM' && hh !== 12) hh += 12;
                if (up === 'AM' && hh === 12) hh = 0;
            }
            const d = new Date(); d.setHours(hh, mm, 0, 0);
            let ts = d.getTime();
            if (ts - Date.now() > 12 * 3600 * 1000) { d.setDate(d.getDate() - 1); ts = d.getTime(); }
            return ts;
        }
        return null;
    }

    function getMessageTimestampFromContainer(container) {
        if (!container) return null;
        const candidates = [];
        const dOrig = container.getAttribute && container.getAttribute('data-original-title');
        if (dOrig) candidates.push(dOrig);
        const title = container.getAttribute && container.getAttribute('title');
        if (title) candidates.push(title);
        if (container.innerText) candidates.push(container.innerText);

        for (const c of candidates) {
            const ts = tryParseDateString(c);
            if (ts) {
                if (DEBUG) console.debug('[tm] parsed ts:', c, new Date(ts).toString());
                return ts;
            }
        }
        return null;
    }

    function getMessageTimestamp(el) {
        if (!el) return null;
        let node = el, steps = 0;
        while (node && steps++ < 10) {
            if (node.nodeType === 1) {
                if (node.hasAttribute && node.hasAttribute('data-original-title')) {
                    const ts = tryParseDateString(node.getAttribute('data-original-title'));
                    if (ts) return ts;
                }
                if (node.tagName === 'TIME' && node.getAttribute('datetime')) {
                    const p = Date.parse(node.getAttribute('datetime'));
                    if (!Number.isNaN(p)) return p;
                }
            }
            node = node.parentElement;
        }
        const pop = el.closest && el.closest('.v-popper--has-tooltip');
        if (pop) return getMessageTimestampFromContainer(pop);
        const closestWith = el.closest && el.closest('[data-original-title]');
        if (closestWith) return tryParseDateString(closestWith.getAttribute('data-original-title'));
        return null;
    }

    // ---------- Кликабельные <p> ----------
    function makeParagraphsClickable() {
        document.querySelectorAll('div.flex.group.is-editable > p').forEach(p => {
            if (p.dataset.tmClickable) return;
            p.dataset.tmClickable = 1;
            if (p.textContent.trim() === '---') p.textContent = '-----';
            p.addEventListener('click', () => {
                const btn = p.parentElement.querySelector('button');
                if (btn) btn.click();
            });
        });
    }

    new MutationObserver(makeParagraphsClickable).observe(document.body, { childList: true, subtree: true });
    makeParagraphsClickable();

    // ---------- Настройки шрифтов ----------
    const fontSizes = [1.00, 1.20, 1.34, 1.48, 1.62];
    let fontScaleIndex = parseInt(localStorage.getItem('chatTimerFontScaleIndex'), 10);
    if (!Number.isFinite(fontScaleIndex) || fontScaleIndex < 1 || fontScaleIndex > 5) fontScaleIndex = 2;

    // ---------- UI: ползунок ----------
    const sliderContainer = document.createElement('div');
    Object.assign(sliderContainer.style, { position: 'fixed', bottom: '70px', left: '10px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '6px', userSelect: 'none' });

    const toggleBtn = document.createElement('div');
    toggleBtn.setAttribute('role', 'button');
    toggleBtn.classList.add('tm-font-toggle');
    Object.assign(toggleBtn.style, { display: 'flex', alignItems: 'center', gap: '2px', padding: '0 6.4px', height: '25.6px', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.7rem', fontWeight: '500', lineHeight: '1.25rem', transition: 'all 0.2s ease', transform: 'scale(1.1)', pointerEvents: 'auto' });
    const toggleText = document.createElement('span'); toggleText.textContent = 'Font'; toggleBtn.appendChild(toggleText);
    sliderContainer.appendChild(toggleBtn);

    const sliderBox = document.createElement('div');
    Object.assign(sliderBox.style, { display: 'none', flexDirection: 'row', alignItems: 'center', gap: '6px' });
    const sliderLabel = document.createElement('span'); sliderLabel.textContent = 'Size:'; sliderBox.appendChild(sliderLabel);

    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 1; slider.max = 5; slider.step = 1; slider.value = String(fontScaleIndex);
    slider.style.width = '96px'; slider.style.height = '4px'; slider.style.cursor = 'pointer';
    sliderBox.appendChild(slider);

    const sliderValueDisplay = document.createElement('span');
    sliderValueDisplay.textContent = String(fontScaleIndex); sliderValueDisplay.style.minWidth = '18px';
    sliderValueDisplay.style.textAlign = 'center'; sliderBox.appendChild(sliderValueDisplay);

    sliderContainer.appendChild(sliderBox);
    document.body.appendChild(sliderContainer);

    let hideTimeout;
    function resetHideTimer() {
        clearTimeout(hideTimeout);
        if (sliderBox.style.display === 'flex') {
            hideTimeout = setTimeout(() => { if (!sliderBox.matches(':hover')) sliderBox.style.display = 'none'; }, 3000);
        }
    }
    sliderBox.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    sliderBox.addEventListener('mouseleave', () => resetHideTimer());
    toggleBtn.addEventListener('click', () => { sliderBox.style.display = sliderBox.style.display === 'none' ? 'flex' : 'none'; resetHideTimer(); });

    slider.addEventListener('input', () => {
        const v = parseInt(slider.value, 10);
        if (!Number.isFinite(v)) return;
        fontScaleIndex = v;
        localStorage.setItem('chatTimerFontScaleIndex', fontScaleIndex);
        sliderValueDisplay.textContent = String(fontScaleIndex);
        styleAllTimers();
        styleActiveCounters();
        resetHideTimer();
    });

    toggleBtn.addEventListener('mousedown', () => toggleBtn.style.filter = 'brightness(0.8)');
    toggleBtn.addEventListener('mouseup', () => toggleBtn.style.filter = 'brightness(1)');
    toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.filter = 'brightness(1)');
    toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.filter = 'brightness(1.1)');

    // font for button only
    const styleEl = document.createElement('style');
    styleEl.textContent = `
.tm-font-toggle,
.tm-font-toggle * {
    font-family: Inter, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Tahoma, Arial, sans-serif !important;
    transition: all 0.2s ease !important;
}`;
    document.head.appendChild(styleEl);

    // ---------- Темная тема кнопки ----------
    function updateButtonTheme() {
        const dark = document.documentElement.getAttribute('data-theme') === 'dark' || document.body.classList.contains('dark');
        if (dark) { toggleBtn.style.backgroundColor = '#17171a'; toggleBtn.style.color = '#fff'; }
        else { toggleBtn.style.backgroundColor = '#e8e8ec'; toggleBtn.style.color = '#111'; }
    }
    new MutationObserver(updateButtonTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    new MutationObserver(updateButtonTheme).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    updateButtonTheme();

    // ---------- Таймеры ----------
    function parseMinutesFromText(t) {
        if (!t) return 0;
        const m = t.match(/(\d+)\s*m/);
        if (m) return parseInt(m[1], 10);
        const h = t.match(/(\d+)\s*h/);
        if (h) return parseInt(h[1], 10) * 60;
        return 0;
    }

    function applyStyleToRightTimer(el) {
        if (!el) return;
        const minutes = parseMinutesFromText(el.textContent || '');
        el.style.fontSize = `${fontSizes[fontScaleIndex - 1]}em`;
        el.style.fontWeight = 'bold';
        el.style.webkitTextStroke = '0.5px rgba(0,0,0,0.15)';
        el.style.color = minutes >= 10 ? '#c51521' : minutes >= 5 ? '#f77d08' : '#90949e';
    }

    function findMainSpan(container) {
        if (!container) return null;
        const spans = Array.from(container.querySelectorAll('span'));
        return spans.find(s => (s.textContent || '').includes('•')) || spans[0] || null;
    }

    function ensureRightSpan(mainSpan, container) {
        if (!mainSpan) return { rightSpan: null, leftPart: '' };
        let existing = mainSpan.querySelector('.tm-right-timer');
        if (existing) return { rightSpan: existing, leftPart: (mainSpan.textContent || '').split('•')[0].trim() };

        const text = mainSpan.textContent || '';
        if (!text.includes('•')) return { rightSpan: null, leftPart: text.trim() };

        const parts = text.split('•').map(s => s.trim());
        const leftPart = parts[0] || '';
        const rightPart = parts.slice(1).join(' • ') || '';

        mainSpan.innerHTML = '';
        mainSpan.appendChild(document.createTextNode(leftPart + ' • '));
        const rightSpan = document.createElement('span');
        rightSpan.className = 'tm-right-timer';
        rightSpan.textContent = rightPart;
        mainSpan.appendChild(rightSpan);

        let ts = getMessageTimestampFromContainer(container) || getMessageTimestamp(rightSpan);
        if (ts) rightSpan.dataset.timestamp = String(ts);

        return { rightSpan, leftPart };
    }

    // ---------- Обновлённый refreshOriginalTimer ----------
    function refreshOriginalTimer(el) {
        if (!el) return;
        const rightTimer = el.classList.contains('tm-right-timer') ? el : el.querySelector('.tm-right-timer');
        if (!rightTimer) return;

        // попытка взять timestamp из data-* (мы работаем с ms во всём скрипте)
        let ts = parseInt(rightTimer.dataset.timestamp, 10);
        if (!ts || Number.isNaN(ts)) {
            // попробовать извлечь из DOM (title, datetime и т.п.)
            ts = getMessageTimestamp(rightTimer) || getMessageTimestamp(el);
            if (!ts) {
                const text = (rightTimer.textContent || '').toLowerCase();
                // если Chatwoot показывает "less than..." / "just now" — считаем сейчас
                if (
                    text.includes('now') ||
                    text.includes('just now') ||
                    text.includes('только что') ||
                    text.includes('сейчас') ||
                    text.includes('less than') ||
                    text.includes('minute')
                ) ts = Date.now();
            }
            if (!ts) return;
            // сохраняем в ms
            rightTimer.dataset.timestamp = String(ts);
        }

        let diffMinutes = Math.floor((Date.now() - ts) / 60000);
        if (!Number.isFinite(diffMinutes) || diffMinutes < 0) diffMinutes = 0;

        const displayText =
            diffMinutes >= 60
                ? `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`
                : `${diffMinutes}m`;

        // Если Chatwoot подменил текст — принудительно восстанавливаем
        const currentText = (rightTimer.textContent || '').trim().toLowerCase();
        const badPatterns = [
            'less than', 'minute ago', 'minutes ago', 'about', 'now', 'just now',
            'few seconds', 'seconds ago', 'секунд', 'только что', 'сейчас', 'in less'
        ];

        if (badPatterns.some(p => currentText.includes(p)) || rightTimer.textContent.trim() !== displayText) {
            rightTimer.textContent = displayText;
            applyStyleToRightTimer(rightTimer);
            return;
        }

        // обычное обновление если текст устарел
        if (rightTimer.textContent !== displayText) {
            rightTimer.textContent = displayText;
            applyStyleToRightTimer(rightTimer);
        }
    }

    function styleAllTimers() {
        document.querySelectorAll('.tm-right-timer').forEach(refreshOriginalTimer);
        const containers = document.querySelectorAll('div.ml-auto, .v-popper--has-tooltip, [data-original-title]');
        containers.forEach(container => {
            const main = findMainSpan(container);
            if (!main) return;
            const { rightSpan } = ensureRightSpan(main, container);
            if (rightSpan) applyStyleToRightTimer(rightSpan);
        });
    }

    function styleActiveCounters() {
        document.querySelectorAll('div.rounded-md span,.shadow-lg.rounded-full span,div[role="button"] .rounded-full').forEach(el => {
            try { el.style.fontSize = `${fontSizes[fontScaleIndex - 1]}em`; el.style.fontWeight = 'bold'; } catch(e) {}
        });
    }

    function refreshAllTimers() {
        document.querySelectorAll('.tm-right-timer').forEach(refreshOriginalTimer);
    }

    // ---------- API Timer Updater (сопоставление по id, fallback на индекс) ----------
    class ChatwootTimerUpdater {
        constructor() {
            this.isRunning = false;
            this.intervalId = null;
            this.conversationMap = new Map(); // ключ: convId (строка) или индекс fallback
            this.currentAccountId = null;
            this.updateInterval = 5000; // 5s по умолчанию
            this.init();
        }

        init() {
            if (DEBUG) console.log('🚀 API Timer Updater запущен');
            this.extractAccountId();
            this.start();
        }

        extractAccountId() {
            const match = window.location.pathname.match(/\/accounts\/(\d+)/);
            if (match) {
                this.currentAccountId = match[1];
                if (DEBUG) console.log(`📊 Account ID: ${this.currentAccountId}`);
            }
        }

        start() {
            this.scanAndMapTimers();

            if (!this.isRunning && this.currentAccountId) {
                this.isRunning = true;
                this.intervalId = setInterval(() => {
                    this.fetchConversationsList();
                }, this.updateInterval);
                if (DEBUG) console.log(`⏰ API обновление каждые ${this.updateInterval/1000} сек`);
            }
        }

        // Сканируем DOM и пытаемся сопоставить таймеры по разговору
        scanAndMapTimers() {
            try {
                this.conversationMap.clear();
                // 1) ищем контейнеры разговоров (несколько возможных селекторов - адаптируй если нужно)
                const containers = document.querySelectorAll('[data-testid="conversation-list-item"], [data-testid="conversation-card"], .conversation-list-item, li[data-conversation-id], li.conversation-item, div.cw-conversation-list-item, [data-id^="conversation"]');
                if (containers.length === 0) {
                    // fallback: любые элементы с tm-right-timer
                    const timers = document.querySelectorAll('.tm-right-timer');
                    timers.forEach((t, idx) => this.conversationMap.set(String(idx), t));
                    if (DEBUG) console.log('[tm] scan fallback by timers count:', timers.length);
                    return;
                }

                containers.forEach((container, idx) => {
                    try {
                        // Попытки получить id: атрибуты, ссылка, span с uuid
                        let convId = null;
                        convId = container.getAttribute('data-conversation-id') || container.getAttribute('data-id') || container.getAttribute('data-id-conversation') || container.getAttribute('data-id');
                        if (!convId) {
                            const link = container.querySelector('a[href*="/conversations/"]');
                            if (link) {
                                const href = link.getAttribute('href') || '';
                                const m = href.match(/\/conversations\/([0-9a-zA-Z\-_]+)/);
                                if (m) convId = m[1];
                            }
                        }
                        if (!convId) {
                            // иногда uuid в span рядом
                            const uuidSpan = container.querySelector('.overflow-hidden.text-sm.whitespace-nowrap.text-ellipsis, .conversation-uuid, .cwc-conversation-identifier, .conversation-id');
                            if (uuidSpan && uuidSpan.textContent.trim()) convId = uuidSpan.textContent.trim();
                        }

                        // найти таймер внутри контейнера или ближайший
                        let timerEl = container.querySelector('.tm-right-timer');
                        if (!timerEl) {
                            // попробовать найти span с dot bullet
                            const main = findMainSpan(container);
                            if (main) {
                                const maybe = main.querySelector('.tm-right-timer');
                                if (maybe) timerEl = maybe;
                                else {
                                    // ensureRightSpan создаст .tm-right-timer если встречает '•'
                                    const ensured = ensureRightSpan(main, container);
                                    timerEl = ensured.rightSpan;
                                }
                            }
                        }

                        if (!timerEl) {
                            // fallback: ближайший .tm-right-timer в контейнерном родителе
                            timerEl = container.querySelector('.tm-right-timer') || container.querySelector('time, span.timeago, span[data-original-title]');
                        }

                        if (convId && timerEl) {
                            this.conversationMap.set(String(convId), timerEl);
                        } else if (timerEl) {
                            // fallback по индексу: сохраняем индекс ключом
                            this.conversationMap.set(String(idx), timerEl);
                        }
                    } catch(e) {}
                });

                if (DEBUG) console.log('[tm] scanAndMapTimers -> mapped:', Array.from(this.conversationMap.keys()).slice(0,50));
            } catch (err) {
                if (DEBUG) console.error('[tm] scanAndMapTimers error', err);
            }
        }

        fetchConversationsList() {
            if (!this.currentAccountId) return;

            // пробуем взять per_page равный количеству найденных таймеров + 5
            let per_page = Math.max(30, this.conversationMap.size + 10);
            if (per_page > 200) per_page = 200;

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://app.chatwoot.com/api/v1/accounts/${this.currentAccountId}/conversations?page=1&per_page=${per_page}`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            this.processConversationsData(data);
                        } catch (e) {
                            console.error('❌ Ошибка парсинга JSON:', e);
                        }
                    } else {
                        if (DEBUG) console.warn('[tm] API non-200 status', response.status);
                    }
                },
                onerror: (error) => {
                    if (DEBUG) console.error('❌ Ошибка запроса:', error);
                }
            });
        }

        processConversationsData(conversationsData) {
            if (!conversationsData || !conversationsData.payload) return;

            const conversations = conversationsData.payload;

            // Итерируем, сопоставляем по conv.id (или по fallback)
            conversations.forEach((conversation, index) => {
                // normalize id to string
                let convId = null;
                if (conversation.id) convId = String(conversation.id);
                else if (conversation.meta && conversation.meta.conversation_id) convId = String(conversation.meta.conversation_id);
                else if (conversation.meta && conversation.meta.uuid) convId = String(conversation.meta.uuid);
                else if (conversation.campaign_id) convId = String(conversation.campaign_id);

                let timerElement = null;
                if (convId && this.conversationMap.has(convId)) {
                    timerElement = this.conversationMap.get(convId);
                } else if (this.conversationMap.has(String(index))) {
                    // fallback: считаем что порядки совпадают
                    timerElement = this.conversationMap.get(String(index));
                } else {
                    // если мапа пустая или не хватает — попробуем взять N-ый .tm-right-timer в DOM
                    const allTimers = document.querySelectorAll('.tm-right-timer');
                    if (allTimers && allTimers[index]) timerElement = allTimers[index];
                }

                if (timerElement && (conversation.last_activity_at || conversation.updated_at || conversation.created_at)) {
                    this.updateTimerFromAPI(conversation, timerElement);
                }
            });
        }

        updateTimerFromAPI(conversationData, timerElement) {
            try {
                // last_activity_at обычно в секундах, поэтому приводим к ms
                let lastActivity = conversationData.last_activity_at || conversationData.updated_at || conversationData.created_at;
                if (!lastActivity) return;
                // если строка-датa (ISO), попытаться распарсить
                if (typeof lastActivity === 'string' && lastActivity.match(/^\d{4}-\d{2}-\d{2}T/)) {
                    const parsed = Date.parse(lastActivity);
                    if (!Number.isNaN(parsed)) lastActivity = parsed;
                }

                // теперь если число и похоже на unix seconds (меньше 1e12), умножаем
                if (typeof lastActivity === 'number' && lastActivity < 1e12) lastActivity = lastActivity * 1000;

                // защитимся: если всё ещё не число, пробуем parseDateString
                if (!Number.isFinite(lastActivity)) {
                    const parsed = tryParseDateString(String(lastActivity));
                    if (parsed) lastActivity = parsed;
                    else return;
                }

                // сохраняем timestamp в ms на элемент — источник истины
                timerElement.dataset.timestamp = String(Math.floor(lastActivity));

                const diffMinutes = Math.max(0, Math.floor((Date.now() - lastActivity) / 60000));
                const displayText = diffMinutes >= 60 ? `${Math.floor(diffMinutes/60)}h ${diffMinutes % 60}m` : `${diffMinutes}m`;

                if (timerElement.textContent !== displayText) {
                    timerElement.textContent = displayText;
                    applyStyleToRightTimer(timerElement);
                }
            } catch (error) {
                console.error('❌ Ошибка обновления таймера:', error);
            }
        }
    }

    // Запускаем API обновление
    const timerUpdater = new ChatwootTimerUpdater();

    // Твои оригинальные интервалы
    setInterval(refreshAllTimers, 15000);

    // Авто-рескан как "мягкая перезагрузка": пересканируем мапу раз в 30s и делаем reload раз в 1м
    setInterval(() => {
        if (DEBUG) console.log('[tm] periodic scanAndMapTimers');
        timerUpdater.scanAndMapTimers();
    }, 30000);

    setInterval(() => {
        if (DEBUG) console.log('[tm] periodic soft reload (scan + fetch)');
        timerUpdater.scanAndMapTimers();
        timerUpdater.fetchConversationsList();
    }, 60000); // 5 min

    // MutationObserver для общей синхронизации (debounced)
    let observerTimer;
    new MutationObserver(() => {
        clearTimeout(observerTimer);
        observerTimer = setTimeout(() => {
            styleAllTimers();
            styleActiveCounters();
            refreshAllTimers();
            makeUUIDClickable();
            makeParagraphsClickable();
            timerUpdater.scanAndMapTimers();
        }, 250); // чуть больше, чтобы уменьшить шум
    }).observe(document.body, { childList: true, subtree: true });

    // ---------- Кликабельные UUID ----------
    function makeUUIDClickable() {
        document.querySelectorAll('span.overflow-hidden.text-sm.whitespace-nowrap.text-ellipsis').forEach(span => {
            if (span.classList.contains('tm-uuid-clickable')) return;
            span.classList.add('tm-uuid-clickable');
            span.style.cursor = 'pointer';
            span.setAttribute('title', 'Click to copy UUID');
            span.addEventListener('click', () => {
                try {
                    navigator.clipboard.writeText(span.textContent.trim());
                    span.style.color = 'green';
                    setTimeout(() => span.style.color = '', 1000);
                } catch(e) {}
            });
        });
    }
    new MutationObserver(() => makeUUIDClickable()).observe(document.body, { childList: true, subtree: true });
    makeUUIDClickable();

    (function () {
    'use strict';

    const waitFor = (fn, timeout = 30000) =>
        new Promise((resolve, reject) => {
            const start = Date.now();
            const i = setInterval(() => {
                try {
                    const res = fn();
                    if (res) {
                        clearInterval(i);
                        resolve(res);
                    }
                    if (Date.now() - start > timeout) {
                        clearInterval(i);
                        reject('Timeout');
                    }
                } catch (e) {}
            }, 300);
        });

    /* ================= CHATWOOT ================= */
    if (location.host.includes('chatwoot')) {
        let adminWin = null; // для переиспользования окна

       const btn = document.createElement('button');
btn.style.position = 'fixed';
btn.style.top = '53px';
btn.style.right = '290px';
btn.style.zIndex = '9999';
btn.style.width = '70px';       // увеличиваем ширину для зоны клика
btn.style.height = '80px';      // увеличиваем высоту
btn.style.borderRadius = '50%'; // круглая кнопка
btn.style.background = 'transparent'; // полностью прозрачная
btn.style.border = 'none';
btn.style.color = 'transparent';       // скрываем текст LL, кнопка всё ещё кликабельна
btn.style.cursor = 'pointer';
btn.style.display = 'flex';
btn.style.alignItems = 'center';
btn.style.justifyContent = 'center';



        btn.onclick = () => {
            // Ищем элемент каждый раз заново при клике
            const uuidEl = document.querySelector('.tm-uuid-clickable');
            if (!uuidEl) {
                alert('UUID не найден на странице!');
                return;
            }

            const text = uuidEl.textContent.trim();
            const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
            if (!match) {
                alert('Не удалось найти UUID!');
                return;
            }
            const uuid = match[0];

            const url = `https://admin.4rabetsite.com/players/list#uuid=${uuid}`;

            // Переиспользуем открытое окно Admin или открываем новое
            if (adminWin && !adminWin.closed) {
                adminWin.location.href = url;
                adminWin.focus();
            } else {
                adminWin = window.open(url, '_blank');
            }
        };

        document.body.appendChild(btn);
    }

    /* ================= ADMIN ================= */
    if (location.host.includes('4rabetsite.com')) {

        const openPlayerCard = async (uuid) => {
            if (!uuid) return;

            try {
                /* 1️⃣ UUID input */
                const input = await waitFor(() =>
                    [...document.querySelectorAll('input')].find(i =>
                        i.closest('.v-text-field')?.querySelector('label')?.innerText === 'UUID'
                    )
                );
                input.value = uuid; // чистый UUID
                input.dispatchEvent(new Event('input', { bubbles: true }));

                /* 2️⃣ Поиск */
                const searchBtn = await waitFor(() =>
                    [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Поиск')
                );
                searchBtn.click();

                /* 6️⃣ Вызываем Vue-click напрямую */
                viewItem.__vue__.$emit('click');
                console.log(`[TM] Карточка игрока открыта: ${uuid}`);
            } catch (e) {
                console.warn('[TM ERROR]', e);
            }
        };

        // Срабатываем при первой загрузке
        openPlayerCard(new URLSearchParams(location.hash.slice(1)).get('uuid'));

        // И слушаем изменения hash (смена UUID без перезагрузки)
        window.addEventListener('hashchange', () => {
            const newUuid = new URLSearchParams(location.hash.slice(1)).get('uuid');
            openPlayerCard(newUuid);
        });
    }
})();
    (function() {
    'use strict';

    const STORAGE_KEY = 'chatwoot_resolve_count';
    const STORAGE_DATE_KEY = 'chatwoot_resolve_date';
    let statVisible = false;

    // Получаем текущую дату по МСК в формате YYYY-MM-DD
    function getMoscowDate() {
        const date = new Date();
        const moscowOffset = 3 * 60; // +3 часа от UTC
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const moscowTime = new Date(utc + moscowOffset * 60000);
        return moscowTime.toISOString().split('T')[0];
    }

    // Инициализация счётчика
    function initCounter() {
        const today = getMoscowDate();
        const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
        if (savedDate !== today) {
            localStorage.setItem(STORAGE_KEY, '0');
            localStorage.setItem(STORAGE_DATE_KEY, today);
        }
    }

    // Получить текущее значение
    function getCount() {
        return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    }

    // Увеличить счётчик
    function incrementCount() {
        const count = getCount() + 1;
        localStorage.setItem(STORAGE_KEY, count.toString());
        updateCounterUI();
        console.log(`✅ Чат закрыт! Всего за сегодня: ${count}`);
    }

    // Создание StatTrack вкладки
   let statLi;
let statDiv;

function createStatTab() {
    const tabsUl = document.querySelector('div[is-compact] ul');
    if (!tabsUl || statLi) return;

    statLi = document.createElement('li');
    statLi.className =
        'flex-shrink-0 my-0 mx-2 ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0 text-sm';

    const statLink = document.createElement('a');
    statLink.className =
        'flex items-center flex-row border-b select-none cursor-pointer text-sm relative top-[1px] transition-[border-color] duration-[150ms] ease-[cubic-bezier(0.37,0,0.63,1)] border-transparent text-n-slate-11 py-2';

    // Текст
    const textNode = document.createElement('span');
    textNode.textContent = 'Resolved';
    textNode.style.userSelect = 'none';

    // Цифра (спойлер)
    statDiv = document.createElement('div');
    statDiv.className =
        'rounded-md h-5 flex items-center justify-center text-xxs font-semibold my-0 mx-1 px-1 py-0 min-w-[20px] bg-n-alpha-black2 dark:bg-n-solid-3 text-n-slate-11';
    statDiv.style.display = 'none'; // 👈 скрыто по умолчанию
    statDiv.innerHTML = `<span style="font-size: 1.62em; font-weight: bold;">${getCount()}</span>`;

    // Клик по StatTrack → показать / скрыть
    statLink.addEventListener('click', () => {
        statVisible = !statVisible;
        statDiv.style.display = statVisible ? 'flex' : 'none';
    });

    statLink.appendChild(textNode);
    statLink.appendChild(statDiv);
    statLi.appendChild(statLink);
    tabsUl.appendChild(statLi);
}

    // Обновление числа StatTrack
function updateCounterUI() {
    if (!statDiv) return;
    const span = statDiv.querySelector('span');
    if (span) {
        span.textContent = getCount();
    }
}

    // Сброс счётчика при смене даты
    function resetIfNewDay() {
        const today = getMoscowDate();
        const savedDate = localStorage.getItem(STORAGE_DATE_KEY);
        if (savedDate !== today) {
            localStorage.setItem(STORAGE_KEY, '0');
            localStorage.setItem(STORAGE_DATE_KEY, today);
            updateCounterUI();
        }
    }

    // Функция отслеживания кнопок Resolve
    function attachResolveListeners() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === 'Resolve' && !btn.dataset.listener) {
                btn.dataset.listener = 'true';
                btn.addEventListener('click', incrementCount);
            }
        });
    }

    // MutationObserver для динамически подгружаемых чатов и вкладок
    const observer = new MutationObserver(() => {
        attachResolveListeners();
        resetIfNewDay();
        createStatTab();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Инициализация
    initCounter();
    attachResolveListeners();
    createStatTab();
    updateCounterUI();

})();

    (function() {
    'use strict';

    // 🔹 Здесь можно редактировать текст кнопки и содержимое
    const buttonsConfig = [
        { label: "Hi", text: "Hello! I am Virat, your support agent at 4rabet. I am here to help you with any questions or issues you may have." },
        { label: "Hw", text: "How can I help you?" },
        { label: "Ch", text: "Checking the information." },
        { label: "Sc", text: "Please provide us screenshot of this transaction from your payment application." },
        { label: "By", text: "Please feel free to contact us if you have new questions! Have a good day! Good luck!" },
        { label: "Un", text: "Unfortunately, we haven't received any response from you. Please feel free to contact us if you have any questions. Have a good day!" }
    ];

    function log(msg) {
        console.log("[QuickButtons]: " + msg);
    }

    function waitForElement(selector, timeout = 2000) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) return resolve(el);

            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    resolve(el);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                observer.disconnect();
                reject(`Element ${selector} not found in ${timeout}ms`);
            }, timeout);
        });
    }

    async function insertText(inputEl, text) {
        if (inputEl.tagName === "TEXTAREA") {
            inputEl.focus();
            inputEl.value = text;
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            // ProseMirror
            inputEl.focus();
            document.execCommand('insertHTML', false, `<p>${text.replace(/\n/g, "<br>")}</p>`);
            inputEl.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    async function createButtons() {
        const rightWrap = document.querySelector('.reply-box .right-wrap');
        if (!rightWrap) return false;

        // Проверяем, есть ли уже контейнер
        if (document.querySelector("#quick-buttons-container")) return true;

        const container = document.createElement("div");
        container.id = "quick-buttons-container";
        container.style.display = "flex";
        container.style.gap = "15px";
        container.style.marginRight = "10px";

        buttonsConfig.forEach((cfg, idx) => {
            const btn = document.createElement("button");
            btn.id = "quick-btn-" + (idx + 1);
            btn.innerText = cfg.label;
            btn.style.background = "#2d2f31";
            btn.style.color = "#fff";
            btn.style.border = "1px solid #555";
            btn.style.borderRadius = "6px";
            btn.style.padding = "4px 8px";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "13px";

            btn.addEventListener("click", async () => {
                if (btn.disabled) return;
                btn.disabled = true;
                setTimeout(() => { btn.disabled = false; }, 1500);

                try {
                    // Ищем ProseMirror или textarea
                    const inputEl = document.querySelector('.reply-box .ProseMirror') ||
                                    document.querySelector('.reply-box textarea');
                    const sendBtn = await waitForElement('.reply-box .right-wrap button[type="submit"]');

                    if (!inputEl || !sendBtn) return;

                    await insertText(inputEl, cfg.text);

                    setTimeout(() => {
                        if (!sendBtn.disabled) sendBtn.click();
                    }, 100);

                } catch (e) {
                    console.error("[QuickButtons]: Error inserting text", e);
                }
            });

            container.appendChild(btn);
        });

        rightWrap.parentNode.insertBefore(container, rightWrap);
        return true;
    }

    // Периодически пробуем создать кнопки
    const interval = setInterval(() => {
        if (createButtons()) clearInterval(interval);
    }, 1000);

    // Следим за DOM, чтобы кнопки появлялись заново
    const observer = new MutationObserver(() => {
        createButtons();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
(function() {
    'use strict';

    const PROXY_URL = "http://194.124.211.190:3005/search";
    const AUTOHIDE_DELAY = 5000;
    let hideTimeout = null;
    let debounceTimeout = null;

    const FONT_STACK = 'Inter, -apple-system, system-ui, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Tahoma, Arial, sans-serif !important';

    // Результаты поиска
    const result = document.createElement('div');
    Object.assign(result.style, {
        position: 'fixed',
        bottom: '325px',
        left: '232px',
        width: '360px',
        maxHeight: '180px',
        overflowY: 'auto',
        backgroundColor: '#17171a',
        color: '#fff',
        border: '1px solid #121213',
        borderRadius: '5px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.5)',
        zIndex: '9999',
        fontFamily: FONT_STACK,
        fontSize: '13px',
        lineHeight: '1.4',
        padding: '6px',
        opacity: '0',
        display: 'none',
        transition: 'opacity 0.3s',
        pointerEvents: 'auto'
    });
    document.body.appendChild(result);

    // Панель ввода
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '255px',
        left: '232px',
        width: '360px',
        padding: '6px',
        backgroundColor: '#17171a',
        color: '#fff',
        border: '1px solid #121213',
        borderRadius: '5px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.5)',
        zIndex: '9999',
        fontFamily: FONT_STACK,
        fontSize: '14px',
        lineHeight: '20px',
        opacity: '1',
        transition: 'opacity 0.3s',
        pointerEvents: 'auto'
    });
    panel.innerHTML = `
        <input id="jira_input" type="text" autocomplete="off" autocorrect="off" placeholder="" style="
            width:100%;
            padding:8px;
            background-color:#121213;
            border:1px solid #17171a;
            border-radius:4px;
            color:#fff;
            font-family: ${FONT_STACK};
            font-size:18px;
            line-height:24px;
            text-align:center;
        ">
    `;
    document.body.appendChild(panel);
    const input = document.getElementById('jira_input');

    // Скрытие панели
    function hidePanel() {
        panel.style.opacity = '0.3';
        result.style.opacity = '0';
        input.value = '';
        result.innerHTML = '';
        setTimeout(() => result.style.display = 'none', 300);
    }

    function showResults(html) {
        result.innerHTML = html;
        result.style.display = 'block';
        setTimeout(() => result.style.opacity = '1', 10);
        panel.style.opacity = '1';
        scheduleHide();
    }

    function scheduleHide() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            if (!panel.matches(':hover') && !result.matches(':hover')) hidePanel();
        }, AUTOHIDE_DELAY);
    }

    function timeAgo(date) {
        if (!date) return '';
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return `${diffDays > 0 ? diffDays + 'д ' : ''}${diffHours}ч`;
    }

    function parseJiraDate(jiraDate) {
        if (!jiraDate) return null;
        if (typeof jiraDate === 'string') return new Date(jiraDate.replace(/(\+\d{2})(\d{2})$/, '$1:$2'));
        if (jiraDate instanceof Date) return jiraDate;
        return new Date(jiraDate.toString());
    }

    function extract12Digits(text) {
        if (!text) return '';
        const match = text.match(/\d{12}/);
        return match ? match[0] : '';
    }

    function getLastCommentDate(issue) {
        if (!issue.fields.comment || issue.fields.comment.comments.length === 0) return null;
        const sortedComments = issue.fields.comment.comments.sort((a, b) => new Date(b.created) - new Date(a.created));
        return parseJiraDate(sortedComments[0].created);
    }

    // Главная функция рендеринга тикетов
function renderIssues(issues, showComments = true) {
    if (!issues || issues.length === 0) {
        showResults(`<span style="color:red;">ничего не найдено</span>`);
        return;
    }

    // UI: сортировка от нового к старому (по номеру тикета)
    issues = [...issues].sort((a, b) => {
        const aNum = parseInt(a.key.split('-')[1], 10);
        const bNum = parseInt(b.key.split('-')[1], 10);
        return bNum - aNum;
    });

    result.innerHTML = '';
    result.style.display = 'block';
    setTimeout(() => result.style.opacity = '1', 10);

        // WIP фильтр и кнопка
        const wipIssues = issues.filter(issue => {
            let status = '';
            const s = issue.fields.status;
            const r = issue.fields.resolution;
            if (r && r.name) status = r.name;
            else if (s && typeof s === 'object' && s.name) status = s.name;
            else if (s && typeof s === 'string') status = s;
            else status = 'Work in progress';
            return status === 'Work in progress' || status === 'В работе';
        });

        if (wipIssues.length > 0) {
            const copyWipBtn = document.createElement('button');
            copyWipBtn.textContent = '📋 WIP';
            Object.assign(copyWipBtn.style, {
                display: 'block',
                marginBottom: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                background: '#2b2b2f',
                color: '#b8b8b8',
                border: '1px solid #17171a',
                borderRadius: '4px'
            });
copyWipBtn.addEventListener('click', () => {
    const sortedWip = [...wipIssues].sort((a, b) => {
        const aNum = parseInt(a.key.split('-')[1], 10);
        const bNum = parseInt(b.key.split('-')[1], 10);
        return aNum - bNum; // от старого к новому
    });

    // Формируем список тикетов
    const ticketText = sortedWip.map((issue, index) => {
        const utr = extract12Digits(issue.fields.description || issue.fields.summary || '');
        return `${index + 1}. ${issue.key} ${utr}`;
    }).join('\n');

    // Собираем полный текст с пустыми строками сверху и снизу списка
    const fullText =
`I’ve checked your cases – the funds for the following deposits haven’t reached us yet, as the payment provider is still processing the transactions:

${ticketText}

Even if your screenshots show 'successful,' each deposit must still pass verification. We’ve already submitted requests, and once the payment system confirms that the transactions have been received by our bank, the process of crediting the funds to your account will be initiated. Thank you for your patience!`;

    navigator.clipboard.writeText(fullText);
});



            result.appendChild(copyWipBtn);
        }

        // Список тикетов
        const ul = document.createElement('ul');
        ul.style.paddingLeft = '0';
        ul.style.margin = '2px 0';
        ul.style.fontFamily = FONT_STACK;

        issues.forEach(issue => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.flexDirection = 'column';
            li.style.marginBottom = '6px';

            const url = `https://jira.deversin.com/browse/${issue.key}`;
            const createdDate = parseJiraDate(issue.fields.created);
            const lastCommentDate = getLastCommentDate(issue);
            let timeText = '';
            if (createdDate && lastCommentDate) {
                const createdStr = timeAgo(createdDate);
                const lastStr = timeAgo(lastCommentDate);
                timeText = (createdStr !== lastStr) ? `${createdStr} | ${lastStr}` : createdStr;
            } else if (createdDate) {
                timeText = timeAgo(createdDate);
            }

            const copyText = `${issue.key} ${extract12Digits(issue.fields.description || issue.fields.summary || '')}`;

            const threadContainer = document.createElement('div');
            threadContainer.style.display = 'flex';
            threadContainer.style.alignItems = 'flex-start';

            const copyButton = document.createElement('button');
            copyButton.style.marginLeft = '5px'; // сдвигает кнопку влево относительно контейнера
            copyButton.textContent = '📋';
            copyButton.style.marginRight = '0px';
            copyButton.style.fontSize = '12px';
            copyButton.style.padding = '3px 6px';
            copyButton.style.cursor = 'pointer';
            copyButton.addEventListener('click', () => navigator.clipboard.writeText(copyText));

            const div = document.createElement('div');
            div.style.fontFamily = FONT_STACK;

            let displayStatus = '';
            const s = issue.fields.status;
            const r = issue.fields.resolution;
            if (r && r.name) displayStatus = r.name;
            else if (s && typeof s === 'object' && s.name) displayStatus = s.name;
            else if (s && typeof s === 'string') displayStatus = s;
            else displayStatus = 'Work in progress';

            let statusColor = '#f0a500';
            const greenStatuses = ['Success', 'Credited under', 'Готово', 'Done'];
            const redStatuses = ['Failed', 'Declined'];
            if (displayStatus === 'Work in progress') statusColor = '#b8b8b8';
            else if (displayStatus === 'Not our wallet') statusColor = '#0d4c9d';
            else if (greenStatuses.includes(displayStatus)) statusColor = '#67b528';
            else if (redStatuses.includes(displayStatus)) statusColor = '#a31c20';

            div.innerHTML = `<a href="${url}" target="_blank" style="color:#9cdcfe; text-decoration:none;">${issue.key}</a>` +
                            (displayStatus ? ` — <span style="color:${statusColor};">${displayStatus}</span>` : '') +
                            (timeText ? ` <span style="color:#7c7c7c;">${timeText}</span>` : '');

            threadContainer.appendChild(copyButton);
            threadContainer.appendChild(div);
            li.appendChild(threadContainer);

            if (showComments && issue.fields.comment && issue.fields.comment.comments.length > 0) {
                const commentsUl = document.createElement('ul');
                commentsUl.style.paddingLeft = '16px';
                commentsUl.style.margin = '4px 0 0 0';
                commentsUl.style.color = '#cfcfcf';
                commentsUl.style.fontSize = '12px';
                commentsUl.style.fontFamily = FONT_STACK;

                const sortedComments = issue.fields.comment.comments.sort((a, b) => new Date(b.created) - new Date(a.created));
                sortedComments.forEach(c => {
                    const cLi = document.createElement('li');
                    const commentTime = timeAgo(parseJiraDate(c.created));
                    let commentBody = c.body || '';
                    commentBody = commentBody.replace(/\S+\.pdf/gi, '📕');
                    commentBody = commentBody.replace(/\S+\.(png|jpg|jpeg|gif|bmp|webp)/gi, '📘');
                    commentBody = commentBody.replace(/\|thumbnail!/gi, '');
                    cLi.innerHTML = `<strong>${c.author.displayName}:</strong> ${commentBody} <span style="color:#999;">(${commentTime})</span>`;
                    commentsUl.appendChild(cLi);
                });
                li.appendChild(commentsUl);
            }

            ul.appendChild(li);
        });

        result.appendChild(ul);
        panel.style.opacity = '1';
    }

    // Поиск Jira
    function searchJira(q) {
        if (!q) {
            showResults('');
            return;
        }

        showResults("Searching…");

        const tokens = q.split(/\s+/);
        let jiraKey = '';
        let utr12 = '';
        let uuid = '';

        tokens.forEach(t => {
            if (/^[A-Z]+-\d+$/i.test(t)) jiraKey = t;
            else if (/^\d{12}$/.test(t)) utr12 = t;
            else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)) uuid = t;
        });

        const showComments = !uuid;

        const results = [];
        let completedRequests = 0;

        function handleResponse(r) {
            completedRequests++;
            if (r.status === 200) {
                try {
                    const data = JSON.parse(r.responseText);
                    if (data.issues && data.issues.length > 0) results.push(...data.issues);
                } catch(e) { console.error(e); }
            }
            if (completedRequests === requests.length) {
                const uniqueIssues = [];
                const keys = new Set();
                results.forEach(issue => {
                    if (!keys.has(issue.key)) {
                        keys.add(issue.key);
                        uniqueIssues.push(issue);
                    }
                });
                renderIssues(uniqueIssues, showComments);
            }
        }

        const requests = [];
        if (jiraKey) requests.push(`${PROXY_URL}?q=${encodeURIComponent(jiraKey)}`);
        if (utr12) requests.push(`${PROXY_URL}?q=${encodeURIComponent(utr12)}`);
        if (uuid) requests.push(`${PROXY_URL}?q=${encodeURIComponent(uuid)}`);

        if (requests.length === 0) {
            showResults(`<span style="color:red;">Неверный формат запроса</span>`);
            return;
        }

        requests.forEach(url => {
            GM_xmlhttpRequest({ method: "GET", url: url, onload: handleResponse });
        });
    }

    input.addEventListener('input', () => {
        const q = input.value.trim();
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => searchJira(q), 300);
    });

    [panel, result].forEach(el => {
        el.addEventListener('mouseenter', () => {
            panel.style.opacity = '1';
            result.style.opacity = '1';
            if (hideTimeout) clearTimeout(hideTimeout);
        });
        el.addEventListener('mouseleave', () => scheduleHide());
    });

})();
(function() {
    'use strict';

    const SERVER_URL = "http://194.124.211.190:3005";
    const USERNAME = "pavel";
    const FONT_STACK = 'Arial, sans-serif';
    const AUTOHIDE_DELAY = 5000;
    let hideTimeout;

    const style = document.createElement('style');
    style.textContent = `
        #jira_panel input::placeholder {
            color: rgba(255, 255, 255, 0.1);
            text-align: center;
        }
        #jira_panel input {
            outline: none;
            border: 1px solid #17171a;
            transition: border 0.2s;
            text-align: center;
        }
        #jira_panel input:focus {
            border: 1px solid #1d2e62;
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'jira_panel';
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '20px',
        left: '232px',
        width: '360px',
        padding: '10px',
        backgroundColor: '#17171a',
        color: '#fff',
        borderRadius: '5px',
        boxShadow: '0 1px 5px rgba(0,0,0,0.5)',
        zIndex: '9999',
        fontFamily: FONT_STACK,
        fontSize: '14px',
        lineHeight: '20px',
        opacity: '1',
        transition: 'opacity 0.3s',
        pointerEvents: 'auto'
    });

    panel.innerHTML = `
        <input id="uuid" placeholder="UUID" style="width:100%; margin-bottom:5px; padding:6px; background:#121213; color:#fff; border-radius:4px;">
        <input id="screenshot" placeholder="URL" style="width:100%; margin-bottom:5px; padding:6px; background:#121213; color:#fff; border-radius:4px;">
        <input id="utr" placeholder="UTR" style="width:100%; margin-bottom:5px; padding:6px; background:#121213; color:#fff; border-radius:4px;">
        <input id="amount" placeholder="$$$" style="width:100%; margin-bottom:10px; padding:6px; background:#121213; color:#fff; border-radius:4px;">
        <div style="text-align:center;">
            <button id="submitBtn" style="padding:5px 10px; color:#858585;">SEND</button>
        </div>
        <div id="previewBox" style="margin-top:10px; max-height:150px; overflow-y:auto; transition: opacity 0.3s;"></div>
    `;
    document.body.appendChild(panel);

// === Отключение автозаполнения и автокоррекции (усиленно) ===
const inputsEls = panel.querySelectorAll('input');
inputsEls.forEach(input => {
    input.setAttribute('autocomplete', 'off');      // полное отключение автозаполнения
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('inputmode', 'none');        // подсказка для мобильных клавиатур
    input.setAttribute('data-form-type', 'other');  // Safari/iOS трюк

    // Рандомное имя поля, чтобы браузер не мог сохранить данные
    input.setAttribute('name', 'fld_' + Math.random().toString(36).slice(2, 10));
});


    const previewBox = document.getElementById('previewBox');
    const inputs = ['uuid','screenshot','utr','amount'].map(id => document.getElementById(id));

    const notification = document.createElement('div');
    notification.id = 'jira_notification';
    Object.assign(notification.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(23,23,26,0.75)',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: '6px',
        fontSize: '16px',
        opacity: '0',
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
        zIndex: '2147483647',
        textAlign: 'center',
        maxWidth: '80%',
        wordWrap: 'break-word'
    });
    document.body.appendChild(notification);

    window.showNotification = function(message, duration = 3000) {
        const notif = document.getElementById('jira_notification');
        notif.textContent = message;
        notif.style.opacity = '1';
        setTimeout(() => { notif.style.opacity = '0'; }, duration);
    };

    function hidePanel() {
        const hasData = inputs.some(input => input.value.trim() !== "");
        if (hasData) {
            panel.style.opacity = '1';
            previewBox.style.opacity = '1';
            return;
        }
        panel.style.opacity = '0.3';
        previewBox.style.opacity = '0';
    }

    function showPanel() {
        panel.style.opacity = '1';
        previewBox.style.opacity = '1';
    }

    function scheduleHide() {
        if (hideTimeout) clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => hidePanel(), AUTOHIDE_DELAY);
    }

    function checkDuplicateUTR(utr) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `${SERVER_URL}/search?q=${encodeURIComponent(utr)}`,
                onload: res => {
                    try { resolve(JSON.parse(res.responseText).total > 0); }
                    catch(e){ reject(e); }
                },
                onerror: reject
            });
        });
    }

function submitTicket(uuid, screenshot, utr, amount) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: `${SERVER_URL}/create`,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        username: USERNAME,
        summary: uuid,
        description: `${utr}\n${amount}`,
        brand: "4rabet",
        screenshot
      }),
      onload: res => {
        try { resolve(JSON.parse(res.responseText)); }
        catch(e){ reject(e); }
      },
      onerror: reject
    });
  });
}

// === Проверка формата полей ===
const validateFields = (uuid, screenshot, utr, amount) => {
    const uuidRegex = /^[a-zA-Z0-9\-]+$/;          // только буквы, цифры и дефис
    const urlRegex = /^(https?:\/\/[^\s]+)$/;      // проверка URL
    const utrRegex = /^\d{12}$/;                   // строго 12 цифр
    const amountRegex = /^\d+(\.\d{1,2})?$/;       // числа, допускаем 2 знака после точки

    if (!uuidRegex.test(uuid)) return "UUID должен содержать только буквы и цифры";
    if (!urlRegex.test(screenshot)) return "Введите корректный URL";
    if (!utrRegex.test(utr)) return "UTR должен содержать ровно 12 цифр";
    if (!amountRegex.test(amount)) return "Сумма должна быть числом";

    return null; // ошибок нет
};

// === Submit ===
const handleSubmit = async () => {
    const [uuid, screenshot, utr, amount] = inputs.map(i => i.value.trim());

    // Проверка на пустые поля
    if (!uuid || !screenshot || !utr || !amount) {
        showNotification("Пожалуйста, заполните все поля!");
        return;
    }

    // Проверка формата
    const error = validateFields(uuid, screenshot, utr, amount);
    if (error) {
        showNotification(error);
        return;
    }

    try {
        if (await checkDuplicateUTR(utr)) {
            showNotification("Ticket с этим UTR уже существует!");
            inputs.forEach(input => input.value = '');
            previewBox.innerHTML = '';
            hidePanel();
            return;
        }

        const result = await submitTicket(uuid,screenshot,utr,amount);

        const textToCopy = `${result.issueKey} ${utr}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => showNotification("SUP создан!"))
            .catch(() => showNotification("SUP создан!"));

        inputs.forEach(input => input.value = '');
        previewBox.innerHTML = '';
        hidePanel();

    } catch (e) {
        showNotification("Ошибка при создании тикета!");
        console.error(e);
    }
};

    document.getElementById("submitBtn").addEventListener("click", handleSubmit);

    // === Submit по Enter в любом поле ===
    inputs.forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
            }
        });
    });

    // Hover логика
    [panel, previewBox].forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (hideTimeout) clearTimeout(hideTimeout);
            showPanel();
        });
        el.addEventListener('mouseleave', () => scheduleHide());
    });

})();

    // Первоначальная инициализация
    styleAllTimers();
    styleActiveCounters();
    refreshAllTimers();
    makeParagraphsClickable();

    if (DEBUG) console.info('[tm] Chat Fixes v22.12 + API loaded');
})();
