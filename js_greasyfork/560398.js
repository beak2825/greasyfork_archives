// ==UserScript==
// @name         osu! gender tags
// @namespace    https://s.sbs93310.net/
// @version      1.0
// @description  Tampermonkey version of osu! gender tags
// @author       sbs93310
// @match        https://osu.ppy.sh/users/*
// @match        https://osu.ppy.sh/rankings/*
// @match        https://osu.ppy.sh/beatmapsets/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      s.sbs93310.net
// @connect      osu.ppy.sh
// @downloadURL https://update.greasyfork.org/scripts/560398/osu%21%20gender%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/560398/osu%21%20gender%20tags.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GENDER_API = 'https://s.sbs93310.net/gender.php';

    // Embedded SVGs (inlined)
    const ICON_SVGS = {
        male: `<svg width="90" height="60" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">\n  <rect y="0" width="90" height="20" fill="#1E3A8A"/>\n  <rect y="20" width="90" height="20" fill="#3B82F6"/>\n  <rect y="40" width="90" height="20" fill="#1E3A8A"/>\n</svg>`,
        female: `<svg width="90" height="60" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">\n  <rect y="0" width="90" height="20" fill="#EC4899"/>\n  <rect y="20" width="90" height="20" fill="#F9A8D4"/>\n  <rect y="40" width="90" height="20" fill="#EC4899"/>\n</svg>`,
        nonbinary: `<svg width="90" height="60" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">\n  <rect y="0"  width="90" height="15" fill="#FACC15"/>\n  <rect y="15" width="90" height="15" fill="#FFFFFF"/>\n  <rect y="30" width="90" height="15" fill="#7C3AED"/>\n  <rect y="45" width="90" height="15" fill="#000000"/>\n</svg>`,
        other: `<svg width="90" height="60" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">\n  <rect width="90" height="60" fill="#000000"/>\n</svg>`,
        unknown: `<svg width="90" height="60" viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">\n  <rect y="0" width="90" height="30" fill="#D1D5DB"/>\n  <rect y="30" width="90" height="30" fill="#9CA3AF"/>\n</svg>`
    };

    // Переводы названий гендеров (все языки из оригинального расширения)
    const genderTranslations = {
        en: { male: 'Male', female: 'Female', nonbinary: 'Non-binary', other: 'Other', unknown: 'Unknown' },
        ru: { male: 'Мужчина', female: 'Женщина', nonbinary: 'Небинарный', other: 'Другой', unknown: 'Неизвестно' },
        be: { male: 'Мужчына', female: 'Жанчына', nonbinary: 'Небінарны', other: 'Іншы', unknown: 'Невядома' },
        ca: { male: 'Home', female: 'Dona', nonbinary: 'No binari', other: 'Altre', unknown: 'Desconegut' },
        da: { male: 'Mand', female: 'Kvinde', nonbinary: 'Ikke-binær', other: 'Andet', unknown: 'Ukendt' },
        el: { male: 'Άνδρας', female: 'Γυναίκα', nonbinary: 'Μη-δυαδικό', other: 'Άλλο', unknown: 'Άγνωστο' },
        fi: { male: 'Mies', female: 'Nainen', nonbinary: 'Ei-binäärinen', other: 'Muu', unknown: 'Tuntematon' },
        fr: { male: 'Masculin', female: 'Féminin', nonbinary: 'Non-binaire', other: 'Autre', unknown: 'Inconnu' },
        hu: { male: 'Férfi', female: 'Nő', nonbinary: 'Nem bináris', other: 'Egyéb', unknown: 'Ismeretlen' },
        it: { male: 'Uomo', female: 'Donna', nonbinary: 'Non-binario', other: 'Altro', unknown: 'Sconosciuto' },
        ko: { male: '남성', female: '여성', nonbinary: '논바이너리', other: '기타', unknown: '알 수 없음' },
        nl: { male: 'Man', female: 'Vrouw', nonbinary: 'Non-binair', other: 'Anders', unknown: 'Onbekend' },
        pl: { male: 'Mężczyzna', female: 'Kobieta', nonbinary: 'Niebinarny', other: 'Inny', unknown: 'Nieznany' },
        'pt-BR': { male: 'Homem', female: 'Mulher', nonbinary: 'Não-binário', other: 'Outro', unknown: 'Desconhecido' },
        pt: { male: 'Homem', female: 'Mulher', nonbinary: 'Não-binário', other: 'Outro', unknown: 'Desconhecido' },
        sl: { male: 'Moški', female: 'Ženska', nonbinary: 'Nebinaren', other: 'Drugo', unknown: 'Neznano' },
        sv: { male: 'Man', female: 'Kvinna', nonbinary: 'Icke-binär', other: 'Annat', unknown: 'Okänt' },
        tr: { male: 'Erkek', female: 'Kadın', nonbinary: 'İkili olmayan', other: 'Diğer', unknown: 'Bilinmiyor' },
        vi: { male: 'Nam', female: 'Nữ', nonbinary: 'Phi nhị phân', other: 'Khác', unknown: 'Không xác định' },
        'zh-TW': { male: '男性', female: '女性', nonbinary: '非二元', other: '其他', unknown: '未知' },
        zh: { male: '男性', female: '女性', nonbinary: '非二元', other: '其他', unknown: '未知' },
        ar: { male: 'ذكر', female: 'أنثى', nonbinary: 'غير ثنائي', other: 'آخر', unknown: 'غير معروف' },
        bg: { male: 'Мъж', female: 'Жена', nonbinary: 'Небинарно', other: 'Друго', unknown: 'Неизвестно' },
        cs: { male: 'Muž', female: 'Žena', nonbinary: 'Nebinární', other: 'Jiný', unknown: 'Neznámý' },
        de: { male: 'Männlich', female: 'Weiblich', nonbinary: 'Nicht-binär', other: 'Andere', unknown: 'Unbekannt' },
        es: { male: 'Hombre', female: 'Mujer', nonbinary: 'No binario', other: 'Otro', unknown: 'Desconocido' },
        fil: { male: 'Lalaki', female: 'Babae', nonbinary: 'Hindi binaryo', other: 'Iba', unknown: 'Hindi alam' },
        he: { male: 'זכר', female: 'נקבה', nonbinary: 'לא בינארי', other: 'אחר', unknown: 'לא ידוע' },
        id: { male: 'Laki-laki', female: 'Perempuan', nonbinary: 'Non-biner', other: 'Lainnya', unknown: 'Tidak diketahui' },
        ja: { male: '男性', female: '女性', nonbinary: 'ノンバイナリー', other: 'その他', unknown: '不明' },
        lt: { male: 'Vyras', female: 'Moteris', nonbinary: 'Nebinarinis', other: 'Kitas', unknown: 'Nežinomas' },
        no: { male: 'Mann', female: 'Kvinne', nonbinary: 'Ikke-binær', other: 'Annet', unknown: 'Ukjent' },
        ro: { male: 'Bărbat', female: 'Femeie', nonbinary: 'Non-binar', other: 'Altul', unknown: 'Necunoscut' },
        sk: { male: 'Muž', female: 'Žena', nonbinary: 'Nebinárny', other: 'Iný', unknown: 'Neznámy' },
        sr: { male: 'Мушкарац', female: 'Жена', nonbinary: 'Небинарни', other: 'Друго', unknown: 'Непознато' },
        th: { male: 'ชาย', female: 'หญิง', nonbinary: 'ไม่ใช่ไบนารี', other: 'อื่นๆ', unknown: 'ไม่ทราบ' },
        uk: { male: 'Чоловік', female: 'Жінка', nonbinary: 'Небінарний', other: 'Інший', unknown: 'Невідомо' }
    };

    function getSiteLanguage() {
        const htmlLang = document.documentElement.lang || document.documentElement.getAttribute('lang');
        if (htmlLang) {
            const langLower = htmlLang.toLowerCase();
            if (genderTranslations[langLower]) return langLower;
            const base = langLower.split('-')[0];
            if (genderTranslations[base]) return base;
        }
        const urlMatch = window.location.pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
        if (urlMatch) {
            const langFromUrl = urlMatch[1].toLowerCase();
            if (genderTranslations[langFromUrl]) return langFromUrl;
            const base = langFromUrl.split('-')[0];
            if (genderTranslations[base]) return base;
        }
        return 'en';
    }

    function getGenderLabel(gender, lang = null) {
        if (!lang) lang = getSiteLanguage();
        const translations = genderTranslations[lang] || genderTranslations['en'];
        return translations[gender] || gender;
    }

    function getGenderDisplayMap() {
        const lang = getSiteLanguage();
        return {
            male: { iconSvg: ICON_SVGS.male, label: getGenderLabel('male', lang) },
            female: { iconSvg: ICON_SVGS.female, label: getGenderLabel('female', lang) },
            nonbinary: { iconSvg: ICON_SVGS.nonbinary, label: getGenderLabel('nonbinary', lang) },
            other: { iconSvg: ICON_SVGS.other, label: getGenderLabel('other', lang) },
            unknown: { iconSvg: ICON_SVGS.unknown, label: getGenderLabel('unknown', lang) }
        };
    }

    function createSVGIconFromString(svgString, width = 28) {
        if (!svgString) return null;
        const img = document.createElement('img');
        const height = Math.round(width * 2 / 3);
        img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
        img.style.cssText = `width: ${width}px; height: ${height}px; vertical-align: middle; display: inline-block; object-fit: contain; border-radius: 4px; margin-right: 8px;`;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        return img;
    }

    // Cache and processing sets
    let processedElements = new WeakSet();
    const processingUsers = new Set();
    const genderCache = new Map();
    let genderDisplayMap = getGenderDisplayMap();

    // Wrapper for GM_xmlhttpRequest to fetch JSON (no CORS issues)
    function gmFetchJson(url, timeout = 10000) {
        return new Promise((resolve, reject) => {
            let timedOut = false;
            const timer = setTimeout(() => {
                timedOut = true;
                reject(new Error('timeout'));
            }, timeout);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: { 'Accept': 'application/json' },
                onload: function(res) {
                    if (timedOut) return;
                    clearTimeout(timer);
                    resolve(res);
                },
                onerror: function(err) {
                    if (timedOut) return;
                    clearTimeout(timer);
                    reject(new Error('network error'));
                },
                ontimeout: function() {
                    if (timedOut) return;
                    clearTimeout(timer);
                    reject(new Error('timeout'));
                }
            });
        });
    }

    async function fetchGenderData(userId) {
        if (!userId) return { gender: 'unknown' };
        userId = String(userId).trim();
        const userIdNum = parseInt(userId, 10);
        if (isNaN(userIdNum) || userIdNum <= 0) return { gender: 'unknown' };
        userId = String(userIdNum);

        if (genderCache.has(userId)) return genderCache.get(userId);
        if (processingUsers.has(userId)) {
            let attempts = 0;
            while (processingUsers.has(userId) && attempts < 50) {
                await new Promise(r => setTimeout(r, 100));
                attempts++;
            }
            if (genderCache.has(userId)) return genderCache.get(userId);
        }

        processingUsers.add(userId);
        try {
            const url = `${GENDER_API}?user_id=${encodeURIComponent(userId)}`;
            const res = await gmFetchJson(url, 10000);
            if (!res || typeof res.status === 'undefined') throw new Error('no response');
            if (res.status < 200 || res.status >= 300) throw new Error(`HTTP ${res.status}`);
            const rawText = res.responseText;
            if (!rawText || rawText.trim() === '') throw new Error('empty response');
            let data = JSON.parse(rawText);
            if (!data || typeof data !== 'object') throw new Error('invalid data');
            if (data.hasOwnProperty('error')) throw new Error(`API error: ${data.error}`);
            if (!data.hasOwnProperty('gender')) data.gender = 'unknown';
            const validGenders = ['male','female','nonbinary','other','unknown'];
            if (!validGenders.includes(data.gender)) data.gender = 'unknown';
            genderCache.set(userId, data);
            return data;
        } catch (e) {
            const fallback = { gender: 'unknown' };
            genderCache.set(userId, fallback);
            return fallback;
        } finally {
            processingUsers.delete(userId);
        }
    }

    async function injectGenderIconById(userId, targetElement, insertBefore = false, iconSize = 28) {
        if (!userId || !targetElement) return;
        if (processedElements.has(targetElement)) return;
        if (targetElement.querySelector('.osu-gender-icon-inline')) { processedElements.add(targetElement); return; }
        if (!document.contains(targetElement)) return;

        const data = await fetchGenderData(userId);
        let gender = data.gender || 'unknown';
        if (!genderDisplayMap.hasOwnProperty(gender)) gender = 'unknown';
        if (!document.contains(targetElement) || targetElement.querySelector('.osu-gender-icon-inline')) { processedElements.add(targetElement); return; }

        genderDisplayMap = getGenderDisplayMap();
        const displayInfo = genderDisplayMap[gender];

        const genderElement = document.createElement('span');
        genderElement.className = 'osu-gender-icon-inline';
        genderElement.setAttribute('data-user-id', userId);
        const marginRight = iconSize <= 20 ? '8px' : '16px';
        genderElement.style.cssText = `margin-right: ${marginRight}; display: inline-flex; align-items: center; vertical-align: middle;`;

        const iconImg = createSVGIconFromString(displayInfo.iconSvg, iconSize);
        if (iconImg) genderElement.appendChild(iconImg);

        try {
            if (insertBefore && targetElement.firstChild) targetElement.insertBefore(genderElement, targetElement.firstChild);
            else targetElement.appendChild(genderElement);
            processedElements.add(targetElement);
        } catch (e) {}
    }

    function injectGenderIconByName(userNameElement, insertBefore = true, iconSize = 28) {
        if (!userNameElement || !document.contains(userNameElement)) return;
        if (processedElements.has(userNameElement)) return;
        if (userNameElement.querySelector('.osu-gender-icon-inline')) { processedElements.add(userNameElement); return; }

        let userId = userNameElement.getAttribute('data-user-id');
        if (!userId) {
            const href = userNameElement.getAttribute('href');
            if (href) {
                const match = href.match(/\/users\/(\d+)/);
                if (match) userId = match[1];
            }
        }
        if (userId) {
            injectGenderIconById(userId, userNameElement, insertBefore, iconSize);
        }
    }

    function getCurrentUserId() {
        const url = window.location.href;
        const match = url.match(/\/users\/(\d+)/);
        if (match) return match[1];
        return null;
    }

    async function processNewElements() {
        if (document.readyState === 'loading') return;

        const flagsContainer = document.querySelector('.profile-info__flags');
        if (flagsContainer) {
            const currentUserId = getCurrentUserId();
            if (currentUserId) {
                const existingElement = document.querySelector('#osu-gender-element-' + currentUserId);
                if (!existingElement) {
                    const genderElement = document.createElement('span');
                    genderElement.id = 'osu-gender-element-' + currentUserId;
                    genderElement.style.cssText = `display: inline-flex !important; align-items: center !important; margin-left: 8px !important; font-size: 14px !important; color: #fff !important; vertical-align: middle !important;`;
                    const data = await fetchGenderData(currentUserId);
                    let gender = data.gender || 'unknown';
                    if (!genderDisplayMap.hasOwnProperty(gender)) gender = 'unknown';
                    genderDisplayMap = getGenderDisplayMap();
                    const displayInfo = genderDisplayMap[gender];
                    const iconImg = createSVGIconFromString(displayInfo.iconSvg, 32);
                    if (iconImg) genderElement.appendChild(iconImg);
                    const labelText = document.createTextNode(' ' + displayInfo.label);
                    genderElement.appendChild(labelText);
                    if (document.contains(flagsContainer)) flagsContainer.appendChild(genderElement);
                }
            }
        }

        const scoreSelectors = ['.beatmap-scoreboard-table__body-row a.js-usercard[data-user-id]','.beatmap-scoreboard-table__body-row a[data-user-id]','.beatmap-scoreboard-table__body-row a[href*="/users/"]','table.beatmap-scoreboard-table a[data-user-id]','table.beatmap-scoreboard-table a[href*="/users/"]'];
        scoreSelectors.forEach(selector => {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                if (document.contains(link) && !link.querySelector('.osu-gender-icon-inline')) {
                    injectGenderIconByName(link, true, 20);
                }
            });
        });

        const rankingSelectors = ['.ranking-page-table-main__link[data-user-id]','.ranking-page-table-main__link[href^="/users/"]','.ranking-page-table__row a[data-user-id]','.ranking-page-table__row a[href*="/users/"]','table.ranking-page-table a[data-user-id]','table.ranking-page-table a[href*="/users/"]'];
        rankingSelectors.forEach(selector => {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                if (document.contains(link) && !link.querySelector('.osu-gender-icon-inline')) {
                    injectGenderIconByName(link, true);
                }
            });
        });

        const isFriendsPage = window.location.href.includes('/home/friends');
        if (isFriendsPage) {
            const friendsSelectors = ['.friends-list a[href*="/users/"]','.friends-list a.js-usercard[data-user-id]','.friends-list a[data-user-id]','[class*="friend"] a[href*="/users/"]','[class*="friend"] a.js-usercard[data-user-id]','[class*="friend"] a[data-user-id]','.user-card a[href*="/users/"]','.user-card a.js-usercard[data-user-id]','.user-card a[data-user-id]'];
            friendsSelectors.forEach(selector => {
                const links = document.querySelectorAll(selector);
                links.forEach(link => {
                    if (document.contains(link) && !link.querySelector('.osu-gender-icon-inline')) {
                        injectGenderIconByName(link, true);
                    }
                });
            });
            const friendsContainer = document.querySelector('[class*="friends"], [class*="home"], main, .content');
            if (friendsContainer) {
                const allFriendsLinks = friendsContainer.querySelectorAll('a[href*="/users/"]:not(.osu-gender-icon-inline)');
                allFriendsLinks.forEach(link => {
                    if (document.contains(link) && !link.querySelector('.osu-gender-icon-inline') && link.getAttribute('href').match(/\/users\/\d+/)) {
                        const isInNavigation = link.closest('nav, header, footer, .nav, .header, .footer, .sidebar, .menu');
                        if (!isInNavigation) injectGenderIconByName(link, true);
                    }
                });
            }
        }

        const otherUserLinks = document.querySelectorAll('a.js-usercard[data-user-id]:not(.osu-gender-icon-inline)');
        otherUserLinks.forEach(link => {
            if (!document.contains(link) || link.querySelector('.osu-gender-icon-inline')) return;
            if (isFriendsPage && link.closest('[class*="friends"], [class*="home"], main, .content')) return;
            const parent = link.closest('table, .list, .ranking, .scoreboard, .leaderboard, [class*="table"], [class*="list"], [class*="ranking"]');
            const isInNavigation = link.closest('nav, header, footer, .nav, .header, .footer, .sidebar, .menu');
            if (parent && !isInNavigation) injectGenderIconByName(link, true);
        });
    }

    let processTimeout = null;
    function debouncedProcessNewElements(delay = 300) {
        if (processTimeout) clearTimeout(processTimeout);
        processTimeout = setTimeout(() => { processNewElements(); }, delay);
    }

    function init() {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(() => processNewElements(), 500));
        else setTimeout(() => processNewElements(), 500);
        setTimeout(() => processNewElements(), 2000);
        setTimeout(() => processNewElements(), 5000);
        setInterval(() => processNewElements(), 10000);
    }

    const observer = new MutationObserver(function(mutations) {
        let shouldProcessElements = false;
        let immediateElements = [];
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.querySelector) {
                            const hasUserContent = node.querySelector('.beatmap-scoreboard-table__body-row') || node.querySelector('.ranking-page-table__row') || node.querySelector('a.js-usercard[data-user-id]') || node.querySelector('a[data-user-id]') || node.querySelector('a[href*="/users/"]') || node.querySelector('.profile-info__flags') || node.querySelector('table.beatmap-scoreboard-table') || node.querySelector('table.ranking-page-table') || node.querySelector('[class*="friends"]') || node.querySelector('[class*="friend"]');
                            if (hasUserContent) shouldProcessElements = true;
                        }
                        if (node.classList) {
                            const isUserRelated = node.classList.contains('beatmap-scoreboard-table__body-row') || node.classList.contains('ranking-page-table__row') || node.classList.contains('profile-info__flags') || node.classList.contains('beatmap-scoreboard-table') || node.classList.contains('ranking-page-table') || node.classList.contains('friends-list') || (node.className && (node.className.includes('friend') || node.className.includes('friends')));
                            if (isUserRelated) shouldProcessElements = true;
                        }
                        if (node.tagName && node.tagName.toLowerCase() === 'a') {
                            const hasUserId = node.getAttribute('data-user-id');
                            const hasUserHref = node.getAttribute('href') && node.getAttribute('href').match(/\/users\/\d+/);
                            if ((node.classList.contains('js-usercard') && hasUserId) || hasUserHref) {
                                const isInTable = node.closest('table, .beatmap-scoreboard-table, .ranking-page-table, [class*="table"], [class*="list"], [class*="ranking"]');
                                const isInFriends = window.location.href.includes('/home/friends') && node.closest('[class*="friends"], [class*="home"], main, .content');
                                const isInNavigation = node.closest('nav, header, footer, .nav, .header, .footer, .sidebar, .menu');
                                if (isInTable && !isInNavigation) immediateElements.push(node);
                            }
                        }
                    }
                });
            }
        });
        if (immediateElements.length > 0) immediateElements.forEach(element => setTimeout(() => injectGenderIconByName(element, true), 100));
        if (shouldProcessElements) debouncedProcessNewElements(500);
    });

    init();
    setTimeout(() => { if (document.body) observer.observe(document.body, { childList: true, subtree: true }); }, 1000);

    let lastUrl = location.href;
    function checkUrlChange() { const url = location.href; if (url !== lastUrl) { lastUrl = url; processedElements = new WeakSet(); genderCache.clear(); processingUsers.clear(); setTimeout(() => processNewElements(), 1000); } }
    const urlCheckInterval = setInterval(checkUrlChange, 500);
    window.addEventListener('popstate', () => { processedElements = new WeakSet(); genderCache.clear(); processingUsers.clear(); lastUrl = location.href; setTimeout(() => processNewElements(), 500); });
    const originalPushState = history.pushState; const originalReplaceState = history.replaceState;
    history.pushState = function() { originalPushState.apply(history, arguments); setTimeout(checkUrlChange, 100); };
    history.replaceState = function() { originalReplaceState.apply(history, arguments); setTimeout(checkUrlChange, 100); };

    // Debug utilities
    window.osuGenderDisplay = Object.assign(window.osuGenderDisplay || {}, {
        refresh: function() { processedElements = new WeakSet(); processNewElements(); },
        clearCache: function() { genderCache.clear(); processedElements = new WeakSet(); processingUsers.clear(); },
        reload: function() { genderCache.clear(); processedElements = new WeakSet(); processingUsers.clear(); setTimeout(() => processNewElements(), 500); },
        getGender: async function(userId) { const data = await fetchGenderData(userId); console.log('Gender data:', data); return data; },
        testAPI: async function(userId = null) { const testUserId = userId || '12345678'; try { const start = Date.now(); const data = await fetchGenderData(testUserId); console.log('Test API', Date.now()-start, data); return { success: true, data }; } catch (e) { console.error(e); return { success: false, error: e.message }; } }
    });

})();
