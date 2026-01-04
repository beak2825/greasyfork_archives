// ==UserScript==
// @name         Twitter/X: Block, Download & Not Interested
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Версия 1.8: Исправлен поиск видео. Бан ⛔, Не интересно 👎, Скачать 🎬.
// @author       Expert Dev & Gemini
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558607/TwitterX%3A%20Block%2C%20Download%20%20Not%20Interested.user.js
// @updateURL https://update.greasyfork.org/scripts/558607/TwitterX%3A%20Block%2C%20Download%20%20Not%20Interested.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === КОНФИГУРАЦИЯ ===
    const ICONS = {
        BLOCK: '⛔',
        SOFT_BAN: '👎',
        DOWNLOAD: '🎬',
        LOADING: '⏳',
        DONE: '✅',
        ERROR: '❌'
    };

    const KEYWORDS = {
        notInterested: ['не интересна', 'Not interested', 'не цікавить', 'No me interesa'],
        block: ['Внести', 'Block', 'Заблокувати', 'Bloquear']
    };

    const BTN_STYLE = `
        margin-right: 15px;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.7;
        transition: transform 0.1s, opacity 0.2s;
        border: none;
        background: transparent;
        padding: 4px;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        z-index: 10000;
        pointer-events: auto;
    `;

    // --- REACT UTILS ---
    function getReactProps(dom) {
        const key = Object.keys(dom).find(key => key.startsWith("__reactFiber"));
        return key ? dom[key] : null;
    }

    // Рекурсивный поиск данных твита
    function findTweetData(node, depth = 0) {
        if (!node || depth > 25) return null;
        const props = node.memoizedProps;
        if (props) {
            if (props.tweet) return props.tweet;
            if (props.data?.tweetResult?.result) return props.data.tweetResult.result;
            if (props.item?.itemContent?.tweet_results?.result) return props.item.itemContent.tweet_results.result;
        }
        return findTweetData(node.return, depth + 1);
    }

    // Умный поиск: ищем данные в самом посте, а если нет — в элементе времени
    function getCombinedTweetData(tweetNode) {
        // 1. Пробуем найти в основном узле
        let fiber = getReactProps(tweetNode);
        let data = findTweetData(fiber);

        if (data) return data;

        // 2. Если не нашли, ищем в <time> (часто данные спрятаны там)
        const timeNode = tweetNode.querySelector('time');
        if (timeNode) {
            fiber = getReactProps(timeNode);
            data = findTweetData(fiber);
        }

        return data;
    }

    function getMediaUrl(tweetRawData) {
        if (!tweetRawData) return null;
        const legacy = tweetRawData.legacy || (tweetRawData.tweet && tweetRawData.tweet.legacy) || tweetRawData;

        if (!legacy.extended_entities?.media) return null;

        const media = legacy.extended_entities.media.find(m => m.type === 'video' || m.type === 'animated_gif');
        if (!media) return null;

        const variants = media.video_info.variants;
        let best = null;
        let maxBr = -1;
        variants.forEach(v => {
            if (v.content_type === 'video/mp4' && v.bitrate > maxBr) {
                maxBr = v.bitrate;
                best = v.url;
            }
        });
        return best;
    }

    // --- ACTIONS ---
    async function handleDownload(url, btn) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = ICONS.LOADING;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = `twitter_video_${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            btn.innerHTML = ICONS.DONE;
            setTimeout(() => btn.innerHTML = ICONS.DOWNLOAD, 2000);
        } catch (e) {
            console.error("Download failed:", e);
            window.open(url, '_blank');
            btn.innerHTML = '↗️';
            setTimeout(() => btn.innerHTML = ICONS.DOWNLOAD, 2000);
        }
    }

    function findMenuOptionByText(actionType) {
        const items = document.querySelectorAll('[role="menuitem"]');
        const words = KEYWORDS[actionType];
        for (let item of items) {
            const text = item.innerText || item.textContent;
            if (words.some(word => text.includes(word))) {
                return item;
            }
        }
        return null;
    }

    async function clickMenuOption(tweetNode, btn, actionType) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = ICONS.LOADING;

        const testIdMap = { 'notInterested': 'notInterested', 'block': 'block' };

        try {
            const caret = tweetNode.querySelector('[data-testid="caret"]');
            if (!caret) throw new Error("Меню не найдено");
            caret.click();

            let attempts = 0;
            let option = null;

            while (attempts < 40) { // Ждем до 2 сек
                await new Promise(r => setTimeout(r, 50));
                option = document.querySelector(`[data-testid="${testIdMap[actionType]}"]`);
                if (!option) option = findMenuOptionByText(actionType);
                if (option) break;
                attempts++;
            }

            if (!option) {
                caret.click();
                throw new Error(`Пункт "${actionType}" не найден`);
            }

            option.click();

            if (actionType === 'block') {
                const getConfirm = () => document.querySelector('[data-testid="confirmationSheetConfirm"]');
                attempts = 0;
                while (!getConfirm() && attempts < 20) {
                    await new Promise(r => setTimeout(r, 50));
                    attempts++;
                }
                const confirm = getConfirm();
                if (confirm) confirm.click();
            }

            tweetNode.style.opacity = '0.15';
            tweetNode.style.filter = 'grayscale(100%)';
            tweetNode.style.pointerEvents = 'none';
            btn.innerHTML = ICONS.DONE;

        } catch (e) {
            console.error(`Action error:`, e);
            btn.innerHTML = ICONS.ERROR;
            setTimeout(() => btn.innerHTML = originalIcon, 2000);
        }
    }

    // --- UI INJECTION ---
    function injectButtons(tweetNode) {
        if (tweetNode.dataset.xToolsv18) return;

        const caretSvg = tweetNode.querySelector('[data-testid="caret"]');
        if (!caretSvg) return;

        const menuButton = caretSvg.closest('[role="button"]') || caretSvg.parentElement;
        if (!menuButton) return;

        const container = menuButton.parentElement;
        if (!container) return;

        // UI Fixes
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.overflow = 'visible';
        container.style.contain = 'none';

        const toolsDiv = document.createElement('div');
        toolsDiv.style.display = 'flex';
        toolsDiv.style.alignItems = 'center';

        // 1. 👎 Не интересно
        const btnSoft = document.createElement('button');
        btnSoft.innerHTML = ICONS.SOFT_BAN;
        btnSoft.title = "Не интересно";
        btnSoft.style.cssText = BTN_STYLE;
        btnSoft.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            clickMenuOption(tweetNode, btnSoft, 'notInterested');
        };
        toolsDiv.appendChild(btnSoft);

        // 2. ⛔ Бан
        const btnBlock = document.createElement('button');
        btnBlock.innerHTML = ICONS.BLOCK;
        btnBlock.title = "Блокировать";
        btnBlock.style.cssText = BTN_STYLE;
        btnBlock.onclick = (e) => {
            e.preventDefault(); e.stopPropagation();
            clickMenuOption(tweetNode, btnBlock, 'block');
        };
        toolsDiv.appendChild(btnBlock);

        // 3. 🎬 Скачать (Расширенный поиск)
        const tweetData = getCombinedTweetData(tweetNode);
        const videoUrl = getMediaUrl(tweetData);

        if (videoUrl) {
            const btnDl = document.createElement('button');
            btnDl.innerHTML = ICONS.DOWNLOAD;
            btnDl.title = "Скачать видео";
            btnDl.style.cssText = BTN_STYLE;
            btnDl.style.color = '#1d9bf0';
            btnDl.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                handleDownload(videoUrl, btnDl);
            };
            toolsDiv.appendChild(btnDl);
            // console.log("Video button injected:", videoUrl); // Раскомментировать для отладки
        }

        container.insertBefore(toolsDiv, menuButton);
        tweetNode.dataset.xToolsv18 = "true";
    }

    // --- OBSERVER ---
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const tweets = node.querySelectorAll('article[data-testid="tweet"]');
                    tweets.forEach(injectButtons);
                    if (node.matches && node.matches('article[data-testid="tweet"]')) {
                        injectButtons(node);
                    }
                }
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        document.querySelectorAll('article[data-testid="tweet"]').forEach(injectButtons);
    }, 1500);

})();