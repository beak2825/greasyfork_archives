// ==UserScript==
// @name         MIPT CRM — Notifier Fetch 7.0 (optimized) - FIXED
// @namespace    http://tampermonkey.net/
// @version      7.0.3
// @author       wryyshee
// @description  Оптимизированный мониторинг через Fetch API. Лёгкий, без зависаний.
// @match        https://edu.mipt.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      edu.mipt.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557452/MIPT%20CRM%20%E2%80%94%20Notifier%20Fetch%2070%20%28optimized%29%20-%20FIXED.user.js
// @updateURL https://update.greasyfork.org/scripts/557452/MIPT%20CRM%20%E2%80%94%20Notifier%20Fetch%2070%20%28optimized%29%20-%20FIXED.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // ====== Настройки ======
    const GLOBAL_LOGIN_POLL_MS = 5000;
    const CHECK_INTERVAL_DEFAULT = 60 * 1000;
    const SUSPEND_BASE_MS = 5 * 60 * 1000;
    const MAX_SUSPEND_MS = 24 * 60 * 60 * 1000;
    const MAX_CONCURRENT_REQUESTS = 2;
    const CACHE_TTL = 30000;
    const allowedStatuses = ["Не проверен","Завершен","Не завершен","Автоматически проверен"];
    const STORAGE_PREFIX = "mipt_notifier_v7_";

    // ====== Состояние ======
    let TRACKED_PAGES = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "tracked_pages") || "[]");
    if(!Array.isArray(TRACKED_PAGES) || TRACKED_PAGES.length === 0){
        TRACKED_PAGES = ["https://edu.mipt.ru/adm/testing/185/558/1482/result/"];
        localStorage.setItem(STORAGE_PREFIX + "tracked_pages", JSON.stringify(TRACKED_PAGES));
    }

    let lastKnownIds = new Set(JSON.parse(localStorage.getItem(STORAGE_PREFIX + "lastKnownIds") || "[]"));
    let dismissedIds = new Set(JSON.parse(localStorage.getItem(STORAGE_PREFIX + "dismissedIds") || "[]"));
    let soundMuted = JSON.parse(localStorage.getItem(STORAGE_PREFIX + "soundMuted") || "false");

    function persist(){
        localStorage.setItem(STORAGE_PREFIX + "tracked_pages", JSON.stringify(TRACKED_PAGES));
        localStorage.setItem(STORAGE_PREFIX + "lastKnownIds", JSON.stringify([...lastKnownIds]));
        localStorage.setItem(STORAGE_PREFIX + "dismissedIds", JSON.stringify([...dismissedIds]));
        localStorage.setItem(STORAGE_PREFIX + "soundMuted", JSON.stringify(soundMuted));
    }

    // ====== Audio ======
    const sound = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1150-pristine.mp3");
    sound.volume = 0.28;

    // ====== UI элементы ======
    const bellParent = document.querySelector(".navbar-top-links .fa-bell")?.parentElement;
    let bellEl = bellParent?.querySelector('.fa-bell');
    let uiRoot = bellParent || document.body || document.documentElement;

    // inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
