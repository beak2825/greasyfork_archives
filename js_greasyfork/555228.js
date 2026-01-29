// ==UserScript==
// @name         YouTube Full Dates (v4)
// @namespace    YouTube Full Dates
// @version      4
// @description  Replace "1 year ago" with exact dates. Full day/month names, multi-language support, works on ALL YouTube pages including Grid Subscriptions, Watch History, Channel tabs, and more!
// @author       Solomon (improved from InMirrors)
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/814d40a6/img/favicon_144x144.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555228/YouTube%20Full%20Dates%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555228/YouTube%20Full%20Dates%20%28v4%29.meta.js
// ==/UserScript==

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 CHANGELOG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Previous Features (Preserved from v3):
 * ✅ Replace relative dates with exact dates
 * ✅ Works on all YouTube pages (home, search, channels, playlists, sidebar)
 * ✅ Custom date format templates
 * ✅ Show both dates option (e.g., "3 hours ago · 2024-11-08")
 * ✅ API response caching for performance
 * ✅ Settings panel with live preview
 * ✅ Debug mode for troubleshooting
 * ✅ Full day names: wwww token (Monday, Tuesday, etc.)
 * ✅ Full month names: MMMM token (January, February, etc.)
 * ✅ Multi-language support: English, French, Spanish, German, Italian, Portuguese, etc.
 * ✅ Language selector in settings panel
 *
 * 🆕 NEW in v4 (Bug Fixes from User Feedback):
 * ✨ FIX: Subscriptions "Grid View" page now works (/feed/subscriptions)
 * ✨ FIX: Watch History page now works (/feed/history)
 * ✨ FIX: Channel Streams tab now works (/@channel/streams)
 * ✨ FIX: Channel Shorts tab now works (/@channel/shorts)
 * ✨ FIX: Channel Posts tab now works (/@channel/community)
 * ✨ FIX: Channel Search now works (/@channel/search)
 * ✨ FIX: Long dates now wrap properly instead of being cut off
 * ✨ NEW: Added CSS for proper text wrapping on 5-row display
 * ✨ NEW: Improved selector coverage for all YouTube page types
 * ✨ NEW: Better handling of dynamically loaded content
 * ✨ NEW: Universal date element detection (catches edge cases)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌍 LANGUAGE DEFINITIONS
    // ═══════════════════════════════════════════════════════════════════════════

    const LANGUAGES = {
        en: {
            name: 'English',
            monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            agoKeywords: ['ago'],
            dateKeywords: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
        },
        fr: {
            name: 'Français',
            monthsShort: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
            monthsFull: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
            daysShort: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
            daysFull: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
            agoKeywords: ['il y a'],
            dateKeywords: ['seconde', 'minute', 'heure', 'jour', 'semaine', 'mois', 'an', 'année']
        },
        es: {
            name: 'Español',
            monthsShort: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
            monthsFull: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
            daysShort: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
            daysFull: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            agoKeywords: ['hace'],
            dateKeywords: ['segundo', 'minuto', 'hora', 'día', 'semana', 'mes', 'año']
        },
        de: {
            name: 'Deutsch',
            monthsShort: ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
            monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            daysShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
            daysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            agoKeywords: ['vor'],
            dateKeywords: ['Sekunde', 'Minute', 'Stunde', 'Tag', 'Woche', 'Monat', 'Jahr']
        },
        it: {
            name: 'Italiano',
            monthsShort: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
            monthsFull: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
            daysShort: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
            daysFull: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
            agoKeywords: ['fa'],
            dateKeywords: ['secondo', 'minuto', 'ora', 'giorno', 'settimana', 'mese', 'anno']
        },
        pt: {
            name: 'Português',
            monthsShort: ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'],
            monthsFull: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
            daysShort: ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'],
            daysFull: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
            agoKeywords: ['há'],
            dateKeywords: ['segundo', 'minuto', 'hora', 'dia', 'semana', 'mês', 'ano']
        },
        zh: {
            name: '中文',
            monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            daysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            daysFull: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            agoKeywords: ['前'],
            dateKeywords: ['秒', '分', '时', '時', '天', '日', '周', '週', '月', '年']
        },
        ja: {
            name: '日本語',
            monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            daysShort: ['日', '月', '火', '水', '木', '金', '土'],
            daysFull: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
            agoKeywords: ['前'],
            dateKeywords: ['秒', '分', '時間', '日', '週間', 'か月', '年']
        },
        ru: {
            name: 'Русский',
            monthsShort: ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
            monthsFull: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
            daysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
            daysFull: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
            agoKeywords: ['назад'],
            dateKeywords: ['секунд', 'минут', 'час', 'день', 'дней', 'недел', 'месяц', 'год', 'лет']
        },
        ko: {
            name: '한국어',
            monthsShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            monthsFull: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
            daysShort: ['일', '월', '화', '수', '목', '금', '토'],
            daysFull: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            agoKeywords: ['전'],
            dateKeywords: ['초', '분', '시간', '일', '주', '개월', '년']
        },
        ar: {
            name: 'العربية',
            monthsShort: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            monthsFull: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            daysShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
            daysFull: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
            agoKeywords: ['قبل', 'منذ'],
            dateKeywords: ['ثانية', 'دقيقة', 'ساعة', 'يوم', 'أسبوع', 'شهر', 'سنة']
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    const DEFAULT_CONFIG = {
        dateFormat: 'yyyy-MM-dd',
        language: 'en',
        prependDates: false,
        showBothDates: true,
        debugMode: false,
        oldUploadKeywords: ['day', 'week', 'month', 'year', '天', '日', '周', '週', '月', '年', 'jour', 'semaine', 'mois', 'an']
    };

    // Merge saved settings with defaults
    const SETTINGS = { ...DEFAULT_CONFIG, ...GM_getValue('settings', {}) };

    // Get current language config
    const getLang = () => LANGUAGES[SETTINGS.language] || LANGUAGES.en;

    // Processing marker (zero-width space)
    const PROCESSED = '\u200B';

    // Cache for API responses
    const dateCache = new Map();

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE
    // ═══════════════════════════════════════════════════════════════════════════

    let isProcessing = false;
    let pendingRequests = 0;
    const MAX_CONCURRENT = 5;
    const requestQueue = [];

    // ═══════════════════════════════════════════════════════════════════════════
    // 🛠️ UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    const log = (...args) => SETTINGS.debugMode && console.log('📅 [YT Dates v4]', ...args);

    /**
     * Format date with custom template
     * Tokens:
     * - yyyy: Full year (2024)
     * - yy: Short year (24)
     * - MMMM: Full month name (November)
     * - MMM: Short month name (Nov)
     * - MM: Month number padded (11)
     * - wwww: Full day name (Monday)
     * - ww: Short day name (Mon)
     * - dd: Day padded (08)
     * - HH: 24-hour padded (14)
     * - hh: 12-hour padded (02)
     * - mm: Minutes padded (30)
     * - ss: Seconds padded (45)
     * - ap: AM/PM
     */
    function formatDate(date, template = SETTINGS.dateFormat, langCode = SETTINGS.language) {
        const d = new Date(date);
        if (isNaN(d.getTime())) return '';

        const lang = LANGUAGES[langCode] || LANGUAGES.en;
        const pad = (n, len = 2) => String(n).padStart(len, '0');

        const tokens = {
            yyyy: d.getFullYear(),
            yy: String(d.getFullYear()).slice(-2),
            MMMM: lang.monthsFull[d.getMonth()],
            MMM: lang.monthsShort[d.getMonth()],
            MM: pad(d.getMonth() + 1),
            wwww: lang.daysFull[d.getDay()],
            ww: lang.daysShort[d.getDay()],
            dd: pad(d.getDate()),
            HH: pad(d.getHours()),
            hh: pad(d.getHours() % 12 || 12),
            mm: pad(d.getMinutes()),
            ss: pad(d.getSeconds()),
            ap: d.getHours() < 12 ? 'AM' : 'PM'
        };

        // Process tokens from longest to shortest to avoid partial replacements
        return template.replace(/yyyy|yy|MMMM|MMM|MM|wwww|ww|dd|HH|hh|mm|ss|ap/g, match => tokens[match]);
    }

    /**
     * Extract video ID from URL
     */
    function getVideoId(url) {
        if (!url) return null;

        // Handle shorts
        let match = url.match(/\/shorts\/([^/?&]+)/);
        if (match) return match[1];

        // Handle watch URLs
        match = url.match(/[?&]v=([^&]+)/);
        if (match) return match[1];

        // Handle embed URLs
        match = url.match(/\/embed\/([^/?&]+)/);
        if (match) return match[1];

        return null;
    }

    /**
     * Check if element contains relative date text
     * Uses all supported languages for better detection
     */
    function hasRelativeDate(text) {
        if (!text) return false;

        // Check all supported languages for better detection
        const allAgoKeywords = Object.values(LANGUAGES).flatMap(l => l.agoKeywords);
        const allDateKeywords = Object.values(LANGUAGES).flatMap(l => l.dateKeywords);

        const textLower = text.toLowerCase();
        const hasAgo = allAgoKeywords.some(kw => textLower.includes(kw.toLowerCase()));
        const hasDate = allDateKeywords.some(kw => textLower.includes(kw.toLowerCase()));

        return hasAgo && hasDate;
    }

    /**
     * Check if upload is "old" (should show only formatted date)
     */
    function isOldUpload(text) {
        return SETTINGS.oldUploadKeywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()));
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌐 API FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Fetch upload date from YouTube API with caching
     */
    async function fetchUploadDate(videoId) {
        // Check cache first
        if (dateCache.has(videoId)) {
            return dateCache.get(videoId);
        }

        const body = {
            context: {
                client: {
                    clientName: 'WEB',
                    clientVersion: '2.20240416.01.00'
                }
            },
            videoId
        };

        try {
            const response = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Network error');

            const data = await response.json();
            const info = data?.microformat?.playerMicroformatRenderer;

            let uploadDate = null;

            if (info?.liveBroadcastDetails?.isLiveNow) {
                uploadDate = info.liveBroadcastDetails.startTimestamp;
            } else {
                uploadDate = info?.publishDate || info?.uploadDate;
            }

            // Cache the result
            if (uploadDate) {
                dateCache.set(videoId, uploadDate);
            }

            return uploadDate;
        } catch (error) {
            log('❌ Fetch error:', error);
            return null;
        }
    }

    /**
     * Get upload date from page metadata (for current video page)
     */
    function getPageUploadDate() {
        const script = document.querySelector('player-microformat-renderer script');
        if (!script) return null;

        const text = script.textContent;

        // Try startDate first (for streams)
        let match = text.match(/"startDate":"([^"]+)"/);
        if (match) return match[1];

        // Fall back to uploadDate
        match = text.match(/"uploadDate":"([^"]+)"/);
        return match ? match[1] : null;
    }

    /**
     * Check if current video is live
     */
    function isLiveBroadcast() {
        const script = document.querySelector('player-microformat-renderer script');
        if (!script) return false;

        const text = script.textContent;
        if (!text.includes('"isLiveBroadcast":true')) return false;

        // Not live if there's an endDate
        return !text.includes('"endDate"');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 PROCESSING FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Process request queue with rate limiting
     */
    async function processQueue() {
        while (requestQueue.length > 0 && pendingRequests < MAX_CONCURRENT) {
            const task = requestQueue.shift();
            pendingRequests++;

            try {
                await task();
            } catch (e) {
                log('❌ Task error:', e);
            }

            pendingRequests--;
        }
    }

    /**
     * Queue a date update task
     */
    function queueDateUpdate(videoId, element, originalText) {
        requestQueue.push(async () => {
            const uploadDate = await fetchUploadDate(videoId);
            if (!uploadDate) return;

            const formatted = formatDate(uploadDate) + PROCESSED;

            let displayText;
            if (!SETTINGS.showBothDates || isOldUpload(originalText)) {
                displayText = formatted;
            } else {
                displayText = SETTINGS.prependDates
                    ? `${formatted} · ${originalText}`
                    : `${originalText} · ${formatted}`;
            }

            if (element.firstChild) {
                element.firstChild.nodeValue = displayText;
            } else {
                element.textContent = displayText;
            }

            // 🆕 v4: Add class for CSS styling (text wrapping)
            element.classList.add('ytfd-processed');
        });

        processQueue();
    }

    /**
     * Update video description date (on watch pages)
     */
    function processVideoDescription() {
        const uploadDate = getPageUploadDate();
        if (!uploadDate) return;

        const formatted = formatDate(uploadDate);
        const isLive = isLiveBroadcast();

        document.body.classList.toggle('ytfd-live', isLive);

        // Find or create date element
        let dateEl = document.querySelector('#info-container > #info > b.ytfd-date');

        if (!dateEl) {
            const firstSpan = document.querySelector('#info-container > #info > span:first-child');
            if (firstSpan) {
                dateEl = document.createElement('b');
                dateEl.className = 'ytfd-date';
                firstSpan.after(dateEl);
            }
        }

        if (dateEl && dateEl.textContent !== formatted) {
            dateEl.textContent = formatted;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📋 PAGE CONFIGURATIONS - 🆕 v4: EXPANDED FOR ALL PAGES
    // ═══════════════════════════════════════════════════════════════════════════

    const PAGE_CONFIGS = [
        // ═══════════════════════════════════════════════════════════════════════
        // 🎬 WATCH PAGE (Video Sidebar Recommendations)
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'watch-sidebar',
            urlPattern: /watch\?v=/,
            containerSelector: 'yt-lockup-view-model.lockup',
            dateSelector: '.yt-core-attributed-string--link-inherit-color',
            linkSelector: '.yt-lockup-view-model__content-image'
        },
        {
            id: 'watch-sidebar-compact',
            urlPattern: /watch\?v=/,
            containerSelector: 'ytd-compact-video-renderer',
            dateSelector: '#metadata-line > span',
            linkSelector: 'a#thumbnail'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🏠 HOMEPAGE
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'homepage',
            urlPattern: /youtube\.com\/?$/,
            containerSelector: 'ytd-rich-item-renderer',
            dateSelector: '.yt-core-attributed-string--link-inherit-color',
            linkSelector: '.yt-lockup-view-model__content-image'
        },
        {
            id: 'homepage-grid',
            urlPattern: /youtube\.com\/?$/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🔍 SEARCH RESULTS
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'search',
            urlPattern: /results\?search_query=/,
            containerSelector: 'ytd-video-renderer',
            dateSelector: '.inline-metadata-item',
            linkSelector: '#thumbnail'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📬 SUBSCRIPTIONS - 🆕 v4: FIXED GRID VIEW
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'subscriptions-list',
            urlPattern: /feed\/subscriptions/,
            containerSelector: '#dismissible',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a'
        },
        {
            // 🆕 v4: Grid view subscriptions
            id: 'subscriptions-grid',
            urlPattern: /feed\/subscriptions/,
            containerSelector: 'ytd-rich-item-renderer',
            dateSelector: '#metadata-line > span, .yt-core-attributed-string--link-inherit-color',
            linkSelector: 'a#video-title-link, h3 > a, .yt-lockup-view-model__content-image'
        },
        {
            // 🆕 v4: Rich grid media in subscriptions
            id: 'subscriptions-rich-grid',
            urlPattern: /feed\/subscriptions/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'a#video-title-link, h3 > a'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📜 WATCH HISTORY - 🆕 v4: NEW
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'history',
            urlPattern: /feed\/history/,
            containerSelector: 'ytd-video-renderer',
            dateSelector: '.inline-metadata-item, #metadata-line > span',
            linkSelector: '#thumbnail, a#video-title'
        },
        {
            id: 'history-compact',
            urlPattern: /feed\/history/,
            containerSelector: 'ytd-compact-video-renderer',
            dateSelector: '#metadata-line > span',
            linkSelector: 'a#thumbnail'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📺 CHANNEL PAGES - VIDEOS TAB
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'channel-videos',
            urlPattern: /@[^/]+\/videos/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link'
        },
        {
            id: 'channel-videos-item',
            urlPattern: /@[^/]+\/videos/,
            containerSelector: 'ytd-rich-item-renderer',
            dateSelector: '#metadata-line > span, .yt-core-attributed-string--link-inherit-color',
            linkSelector: 'h3 > a, a#video-title-link'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🎥 CHANNEL STREAMS - 🆕 v4: NEW
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'channel-streams',
            urlPattern: /@[^/]+\/streams/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link'
        },
        {
            id: 'channel-streams-item',
            urlPattern: /@[^/]+\/streams/,
            containerSelector: 'ytd-rich-item-renderer',
            dateSelector: '#metadata-line > span, .yt-core-attributed-string--link-inherit-color',
            linkSelector: 'h3 > a, a#video-title-link'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📱 CHANNEL SHORTS - 🆕 v4: NEW
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'channel-shorts',
            urlPattern: /@[^/]+\/shorts/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link, a#thumbnail'
        },
        {
            id: 'channel-shorts-item',
            urlPattern: /@[^/]+\/shorts/,
            containerSelector: 'ytd-rich-item-renderer',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link, a#thumbnail'
        },
        {
            id: 'channel-shorts-reel',
            urlPattern: /@[^/]+\/shorts/,
            containerSelector: 'ytd-reel-item-renderer',
            dateSelector: '#metadata-line > span, .ytd-reel-item-renderer span',
            linkSelector: 'a#thumbnail, a'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 💬 CHANNEL COMMUNITY/POSTS - 🆕 v4: NEW
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'channel-community',
            urlPattern: /@[^/]+\/community/,
            containerSelector: 'ytd-backstage-post-renderer',
            dateSelector: '#published-time-text a, #published-time-text',
            linkSelector: '#published-time-text a'
        },
        {
            // Also handle "posts" URL variant
            id: 'channel-posts',
            urlPattern: /@[^/]+\/posts/,
            containerSelector: 'ytd-backstage-post-renderer',
            dateSelector: '#published-time-text a, #published-time-text',
            linkSelector: '#published-time-text a'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🔎 CHANNEL SEARCH - 🆕 v4: NEW
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'channel-search',
            urlPattern: /@[^/]+\/search/,
            containerSelector: 'ytd-video-renderer',
            dateSelector: '.inline-metadata-item, #metadata-line > span',
            linkSelector: '#thumbnail, a#video-title'
        },
        {
            id: 'channel-search-grid',
            urlPattern: /@[^/]+\/search/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 🏠 CHANNEL FEATURED/HOME
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'channel-featured',
            urlPattern: /@[^/]+\/?$/,
            containerSelector: 'ytd-grid-video-renderer',
            dateSelector: '#metadata-line > span',
            linkSelector: 'a#thumbnail'
        },
        {
            id: 'channel-featured-rich',
            urlPattern: /@[^/]+\/?$/,
            containerSelector: 'ytd-rich-grid-media',
            dateSelector: '#metadata-line > span',
            linkSelector: 'h3 > a, a#video-title-link'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📝 PLAYLISTS
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'playlist',
            urlPattern: /playlist\?list=/,
            containerSelector: 'ytd-playlist-video-renderer',
            dateSelector: 'span.yt-formatted-string',
            linkSelector: 'a#thumbnail'
        },

        // ═══════════════════════════════════════════════════════════════════════
        // 📚 OTHER FEED PAGES - 🆕 v4: ADDED
        // ═══════════════════════════════════════════════════════════════════════
        {
            id: 'trending',
            urlPattern: /feed\/trending/,
            containerSelector: 'ytd-video-renderer',
            dateSelector: '.inline-metadata-item, #metadata-line > span',
            linkSelector: '#thumbnail'
        },
        {
            id: 'library',
            urlPattern: /feed\/library/,
            containerSelector: 'ytd-video-renderer',
            dateSelector: '.inline-metadata-item, #metadata-line > span',
            linkSelector: '#thumbnail'
        },
        {
            id: 'watch-later',
            urlPattern: /playlist\?list=WL/,
            containerSelector: 'ytd-playlist-video-renderer',
            dateSelector: 'span.yt-formatted-string',
            linkSelector: 'a#thumbnail'
        },
        {
            id: 'liked-videos',
            urlPattern: /playlist\?list=LL/,
            containerSelector: 'ytd-playlist-video-renderer',
            dateSelector: 'span.yt-formatted-string',
            linkSelector: 'a#thumbnail'
        }
    ];

    /**
     * Get configs matching current URL
     */
    function getActiveConfigs() {
        const url = window.location.href;
        return PAGE_CONFIGS.filter(c => c.urlPattern.test(url));
    }

    /**
     * Process videos based on config
     */
    function processVideos(config) {
        const containers = document.querySelectorAll(config.containerSelector);

        containers.forEach(container => {
            // Find date elements (support multiple selectors separated by comma)
            const dateSelectors = config.dateSelector.split(',').map(s => s.trim());
            let dateEl = null;
            let originalText = '';

            for (const selector of dateSelectors) {
                const dateElements = container.querySelectorAll(selector);

                // Find the one with relative date text
                dateEl = Array.from(dateElements).find(el => {
                    const text = el.textContent;
                    return hasRelativeDate(text) && !text.includes(PROCESSED);
                });

                if (dateEl) {
                    originalText = dateEl.textContent.trim();
                    break;
                }
            }

            if (!dateEl) return;

            // Mark as processing
            if (dateEl.firstChild) {
                dateEl.firstChild.nodeValue = originalText + PROCESSED;
            }

            // Get video link (support multiple selectors)
            const linkSelectors = config.linkSelector.split(',').map(s => s.trim());
            let href = null;

            for (const selector of linkSelectors) {
                const linkEl = container.querySelector(selector);
                href = linkEl?.getAttribute('href');
                if (href) break;
            }

            const videoId = getVideoId(href);

            if (!videoId) {
                log('⚠️ No video ID for:', config.id, href);
                return;
            }

            queueDateUpdate(videoId, dateEl, originalText);
        });
    }

    /**
     * 🆕 v4: Universal fallback processor
     * Catches any date elements that might be missed by specific configs
     */
    function processUniversalFallback() {
        // Find all potential date elements across the page
        const potentialDateSelectors = [
            '#metadata-line > span',
            '.inline-metadata-item',
            '.yt-core-attributed-string--link-inherit-color',
            'span.yt-formatted-string',
            '#published-time-text',
            '#published-time-text a'
        ];

        potentialDateSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);

            elements.forEach(el => {
                const text = el.textContent;
                if (!hasRelativeDate(text) || text.includes(PROCESSED)) return;

                // Already processed by a specific config?
                if (el.classList.contains('ytfd-processed')) return;

                // Try to find associated video link
                const container = el.closest(
                    'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ' +
                    'ytd-grid-video-renderer, ytd-playlist-video-renderer, ytd-rich-grid-media, ' +
                    'yt-lockup-view-model, ytd-reel-item-renderer, #dismissible'
                );

                if (!container) return;

                const linkEl = container.querySelector(
                    'a#thumbnail, a#video-title-link, h3 > a, .yt-lockup-view-model__content-image, a[href*="watch"], a[href*="shorts"]'
                );

                const href = linkEl?.getAttribute('href');
                const videoId = getVideoId(href);

                if (!videoId) return;

                const originalText = text.trim();

                // Mark as processing
                if (el.firstChild) {
                    el.firstChild.nodeValue = originalText + PROCESSED;
                }

                queueDateUpdate(videoId, el, originalText);
            });
        });
    }

    /**
     * Run all processors
     */
    function runProcessors() {
        if (isProcessing) return;
        isProcessing = true;

        try {
            // Process video page description
            if (/watch\?v=/.test(window.location.href)) {
                processVideoDescription();
            }

            // Process video lists with specific configs
            const configs = getActiveConfigs();
            configs.forEach(processVideos);

            // 🆕 v4: Run universal fallback to catch any missed elements
            processUniversalFallback();

        } catch (error) {
            log('❌ Processing error:', error);
        }

        isProcessing = false;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES - 🆕 v4: ADDED TEXT WRAPPING FIX
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* Hide original date elements on watch page */
        #info > span:nth-child(3),
        #info > span:nth-child(4),
        #date-text {
            display: none !important;
        }

        /* Custom date styling */
        #info > b.ytfd-date {
            font-weight: 500 !important;
            margin-left: 6px !important;
        }

        /* Live broadcast adjustments */
        .ytfd-live #info > span:first-child {
            display: none !important;
        }
        .ytfd-live #info > b.ytfd-date {
            margin-left: 0 !important;
            margin-right: 6px !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
         * 🆕 v4: TEXT WRAPPING FIX FOR LONG DATES
         * ═══════════════════════════════════════════════════════════════════════ */

        /* Allow text wrapping on processed date elements */
        .ytfd-processed,
        #metadata-line,
        #metadata-line > span,
        .inline-metadata-item {
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }

        /* Ensure metadata line can expand for long dates */
        #metadata-line {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 4px !important;
            line-height: 1.4 !important;
        }

        /* Fix for grid view cards - allow multi-line metadata */
        ytd-rich-grid-media #metadata-line,
        ytd-rich-item-renderer #metadata-line,
        ytd-video-renderer .inline-metadata-item {
            overflow: visible !important;
            text-overflow: unset !important;
            -webkit-line-clamp: unset !important;
        }

        /* Ensure the container doesn't clip the date */
        ytd-rich-grid-media #meta,
        ytd-rich-item-renderer #meta,
        ytd-video-renderer #meta {
            overflow: visible !important;
        }

        /* Fix for 5-row display - ensure dates wrap properly */
        ytd-rich-grid-renderer[grid-row="5"] #metadata-line > span,
        ytd-rich-grid-renderer #metadata-line > span {
            display: inline !important;
            white-space: normal !important;
        }

        /* Subscriptions grid view fix */
        ytd-rich-item-renderer[items-per-row] #metadata-line {
            flex-wrap: wrap !important;
        }

        /* Watch history page fix */
        ytd-video-renderer[use-prominent-thumbs] .inline-metadata-item {
            white-space: normal !important;
        }

        /* Channel pages metadata fix */
        ytd-rich-grid-media[is-channel-page] #metadata-line > span {
            white-space: normal !important;
        }

        /* Settings Panel */
        #ytfd-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 480px;
            max-height: 85vh;
            overflow-y: auto;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 99999;
            font-family: 'YouTube Sans', Roboto, Arial, sans-serif;
            display: none;
        }

        #ytfd-panel.visible { display: block; }

        .ytfd-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid #e5e5e5;
            background: #f9f9f9;
            border-radius: 12px 12px 0 0;
        }

        .ytfd-header h2 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #0f0f0f;
        }

        .ytfd-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #606060;
            padding: 4px 8px;
            border-radius: 4px;
        }
        .ytfd-close:hover { background: #e5e5e5; }

        .ytfd-body { padding: 20px; }

        .ytfd-section {
            margin-bottom: 20px;
            padding: 16px;
            background: #f9f9f9;
            border-radius: 8px;
        }

        .ytfd-section-title {
            font-size: 13px;
            font-weight: 600;
            color: #606060;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .ytfd-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
        }

        .ytfd-label {
            font-size: 14px;
            color: #0f0f0f;
        }

        .ytfd-input {
            width: 200px;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 13px;
        }
        .ytfd-input:focus {
            outline: none;
            border-color: #065fd4;
        }

        .ytfd-select {
            width: 200px;
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 13px;
            background: white;
            cursor: pointer;
        }
        .ytfd-select:focus {
            outline: none;
            border-color: #065fd4;
        }

        .ytfd-toggle {
            position: relative;
            width: 44px;
            height: 24px;
            background: #ccc;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .ytfd-toggle.on { background: #065fd4; }

        .ytfd-toggle::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            transition: left 0.2s;
        }
        .ytfd-toggle.on::after { left: 22px; }

        .ytfd-footer {
            padding: 16px 20px;
            border-top: 1px solid #e5e5e5;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .ytfd-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 18px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .ytfd-btn-primary {
            background: #065fd4;
            color: white;
        }
        .ytfd-btn-primary:hover { background: #0056b8; }

        .ytfd-btn-secondary {
            background: #f2f2f2;
            color: #0f0f0f;
        }
        .ytfd-btn-secondary:hover { background: #e5e5e5; }

        .ytfd-help {
            font-size: 11px;
            color: #909090;
            margin-top: 4px;
            line-height: 1.4;
        }

        .ytfd-preview {
            margin-top: 8px;
            padding: 10px 12px;
            background: #e8f0fe;
            border-radius: 6px;
            font-size: 14px;
            color: #1a73e8;
            font-weight: 500;
        }

        .ytfd-token-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
            margin-top: 8px;
        }

        .ytfd-token {
            font-size: 11px;
            padding: 4px 6px;
            background: #e5e5e5;
            border-radius: 4px;
            font-family: monospace;
            text-align: center;
        }

        .ytfd-token-new {
            background: #d4edda;
            color: #155724;
        }

        .ytfd-badge {
            display: inline-block;
            padding: 2px 6px;
            background: #ff6b6b;
            color: white;
            font-size: 10px;
            border-radius: 4px;
            margin-left: 8px;
            font-weight: 600;
        }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // ⚙️ SETTINGS PANEL
    // ═══════════════════════════════════════════════════════════════════════════

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'ytfd-panel';

        // Build language options
        const langOptions = Object.entries(LANGUAGES)
            .map(([code, lang]) => `<option value="${code}" ${SETTINGS.language === code ? 'selected' : ''}>${lang.name}</option>`)
            .join('');

        panel.innerHTML = `
            <div class="ytfd-header">
                <h2>📅 YouTube Full Dates v4 Settings</h2>
                <button class="ytfd-close" title="Close">✕</button>
            </div>
            <div class="ytfd-body">
                <div class="ytfd-section">
                    <div class="ytfd-section-title">🌍 Language</div>
                    <div class="ytfd-row">
                        <label class="ytfd-label">Display Language</label>
                        <select class="ytfd-select" id="ytfd-language">
                            ${langOptions}
                        </select>
                    </div>
                    <div class="ytfd-help">
                        Choose the language for day and month names
                    </div>
                </div>

                <div class="ytfd-section">
                    <div class="ytfd-section-title">📅 Date Format</div>
                    <div class="ytfd-row">
                        <label class="ytfd-label">Format Template</label>
                        <input type="text" class="ytfd-input" id="ytfd-format" value="${SETTINGS.dateFormat}">
                    </div>
                    <div class="ytfd-help">
                        Available tokens:
                    </div>
                    <div class="ytfd-token-grid">
                        <span class="ytfd-token">yyyy</span>
                        <span class="ytfd-token">yy</span>
                        <span class="ytfd-token">MM</span>
                        <span class="ytfd-token">MMM</span>
                        <span class="ytfd-token">MMMM</span>
                        <span class="ytfd-token">dd</span>
                        <span class="ytfd-token">ww</span>
                        <span class="ytfd-token">wwww</span>
                        <span class="ytfd-token">HH</span>
                        <span class="ytfd-token">hh</span>
                        <span class="ytfd-token">mm</span>
                        <span class="ytfd-token">ss</span>
                        <span class="ytfd-token">ap</span>
                    </div>
                    <div class="ytfd-preview" id="ytfd-preview">
                        Preview: ${formatDate(new Date())}
                    </div>
                </div>

                <div class="ytfd-section">
                    <div class="ytfd-section-title">⚙️ Display Options</div>
                    <div class="ytfd-row">
                        <label class="ytfd-label">Show both dates (recent videos)</label>
                        <div class="ytfd-toggle ${SETTINGS.showBothDates ? 'on' : ''}" data-key="showBothDates"></div>
                    </div>
                    <div class="ytfd-row">
                        <label class="ytfd-label">Put formatted date first</label>
                        <div class="ytfd-toggle ${SETTINGS.prependDates ? 'on' : ''}" data-key="prependDates"></div>
                    </div>
                    <div class="ytfd-row">
                        <label class="ytfd-label">Debug mode (console logging)</label>
                        <div class="ytfd-toggle ${SETTINGS.debugMode ? 'on' : ''}" data-key="debugMode"></div>
                    </div>
                </div>

                <div class="ytfd-section">
                    <div class="ytfd-section-title">📝 Quick Format Examples</div>
                    <div class="ytfd-help" style="font-size: 12px; line-height: 1.8;">
                        <strong>French:</strong> <code>wwww dd MMMM yyyy HH:mm:ss</code><br>
                        → ${formatDate(new Date(), 'wwww dd MMMM yyyy HH:mm:ss', 'fr')}<br><br>
                        <strong>US:</strong> <code>MMMM dd, yyyy</code><br>
                        → ${formatDate(new Date(), 'MMMM dd, yyyy', 'en')}<br><br>
                        <strong>ISO:</strong> <code>yyyy-MM-dd</code><br>
                        → ${formatDate(new Date(), 'yyyy-MM-dd', 'en')}
                    </div>
                </div>

                <div class="ytfd-section">
                    <div class="ytfd-section-title">✨ What's New in v4<span class="ytfd-badge">NEW</span></div>
                    <div class="ytfd-help" style="font-size: 12px; line-height: 1.6;">
                        ✅ Fixed: Subscriptions Grid View<br>
                        ✅ Fixed: Watch History page<br>
                        ✅ Fixed: Channel Streams, Shorts, Posts<br>
                        ✅ Fixed: Channel Search results<br>
                        ✅ Fixed: Long dates now wrap properly<br>
                        ✅ Added: Korean and Arabic languages
                    </div>
                </div>
            </div>
            <div class="ytfd-footer">
                <button class="ytfd-btn ytfd-btn-secondary" id="ytfd-reset">Reset</button>
                <button class="ytfd-btn ytfd-btn-primary" id="ytfd-save">Save</button>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        panel.querySelector('.ytfd-close').addEventListener('click', () => {
            panel.classList.remove('visible');
        });

        // Toggle handlers
        panel.querySelectorAll('.ytfd-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('on');
            });
        });

        // Format preview - update on format OR language change
        const formatInput = panel.querySelector('#ytfd-format');
        const langSelect = panel.querySelector('#ytfd-language');
        const preview = panel.querySelector('#ytfd-preview');

        const updatePreview = () => {
            const lang = langSelect.value;
            const format = formatInput.value;
            preview.textContent = `Preview: ${formatDate(new Date(), format, lang)}`;
        };

        formatInput.addEventListener('input', updatePreview);
        langSelect.addEventListener('change', updatePreview);

        // Save button
        panel.querySelector('#ytfd-save').addEventListener('click', () => {
            const newSettings = {
                dateFormat: formatInput.value,
                language: langSelect.value,
                showBothDates: panel.querySelector('[data-key="showBothDates"]').classList.contains('on'),
                prependDates: panel.querySelector('[data-key="prependDates"]').classList.contains('on'),
                debugMode: panel.querySelector('[data-key="debugMode"]').classList.contains('on')
            };

            GM_setValue('settings', newSettings);
            alert('✅ Settings saved! Refresh the page to apply changes.');
            panel.classList.remove('visible');
        });

        // Reset button
        panel.querySelector('#ytfd-reset').addEventListener('click', () => {
            if (confirm('Reset all settings to defaults?')) {
                GM_setValue('settings', {});
                alert('✅ Settings reset! Refresh the page to apply.');
                panel.classList.remove('visible');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') panel.classList.remove('visible');
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (panel.classList.contains('visible') && !panel.contains(e.target)) {
                panel.classList.remove('visible');
            }
        }, true);

        return panel;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    // Create settings panel
    const settingsPanel = createSettingsPanel();

    // Register menu command
    GM_registerMenuCommand('⚙️ Open Settings', () => {
        settingsPanel.classList.add('visible');
    });

    // Debounce helper
    let debounceTimer = null;
    function debouncedRun(delay = 500) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runProcessors, delay);
    }

    // MutationObserver for dynamic content
    const observer = new MutationObserver((mutations) => {
        let shouldRun = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if relevant elements were added
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        // 🆕 v4: Expanded selector list
                        const selectors = [
                            'ytd-rich-item-renderer',
                            'ytd-video-renderer',
                            'ytd-compact-video-renderer',
                            'ytd-grid-video-renderer',
                            'ytd-playlist-video-renderer',
                            'ytd-rich-grid-media',
                            'yt-lockup-view-model',
                            'ytd-reel-item-renderer',
                            'ytd-backstage-post-renderer',
                            '#dismissible'
                        ].join(', ');

                        if (node.matches?.(selectors) || node.querySelector?.(selectors)) {
                            shouldRun = true;
                            break;
                        }
                    }
                }
            }
        }

        if (shouldRun) debouncedRun();
    });

    // YouTube navigation listener
    window.addEventListener('yt-navigate-finish', () => {
        dateCache.clear(); // Clear cache on navigation
        debouncedRun(300);
    });

    // Start observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    setTimeout(runProcessors, 1000);

    // 🆕 v4: Additional delayed run to catch lazy-loaded content
    setTimeout(runProcessors, 3000);

    console.log('📅 YouTube Full Dates v4 loaded! Language:', SETTINGS.language);

})();