// ==UserScript==
// @name         Chat Fixes Updated + API (Stable v22.13, full features)
// @namespace    http://tampermonkey.net/
// @version      22.13
// @description  :) Полная версия: таймеры, API sync, кликабельные UUID, шрифты и т.д.
// @match        *://app.chatwoot.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      app.chatwoot.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548533/Chat%20Fixes%20Updated%20%2B%20API%20%28Stable%20v2213%2C%20full%20features%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548533/Chat%20Fixes%20Updated%20%2B%20API%20%28Stable%20v2213%2C%20full%20features%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Функция для скрытия всех, кроме трёх последних чатов
    function showOnlyLastThree() {
        const chats = document.querySelectorAll('.contact-conversation--list .conversation');
        if (!chats.length) return;

        chats.forEach((chat, index) => {
            // Показываем только первые 3 (если сортировка сверху вниз по убыванию времени)
            if (index > 2) {
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

    // Первоначальная инициализация
    styleAllTimers();
    styleActiveCounters();
    refreshAllTimers();
    makeParagraphsClickable();

    if (DEBUG) console.info('[tm] Chat Fixes v22.12 + API loaded');
})();
