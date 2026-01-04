// ==UserScript==
// @name         koneUserNote 기반 서브,게시글 차단
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @license      MIT
// @description  For Script User Blocking, Memo, Sub Blocking and Title Filtering
// @author       cloud67P (도움 받은 코드 powersexer님, 공승아님)
// @match        https://kone.gg/*
// @exclude      https://kone.gg/s/*/write
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kone.gg
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.kone.gg
// @run-at       document-end
// @priority     2
// @downloadURL https://update.greasyfork.org/scripts/551719/koneUserNote%20%EA%B8%B0%EB%B0%98%20%EC%84%9C%EB%B8%8C%2C%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%B0%A8%EB%8B%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551719/koneUserNote%20%EA%B8%B0%EB%B0%98%20%EC%84%9C%EB%B8%8C%2C%EA%B2%8C%EC%8B%9C%EA%B8%80%20%EC%B0%A8%EB%8B%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ARTICLE_SELECTOR = 'div.overflow-hidden .flex.items-end a.hover\\:underline span';
    const DB_NAME = 'koneUserNoteDB';
    const STORE_NAME = 'users';
    const SETTINGS_STORE = 'settings';
    let isHidden = true;

    // 제목 필터링 패턴 (사용자 정의)
    let titlePatternsRaw = [];

    // 문자열을 정규표현식으로 변환
    let titlePatterns = [];

    const USER_BLOCK_MENU_STYLE = {
        position: 'absolute',
        background: '#222',
        color: '#fff',
        padding: '10px 18px',
        borderRadius: '8px',
        fontSize: '14px',
        zIndex: 999999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.16)'
    };

    // ====== IndexedDB 함수들 ======
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'handle' });
                }
                if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
                    db.createObjectStore(SETTINGS_STORE, { keyPath: 'key' });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
    async function getTitleFilters() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(SETTINGS_STORE, 'readonly');
            const req = tx.objectStore(SETTINGS_STORE).get('titleFilters');
            req.onsuccess = () => resolve(req.result ? req.result.value : []);
            req.onerror = () => reject(req.error);
        });
    }

    async function saveTitleFilters(filters) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(SETTINGS_STORE, 'readwrite');
            tx.objectStore(SETTINGS_STORE).put({ key: 'titleFilters', value: filters });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function getExcludedSubs() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(SETTINGS_STORE, 'readonly');
            const req = tx.objectStore(SETTINGS_STORE).get('excludedSubs');
            req.onsuccess = () => resolve(req.result ? req.result.value : []);
            req.onerror = () => reject(req.error);
        });
    }

    async function saveExcludedSubs(subs) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(SETTINGS_STORE, 'readwrite');
            tx.objectStore(SETTINGS_STORE).put({ key: 'excludedSubs', value: subs });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function toggleExcludedSub(subName) {
        const excluded = await getExcludedSubs();
        const index = excluded.indexOf(subName);
        if (index > -1) {
            excluded.splice(index, 1);
        } else {
            excluded.push(subName);
        }
        await saveExcludedSubs(excluded);
        return excluded;
    }

    async function addExcludedSub(subName) {
        const excluded = await getExcludedSubs();
        if (!excluded.includes(subName)) {
            excluded.push(subName);
            await saveExcludedSubs(excluded);
        }
        return excluded;
    }

    async function loadTitleFilters() {
        titlePatternsRaw = await getTitleFilters();
        titlePatterns = titlePatternsRaw.map(p =>
            typeof p === 'string' ? new RegExp(p, 'i') : p
        );
    }

    async function getBlockUsers() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(
                request.result.filter(u => u.block === true && u.type === 'user').map(u => u.handle)
            );
            request.onerror = () => reject(request.error);
        });
    }

    async function getBlockSubs() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(
                request.result.filter(u => u.block === true && u.type === 'sub').map(u => u.handle)
            );
            request.onerror = () => reject(request.error);
        });
    }

    async function getAllUser() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(
                request.result.map(u => ({
                    handle: u.handle,
                    block: u.block,
                    username: u.username,
                    note: u.note,
                    type: u.type || 'user'
                }))
            );
            request.onerror = () => reject(request.error);
        });
    }

    async function getUser(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(handle);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function getNote(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(handle);
            req.onsuccess = () => resolve(req.result && req.result.note ? req.result.note : '');
            req.onerror = () => reject(req.error);
        });
    }

    async function addBlockUser(handle, username, type = 'user') {
        const db = await openDB();
        handle = handle.toLowerCase();
        username = username ? username.toLowerCase() : '';

        let user = await getUser(handle);
        let usernameArr = [];
        if (user) {
            const set = new Set(user.username ? user.username.slice() : []);
            if (username) set.add(username);
            usernameArr = Array.from(set);

            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({
                    handle,
                    block: true,
                    username: usernameArr,
                    note: user.note || "",
                    type: type
                });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } else {
            usernameArr = username ? [username] : [];

            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({
                    handle,
                    block: true,
                    username: usernameArr,
                    type: type
                });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        }
    }

    async function addNote(handle, username, note, overwrite = false) {
        const db = await openDB();
        handle = handle.toLowerCase();
        username = username.toLowerCase();

        let user = await getUser(handle);
        let usernameArr = [];

        if (user) {
            const set = new Set(user.username.slice());
            set.add(username);
            usernameArr = Array.from(set);
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({
                    handle,
                    block: user.block,
                    username: usernameArr,
                    note: overwrite ? note : (user.note ? (user.note + "\n" + note) : note),
                    type: user.type || 'user'
                });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        } else {
            usernameArr = [username];
            return new Promise((resolve, reject) => {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put({
                    handle,
                    block: false,
                    username: usernameArr,
                    note: note,
                    type: 'user'
                });
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
            });
        }
    }

    async function removeUser(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).delete(handle);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async function removeAllNotes() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);

            const request = store.getAll();
            request.onsuccess = () => {
                const allUsers = request.result;
                allUsers.forEach(u => {
                    if (u.note && u.note.trim() !== '') {
                        store.put({
                            handle: u.handle,
                            block: u.block,
                            username: u.username,
                            type: u.type || 'user',
                            note: ''
                        });
                    }
                });
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    // ====== 데이터 추출 및 핸들 주입 ======
    function extractData() {
        const raw = (unsafeWindow.__next_f || []).map(x => x[1]).join('');
        if (!raw) return null;
        let anchor = raw.indexOf('10:[');
        if (anchor === -1) {
            anchor = raw.indexOf('e:[');
            if (anchor === -1) return null;
        }
        const start = raw.indexOf('[', anchor);
        if (start === -1) return null;
        let depth = 0, inStr = false, esc = false, end = -1;
        for (let i = start; i < raw.length; i++) {
            const ch = raw[i];

            if (inStr) {
                if (esc) { esc = false; }
                else if (ch === '\\') { esc = true; }
                else if (ch === '"') { inStr = false; }
                continue;
            }
            if (ch === '"') inStr = true;
            else if (ch === '[') depth++;
            else if (ch === ']') {
                depth--;
                if (depth === 0) { end = i + 1; break; }
            }
        }
        if (end === -1) return null;
        const jsonSlice = raw.slice(start, end);
        try {
            const arr = JSON.parse(jsonSlice);
            return arr && arr[3];
        } catch (e) {
            console.error('JSON.parse 실패', e, { jsonSlice });
            return null;
        }
    }

    function getHandleFromRow(el) {
        const writerDiv = el.querySelector('a div.text-xs div.text-ellipsis');
        return writerDiv ? writerDiv.dataset.handle : '';
    }

    function targetList(articles) {
        const targets = [
            ...document.querySelectorAll('div.group\\/post-wrapper'),
            ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents')
        ];
        targets.forEach(row => {
            const titleSpan = row.querySelector('span.overflow-hidden.text-nowrap.text-ellipsis');
            if (!titleSpan) return;
            const title = titleSpan.textContent.trim();
            const article = articles.find(a => a.title.trim() === title);
            if (!article) return;
            const writerDiv = row.querySelector('.overflow-hidden.text-center.whitespace-nowrap.text-ellipsis');
            writerDiv.setAttribute('data-handle', article.writer.handle);
        });
    }

    function targetArticle(article, comments) {
        const nodeList = document.querySelectorAll(ARTICLE_SELECTOR);
        const [articleAuthor, ...rest] = Array.from(nodeList);
        articleAuthor.setAttribute('data-handle', article.writer.handle)
        comments.forEach(c => {
            const commentSpan = document.querySelector(`#c_${c.id}`).parentElement.parentElement.querySelector(ARTICLE_SELECTOR);
            commentSpan.setAttribute('data-handle', c.handle)
        });
    }

    function flattenComments(arr, result = []) {
        arr.forEach(item => {
            result.push({
                id: item.id,
                content: item.content,
                handle: item.writer.handle,
                display_name: item.writer.display_name
            });
            if (Array.isArray(item.children) && item.children.length > 0) {
                flattenComments(item.children, result);
            }
        });
        return result;
    }

    function getLimitFromPage(defaultLimit = 50) {
        const exact = document.querySelector('div.m-auto[bis_skin_checked]');
        const take = (el) => (el?.textContent || '').trim().replace(/,/g, '');

        let text = take(exact);
        if (/^\d+$/.test(text)) {
            const n = parseInt(text, 10);
            if (Number.isFinite(n) && n > 0) return n;
        }

        for (const el of document.querySelectorAll('div.m-auto')) {
            text = take(el);
            if (/^\d+$/.test(text)) {
                const n = parseInt(text, 10);
                if (Number.isFinite(n) && n > 0) return n;
            }
        }

        return defaultLimit;
    }

    function fetchArticleList({ limit = 50 } = {}, onSuccess, onError) {
        const parts = location.pathname.split('/');
        const subname = parts[2] || '';
        if (!subname) {
            onError && onError(new Error('subname 추출 실패'));
            return;
        }

        const page = parseInt(new URLSearchParams(location.search).get('p') || '1', 10);
        const url = `https://api.kone.gg/v0/article/list/${subname}`;
        const payload = { limit, page };

        GM_xmlhttpRequest({
            method: 'POST',
            url,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            data: JSON.stringify(payload),
            responseType: 'json',
            timeout: 15000,
            onload: (res) => {
                if (res.status >= 200 && res.status < 300) {
                    try {
                        const data = res.response ?? JSON.parse(res.responseText);
                        if (!Array.isArray(data)) throw new Error('응답이 배열이 아님');
                        onSuccess && onSuccess(data);
                    } catch (e) {
                        onError && onError(new Error('JSON 파싱 실패: ' + e.message));
                    }
                } else {
                    onError && onError(new Error(`HTTP ${res.status}: ${res.responseText || ''}`));
                }
            },
            onerror: (err) => onError && onError(new Error('요청 실패: ' + (err.error || 'network error'))),
            ontimeout: () => onError && onError(new Error('요청 타임아웃'))
        });
    }

    function loadData() {
        const raw = extractData();
        unsafeWindow.rawData = raw;
        if (!raw) return;

        const limit = getLimitFromPage(50);
        if (!Array.isArray(raw.Articles) || raw.Articles.length === 0) {
            fetchArticleList(
                { limit },
                (list) => {
                    raw.Articles = list;
                    targetList(raw.Articles);
                    if (raw.Article) {
                        targetArticle(raw.Article, flattenComments(raw.Comments));
                    }
                },
                (err) => {
                    console.error(err);
                    if (raw.Articles) targetList(raw.Articles);
                    if (raw.Article) targetArticle(raw.Article, flattenComments(raw.Comments));
                }
            );
            return;
        }

        targetList(raw.Articles);
        if (raw.Article) {
            targetArticle(raw.Article, flattenComments(raw.Comments));
        }
    }

    // ====== 필터링 함수들 ======
    async function hide() {
        const hiddenUsers = (await getBlockUsers()).map(u => u.toLowerCase());
        const hiddenSubs = (await getBlockSubs()).map(s => s.toLowerCase());

        if (hiddenUsers.length === 0 && hiddenSubs.length === 0 && titlePatterns.length === 0) return;

        const allTargets = [
        ...document.querySelectorAll('div.group\\/post-wrapper'),
        ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents'),
        ...Array.from(document.querySelectorAll('div.grow.grid > div.relative')).filter(el =>
            el.querySelector('.aspect-square')
        )
    ];

        allTargets.forEach(el => {
            let username = '';
            let tabName = '';
            let title = '';

            // 갤러리 뷰인지 구분 - aspect-square로 확인
            const isGalleryView = !!el.querySelector('.aspect-square');

            if (isGalleryView) {
                // 갤러리 뷰: 유저명 추출
                const writerDiv = el.querySelector('#writer_link');
                username = writerDiv?.textContent.trim() || '';

                // 갤러리 뷰: 서브명 추출 (갤러리 뷰는 서브명이 없을 수 있음)
                const subSpan = el.querySelector('.shrink-0 > span');
                if (subSpan) {
                    const subText = subSpan.textContent.trim();
                    tabName = subText.replace(/\s*\|.*$/, '').trim().toLowerCase();
                }

                // 갤러리 뷰: 제목 추출
                const titleSpan = el.querySelector('.text-ellipsis.line-clamp-2');
                title = titleSpan ? titleSpan.textContent.trim() : '';
            } else {
                // 리스트 뷰: 기존 로직
                username = getHandleFromRow(el);
                const tabNameEl = el.querySelector('.col-span-2 > div');
                tabName = tabNameEl?.innerText.trim().toLowerCase() || '';
                const titleSpan = el.querySelector('span.overflow-hidden.text-nowrap.text-ellipsis');
                title = titleSpan ? titleSpan.textContent.trim() : '';
            }

            const shouldHide =
                (username && hiddenUsers.includes(username.toLowerCase())) ||
                (tabName && hiddenSubs.includes(tabName)) ||
                titlePatterns.some(p => p.test(title));

            if (shouldHide) {
                el.style.display = 'none';
                el.dataset.toggled = true;
            }
        });

        document.querySelectorAll(`div.group\\/comment a.hover\\:underline span`).forEach(c => {
            if (c.dataset.toggled === "true") return;
            if (c.dataset.handle && hiddenUsers.includes(c.dataset.handle)) {
                c.dataset.hiddenUserName = c.textContent;
                c.textContent = '[숨김처리 된 유저]';
                c.dataset.toggled = true;

                const commentDiv = c.closest('div.group\\/comment');
                // 프로필 이미지 숨김
                const profile = commentDiv.querySelector('img');
                if (profile) {
                    profile.dataset.hiddenSrc = profile.src;
                    profile.src = '/images/profile.png';
                    profile.dataset.toggled = true;
                }
                // 댓글 본문 숨김
                const comment = commentDiv.querySelector('div.text-sm.whitespace-pre-wrap');
                if (comment && !comment.dataset.toggled) {
                    comment.dataset.hiddenContent = comment.textContent;
                    comment.textContent = '[차단되어 숨겨진 내용]';
                    comment.classList.add('opacity-50');
                    comment.dataset.toggled = true;
                    comment.style.cursor = 'pointer';
                    // 클릭으로 토글
                    comment.addEventListener('click', function toggleComment(e) {
                        e.stopPropagation();
                        if (this.textContent === '[차단되어 숨겨진 내용]') {
                            this.textContent = this.dataset.hiddenContent;
                            this.classList.remove('opacity-50');
                        } else {
                            this.textContent = '[차단되어 숨겨진 내용]';
                            this.classList.add('opacity-50');
                        }
                    });
                }
            }
        });
    }

    async function show() {
        const hiddenUsers = (await getBlockUsers()).map(u => u.toLowerCase());
        const excludedSubs = (await getExcludedSubs()).map(s => s.toLowerCase());
        if (hiddenUsers.length === 0) return;

        const targets = [
        ...document.querySelectorAll('div.group\\/post-wrapper'),
        ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents'),
        ...Array.from(document.querySelectorAll('div.grow.grid > div.relative')).filter(el =>
            el.querySelector('.aspect-square')
        )
    ];

        targets.forEach(el => {
            if (el.dataset.toggled === "true") {
                let tabName = '';
                // 갤러리 뷰인지 확인
                const isGalleryView = !!el.querySelector('.aspect-square');

                if (isGalleryView) {
                    const subSpan = el.querySelector('.shrink-0 > span');
                    if (subSpan) {
                        const subText = subSpan.textContent.trim();
                        tabName = subText.replace(/\s*\|.*$/, '').trim().toLowerCase();
                    }
                } else {
                    //제외 서브 확인
                    const tabNameEl = el.querySelector('.col-span-2 > div');
                    tabName = tabNameEl?.innerText.trim().toLowerCase() || '';
                }

                if (excludedSubs.includes(tabName)) {
                    return;
                }

                el.style.display = '';
                delete el.dataset.toggled;
            }
        });
        document.querySelectorAll('div.group\\/comment a.hover\\:underline span').forEach(c => {
            if (c.dataset.toggled === "true") {
                if (c.dataset.hiddenUserName) {
                    c.textContent = c.dataset.hiddenUserName;
                    delete c.dataset.hiddenUserName;
                }
                delete c.dataset.toggled;
                const commentDiv = c.closest('div.group\\/comment');
                const profile = commentDiv.querySelector('img');
                if (profile && profile.dataset.toggled === "true") {
                    if (profile.dataset.hiddenSrc) {
                        profile.src = profile.dataset.hiddenSrc;
                        delete profile.dataset.hiddenSrc;
                    }
                    delete profile.dataset.toggled;
                }
                const comment = commentDiv.querySelector('div.text-sm.whitespace-pre-wrap');
                if (comment && comment.dataset.toggled === "true") {
                    if (comment.dataset.hiddenContent) {
                        comment.textContent = comment.dataset.hiddenContent;
                        delete comment.dataset.hiddenContent;
                    }
                    comment.classList.remove('opacity-50');
                    delete comment.dataset.toggled;
                    comment.style.cursor = '';
                }
            }
        });
    }

    async function displayNote() {
        const userDict = Object.fromEntries((await getAllUser()).map(n => [n.handle, n]));
        document.querySelectorAll(ARTICLE_SELECTOR).forEach(s => {
            const user = userDict[s.dataset.handle];
            if (!user || !user.note) return;
            const anchor = s.closest('a');
            if (!anchor) return;
            let wrapper = anchor.nextSibling;
            if (wrapper && wrapper.classList && wrapper.classList.contains('note-span-wrapper')) {
                wrapper.querySelector('span').textContent = user.note;
                return;
            }
            wrapper = document.createElement('div');
            wrapper.className = 'note-span-wrapper flex';
            const span = document.createElement('span');
            span.className = 'text-xs';
            span.textContent = user.note;
            wrapper.appendChild(span);
            anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
        });
    }

    // ====== UI 메뉴 생성 ======
    function createDiv(text, styleObj) {
        const div = document.createElement('div');
        div.textContent = text;
        if (styleObj) Object.assign(div.style, styleObj);
        return div;
    }

    function createClickMenu(el, items) {
        if (window.currentClickMenu) {
            window.currentClickMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'kone-click-menu';
        Object.assign(menu.style, USER_BLOCK_MENU_STYLE);

        items.forEach(([label, fn]) => {
            const btn = createDiv(label, {
                padding: '4px 0',
                cursor: fn ? 'pointer' : 'default',
                color: fn ? '#fff' : '#aaa',
                fontSize: '13px'
            });
            if (fn) {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        await fn();
                    } catch(err) {
                        console.error(err);
                    }
                    menu.remove();
                    window.currentClickMenu = null;
                    await updateAll();
                });
            }
            menu.appendChild(btn);
        });

        document.body.appendChild(menu);
        const rect = el.getBoundingClientRect();
        menu.style.left = Math.max(window.scrollX + rect.right + 8, 6) + 'px';
        menu.style.top = Math.max(window.scrollY + rect.top, 6) + 'px';

        menu.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (window.currentClickMenu) {
                    window.currentClickMenu.remove();
                    window.currentClickMenu = null;
                }
            }, 500);
        });
        window.currentClickMenu = menu;

        // 모바일용 스크롤 감지
        const closeMenuOnScroll = () => {
            if (window.currentClickMenu) {
                window.currentClickMenu.remove();
                window.currentClickMenu = null;
                window.removeEventListener('scroll', closeMenuOnScroll, true);
                document.removeEventListener('touchmove', closeMenuOnScroll, true);
            }
        };

        // 스크롤 이벤트 등록 (capture phase에서 감지)
        window.addEventListener('scroll', closeMenuOnScroll, true);
        document.addEventListener('touchmove', closeMenuOnScroll, true);


    }

    // ====== 유저 및 서브 클릭 이벤트 ======
    function setupClickMenus() {
        // 게시글 목록의 유저 클릭 메뉴 (#writer_link - PC)
        document.querySelectorAll('#writer_link').forEach(el => {
            if (el.dataset.clickBound) return;
            el.dataset.clickBound = '1';

            el.style.cursor = 'pointer';

            el.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const username = el.innerText.trim();
                const handle = el.dataset.handle || username;

                if (!handle) return;

                const note = await getNote(handle);
                const noteDisplay = note ? note : "현재 작성된 메모 없음";

                createClickMenu(el, [
                    ['사용자 페이지', () => window.open(`/u/${handle}`, '_blank')],
                    ['사용자 차단', async () => {
                        const memo = prompt(
                            `[${username}(${handle})]을(를) 차단합니다.\n메모를 남기시겠습니까? (선택사항)`,
                            ""
                        );
                        if (memo !== null) {
                            await addBlockUser(handle, username, 'user');
                            if (memo.trim() !== '') {
                                await addNote(handle, username, memo.trim(), true);
                            }
                        }
                    }],
                    ['메모 수정/추가', async () => {
                        const newNote = prompt(
                            `[${username}(${handle})]에게 남길 메모를 입력:`,
                            note || ""
                        );
                        if (newNote !== null) {
                            await addNote(handle, username, newNote.trim(), true);
                        }
                    }],
                    [`현재 메모: ${noteDisplay}`, null]
                ]);

                return false;
            }, true);
        });

        // 모바일 유저 클릭 메뉴
        document.querySelectorAll('.overflow-hidden.text-center.text-nowrap.whitespace-nowrap.text-ellipsis:not(#writer_link):not([data-click-bound])').forEach(el => {
            // 부모가 writer 관련인지 확인
            const parent = el.closest('.overflow-hidden.flex.justify-start');
            if (!parent) return;

            el.dataset.clickBound = '1';
            el.style.cursor = 'pointer';
            // 터치 시 미리보기 방지
            el.style.touchAction = 'manipulation';
            el.style.webkitTouchCallout = 'none';

            el.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const username = el.innerText.trim();
                const handle = el.dataset.handle || username;

                if (!handle) return;

                const note = await getNote(handle);
                const noteDisplay = note ? note : "현재 작성된 메모 없음";

                createClickMenu(el, [
                    ['사용자 페이지', () => window.open(`/u/${handle}`, '_blank')],
                    ['사용자 차단', async () => {
                        const memo = prompt(
                            `[${username}(${handle})]을(를) 차단합니다.\n메모를 남기시겠습니까? (선택사항)`,
                            ""
                        );
                        if (memo !== null) {
                            await addBlockUser(handle, username, 'user');
                            if (memo.trim() !== '') {
                                await addNote(handle, username, memo.trim(), true);
                            }
                        }
                    }],
                    ['메모 수정/추가', async () => {
                        const newNote = prompt(
                            `[${username}(${handle})]에게 남길 메모를 입력:`,
                            note || ""
                        );
                        if (newNote !== null) {
                            await addNote(handle, username, newNote.trim(), true);
                        }
                    }],
                    [`현재 메모: ${noteDisplay}`, null]
                ]);

                return false;
            }, true);
        });

        // 댓글 및 게시글 상세의 유저 클릭 메뉴 (ARTICLE_SELECTOR)
        document.querySelectorAll(ARTICLE_SELECTOR).forEach(el => {
            if (el.dataset.clickBound) return;
            el.dataset.clickBound = '1';

            el.style.cursor = 'pointer';

            el.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                const handle = el.dataset.handle;
                const username = el.textContent.trim();

                if (!handle) return;

                const note = await getNote(handle);
                const noteDisplay = note ? note : "현재 작성된 메모 없음";

                createClickMenu(el, [
                    ['사용자 페이지', () => window.open(`/u/${handle}`, '_blank')],
                    ['사용자 차단', async () => {
                        const memo = prompt(
                            `[${username}(${handle})]을(를) 차단합니다.\n메모를 남기시겠습니까? (선택사항)`,
                            ""
                        );
                        if (memo !== null) {
                            await addBlockUser(handle, username, 'user');
                            if (memo.trim() !== '') {
                                await addNote(handle, username, memo.trim(), true);
                            }
                        }
                    }],
                    ['메모 수정/추가', async () => {
                        const newNote = prompt(
                            `[${username}(${handle})]에게 남길 메모를 입력:`,
                            note || ""
                        );
                        if (newNote !== null) {
                            await addNote(handle, username, newNote.trim(), true);
                        }
                    }],
                    [`현재 메모: ${noteDisplay}`, null]
                ]);

                return false;
            }, true);
        });

        // 서브 클릭 메뉴 (전체 서브 페이지에서만) - PC
        if (location.pathname === '/s/all') {
            document.querySelectorAll('.col-span-2 > div').forEach(el => {
                if (el.dataset.clickBound) return;
                el.dataset.clickBound = '1';

                const sub = el.innerText.trim();
                if (!sub) return;

                el.style.cursor = 'pointer';

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    createClickMenu(el, [
                        ['해당 서브 이동', () => window.open(`/s/${sub}`, '_blank')],
                        ['서브 차단', async () => {
                            await addBlockUser(sub, '', 'sub');
                        }],
                        ['서브 제외', async () => {
                            await addBlockUser(sub, '', 'sub');
                            await addExcludedSub(sub.toLowerCase());
                        }]
                    ]);

                    return false;
                }, true);
            });

            // 모바일 서브 클릭 메뉴
            document.querySelectorAll('.shrink-0 > span').forEach(el => {
                if (el.dataset.clickBound) return;

                const sub = el.innerText.trim();
                // "formulaone |" 같은 형태에서 서브명만 추출
                const cleanSub = sub.replace(/\s*\|.*$/, '').trim();
                if (!cleanSub || cleanSub.includes('분') || cleanSub.includes('전')) return;

                el.dataset.clickBound = '1';
                el.style.cursor = 'pointer';
                // 터치 시 미리보기 방지
                el.style.touchAction = 'manipulation';
                el.style.webkitTouchCallout = 'none';

                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    createClickMenu(el, [
                        ['해당 서브 이동', () => window.open(`/s/${cleanSub}`, '_blank')],
                        ['서브 차단', async () => {
                            await addBlockUser(cleanSub, '', 'sub');
                        }],
                        ['서브 제외', async () => {
                            await addBlockUser(sub, '', 'sub');
                            await addExcludedSub(sub.toLowerCase());
                        }]
                    ]);

                    return false;
                }, true);
            });
        }
    }

    // ====== 차단 관리 UI ======
    async function showManageUI() {
        const blocked = await getAllUser();
        const blockedList = blocked.filter(u => u.block);

        const existingModal = document.getElementById('kone-manage-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'kone-manage-modal';
        modal.style.cssText = `
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:#222;color:#fff;padding:16px 20px;border-radius:8px;
            max-height:80vh;overflow:auto;z-index:999999;font-size:14px;
            box-shadow:0 4px 12px rgba(0,0,0,0.5);
            min-width:min(500px, 90vw);max-width:min(700px, 95vw);
        `;
        // 닫기 버튼
        const closeXBtn = document.createElement('div');
        closeXBtn.textContent = '✕';
        closeXBtn.style.cssText = `
            position:sticky;top:0;left:100%;
            width:32px;height:32px;
            margin:-16px -20px 0 0;
            display:flex;align-items:center;justify-content:center;
            background:#f44;color:#fff;
            border-radius:50%;
            cursor:pointer;
            font-size:18px;font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            z-index:1;
            transition:all 0.2s ease;
        `;

          // 호버 효과
        closeXBtn.addEventListener('mouseenter', () => {
            closeXBtn.style.transform = 'scale(1.1)';
            closeXBtn.style.background = '#ff5555';
        });
        closeXBtn.addEventListener('mouseleave', () => {
            closeXBtn.style.transform = 'scale(1)';
            closeXBtn.style.background = '#f44';
        });

        closeXBtn.addEventListener('click', () => {
            modal.remove();
            window.isManageUIOpen = false;
        });

        modal.appendChild(closeXBtn);

        const title = document.createElement('div');
        title.textContent = '차단 관리';
        title.style.cssText = 'font-weight:bold;margin-bottom:12px;text-align:center;font-size:16px;';
        modal.appendChild(title);

        // 제목 필터링 섹션
        const filterTitle = document.createElement('div');
        filterTitle.textContent = '차단할 제목 필터링 문구';
        filterTitle.style.cssText = 'font-weight:bold;margin-top:12px;margin-bottom:8px;font-size:15px;color:#ffcc00;';
        modal.appendChild(filterTitle);

        const subFT = document.createElement('div');
        subFT.textContent = '차단규칙은 해당 단어의 포함 여부만 확인하여 차단됩니다, Enter를 통해 저장 됩니다';
        subFT.style.cssText = 'font-size:12px;color:#999;margin-bottom:8px;line-height:1.4;';
        modal.appendChild(subFT);

        const filterInputWrap = document.createElement('div');
        filterInputWrap.style.cssText = 'margin-bottom:8px;';

        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.value = titlePatternsRaw.join(', ');
        filterInput.placeholder = '예: 테스트, 테스트2, 테스트3';
        filterInput.style.cssText = `
            width:100%;padding:8px;background:#333;border:1px solid #555;
            border-radius:4px;color:#fff;font-size:13px;
        `;
        filterInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const input = filterInput.value.trim();
                const filters = input ? input.split(',').map(s => s.trim()).filter(s => s) : [];
                await saveTitleFilters(filters);
                await loadTitleFilters();
                await updateAll();
                alert('제목 필터링이 저장되었습니다.');
            }
        });
        filterInputWrap.appendChild(filterInput);

        const filterBtnWrap = document.createElement('div');
        filterBtnWrap.style.cssText = 'display:flex;gap:4px;margin-top:4px;';
        modal.appendChild(filterInputWrap);

        // 서브와 유저 분리
        const excludedSubs = await getExcludedSubs();
        const subs = blockedList.filter(item => item.type === 'sub');
        const users = blockedList.filter(item => item.type === 'user');

        // 차단된 서브와 제외된 서브 분리
        const blockedSubs = subs.filter(item => !excludedSubs.includes(item.handle));
        const excludedSubsList = subs.filter(item => excludedSubs.includes(item.handle));

        // 차단된 서브 섹션
        if (blockedSubs.length > 0) {
            const subTitle = document.createElement('div');
            subTitle.textContent = '차단된 서브';
            subTitle.style.cssText = 'font-weight:bold;margin-top:12px;margin-bottom:8px;font-size:15px;color:#4FC3F7;';
            modal.appendChild(subTitle);

            // 설명 텍스트 추가
            const subDesc = document.createElement('div');
            subDesc.textContent = '서브 차단시 기본적으로 게시물이 숨겨지지만 숨김처리 된 게시물을 클릭하여 볼 수 있습니다';
            subDesc.style.cssText = 'font-size:12px;color:#999;margin-bottom:8px;line-height:1.4;';
            modal.appendChild(subDesc);

            const subGrid = document.createElement('div');
            subGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;';

            blockedSubs.forEach(item => {
                const { handle } = item;

                const subItem = document.createElement('div');
                subItem.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#333;border-radius:4px;';

                const subName = document.createElement('span');
                subName.textContent = handle;
                subName.style.cssText = 'font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;color:#4FC3F7;text-decoration:underline;';
                subName.addEventListener('click', () => {
                    window.open(`/s/${handle}`, '_blank');
                });
                subItem.appendChild(subName);

                const btnWrap = document.createElement('div');
                btnWrap.style.cssText = 'display:flex;gap:4px;margin-left:8px;flex-shrink:0;';

                // 제외 버튼
                const excludeBtn = document.createElement('button');
                excludeBtn.textContent = '제외';
                excludeBtn.style.cssText = `
                    background:#ff9800;color:#fff;border:none;padding:2px 6px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;
                excludeBtn.addEventListener('click', async () => {
                    await toggleExcludedSub(handle);
                    await updateAll();
                    // UI 새로고침
                    const modal = document.getElementById('kone-manage-modal');
                    if (modal) {
                        modal.remove();
                        window.isManageUIOpen = false;
                    }
                    showManageUI();
                });
                btnWrap.appendChild(excludeBtn);

                // 해제 버튼
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '해제';
                removeBtn.style.cssText = `
                    background:#f44;color:#fff;border:none;padding:2px 6px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;
                removeBtn.addEventListener('click', async () => {
                    await removeUser(handle);

                    subItem.remove();
                    if (subGrid.children.length === 0) {
                        subTitle.remove();
                        subDesc.remove();
                        subGrid.remove();
                    }
                    await updateAll();
                });
                btnWrap.appendChild(removeBtn);

                subItem.appendChild(btnWrap);
                subGrid.appendChild(subItem);
            });

            modal.appendChild(subGrid);
        }

        // 제외된 서브 섹션
        if (excludedSubsList.length > 0) {
            const excludedTitle = document.createElement('div');
            excludedTitle.textContent = '제외된 서브';
            excludedTitle.style.cssText = 'font-weight:bold;margin-top:12px;margin-bottom:8px;font-size:15px;color:#4caf50;';
            modal.appendChild(excludedTitle);

            // 설명 텍스트 추가
            const excludedDesc = document.createElement('div');
            excludedDesc.textContent = '서브 제외시 숨김처리된 게시물을 클릭하여 보여지지 않습니다';
            excludedDesc.style.cssText = 'font-size:12px;color:#999;margin-bottom:8px;line-height:1.4;';
            modal.appendChild(excludedDesc);

            const excludedGrid = document.createElement('div');
            excludedGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;';

            excludedSubsList.forEach(item => {
                const { handle } = item;

                const subItem = document.createElement('div');
                subItem.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 8px;background:#333;border-radius:4px;';

                const subName = document.createElement('span');
                subName.textContent = handle;
                subName.style.cssText = 'font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;color:#81C784;text-decoration:underline;';
                subName.addEventListener('click', () => {
                    window.open(`/s/${handle}`, '_blank');
                });
                subItem.appendChild(subName);

                const btnWrap = document.createElement('div');
                btnWrap.style.cssText = 'display:flex;gap:4px;margin-left:8px;flex-shrink:0;';

                // 차단 버튼 (제외 → 차단으로 전환)
                const blockBtn = document.createElement('button');
                blockBtn.textContent = '차단';
                blockBtn.style.cssText = `
                    background:#ff9800;color:#fff;border:none;padding:2px 6px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;
                blockBtn.addEventListener('click', async () => {
                    await toggleExcludedSub(handle);
                    await updateAll();
                    // UI 새로고침
                    const modal = document.getElementById('kone-manage-modal');
                    if (modal) {
                        modal.remove();
                        window.isManageUIOpen = false;
                    }
                    showManageUI();
                });
                btnWrap.appendChild(blockBtn);

                // 해제 버튼
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '해제';
                removeBtn.style.cssText = `
                    background:#f44;color:#fff;border:none;padding:2px 6px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;
                removeBtn.addEventListener('click', async () => {
                    await removeUser(handle);

                    // 제외 목록에서도 제거
                    const excluded = await getExcludedSubs();
                    const index = excluded.indexOf(handle);
                    if (index > -1) {
                        excluded.splice(index, 1);
                        await saveExcludedSubs(excluded);
                    }

                    subItem.remove();
                    if (excludedGrid.children.length === 0) {
                        excludedTitle.remove();
                        excludedDesc.remove();
                        excludedGrid.remove();
                    }
                    await updateAll();
                });
                btnWrap.appendChild(removeBtn);

                subItem.appendChild(btnWrap);
                excludedGrid.appendChild(subItem);
            });

            modal.appendChild(excludedGrid);
        }

        // 유저 섹션
        if (users.length > 0) {
            const userTitle = document.createElement('div');
            userTitle.textContent = '차단된 유저';
            userTitle.style.cssText = 'font-weight:bold;margin-top:12px;margin-bottom:8px;font-size:15px;color:#ffcc00;';
            modal.appendChild(userTitle);

            const userList = document.createElement('ul');
            userList.style.cssText = 'list-style:none;padding:0;margin:0;';

            users.forEach(item => {
                const { handle, username, note } = item;
                const li = document.createElement('li');
                li.style.cssText = 'margin:8px 0;padding:8px;border-bottom:1px solid #444;';

                // 유저 정보
                const infoDiv = document.createElement('div');
                infoDiv.style.cssText = 'margin-bottom:4px;';
                const displayName = (username && username.length > 0)
                    ? `${username[0]}(${handle})`
                    : handle;
                infoDiv.innerHTML = `<strong>${displayName}</strong>`;
                li.appendChild(infoDiv);

                // 메모 표시 및 수정 영역
                const noteContainer = document.createElement('div');
                noteContainer.style.cssText = 'margin-bottom:6px;';

                const noteDiv = document.createElement('div');
                noteDiv.style.cssText = 'padding:4px 8px;background:#333;border-radius:4px;font-size:12px;color:#ffeb3b;cursor:pointer;position:relative;';
                noteDiv.textContent = note && note.trim() !== '' ? `메모: ${note}` : '메모: (없음 - 클릭하여 추가)';

                const noteTextarea = document.createElement('textarea');
                noteTextarea.style.cssText = `
                    display:none;width:100%;padding:4px 8px;background:#444;border:1px solid #666;
                    border-radius:4px;font-size:12px;color:#ffeb3b;resize:vertical;min-height:60px;
                    font-family:inherit;
                `;
                noteTextarea.value = note || '';

                const noteBtnWrap = document.createElement('div');
                noteBtnWrap.style.cssText = 'display:none;gap:4px;margin-top:4px;';

                const saveNoteBtn = document.createElement('button');
                saveNoteBtn.textContent = '저장';
                saveNoteBtn.style.cssText = `
                    background:#4caf50;color:#fff;border:none;padding:3px 8px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;

                const cancelNoteBtn = document.createElement('button');
                cancelNoteBtn.textContent = '취소';
                cancelNoteBtn.style.cssText = `
                    background:#666;color:#fff;border:none;padding:3px 8px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;

                noteBtnWrap.appendChild(saveNoteBtn);
                noteBtnWrap.appendChild(cancelNoteBtn);

                // 메모 클릭 시 편집 모드
                noteDiv.addEventListener('click', () => {
                    noteDiv.style.display = 'none';
                    noteTextarea.style.display = 'block';
                    noteBtnWrap.style.display = 'flex';
                    noteTextarea.focus();
                });

                // 저장 버튼
                saveNoteBtn.addEventListener('click', async () => {
                    const newNote = noteTextarea.value.trim();
                    const userItem = await getUser(handle);
                    const usernameForSave = (username && username.length > 0) ? username[0] : '';

                    await addNote(handle, usernameForSave, newNote, true);
                    noteDiv.textContent = newNote !== '' ? `메모: ${newNote}` : '메모: (없음 - 클릭하여 추가)';
                    noteDiv.style.display = 'block';
                    noteTextarea.style.display = 'none';
                    noteBtnWrap.style.display = 'none';

                    await updateAll();
                });

                // 취소 버튼
                cancelNoteBtn.addEventListener('click', () => {
                    noteTextarea.value = note || '';
                    noteDiv.style.display = 'block';
                    noteTextarea.style.display = 'none';
                    noteBtnWrap.style.display = 'none';
                });

                noteContainer.appendChild(noteDiv);
                noteContainer.appendChild(noteTextarea);
                noteContainer.appendChild(noteBtnWrap);
                li.appendChild(noteContainer);

                // 버튼 영역
                const btnWrap = document.createElement('div');
                btnWrap.style.cssText = 'display:flex;justify-content:space-between;gap:4px;margin-top:6px;';

                // 왼쪽 버튼 그룹
                const leftBtnWrap = document.createElement('div');
                leftBtnWrap.style.cssText = 'display:flex;gap:4px;';

                // 사용자 페이지 방문 버튼
                const visitUserBtn = document.createElement('button');
                visitUserBtn.textContent = '페이지 방문';
                visitUserBtn.style.cssText = `
                    background:#2196f3;color:#fff;border:none;padding:4px 8px;
                    border-radius:4px;cursor:pointer;font-size:12px;
                `;
                visitUserBtn.addEventListener('click', () => {
                    window.open(`/u/${handle}`, '_blank');
                });
                leftBtnWrap.appendChild(visitUserBtn);

                // 오른쪽 버튼 그룹
                const rightBtnWrap = document.createElement('div');
                rightBtnWrap.style.cssText = 'display:flex;gap:4px;';

                // 차단 해제 버튼
                const unblockBtn = document.createElement('button');
                unblockBtn.textContent = '차단 해제';
                unblockBtn.style.cssText = `
                    background:#f44;color:#fff;border:none;padding:4px 8px;
                    border-radius:4px;cursor:pointer;font-size:12px;
                `;
                unblockBtn.addEventListener('click', async () => {
                    await removeUser(handle);
                    li.remove();
                    await updateAll();
                });
                rightBtnWrap.appendChild(unblockBtn);

                // 메모 삭제 및 차단 해제 버튼
                if (note && note.trim() !== '') {
                    const removeMemoUnblockBtn = document.createElement('button');
                    removeMemoUnblockBtn.textContent = '메모삭제+차단해제';
                    removeMemoUnblockBtn.style.cssText = `
                        background:#e91e63;color:#fff;border:none;padding:4px 8px;
                        border-radius:4px;cursor:pointer;font-size:12px;
                    `;
                    removeMemoUnblockBtn.addEventListener('click', async () => {
                        await removeUser(handle);
                        li.remove();
                        await updateAll();
                    });
                    rightBtnWrap.appendChild(removeMemoUnblockBtn);
                }

                btnWrap.appendChild(leftBtnWrap);
                btnWrap.appendChild(rightBtnWrap);
                li.appendChild(btnWrap);
                userList.appendChild(li);
            });
            modal.appendChild(userList);

          // 메모 유저 섹션 (차단되지 않은 유저)
        const memoOnlyUsers = blocked.filter(u => !u.block && u.note && u.note.trim() !== '');

        if (memoOnlyUsers.length > 0) {
            const memoTitle = document.createElement('div');
            memoTitle.textContent = '메모 유저 (차단 안됨)';
            memoTitle.style.cssText = 'font-weight:bold;margin-top:12px;margin-bottom:8px;font-size:15px;color:#4caf50;';
            modal.appendChild(memoTitle);

            const memoList = document.createElement('ul');
            memoList.style.cssText = 'list-style:none;padding:0;margin:0;';

            memoOnlyUsers.forEach(item => {
                const { handle, username, note } = item;
                const li = document.createElement('li');
                li.style.cssText = 'margin:8px 0;padding:8px;border-bottom:1px solid #444;';

                // 유저 정보
                const infoDiv = document.createElement('div');
                infoDiv.style.cssText = 'margin-bottom:4px;';
                const displayName = (username && username.length > 0)
                    ? `${username[0]}(${handle})`
                    : handle;
                infoDiv.innerHTML = `<strong>${displayName}</strong>`;
                li.appendChild(infoDiv);

                // 메모 표시 및 수정 영역
                const noteContainer = document.createElement('div');
                noteContainer.style.cssText = 'margin-bottom:6px;';

                const noteDiv = document.createElement('div');
                noteDiv.style.cssText = 'padding:4px 8px;background:#333;border-radius:4px;font-size:12px;color:#4caf50;cursor:pointer;position:relative;';
                noteDiv.textContent = `메모: ${note}`;

                const noteTextarea = document.createElement('textarea');
                noteTextarea.style.cssText = `
                    display:none;width:100%;padding:4px 8px;background:#444;border:1px solid #666;
                    border-radius:4px;font-size:12px;color:#4caf50;resize:vertical;min-height:60px;
                    font-family:inherit;
                `;
                noteTextarea.value = note || '';

                const noteBtnWrap = document.createElement('div');
                noteBtnWrap.style.cssText = 'display:none;gap:4px;margin-top:4px;';

                const saveNoteBtn = document.createElement('button');
                saveNoteBtn.textContent = '저장';
                saveNoteBtn.style.cssText = `
                    background:#4caf50;color:#fff;border:none;padding:3px 8px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;

                const cancelNoteBtn = document.createElement('button');
                cancelNoteBtn.textContent = '취소';
                cancelNoteBtn.style.cssText = `
                    background:#666;color:#fff;border:none;padding:3px 8px;
                    border-radius:3px;cursor:pointer;font-size:11px;
                `;

                noteBtnWrap.appendChild(saveNoteBtn);
                noteBtnWrap.appendChild(cancelNoteBtn);

                // 메모 클릭 시 편집 모드
                noteDiv.addEventListener('click', () => {
                    noteDiv.style.display = 'none';
                    noteTextarea.style.display = 'block';
                    noteBtnWrap.style.display = 'flex';
                    noteTextarea.focus();
                });

                // 저장 버튼
                saveNoteBtn.addEventListener('click', async () => {
                    const newNote = noteTextarea.value.trim();
                    const usernameForSave = (username && username.length > 0) ? username[0] : '';

                    await addNote(handle, usernameForSave, newNote, true);

                    if (newNote === '') {
                        // 메모가 비어있으면 리스트에서 제거
                        li.remove();
                        if (memoList.children.length === 0) {
                            memoTitle.remove();
                            memoList.remove();
                        }
                    } else {
                        noteDiv.textContent = `메모: ${newNote}`;
                        noteDiv.style.display = 'block';
                        noteTextarea.style.display = 'none';
                        noteBtnWrap.style.display = 'none';
                    }

                    await updateAll();
                });

                // 취소 버튼
                cancelNoteBtn.addEventListener('click', () => {
                    noteTextarea.value = note || '';
                    noteDiv.style.display = 'block';
                    noteTextarea.style.display = 'none';
                    noteBtnWrap.style.display = 'none';
                });

                noteContainer.appendChild(noteDiv);
                noteContainer.appendChild(noteTextarea);
                noteContainer.appendChild(noteBtnWrap);
                li.appendChild(noteContainer);

                // 버튼 영역
                const btnWrap = document.createElement('div');
                btnWrap.style.cssText = 'display:flex;justify-content:space-between;gap:4px;margin-top:6px;';

                // 왼쪽 버튼 그룹
                const leftBtnWrap = document.createElement('div');
                leftBtnWrap.style.cssText = 'display:flex;gap:4px;';

                // 사용자 페이지 방문 버튼
                const visitUserBtn = document.createElement('button');
                visitUserBtn.textContent = '페이지 방문';
                visitUserBtn.style.cssText = `
                    background:#2196f3;color:#fff;border:none;padding:4px 8px;
                    border-radius:4px;cursor:pointer;font-size:12px;
                `;
                visitUserBtn.addEventListener('click', () => {
                    window.open(`/u/${handle}`, '_blank');
                });
                leftBtnWrap.appendChild(visitUserBtn);

                // 오른쪽 버튼 그룹
                const rightBtnWrap = document.createElement('div');
                rightBtnWrap.style.cssText = 'display:flex;gap:4px;';

                // 메모 삭제 버튼
                const deleteNoteBtn = document.createElement('button');
                deleteNoteBtn.textContent = '메모 삭제';
                deleteNoteBtn.style.cssText = `
                    background:#f44;color:#fff;border:none;padding:4px 8px;
                    border-radius:4px;cursor:pointer;font-size:12px;
                `;
                deleteNoteBtn.addEventListener('click', async () => {
                    if (confirm('메모를 삭제하시겠습니까?')) {
                        await removeUser(handle);
                        li.remove();
                        if (memoList.children.length === 0) {
                            memoTitle.remove();
                            memoList.remove();
                        }
                        await updateAll();
                    }
                });
                rightBtnWrap.appendChild(deleteNoteBtn);

                btnWrap.appendChild(leftBtnWrap);
                btnWrap.appendChild(rightBtnWrap);
                li.appendChild(btnWrap);
                memoList.appendChild(li);
            });

            modal.appendChild(memoList);
        }
      }
        document.body.appendChild(modal);
    }

    async function showButton() {
        const excludedSubs = (await getExcludedSubs()).map(s => s.toLowerCase());

        const allHiddenTargets = [
        ...document.querySelectorAll('div.group\\/post-wrapper[style*="display: none"]'),
        ...document.querySelectorAll('div.grow.flex div.flex-col div.grid > div.contents[style*="display: none"]'),
        ...Array.from(document.querySelectorAll('div.grow.grid > div.relative[style*="display: none"]')).filter(el =>
            el.querySelector('.aspect-square')
        )
    ];

        // 제외된 서브와 일반 숨김 게시물 분리
        let excludedCount = 0;
        let normalHiddenCount = 0;

        allHiddenTargets.forEach(el => {
            let tabName = '';

            // 갤러리 뷰인지 확인
            const isGalleryView = el.classList.contains('relative') &&
                                  el.querySelector('a.group.text-zinc-900');

            if (isGalleryView) {
                const subSpan = el.querySelector('.shrink-0 > span');
                if (subSpan) {
                    const subText = subSpan.textContent.trim();
                    tabName = subText.replace(/\s*\|.*$/, '').trim().toLowerCase();
                }
            } else {
                const tabNameEl = el.querySelector('.col-span-2 > div');
                tabName = tabNameEl?.innerText.trim().toLowerCase() || '';
            }

            if (excludedSubs.includes(tabName)) {
                excludedCount++;
            } else {
                normalHiddenCount++;
            }
        });

        const table = document.querySelector('div.h-full.flex');
        if (!table) return;

        let oldRow = table.querySelector('.hidden-post-counter');
        if (oldRow) oldRow.remove();

        const newRow = document.createElement('div');
        newRow.classList.add('hidden-post-counter', 'ml-auto');

        const innerSpan1 = document.createElement('span');

        innerSpan1.textContent = `숨김처리 된 게시물: ${normalHiddenCount} / 제외처리 된 게시물: ${excludedCount}`;

        innerSpan1.classList.add('text-[13px]', 'text-center', 'pt-0.5', 'text-nowrap');
        newRow.appendChild(innerSpan1);

        // 현재 하이라이트된 요소 확인
        const currentHighlighted = document.querySelectorAll('[data-highlighted="true"]');

        newRow.style.cursor = 'pointer';
        newRow.style.opacity = '1';

        newRow.addEventListener('click', async () => {
            const highlighted = document.querySelectorAll('[data-highlighted="true"]');

            if (highlighted.length > 0) {
                // 하이라이트된 게시물을 다시 숨김
                highlighted.forEach(el => {
                    el.style.display = 'none';
                    delete el.dataset.highlighted;

                    // 갤러리 뷰인지 확인
                    const isGalleryView = el.classList.contains('relative') &&
                                          el.querySelector('a.group.text-zinc-900');

                    if (isGalleryView) {
                        // 갤러리 뷰: 링크 요소의 스타일 제거
                        const linkEl = el.querySelector('a.group');
                        if (linkEl) {
                            linkEl.style.border = '';
                            linkEl.style.backgroundColor = '';
                            linkEl.style.borderRadius = '';
                            linkEl.style.transition = '';
                        }
                    } else {
                        // 리스트 뷰: 기존 방식
                        el.style.backgroundColor = '';
                        el.style.transition = '';
                    }

                    // toggled 속성 복원
                    el.dataset.toggled = 'true';
                });
                isHidden = true;
            } else {
                // 일반 숨김 게시물만 표시
                const isDarkMode = document.documentElement.classList.contains('dark');
                const bgColor = isDarkMode ? '#4d4d4d' : '#b0b0b0';

                allHiddenTargets.forEach(el => {
                    let tabName = '';

                    // 갤러리 뷰인지 확인
                    const isGalleryView = el.classList.contains('relative') &&
                                          el.querySelector('a.group.text-zinc-900');

                    if (isGalleryView) {
                        const subSpan = el.querySelector('.shrink-0 > span');
                        if (subSpan) {
                            const subText = subSpan.textContent.trim();
                            tabName = subText.replace(/\s*\|.*$/, '').trim().toLowerCase();
                        }
                    } else {
                        const tabNameEl = el.querySelector('.col-span-2 > div');
                        tabName = tabNameEl?.innerText.trim().toLowerCase() || '';
                    }

                    if (excludedSubs.includes(tabName)) {
                        return; // 제외된 서브는 계속 숨김
                    }

                    el.style.display = '';
                    el.dataset.highlighted = 'true';

                    // 갤러리 뷰와 리스트 뷰에 따라 다른 하이라이트 스타일 적용
                    if (isGalleryView) {
                        // 갤러리 뷰: 링크 요소에 border와 배경색 적용
                        const linkEl = el.querySelector('a.group');
                        if (linkEl) {
                            linkEl.style.border = `3px solid ${bgColor}`;
                            linkEl.style.backgroundColor = isDarkMode ? 'rgba(77, 77, 77, 0.3)' : 'rgba(176, 176, 176, 0.3)';
                            linkEl.style.borderRadius = 'px';
                            linkEl.style.transition = 'all 0.3s ease';
                        }
                    } else {
                        // 리스트 뷰: 기존 방식
                        el.style.backgroundColor = bgColor;
                        el.style.transition = 'all 0.3s ease';
                    }
                });
                isHidden = false;
            }

            await showButton(); // 카운트 업데이트
        });

        // 문서 전체에 클릭 이벤트 추가 - 하이라이트 상태일 때 자동 숨김 뷰전환시 버그 해제용
        document.addEventListener('click', async (e) => {
            // 토글 버튼 자체 클릭은 제외
            if (e.target.closest('.hidden-post-counter')) return;

            // 하이라이트된 게시물이 있을 때만 작동
            const highlighted = document.querySelectorAll('[data-highlighted="true"]');
            if (highlighted.length > 0 && !isHidden) {
                // 토글 버튼 클릭과 동일한 로직
                highlighted.forEach(el => {
                    el.style.display = 'none';
                    delete el.dataset.highlighted;

                    const isGalleryView = el.classList.contains('relative') &&
                                          el.querySelector('a.group.text-zinc-900');

                    if (isGalleryView) {
                        const linkEl = el.querySelector('a.group');
                        if (linkEl) {
                            linkEl.style.border = '';
                            linkEl.style.backgroundColor = '';
                            linkEl.style.borderRadius = '';
                            linkEl.style.transition = '';
                        }
                    } else {
                        el.style.backgroundColor = '';
                        el.style.transition = '';
                    }

                    el.dataset.toggled = 'true';
                });
                isHidden = true;
                await showButton();
            }
        }, true);

        table.insertBefore(newRow, table.firstChild);
    }

    // ====== 라우터 제거 (페이지 새로고침) ======
    (function removeRouter() {
        history.pushState = function () { };
        history.replaceState = function () { };
        document.addEventListener('click', function (e) {
            // 우리가 추가한 메뉴 요소는 건드리지 않음
            if (e.target.closest('.kone-click-menu')) return;
            if (e.target.closest('.kone-floating-btn')) return;

            // #writer_link 클릭은 제외
            const writerLink = e.target.closest('#writer_link');
            if (writerLink && writerLink.dataset.clickBound) {
                return;
            }

            // 유저명 클릭은 제외
            const userSpan = e.target.closest(ARTICLE_SELECTOR);
            if (userSpan && userSpan.dataset.clickBound) {
                return;
            }

            // 모바일 유저명 클릭은 제외
            const mobileUser = e.target.closest('.overflow-hidden.text-center.text-nowrap.whitespace-nowrap.text-ellipsis');
            if (mobileUser && mobileUser.dataset.clickBound) {
                return;
            }

            // 서브명 클릭은 제외 (PC)
            const subDiv = e.target.closest('.col-span-2 > div');
            if (subDiv && subDiv.dataset.clickBound && location.pathname === '/s/all') {
                return;
            }

            // 모바일 서브명 클릭은 제외
            const mobileSub = e.target.closest('.shrink-0 > span');
            if (mobileSub && mobileSub.dataset.clickBound) {
                return;
            }

            const a = e.target.closest('a');
            if (a && a.href && a.target !== '_blank') {
                e.preventDefault();
                window.location.href = a.href;
            }
        }, true);
    })();

      async function unblockUser(handle) {
        const db = await openDB();
        handle = handle.toLowerCase();

        const user = await getUser(handle);
        if (!user) return;

        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            tx.objectStore(STORE_NAME).put({
                handle,
                block: false,
                username: user.username,
                note: user.note || "",
                type: user.type || 'user'
            });
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    // ====== 사용자 프로필 페이지 메모 표시 ======
    async function displayUserProfileNote() {
        // /u/{handle} 페이지인지 확인
        const pathMatch = location.pathname.match(/^\/u\/([^\/]+)/);
        if (!pathMatch) return;

        const handle = pathMatch[1].toLowerCase();

        // 프로필 헤더 찾기
        const profileHeader = document.querySelector('.mt-16.mb-4.p-4.flex.flex-col');
        if (!profileHeader) return;

        // 이미 메모 UI가 있으면 제거
        const existingMemoUI = profileHeader.querySelector('.profile-memo-ui');
        if (existingMemoUI) existingMemoUI.remove();

        // 사용자 정보 가져오기
        const user = await getUser(handle);
        const note = user?.note || '';
        const isBlocked = user?.block || false;

        // 메모 UI 컨테이너 생성
        const memoContainer = document.createElement('div');
        memoContainer.className = 'profile-memo-ui';
        memoContainer.style.cssText = `
            margin-top: 16px;
            padding: 12px;
            background: rgba(120, 120, 120, 0.1);
            border-radius: 8px;
            border: 1px solid rgba(120, 120, 120, 0.2);
        `;

        // 일렬 레이아웃 컨테이너
        const rowContainer = document.createElement('div');
        rowContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        `;

        // 메모 표시 영역
        const memoDisplay = document.createElement('div');
        memoDisplay.style.cssText = `
            flex: 1;
            min-width: 200px;
            padding: 8px 12px;
            background: rgba(100, 100, 100, 0.1);
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            color: #ffeb3b;
            min-height: 36px;
            display: flex;
            align-items: center;
        `;
        memoDisplay.textContent = note ? `📝 ${note}` : '📝 메모 없음 (클릭하여 추가)';

        // 메모 편집 영역
        const memoTextarea = document.createElement('textarea');
        memoTextarea.style.cssText = `
            display: none;
            flex: 1;
            min-width: 200px;
            padding: 8px;
            background: rgba(68, 68, 68, 0.8);
            border: 1px solid rgba(120, 120, 120, 0.5);
            border-radius: 4px;
            font-size: 14px;
            color: #ffeb3b;
            resize: vertical;
            min-height: 80px;
        `;
        memoTextarea.value = note;

        // 버튼 컨테이너
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 6px; flex-shrink: 0;';

        // 메모 저장/취소 버튼 (편집 모드에서만 표시)
        const editButtonWrap = document.createElement('div');
        editButtonWrap.style.cssText = 'display: none; gap: 6px;';

        const saveButton = document.createElement('button');
        saveButton.textContent = '💾 저장';
        saveButton.style.cssText = `
            background: #4caf50;
            color: #fff;
            border: none;
            padding: 8px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            height: 36px;
        `;

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '❌ 취소';
        cancelButton.style.cssText = `
            background: #666;
            color: #fff;
            border: none;
            padding: 8px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            height: 36px;
        `;

        editButtonWrap.appendChild(saveButton);
        editButtonWrap.appendChild(cancelButton);

        // 일반 모드 버튼들
        const normalButtonWrap = document.createElement('div');
        normalButtonWrap.style.cssText = 'display: flex; gap: 6px;';

        // 차단/차단해제 버튼
        const blockButton = document.createElement('button');
        blockButton.textContent = isBlocked ? '🔓 차단 해제' : '🚫 차단';
        blockButton.style.cssText = `
            background: ${isBlocked ? '#ff9800' : '#f44'};
            color: #fff;
            border: none;
            padding: 8px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            height: 36px;
        `;

        // 메모+차단 삭제 버튼 (차단된 상태이고 메모가 있을 때만)
        const deleteAllButton = document.createElement('button');
        if (isBlocked && note) {
            deleteAllButton.textContent = '🗑️ 메모+차단 해제';
            deleteAllButton.style.cssText = `
                background: #e91e63;
                color: #fff;
                border: none;
                padding: 8px 14px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                white-space: nowrap;
                height: 36px;
            `;
        }

        normalButtonWrap.appendChild(blockButton);
        if (isBlocked && note) {
            normalButtonWrap.appendChild(deleteAllButton);
        }

        buttonContainer.appendChild(editButtonWrap);
        buttonContainer.appendChild(normalButtonWrap);

        // 메모 클릭 시 편집 모드
        memoDisplay.addEventListener('click', () => {
            memoDisplay.style.display = 'none';
            memoTextarea.style.display = 'block';
            normalButtonWrap.style.display = 'none';
            editButtonWrap.style.display = 'flex';
            memoTextarea.focus();
        });

        // 저장 버튼
        saveButton.addEventListener('click', async () => {
            const newNote = memoTextarea.value.trim();
            const usernameEl = profileHeader.querySelector('h1');
            const username = usernameEl ? usernameEl.textContent.trim() : '';

            await addNote(handle, username, newNote, true);

            alert('메모가 저장되었습니다.');
            await displayUserProfileNote();
        });

        // 취소 버튼
        cancelButton.addEventListener('click', () => {
            memoTextarea.value = note;
            memoDisplay.style.display = 'flex';
            memoTextarea.style.display = 'none';
            normalButtonWrap.style.display = 'flex';
            editButtonWrap.style.display = 'none';
        });

        // 차단/차단해제 버튼
        blockButton.addEventListener('click', async () => {
            const usernameEl = profileHeader.querySelector('h1');
            const username = usernameEl ? usernameEl.textContent.trim() : '';

            if (isBlocked) {
                // 차단만 해제 (메모는 유지)
                if (confirm(`${username}(${handle}) 사용자의 차단을 해제하시겠습니까?\n(메모는 유지됩니다)`)) {
                    await unblockUser(handle);
                    alert('차단이 해제되었습니다.');
                    await displayUserProfileNote();
                }
            } else {
                // 차단
                const memo = prompt(
                    `${username}(${handle}) 사용자를 차단합니다.\n메모를 남기시겠습니까? (선택사항)`,
                    note
                );
                if (memo !== null) {
                    await addBlockUser(handle, username, 'user');
                    if (memo.trim() !== '') {
                        await addNote(handle, username, memo.trim(), true);
                    }
                    alert('차단되었습니다.');
                    await displayUserProfileNote();
                }
            }
        });

        // 메모+차단 삭제 버튼
        if (isBlocked && note) {
            deleteAllButton.addEventListener('click', async () => {
                const usernameEl = profileHeader.querySelector('h1');
                const username = usernameEl ? usernameEl.textContent.trim() : '';

                if (confirm(`${username}(${handle}) 사용자의 메모와 차단을 모두 해제하시겠습니까?`)) {
                    await removeUser(handle);
                    alert('메모와 차단이 모두 해제되었습니다.');
                    await displayUserProfileNote();
                }
            });
        }

        // 요소 조립
        rowContainer.appendChild(memoDisplay);
        rowContainer.appendChild(memoTextarea);
        rowContainer.appendChild(buttonContainer);
        memoContainer.appendChild(rowContainer);

        // 프로필 헤더에 추가
        profileHeader.appendChild(memoContainer);
    }

    // ====== 메인 업데이트 함수 ======
    async function updateAll() {
        window._koneBlockScriptRunning = true;
        loadData();
        if (isHidden) await hide();
        else await show();
        await displayNote();
        await displayUserProfileNote();
        setupClickMenus();
        showButton();
        createFloatingButton();
        await new Promise(res => setTimeout(res, 100));
        window._koneBlockScriptRunning = false;
    }

    window.updateAll = updateAll;

    // ====== 플로팅 버튼 생성 (모바일용) ======
    function createFloatingButton() {
        // 이미 존재하면 생성하지 않음
        if (document.querySelector('.kone-floating-btn')) return;

        const floatingBtn = document.createElement('div');
        floatingBtn.className = 'kone-floating-btn';
        floatingBtn.innerHTML = '⚙️';
        floatingBtn.style.cssText = `
            position:fixed;bottom:20px;right:20px;
            width:40px;height:40px;border-radius:50%;
            background:#555;color:#fff;
            display:flex;align-items:center;justify-content:center;
            font-size:20px;cursor:pointer;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            z-index:999998;transition:all 0.3s ease;
        `;

        floatingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const existingModal = document.getElementById('kone-manage-modal');
            if (existingModal) {
                existingModal.remove();
                isManageUIOpen = false;
            } else {
                showManageUI();
                isManageUIOpen = true;
            }
        });

        // 호버 효과
        floatingBtn.addEventListener('mouseenter', () => {
            floatingBtn.style.transform = 'scale(1.1)';
            floatingBtn.style.background = '#666';
        });
        floatingBtn.addEventListener('mouseleave', () => {
            floatingBtn.style.transform = 'scale(1)';
            floatingBtn.style.background = '#555';
        });

        document.body.appendChild(floatingBtn);
    }

    // ====== 키보드 단축키 (F2: 차단 관리, ESC: 차단 관리 닫기) ======
    let isManageUIOpen = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            const existingModal = document.getElementById('kone-manage-modal');
            if (existingModal) {
                existingModal.remove();
                isManageUIOpen = false;
            } else {
                showManageUI();
                isManageUIOpen = true;
            }
        }

        // ESC 키로 차단 관리 창 닫기
        if (e.key === 'Escape') {
            const existingModal = document.getElementById('kone-manage-modal');
            if (existingModal) {
                e.preventDefault();
                existingModal.remove();
                isManageUIOpen = false;
            }
        }
    });

    // ====== GM 메뉴 등록 ======
    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('메모 전체 목록 보기', async () => {
            const notes = (await getAllUser()).filter(u => u.note && u.note.trim() !== '');
            if (notes.length === 0) {
                alert('작성된 메모 없음');
                return;
            }
            alert(notes.map(n => `${n.note} - ${n.username}(${n.handle})`).join('\n'));
        });

        GM_registerMenuCommand('모든 메모 삭제', async () => {
            const confirm = window.confirm('모든 메모를 삭제하시겠습니까? (차단 정보는 유지됩니다)');
            if (!confirm) return;

            await removeAllNotes();
            alert('모든 메모가 삭제되었습니다.');
            await updateAll();
        });
    }

    // ====== 초기화 및 옵저버 ======
    (async () => {
        await loadTitleFilters();
        await updateAll();

        let updateDebounceTimer = null;
        const observer = new MutationObserver(async (mutations) => {
            // 스크립트 자체가 추가한 요소는 무시
            const onlyMenuChange = mutations.every(mutation =>
                Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes))
                    .every(node =>
                        node.nodeType === 1 &&
                        node.classList &&
                        (node.classList.contains('kone-click-menu') ||
                         node.classList.contains('note-span-wrapper') ||
                         node.classList.contains('my-inserted-block') ||
                         node.classList.contains('dlsite-link-appended') ||
                         node.id === 'kone-manage-modal')
                    )
            );
            if (onlyMenuChange) return;

            // 디바운스 적용
            if (updateDebounceTimer) clearTimeout(updateDebounceTimer);
            updateDebounceTimer = setTimeout(async () => {
                observer.disconnect();
                await updateAll();
                observer.observe(document.body, { childList: true, subtree: true });
            }, 400);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();

})();