@keyframes bellshake{0%{transform:rotate(0)}20%{transform:rotate(-20deg)}40%{transform:rotate(20deg)}60%{transform:rotate(-15deg)}80%{transform:rotate(15deg)}100%{transform:rotate(0)}}
.bell-alert{color:red!important;animation:bellshake 1s ease}
.notif-popup{position:absolute;top:35px;right:0;width:360px;max-height:420px;overflow:auto;background:#fff;border:1px solid #ccc;border-radius:6px;padding:8px;z-index:2147483647;box-shadow:0 6px 18px rgba(0,0,0,0.12)}
.notif-item{padding:8px 6px;border-bottom:1px solid #eee;font-size:13px}
.notif-title{font-weight:700;margin-bottom:4px}
.notif-meta{font-size:12px;color:#666;margin-bottom:6px}
.unverified-counter{position:absolute;top:-6px;right:-6px;background:#d9534f;color:white;font-size:11px;padding:2px 6px;border-radius:12px;font-weight:700}
.notif-btn{padding:6px 8px;margin:3px;border:0;border-radius:4px;cursor:pointer;font-size:13px}
.add-btn{background:#4CAF50;color:white}
.del-btn{background:#f44336;color:white}
.settings-btn{background:#e7f3ff;color:#222;border:none;padding:6px;border-radius:4px;width:100%;font-size:13px;margin-top:6px}
.suspended-note{font-size:12px;color:#a00;margin-top:6px}
.memory-warning{font-size:11px;color:#d9534f;margin-top:4px}
`;
    document.head.appendChild(style);

    // create UI if missing
    if(!bellEl){
        const placeholder = document.createElement('div');
        placeholder.style.cssText = 'position:fixed;top:8px;right:8px;z-index:2147483646';
        const btn = document.createElement('button');
        btn.className = 'notif-btn settings-btn';
        btn.textContent = 'Notifier';
        placeholder.appendChild(btn);
        document.body.appendChild(placeholder);
        bellEl = btn;
        uiRoot = placeholder;
    }

    let counterEl = (bellParent && bellParent.querySelector('.unverified-counter')) || uiRoot.querySelector('.unverified-counter');
    if(!counterEl){
        counterEl = document.createElement('span');
        counterEl.className = 'unverified-counter';
        counterEl.style.display = 'none';
        (bellParent || uiRoot).style.position = (bellParent||uiRoot).style.position || 'relative';
        (bellParent || uiRoot).appendChild(counterEl);
    }

    let popup = (bellParent && bellParent.querySelector('.notif-popup')) || uiRoot.querySelector('.notif-popup');
    if(!popup){
        popup = document.createElement('div');
        popup.className = 'notif-popup';
        popup.style.display = 'none';
        (bellParent || uiRoot).appendChild(popup);
    }

    // modal settings
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:none;align-items:center;justify-content:center;z-index:2147483647';
    const modalContent = document.createElement('div');
    modalContent.style.cssText = 'width:520px;background:white;border-radius:8px;padding:16px;max-height:80%;overflow:auto';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    function renderSettings(){
        modalContent.innerHTML = '';
        modalContent.appendChild(createEl('h3', {}, 'Настройки отслеживания'));

        // Memory usage info
        const memoryInfo = createEl('div', {style:'font-size:12px;color:#666;margin-bottom:12px'},
                                    `Отслеживается страниц: ${TRACKED_PAGES.length}`);
        modalContent.appendChild(memoryInfo);

        const list = createEl('div');
        TRACKED_PAGES.forEach((u,i)=> {
            const row = createEl('div', {style:'display:flex;align-items:center;justify-content:space-between;margin:8px 0'});
            row.appendChild(createEl('div', {style:'flex:1;word-break:break-all;font-size:12px'}, u));
            const del = createEl('button', {class:'notif-btn del-btn'}, 'Удалить');
            del.addEventListener('click', ()=>{
                TRACKED_PAGES.splice(i,1);
                persist();
                renderSettings();
                initFetchTrackers();
            });
            row.appendChild(del);
            list.appendChild(row);
        });
        modalContent.appendChild(list);

        const addRow = createEl('div', {style:'margin-top:10px;display:flex;gap:8px;'});
        const inp = createEl('input', {type:'text', style:'flex:1;padding:6px;border:1px solid #ccc;border-radius:4px', placeholder:'URL страницы с результатами'});
        const addBtn = createEl('button', {class:'notif-btn add-btn'}, 'Добавить');
        addBtn.addEventListener('click', ()=>{
            const v = inp.value.trim();
            if(v){
                TRACKED_PAGES.push(v);
                persist();
                renderSettings();
                initFetchTrackers();
                inp.value='';
            }
        });
        addRow.appendChild(inp);
        addRow.appendChild(addBtn);
        modalContent.appendChild(addRow);

        // Performance tips
        const tips = createEl('div', {style:'margin-top:16px;padding:8px;background:#f8f9fa;border-radius:4px;font-size:11px'});
        tips.innerHTML = '<strong>Советы по производительности:</strong><br>• Оптимально 2-3 страницы<br>• Удаляйте ненужные URL<br>• Интервал проверки: 60 сек';
        modalContent.appendChild(tips);
    }
    modal.addEventListener('click', ev=>{ if(ev.target===modal) modal.style.display='none'; });

    // Функция для обновления иконки звука
    function updateMuteButton() {
        if (muteBtn) {
            muteBtn.textContent = soundMuted ? '🔇' : '🔈';
        }
    }

    // settings button in popup
    const settingsBtn = createEl('button', {class:'settings-btn'}, 'Настройки отслеживания');
    settingsBtn.addEventListener('click', ()=>{ renderSettings(); modal.style.display='flex'; });

    // mute button
    const muteBtn = createEl('button', {class:'notif-btn'}, '');
    updateMuteButton(); // Устанавливаем правильную иконку при создании
    muteBtn.addEventListener('click', ()=>{
        soundMuted = !soundMuted;
        updateMuteButton(); // Обновляем иконку при клике
        persist();
    });

    // bell click toggles popup
    (bellParent || uiRoot).addEventListener('click', ev=>{
        if(modal.style.display === 'flex') return;
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        updateUI(gatherAllItems()); // Обновляем UI при открытии попапа
    });
    document.addEventListener('click', ev=>{ if(!(bellParent || uiRoot).contains(ev.target)) popup.style.display='none'; });

    function createEl(tag, attrs={}, content=''){
        const n = document.createElement(tag);
        for(const k in attrs){
            if(k==='style') n.style.cssText = attrs[k];
            else if(k==='class') n.className = attrs[k];
            else n.setAttribute(k, attrs[k]);
        }
        if(typeof content === 'string') n.appendChild(document.createTextNode(content));
        else if(content) n.appendChild(content);
        return n;
    }

    // ====== Fetch Manager (ЗАМЕНА IFRAME) ======
    const fetchMap = new Map();
    const itemsBySource = new Map();
    const parseCache = new Map();
    let activeRequestsCount = 0;
    let allIntervals = [];
    let isTabActive = true;

    // Мониторинг активности вкладки
    document.addEventListener('visibilitychange', () => {
        isTabActive = !document.hidden;
        if(!isTabActive){
            console.log('[Notifier] Tab inactive, pausing checks');
        } else {
            console.log('[Notifier] Tab active, resuming checks');
            refreshAllTrackers();
        }
    });

    function initFetchTrackers() {
        const keysWanted = new Set(TRACKED_PAGES);

        // Удаляем неиспользуемые трекеры
        for(const [key, rec] of fetchMap.entries()){
            if(!keysWanted.has(key)){
                clearTimeout(rec.timer);
                fetchMap.delete(key);
            }
        }

        // Добавляем новые трекеры
        TRACKED_PAGES.forEach(url => {
            if(!fetchMap.has(url)){
                fetchMap.set(url, {
                    url,
                    lastChecked: 0,
                    backoffMs: CHECK_INTERVAL_DEFAULT,
                    suspendedUntil: 0,
                    failCount: 0,
                    lastContent: null,
                    timer: null,
                    isChecking: false
                });
            }
        });

        // Запускаем проверки
        refreshAllTrackers();
    }

    function refreshAllTrackers() {
        if(!isTabActive) return;

        console.log('[Notifier] Refreshing all trackers');

        for(const rec of fetchMap.values()){
            if(!rec.isChecking && (!rec.suspendedUntil || Date.now() >= rec.suspendedUntil)){
                scheduleNextCheck(rec, 1000); // Запускаем с небольшой задержкой
            }
        }
    }

    function scheduleNextCheck(rec, delayOverride = null) {
        clearTimeout(rec.timer);

        const delay = delayOverride !== null ? delayOverride : Math.max(rec.backoffMs, CHECK_INTERVAL_DEFAULT);

        rec.timer = setTimeout(() => {
            if(!isTabActive) return;

            if(activeRequestsCount < MAX_CONCURRENT_REQUESTS){
                checkPage(rec);
            } else {
                // Retry soon if at capacity
                scheduleNextCheck(rec, 5000);
            }
        }, delay);
    }

    async function checkPage(rec) {
        if(rec.isChecking || !isTabActive) return;

        rec.isChecking = true;
        activeRequestsCount++;

        try {
            console.log(`[Notifier] Checking ${rec.url}`);

            const response = await fetch(rec.url + (rec.url.includes('?') ? '&' : '?') + '_ts=' + Date.now(), {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'text/html',
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });

            if(!response.ok){
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            await processPageContent(rec, html);

            // Success - reset backoff
            rec.failCount = 0;
            rec.backoffMs = CHECK_INTERVAL_DEFAULT;
            rec.lastChecked = Date.now();

        } catch(error) {
            console.warn(`[Notifier] Fetch failed for ${rec.url}:`, error);
            handleFetchError(rec, error);
        } finally {
            rec.isChecking = false;
            activeRequestsCount--;
            scheduleNextCheck(rec);
        }
    }

    function handleFetchError(rec, error) {
        rec.failCount++;
        rec.backoffMs = Math.min(SUSPEND_BASE_MS * rec.failCount, MAX_SUSPEND_MS);
        rec.suspendedUntil = Date.now() + rec.backoffMs;

        console.warn(`[Notifier] Suspending ${rec.url} for ${rec.backoffMs}ms due to errors`);
    }

    async function processPageContent(rec, html) {
        // Check for login page using cache
        const cacheKey = `login_${rec.url}`;
        const cachedLogin = parseCache.get(cacheKey);

        let isLoginPage = false;
        if(cachedLogin && Date.now() - cachedLogin.timestamp < CACHE_TTL){
            isLoginPage = cachedLogin.isLoginPage;
        } else {
            isLoginPage = html.includes('form[name="login"]') ||
                html.includes('input[name="username"]') ||
                html.includes('input[name="login"]');
            parseCache.set(cacheKey, {isLoginPage, timestamp: Date.now()});
        }

        if(isLoginPage){
            handleFetchError(rec, new Error('Login page detected'));
            return;
        }

        // Parse with lightweight DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const table = doc.querySelector('#DataTables_Table_0, .dataTables-example, table.table');
        if(!table){
            console.log('[Notifier] Table not found');
            return;
        }

        const items = parseTableData(doc, table, rec.url);
        itemsBySource.set(rec.url, items);
        evaluateNewItems();
    }

    function parseTableData(doc, table, sourceUrl) {
        const items = [];
        const rows = table.querySelectorAll('tbody tr');

        // Parse breadcrumbs
        const breadcrumbs = doc.querySelectorAll('.breadcrumb li a');
        const moduleTitle = breadcrumbs[2]?.textContent.trim() || '';
        const topicTitle = breadcrumbs[3]?.textContent.trim() || '';

        // Limit parsing to prevent memory issues
        const maxRows = Math.min(rows.length, 100);

        for(let i = 0; i < maxRows; i++){
            const row = rows[i];
            try{
                const cols = row.querySelectorAll('td');
                if(cols.length < 2) continue;

                let status = (row.querySelector('span.label')?.textContent || '').trim();
                if(!status) status = (cols[8]?.textContent || '').trim();
                status = status.replace(/\s+/g, ' ').trim();

                if(!allowedStatuses.includes(status)) continue;

                const id = (cols[1].querySelector('a')?.textContent || cols[1].textContent || '').trim();
                const linkElem = cols[1].querySelector('a');
                const link = linkElem ? new URL(linkElem.href, sourceUrl).href : sourceUrl;
                const name = (cols[2].textContent || '').trim();
                const group = (cols[4].textContent || '').trim();
                const key = `${sourceUrl}::${id}`;

                items.push({
                    key,
                    id,
                    name,
                    group,
                    status,
                    link,
                    source: sourceUrl,
                    moduleTitle,
                    topicTitle
                });
            } catch(e){
                console.warn('[Notifier] Error parsing row:', e);
            }
        }

        return items;
    }

    // ====== Evaluate new items ======
    function evaluateNewItems(){
        const all = gatherAllItems();
        const visible = all.filter(i => !dismissedIds.has(i.key));
        const newOnes = visible.filter(i => !lastKnownIds.has(i.key));

        if(newOnes.length > 0 && !soundMuted){
            try{
                sound.play().catch(e => console.log('Audio play failed:', e));
            }catch(e){}

            if(bellEl && bellEl.classList){
                bellEl.classList.add('bell-alert');
                setTimeout(() => {
                    if(bellEl && bellEl.classList) {
                        bellEl.classList.remove('bell-alert');
                    }
                }, 2000);
            }

            newOnes.forEach(n => lastKnownIds.add(n.key));
            persist();
        }

        updateUI(all);
    }

    function gatherAllItems(){
        const all = [];
        for(const arr of itemsBySource.values()) all.push(...arr);
        const map = new Map();
        all.forEach(i => map.set(i.key, i));
        return Array.from(map.values());
    }

    // ====== Update UI ======
    function updateUI(allItems){
        const visible = allItems.filter(i => !dismissedIds.has(i.key));

        if(counterEl){
            counterEl.style.display = visible.length > 0 ? 'inline-block' : 'none';
            counterEl.textContent = visible.length;
        }

        popup.innerHTML = '';
        popup.appendChild(settingsBtn);
        popup.appendChild(muteBtn);

        if(visible.length === 0){
            popup.appendChild(createEl('div', {class: 'notif-item'}, 'Нет непроверенных работ'));
            return;
        }

        visible.forEach(it => {
            const div = createEl('div', {class: 'notif-item'});
            const title = createEl('div', {class: 'notif-title'}, `${it.name} (${it.group})`);

            const metaText = it.moduleTitle && it.topicTitle
            ? `Модуль: ${it.moduleTitle} — Тема: ${it.topicTitle} — Статус: ${it.status}`
            : `Источник: ${shortUrl(it.source)} — Статус: ${it.status}`;
            const meta = createEl('div', {class: 'notif-meta'}, metaText);

            const a = createEl('a', {
                class: 'notif-link',
                href: it.link,
                target:'_blank',
                style:'display:inline-block;margin-top:6px;color:#0066cc;text-decoration:none;'
            }, `Открыть работу ${it.id}`);

            a.addEventListener('click', ev => {
                ev.stopPropagation();
                try{
                    window.open(it.link, '_blank');
                }catch(e){}
                dismissedIds.add(it.key);
                lastKnownIds.add(it.key);
                persist();
                const all = gatherAllItems();
                updateUI(all);
            });

            div.appendChild(title);
            div.appendChild(meta);
            div.appendChild(a);

            const rec = fetchMap.get(it.source);
            if(rec && rec.suspendedUntil && Date.now() < rec.suspendedUntil){
                const suspendedTime = Math.ceil((rec.suspendedUntil - Date.now()) / 60000);
                div.appendChild(createEl('div', {class: 'suspended-note'},
                                         `Проверки приостановлены (ошибка) — возобновление через ${suspendedTime} мин`));
            }

            popup.appendChild(div);
        });

        // Memory warning if too many items
        if(visible.length > 20){
            const warning = createEl('div', {class: 'memory-warning'},
                                     `Много элементов (${visible.length}). Рассмотрите удаление ненужных страниц в настройках.`);
            popup.appendChild(warning);
        }
    }

    function shortUrl(u){
        try{
            const url = new URL(u);
            return url.pathname;
        }catch(e){
            return u.length > 50 ? u.substring(0, 50) + '...' : u;
        }
    }

    // ====== Memory management ======
    function scheduleCleanup(){
        const cleanupInterval = setInterval(() => {
            // Clean old cache entries
            const now = Date.now();
            for(const [key, value] of parseCache.entries()){
                if(now - value.timestamp > CACHE_TTL * 2){
                    parseCache.delete(key);
                }
            }

            // Force garbage collection if available
            if(window.gc) {
                try{ window.gc(); }catch(e){}
            }

        }, 60000);

        allIntervals.push(cleanupInterval);
    }

    function cleanupIntervals(){
        allIntervals.forEach(interval => clearInterval(interval));
        allIntervals = [];

        // Cleanup all timers
        for(const rec of fetchMap.values()){
            clearTimeout(rec.timer);
        }
    }

    // ====== Login gating ======
    function isLoggedIn(){
        if(document.querySelector("a[href*='/adm/vihod/']")) return true;
        if(document.querySelector(".dropdown.profile-element")) return true;
        if(document.querySelector(".navbar-top-links .fa-bell")) return true;
        return false;
    }

    let mainStarted = false;
    function startMain(){
        if(mainStarted) return;
        mainStarted = true;

        console.log('[Notifier] User logged in - starting fetch trackers');
        initFetchTrackers();
        scheduleCleanup();

        // Основной интервал обновления
        const mainInterval = setInterval(() => {
            refreshAllTrackers();
        }, CHECK_INTERVAL_DEFAULT);
        allIntervals.push(mainInterval);

        // Initial check with staggered delays
        setTimeout(() => {
            refreshAllTrackers();
        }, 2000);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupIntervals);

    // Start the system
    if(isLoggedIn()){
        startMain();
    } else {
        console.log('[Notifier] User not logged in yet - polling every', GLOBAL_LOGIN_POLL_MS, 'ms');
        const loginPoll = setInterval(() => {
            if(isLoggedIn()){
                clearInterval(loginPoll);
                startMain();
            }
        }, GLOBAL_LOGIN_POLL_MS);
        allIntervals.push(loginPoll);
    }

    // ====== Debug helpers ======
    window.__mipt_notifier_v7 = {
        TRACKED_PAGES,
        lastKnownIds,
        dismissedIds,
        fetchMap,
        itemsBySource,
        activeRequestsCount,
        soundMuted,
        addPage(u){
            TRACKED_PAGES.push(u);
            persist();
            initFetchTrackers();
        },
        removePage(u){
            TRACKED_PAGES = TRACKED_PAGES.filter(x => x !== u);
            persist();
            initFetchTrackers();
        },
        forceCheck(){
            refreshAllTrackers();
        },
        cleanup(){
            cleanupIntervals();
            parseCache.clear();
        }
    };

    console.log('[Notifier 7.0.2] initialized. Tracked pages:', TRACKED_PAGES.length);

    // Убедимся, что кнопка звука правильно инициализирована
    updateMuteButton();
})();