// ==UserScript==
// @name         YouTube Full Dates v1
// @namespace    YouTube Full Dates v1
// @version      1
// @description  Show full upload dates instead of "1 year ago", "2 weeks ago", etc. Customize date and time format to your preference.
// @author       InMirrors
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/814d40a6/img/favicon_144x144.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555228/YouTube%20Full%20Dates%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/555228/YouTube%20Full%20Dates%20v1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== Constants =====
    const PROCESSED_MARKER = '\u200B'; // Zero-Width Space
    const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';

    // Keywords for identifying relative date strings
    const DATE_TIME_KEYWORDS_EN = 'second minute hour day week month year';
    const DATE_TIME_KEYWORDS_ZH = '秒 分 时 時 天 日 周 週 月 年';
    const DEFAULT_DATE_TIME_KEYWORDS = [DATE_TIME_KEYWORDS_EN, DATE_TIME_KEYWORDS_ZH].join(' ').split(' ');
    const DEFAULT_AGO_KEYWORDS = ['ago', '前'];
    const DEFAULT_OLD_UPLOAD_KEYWORDS = ['day', 'week', 'month', 'year', '天', '日', '周', '週', '月', '年'];
    const DEFAULT_MONTH_NAMES = 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC';
    const DEFAULT_DAY_NAMES = 'Sun Mon Tue Wed Thu Fri Sat';

    // ===== Settings =====
    const SETTINGS = GM_getValue("basic", {});
    const DATE_FORMAT = SETTINGS.dateFormat || DEFAULT_DATE_FORMAT;
    const DATE_TIME_KEYWORDS = SETTINGS.dateTimeKeywords?.length ? SETTINGS.dateTimeKeywords : DEFAULT_DATE_TIME_KEYWORDS;
    const AGO_KEYWORDS = SETTINGS.agoKeywords?.length ? SETTINGS.agoKeywords : DEFAULT_AGO_KEYWORDS;
    const OLD_UPLOAD_KEYWORDS = SETTINGS.oldUploadKeywords?.length ? SETTINGS.oldUploadKeywords : DEFAULT_OLD_UPLOAD_KEYWORDS;
    const MONTH_NAMES = SETTINGS.monthNames?.length ? SETTINGS.monthNames : DEFAULT_MONTH_NAMES.split(' ');
    const DAY_NAMES = SETTINGS.dayNames?.length ? SETTINGS.dayNames : DEFAULT_DAY_NAMES.split(' ');
    const PREPEND_DATES_ENABLED = SETTINGS.prependDatesEnabled ?? false;

    // Advanced settings
    let timerModeEnabled = GM_getValue("timerModeEnabled", false);
    let formattingTimer = null;
    let useAllConfigsEnabled = GM_getValue("useAllConfigsEnabled", false);
    let findValidConfigEnable = GM_getValue("findValidConfigEnable", false);

    // Debug mode
    let debugModeEnabled = GM_getValue("debugModeEnabled", false);
    let debugVidsArrayLength = GM_getValue("debugVidsArrayLength", 4);

    // ===== Debug Mode Menu Commands =====
    if (debugModeEnabled) {
        GM_registerMenuCommand(`Toggle Debug mode ${debugModeEnabled ? "OFF" : "ON"}`, () => {
            debugModeEnabled = !debugModeEnabled;
            GM_setValue("debugModeEnabled", debugModeEnabled);
            alert(`Debug mode is now ${debugModeEnabled ? "ON" : "OFF"}`);
        });

        GM_registerMenuCommand("Set video array length", () => {
            const input = prompt("Please enter a number, 0 to disable slicing:", debugVidsArrayLength);
            if (input == null) return;

            if (input.trim() !== "" && !isNaN(input)) {
                debugVidsArrayLength = Number(input);
                GM_setValue("debugVidsArrayLength", debugVidsArrayLength);
                alert("Value updated to: " + debugVidsArrayLength);
            } else {
                alert("Invalid input. Please enter a number.");
            }
        });

        GM_registerMenuCommand(`Toggle all configs mode ${useAllConfigsEnabled ? "OFF" : "ON"}`, () => {
            useAllConfigsEnabled = !useAllConfigsEnabled;
            GM_setValue("useAllConfigsEnabled", useAllConfigsEnabled);
            alert(`All configs mode is now ${useAllConfigsEnabled ? "ON" : "OFF"}`);
        });

        GM_registerMenuCommand(`Toggle find valid config mode ${findValidConfigEnable ? "OFF" : "ON"}`, () => {
            findValidConfigEnable = !findValidConfigEnable;
            if (findValidConfigEnable) {
                useAllConfigsEnabled = true;
                GM_setValue("useAllConfigsEnabled", useAllConfigsEnabled);
            }
            GM_setValue("findValidConfigEnable", findValidConfigEnable);
            alert(`Find valid config mode is now ${findValidConfigEnable ? "ON" : "OFF"}`);
        });
    }

    // ===== Utility Functions =====

    /**
     * Validate configuration array
     * @param {Array} configs - Array of config objects
     * @returns {boolean} - True if all configs are valid
     */
    function validateConfigs(configs) {
        const errors = [];

        configs.forEach(config => {
            const { id = '[no id]' } = config;
            const stringProps = ["id", "videoContainerSelector", "metaSpansSelector", "vidLinkSelector"];

            stringProps.forEach(prop => {
                if (typeof config[prop] !== "string" || config[prop].trim() === "") {
                    errors.push(`${id}: "${prop}" must be a non-empty string`);
                }
            });

            if (!(config.urlPattern instanceof RegExp)) {
                errors.push(`${id}: "urlPattern" must be a RegExp`);
            }

            if (typeof config.shouldCreateDateSpan !== "boolean") {
                errors.push(`${id}: "shouldCreateDateSpan" must be a boolean`);
            }

            if (config.shouldCreateDateSpan === true && typeof config.insertAfterIndex !== "number") {
                errors.push(`${id}: "insertAfterIndex" must be a number when shouldCreateDateSpan is true`);
            }
        });

        if (errors.length > 0) {
            console.log('[YouTube Date Formatter] Validation errors:');
            errors.forEach(err => console.log(" - " + err));
            return false;
        }

        console.log('[YouTube Date Formatter] All configs are valid!');
        return true;
    }

    /**
     * Find elements containing specified keywords
     * @param {NodeList | Array} nodeList - Elements to search
     * @param {string[]} keywords - Keywords to search for
     * @param {boolean} findAll - Return all matches or just first
     * @returns {Element | Element[] | undefined}
     */
    function findElementsByKeywords(nodeList, keywords, findAll = false) {
        const elements = Array.from(nodeList);

        if (findAll) {
            return elements.filter(el =>
                keywords.some(keyword => el.textContent.includes(keyword))
            );
        }

        return elements.find(el =>
            keywords.some(keyword => el.textContent.includes(keyword))
        );
    }

    /**
     * Format a date into a string with custom template
     * Supported tokens:
     * - yyyy: 4-digit year
     * - yy: 2-digit year
     * - MMM: uppercase month name
     * - MM: 2-digit month
     * - dd: 2-digit day
     * - ww: day of week
     * - HH: 24-hour format (00-23)
     * - hh: 12-hour format (01-12)
     * - ap: AM/PM
     * - mm: 2-digit minutes
     * - ss: 2-digit seconds
     *
     * @param {string|number|Date} date - Date to format
     * @param {string} template - Format template (default: "yyyy-MM-dd HH:mm:ss")
     * @param {boolean} useLocal - Use local time vs UTC (default: true)
     * @param {string[]} months - Month names (default: English JAN-DEC)
     * @param {string[]} days - Day names (default: English Sun-Sat)
     * @returns {string} Formatted date string
     */
    function getDateStr(date, template = "yyyy-MM-dd HH:mm:ss", useLocal = true, months, days) {
        const defaultMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const defaultDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthNames = months || defaultMonths;
        const dayNames = days || defaultDays;

        const dt = new Date(date);
        if (isNaN(dt.getTime())) return "";

        const getMethod = (key) => useLocal ? dt[`get${key}`]() : dt[`getUTC${key}`]();
        const pad = (num, size = 2) => String(num).padStart(size, "0");

        const map = {
            yyyy: String(getMethod("FullYear")),
            yy: String(getMethod("FullYear")).slice(-2),
            MMM: monthNames[getMethod("Month")],
            MM: pad(getMethod("Month") + 1),
            dd: pad(getMethod("Date")),
            ww: dayNames[getMethod("Day")],
            HH: pad(getMethod("Hours")),
            hh: pad((getMethod("Hours") % 12) || 12),
            ap: getMethod("Hours") < 12 ? "AM" : "PM",
            mm: pad(getMethod("Minutes")),
            ss: pad(getMethod("Seconds")),
        };

        return template.replaceAll(/(yy(yy)?|MMM?|dd|ww|HH|hh|mm|ss|ap)/g, n => map[n]);
    }

    /**
     * Extract upload date from page metadata
     * @returns {string | null} Upload date or null
     */
    function getUploadDate() {
        const el = document.body.querySelector('player-microformat-renderer script');
        if (!el) return null;

        let parts = el.textContent.split('"startDate":"', 2);
        if (parts.length === 2) {
            return parts[1].split('"', 1)[0];
        }

        parts = el.textContent.split('"uploadDate":"', 2);
        if (parts.length === 2) {
            return parts[1].split('"', 1)[0];
        }

        return null;
    }

    /**
     * Check if video is currently live broadcasting
     * @returns {boolean | null}
     */
    function getIsLiveBroadcast() {
        const el = document.body.querySelector('player-microformat-renderer script');
        if (!el) return null;

        let parts = el.textContent.split('"isLiveBroadcast":', 2);
        if (parts.length !== 2) return false;

        const isLiveBroadcast = !!parts[1].split(',', 1)[0];
        if (!isLiveBroadcast) return false;

        parts = el.textContent.split('"endDate":"', 2);
        if (parts.length === 2) return false;

        return true;
    }

    /**
     * Update upload date in video description
     */
    function processDescription() {
        let uploadDate = getUploadDate();
        if (!uploadDate) return;

        uploadDate = getDateStr(uploadDate, DATE_FORMAT, true, MONTH_NAMES, DAY_NAMES);
        const isLiveBroadcast = getIsLiveBroadcast();

        document.body.classList.toggle('ytud-description-live', isLiveBroadcast);

        let el = document.querySelector('#info-container > #info > b');
        if (!el) {
            const span = document.querySelector('#info-container > #info > span:nth-child(1)');
            if (span) {
                el = document.createElement('b');
                el.textContent = uploadDate;
                span.insertAdjacentElement('afterend', el);
            }
        } else {
            if (el.parentNode.children[1] !== el) {
                const container = el.parentNode;
                el = container.removeChild(el);
                container.children[0].insertAdjacentElement('afterend', el);
            }
            if (el.firstChild.nodeValue !== uploadDate) {
                el.firstChild.nodeValue = uploadDate;
            }
        }
    }

    /**
     * Process topic sidebar videos
     */
    function processTopicSidebar() {
        const vids = document.querySelectorAll('#contents > ytd-universal-watch-card-renderer > #sections > ytd-watch-card-section-sequence-renderer > #lists > ytd-vertical-watch-card-list-renderer > #items > ytd-watch-card-compact-video-renderer');

        vids.forEach((el) => {
            const holders = el.querySelectorAll('div.text-wrapper > yt-formatted-string.subtitle');
            if (holders.length === 0) return;

            const holder = holders[0];
            const separator = ' • ';
            const parts = holder.firstChild.nodeValue.split(separator, 2);
            if (parts.length < 2) return;

            const dateText = parts[1];
            const text = el.getAttribute('date-text');

            if (text !== null && text === dateText) return;

            el.setAttribute('date-text', dateText);
            const link = el.querySelector('a#thumbnail').getAttribute('href');
            const videoId = urlToVideoId(link);
            fetchAndUpdateUploadDate(videoId, holder, dateText);
        });
    }

    /**
     * Extract video ID from URL
     * @param {string} url - YouTube URL
     * @returns {string} Video ID
     */
    function urlToVideoId(url) {
        let parts = url.split('/shorts/', 2);
        url = parts.length === 2 ? parts[1] : parts[0];

        parts = url.split('v=', 2);
        url = parts.length === 2 ? parts[1] : parts[0];

        return url.split('&', 1)[0];
    }

    /**
     * Fetch upload date from YouTube API
     * @param {string} videoId - Video ID
     * @param {Function} callback - Callback with upload date
     */
    function getRemoteUploadDate(videoId, callback) {
        const body = {
            "context": { "client": { "clientName": "WEB", "clientVersion": "2.20240416.01.00" } },
            "videoId": videoId
        };

        fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const object = data.microformat.playerMicroformatRenderer;

            if (object.liveBroadcastDetails?.isLiveNow) {
                callback(object.liveBroadcastDetails.startTimestamp);
            } else if (object.publishDate) {
                callback(object.publishDate);
            } else {
                callback(object.uploadDate);
            }
        })
        .catch(error => {
            console.error('[YouTube Date Formatter] Fetch error:', error);
        });
    }

    /**
     * Fetch and update upload date for a video
     * @param {string} videoId - Video ID
     * @param {HTMLElement} dateElem - Element containing date
     * @param {string} originalDateText - Original relative date text
     */
    function fetchAndUpdateUploadDate(videoId, dateElem, originalDateText) {
        getRemoteUploadDate(videoId, (uploadDate) => {
            const formattedDate = getDateStr(uploadDate, DATE_FORMAT, true, MONTH_NAMES, DAY_NAMES) + PROCESSED_MARKER;
            let displayText;

            // Show only formatted date for old uploads
            if (OLD_UPLOAD_KEYWORDS.some(keyword => originalDateText.includes(keyword))) {
                displayText = formattedDate;
            } else {
                // Show both dates for recent uploads
                displayText = PREPEND_DATES_ENABLED
                    ? `${formattedDate} · ${originalDateText}`
                    : `${originalDateText} · ${formattedDate}`;
            }

            dateElem.firstChild.nodeValue = displayText;
        });
    }

    /**
     * Find and process videos based on configuration
     * @param {object} config - Configuration object
     */
    function findAndProcessVids(config) {
        // Skip if URL doesn't match pattern
        if (config.urlPattern && !config.urlPattern.test(window.location.href) && !useAllConfigsEnabled) {
            return;
        }

        let vids = document.querySelectorAll(config.videoContainerSelector);
        if (vids.length === 0) return;

        // Limit processing in debug mode
        if (debugModeEnabled && debugVidsArrayLength !== 0 && vids.length > 1) {
            vids = Array.from(vids).slice(0, debugVidsArrayLength);
        }

        vids.forEach((vidContainer) => {
            const metaSpans = vidContainer.querySelectorAll(config.metaSpansSelector);
            if (metaSpans.length === 0) {
                if (debugModeEnabled && !findValidConfigEnable) {
                    console.warn(`[YouTube Date Formatter] No metadata span found for [${config.id}]`);
                }
                return;
            }

            let dateSpan;
            if (config.shouldCreateDateSpan) {
                // Create new date span element
                dateSpan = document.createElement('span');
                dateSpan.className = 'inline-metadata-item style-scope ytd-video-meta-block ytdf-date';
                dateSpan.appendChild(document.createTextNode(''));
                metaSpans[config.insertAfterIndex].insertAdjacentElement('afterend', dateSpan);
            } else {
                // Find existing date span
                const spansEndWithAgo = Array.from(metaSpans).filter(span =>
                    AGO_KEYWORDS.some(ago => span.textContent.includes(ago))
                );
                dateSpan = findElementsByKeywords(spansEndWithAgo, DATE_TIME_KEYWORDS);
            }

            if (!dateSpan) {
                if (debugModeEnabled && !findValidConfigEnable) {
                    console.warn(`[YouTube Date Formatter] Date span is null for [${config.id}]`);
                }
                return;
            }

            const dateText = dateSpan.textContent;
            if (!dateText || dateText.includes(PROCESSED_MARKER)) return;

            // Mark as processed
            dateSpan.firstChild.nodeValue = dateText + PROCESSED_MARKER;

            const vidLinkElem = vidContainer.querySelector(config.vidLinkSelector);
            if (!vidLinkElem) {
                if (debugModeEnabled && !findValidConfigEnable) {
                    console.warn(`[YouTube Date Formatter] No video link element found for [${config.id}]`);
                }
                return;
            }

            const vidLink = vidLinkElem.getAttribute('href');
            if (!vidLink) return;

            const videoId = urlToVideoId(vidLink);
            if (!videoId) return;

            if (findValidConfigEnable) {
                console.warn(`[YouTube Date Formatter] [${config.id}] is valid`);
            }

            fetchAndUpdateUploadDate(videoId, dateSpan, dateText);
        });
    }

    // ===== Configuration Array =====
    const configs = [
        {
            id: 'Video Page Sidebar',
            urlPattern: /watch\?v=/,
            videoContainerSelector: 'yt-lockup-view-model.lockup',
            metaSpansSelector: '.yt-core-attributed-string--link-inherit-color',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Homepage Videos',
            urlPattern: /www\.youtube\.com\/?$/,
            videoContainerSelector: 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-renderer',
            metaSpansSelector: '.yt-core-attributed-string--link-inherit-color',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Homepage Shorts',
            urlPattern: /XXXwww\.youtube\.com\/?$/, // Disabled by default
            videoContainerSelector: 'dummy',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: true,
            insertAfterIndex: 0,
        },
        {
            id: 'Search List Videos',
            urlPattern: /results\?search_query=/,
            videoContainerSelector: 'ytd-video-renderer.ytd-item-section-renderer',
            metaSpansSelector: '.inline-metadata-item',
            vidLinkSelector: '#thumbnail',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Search List Shorts',
            urlPattern: /XXXresults\?search_query=/, // Disabled by default
            videoContainerSelector: 'dummy',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: '.yt-lockup-view-model__content-image',
            shouldCreateDateSpan: true,
            insertAfterIndex: 0,
        },
        {
            id: 'Subscriptions',
            urlPattern: /subscriptions/,
            videoContainerSelector: '#dismissible',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: 'h3 > a',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Channel Videos',
            urlPattern: /www.youtube.com\/[^\/]+?\/videos/,
            videoContainerSelector: 'ytd-rich-grid-media.ytd-rich-item-renderer',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: 'h3 > a',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Channel Featured Videos',
            urlPattern: /www.youtube.com\/@[^\/]+?\/?(featured)?$/,
            videoContainerSelector: 'ytd-grid-video-renderer.yt-horizontal-list-renderer',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: 'a#thumbnail',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Channel For You Videos',
            urlPattern: /www.youtube.com\/@[^\/]+?\/?(featured)?$/,
            videoContainerSelector: 'ytd-channel-video-player-renderer.ytd-item-section-renderer',
            metaSpansSelector: '#metadata-line > span',
            vidLinkSelector: '#title a',
            shouldCreateDateSpan: false,
        },
        {
            id: 'Video Playlist',
            urlPattern: /playlist\?list=/,
            videoContainerSelector: 'ytd-playlist-video-renderer.ytd-playlist-video-list-renderer',
            metaSpansSelector: 'span.yt-formatted-string',
            vidLinkSelector: 'a#thumbnail',
            shouldCreateDateSpan: false,
        }
    ];

    // ===== Main Execution =====

    /**
     * Run all formatting functions
     */
    function runAllFormatters() {
        try {
            if (debugModeEnabled && !validateConfigs(configs)) return;

            processDescription();
            processTopicSidebar();
            configs.forEach(findAndProcessVids);
        } catch (error) {
            console.error('[YouTube Date Formatter] Error running formatters:', error);
        }
    }

    let validConfigs = [];

    /**
     * Update valid configuration list based on current URL
     */
    function updateSelectors() {
        const currentUrl = window.location.href;
        const newConfigs = configs.filter(config => config.urlPattern.test(currentUrl));

        if (newConfigs !== validConfigs) {
            validConfigs = newConfigs;
            if (debugModeEnabled) {
                console.log('[YouTube Date Formatter] Valid configs:', validConfigs);
            }
        }
    }

    /**
     * Update timer for formatting (used in timer mode)
     */
    function updateFormattingTimer() {
        if (formattingTimer !== null) clearInterval(formattingTimer);
        formattingTimer = setInterval(runAllFormatters, 1000);
    }

    let subscriptionsPageTimer = null;
    const subscriptionsPagePattern = /subscriptions/;

    /**
     * Handle special timer for subscriptions page
     */
    function handleSubscriptionsPageTimer() {
        if (subscriptionsPagePattern.test(window.location.href)) {
            subscriptionsPageTimer = setInterval(runAllFormatters, 1000);
        } else if (subscriptionsPageTimer !== null) {
            clearInterval(subscriptionsPageTimer);
            subscriptionsPageTimer = null;
        }
    }

    // Listen for YouTube navigation
    window.addEventListener('yt-navigate-finish', () => {
        updateSelectors();
        handleSubscriptionsPageTimer();
    });

    // Initialize
    updateSelectors();
    runAllFormatters();

    // MutationObserver for dynamic content changes
    const observer = new MutationObserver((mutationsList) => {
        const observerConfigs = useAllConfigsEnabled ? configs : validConfigs;
        if (observerConfigs.length === 0) {
            if (debugModeEnabled) {
                console.warn('[YouTube Date Formatter] No valid configs found, skipping observer...');
            }
            return;
        }

        // Subscriptions page handled by timer
        if (subscriptionsPagePattern.test(window.location.href)) return;

        let shouldRunFormatters = false;
        const videoContainerSelectors = observerConfigs
            .map(config => config.videoContainerSelector)
            .filter(selector => selector && typeof selector === 'string')
            .join(', ');

        for (const mutation of mutationsList) {
            // New elements added to DOM
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches(videoContainerSelectors) || node.querySelector(videoContainerSelectors)) {
                            shouldRunFormatters = true;
                        }
                    }
                });
            }

            // Attribute changes (for channel video sorting)
            if (mutation.type === 'attributes') {
                const videoLinkSelector = configs.find(config => config.id === 'Channel Videos')?.vidLinkSelector;
                if (videoLinkSelector && mutation.target.matches(videoLinkSelector)) {
                    if (mutation.oldValue !== mutation.target.href) {
                        shouldRunFormatters = true;
                    }
                }
            }
        }

        if (shouldRunFormatters) {
            clearTimeout(window.formatterDebounce);
            window.formatterDebounce = setTimeout(runAllFormatters, 500);
        }
    });

    if (!timerModeEnabled) {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href']
        });
    } else {
        updateFormattingTimer();
    }

    // Inject CSS
    const styleTag = document.createElement('style');
    styleTag.textContent = `
        #info > span:nth-child(3) { display: none !important; }
        #info > span:nth-child(4) { display: none !important; }
        #info > b { font-weight: 500 !important; margin-left: 6px !important; }
        #date-text { display: none !important; }
        .ytud-description-live #info > span:nth-child(1) { display: none !important; }
        .ytud-description-live #info > b { margin-left: 0 !important; margin-right: 6px !important; }
    `;
    document.head.appendChild(styleTag);

    // ===== Settings UI =====

    const translations = {
        en: {
            menuTitle: 'Open Settings Panel',
            panelTitle: 'Settings',
            saveBtn: 'Save',
            resetBtn: 'Reset',
            languageLabel: 'Language',
            prependDatesLabel: 'Prepend dates',
            prependDatesHelp: 'Insert absolute dates before the original relative dates. Default is after.',
            dateFormatLabel: 'Date format',
            dateFormatHelp: 'The format for the displayed date. Check the script documentation for syntax help.',
            oldUploadKeywordsLabel: 'Keywords for old uploads',
            oldUploadKeywordsHelp: 'Keywords to identify old uploads. Only formatted dates will be shown for these.',
            dateTimeKeywordsLabel: 'Date and time keywords',
            dateTimeKeywordsHelp: 'Keywords used to identify relative date strings.',
            agoKeywordsLabel: 'Ago keyword',
            agoKeywordsHelp: 'Keyword used to identify the "ago" part of relative dates, such as "ago" in "1 day ago".',
            monthNamesLabel: 'Month names',
            monthNamesHelp: 'The names of the months used in the date format (MMM).',
            dayNamesLabel: 'Day of the week names',
            dayNamesHelp: 'The names of the days of the week used in the date format (ww).',
            stringsFooterBasic: 'Click the question mark icon to use the example.',
            stringsFooterI18n: 'You must use translations in your YouTube language to fill in these keyword settings if your YouTube language is not English.',
            helpTooltip: '{desc} Example:\n{example}',
            inputPlaceholder: 'Enter value...',
            alertSaved: 'Settings saved! Please refresh the page to apply changes.',
            confirmReset: 'Reset all settings to defaults?'
        }
    };

    let currentStrings = translations.en;

    const panelCSS = `
        :root { --ytdf-panel-bg: #fff; --ytdf-accent: #1e88e5; }
        #ytdf-panel {
            width: 520px;
            margin: 40px auto;
            border-radius: 10px;
            max-height: 600px;
            overflow: auto;
            background: var(--ytdf-panel-bg);
            box-shadow: 0 6px 24px rgba(0,0,0,0.12);
            font-family: Arial, sans-serif;
            color: black;
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: none;
        }
        .ytdf-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #eef2f7; }
        .ytdf-header h1 { font-size: 18px; font-weight: bolder; margin: 0; }
        .ytdf-header .ytdf-buttons { display: flex; gap: 8px; }
        .ytdf-button { background: var(--ytdf-accent); color: #fff; border: none; padding: 8px 12px; border-radius: 7px; cursor: pointer; }
        .ytdf-button.ytdf-secondary { background: #edf2f7; color: #111; border: 1px solid #d1dae8; }
        .ytdf-container { padding: 18px; display: grid; gap: 14px; }
        .ytdf-section { padding: 12px; border-radius: 8px; box-shadow: 0px 0px 6px lightgray; }
        .ytdf-section-title { font-size: 18px; font-weight: bolder; margin-block: 10px; }
        .ytdf-section.ytdf-selects { background: hsl(110,60%,99%); border-left: 4px solid hsl(110,50%,70%); }
        .ytdf-section.ytdf-switches { background: hsl(190,60%,99%); border-left: 4px solid hsl(190,50%,70%); }
        .ytdf-section.ytdf-strings-basic { background: hsl(250,60%,99%); border-left: 4px solid hsl(250,70%,70%); }
        .ytdf-section.ytdf-strings-i18n { background: hsl(340,60%,99%); border-left: 4px solid hsl(340,70%,70%); }
        .ytdf-switch-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
        .ytdf-switch-row label { flex: 1; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .ytdf-toggle { width: 40px; height: 22px; background: #cbd5e1; border-radius: 20px; position: relative; cursor: pointer; flex: 0 0 auto; }
        .ytdf-toggle .ytdf-knob { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: all 0.18s; }
        .ytdf-toggle.ytdf-on { background: #4fbe79; }
        .ytdf-toggle.ytdf-on .ytdf-knob { left: 20px; }
        .ytdf-string-label-help, .ytdf-select-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-top: 1px dashed rgba(0,0,0,0.04); }
        .ytdf-string-row:first-child, .ytdf-select-row:first-child { border-top: none; }
        .ytdf-select-label { width: 140px; font-size: 14px; }
        .ytdf-string-label { font-size: 14px; }
        .ytdf-string-input, .ytdf-select-input { flex: 1; }
        .ytdf-string-input input[type="text"], .ytdf-select-input select { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #cbd5e1; }
        .ytdf-help { margin-left: auto; cursor: pointer; user-select: none; font-size: 12px; color: #0366d6; }
        .ytdf-footer-note { font-size: 12px; color: #718096; margin-top: 6px; }
        @media (max-width: 600px) { #ytdf-panel { width: 92%; top: 20px; left: 4%; transform: none; } }
    `;

    GM_addStyle(panelCSS);

    /**
     * Create settings panel element using DOM manipulation
     * @returns {HTMLElement} Panel element
     */
    function createPanelElement() {
        const panel = document.createElement('div');
        panel.id = 'ytdf-panel';

        // Header
        const header = document.createElement('div');
        header.className = 'ytdf-header';

        const h1 = document.createElement('h1');
        h1.dataset.langKey = 'panelTitle';
        h1.textContent = currentStrings.panelTitle;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'ytdf-buttons';

        const resetButton = document.createElement('button');
        resetButton.className = 'ytdf-button ytdf-secondary';
        resetButton.id = 'ytdf-reset-btn';
        resetButton.dataset.langKey = 'resetBtn';
        resetButton.textContent = currentStrings.resetBtn;

        const saveButton = document.createElement('button');
        saveButton.className = 'ytdf-button';
        saveButton.id = 'ytdf-save-btn';
        saveButton.dataset.langKey = 'saveBtn';
        saveButton.textContent = currentStrings.saveBtn;

        buttonsDiv.appendChild(resetButton);
        buttonsDiv.appendChild(saveButton);
        header.appendChild(h1);
        header.appendChild(buttonsDiv);
        panel.appendChild(header);

        // Container
        const container = document.createElement('div');
        container.className = 'ytdf-container';

        // Language Section (removed - English only)
        // Switches Section
        const switchesSection = document.createElement('div');
        switchesSection.className = 'ytdf-section ytdf-switches';

        const switchRow = document.createElement('div');
        switchRow.className = 'ytdf-switch-row';

        const label = document.createElement('label');

        const toggleDiv = document.createElement('div');
        toggleDiv.className = 'ytdf-toggle';
        toggleDiv.dataset.key = 'prependDatesEnabled';
        toggleDiv.setAttribute('role', 'switch');
        toggleDiv.setAttribute('tabindex', '0');

        const knobDiv = document.createElement('div');
        knobDiv.className = 'ytdf-knob';
        toggleDiv.appendChild(knobDiv);

        const spanPrependDates = document.createElement('span');
        spanPrependDates.dataset.langKey = 'prependDatesLabel';
        spanPrependDates.textContent = currentStrings.prependDatesLabel;

        const helpDiv = document.createElement('div');
        helpDiv.className = 'ytdf-help';
        helpDiv.dataset.langKey = 'prependDatesHelp';
        helpDiv.dataset.desc = currentStrings.prependDatesHelp;
        helpDiv.textContent = '❓';

        label.appendChild(toggleDiv);
        label.appendChild(spanPrependDates);
        label.appendChild(helpDiv);
        switchRow.appendChild(label);
        switchesSection.appendChild(switchRow);

        // Strings Basic Section
        const stringsBasicSection = document.createElement('div');
        stringsBasicSection.className = 'ytdf-section ytdf-strings-basic';

        const footerNoteBasic = document.createElement('div');
        footerNoteBasic.className = 'ytdf-footer-note';
        footerNoteBasic.dataset.langKey = 'stringsFooterBasic';
        footerNoteBasic.textContent = currentStrings.stringsFooterBasic;
        stringsBasicSection.appendChild(footerNoteBasic);

        // Create string input rows
        const basicInputs = [
            { key: 'dateFormat', example: 'yyyy-MM-dd' },
            { key: 'oldUploadKeywords', example: 'day week month year' }
        ];

        basicInputs.forEach(({ key, example }) => {
            const row = createStringInputRow(key, example);
            stringsBasicSection.appendChild(row);
        });

        // Strings I18n Section
        const stringsI18nSection = document.createElement('div');
        stringsI18nSection.className = 'ytdf-section ytdf-strings-i18n';

        const footerNoteI18n = document.createElement('div');
        footerNoteI18n.className = 'ytdf-footer-note';
        footerNoteI18n.dataset.langKey = 'stringsFooterI18n';
        footerNoteI18n.textContent = currentStrings.stringsFooterI18n;
        stringsI18nSection.appendChild(footerNoteI18n);

        const i18nInputs = [
            { key: 'dateTimeKeywords', example: 'second minute hour day week month year' },
            { key: 'agoKeywords', example: 'ago' },
            { key: 'monthNames', example: 'JAN FEB MAR APR MAY JUN JUL AUG SEP OCT NOV DEC' },
            { key: 'dayNames', example: 'Sun Mon Tue Wed Thu Fri Sat' }
        ];

        i18nInputs.forEach(({ key, example }) => {
            const row = createStringInputRow(key, example);
            stringsI18nSection.appendChild(row);
        });

        container.appendChild(switchesSection);
        container.appendChild(stringsBasicSection);
        container.appendChild(stringsI18nSection);
        panel.appendChild(container);

        return panel;
    }

    /**
     * Create a string input row for settings
     * @param {string} key - Setting key
     * @param {string} example - Example value
     * @returns {HTMLElement} Row element
     */
    function createStringInputRow(key, example) {
        const row = document.createElement('div');
        row.className = 'ytdf-string-row';
        row.dataset.key = key;

        const labelHelp = document.createElement('div');
        labelHelp.className = 'ytdf-string-label-help';

        const label = document.createElement('div');
        label.className = 'ytdf-string-label';
        label.dataset.langKey = `${key}Label`;
        label.textContent = currentStrings[`${key}Label`] || key;

        const help = document.createElement('div');
        help.className = 'ytdf-help';
        help.dataset.langKey = `${key}Help`;
        help.dataset.example = example;
        help.dataset.desc = currentStrings[`${key}Help`] || '';
        help.textContent = '❓';

        labelHelp.appendChild(label);
        labelHelp.appendChild(help);

        const inputDiv = document.createElement('div');
        inputDiv.className = 'ytdf-string-input';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `ytdf-${key}`;
        input.placeholder = currentStrings.inputPlaceholder;

        inputDiv.appendChild(input);
        row.appendChild(labelHelp);
        row.appendChild(inputDiv);

        return row;
    }

    const panelElement = createPanelElement();
    document.body.appendChild(panelElement);

    // ===== Settings UI Logic =====

    /**
     * Save settings to storage
     * @param {object} obj - Settings object
     */
    function saveSettings(obj) {
        GM_setValue("basic", obj);
    }

    /**
     * Set toggle state
     * @param {HTMLElement} el - Toggle element
     * @param {boolean} value - Toggle state
     */
    function setToggle(el, value) {
        el.classList.toggle('ytdf-on', !!value);
        el.setAttribute('aria-checked', !!value);
    }

    /**
     * Apply settings to UI elements
     * @param {object} settings - Settings object
     */
    function applySettingsToUI(settings) {
        const arrayToStr = (array) => Array.isArray(array) ? array.join(' ') : '';

        setToggle(document.querySelector('.ytdf-toggle[data-key="prependDatesEnabled"]'), settings.prependDatesEnabled);
        document.getElementById('ytdf-dateFormat').value = settings.dateFormat || '';
        document.getElementById('ytdf-oldUploadKeywords').value = arrayToStr(settings.oldUploadKeywords);
        document.getElementById('ytdf-dateTimeKeywords').value = arrayToStr(settings.dateTimeKeywords);
        document.getElementById('ytdf-agoKeywords').value = arrayToStr(settings.agoKeywords);
        document.getElementById('ytdf-monthNames').value = arrayToStr(settings.monthNames);
        document.getElementById('ytdf-dayNames').value = arrayToStr(settings.dayNames);
    }

    /**
     * Read settings from UI elements
     * @returns {object} Settings object
     */
    function readUIToSettings() {
        const stringToArray = (str) => str.split(' ').filter(Boolean);

        return {
            prependDatesEnabled: document.querySelector('.ytdf-toggle[data-key="prependDatesEnabled"]').classList.contains('ytdf-on'),
            dateFormat: document.getElementById('ytdf-dateFormat').value,
            oldUploadKeywords: stringToArray(document.getElementById('ytdf-oldUploadKeywords').value),
            dateTimeKeywords: stringToArray(document.getElementById('ytdf-dateTimeKeywords').value),
            agoKeywords: stringToArray(document.getElementById('ytdf-agoKeywords').value),
            monthNames: stringToArray(document.getElementById('ytdf-monthNames').value),
            dayNames: stringToArray(document.getElementById('ytdf-dayNames').value),
        };
    }

    /**
     * Attach toggle event handlers
     */
    function attachToggleHandlers() {
        document.querySelectorAll('.ytdf-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const newState = !toggle.classList.contains('ytdf-on');
                setToggle(toggle, newState);
            });

            toggle.addEventListener('keydown', (ev) => {
                if (ev.key === ' ' || ev.key === 'Enter') {
                    ev.preventDefault();
                    toggle.click();
                }
            });
        });
    }

    /**
     * Attach help icon event handlers
     */
    function attachHelpHandlers() {
        document.querySelectorAll('.ytdf-string-row, .ytdf-switch-row').forEach(row => {
            const help = row.querySelector('.ytdf-help');
            if (!help) return;

            const example = help.dataset.example || '';
            const desc = help.dataset.desc || '';
            const key = row.dataset.key;

            if (!key) {
                help.setAttribute('title', desc);
                return;
            }

            const titleText = currentStrings.helpTooltip
                .replace('{desc}', desc)
                .replace('{example}', example);
            help.setAttribute('title', titleText);

            if (example) {
                help.addEventListener('click', () => {
                    const input = document.getElementById('ytdf-' + key);
                    if (input) {
                        input.value = example;
                        input.focus();
                    }
                });
            }
        });
    }

    /**
     * Show settings panel
     */
    function showPanel() {
        if (panelElement) panelElement.style.display = 'block';
    }

    /**
     * Hide settings panel
     */
    function hidePanel() {
        if (panelElement) panelElement.style.display = 'none';
    }

    // Register menu command
    GM_registerMenuCommand(currentStrings.menuTitle, showPanel);

    // Close panel on Escape key
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') hidePanel();
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (panelElement.style.display === 'block' &&
            !panelElement.contains(e.target) &&
            !e.target.closest('.GM-style-mt')) {
            hidePanel();
        }
    }, true);

    // Save button handler
    document.getElementById('ytdf-save-btn').addEventListener('click', () => {
        saveSettings(readUIToSettings());
        alert(currentStrings.alertSaved);
    });

    // Reset button handler
    document.getElementById('ytdf-reset-btn').addEventListener('click', () => {
        if (!confirm(currentStrings.confirmReset)) return;

        const settingsToSave = {};
        saveSettings(settingsToSave);
        alert(currentStrings.alertSaved);
        applySettingsToUI(settingsToSave);
    });

    // Initialize UI
    try {
        applySettingsToUI(SETTINGS);
        attachToggleHandlers();
        attachHelpHandlers();
    } catch (e) {
        console.error('[YouTube Date Formatter] Error initializing UI:', e);
    }

})();